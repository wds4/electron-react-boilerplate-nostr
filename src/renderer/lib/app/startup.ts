
import { asyncSql } from "../../index.tsx";
import {nip19, generatePrivateKey, getPublicKey} from 'nostr-tools'

// may deprecate these
window.init = {};
window.init.initMyProfileData = false
window.init.initMiscGlobalVars = false
window.init.fetchProfilesInfo = false
window.init.grapevineSettings = false
window.init.fetchExtendedFollowingList = false;

window.relayForReplies = "wss://relay.damus.io";

export const fetchExtendedFollowingList = async () => {
    var aExtendedAuthors = [];
    var sql = ""
    sql += " SELECT * FROM followingNetwork WHERE id=1 "
    var aFollowingNetworkData = await asyncSql(sql);
    console.log("aFollowingNetworkData.length: "+aFollowingNetworkData.length)
    if (aFollowingNetworkData.length > 0) {
        const oFollowingNetworkData = aFollowingNetworkData[0]
        // console.log("oFollowingNetworkData.id: "+oFollowingNetworkData.id)
        aExtendedAuthors = Object.keys(JSON.parse(oFollowingNetworkData.pubkeys))
        window.aExtendedAuthors = aExtendedAuthors
        window.init.fetchExtendedFollowingList = true;
        return aExtendedAuthors;
    } else {
        window.aExtendedAuthors = aExtendedAuthors
        window.init.fetchExtendedFollowingList = true;
        return aExtendedAuthors;
    }
    window.aExtendedAuthors = aExtendedAuthors
    window.init.fetchExtendedFollowingList = true;
    return aExtendedAuthors;
}

export const generateNewKeys = async () => {
    let sk = generatePrivateKey() // `sk` is a hex string
    let pk = getPublicKey(sk) // `pk` is a hex string
    const currentTime = dateToUnix(new Date())
    console.log("sk: "+sk)
    console.log("pk: "+pk)

    var sql = "";
    sql += "INSERT OR IGNORE INTO myProfile (pubkey, privkey, active, created_at) VALUES ('"+pk+"', '"+sk+"', true, "+currentTime+") ";

    var result = await asyncSql(sql);
    console.log("result: "+JSON.stringify(result,null,4))

    return [sk,pk]
}

export const initMyProfileData = async () => {
    window.myProfile = {};
    window.myProfile.following = [];
    var sql = ""
    sql += "SELECT * FROM myProfile WHERE active=true"
    // console.log("======================================= fetchMyData sql: "+sql)
    var aMyProfileData = await asyncSql(sql);
    if (aMyProfileData.length > 0) {
        var oMyProfileData = aMyProfileData[0]
        var myPk = oMyProfileData.pubkey;
        var myPictureUrl = oMyProfileData.picture_url;
        var myName = oMyProfileData.name;
        var aboutMe = oMyProfileData.about;
        var myDisplayName = oMyProfileData.display_name;
        var sMyFollowingList = oMyProfileData.following;
        if (!sMyFollowingList) { sMyFollowingList = "[]"; }
        var aMyFollowingList = JSON.parse(sMyFollowingList)
        // console.log("======================================= initMyProfileData; myPk: "+myPk)
        window.myProfile = {};
        window.myProfile.pubkey = myPk;
        window.myProfile.name = myName;
        window.myProfile.about = myName;
        window.myProfile.display_name = myDisplayName;
        window.myProfile.picture_url = myPictureUrl;
        window.myProfile.following = aMyFollowingList;

        window.myPubkey = myPk;
    }
    window.init.initMyProfileData = true;
}

export const initMiscGlobalVars = () => {
    // FUTURE: use tool such as redux rather than store vars in the DOM
    window.mainFeed = {}
    window.mainFeed.type = "following"
    window.init.initMiscGlobalVars = true;
    /*
    firehose: show messages from all users
    following: show messages from users you follow
    FUTURE: custom filters using the grapevine
    */

    // nostrFollowGrapevine page
    window.nfg = {};
    window.nfg.seed = null;
    window.nfg.pubkeys = {};
    window.nfg.updatingVisData = false;
}

export const fetchProfilesInfo = async () => {
   var aProfileInfo = [];
   window.profiles = {}

   var sql = ""
   sql += "SELECT * FROM nostrProfiles "

   var aNostrProfilesData = await asyncSql(sql);
   console.log("=========== aNostrProfilesData.length: "+aNostrProfilesData.length)
   // console.log("=========== aNostrProfilesData: "+JSON.stringify(aNostrProfilesData,null,4))
   for (var n=0;n<aNostrProfilesData.length;n++) {
        var oNextProfileInfo = aNostrProfilesData[n];
        var pK = oNextProfileInfo.pubkey;
        var event = oNextProfileInfo.event;
        var name = oNextProfileInfo.name;
        var picture_url = oNextProfileInfo.picture_url;
        aProfileInfo[pK] = {};
        if (name) {
            aProfileInfo[pK].name = name;
        } else {
            aProfileInfo[pK].name = "..."+pK.slice(-6);
        }
        if (picture_url) {
            aProfileInfo[pK].picture_url = picture_url;
        } else {
            aProfileInfo[pK].picture_url = null;
        }
        window.profiles[pK] = JSON.parse(event);
   }

   var sql = ""
   sql += " SELECT * FROM followingNetwork WHERE id=1 "
   var aFollowingNetworkData = await asyncSql(sql);
   console.log("fetchProfilesInfo; aFollowingNetworkData.length: "+aFollowingNetworkData.length)
   if (aFollowingNetworkData.length > 0) {
       var oFollowingNetworkData = aFollowingNetworkData[0]
       var oPubkeys = JSON.parse(oFollowingNetworkData.pubkeys)
       var aExtendedAuthors = Object.keys(oPubkeys)
       console.log("fetchProfilesInfo; aExtendedAuthors.length: "+aExtendedAuthors.length)
       for (var a=0;a<aExtendedAuthors.length;a++) {
          var pK = aExtendedAuthors[a];
          // console.log("fetchProfilesInfo; a: "+a+"; pK: "+pK)
          // console.log("fetchProfilesInfo; a: "+a+"; oPubkeys[pK: "+JSON.stringify(oPubkeys[pK],null,4))
          var name = oPubkeys[pK].profileData.name;
          var display_name = oPubkeys[pK].profileData.display_name;
          var picture_url = oPubkeys[pK].profileData.picture_url;
          window.profiles[pK] = {};
          window.profiles[pK].name = name;
          window.profiles[pK].display_name = display_name;
          window.profiles[pK].picture_url = picture_url;
          // console.log("fetchProfilesInfo; a: "+a+"; name: "+name)
       }
   }

   window.init.fetchProfilesInfo = true;
   return aProfileInfo;
}

export const setGrapevineDefaults = () => {
    window.grapevineSettings = {};

    window.grapevineSettings.active = false;
    window.grapevineSettings.showHeader = false;
    window.grapevineSettings.contexts = false;

    window.grapevineSettings.worship = {};
    window.grapevineSettings.worship.active = true;
    window.grapevineSettings.worship.up = true;
    window.grapevineSettings.worship.down = false;
    window.grapevineSettings.worship.contexts = false;

    window.grapevineSettings.attention = {};
    window.grapevineSettings.attention.active = true;
    window.grapevineSettings.attention.up = true;
    window.grapevineSettings.attention.down = false;
    window.grapevineSettings.attention.contexts = false;

    window.grapevineSettings.believe = {};
    window.grapevineSettings.believe.active = false;
    window.grapevineSettings.believe.up = true;
    window.grapevineSettings.believe.down = false;
    window.grapevineSettings.believe.contexts = false;

    window.grapevineSettings.nostr = {};
    window.grapevineSettings.nostr.active = true;
    window.grapevineSettings.nostr.up = true;
    window.grapevineSettings.nostr.down = false;
    window.grapevineSettings.nostr.contexts = false;

    window.grapevineSettings.ontology = {};
    window.grapevineSettings.ontology.active = false;
    window.grapevineSettings.ontology.up = false;
    window.grapevineSettings.ontology.down = false;
    window.grapevineSettings.ontology.contexts = false;

    window.grapevineSettings.advice = {};
    window.grapevineSettings.advice.active = false;
    window.grapevineSettings.advice.up = false;
    window.grapevineSettings.advice.down = false;
    window.grapevineSettings.advice.contexts = false;

    window.init.grapevineSettings = true;
}

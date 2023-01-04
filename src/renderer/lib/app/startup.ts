
import { asyncSql } from "../../index.tsx";

// may deprecate these
window.init = {};
window.init.initMyProfileData = false
window.init.initMiscGlobalVars = false
window.init.fetchProfilesInfo = false

window.relayForReplies = "wss://relay.damus.io";

export const initMyProfileData = async () => {
    window.myProfile = {};
    window.myProfile.following = [];
    var sql = ""
    sql += "SELECT * FROM myProfile WHERE id=1"
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
    window.mainFeed = {}
    window.mainFeed.type = "following"
    window.init.initMiscGlobalVars = true;
    /*
    firehose: show messages from all users
    following: show messages from users you follow
    FUTURE: custom filters using the grapevine
    */
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
   window.init.fetchProfilesInfo = true;
   return aProfileInfo;
}

import React from 'react';
import * as MiscAppFxns from "../../../lib/app/misc.ts";
import * as StartupFxns from "../../../lib/app/startup.ts";
import {nip19, generatePrivateKey, getPublicKey} from 'nostr-tools'

import {
    dateToUnix,
} from "@nostrgg/react";

const jQuery = require("jquery");

const fetchMySk = MiscAppFxns.fetchMySk; // privkey
const fetchMyPk = MiscAppFxns.fetchMyPk; // pubkey
const initMyProfileData = StartupFxns.initMyProfileData;
const populateFullListOfKeys = async () => {
    var sql = "";
    sql += "SELECT * FROM myProfile ";
    var aMyProfileData = await asyncSql(sql);

    jQuery("#fullListOfKeysContainer").html("")

    for (var p=0;p<aMyProfileData.length;p++) {
        var oNextMyProfileData = aMyProfileData[p]

        var nextId = oNextMyProfileData.id;
        var nextPrivkey = oNextMyProfileData.privkey;
        var nextPubkey_hex = oNextMyProfileData.pubkey;
        var nextPubkey_bech32 = nip19.npubEncode(nextPubkey_hex)
        var nextName = oNextMyProfileData.name;
        var nextDisplayName = oNextMyProfileData.display_name;
        var nextAbout = oNextMyProfileData.about;
        var picture_url = oNextMyProfileData.picture_url;
        var active = oNextMyProfileData.active;

        var singleProfileDataContainerClassName = "singleProfileDataContainer singleProfileDataContainer_inactive";
        if (active) { singleProfileDataContainerClassName = "singleProfileDataContainer singleProfileDataContainer_active"; }

        var nextSetHTML = "";
        nextSetHTML += "<div id='singleProfileDataContainer_"+nextId+"' class='"+singleProfileDataContainerClassName+"' >";

            nextSetHTML += "<div style='position:absolute;top:5px;right:5px;width:120px;' >";
                nextSetHTML += "<div class='deleteFirstTryButton doSomethingButton_small' data-sqlid='"+nextId+"' >";
                    nextSetHTML += " DELETE ";
                nextSetHTML += "</div>";
                nextSetHTML += "<br>";
                nextSetHTML += "Delete this profile, including keys, from local storage.";
                nextSetHTML += "<br>";
                nextSetHTML += "This cannot be undone!";
                nextSetHTML += "<br><br>";
                nextSetHTML += "<div style='display:none;' id='finalChanceDeleteContainer_"+nextId+"' >";
                    nextSetHTML += "Are you sure???";
                    nextSetHTML += "<br>";
                    nextSetHTML += "<div class='deleteLastChanceButton doSomethingButton_small' data-sqlid='"+nextId+"' >";
                        nextSetHTML += " YES, DELETE! ";
                    nextSetHTML += "</div>";
                    nextSetHTML += "<div id='deletedNoticeContainer_"+nextId+"' ></div>";
                nextSetHTML += "</div >";
            nextSetHTML += "</div>";

            nextSetHTML += "<div style='width:5%;display:inline-block'>";
                nextSetHTML += "<input type='radio' class='activeProfileRadioButton' name='myActiveProfile' ";
                nextSetHTML += " data-sqlid='"+nextId+"' ";
                nextSetHTML += " data-pubkey='"+nextPubkey_hex+"' ";
                if (active) { nextSetHTML += " checked=true "; }
                nextSetHTML += " />";
            nextSetHTML += "</div>";

            nextSetHTML += "<div style='width:80%;display:inline-block'>";
                nextSetHTML += "<div style='margin-bottom:5px;' >";
                    nextSetHTML += "<div style='color:grey;' >pubkey (hex):</div>";
                    nextSetHTML += nextPubkey_hex;
                nextSetHTML += "</div>";

                nextSetHTML += "<div style='margin-bottom:5px;' >";
                    nextSetHTML += "<div style='color:grey;' >pubkey (bech32):</div>";
                    nextSetHTML += nextPubkey_bech32;
                nextSetHTML += "</div>";

                nextSetHTML += "<div style='margin-bottom:5px;' >";
                    nextSetHTML += "<div style='color:grey;' >display name:</div>";
                    nextSetHTML += nextDisplayName;
                nextSetHTML += "</div>";

                nextSetHTML += "<div style='margin-bottom:5px;' >";
                    nextSetHTML += "<div style='color:grey;' >name:</div>";
                    nextSetHTML += "@"+nextName;
                nextSetHTML += "</div>";

                nextSetHTML += "<div class='showPrivkeyButton doSomethingButton' data-sqlid='"+nextId+"' >";
                    nextSetHTML += "Show privkey (caution!)";
                nextSetHTML += "</div>";

                nextSetHTML += "<div id='privkeyContainer1_"+nextId+"' style='border:1px solid black;padding:8px;margin-bottom:5px;height:40px;font-size:18px;' >";
                    nextSetHTML += "privkey (hidden)";
                nextSetHTML += "</div>";

                nextSetHTML += "<div id='privkeyContainer2_"+nextId+"' style='border:1px solid black;padding:5px;margin-bottom:5px;height:40px;display:none;' >";
                    nextSetHTML += "<div style='color:grey;' >privkey:</div>";
                    nextSetHTML += nextPrivkey;
                nextSetHTML += "</div>";
            nextSetHTML += "</div>";
        nextSetHTML += "</div>";

        jQuery("#fullListOfKeysContainer").append(nextSetHTML)
    }
    jQuery(".activeProfileRadioButton").off().change(async function(){
        var newActiveProfileSqlId = jQuery('input[name=myActiveProfile]:checked').data("sqlid")
        var newActivePubkey = jQuery('input[name=myActiveProfile]:checked').data("pubkey");
        // window.myPubkey = newActivePubkey;

        console.log("activeProfileRadioButton changed; newActiveProfileSqlId: "+newActiveProfileSqlId)
        var sql = "";
        sql += "UPDATE myProfile SET active=false ";
        var aMyProfileData = await asyncSql(sql);

        var sql = "";
        sql += "UPDATE myProfile SET active=true WHERE id="+newActiveProfileSqlId+" ";
        var aMyProfileData = await asyncSql(sql);

        await initMyProfileData();

        jQuery(".singleProfileDataContainer").addClass("singleProfileDataContainer_inactive")
        jQuery(".singleProfileDataContainer").removeClass("singleProfileDataContainer_active")

        jQuery("#singleProfileDataContainer_"+newActiveProfileSqlId).addClass("singleProfileDataContainer_active")
        jQuery("#singleProfileDataContainer_"+newActiveProfileSqlId).removeClass("singleProfileDataContainer_inactive")
    })
    jQuery(".deleteFirstTryButton").off().click(async function(){
        var sqlId = jQuery(this).data("sqlid")
        jQuery("#finalChanceDeleteContainer_"+sqlId).css("display","block")
    })
    jQuery(".deleteLastChanceButton").off().click(async function(){
        var sqlId = jQuery(this).data("sqlid")
        console.log("deleteLastChanceButton; sqlId: "+sqlId)
        jQuery("#singleProfileDataContainer_"+sqlId).css("background-color","red")
        jQuery("#deletedNoticeContainer_"+sqlId).html("Deleted!")

        var sql = "";
        sql += "DELETE FROM myProfile WHERE id="+sqlId+" ";
        var result = await asyncSql(sql);
    })
    jQuery(".showPrivkeyButton").off().click(async function(){
        var sqlId = jQuery(this).data("sqlid")
        console.log("showPrivkeyButton; sqlId: "+sqlId)
        jQuery("#privkeyContainer1_"+sqlId).css("display","none")
        jQuery("#privkeyContainer2_"+sqlId).css("display","block")
    })
}
export default class PkSettings extends React.Component {

    async componentDidMount() {
        const pk = await fetchMyPk();
        var npub = nip19.npubEncode(pk)
        await populateFullListOfKeys()
        jQuery("#pkHexActiveContainer").html(pk)
        jQuery("#pkBech32ActiveContainer").html(npub)
        jQuery("#showActivePrivkeyButton").click(async function(){
            const sk = await fetchMySk();
            jQuery("#privkeyActiveShownElem").html(sk)
            jQuery("#privkeyActiveHiddenElem").css("display","none")
            jQuery("#privkeyActiveShownElem").css("display","block")
        })
        jQuery("#generateNewKeysButton").click(function(){
            let sk_new = generatePrivateKey() // `sk` is a hex string
            let pk_new = getPublicKey(sk_new) // `pk` is a hex string
            var npub_new = nip19.npubEncode(pk_new)
            jQuery("#privkeyNewShownElem").html(sk_new)
            jQuery("#pkHexNewContainer").html(pk_new)
            jQuery("#pkBech32NewContainer").html(npub_new)
            jQuery("#newKeysContainer").css("display","block")
            jQuery("#savedKeysMessageContainer").html("")
        })
        jQuery("#showNewPrivkeyButton").click(async function(){
            jQuery("#privkeyNewHiddenElem").css("display","none")
            jQuery("#privkeyNewShownElem").css("display","block")
        })
        jQuery("#saveNewKeysButton").click(async function(){
            var sk_new = jQuery("#privkeyNewShownElem").html()
            var pk_new = jQuery("#pkHexNewContainer").html()
            var currentTime = dateToUnix(new Date())
            var sql = "";
            sql += "INSERT OR IGNORE INTO myProfile (pubkey, privkey, created_at) VALUES ('"+pk_new+"', '"+sk_new+"', "+currentTime+") ";

            var result = await asyncSql(sql);
            console.log("result: "+JSON.stringify(result,null,4))
            jQuery("#savedKeysMessageContainer").html("Keys have been saved.")
        })

        jQuery("#outsidePubkeyHex").change(function(){
            var pk_hex = jQuery(this).val()
            var pk_bech32 = nip19.npubEncode(pk_hex)
            jQuery("#outsidePubkeyBech32").val(pk_bech32)
        })
        jQuery("#outsidePubkeyBech32").change(function(){
          var pk_beck32 = jQuery(this).val()
          var pk_hex = nip19.decode(pk_beck32).data
          jQuery("#outsidePubkeyHex").val(pk_hex)
        })
        jQuery("#saveKeysGeneratedElsewhereButton").click(async function(){
            var sk_out = jQuery("#outsidePrivkey").val()
            var pk_out = jQuery("#outsidePubkeyHex").val()
            var currentTime = dateToUnix(new Date())
            var sql = "";
            sql += "INSERT OR IGNORE INTO myProfile (pubkey, privkey, created_at) VALUES ('"+pk_out+"', '"+sk_out+"', "+currentTime+") ";

            var result = await asyncSql(sql);
            console.log("result: "+JSON.stringify(result,null,4))
            jQuery("#savedKeysGeneratedElsewhereMessageContainer").html("Keys have been saved.")
        })
    }
    render() {
        return (
            <>
                <div style={{border:"1px solid grey",padding:"10px",marginBottom:"10px",width:"650px",backgroundColor:"yellow"}} >
                CAUTION: This app is still in the early alpha phase. Keys are not yet salted or password protected. You should assume that security risks are high!
                </div>

                <div style={{border:"1px solid grey",padding:"10px",marginBottom:"10px",width:"650px",display:"none"}} >
                    <div className="h4" >Current (active) keys</div>
                    <br/>
                    <div style={{marginBottom:"10px"}} >
                        my active pubkey (hex): <span id="pkHexActiveContainer" ></span><br/>
                        my active pubkey (bech32): <span id="pkBech32ActiveContainer" ></span>
                    </div>
                    <div style={{marginBottom:"10px"}} >
                        <div id="showActivePrivkeyButton" className="doSomethingButton" >
                        Show active privkey (caution!)
                        </div>

                        <div id="privkeyActiveHiddenElem"
                            style={{border:"1px solid black",width:"450px",height:"40px",padding:"10px"}}
                        >
                        privkey (hidden)
                        </div>
                        <div id="privkeyActiveShownElem"
                            style={{border:"1px solid black",width:"450px",height:"40px",padding:"10px",display:"none"}}
                        >
                        privkey (shown)
                        </div>
                    </div>
                </div>

                <div style={{border:"1px solid grey",padding:"10px",marginBottom:"10px",width:"650px"}} >
                    <div className="h4" >All Profiles</div>
                    <br/>
                    <div id="fullListOfKeysContainer" ></div>
                </div>

                <div style={{border:"1px solid grey",padding:"10px",marginBottom:"10px",width:"650px"}} >
                    <div className="h4" >Generate a new set of keys</div>
                    <br/>
                    <div id="generateNewKeysButton" className="doSomethingButton" >
                    generate new keys
                    </div>

                    <div id="newKeysContainer" style={{display:"none"}} >
                        <div style={{marginBottom:"10px"}} >
                            new pubkey (hex): <span id="pkHexNewContainer" ></span><br/>
                            new pubkey (bech32): <span id="pkBech32NewContainer" ></span>
                        </div>
                        <div style={{marginBottom:"10px"}} >
                            <div id="showNewPrivkeyButton" className="doSomethingButton" >
                            Show new privkey (caution!)
                            </div>
                            <div id="privkeyNewHiddenElem"
                                style={{border:"1px solid black",width:"450px",height:"40px",padding:"10px"}}
                            >
                            new privkey (hidden)
                            </div>
                            <div id="privkeyNewShownElem"
                                style={{border:"1px solid black",width:"450px",height:"40px",padding:"10px",display:"none"}}
                            >
                            new privkey (shown)
                            </div>
                        </div>
                        <div id="saveNewKeysButton" className="doSomethingButton" >
                        Save new keys in sql
                        </div>

                        <div id="savedKeysMessageContainer" ></div>
                    </div>
                </div>

                <div style={{border:"1px solid grey",padding:"10px",marginBottom:"10px",width:"650px"}} >
                    <div className="h4" >Enter keys generated elsewhere</div>
                    <br/>

                    <div id="newKeysContainer" >
                        <div style={{marginBottom:"10px"}} >
                            <div style={{}} >
                                pubkey (hex):
                            </div>
                            <textarea id="outsidePubkeyHex" style={{width:"90%",height:"40px"}} >
                            </textarea>
                            <div style={{}} >
                                pubkey (bech32):
                            </div>
                            <textarea id="outsidePubkeyBech32" style={{width:"90%",height:"40px"}} >
                            </textarea>
                            <div style={{}} >
                                privkey:
                            </div>
                            <textarea id="outsidePrivkey" style={{width:"90%",height:"40px"}} >
                            </textarea>
                        </div>
                        <div id="saveKeysGeneratedElsewhereButton" className="doSomethingButton" >
                        Save these keys in sql
                        </div>

                        <div id="savedKeysGeneratedElsewhereMessageContainer" ></div>
                    </div>
                </div>
            </>
        );
    }
}

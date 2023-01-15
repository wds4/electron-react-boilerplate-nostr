import React from 'react';
import Masthead from '../../mastheads/mainMasthead.js';
import LeftNavbar from '../../navbars/leftNav.js';
import * as MiscAppFxns from "../../lib/app/misc.ts";
import { useNostr, dateToUnix } from "nostr-react";
import {
    type Event as NostrEvent,
    getEventHash,
    getPublicKey,
    signEvent,
} from "nostr-tools";

import { asyncSql } from "../../index.tsx";

import {
    dateToUnix,
} from "@nostrgg/react";

const fetchMySk = MiscAppFxns.fetchMySk

const updateMainColWidth = MiscAppFxns.updateMainColWidth;

const jQuery = require("jquery");

const populateMyProfileInfo = async () => {
    var sql = ""
    sql += "SELECT * FROM myProfile WHERE id=1"
    var aMyProfileData = await asyncSql(sql);

    if (aMyProfileData.length==0) {
        const [sk,pk] = await generateMyKeys();
        var aMyProfileData = await asyncSql(sql);
    }

    if (aMyProfileData.length > 0) {
        var oMyProfileData = aMyProfileData[0]

        var myPubkey = oMyProfileData.pubkey;
        var myName = oMyProfileData.name;
        var displayName = oMyProfileData.display_name;
        var myAbout = oMyProfileData.about;
        var picture_url = oMyProfileData.picture_url;

        var website = oMyProfileData.website;
        var ln_url = oMyProfileData.ln_url;
        var nip05_verification = oMyProfileData.nip05_verification;

        jQuery("#nameContainer").val(myName)
        jQuery("#displayNameContainer").val(displayName)
        jQuery("#profilePictureUrlContainer").val(picture_url)

        jQuery("#websiteContainer").val(website)
        jQuery("#aboutMeContainer").val(myAbout)
        jQuery("#btcLightningTipsContainer").val(ln_url)
        jQuery("#nip05VerificationContainer").val(nip05_verification)
    }

    console.log("oMyProfileData: "+JSON.stringify(oMyProfileData,null,4))
}

function PublishProfile() {
    const { publish } = useNostr();

    const onPost = async () => {
        await updateProfileInSql();

        const privKey = await fetchMySk();

        if (!privKey) {
          alert("no private key provided");
          return;
        }

        const name = jQuery("#nameContainer").val()
        const display_name = jQuery("#displayNameContainer").val()
        const profilePictureUrl = jQuery("#profilePictureUrlContainer").val()
        const website = jQuery("#websiteContainer").val()
        const about = jQuery("#aboutMeContainer").val()
        const btcLightningTips = jQuery("#btcLightningTipsContainer").val()
        const nip05Verification = jQuery("#nip05VerificationContainer").val()

        var oProfileInfo = {}

        if (name) { oProfileInfo.name = name; }
        if (display_name) { oProfileInfo.display_name = display_name; }
        if (about) { oProfileInfo.about = about; }
        if (profilePictureUrl) { oProfileInfo.picture = profilePictureUrl; }
        if (website) { oProfileInfo.website = website; }
        if (btcLightningTips) { oProfileInfo.lud06 = btcLightningTips; }
        if (nip05Verification) { oProfileInfo.nip05 = nip05Verification; }

        var sProfileInfo = JSON.stringify(oProfileInfo)
        const event: NostrEvent = {
            content: sProfileInfo,
            kind: 0,
            tags: [],
            created_at: dateToUnix(),
            pubkey: getPublicKey(privKey),
        };

        event.id = getEventHash(event);
        event.sig = signEvent(event, privKey);

        jQuery("#newEventContainer").html(JSON.stringify(event,null,4))
        publish(event);
        jQuery("#successMessageContainer").html("You profile settings have been saved locally & submitted to the nostr network.")
    };

    return (
        <div style={{marginBottom:"10px"}} >
            <div onClick={onPost} className="doSomethingButton" >Save & Submit your profile!</div>
            <div id="newEventContainer" className="newEventContainer" style={{display:"none"}} >newEventContainer</div>
        </div>
    );
}

const updateProfileInSql = async () => {
    const name = jQuery("#nameContainer").val()
    const display_name = jQuery("#displayNameContainer").val()
    const profilePictureUrl = jQuery("#profilePictureUrlContainer").val()
    const website = jQuery("#websiteContainer").val()
    const aboutMe = jQuery("#aboutMeContainer").val()
    const btcLightningTips = jQuery("#btcLightningTipsContainer").val()
    const nip05Verification = jQuery("#nip05VerificationContainer").val()
    const currentTime = dateToUnix(new Date())

    var sql = "";
    sql += " UPDATE myProfile "
    sql += " SET name = '"+name+"' ";
    sql += " , display_name = '"+display_name+"' ";
    sql += " , picture_url = '"+profilePictureUrl+"' ";
    sql += " , website = '"+website+"' ";
    sql += " , about = '"+aboutMe+"' ";
    sql += " , ln_url = '"+btcLightningTips+"' ";
    sql += " , nip05_verification = '"+nip05Verification+"' ";
    sql += " , lastUpdate = "+currentTime+" ";
    sql += " WHERE id = 1 ";

    console.log("updateProfileInSql sql: "+sql)

    var result = await asyncSql(sql);
    console.log("updateProfileInSql result: "+JSON.stringify(result,null,4))
}

export default class Home extends React.Component {
    constructor(props) {
        super(props);
        this.state = {}
    }
    async componentDidMount() {
        updateMainColWidth();
        document.getElementById("mastheadCenterContainer").innerHTML = "edit my profile"

        await populateMyProfileInfo();

        jQuery("#dataFieldsContainer").change(function(){
            jQuery("#successMessageContainer").html("")
        })
    }
    render() {
        return (
            <>
                <div id="menuCol" className="menuCol" >
                    <LeftNavbar />
                </div>
                <div id="mainCol" >
                    <div id="mastheadElem" >
                        <Masthead />
                    </div>
                    <div id="mainPanel" >

                        <div id="dataFieldsContainer" >
                            <div className="editProfileFieldContainer" >
                                <div className="editProfileLeftColContainer" >
                                    NAME (username)
                                </div>
                                <textarea id="nameContainer" className="editProfileRightColContainer" placeholder="Satoshi Nakamoto" >
                                </textarea>
                            </div>

                            <div className="editProfileFieldContainer" >
                                <div className="editProfileLeftColContainer" >
                                    DISPLAY NAME
                                </div>
                                <textarea id="displayNameContainer" className="editProfileRightColContainer" placeholder="satoshi" >
                                </textarea>
                            </div>

                            <div className="editProfileFieldContainer" >
                                <div className="editProfileLeftColContainer" >
                                    PROFILE PICTURE URL
                                </div>
                                <textarea id="profilePictureUrlContainer" className="editProfileRightColContainer" placeholder="https://example.com/pic.jpg" >
                                </textarea>
                                <div className="editProfileRightColContainer" style={{maxWidth:"275px",color:"grey",fontStyle:"italic"}} >
                                    * Need a way to upload and host an image for your avatar? Here is an easy tool:
                                    <a href="http://nostr.build" target="_blank" style={{marginLeft:"5px"}} >nostr.build</a>
                                </div>
                            </div>

                            <div className="editProfileFieldContainer" >
                                <div className="editProfileLeftColContainer" >
                                    WEBSITE
                                </div>
                                <textarea id="websiteContainer" className="editProfileRightColContainer" placeholder="https://www.bitcointalk.org" >
                                </textarea>
                            </div>

                            <div className="editProfileFieldContainer" >
                                <div className="editProfileLeftColContainer" >
                                    ABOUT ME
                                </div>
                                <textarea id="aboutMeContainer" className="editProfileRightColContainer" placeholder="inventor of bitcoin" >
                                </textarea>
                            </div>

                            <div className="editProfileFieldContainer" >
                                <div className="editProfileLeftColContainer" >
                                    BITCOIN LIGHTNING TIPS
                                </div>
                                <textarea id="btcLightningTipsContainer" className="editProfileRightColContainer" placeholder="Lightning Address of LNURL" >
                                </textarea>
                            </div>

                            <div className="editProfileFieldContainer" >
                                <div className="editProfileLeftColContainer" >
                                    NIP05 VERIFICATION
                                </div>
                                <textarea id="nip05VerificationContainer" className="editProfileRightColContainer" placeholder="jb55@jb55.com" >
                                </textarea>
                            </div>
                        </div>

                        <PublishProfile />

                        <div id="successMessageContainer" style={{fontSize:"14px"}} ></div>

                    </div>
                </div>
            </>
        );
    }
}

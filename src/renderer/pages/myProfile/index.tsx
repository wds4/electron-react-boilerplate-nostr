import React from 'react';
import { NavLink } from "react-router-dom";
import Masthead from '../../mastheads/mainMasthead.js';
import LeftNavbar from '../../navbars/leftNav.js';
import * as MiscAppFxns from "../../lib/app/misc.ts";
import FollowCounts from "../userProfile/followCounts";
import Settings from "./settings";

import {generatePrivateKey, getPublicKey} from 'nostr-tools'

import { asyncSql } from "../../index.tsx";

import {
    dateToUnix,
} from "@nostrgg/react";

const jQuery = require("jquery");

const updateMainColWidth = MiscAppFxns.updateMainColWidth;

const populateMyProfileInfo = (oMyProfileData) => {
    var myPubkey = oMyProfileData.pubkey;
    window.clickedPubKey = myPubkey;
    var myName = oMyProfileData.name;
    var myAbout = oMyProfileData.about;
    var picture_url = oMyProfileData.picture_url;

    jQuery("#myProfileNameContainer").html(myName)

    jQuery("#myProfileAboutContainer").html(myAbout)

    jQuery("#pubkeyContainer").html(myPubkey)

    const avatarHTML = "<img src='"+picture_url+"' class='myProfileAvatarImg' />"

    jQuery("#myProfileAvatarContainer").html(avatarHTML)
}

const fetchMyProfileInfo = async (withEditing) => {
    var sql = ""
    sql += "SELECT * FROM myProfile WHERE id=1"
    var aMyProfileData = await asyncSql(sql);

    if (aMyProfileData.length==0) {
        const [sk,pk] = await generateMyKeys();
        var aMyProfileData = await asyncSql(sql);
    }

    if (aMyProfileData.length > 0) {
        var oMyProfileData = aMyProfileData[0]
        populateMyProfileInfo(oMyProfileData);
    }

    console.log("oMyProfileData: "+JSON.stringify(oMyProfileData,null,4))

    return oMyProfileData;
}

const generateMyKeys = async () => {
    let sk = generatePrivateKey() // `sk` is a hex string
    let pk = getPublicKey(sk) // `pk` is a hex string
    const currentTime = dateToUnix(new Date())
    console.log("sk: "+sk)
    console.log("pk: "+pk)

    var sql = "";
    sql += "INSERT OR IGNORE INTO myProfile (pubkey, privkey, created_at) VALUES ('"+pk+"', '"+sk+"', "+currentTime+") ";

    var result = await asyncSql(sql);
    console.log("result: "+JSON.stringify(result,null,4))

    return [sk,pk]
}

export default class Home extends React.Component {
    constructor(props) {
        super(props);
        this.state = {}
    }
    async componentDidMount() {
        updateMainColWidth();
        document.getElementById("mastheadCenterContainer").innerHTML = "my profile"

        await fetchMyProfileInfo(false);
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
                        <div className="myProfileBox" >
                            <div id="myProfileAvatarContainer" className="myProfileAvatarContainer" >
                            </div>

                            <NavLink to='/EditMyProfile' style={{position:"absolute",right:"5px",top:"5px"}} >
                                <div className="doSomethingButton">edit my profile</div>
                            </NavLink>

                            <div id="myProfileRightColumnContainer" className="myProfileRightColumnContainer" >
                                <div id="myProfileNameContainer" className="myProfileNameContainer" >
                                    myProfileNameContainer
                                </div>

                                <div id="myProfileAboutContainer" className="myProfileAboutContainer" >
                                    myProfileAboutContainer
                                </div>
                                <div id="pubkeyContainer" style={{display:"inline-block",fontSize:"10px"}}></div>
                                <FollowCounts pubkey={window.myPubkey} />
                            </div>
                        </div>

                        <br/>

                        <div className="settingsContainer" style={{display:"none"}} >
                            <Settings />
                        </div>
                    </div>
                </div>
            </>
        );
    }
}

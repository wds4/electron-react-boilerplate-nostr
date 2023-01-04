import React, { useState, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
import { NavLink } from "react-router-dom";
import Masthead from '../../mastheads/mainMasthead.js';
import LeftNavbar from '../../navbars/leftNav.js';
import * as MiscAppFxns from "../../lib/app/misc.ts";
import * as StartupFxns from "../../lib/app/startup.ts";
import AvatarElem from "./avatarElem";
import NameElem from "./nameElem";
import BlankAvatar from "./blankAvatar.png";

import { useNostrEvents, dateToUnix } from "nostr-react";

const jQuery = require("jquery");
const updateMainColWidth = MiscAppFxns.updateMainColWidth;
const cloneObj = MiscAppFxns.cloneObj
const secsToTime = MiscAppFxns.secsToTime
const timeout = MiscAppFxns.timeout

export default class Home extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
          events: []
        }
    }

    async componentDidMount() {
        updateMainColWidth();
        document.getElementById("mastheadCenterContainer").innerHTML = "landing page"

        // run all startup functions if not already run
        if (!window.init.initMiscGlobalVars) {
            StartupFxns.initMiscGlobalVars()
        }
        if (!window.init.grapevineSettings) {
            StartupFxns.setGrapevineDefaults()
        }
        if (!window.init.initMyProfileData) {
            await StartupFxns.initMyProfileData();
        }
        if (!window.init.fetchProfilesInfo) {
            await StartupFxns.fetchProfilesInfo()
        }

        await timeout(10)
        jQuery("#mainFeedButton").get(0).click()
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
                        <NavLink  to='/MainFeed' id="mainFeedButton" >
                            <div style={{fontSize:"12px",lineHeight:"100%"}} >main feed</div>
                            <div id="userProfileContainer" ></div>
                        </NavLink>

                    </div>
                </div>
            </>
        );
    }
}

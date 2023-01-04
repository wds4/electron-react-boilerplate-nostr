import React, { Component, useState } from 'react';
import ReactDOM from 'react-dom';
import Masthead from '../../mastheads/mainMasthead.js';
import LeftNavbar from '../../navbars/leftNav.js';
import * as MiscAppFxns from "../../lib/app/misc.ts";
import * as StartupFxns from "../../lib/app/startup.ts";
// import ToggleSwitch1 from "../../lib/app/toggleSwitch1";
import ToggleSwitch from "./toggleSwitch";

const jQuery = require("jquery");
const updateMainColWidth = MiscAppFxns.updateMainColWidth;
const cloneObj = MiscAppFxns.cloneObj
const secsToTime = MiscAppFxns.secsToTime
const timeout = MiscAppFxns.timeout

const inactiveGrapevine = (props) => {
    return (
        <>
            <div style={{fontSize:"18px",marginLeft:"100px"}} >
                The grapevine is currently in the inactive state. Maybe you should turn it on! This will allow you to:<br/><br/>
                <li>rate users along multiple dimensions</li>
                <li>curate message streams in a variety of ways</li><br/>
                For starters, you may want to allow your Grapevine to manage your list of trusted nostr relays dynamically so you don't have to!
            </div>
        </>
    )
}

export default inactiveGrapevine

import React, { Component, useState } from 'react';
import ReactDOM from 'react-dom';
import Masthead from '../../mastheads/mainMasthead.js';
import LeftNavbar from '../../navbars/leftNav.js';
import * as MiscAppFxns from "../../lib/app/misc.ts";
import * as StartupFxns from "../../lib/app/startup.ts";
import ToggleSwitch1 from "../../lib/app/toggleSwitch1";
import ToggleSwitch from "./toggleSwitch";
import GrapevineIsActive from "./grapevineIsActive";
import GrapevineIsInactive from "./grapevineIsInactive";

const jQuery = require("jquery");
const updateMainColWidth = MiscAppFxns.updateMainColWidth;
const cloneObj = MiscAppFxns.cloneObj
const secsToTime = MiscAppFxns.secsToTime
const timeout = MiscAppFxns.timeout

const grapevineSettingsMainComponent = ({activationState}) => {
    console.log("activationState: "+activationState)
    var activeBlockClassName = "block_show"
    var inactiveBlockClassName = "block_hide"
    if (!activationState) {
        activeBlockClassName = "block_hide"
        inactiveBlockClassName = "block_show"
    }
    return (
        <>
            <div className={activeBlockClassName} >
                <GrapevineIsActive />
            </div>
            <div className={inactiveBlockClassName} >
                <GrapevineIsInactive />
            </div>
        </>
    )
}

export default grapevineSettingsMainComponent

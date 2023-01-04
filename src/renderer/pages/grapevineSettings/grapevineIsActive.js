import React, { Component, useState } from 'react';
import ReactDOM from 'react-dom';
import Masthead from '../../mastheads/mainMasthead.js';
import LeftNavbar from '../../navbars/leftNav.js';
import * as MiscAppFxns from "../../lib/app/misc.ts";
import * as StartupFxns from "../../lib/app/startup.ts";
import ToggleSwitch1 from "../../lib/app/toggleSwitch1";
import ToggleSwitch from "./toggleSwitch";

const jQuery = require("jquery");
const updateMainColWidth = MiscAppFxns.updateMainColWidth;
const cloneObj = MiscAppFxns.cloneObj
const secsToTime = MiscAppFxns.secsToTime
const timeout = MiscAppFxns.timeout

const activeGrapevine = (props) => {
    return (
        <>
            <div className="grapevineSettingsItemContainer" style={{textAlign:"center"}} >
                <div className="grapevineSettingsItemLeftCol" >
                    Activate Contexts
                </div>
                <div className="grapevineSettingsItemMainToggleCol" >
                    <React.Fragment>
                        <ToggleSwitch label="contexts" />
                    </React.Fragment>
                </div>
            </div>
            <hr/>
            <div className="grapevineSettingsItemContainer" style={{backgroundColor:"#DFDFDF"}} >
                <div className="grapevineSettingsItemLeftCol" >
                    Purpose:
                </div>
                <div className="grapevineSettingsItemMainToggleCol" >
                    .
                </div>
                <div className="grapevineSettingsItemRatingNameCol" >
                    (affirmative)
                </div>
                <div className="grapevineSettingsItemRatingToggleButtonCol" >
                    .
                </div>
                <div className="grapevineSettingsItemRatingNameCol" >
                    (negative)
                </div>
                <div className="grapevineSettingsItemRatingToggleButtonCol" >
                    .
                </div>
                <div className="grapevineSettingsItemRatingNameCol" >
                    Contextual
                </div>
                <div className="grapevineSettingsItemRatingToggleButtonCol" >
                    .
                </div>
            </div>

            <div className="grapevineSettingsItemContainer" >
                <div className="grapevineSettingsItemLeftCol" >
                    All Purposes
                </div>
                <div className="grapevineSettingsItemMainToggleCol" >
                    <React.Fragment>
                        <ToggleSwitch label="worship" />
                    </React.Fragment>
                </div>
                <div className="grapevineSettingsItemRatingNameCol" >
                    yes
                </div>
                <div className="grapevineSettingsItemRatingToggleButtonCol" >
                    <React.Fragment>
                        <ToggleSwitch label="worship_up" />
                    </React.Fragment>
                </div>
                <div className="grapevineSettingsItemRatingNameCol" >
                    no
                </div>
                <div className="grapevineSettingsItemRatingToggleButtonCol" >
                    <React.Fragment>
                        <ToggleSwitch label="worship_down" />
                    </React.Fragment>
                </div>
                <div className="grapevineSettingsItemRatingToggleButtonCol" >
                    <React.Fragment>
                        <ToggleSwitch label="worship_contextual" />
                    </React.Fragment>
                </div>
            </div>

            <div className="grapevineSettingsItemContainer" >
                <div className="grapevineSettingsItemLeftCol" >
                    Attention
                </div>
                <div className="grapevineSettingsItemMainToggleCol" >
                    <React.Fragment>
                        <ToggleSwitch label="attention" />
                    </React.Fragment>
                </div>
                <div className="grapevineSettingsItemRatingNameCol" >
                    follow
                </div>
                <div className="grapevineSettingsItemRatingToggleButtonCol" >
                    <React.Fragment>
                        <ToggleSwitch label="attention_up" />
                    </React.Fragment>
                </div>
                <div className="grapevineSettingsItemRatingNameCol" >
                    ignore
                </div>
                <div className="grapevineSettingsItemRatingToggleButtonCol" >
                    <React.Fragment>
                        <ToggleSwitch label="attention_down" />
                    </React.Fragment>
                </div>
                <div className="grapevineSettingsItemRatingToggleButtonCol" >
                    <React.Fragment>
                        <ToggleSwitch label="attention_contextual" />
                    </React.Fragment>
                </div>
            </div>

            <div className="grapevineSettingsItemContainer" >
                <div className="grapevineSettingsItemLeftCol" >
                    Believe
                </div>
                <div className="grapevineSettingsItemMainToggleCol" >
                    <React.Fragment>
                        <ToggleSwitch label="believe" />
                    </React.Fragment>
                </div>
                <div className="grapevineSettingsItemRatingNameCol" >
                    believe
                </div>
                <div className="grapevineSettingsItemRatingToggleButtonCol" >
                    <React.Fragment>
                        <ToggleSwitch label="believe_up" />
                    </React.Fragment>
                </div>
                <div className="grapevineSettingsItemRatingNameCol" >
                    disbelieve
                </div>
                <div className="grapevineSettingsItemRatingToggleButtonCol" >
                    <React.Fragment>
                        <ToggleSwitch label="believe_down" />
                    </React.Fragment>
                </div>
                <div className="grapevineSettingsItemRatingToggleButtonCol" >
                    <React.Fragment>
                        <ToggleSwitch label="believe_contextual" />
                    </React.Fragment>
                </div>
            </div>

            <div className="grapevineSettingsItemContainer" >
                <div className="grapevineSettingsItemLeftCol" >
                    Nostr relays
                </div>
                <div className="grapevineSettingsItemMainToggleCol" >
                    <React.Fragment>
                        <ToggleSwitch label="nostr" />
                    </React.Fragment>
                </div>
                <div className="grapevineSettingsItemRatingNameCol" >
                    trust
                </div>
                <div className="grapevineSettingsItemRatingToggleButtonCol" >
                    <React.Fragment>
                        <ToggleSwitch label="nostr_up" />
                    </React.Fragment>
                </div>
                <div className="grapevineSettingsItemRatingNameCol" >
                    don't trust
                </div>
                <div className="grapevineSettingsItemRatingToggleButtonCol" >
                    <React.Fragment>
                        <ToggleSwitch label="nostr_down" />
                    </React.Fragment>
                </div>
                <div className="grapevineSettingsItemRatingToggleButtonCol" >
                    <React.Fragment>
                        <ToggleSwitch label="nostr_contextual" />
                    </React.Fragment>
                </div>
            </div>

            <div className="grapevineSettingsItemContainer" >
                <div className="grapevineSettingsItemLeftCol" >
                    Ontology
                </div>
                <div className="grapevineSettingsItemMainToggleCol" >
                    <React.Fragment>
                        <ToggleSwitch label="ontology" />
                    </React.Fragment>
                </div>
                <div className="grapevineSettingsItemRatingNameCol" >
                    trust
                </div>
                <div className="grapevineSettingsItemRatingToggleButtonCol" >
                    <React.Fragment>
                        <ToggleSwitch label="ontology_up" />
                    </React.Fragment>
                </div>
                <div className="grapevineSettingsItemRatingNameCol" >
                    don't trust
                </div>
                <div className="grapevineSettingsItemRatingToggleButtonCol" >
                    <React.Fragment>
                        <ToggleSwitch label="ontology_down" />
                    </React.Fragment>
                </div>
                <div className="grapevineSettingsItemRatingToggleButtonCol" >
                    <React.Fragment>
                        <ToggleSwitch label="ontology_contextual" />
                    </React.Fragment>
                </div>
            </div>

            <div className="grapevineSettingsItemContainer" >
                <div className="grapevineSettingsItemLeftCol" >
                    Advice
                </div>
                <div className="grapevineSettingsItemMainToggleCol" >
                    <React.Fragment>
                        <ToggleSwitch label="advice" />
                    </React.Fragment>
                </div>
                <div className="grapevineSettingsItemRatingNameCol" >
                    trust
                </div>
                <div className="grapevineSettingsItemRatingToggleButtonCol" >
                    <React.Fragment>
                        <ToggleSwitch label="advice_up" />
                    </React.Fragment>
                </div>
                <div className="grapevineSettingsItemRatingNameCol" >
                    don't trust
                </div>
                <div className="grapevineSettingsItemRatingToggleButtonCol" >
                    <React.Fragment>
                        <ToggleSwitch label="advice_down" />
                    </React.Fragment>
                </div>
                <div className="grapevineSettingsItemRatingToggleButtonCol" >
                    <React.Fragment>
                        <ToggleSwitch label="advice_contextual" />
                    </React.Fragment>
                </div>
            </div>

            <div style={{display:"none"}} >
                <ToggleSwitch1 />
            </div>
        </>
    )
}

export default activeGrapevine

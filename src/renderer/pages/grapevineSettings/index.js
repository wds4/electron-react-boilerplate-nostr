import React, { Component, useState } from 'react';
import ReactDOM from 'react-dom';
import Masthead from '../../mastheads/mainMasthead.js';
import LeftNavbar from '../../navbars/leftNav.js';
import * as MiscAppFxns from "../../lib/app/misc.ts";
import * as StartupFxns from "../../lib/app/startup.ts";
import ToggleSwitch1 from "../../lib/app/toggleSwitch1";
import ToggleSwitch2 from "../../lib/app/toggleSwitch2";

const jQuery = require("jquery");
const updateMainColWidth = MiscAppFxns.updateMainColWidth;
const cloneObj = MiscAppFxns.cloneObj
const secsToTime = MiscAppFxns.secsToTime
const timeout = MiscAppFxns.timeout

export default class GrapevineSettings extends React.Component {
    constructor(props) {
        super(props);
        this.state = {

        }
    }
    async componentDidMount() {
        updateMainColWidth();
        document.getElementById("mastheadCenterContainer").innerHTML = "grapevine settings"
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
                        <div className="grapevineSettingsItemContainer" >
                            <div className="grapevineSettingsItemLeftCol" >
                                Grapevine
                            </div>
                            <div className="grapevineSettingsItemMainToggleCol" >
                                <React.Fragment>
                                    <ToggleSwitch2 label="grapevine" />
                                </React.Fragment>
                            </div>
                        </div>

                        <div className="grapevineSettingsItemContainer" >
                            <div className="grapevineSettingsItemLeftCol" >
                                Contexts
                            </div>
                            <div className="grapevineSettingsItemMainToggleCol" >
                                <React.Fragment>
                                    <ToggleSwitch2 label="contexts" />
                                </React.Fragment>
                            </div>
                        </div>

                        <div className="h2" style={{marginBottom:"20px"}} >Purpose</div>

                        <div className="grapevineSettingsItemContainer" >
                            <div className="grapevineSettingsItemLeftCol" >
                                Purpose
                            </div>
                            <div className="grapevineSettingsItemMainToggleCol" >
                                .
                            </div>
                            <div className="grapevineSettingsItemRatingNameCol" >
                                yes
                            </div>
                            <div className="grapevineSettingsItemRatingToggleButtonCol" >
                                .
                            </div>
                            <div className="grapevineSettingsItemRatingNameCol" >
                                no
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
                                Attention
                            </div>
                            <div className="grapevineSettingsItemMainToggleCol" >
                                <React.Fragment>
                                    <ToggleSwitch2 label="attention" />
                                </React.Fragment>
                            </div>
                            <div className="grapevineSettingsItemRatingNameCol" >
                                follow
                            </div>
                            <div className="grapevineSettingsItemRatingToggleButtonCol" >
                                <React.Fragment>
                                    <ToggleSwitch2 label="attention_up" />
                                </React.Fragment>
                            </div>
                            <div className="grapevineSettingsItemRatingNameCol" >
                                ignore
                            </div>
                            <div className="grapevineSettingsItemRatingToggleButtonCol" >
                                <React.Fragment>
                                    <ToggleSwitch2 label="attention_down" />
                                </React.Fragment>
                            </div>
                        </div>

                        <div className="grapevineSettingsItemContainer" >
                            <div className="grapevineSettingsItemLeftCol" >
                                Believe
                            </div>
                            <div className="grapevineSettingsItemMainToggleCol" >
                                <React.Fragment>
                                    <ToggleSwitch2 label="believe" />
                                </React.Fragment>
                            </div>
                            <div className="grapevineSettingsItemRatingNameCol" >
                                believe
                            </div>
                            <div className="grapevineSettingsItemRatingToggleButtonCol" >
                                <React.Fragment>
                                    <ToggleSwitch2 label="believe_up" />
                                </React.Fragment>
                            </div>
                            <div className="grapevineSettingsItemRatingNameCol" >
                                disbelieve
                            </div>
                            <div className="grapevineSettingsItemRatingToggleButtonCol" >
                                <React.Fragment>
                                    <ToggleSwitch2 label="believe_down" />
                                </React.Fragment>
                            </div>
                        </div>

                        <div className="grapevineSettingsItemContainer" >
                            <div className="grapevineSettingsItemLeftCol" >
                                Nostr relays
                            </div>
                            <div className="grapevineSettingsItemMainToggleCol" >
                                <React.Fragment>
                                    <ToggleSwitch2 label="nostr" />
                                </React.Fragment>
                            </div>
                        </div>

                        <div style={{display:"none"}} >
                            <ToggleSwitch1 />
                        </div>
                    </div>
                </div>
            </>
        );
    }
}

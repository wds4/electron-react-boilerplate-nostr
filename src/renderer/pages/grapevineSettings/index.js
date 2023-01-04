import React, { Component, useState } from 'react';
import ReactDOM from 'react-dom';
import Masthead from '../../mastheads/mainMasthead.js';
import LeftNavbar from '../../navbars/leftNav.js';
import * as MiscAppFxns from "../../lib/app/misc.ts";
import * as StartupFxns from "../../lib/app/startup.ts";
import ToggleSwitch1 from "../../lib/app/toggleSwitch1";
import ToggleSwitch from "./toggleSwitch";
import GrapevineSettingsMainComponent from "./settingsMainComp";

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

        const fxnForceUpdate = () => {
            this.forceUpdate();
        }

        console.log("window.grapevineSettings.active: "+window.grapevineSettings.active)
        if (window.grapevineSettings.active) { jQuery("#grapevine").prop('checked',true); }
        if (window.grapevineSettings.contexts) { jQuery("#contexts").prop('checked',true); }

        if (window.grapevineSettings.worship.active) { jQuery("#worship").prop('checked',true); }
        if (window.grapevineSettings.worship.up) { jQuery("#worship_up").prop('checked',true); }
        if (window.grapevineSettings.worship.down) { jQuery("#worship_down").prop('checked',true); }
        if (window.grapevineSettings.worship.contexts) { jQuery("#worship_contextual").prop('checked',true); }

        if (window.grapevineSettings.attention.active) { jQuery("#attention").prop('checked',true); }
        if (window.grapevineSettings.attention.up) { jQuery("#attention_up").prop('checked',true); }
        if (window.grapevineSettings.attention.down) { jQuery("#attention_down").prop('checked',true); }
        if (window.grapevineSettings.attention.contexts) { jQuery("#attention_contextual").prop('checked',true); }

        if (window.grapevineSettings.believe.active) { jQuery("#believe").prop('checked',true); }
        if (window.grapevineSettings.believe.up) { jQuery("#believe_up").prop('checked',true); }
        if (window.grapevineSettings.believe.down) { jQuery("#believe_down").prop('checked',true); }
        if (window.grapevineSettings.believe.contexts) { jQuery("#believe_contextual").prop('checked',true); }

        if (window.grapevineSettings.nostr.active) { jQuery("#nostr").prop('checked',true); }
        if (window.grapevineSettings.nostr.up) { jQuery("#nostr_up").prop('checked',true); }
        if (window.grapevineSettings.nostr.down) { jQuery("#nostr_down").prop('checked',true); }
        if (window.grapevineSettings.nostr.contexts) { jQuery("#nostr_contextual").prop('checked',true); }

        if (window.grapevineSettings.ontology.active) { jQuery("#ontology").prop('checked',true); }
        if (window.grapevineSettings.ontology.up) { jQuery("#ontology_up").prop('checked',true); }
        if (window.grapevineSettings.ontology.down) { jQuery("#ontology_down").prop('checked',true); }
        if (window.grapevineSettings.ontology.contexts) { jQuery("#ontology_contextual").prop('checked',true); }

        if (window.grapevineSettings.advice.active) { jQuery("#advice").prop('checked',true); }
        if (window.grapevineSettings.advice.up) { jQuery("#advice_up").prop('checked',true); }
        if (window.grapevineSettings.advice.down) { jQuery("#advice_down").prop('checked',true); }
        if (window.grapevineSettings.advice.contexts) { jQuery("#advice_contextual").prop('checked',true); }

        const processToggle = (toggleSwitchLabel) => {
            var checkboxId = toggleSwitchLabel;
            var currentState = jQuery("#"+checkboxId).prop('checked')
            console.log("grapevineSettingsToggleSwitchContainer change has been detected; toggleSwitchLabel: "+toggleSwitchLabel+"; currentState: "+currentState)
            switch (toggleSwitchLabel) {
                case "grapevine":
                    window.grapevineSettings.active = currentState
                    fxnForceUpdate();
                    break;
                case "contexts":
                    window.grapevineSettings.contexts = currentState
                    fxnForceUpdate();
                    break;

                // worship
                case "worship":
                    window.grapevineSettings.worship.active = currentState
                    fxnForceUpdate();
                    break;
                case "worship_up":
                    window.grapevineSettings.worship.up = currentState
                    fxnForceUpdate();
                    break;
                case "worship_down":
                    window.grapevineSettings.worship.down = currentState
                    fxnForceUpdate();
                    break;
                case "worship_contextual":
                    window.grapevineSettings.worship.contexts = currentState
                    fxnForceUpdate();
                    break;

                // attention
                case "attention":
                    window.grapevineSettings.attention.active = currentState
                    fxnForceUpdate();
                    break;
                case "attention_up":
                    window.grapevineSettings.attention.up = currentState
                    fxnForceUpdate();
                    break;
                case "attention_down":
                    window.grapevineSettings.attention.down = currentState
                    fxnForceUpdate();
                    break;
                case "attention_contextual":
                    window.grapevineSettings.attention.contexts = currentState
                    fxnForceUpdate();
                    break;

                // believe
                case "believe":
                    window.grapevineSettings.believe.active = currentState
                    fxnForceUpdate();
                    break;
                case "believe_up":
                    window.grapevineSettings.believe.up = currentState
                    fxnForceUpdate();
                    break;
                case "believe_down":
                    window.grapevineSettings.believe.down = currentState
                    fxnForceUpdate();
                    break;
                case "believe_contextual":
                    window.grapevineSettings.believe.contexts = currentState
                    fxnForceUpdate();
                    break;

                // nostr
                case "nostr":
                    window.grapevineSettings.nostr.active = currentState
                    fxnForceUpdate();
                    break;
                case "nostr_up":
                    window.grapevineSettings.nostr.up = currentState
                    fxnForceUpdate();
                    break;
                case "nostr_down":
                    window.grapevineSettings.nostr.down = currentState
                    fxnForceUpdate();
                    break;
                case "nostr_contextual":
                    window.grapevineSettings.nostr.contexts = currentState
                    fxnForceUpdate();
                    break;

                // ontology
                case "ontology":
                    window.grapevineSettings.ontology.active = currentState
                    fxnForceUpdate();
                    break;
                case "ontology_up":
                    window.grapevineSettings.ontology.up = currentState
                    fxnForceUpdate();
                    break;
                case "ontology_down":
                    window.grapevineSettings.ontology.down = currentState
                    fxnForceUpdate();
                    break;
                case "ontology_contextual":
                    window.grapevineSettings.ontology.contexts = currentState
                    fxnForceUpdate();
                    break;

                // advice
                case "advice":
                    window.grapevineSettings.advice.active = currentState
                    fxnForceUpdate();
                    break;
                case "advice_up":
                    window.grapevineSettings.advice.up = currentState
                    fxnForceUpdate();
                    break;
                case "advice_down":
                    window.grapevineSettings.advice.down = currentState
                    fxnForceUpdate();
                    break;
                case "advice_contextual":
                    window.grapevineSettings.advice.contexts = currentState
                    fxnForceUpdate();
                    break;

                default:
                    console.log("the label was not recognized")
                    break
            }
        }

        jQuery(".grapevineSettingsToggleSwitchContainer").change(function(){
            var toggleSwitchLabel = jQuery(this).data("label")
            processToggle(toggleSwitchLabel);
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
                        <div style={{textAlign:"center",fontSize:"18px",marginBottom:"10px"}} >
                        The Grapevine is under construction and not yet functional.
                        </div>
                        <div className="grapevineSettingsItemContainer" style={{textAlign:"center"}} >
                            <div className="grapevineSettingsItemLeftCol" >
                                Grapevine
                            </div>
                            <div className="grapevineSettingsItemMainToggleCol" >
                                <React.Fragment>
                                    <ToggleSwitch label="grapevine" />
                                </React.Fragment>
                            </div>
                        </div>

                        <GrapevineSettingsMainComponent />


                    </div>
                </div>
            </>
        );
    }
}

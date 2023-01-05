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
const setGrapevineDefaults = StartupFxns.setGrapevineDefaults;

export const syncGrapevineControlButtons = () => {
    console.log("window.grapevineSettings.active: "+window.grapevineSettings.active)
    // if (window.grapevineSettings.active) { jQuery("#grapevine").prop('checked',true); }
    // if (window.grapevineSettings.contexts) { jQuery("#contexts").prop('checked',true); }

    jQuery("#grapevine").prop('checked',window.grapevineSettings.active)
    jQuery("#contexts").prop('checked',window.grapevineSettings.contexts)

    // if (window.grapevineSettings.worship.active) { jQuery("#worship").prop('checked',true); }
    // if (window.grapevineSettings.worship.up) { jQuery("#worship_up").prop('checked',true); }
    // if (window.grapevineSettings.worship.down) { jQuery("#worship_down").prop('checked',true); }
    // if (window.grapevineSettings.worship.contexts) { jQuery("#worship_contextual").prop('checked',true); }

    jQuery("#worship").prop('checked',window.grapevineSettings.worship.active)
    jQuery("#worship_up").prop('checked',window.grapevineSettings.worship.up)
    jQuery("#worship_down").prop('checked',window.grapevineSettings.worship.down)
    jQuery("#worship_contextual").prop('checked',window.grapevineSettings.worship.contexts)

    // if (window.grapevineSettings.attention.active) { jQuery("#attention").prop('checked',true); }
    // if (window.grapevineSettings.attention.up) { jQuery("#attention_up").prop('checked',true); }
    // if (window.grapevineSettings.attention.down) { jQuery("#attention_down").prop('checked',true); }
    // if (window.grapevineSettings.attention.contexts) { jQuery("#attention_contextual").prop('checked',true); }

    jQuery("#attention").prop('checked',window.grapevineSettings.attention.active)
    jQuery("#attention_up").prop('checked',window.grapevineSettings.attention.up)
    jQuery("#attention_down").prop('checked',window.grapevineSettings.attention.down)
    jQuery("#attention_contextual").prop('checked',window.grapevineSettings.attention.contexts)

    // if (window.grapevineSettings.believe.active) { jQuery("#believe").prop('checked',true); }
    // if (window.grapevineSettings.believe.up) { jQuery("#believe_up").prop('checked',true); }
    // if (window.grapevineSettings.believe.down) { jQuery("#believe_down").prop('checked',true); }
    // if (window.grapevineSettings.believe.contexts) { jQuery("#believe_contextual").prop('checked',true); }

    jQuery("#believe").prop('checked',window.grapevineSettings.believe.active)
    jQuery("#believe_up").prop('checked',window.grapevineSettings.believe.up)
    jQuery("#believe_down").prop('checked',window.grapevineSettings.believe.down)
    jQuery("#believe_contextual").prop('checked',window.grapevineSettings.believe.contexts)

    // if (window.grapevineSettings.nostr.active) { jQuery("#nostr").prop('checked',true); }
    // if (window.grapevineSettings.nostr.up) { jQuery("#nostr_up").prop('checked',true); }
    // if (window.grapevineSettings.nostr.down) { jQuery("#nostr_down").prop('checked',true); }
    // if (window.grapevineSettings.nostr.contexts) { jQuery("#nostr_contextual").prop('checked',true); }

    jQuery("#nostr").prop('checked',window.grapevineSettings.nostr.active)
    jQuery("#nostr_up").prop('checked',window.grapevineSettings.nostr.up)
    jQuery("#nostr_down").prop('checked',window.grapevineSettings.nostr.down)
    jQuery("#nostr_contextual").prop('checked',window.grapevineSettings.nostr.contexts)

    // if (window.grapevineSettings.ontology.active) { jQuery("#ontology").prop('checked',true); }
    // if (window.grapevineSettings.ontology.up) { jQuery("#ontology_up").prop('checked',true); }
    // if (window.grapevineSettings.ontology.down) { jQuery("#ontology_down").prop('checked',true); }
    // if (window.grapevineSettings.ontology.contexts) { jQuery("#ontology_contextual").prop('checked',true); }

    jQuery("#ontology").prop('checked',window.grapevineSettings.ontology.active)
    jQuery("#ontology_up").prop('checked',window.grapevineSettings.ontology.up)
    jQuery("#ontology_down").prop('checked',window.grapevineSettings.ontology.down)
    jQuery("#ontology_contextual").prop('checked',window.grapevineSettings.ontology.contexts)

    // if (window.grapevineSettings.advice.active) { jQuery("#advice").prop('checked',true); }
    // if (window.grapevineSettings.advice.up) { jQuery("#advice_up").prop('checked',true); }
    // if (window.grapevineSettings.advice.down) { jQuery("#advice_down").prop('checked',true); }
    // if (window.grapevineSettings.advice.contexts) { jQuery("#advice_contextual").prop('checked',true); }

    jQuery("#advice").prop('checked',window.grapevineSettings.advice.active)
    jQuery("#advice_up").prop('checked',window.grapevineSettings.advice.up)
    jQuery("#advice_down").prop('checked',window.grapevineSettings.advice.down)
    jQuery("#advice_contextual").prop('checked',window.grapevineSettings.advice.contexts)
}

const updateGrapevineSettingsInSql = async () => {
    console.log("updateGrapevineSettingsInSql function called")
}

export default class GrapevineSettings extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            activationState: window.grapevineSettings.active
        }
    }

    async componentDidMount() {
        updateMainColWidth();
        document.getElementById("mastheadCenterContainer").innerHTML = "grapevine settings"

        syncGrapevineControlButtons();

        const updateThisComponentState = () => {
            this.setState({activationState: window.grapevineSettings.active})
        }

        const processToggle = async (toggleSwitchLabel) => {
            var checkboxId = toggleSwitchLabel;
            var currentState = jQuery("#"+checkboxId).prop('checked')
            console.log("grapevineSettingsToggleSwitchContainer change has been detected; toggleSwitchLabel: "+toggleSwitchLabel+"; currentState: "+currentState)
            switch (toggleSwitchLabel) {
                case "grapevine":
                    window.grapevineSettings.active = currentState
                    this.setState({activationState: currentState})
                    break;
                case "contexts":
                    window.grapevineSettings.contexts = currentState
                    break;

                // worship
                case "worship":
                    window.grapevineSettings.worship.active = currentState
                    break;
                case "worship_up":
                    window.grapevineSettings.worship.up = currentState
                    break;
                case "worship_down":
                    window.grapevineSettings.worship.down = currentState

                    break;
                case "worship_contextual":
                    window.grapevineSettings.worship.contexts = currentState

                    break;

                // attention
                case "attention":
                    window.grapevineSettings.attention.active = currentState

                    break;
                case "attention_up":
                    window.grapevineSettings.attention.up = currentState

                    break;
                case "attention_down":
                    window.grapevineSettings.attention.down = currentState

                    break;
                case "attention_contextual":
                    window.grapevineSettings.attention.contexts = currentState

                    break;

                // believe
                case "believe":
                    window.grapevineSettings.believe.active = currentState

                    break;
                case "believe_up":
                    window.grapevineSettings.believe.up = currentState

                    break;
                case "believe_down":
                    window.grapevineSettings.believe.down = currentState

                    break;
                case "believe_contextual":
                    window.grapevineSettings.believe.contexts = currentState

                    break;

                // nostr
                case "nostr":
                    window.grapevineSettings.nostr.active = currentState

                    break;
                case "nostr_up":
                    window.grapevineSettings.nostr.up = currentState

                    break;
                case "nostr_down":
                    window.grapevineSettings.nostr.down = currentState

                    break;
                case "nostr_contextual":
                    window.grapevineSettings.nostr.contexts = currentState

                    break;

                // ontology
                case "ontology":
                    window.grapevineSettings.ontology.active = currentState

                    break;
                case "ontology_up":
                    window.grapevineSettings.ontology.up = currentState

                    break;
                case "ontology_down":
                    window.grapevineSettings.ontology.down = currentState

                    break;
                case "ontology_contextual":
                    window.grapevineSettings.ontology.contexts = currentState

                    break;

                // advice
                case "advice":
                    window.grapevineSettings.advice.active = currentState

                    break;
                case "advice_up":
                    window.grapevineSettings.advice.up = currentState

                    break;
                case "advice_down":
                    window.grapevineSettings.advice.down = currentState

                    break;
                case "advice_contextual":
                    window.grapevineSettings.advice.contexts = currentState

                    break;

                default:
                    console.log("the label was not recognized")
                    break
            }
            await updateGrapevineSettingsInSql()
        }

        jQuery(".grapevineSettingsToggleSwitchContainer").off().change(function(){
            var toggleSwitchLabel = jQuery(this).data("label")
            processToggle(toggleSwitchLabel);
        })
        jQuery("#resetDefaultGrapevineSettingsButton").click(async function(){
            console.log("resetDefaultGrapevineSettingsButton clicked")
            setGrapevineDefaults();
            syncGrapevineControlButtons();
            updateThisComponentState()
            await updateGrapevineSettingsInSql()
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
                            <div id="resetDefaultGrapevineSettingsButton" className="doSomethingButton" >Reset Default Grapevine Settings</div>
                        </div>

                        <GrapevineSettingsMainComponent activationState={this.state.activationState} />

                    </div>
                </div>
            </>
        );
    }
}

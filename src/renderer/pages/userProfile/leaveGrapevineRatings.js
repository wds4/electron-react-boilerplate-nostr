import React, { useState, useEffect, useRef } from 'react';
import { NavLink } from "react-router-dom";
import * as MiscAppFxns from "../../lib/app/misc.ts";

const jQuery = require("jquery");

const updateMainColWidth = MiscAppFxns.updateMainColWidth;
const secsToTime = MiscAppFxns.secsToTime
const cloneObj = MiscAppFxns.cloneObj

const setGrapevineDefaults = () => {
    window.grapevineSettings = {};

    window.grapevineSettings.active = true;
    window.grapevineSettings.showHeader = false;
    window.grapevineSettings.contexts = false;

    window.grapevineSettings.worship = {};
    window.grapevineSettings.worship.active = true;
    window.grapevineSettings.worship.up = true;
    window.grapevineSettings.worship.down = false;

    window.grapevineSettings.attention = {};
    window.grapevineSettings.attention.active = true;
    window.grapevineSettings.attention.up = true;
    window.grapevineSettings.attention.down = false;

    window.grapevineSettings.believe = {};
    window.grapevineSettings.believe.active = false;
    window.grapevineSettings.believe.up = true;
    window.grapevineSettings.believe.down = false;

    window.grapevineSettings.nostr = {};
    window.grapevineSettings.nostr.active = true;
    window.grapevineSettings.nostr.up = true;
    window.grapevineSettings.nostr.down = false;

    window.grapevineSettings.ontology = {};
    window.grapevineSettings.ontology.active = false;
    window.grapevineSettings.ontology.up = true;
    window.grapevineSettings.ontology.down = true;

    window.grapevineSettings.advice = {};
    window.grapevineSettings.advice.active = false;
    window.grapevineSettings.advice.up = true;
    window.grapevineSettings.advice.down = true;
}
setGrapevineDefaults();

export default class LeaveGrapevineRatings extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        }
    }
    async componentDidMount() {
        console.log("this.props.pubkey: "+this.props.pubkey)
        setGrapevineDefaults();
    }
    render() {
        var showGrapevineClassName = "userProfileGrapevineContainer"
        if (!window.grapevineSettings.active) { showGrapevineClassName = "userProfileGrapevineContainer_hidden" }

        var showHeaderClassName = "grapevineItemContainer"
        if (!window.grapevineSettings.showHeader) { showHeaderClassName = "grapevineItemContainer_hidden" }

        var showContextSelectorClassName = "grapevineSelector"
        if (!window.grapevineSettings.contexts) { showContextSelectorClassName = "grapevineSelector_hidden" }

        var showWorshipClassName = "grapevineItemContainer";
        if (!window.grapevineSettings.worship.active) { showWorshipClassName = "grapevineItemContainer_hidden" }
        var showWorship_up_ClassName = "leaveRatingButton";
        if (!window.grapevineSettings.worship.up) { showWorship_up_ClassName = "leaveRatingButton_hidden" }
        var showWorship_down_ClassName = "leaveRatingButton";
        if (!window.grapevineSettings.worship.down) { showWorship_down_ClassName = "leaveRatingButton_hidden" }

        var showAttentionClassName = "grapevineItemContainer";
        if (!window.grapevineSettings.attention.active) { showAttentionClassName = "grapevineItemContainer_hidden" }
        var showAttention_up_ClassName = "leaveRatingButton";
        if (!window.grapevineSettings.attention.up) { showAttention_up_ClassName = "leaveRatingButton_hidden" }
        var showAttention_down_ClassName = "leaveRatingButton";
        if (!window.grapevineSettings.attention.down) { showAttention_down_ClassName = "leaveRatingButton_hidden" }

        var showBeliefClassName = "grapevineItemContainer";
        if (!window.grapevineSettings.believe.active) { showBeliefClassName = "grapevineItemContainer_hidden" }
        var showBelief_up_ClassName = "leaveRatingButton";
        if (!window.grapevineSettings.believe.up) { showBelief_up_ClassName = "leaveRatingButton_hidden" }
        var showBelief_down_ClassName = "leaveRatingButton";
        if (!window.grapevineSettings.believe.down) { showBelief_down_ClassName = "leaveRatingButton_hidden" }

        var showNostrClassName = "grapevineItemContainer";
        if (!window.grapevineSettings.nostr.active) { showNostrClassName = "grapevineItemContainer_hidden" }
        var showNostr_up_ClassName = "leaveRatingButton";
        if (!window.grapevineSettings.nostr.up) { showNostr_up_ClassName = "leaveRatingButton_hidden" }
        var showNostr_down_ClassName = "leaveRatingButton";
        if (!window.grapevineSettings.nostr.down) { showNostr_down_ClassName = "leaveRatingButton_hidden" }

        var showOntologyClassName = "grapevineItemContainer";
        if (!window.grapevineSettings.ontology.active) { showOntologyClassName = "grapevineItemContainer_hidden" }
        var showOntology_up_ClassName = "leaveRatingButton";
        if (!window.grapevineSettings.ontology.up) { showOntology_up_ClassName = "leaveRatingButton_hidden" }
        var showOntology_down_ClassName = "leaveRatingButton";
        if (!window.grapevineSettings.ontology.down) { showOntology_down_ClassName = "leaveRatingButton_hidden" }

        var showAdviceClassName = "grapevineItemContainer";
        if (!window.grapevineSettings.advice.active) { showAdviceClassName = "grapevineItemContainer_hidden" }
        var showAdvice_up_ClassName = "leaveRatingButton";
        if (!window.grapevineSettings.advice.up) { showAdvice_up_ClassName = "leaveRatingButton_hidden" }
        var showAdvice_down_ClassName = "leaveRatingButton";
        if (!window.grapevineSettings.advice.down) { showAdvice_down_ClassName = "leaveRatingButton_hidden" }

        const pk = this.props.pubkey;
        return (
            <>
                <div className={showGrapevineClassName} >
                    <div style={{display:"inline-block",fontSize:"52px",textAlign:"center"}} >
                        <div style={{marginTop:"5px"}}>&#x1F347;</div>
                    </div>
                    <div style={{display:"inline-block",marginLeft:"30px",width:"500px"}} >
                        <div style={{marginBottom:"5px",paddingBottom:"3px",position:"relative"}} >
                            <div className={showHeaderClassName} style={{borderBottom:"1px solid black",paddingBottom:"5px"}} >
                                <div className="grapevineContainerLeftCol">
                                    <span class="tooltiptext">Purpose:<br/>What will these ratings be used for?</span>
                                    Purpose
                                </div>
                                <div className="grapevineContainerLeftCol" style={{position:"absolute",right:"10px"}} >
                                    <span class="tooltiptext">category</span>
                                    Context
                                </div>
                            </div>
                        </div>
                        <div style={{maxHeight:"150px",overflow:"scroll"}} >

                            <div className={showWorshipClassName} >
                                <div className="grapevineContainerLeftCol" >
                                    <span class="tooltiptext">a.k.a. "Worship"<br/>trust this user in all things and for all purposes</span>
                                    All:
                                </div>
                                <div className={showWorship_up_ClassName} >Yes</div>
                                <div className={showWorship_down_ClassName} >No</div>
                                <select className={showContextSelectorClassName} >
                                    <option>all</option>
                                    <option>bitcoin</option>
                                </select>
                            </div>

                            <div className={showAttentionClassName} >
                                <div className="grapevineContainerLeftCol" >
                                    <span class="tooltiptext">Attention:<br/>influence over things like twitter content feed</span>
                                    Attention:
                                </div>
                                <div className={showAttention_up_ClassName} >Follow</div>
                                <div className={showAttention_down_ClassName} >Ignore</div>
                                <select className={showContextSelectorClassName} >
                                    <option>all</option>
                                    <option>bitcoin</option>
                                </select>
                            </div>

                            <div className={showBeliefClassName} >
                                <div className="grapevineContainerLeftCol" >
                                    <span class="tooltiptext">Believe:<br/>influence things like poll results or statements of fact</span>
                                    Believe:
                                </div>
                                <div className={showBelief_up_ClassName}>Believe</div>
                                <div className={showBelief_down_ClassName}>Don't believe</div>
                                <select className={showContextSelectorClassName} >
                                    <option>all</option>
                                    <option>bitcoin</option>
                                    <option>covid-19</option>
                                </select>
                            </div>

                            <div className={showOntologyClassName} >
                                <div className="grapevineContainerLeftCol" >
                                    <span class="tooltiptext">Ontology<br/>influence over things like: categorizations of contexts, definitions of words, data structures and schemas, and other social constructs</span>
                                    Ontology:
                                </div>
                                <div className={showOntology_up_ClassName} >Trust</div>
                                <div className={showOntology_down_ClassName}>Don't trust</div>
                                <select className={showContextSelectorClassName} >
                                    <option>all</option>
                                    <option>nostr relays</option>
                                    <option>genders</option>
                                </select>
                            </div>

                            <div className={showAdviceClassName} >
                                <div className="grapevineContainerLeftCol" >
                                    <span class="tooltiptext">Judgement:<br/>influence judgement of things like which nostr relays to trust</span>
                                    Judgement / advice:
                                </div>
                                <div className={showAdvice_up_ClassName} >Trust</div>
                                <div className={showAdvice_down_ClassName} >Don't trust</div>
                                <select className={showContextSelectorClassName} >
                                    <option>all topics</option>
                                    <option>nostr relays</option>
                                    <option>dating</option>
                                </select>
                            </div>

                            <div className={showNostrClassName} >
                                <div className="grapevineContainerLeftCol" >
                                    <span class="tooltiptext">Nostr relays:<br/>influence judgement regarding which nostr relays to trust, and on what topics</span>
                                    Nostr relays:
                                </div>
                                <div className={showNostr_up_ClassName} >Trust</div>
                                <div className={showNostr_down_ClassName} >Don't trust</div>
                                <select className={showContextSelectorClassName} >
                                    <option>all relays</option>
                                    <option>eCommerce relays</option>
                                    <option>dating app relays</option>
                                    <option>news relays</option>
                                </select>
                            </div>

                        </div>
                    </div>
                </div>
            </>
        );
    }
}

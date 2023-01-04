import React, { useState, useEffect, useRef } from 'react';
import { NavLink } from "react-router-dom";
import * as MiscAppFxns from "../../lib/app/misc.ts";

const timeout = MiscAppFxns.timeout

const jQuery = require("jquery");

const MainFeedTypeSelector2 = (props) => {

    return (
        <>

        </>
    );
}

export default class MainFeedTypeSelector extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            mainFeedType: window.mainFeed.type,
            isFirehoseSelected: false,
            isFollowingSelected: false,
            isGrapevineSelected: true,
            numFollowingContainerClass: "numFollowingContainer_show",
        }
    }
    async componentDidMount() {
        if (window.mainFeed.type=="firehose") {
            this.setState({isFirehoseSelected:true,isFollowingSelected:false,isGrapevineSelected:false,numFollowingContainerClass:"numFollowingContainer_hide"})
            this.forceUpdate();
        }
        if (window.mainFeed.type=="following") {
            this.setState({isFirehoseSelected:false,isFollowingSelected:true,isGrapevineSelected:false,numFollowingContainerClass:"numFollowingContainer_show"})
            this.forceUpdate();
        }
        if (window.mainFeed.type=="grapevine") {
            this.setState({isFirehoseSelected:false,isFollowingSelected:false,isGrapevineSelected:true,numFollowingContainerClass:"numFollowingContainer_hide"})
            this.forceUpdate();
        }
        jQuery("#mainFeedTypeSelector").change(async function(){
            var newType = jQuery("#mainFeedTypeSelector option:selected").data("type")
            console.log("mainFeedTypeSelector changed to: "+newType)
            window.mainFeed.type = newType
            await timeout(10)
            jQuery("#mainFeedButton").get(0).click()
        })
    }

    render() {
        const pubkey = this.props.pubkey;
        return (
            <>
                <NavLink  to='/LandingPage' id="mainFeedButton" style={{display:"none"}} >
                    <div style={{fontSize:"12px",lineHeight:"100%"}} >landing page</div>
                </NavLink>
                <div id="numFollowingContainer" className={this.state.numFollowingContainerClass} >
                You are following {this.props.following.length} users.
                </div>
                <select id="mainFeedTypeSelector" >
                    <option data-type="firehose" value="firehose" selected={this.state.isFirehoseSelected} >firehose</option>
                    <option data-type="following" value="following" selected={this.state.isFollowingSelected} >following</option>
                    <option data-type="grapevine" value="grapevine" disabled="disabled" selected={this.state.isGrapevineSelected} >grapevine</option>
                </select>
            </>
        );
    }
}

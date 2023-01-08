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
            isFFollowingSelected: false,
            isGrapevineSelected: true,
            isOtherUserFollowingSelected: false,
            numFollowingContainerClass: "numFollowingContainer_show",
            numFFollowingContainerClass: "numFFollowingContainer_show",
        }
    }
    async componentDidMount() {
        if (window.mainFeed.type=="firehose") {
            this.setState({isFirehoseSelected:true,isFollowingSelected:false,isFFollowingSelected:false,isGrapevineSelected:false,isOtherUserFollowingSelected:false,numFollowingContainerClass:"numFollowingContainer_hide",numFFollowingContainerClass:"numFollowingContainer_hide"})
            this.forceUpdate();
        }
        if (window.mainFeed.type=="following") {
            this.setState({isFirehoseSelected:false,isFollowingSelected:true,isFFollowingSelected:false,isGrapevineSelected:false,isOtherUserFollowingSelected:false,numFollowingContainerClass:"numFollowingContainer_show",numFFollowingContainerClass:"numFollowingContainer_hide"})
            this.forceUpdate();
        }
        if (window.mainFeed.type=="ffollowing") {
            this.setState({isFirehoseSelected:false,isFollowingSelected:false,isFFollowingSelected:true,isGrapevineSelected:false,isOtherUserFollowingSelected:false,numFollowingContainerClass:"numFollowingContainer_hide",numFFollowingContainerClass:"numFollowingContainer_show"})
            this.forceUpdate();
        }
        if (window.mainFeed.type=="grapevine") {
            this.setState({isFirehoseSelected:false,isFollowingSelected:false,isFFollowingSelected:false,isGrapevineSelected:true,isOtherUserFollowingSelected:false,numFollowingContainerClass:"numFollowingContainer_hide",numFFollowingContainerClass:"numFollowingContainer_hide"})
            this.forceUpdate();
        }
        if (window.mainFeed.type=="otherUserFollowing") {
            this.setState({isFirehoseSelected:false,isFollowingSelected:false,isFFollowingSelected:false,isGrapevineSelected:false,isOtherUserFollowingSelected:true,numFollowingContainerClass:"numFollowingContainer_hide",numFFollowingContainerClass:"numFollowingContainer_hide"})
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
                <div>
                    <NavLink  to='/LandingPage' id="mainFeedButton" style={{display:"none"}} >
                        <div style={{fontSize:"12px",lineHeight:"100%"}} >landing page</div>
                    </NavLink>
                    <div id="numFollowingContainer" className={this.state.numFollowingContainerClass} >
                        You are following
                        <NavLink onClick={() => { window.clickedPubKey=window.myPubkey; } } to='/FollowingList' style={{marginLeft:"5px"}} >
                            {this.props.following.length} users
                        </NavLink>.
                    </div>
                    <div id="numFFollowingContainer" className={this.state.numFFollowingContainerClass} >
                        Extended following list (your following list + their following lists) ({this.props.extendedFollowing.length} users)
                    </div>
                    <select id="mainFeedTypeSelector"  >
                        <option data-type="following" value="following" selected={this.state.isFollowingSelected} >following list</option>
                        <option data-type="ffollowing" value="ffollowing" selected={this.state.isFFollowingSelected} >Extended &#8482; following list</option>
                        <option data-type="firehose" value="firehose" selected={this.state.isFirehoseSelected} >firehose</option>
                        <option data-type="otherUserFollowing" value="otherUserFollowing" disabled="disabled" style={{display:"none"}} selected={this.state.isOtherUserFollowingSelected} >_____'s following list</option>
                        <option data-type="grapevine" value="grapevine" disabled="disabled" style={{display:"none"}} selected={this.state.isGrapevineSelected} >grapevine</option>
                    </select>
                </div>
            </>
        );
    }
}

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
import MainFeedTypeSelector from "./mainFeedTypeSelector";

import { useNostrEvents, dateToUnix } from "nostr-react";

const jQuery = require("jquery");
const updateMainColWidth = MiscAppFxns.updateMainColWidth;
const cloneObj = MiscAppFxns.cloneObj
const secsToTime = MiscAppFxns.secsToTime
const timeout = MiscAppFxns.timeout

const GlobalFeed = ( ) => {
    const now = useRef(new Date()); // Make sure current time isn't re-rendered
    const currentTime = dateToUnix(now.current)

    if (window.mainFeed.type=="firehose") {
        const howLongAgo = 30 * 60; // 60 * 60 = fetch messages as old as one hour
        const sinceAgo = currentTime - howLongAgo;
        var { events } = useNostrEvents({
            filter: {
                since: sinceAgo, // all new events from now
                kinds: [1],
            },
        });
    }
    var aAuthors = [];
    if (window.myProfile) {
        aAuthors = window.myProfile.following
    }
    if (window.mainFeed.type=="following") {
        var numFollowing = aAuthors.length;
        const howLongAgo = 2 * 24 * 60 * 60; // 60 * 60 = fetch messages as old as one hour
        const sinceAgo = currentTime - howLongAgo;
        var { events } = useNostrEvents({
            filter: {
                authors: aAuthors,
                since: sinceAgo, // all new events from now
                kinds: [1],
            },
        });
    }
    return (
        <>
            <div style={{position:"relative",height:"30px"}} >
                <div className="mainFeedTypeSelector" >
                    <MainFeedTypeSelector following={aAuthors}  />
                </div>
            </div>
            <div>
                <pre style={{display:"none"}} >
                {JSON.stringify(window.profiles,null,4)}
                </pre>
                {events.map( (event) => {
                    const pk = event.pubkey;
                    // const name = event.name;

                    // ONE of the following:
                    // <AvatarElem pubkey={pk} />
                    // <img className="smallAvatarBox" />

                    // <NameElem pubkey={pk} />

                    jQuery(".eventNameContainer").unbind("click").click(async function(){
                        var clickedPubKey = jQuery(this).data("pubkey")
                        console.log("eventNameContainer clicked; clickedPubKey: "+clickedPubKey)
                        jQuery("#userProfileContainer").html(clickedPubKey)
                        window.clickedPubKey = clickedPubKey;
                        jQuery("#userProfileButton").get(0).click();
                    })
                    var pic_url = "";
                    var name = "..." + pk.slice(-6);
                    var nameClass = "nameUnknown";
                    var avatarClass_blank = "smallAvatarBox_show";
                    var avatarClass_pic = "smallAvatarBox_hide";
                    if (window.profiles.hasOwnProperty(pk)) {
                        var oEvent_this = window.profiles[pk]
                        pic_url = JSON.parse(oEvent_this.content).picture;
                        name = JSON.parse(oEvent_this.content).name;
                        nameClass = "nameKnown";
                        var avatarClass_blank = "smallAvatarBox_hide";
                        var avatarClass_pic = "smallAvatarBox_show";
                    }
                    const howOld = secsToTime(event.created_at)
                    const avatarID = "smallAvatarContainer_"+pk;
                    return (
                        <>
                            <div className="eventContainer" >
                                <div id={avatarID} className="smallAvatarContainer" >
                                    <img src={BlankAvatar} className={avatarClass_blank} />
                                    <img src={pic_url} className={avatarClass_pic} />
                                </div>
                                <div className="eventMainBodyContainer" >
                                    <div className="eventNameAndTimeContainer" >
                                        <div className="eventNameContainer" data-pubkey={pk} >
                                            <span className={nameClass} style={{marginRight:"10px"}}>{name}</span>
                                        </div>
                                        <div className="eventTimeContainer" >
                                            {howOld}
                                        </div>
                                    </div>
                                    <div className="eventContentContainer" >
                                        {event.content}
                                    </div>
                                </div>
                            </div>
                            <pre style={{border:"1px solid purple",padding:"5px",margin:"5px",display:"none"}}>
                            {JSON.stringify(event,null,4)}
                            </pre>
                        </>
                    )}
                )}
            </div>
        </>
    );
};

export default class Home extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
          events: []
        }
    }

    async componentDidMount() {
        updateMainColWidth();
        document.getElementById("mastheadCenterContainer").innerHTML = "main feed"

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
                        <NavLink  to='/UserProfile' id="userProfileButton" style={{display:"none"}} >
                            <div style={{fontSize:"12px",lineHeight:"100%"}} >user profile</div>
                            <div id="userProfileContainer" ></div>
                        </NavLink>

                        <GlobalFeed />

                    </div>
                </div>
            </>
        );
    }
}

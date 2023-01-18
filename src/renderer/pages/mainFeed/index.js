import React, { useState, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
import { Link, NavLink } from "react-router-dom";
import Masthead from '../../mastheads/mainMasthead.js';
import LeftNavbar from '../../navbars/leftNav.js';
import * as MiscAppFxns from "../../lib/app/misc.ts";
import MainFeedTypeSelector from "./mainFeedTypeSelector";
import UserPost from "../components/userPost";

import { useNostrEvents, useProfile, dateToUnix } from "nostr-react";

const jQuery = require("jquery");
const updateMainColWidth = MiscAppFxns.updateMainColWidth;

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
    var aExtendedAuthors = [];
    if (window.aExtendedAuthors) {
        aExtendedAuthors = window.aExtendedAuthors
    }
    // console.log("aAuthors: "+JSON.stringify(aAuthors))
    // console.log("aExtendedAuthors: "+JSON.stringify(aExtendedAuthors))
    // console.log("window.mainFeed.type: "+window.mainFeed.type)
    if (window.mainFeed.type=="following") {
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
    if (window.mainFeed.type=="ffollowing") {
        const howLongAgo = 2 * 24 * 60 * 60; // 60 * 60 = fetch messages as old as one hour
        const sinceAgo = currentTime - howLongAgo;
        var { events } = useNostrEvents({
            filter: {
                authors: aExtendedAuthors,
                since: sinceAgo, // all new events from now
                kinds: [1],
            },
        });
    }
    const currentPage="mainFeed";
    return (
        <>
            <div style={{position:"relative",height:"40px"}} >
                <div className="mainFeedTypeSelector" >
                    <MainFeedTypeSelector following={aAuthors} extendedFollowing={aExtendedAuthors}  />
                </div>
            </div>
            <div>
                {events.map( (event) => {
                    return (
                        <>
                            <UserPost
                                event={event}
                                currentPage={currentPage}
                            />
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

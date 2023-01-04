import React, { useState, useEffect, useRef } from 'react';
import { NavLink } from "react-router-dom";
import Masthead from '../../mastheads/mainMasthead.js';
import LeftNavbar from '../../navbars/leftNav.js';
import * as MiscAppFxns from "../../lib/app/misc.ts";
import FollowCounts from "./followCounts";
import FollowButton from "../followingList/followButton";
import LeaveGrapevineRatings from "./leaveGrapevineRatings";
import { useNostrEvents, useProfile } from "nostr-react";

import {
    Kind,
    dateToUnix,
} from "@nostrgg/react";

import {
    relayInit,
    nip19,
    generatePrivateKey,
    getPublicKey,
    getEventHash,
    signEvent,
    validateEvent,
    verifySignature,
} from 'nostr-tools'

const jQuery = require("jquery");

const updateMainColWidth = MiscAppFxns.updateMainColWidth;
const secsToTime = MiscAppFxns.secsToTime

const UserInfo = () => {
    var { events } = useNostrEvents({
        filter: {
            authors: [ window.clickedPubKey ],
            since: 0, // all new events from now
            kinds: [0],
        },
    });
    window.clickedAvatarHTML = "";
    window.clickedName = "..." + window.clickedPubKey.slice(-6);
    window.clickedAvatarUrl = "";
    if (events.length > 0) {
        // need to make sure sort order is correct
        events.sort((a, b) => parseFloat(b.created_at) - parseFloat(a.created_at));
        var event = events[0];
        var pic_url = JSON.parse(event.content).picture;
        window.clickedAvatarUrl = pic_url
        var picHTML = '<img src="'+pic_url+'" class=smallAvatarBox />';
        jQuery(".smallAvatarContainer").html(picHTML)
        var name = JSON.parse(event.content).name;
        window.clickedName = name;
        jQuery(".eventNameContainer").html(name)
        return (
            <>
                <pre style={{border:"2px solid blue",margin:"5px",padding:"5px",display:"none"}}>
                {JSON.stringify(event,null,4)}
                </pre>
                <div className="mainUserProfileBox" >
                    <div className="mainUserProfileLeftColumnContainer" >
                        <div id="largeAvatarContainer" className="largeAvatarContainer" >
                            <img src={ JSON.parse(event.content).picture } className='mainProfilePageAvatarBox' />
                        </div>

                        <FollowCounts pubkey={window.clickedPubKey} />
                    </div>

                    <div id="mainUserProfileRightColumnContainer" className="mainUserProfileRightColumnContainer" >
                        <div id="mainUserNameContainer" className="mainUserNameContainer" >
                            <span style={{color:"black"}} >
                                { JSON.parse(event.content).display_name }
                            </span>
                            <span style={{color:"grey",marginLeft:"10px"}} >
                                @{ JSON.parse(event.content).name }
                            </span>
                        </div>

                        <div id="mainUserAboutContainer" className="mainUserAboutContainer" >
                            { JSON.parse(event.content).about }
                        </div>

                        <LeaveGrapevineRatings pubkey={window.clickedPubKey} />

                        <div className="singleUserRightContainer" >
                            <FollowButton pubkey={window.clickedPubKey} />
                        </div>
                        <div className="userProfilePubkeyContainer" >
                            pubkey: {window.clickedPubKey}
                        </div>
                    </div>
                </div>
            </>
        );
    } else {
        return (
            <>
                <div className="mainUserProfileBox" >
                    <div id="largeAvatarContainer" className="largeAvatarContainer" >
                        <img className='mainProfilePageAvatarBox' />
                    </div>
                    <div id="mainUserProfileRightColumnContainer" className="mainUserProfileRightColumnContainer" >
                        <div id="mainUserNameContainer" className="mainUserNameContainer" style={{color:"grey"}} >
                            ... {window.clickedPubKey.slice(-6)}
                        </div>

                        <div id="mainUserAboutContainer" className="mainUserAboutContainer" style={{color:"grey"}}  >
                            about
                        </div>

                        <div style={{fontSize:"10px"}}>
                            pubkey: {window.clickedPubKey}
                        </div>
                    </div>
                </div>
            </>
        );
    }
};

const UserPosts = () => {
    var { events } = useNostrEvents({
        filter: {
            authors: [ window.clickedPubKey ],
            since: 0, // all new events from now
            kinds: [1],
        },
    });

    return (
        <>
            <div style={{textAlign:"right",marginRight:"20px"}} >{events.length} posts</div>
            {events.map( (event) => {
                var currentTime = Math.floor(Date.now() / 1000);
                var displayTime = secsToTime(event.created_at);
                return (
                  <>
                      <div className="eventContainer"  >
                          <pre style={{border:"1px solid purple",padding:"5px",marginBottom:"5px",display:"none"}} >
                          {JSON.stringify(event,null,4)}
                          </pre>

                          <div id="smallAvatarContainer" className="smallAvatarContainer" >
                              <img src={window.clickedAvatarUrl} className="smallAvatarBox" />
                          </div>
                          <div className="eventMainBodyContainer" >
                              <div className="eventNameAndTimeContainer" >
                                  <div className="eventNameContainer" data-pubkey={event.pubkey} >
                                      {window.clickedName}
                                  </div>
                                  <div className="eventTimeContainer" >
                                      {displayTime}
                                  </div>
                              </div>
                              <div className="eventContentContainer" >
                                  {event.content}
                              </div>
                          </div>
                      </div>
                  </>
                )}
            )}
        </>
    )
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
        document.getElementById("mastheadCenterContainer").innerHTML = "user profile"

        this.setState({events: [] })
        this.forceUpdate();
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
                        <UserInfo />
                        <UserPosts />
                    </div>
                </div>
            </>
        );
    }
}

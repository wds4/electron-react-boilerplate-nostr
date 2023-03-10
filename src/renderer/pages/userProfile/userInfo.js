import React, { useState, useEffect, useRef } from 'react';
import { NavLink } from "react-router-dom";
import FollowCounts from "./followCounts";
import FollowButton from "../components/followButton";
import LeaveGrapevineRatings from "./leaveGrapevineRatings";
import { useNostrEvents, useProfile } from "nostr-react";
import {nip19} from 'nostr-tools'
import * as MiscAppFxns from "../../lib/app/misc.ts";

const jQuery = require("jquery");

const UserInfo = () => {
    var { events } = useNostrEvents({
        filter: {
            authors: [ window.clickedPubKey ],
            since: 0, // all new events from now
            kinds: [0],
        },
    });
    var npub = nip19.npubEncode(window.clickedPubKey)
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
        // jQuery(".eventNameContainer").html(name)
        return (
            <>
                <pre style={{border:"2px solid blue",margin:"5px",padding:"5px",display:"none"}} >
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

                        <div className="userProfilePubkeyContainer" >
                            pubkey (hex): {window.clickedPubKey}<br/>
                            pubkey (bech32): {npub}
                        </div>

                        <div >
                            <div style={{display:"inline-block"}} >
                                <NavLink end to='/DirectMessageConversation' style={{textDecoration:"none"}} >
                                    <div style={{fontSize:"28px"}} >&#x1F4AC;</div>
                                </NavLink>
                            </div>
                            <div style={{display:"inline-block",marginLeft:"10px"}} >
                                <FollowButton
                                    pubkey={window.clickedPubKey}
                                    aFollowing={window.myProfile.following}
                                />
                            </div>
                        </div>

                        <div id="mainUserAboutContainer" className="mainUserAboutContainer" >
                            { JSON.parse(event.content).about }
                        </div>

                        <LeaveGrapevineRatings pubkey={window.clickedPubKey} />
                    </div>
                </div>
            </>
        );
    } else {
        return (
            <>
                <div className="mainUserProfileBox" >

                    <div className="mainUserProfileLeftColumnContainer" >
                        <div id="largeAvatarContainer" className="largeAvatarContainer" >
                            <img className='mainProfilePageAvatarBox' />
                        </div>

                        <FollowCounts pubkey={window.clickedPubKey} />
                    </div>

                    <div id="mainUserProfileRightColumnContainer" className="mainUserProfileRightColumnContainer" >
                        <div id="mainUserNameContainer" className="mainUserNameContainer" style={{color:"grey"}} >
                            <span style={{color:"grey",marginLeft:"10px"}} >
                                ... {window.clickedPubKey.slice(-6)}
                            </span>
                        </div>

                        <div style={{fontSize:"10px"}}>
                            pubkey: {window.clickedPubKey}
                        </div>

                        <div id="mainUserAboutContainer" className="mainUserAboutContainer" style={{color:"grey"}}  >
                            about
                        </div>

                        <LeaveGrapevineRatings pubkey={window.clickedPubKey} />

                        <div className="singleUserRightContainer" >
                            <FollowButton
                                pubkey={window.clickedPubKey}
                                aFollowing={window.myProfile.following}
                            />
                        </div>

                    </div>
                </div>
            </>
        );
    }
};

export default UserInfo;

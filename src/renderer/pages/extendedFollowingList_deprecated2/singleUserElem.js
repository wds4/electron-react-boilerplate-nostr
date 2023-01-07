import React, { useState, useEffect, useRef } from 'react';
import { NavLink } from "react-router-dom";
import Masthead from '../../mastheads/mainMasthead.js';
import LeftNavbar from '../../navbars/leftNav.js';
import * as MiscAppFxns from "../../lib/app/misc.ts";
import { useNostrEvents } from "nostr-react";
import { asyncSql } from "../../index.tsx";

import {
    dateToUnix,
} from "@nostrgg/react";

const jQuery = require("jquery");

const updateMainColWidth = MiscAppFxns.updateMainColWidth;
const secsToTime = MiscAppFxns.secsToTime
const cloneObj = MiscAppFxns.cloneObj

const SingleUserElem2 = (props) => {
    var pk = props.pubkey;
    var { events } = useNostrEvents({
        filter: {
            authors: [ props.pubkey ],
            since: 0, // all new events from now
            kinds: [0],
        },
    });

    if ( events.length > 0 ) {
        // events.sort((a, b) => parseFloat(b.created_at) - parseFloat(a.created_at));
        var event = events[events.length-1];
        var pic_url = JSON.parse(event.content).picture
        var name = JSON.parse(event.content).name;
        var display_name = JSON.parse(event.content).display_name;
        var about = JSON.parse(event.content).about;
        var pk_next = event.pubkey;
        var navLinkElem = "goToUserProfileButton"+pk_next;
        jQuery(".goToUserProfileButton").click(function(){
            // console.log("=======================; window.clickedPubKey: "+window.clickedPubKey)
            window.clickedPubKey = jQuery(this).data("pubkey");
            // console.log("=======================; window.clickedPubKey: "+window.clickedPubKey)
        })
        return (
            <>
                <div className="singleUserContainer" >
                    <NavLink to='/UserProfile' id={navLinkElem} className="goToUserProfileButton" data-pubkey={pk_next} >
                        <div className="userListSmallAvatarContainer" >
                            <img src={pic_url} className="userListSmallAvatarBox" />
                        </div>
                        <div className="singleUserMainBodyContainer" >
                            <div className="eventNameAndTimeContainer" >
                                <div className="eventNameContainer" data-pubkey={pk} >
                                    <span style={{color:"black"}} >
                                        {display_name}
                                    </span>
                                    <span style={{color:"grey",marginLeft:"10px"}} >
                                        {name}
                                    </span>
                                </div>
                                <div className="eventTimeContainer" style={{color:"grey"}} >
                                    ... {pk.slice(-6)}
                                </div>
                            </div>
                            <div className="eventContentContainer" >
                                {about}
                            </div>
                            <pre style={{display:"none",border:"2px solid orange",margin:"5px",padding:"5px"}} >
                            {JSON.stringify(JSON.parse(event.content),null,4)}
                            </pre>
                        </div>
                    </NavLink>
                </div>
            </>
        );
    } else {
        var name = "";
        var display_name = "";
        var about = "";
        var pk_next = props.pubkey;
        var navLinkElem = "goToUserProfileButton"+pk_next;
        return (
            <>
                <div className="singleUserContainer" >
                    <NavLink to='/UserProfile' id={navLinkElem} className="goToUserProfileButton" data-pubkey={pk_next} >
                        <div className="userListSmallAvatarContainer" >
                            <img className="userListSmallAvatarBox" />
                        </div>
                        <div className="singleUserMainBodyContainer" >
                            <div className="eventNameAndTimeContainer" >
                                <div className="eventNameContainer" data-pubkey={pk} >
                                    <span style={{color:"black"}} >
                                        {display_name}
                                    </span>
                                    <span style={{color:"grey",marginLeft:"10px"}} >
                                        {name}
                                    </span>
                                </div>
                                <div className="eventTimeContainer" style={{color:"grey"}} >
                                    ... {pk.slice(-6)}
                                </div>
                            </div>
                            <div className="eventContentContainer" >
                                {about}
                            </div>
                        </div>
                    </NavLink>
                </div>
            </>
        );
    }

}

export default class SingleUserElem extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        }
    }
    async componentDidMount() {
    }
    render() {
        const pk = this.props.pubkey;
        return (
            <>
                <SingleUserElem2 pubkey={pk} />
            </>
        );
    }
}

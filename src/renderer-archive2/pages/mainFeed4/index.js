import React, { useState, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
import { NavLink } from "react-router-dom";
import Masthead from '../../mastheads/mainMasthead.js';
import LeftNavbar from '../../navbars/leftNav.js';
import * as MiscAppFxns from "../../lib/app/misc.ts";
import AvatarElem from "./avatarElem";
import NameElem from "./nameElem";

import { useNostrEvents, dateToUnix } from "nostr-react";

const jQuery = require("jquery");
const updateMainColWidth = MiscAppFxns.updateMainColWidth;
const cloneObj = MiscAppFxns.cloneObj
const secsToTime = MiscAppFxns.secsToTime
const timeout = MiscAppFxns.timeout

const GlobalFeed = () => {
    const now = useRef(new Date()); // Make sure current time isn't re-rendered
    const currentTime = dateToUnix(now.current)
    const howLongAgo = 15 * 60; // 60 * 60 = fetch messages as old as one hour
    const sinceAgo = currentTime - howLongAgo;
    var { events } = useNostrEvents({
        filter: {
            since: sinceAgo, // all new events from now
            kinds: [1],
        },
    });
    var eventz = cloneObj(events);

    return (
        <>
        {eventz.map( (event) => {
            const pk = event.pubkey;
            // const name = event.name;

            // <AvatarElem pubkey={pk} />
            // <NameElem pubkey={pk} />

            jQuery(".eventNameContainer").unbind("click").click(async function(){
                var clickedPubKey = jQuery(this).data("pubkey")
                console.log("eventNameContainer clicked; clickedPubKey: "+clickedPubKey)
                jQuery("#userProfileContainer").html(clickedPubKey)
                window.clickedPubKey = clickedPubKey;
                jQuery("#userProfileButton").get(0).click();
            })
            const howOld = secsToTime(event.created_at)
            const avatarID = "smallAvatarContainer_"+pk;
            return (
              <>
                  <div className="eventContainer"  >
                      <div id={avatarID} className="smallAvatarContainer" >
                          <img className="smallAvatarBox" />
                      </div>
                      <div className="eventMainBodyContainer" >
                          <div className="eventNameAndTimeContainer" >
                              <div className="eventNameContainer" data-pubkey={pk} >
                                  <span style={{color:"grey",marginRight:"10px"}}>... {pk.slice(-6)}</span>

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
              </>
            )}
          )}
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
        document.getElementById("mastheadCenterContainer").innerHTML = "main feed 4 (nostr-react)"

    }
    render() {
        return (
            <>
                <div id="menuCol" className="menuCol" >
                    <LeftNavbar />
                </div>
                <div id="mainCol" >
                    <Masthead />
                    <div id="mainPanel" >
                        <NavLink  to='/UserProfile2' id="userProfileButton" style={{display:"none"}} >
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

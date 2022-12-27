import React, { useState, useEffect, useRef } from 'react';
import { NavLink } from "react-router-dom";
import Masthead from '../../mastheads/mainMasthead.js';
import LeftNavbar from '../../navbars/leftNav.js';
import * as MiscAppFxns from "../../lib/app/misc.ts";

import { useNostrEvents, dateToUnix } from "nostr-react";

const fetchProfilesInfo = async () => {
   var aProfileInfo = [];

   var sql = ""
   sql += "SELECT * FROM nostrProfiles "

   var aNostrProfilesData = await asyncSql(sql);
   for (var n=0;n<aNostrProfilesData.length;n++) {
      var oNextProfileInfo = aNostrProfilesData[n];
      var pK = oNextProfileInfo.pubkey;
      var name = oNextProfileInfo.name;
      var picture_url = oNextProfileInfo.picture_url;
      aProfileInfo[pK] = {};
      if (name) {
          aProfileInfo[pK].name = name;
      } else {
          aProfileInfo[pK].name = "..."+pK.slice(-6);
      }
      if (picture_url) {
          aProfileInfo[pK].picture_url = picture_url;
      } else {
          aProfileInfo[pK].picture_url = null;
      }
   }
   return aProfileInfo;
}

const GlobalFeed = () => {
    const now = useRef(new Date()); // Make sure current time isn't re-rendered
    const currentTime = dateToUnix(now.current)
    const howLongAgo = 60 * 60; // 60 * 60 = fetch messages as old as one hour
    const sinceAgo = currentTime - howLongAgo;
    const { events } = useNostrEvents({
        filter: {
            since: sinceAgo, // all new events from now
            kinds: [1],
        },
    });

    return (
        <>
            {events.map((event) => (
                <>
                    <div className="eventContainer"  >
                        <div id="smallAvatarContainer" className="smallAvatarContainer" >
                            <img src={event.picture} className='smallAvatarBox' />
                        </div>
                        <div className="eventMainBodyContainer" >
                            <div className="eventNameAndTimeContainer" >
                                <div className="eventNameContainer" data-pubkey={event.pubkey} >
                                    {event.name}
                                </div>
                                <div className="eventTimeContainer" >
                                    {event.created_at}
                                </div>
                            </div>
                            <div className="eventContentContainer" >
                                {event.content}
                            </div>
                        </div>
                    </div>
                </>
            ))}
        </>
    );
};

const jQuery = require("jquery");

const updateMainColWidth = MiscAppFxns.updateMainColWidth;

export default class Home extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
          events: []
        }
    }

    async componentDidMount() {
        updateMainColWidth();
        document.getElementById("mastheadCenterContainer").innerHTML = "main feed (nostr-react)"

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

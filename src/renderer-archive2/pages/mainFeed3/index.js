import React, { useState, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
import { NavLink } from "react-router-dom";
import Masthead from '../../mastheads/mainMasthead.js';
import LeftNavbar from '../../navbars/leftNav.js';
import * as MiscAppFxns from "../../lib/app/misc.ts";

import { useNostrEvents, dateToUnix } from "nostr-react";

const jQuery = require("jquery");
const updateMainColWidth = MiscAppFxns.updateMainColWidth;
const cloneObj = MiscAppFxns.cloneObj
const secsToTime = MiscAppFxns.secsToTime
const timeout = MiscAppFxns.timeout

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

const fetchProfileInfo = async (pubkey) => {
   var aProfileInfo = [];

   var sql = ""
   sql += "SELECT * FROM nostrProfiles WHERE pubkey = '"+pubkey+"' "

   var aNostrProfilesData = await asyncSql(sql);

   return "NAME";
}

const fooFxn = (pk) => {
  const numProfiles = fetchProfilesInfo.length;
  // const name = await fetchProfileInfo(pk);
  return "FOO: "+numProfiles
}

const fetchAvatar = () => {
    timeout(1000);
    ReactDOM.render(<FetchAvatar />,
        document.getElementById("testElement")
    )
}

const FetchAvatar = () => {
    // const pk = this.props.pk;
    const pk="6867d899ce6b677b89052602cfe04a165f26bb6a1a6390355f497f9ee5cb0796"
    var { events } = useNostrEvents({
        filter: {
            authors: [ pk ],
            since: 0, // all new events from now
            kinds: [0],
        },
    });
    console.log("===========================; FetchAvatar; pk: "+pk)

    return (
        <>
            <div>--BAR {pk}</div>
            {events.map( (event) => {
                console.log("===========================; event.kind: "+event.kind)
                var pic_url = JSON.parse(event.content).picture;
                var picHTML = '<img src="'+pic_url+'" class=smallAvatarBox />';
                var name = JSON.parse(event.content).name;
                return (
                  <>
                    <div>inner Barrrr</div>
                    <img src={pic_url} className="smallAvatarBox" />
                  </>
                )}
            )}
        </>
    )
};



const GlobalFeed = () => {
    const now = useRef(new Date()); // Make sure current time isn't re-rendered
    const currentTime = dateToUnix(now.current)
    const howLongAgo = 60 * 60; // 60 * 60 = fetch messages as old as one hour
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
            var picture_url="";
            if (window.aProfileInfo.hasOwnProperty(pk)) {
               picture_url = window.aProfileInfo[pk].picture_url
            }
            var aFoo = Object.keys(window.aProfileInfo)

            jQuery(".eventNameContainer").unbind("click").click(async function(){
                var clickedPubKey = jQuery(this).data("pubkey")
                console.log("eventNameContainer clicked; clickedPubKey: "+clickedPubKey)
                jQuery("#userProfileContainer").html(clickedPubKey)
                window.clickedPubKey = clickedPubKey;
                jQuery("#userProfileButton").get(0).click();
            })
            const howOld = secsToTime(event.created_at)
            const avatarID = "smallAvatarContainer_"+pk;
            const pk_test = "howdy"
            fetchAvatar()
            return (
              <>
                  <div className="eventContainer"  >
                      <div id={avatarID} className="smallAvatarContainer" >
                          <img className='smallAvatarBox' />
                      </div>
                      <div className="eventMainBodyContainer" >
                          <div className="eventNameAndTimeContainer" >
                              <div className="eventNameContainer" data-pubkey={pk} >
                                  {pk.slice(-6)} foo: { fooFxn( event.pubkey ) } s {picture_url} {aFoo.length}
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
                        <div id="testElement">testElement</div>
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

import React, { useState, useEffect, useRef } from 'react';
import { Link, NavLink } from "react-router-dom";
import { useNostrEvents, useProfile } from "nostr-react";
import * as MiscAppFxns from "../../lib/app/misc.ts";
import ActionButtons from "../mainFeed/actionButtons.js";

const secsToTime = MiscAppFxns.secsToTime

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
                const linkTo = "/Thread/"+event.id;
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
                              <Link
                                  onClick={() => window.expandedEvent = event}
                                  className="eventContentContainer"
                                  to={linkTo}
                                  testVar = "foo"
                              >
                                  {event.content}
                              </Link>
                              <div className="eventActionButtonsContainer" >
                                  <ActionButtons
                                  event={event}
                                  />
                              </div>
                          </div>
                      </div>
                  </>
                )}
            )}
        </>
    )
};

export default UserPosts;

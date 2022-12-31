import React, { useState, useEffect, useRef } from 'react';
import Masthead from '../../mastheads/mainMasthead.js';
import LeftNavbar from '../../navbars/leftNav.js';
import * as MiscAppFxns from "../../lib/app/misc.ts";

import { useNostrEvents, dateToUnix } from "nostr-react";

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
          <p key={event.id}>{event.pubkey} posted: {event.content}</p>
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

                        <GlobalFeed />

                    </div>
                </div>
            </>
        );
    }
}

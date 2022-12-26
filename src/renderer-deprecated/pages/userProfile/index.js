import React from 'react';
import Masthead from '../../mastheads/mainMasthead.js';
import LeftNavbar from '../../navbars/leftNav.js';
import * as MiscAppFxns from "../../lib/app/misc.ts";

import { Kind, useNostrEvents, dateToUnix } from "@nostrgg/react";

const updateMainColWidth = MiscAppFxns.updateMainColWidth;

const ProfileFeed = () => {
  const { events } = useNostrEvents({
    filter: {
      authors: [
          "32e1827635450ebb3c5a7d12c1f8e7b2b514439ac10a67eef3d9fd9c5c68e245",
      ],
      since: 0,
      kinds: [Kind.TextNote],
    },
  });

  return (
    <>
      <div>Events from this profile:</div>
      {events.map((event) => (
        <p key={event.id}>{event.pubkey} posted: {event.content}</p>
      ))}
    </>
  );
};

export default class Home extends React.Component {
    constructor(props) {
        super(props);
        this.state = {}
    }
    async componentDidMount() {
        updateMainColWidth();
        document.getElementById("mastheadCenterContainer").innerHTML = "user profile"
        var pubKey = window.clickedPubKey;
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
                        <div className="h2">user profile</div>
                        <div id="profileFeedContainer" >(under construction)</div>
                        {window.clickedPubKey}
                        <ProfileFeed />
                    </div>
                </div>
            </>
        );
    }
}

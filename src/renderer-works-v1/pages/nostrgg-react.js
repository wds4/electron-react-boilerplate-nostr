import React from 'react';
import Masthead from './mastheads/mainMasthead.js';
import LeftNavbar from './navbars/leftNav.js';
import * as MiscAppFxns from "./lib/app/misc.ts";

import {
    Kind,
    useNostrEvents,
    dateToUnix,
    generateSignedEvent,
    SendMsgType,
    useNostr
} from "@nostrgg/react";

import {
    initNostr,
    SendMsgType,
    Kind,
} from "@nostrgg/client"

const updateMainColWidth = MiscAppFxns.updateMainColWidth;

const GlobalFeed = () => {
    const { isLoading, events } = useNostrEvents({
        filter: {
            kinds: [Kind.TextNote],
            since: dateToUnix(new Date()), // all new events from now
        },
    });

    return (
        <div style={{border:"1px solid purple"}}>
        <div>Global Feed</div>
            {events.map((event) => (
              <p key={event.id}>{event.pubkey} posted: {event.content}</p>
            ))}
        </div>
    );
};

initNostr({
  relayUrls: [
    "wss://nostr-pub.wellorder.net",
    "wss://nostr-relay.untethr.me",
  ],
  onConnect: (relayUrl, sendEvent) => {
    console.log("Nostr connected to:", relayUrl)

    // Send a REQ event to start listening to events from that relayer:
    sendEvent([SendMsgType.REQ, {
      filter: {
        kinds: [Kind.TextNote],
        since: 0, // All events since the dawn of time
      },
    }], relayUrl)
  },
  onEvent: (relayUrl, event) => {
    console.log("Nostr received event:", event)
  },
  debug: true, // Enable logs
});

const ProfileFeed = () => {
    const { events } = useNostrEvents({
        filter: {
          authors: [
              "9c2a6495b4e3de93f3e1cc254abe4078e17c64e5771abc676a5e205b62b1286c",
          ],
          since: 0,
          kinds: [Kind.TextNote],
        },
    });

    return (
        <div style={{border:"1px solid purple"}}>
        <div>Profile Feed</div>
            {events.map((event) => (
                <p key={event.id}>{event.pubkey} posted: {event.content}</p>
            ))}
        </div>
    );
};

const PostButton = () => {
  const { sendEvent } = useNostr();

  const onPost = async () => {
    const privKey = prompt("Paste your private key here:");

    if (!privKey) {
      alert("no private key provided");
      return;
    }

    const event = {
      content: "Hello world!",
      kind: Kind.TextNote,
      tags: [],
    };

    const signedEvent = await generateSignedEvent(event, privKey);

    sendEvent?.([SendMsgType.EVENT, signedEvent]);
  };

  return (
    <button onClick={onPost}>Post a message!</button>
  );
}

export default class Home extends React.Component {
    constructor(props) {
        super(props);
        this.state = {}
    }
    async componentDidMount() {
        updateMainColWidth();
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
                        <div className="h2">nostrgg-react</div>
                        <ProfileFeed />
                    </div>
                </div>
            </>
        );
    }
}

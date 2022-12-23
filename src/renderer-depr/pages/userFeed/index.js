import React from 'react';
import Masthead from '../../mastheads/mainMasthead.js';
import LeftNavbar from '../../navbars/leftNav.js';
import * as MiscAppFxns from "../../lib/app/misc.ts";

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

const returnEventBodyWidth = () => {
    const mainPanelWidth = document.getElementById("mainPanel").offsetWidth;
    const rootWidth = document.getElementById("root").offsetWidth;
    const newWidth = rootWidth - menuColWidth - 4;
    document.getElementById("mainCol").style.width = newWidth+"px";
}

initNostr({
    relayUrls: [
        "wss://nostr-pub.wellorder.net",
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
                <div>
                    <p key={event.id}>{event.pubkey} posted: {event.content}</p>
                </div>
            ))}
        </div>
    );
};

const updateMainColWidth = MiscAppFxns.updateMainColWidth;

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
                        <div className="h2">main feed</div>
                        <ProfileFeed />
                    </div>
                </div>
            </>
        );
    }
}

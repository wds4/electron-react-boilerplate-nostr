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


const GlobalFeed = () => {
    const currentTime = dateToUnix(new Date())
    const howLongAgo = 60 * 60; // 60 * 60 = fetch messages as old as from one hour ago
    const sinceAgo = currentTime - howLongAgo;
    const { events } = useNostrEvents({
        filter: {
            since: sinceAgo,
            kinds: [Kind.TextNote],
        },
    });

    return (
        <div className="mainFeedContainer" >
            {events.map( (event) => {
                const currentTime = dateToUnix(new Date());
                const createdAt = event.created_at;
                const howOld = createdAt - currentTime;
                const minOld = Math.floor(howOld / 60);
                var agoText = "";
                if (minOld < 0) {
                    const minOld_ = - minOld;
                    agoText += minOld_ + " min ago";
                }
                // const hourOld = Math.floor(minOld / 60);
                return (
                    <div className="eventContainer" >
                        <div className="smallAvatarContainer" >
                            avatar
                        </div>
                        <div className="eventMainBodyContainer" >
                            <div className="eventNameAndTimeContainer" >
                                <div className="eventNameContainer" >
                                    {event.pubkey}
                                </div>
                                <div className="eventTimeContainer" >
                                    {agoText}
                                </div>
                            </div>
                            <div className="eventContentContainer" >
                                {event.content}
                            </div>
                        </div>
                    </div>
                )}
            )}
        </div>
    );
};

const updateMainColWidth = MiscAppFxns.updateMainColWidth;

export default class Home extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
          events: {}
        }
    }
    async componentDidMount() {
        updateMainColWidth();

        /*
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
            onClose: () => {
                console.log("======================= onClose ========================== ")
            },
            debug: true, // Enable logs
        });
        */
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
                        <div >
                            <GlobalFeed />
                        </div>
                    </div>
                </div>
            </>
        );
    }
}

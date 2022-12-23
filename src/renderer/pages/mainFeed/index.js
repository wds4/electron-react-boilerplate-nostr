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
                const secondsOld = currentTime - createdAt;
                var howOldText = "";
                howOldText += secondsOld + " seconds ago";
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
                                    {howOldText}
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

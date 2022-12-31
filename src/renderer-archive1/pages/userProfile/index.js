import React from 'react';
import Masthead from '../../mastheads/mainMasthead.js';
import LeftNavbar from '../../navbars/leftNav.js';
import * as MiscAppFxns from "../../lib/app/misc.ts";

import {
    Kind,
    dateToUnix,
} from "@nostrgg/react";

import {
    relayInit,
    generatePrivateKey,
    getPublicKey,
    getEventHash,
    signEvent
} from 'nostr-tools'

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
        document.getElementById("mastheadCenterContainer").innerHTML = "user profile"
        var pubKey = window.clickedPubKey;

        const relay = relayInit('wss://relay.damus.io')
        await relay.connect()

        relay.on('connect', () => {
            console.log(`connected to ${relay.url}`)
        })
        relay.on('error', () => {
            console.log(`failed to connect to ${relay.url}`)
        })

        // let's query for an event that exists
        let sub = relay.sub([
          {
              authors: [ pubKey ],
              kinds: [Kind.TextNote],
          }
        ])
        sub.on('event', event => {
            console.log('userProfile page; got an event with event id: ', event.id)
            var aEvents = this.state.events
            aEvents.push(event)
            this.setState({events: aEvents})
            this.forceUpdate();

        })
        sub.on('eose', () => {
            sub.unsub()
        })

        jQuery(".leftNavButton").click(function(){
            relay.close()
            console.log("leftNavButton click")
        })
        jQuery("#userProfileButton").click(function(){
            relay.close()
            console.log("userProfileButton click")
        })
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
                        <div style={{display:"inline-block"}}>pubkey: {window.clickedPubKey}</div>

                        <div className="mainFeedContainer" id="mainFeedContainer" >
                            {this.state.events.map( (event) => {
                                const currentTime = dateToUnix(new Date());
                                const createdAt = event.created_at;
                                const secondsOld = currentTime - createdAt;
                                var howOldText = "";
                                howOldText += secondsOld + " seconds ago";
                                // const hourOld = Math.floor(minOld / 60);
                                const pubKey = event.pubkey;

                                return (
                                    <div className="eventContainer"  >
                                        <div className="smallAvatarContainer" >
                                            avatar
                                        </div>
                                        <div className="eventMainBodyContainer" >
                                            <div className="eventNameAndTimeContainer" >
                                                <div className="eventNameContainer" data-pubkey={pubKey} >
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

                    </div>
                </div>
            </>
        );
    }
}

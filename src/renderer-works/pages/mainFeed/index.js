import React from 'react';
import { NavLink } from "react-router-dom";
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
        const currentTime = dateToUnix(new Date())
        const howLongAgo = 60 * 60; // 60 * 60 = fetch messages as old as one hour
        const sinceAgo = currentTime - howLongAgo;

        // const relay = relayInit('wss://relay.damus.io')
        // const relay = relayInit('wss://nostr-pub.wellorder.net')
        const relay = relayInit('wss://nostr-relay.untethr.me')
        await relay.connect()

        relay.on('connect', () => {
            console.log(`connected to ${relay.url}`)
        })
        relay.on('error', () => {
            console.log(`failed to connect to ${relay.url}`)
        })

        let sub = relay.sub([
            {
                // authors: ["397f7a110d18b3643184dca6673d8fa812186a3a13009afa83c229c563a0a604"]
                since: sinceAgo,
                kinds: [Kind.TextNote],
            }
        ])
        sub.on('event', event => {
            console.log('mainFeed page; got an event with event id: ', event.id)
            var aEvents = this.state.events
            aEvents.push(event)
            this.setState({events: aEvents})
            this.forceUpdate();
        })
        sub.on('eose', () => {
            sub.unsub()
        })

        // if user navigates away from page, close relay
        const aNavButtons = document.getElementsByClassName("leftNavButton");
        for(var i = 0; i < aNavButtons.length; i++) {
            (function(index) {
                aNavButtons[index].addEventListener("click", function() {
                    relay.close()
                })
            })(i);
        }

        document.getElementById("userProfileButton").addEventListener("click",function(){
            relay.close()
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
                        <NavLink  to='/UserProfile' id="userProfileButton" style={{display:"none"}} >
                            <div style={{fontSize:"12px",lineHeight:"100%"}} >user profile</div>
                            <div id="userProfileContainer" ></div>
                        </NavLink>

                        <div className="mainFeedContainer" id="mainFeedContainer" >
                            {this.state.events.map( (event) => {
                                const currentTime = dateToUnix(new Date());
                                const createdAt = event.created_at;
                                const secondsOld = currentTime - createdAt;
                                var howOldText = "";
                                howOldText += secondsOld + " seconds ago";
                                // const hourOld = Math.floor(minOld / 60);
                                const pubKey = event.pubkey;

                                jQuery(".eventNameContainer").unbind("click").click(function(){
                                    var clickedPubKey = jQuery(this).data("pubkey")
                                    console.log("eventNameContainer clicked; clickedPubKey: "+clickedPubKey)
                                    jQuery("#userProfileContainer").html(clickedPubKey)
                                    window.clickedPubKey = clickedPubKey;
                                    jQuery("#userProfileButton").get(0).click();
                                })

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

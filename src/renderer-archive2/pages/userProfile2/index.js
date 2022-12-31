import React, { useState, useEffect, useRef } from 'react';
import Masthead from '../../mastheads/mainMasthead.js';
import LeftNavbar from '../../navbars/leftNav.js';
import * as MiscAppFxns from "../../lib/app/misc.ts";
import StoreProfileLocallyButton from "./storeProfileLocallyButton";

import { useNostrEvents } from "nostr-react";

import {
    Kind,
    dateToUnix,
} from "@nostrgg/react";

import {
    relayInit,
    generatePrivateKey,
    getPublicKey,
    getEventHash,
    signEvent,
    validateEvent,
    verifySignature,
} from 'nostr-tools'

const jQuery = require("jquery");

const updateMainColWidth = MiscAppFxns.updateMainColWidth;
const secsToTime = MiscAppFxns.secsToTime

window.clickedAvatarHTML = "";
window.clickedName = "barr"
window.clickedAvatarUrl = "";

const UserInfo = () => {
    var { events } = useNostrEvents({
        filter: {
            authors: [ window.clickedPubKey ],
            since: 0, // all new events from now
            kinds: [0],
        },
    });

    return (
        <>
            {events.map( (event) => {
                var pic_url = JSON.parse(event.content).picture;
                window.clickedAvatarUrl = pic_url
                var picHTML = '<img src="'+pic_url+'" class=smallAvatarBox />';
                jQuery(".smallAvatarContainer").html(picHTML)
                var name = JSON.parse(event.content).name;
                window.clickedName = name;
                jQuery(".eventNameContainer").html(name)
                return (
                  <>
                      <div className="mainUserProfileBox" >
                          <div id="largeAvatarContainer" className="largeAvatarContainer" >
                              <img src={ JSON.parse(event.content).picture } className='mainProfilePageAvatarBox' />
                          </div>
                          <div id="mainUserProfileRightColumnContainer" className="mainUserProfileRightColumnContainer" >
                              <div id="mainUserNameContainer" className="mainUserNameContainer" >
                                  { JSON.parse(event.content).name }
                                  <StoreProfileLocallyButton pubkey={window.clickedPubKey} />
                              </div>
                              <div id="mainUserAboutContainer" className="mainUserAboutContainer" >
                                  { JSON.parse(event.content).about }
                              </div>
                              <div style={{display:"inline-block",fontSize:"10px"}}>pubkey: {window.clickedPubKey}</div>
                          </div>
                      </div>
                  </>
                )}
            )}
        </>
    )
};

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
            <div>number of posts: {events.length}</div>
            {events.map( (event) => {
                var currentTime = Math.floor(Date.now() / 1000);
                var displayTime = secsToTime(event.created_at);
                return (
                  <>
                      <div className="eventContainer"  >
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
                              <div className="eventContentContainer" >
                                  {event.content}
                              </div>
                          </div>
                      </div>
                  </>
                )}
            )}
        </>
    )
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
        document.getElementById("mastheadCenterContainer").innerHTML = "user profile 2"

        this.setState({events: [] })
        this.forceUpdate();

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
                        <UserInfo />
                        <UserPosts />
                    </div>
                </div>
            </>
        );
    }
}

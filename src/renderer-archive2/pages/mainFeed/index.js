import React from 'react';
import { NavLink } from "react-router-dom";
import Masthead from '../../mastheads/mainMasthead.js';
import LeftNavbar from '../../navbars/leftNav.js';
import * as MiscAppFxns from "../../lib/app/misc.ts";
import { asyncSql } from "../../index.tsx";

import {nip05} from 'nostr-tools'

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
const isValidObj = MiscAppFxns.isValidObj;

const fetchProfilesInfo = async () => {
   var aProfileInfo = [];

   var sql = ""
   sql += "SELECT * FROM nostrProfiles "

   var aNostrProfilesData = await asyncSql(sql);
   for (var n=0;n<aNostrProfilesData.length;n++) {
      var oNextProfileInfo = aNostrProfilesData[n];
      var pK = oNextProfileInfo.pubkey;
      var name = oNextProfileInfo.name;
      var picture_url = oNextProfileInfo.picture_url;
      aProfileInfo[pK] = {};
      if (name) {
          aProfileInfo[pK].name = name;
      } else {
          aProfileInfo[pK].name = "..."+pK.slice(-6);
      }
      if (picture_url) {
          aProfileInfo[pK].picture_url = picture_url;
      } else {
          aProfileInfo[pK].picture_url = null;
      }
   }
   return aProfileInfo;
}

export default class Home extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            events: []
        }
    }

    async componentDidMount() {
        updateMainColWidth();
        document.getElementById("mastheadCenterContainer").innerHTML = "main feed"

        const aProfileInfo = await fetchProfilesInfo()

        this.setState({events: [] })
        this.forceUpdate();

        const currentTime = dateToUnix(new Date())
        const howLongAgo = 60 * 60; // 60 * 60 = fetch messages as old as one hour
        const sinceAgo = currentTime - howLongAgo;

        // const relay = relayInit('wss://relay.damus.io')
        // const relay = relayInit('wss://nostr-pub.wellorder.net')
        // const relay = relayInit('wss://nostr-relay.untethr.me')
        const relay = relayInit('wss://nostr-relay.wlvs.space')
        // const relay = relayInit('wss://nostr.fmt.wiz.biz')
        // const relay = relayInit('wss://nostr.oxtr.dev') // doesn't work
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
                // authors: ["683b9a799a36bfc9a147e8eac8cf2044dfc3a68adb81cd7b4b00362f7ffd1f04"], // me
                since: sinceAgo,
                // since: 0,
                kinds: [Kind.TextNote],
                // kinds: [0],
            }
        ])
        sub.on('event', event => {
            // if (isValidObj(event)) {
                let ok = validateEvent(event)
                let veryOk = verifySignature(event)

                console.log('mainFeed page; got an event with event id: '+ event.id+'; ok: '+ok+'; veryOk: '+veryOk)

                if ((ok) && (veryOk)) {
                    var aEvents = this.state.events
                    var pK = event.pubkey;
                    event.name = "..." + pK.slice(-6);
                    if (aProfileInfo.hasOwnProperty(pK)) {
                      if (aProfileInfo[pK].hasOwnProperty("name")) {
                          event.name = aProfileInfo[pK].name;
                      }
                      if (aProfileInfo[pK].hasOwnProperty("picture_url")) {
                          event.picture_url = aProfileInfo[pK].picture_url;
                      }
                    }
                    aEvents.push(event)
                    aEvents.sort((a, b) => parseFloat(b.created_at) - parseFloat(a.created_at));
                    this.setState({events: aEvents})
                    this.forceUpdate();
                    console.log(event)
                }
            // }
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
                                const name = event.name;
                                const picture_url = event.picture_url;
                                var pictureHTML = "<img src='"+picture_url+"' class='smallAvatarBox' />";

                                jQuery(".eventNameContainer").unbind("click").click(async function(){
                                    var clickedPubKey = jQuery(this).data("pubkey")
                                    console.log("eventNameContainer clicked; clickedPubKey: "+clickedPubKey)
                                    jQuery("#userProfileContainer").html(clickedPubKey)
                                    window.clickedPubKey = clickedPubKey;
                                    jQuery("#userProfileButton").get(0).click();
                                })

                                return (
                                    <div className="eventContainer"  >
                                        <div id="smallAvatarContainer" className="smallAvatarContainer" >
                                            <img src={picture_url} className='smallAvatarBox' />
                                        </div>
                                        <div className="eventMainBodyContainer" >
                                            <div className="eventNameAndTimeContainer" >
                                                <div className="eventNameContainer" data-pubkey={pubKey} >
                                                    {name}
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

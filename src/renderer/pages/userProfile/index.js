import React from 'react';
import Masthead from '../../mastheads/mainMasthead.js';
import LeftNavbar from '../../navbars/leftNav.js';
import * as MiscAppFxns from "../../lib/app/misc.ts";

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

const fetchProfileInfo = async (pK) => {
   var sql = ""
   sql += "SELECT * FROM nostrProfiles WHERE pubkey = '"+pK+"' "

   var aNostrProfileData = await asyncSql(sql);
   var oProfileInfo = aNostrProfileData[0];

   console.log("oProfileInfo: "+JSON.stringify(oProfileInfo,null,4))

   if (oProfileInfo) {
       var pK = oProfileInfo.pubkey;
       var name = oProfileInfo.name;
       var about = oProfileInfo.about;
       var picture_url = oProfileInfo.picture_url;

       if (name) {
          jQuery("#mainUserNameContainer").html(name)
       }
       if (about) {
          jQuery("#mainUserAboutContainer").html(about)
       }
       if (picture_url) {
            var avatarHTML = "<img src='"+picture_url+"' class='mainProfilePageAvatarBox' />"
           jQuery("#largeAvatarContainer").html(avatarHTML)
       }
       jQuery("#sqlInfoContainer").html(JSON.stringify(oProfileInfo,null,4))
       return true; // indicates success
   } else {
      return false; // indicates failure
   }
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
        document.getElementById("mastheadCenterContainer").innerHTML = "user profile"

        this.setState({events: [] })
        this.forceUpdate();

        var pubKey = window.clickedPubKey;

        var success = await fetchProfileInfo(pubKey);

        let profile = await nip05.queryProfile('jb55.com')
        console.log(profile.pubkey)
        // prints: 32e1827635450ebb3c5a7d12c1f8e7b2b514439ac10a67eef3d9fd9c5c68e245
        console.log(profile.relays)
        // prints: [wss://relay.damus.io]
        console.log(profile)
        let fooSearchDomain = await nip05.searchDomain('jb55.com')
        console.log("fooSearchDomain: "+JSON.stringify(fooSearchDomain,null,4))

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

        // let's query for an event that exists
        let sub = relay.sub([
          {
              authors: [ window.clickedPubKey ],
              kinds: [Kind.TextNote],
          }
        ])
        sub.on('event', event => {
            let ok = validateEvent(event)
            let veryOk = verifySignature(event)

            // console.log('userProfile page; got an event with event id: '+ event.id+'; ok: '+ok+'; veryOk: '+veryOk)

            if ((ok) && (veryOk)) {
                var aEvents = this.state.events
                aEvents.push(event)
                this.setState({events: aEvents})
                this.forceUpdate();
                // console.log(event)
            }

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
                        <div className="mainUserProfileBox" >
                            <div id="largeAvatarContainer" className="largeAvatarContainer" >
                                largeAvatarContainer
                            </div>
                            <div id="mainUserProfileRightColumnContainer" className="mainUserProfileRightColumnContainer" >
                                <div id="mainUserNameContainer" className="mainUserNameContainer" >
                                    mainUserNameContainer
                                </div>
                                <div id="mainUserAboutContainer" className="mainUserAboutContainer" >
                                    mainUserAboutContainer
                                </div>
                                <div style={{display:"inline-block",fontSize:"10px"}}>pubkey: {window.clickedPubKey}</div>
                            </div>
                        </div>
                        <div id="sqlInfoContainer" style={{display:"none"}} >sqlInfoContainer</div>


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

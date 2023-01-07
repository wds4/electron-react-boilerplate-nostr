import React, { useState, useEffect, useRef } from 'react';
import Masthead from '../../mastheads/mainMasthead.js';
import LeftNavbar from '../../navbars/leftNav.js';
import * as MiscAppFxns from "../../lib/app/misc.ts";
// import FetchFollowingList from "./fetchFollowingList"
import NFG_Graphic1, { nodes } from "./graphic";
import { useNostrEvents } from "nostr-react";
import { doesEventValidate } from "../../lib/nostr/eventValidation";

import {
    relayInit,
    generatePrivateKey,
    getPublicKey,
    getEventHash,
    signEvent,
    validateEvent,
    verifySignature,
} from 'nostr-tools'

const timeout = MiscAppFxns.timeout

const jQuery = require("jquery");

const updateMainColWidth = MiscAppFxns.updateMainColWidth;





const FetchFollowingList = ({staet, pubkeyz, updatePubkeys}) => {
    var aAuthors = Object.keys(pubkeyz)
    // console.log("aAuthors: "+JSON.stringify(aAuthors))
    var { events } = useNostrEvents({
        filter: {
            authors: aAuthors,
            since: 0,
            kinds: [0,3],
        },
    });

    {events.map( async (event) => {
        await timeout(100);
        if (doesEventValidate) {
            var kind = event.kind;
            var created_at = event.created_at
            var aPk = event.pubkey

            // profile information
            if (kind==0) {
                if (pubkeyz[aPk]) { // this should always be true (but check just to make sure)
                    created_at_current = pubkeyz[aPk].profileData.created_at;
                    if (created_at_current < created_at) {
                        pubkeyz[aPk].profileData.name = JSON.parse(event.content).name;
                        pubkeyz[aPk].profileData.display_name = JSON.parse(event.content).display_name;
                        pubkeyz[aPk].profileData.picture_url = JSON.parse(event.content).picture;
                        pubkeyz[aPk].profileData.created_at = created_at;
                    }
                }
            }

            // follower information
            if (kind==3) {
                var aFollowing = event.tags

                var thisAuthorLevel = pubkeyz[aPk].followingData.level;
                if (thisAuthorLevel < 2) {
                    var thisAuthorLevelNext = pubkeyz[aPk].followingData.level + 1;

                    var created_at_current = 0;
                    var following_current = [];
                    if (pubkeyz[aPk]) {
                        created_at_current = pubkeyz[aPk].followingData.created_at;
                        following_current = pubkeyz[aPk].followingData.following;
                    }
                    if (created_at_current < created_at) {
                        // this event is newer than the one currently on file
                        pubkeyz[aPk].followingData.created_at = created_at
                        pubkeyz[aPk].followingData.following = aFollowing
                        var numPk = Object.keys(pubkeyz).length;
                        console.log("=======numPk: "+numPk)
                        updatePubkeys(pubkeyz);
                    }
                    for (var f=0;f<aFollowing.length;f++) {
                        if (aFollowing[f][0]=="p") {
                            var nextPk = aFollowing[f][1];
                            // if nextPk has already been added, make sure its level is correct
                            // (there may be instances where it initally appears as level N, but it turns out to be closer than that)
                            if (pubkeyz[nextPk]) {
                                var currentLevel = pubkeyz[nextPk].followingData.level;
                                // new level is mininum of currentLevel and thisAuthorLevelNext
                                if (thisAuthorLevelNext < currentLevel) {
                                    pubkeyz[nextPk].followingData.level = thisAuthorLevelNext;
                                    // only update if change is made (maybe check at end of this script if change is made?)
                                    updatePubkeys(pubkeyz);
                                }
                            }
                            // if nextPk has not been added, initialize it here
                            if (!pubkeyz[nextPk]) {
                                pubkeyz[nextPk] = {
                                    profileData: {
                                        name: null,
                                        display_name: null,
                                        picture_url: null,
                                        created_at: 0
                                    },
                                    followingData: {
                                        level: thisAuthorLevelNext,
                                        created_at: 0,
                                        following: []
                                    }
                                }
                                updatePubkeys(pubkeyz);
                            }
                        }
                    }
                }
            }
        }
    })}

    return (
        <>
            <div>
                <div>
                    number of users: {Object.keys(pubkeyz).length}
                </div>
                <pre style={{border:"1px solid orange",maxHeight:"300px",overflow:"scroll",display:"none"}} >
                    {JSON.stringify(pubkeyz,null,4)}
                </pre>
            </div>
        </>
    )
};





export default class ExtendedFollowerList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            seed: window.myPubkey,
            pubkeys: {
            }
        }
    }
    updatePubkeys = (pubkeys_new) => {
        // console.log("updatePubkeys; pubkeys_new: "+JSON.stringify(pubkeys_new))
        // var numPk_current = Object.keys(this.state.pubkeys).length;
        var numPk_new = Object.keys(pubkeys_new).length;
        // console.log("updatePubkeys; numPk_current: "+numPk_current+"; numPk_new: "+numPk_new)
        this.setState({pubkeys:pubkeys_new})
    }
    async componentDidMount() {
        updateMainColWidth();
        document.getElementById("mastheadCenterContainer").innerHTML = "following"

        var pubkeys_new = this.state.pubkeys;
        pubkeys_new[window.myPubkey] = {
            profileData: {
                name: null,
                display_name: null,
                picture_url: null,
                created_at: 0
            },
            followingData: {
                level: 0,
                created_at: 0,
                following: []
            }
        }

        this.setState({pubkeys:pubkeys_new})
    }
    render() {
        return (
            <>
                <div id="menuCol" className="menuCol" >
                    <LeftNavbar />
                </div>
                <div id="mainCol" >
                    <div id="mastheadElem" >
                        <Masthead />
                    </div>
                    <div id="mainPanel" >
                        <pre style={{border:"1px solid purple",maxHeight:"100px",overflow:"scroll",display:"none"}} >
                            {JSON.stringify(this.state,null,4)}
                        </pre>
                        <div style={{width:"700px",height:"500px"}} >
                            <NFG_Graphic1
                                seed={this.state.seed}
                                pubkeys={this.state.pubkeys}
                            />
                        </div>
                        <FetchFollowingList
                            staet = {this.state}
                            seed = {this.state.seed}
                            pubkeyz = {this.state.pubkeys}
                            updatePubkeys = {this.updatePubkeys}
                        />
                    </div>
                </div>
            </>
        );
    }
}

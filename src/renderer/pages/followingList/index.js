import React, { useState, useEffect, useRef } from 'react';
import Masthead from '../../mastheads/mainMasthead.js';
import LeftNavbar from '../../navbars/leftNav.js';
import * as MiscAppFxns from "../../lib/app/misc.ts";
import SingleUserElem from "./singleUserElem";

import { useNostrEvents, useProfile } from "nostr-react";

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

const FollowerList2 = () => {
    var { events } = useNostrEvents({
        filter: {
            authors: [ window.clickedPubKey ],
            since: 0, // all new events from now
            kinds: [3],
        },
    });

    if (events.length > 0) {
        // need to make sure sort order is correct
        const reversed = events.reverse()
        // events.sort((a, b) => parseFloat(a.created_at) - parseFloat(b.created_at));
        event = events[events.length-1]
        var aFollowing = event.tags
        var aFollowing_ = [];
        // remove duplicates
        for (var x=0;x<aFollowing.length;x++) {
            var nextPk = aFollowing[x][1];
            if (!aFollowing_.includes(nextPk)) {
                if (nextPk != window.clickedPubKey) {
                    aFollowing_.push(nextPk)
                }
            }
        }
        timeout(100)
        return (
            <>
                <div style={{backgroundColor:"#AFAFAF"}} >
                    <div style={{textAlign:"center",fontSize:"18px"}}>
                        You are looking at the list of accounts this user is following:
                    </div>
                    <SingleUserElem pubkey={window.clickedPubKey} />
                </div>
                <pre style={{display:"none",border:"1px solid purple",margin:"5px",padding:"5px"}} >
                {JSON.stringify(event,null,4)}
                </pre>
                <div>
                    <div style={{textAlign:"center",fontSize:"18px"}}>
                        Following: {aFollowing_.length}
                    </div>
                    {aFollowing_.map( (pk) => {
                        // var pk = following[1]
                        return (
                            <>
                                <SingleUserElem pubkey={pk} />
                            </>
                        )}
                    )}
                </div>
            </>
        )
    } else {
        return (
            <>
            </>
        )
    }
};

export default class FollowerList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            events: []
        }
    }
    async componentDidMount() {
        updateMainColWidth();
        document.getElementById("mastheadCenterContainer").innerHTML = "following"

        this.setState({events: [] })
        this.forceUpdate();
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
                        <FollowerList2 />
                    </div>
                </div>
            </>
        );
    }
}

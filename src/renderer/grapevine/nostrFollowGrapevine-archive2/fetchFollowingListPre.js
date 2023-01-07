import React, { useState, useEffect, useRef } from 'react';
import Masthead from '../../mastheads/mainMasthead.js';
import LeftNavbar from '../../navbars/leftNav.js';
import * as MiscAppFxns from "../../lib/app/misc.ts";
import FetchFollowingList from "./fetchFollowingList"
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

var numUpdates = 0;
export default class FetchFollowingListPre extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            seed: window.myPubkey,
            pubkeys: {}
        }
    }
    updatePubkeys = async (pubkeys_new) => {
        numUpdates++;
        jQuery("#numUpdatesContainer").html(numUpdates)
        window.nfg.pubkeys = pubkeys_new
        this.setState({pubkeys:pubkeys_new})
    }
    async componentDidMount() {
        numUpdates = 0;
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
                <div>
                    numUpdates (which trigger a re-render): <span id="numUpdatesContainer">numUpdatesContainer</span>
                </div>
                <FetchFollowingList
                    seed = {this.state.seed}
                    pubkeys = {this.state.pubkeys}
                    updatePubkeys = {this.updatePubkeys}
                />
            </>
        );
    }
}

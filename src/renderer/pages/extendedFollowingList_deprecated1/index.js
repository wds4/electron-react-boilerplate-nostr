import React, { useState, useEffect, useRef } from 'react';
import Masthead from '../../mastheads/mainMasthead.js';
import LeftNavbar from '../../navbars/leftNav.js';
import * as MiscAppFxns from "../../lib/app/misc.ts";
import Fetch1DegreeFollowingList from "./fetch1DegreeFollowingList"

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

export default class ExtendedFollowerList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            pubkeys: {
                seed: window.myPubkey,
                aFollowing0: [],
                aFollowing1: [],
                aFollowing2: [],
                aFollowingTot: []
            }
        }
    }
    async componentDidMount() {
        updateMainColWidth();
        document.getElementById("mastheadCenterContainer").innerHTML = "following"
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
                        <div>
                            seed: {this.state.pubkeys.seed}
                        </div>
                        <div>
                            aFollowing0: {JSON.stringify(this.state.pubkeys.aFollowing0)}
                        </div>
                        <div>
                            aFollowing1: {JSON.stringify(this.state.pubkeys.aFollowing1)}
                        </div>
                        <div>
                            aFollowing2: {JSON.stringify(this.state.pubkeys.aFollowing2)}
                        </div>
                        <div>
                            aFollowingTot: {JSON.stringify(this.state.pubkeys.aFollowingTot)}
                        </div>
                        <Fetch1DegreeFollowingList
                            seed={this.state.pubkeys.seed}
                            aFollowing0={this.state.pubkeys.aFollowing0}
                            aFollowing1={this.state.pubkeys.aFollowing1}
                            aFollowing2={this.state.pubkeys.aFollowing2}
                            aFollowingTot={this.state.pubkeys.aFollowingTot}
                        />
                    </div>
                </div>
            </>
        );
    }
}

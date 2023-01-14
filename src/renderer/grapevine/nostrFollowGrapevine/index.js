import React, { useState, useEffect, useRef } from 'react';
import Masthead from '../../mastheads/mainMasthead.js';
import LeftNavbar from '../../navbars/leftNav.js';
import * as MiscAppFxns from "../../lib/app/misc.ts";
import NFG_Graphic1 from "./graphic";
import {
    relayInit,
    generatePrivateKey,
    getPublicKey,
    getEventHash,
    signEvent,
    validateEvent,
    verifySignature,
} from 'nostr-tools'

import { asyncSql } from "../../index.tsx";

const jQuery = require("jquery");

const updateMainColWidth = MiscAppFxns.updateMainColWidth;

const fetchFollowingNetworkInfo = async () => {
    var sql = ""
    sql += " SELECT * FROM followingNetwork WHERE id=1 "
    var aFollowingNetworkData = await asyncSql(sql);
    console.log("aFollowingNetworkData.length: "+aFollowingNetworkData.length)
    if (aFollowingNetworkData.length > 0) {
        const oFollowingNetworkData = aFollowingNetworkData[0]
        console.log("oFollowingNetworkData.id: "+oFollowingNetworkData.id)
        return oFollowingNetworkData;
    } else {
        return false;
    }
}

var numUpdates = 0;
export default class ExtendedFollowerList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            seed: window.myPubkey,
            pubkeys: {}
        }
    }
    async componentDidMount() {
        updateMainColWidth();
        document.getElementById("mastheadCenterContainer").innerHTML = "visualization of the social graph<br/>based on following"

        var oFollowingNetworkData = await fetchFollowingNetworkInfo()
        if (oFollowingNetworkData) {
            this.setState({
                seed: oFollowingNetworkData.seed,
                pubkeys: JSON.parse(oFollowingNetworkData.pubkeys)
            })
        } else {
            console.log("You need to initialize your first followingNetwork!")
        }

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
                        <div style={{height:"600px",width:"60%",border:"1px solid purple",display:"inline-block"}} >
                            <NFG_Graphic1
                                seed={this.state.seed}
                                pubkeys={this.state.pubkeys}
                            />
                        </div>
                        <div style={{height:"600px",width:"35%",border:"1px dashed grey",marginLeft:"5px",display:"inline-block",padding:"10px"}} >
                            <div style={{textAlign:"center",marginBottom:"10px"}} >
                                <div id="totalNumberLoadedContainer" style={{display:"inline-block"}} >0</div>
                                <div style={{display:"inline-block",marginLeft:"5px",marginRight:"5px"}} >of {Object.keys(this.state.pubkeys).length}</div>
                                 profiles loaded
                            </div>
                            <div id="profileInfoContainer" ></div>
                        </div>
                    </div>
                </div>
            </>
        );
    }
}

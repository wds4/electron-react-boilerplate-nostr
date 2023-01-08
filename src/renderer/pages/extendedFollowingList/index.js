import React, { useState, useEffect, useRef } from 'react';
import Masthead from '../../mastheads/mainMasthead.js';
import LeftNavbar from '../../navbars/leftNav.js';
import * as MiscAppFxns from "../../lib/app/misc.ts";
import FetchFollowingList from "./fetchFollowingList"
import { asyncSql } from "../../index.tsx";
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

const saveFollowingGraph = async (seed, pubkeys) => {
    // console.log("saveFollowingGraph; seed: "+seed)
    var sPubkeys = JSON.stringify(pubkeys)
    // var sql = "";
    // sql += "INSERT INTO followingNetwork (seed, pubkeys) VALUES ('"+seed+"', '"+sPubkeys+") WHERE id=1 ";
    // sql += " UPDATE followingNetwork (seed, pubkeys) VALUES ('"+seed+"', '"+sPubkeys+") WHERE id=1 ";

    var sql = "";
    sql += " UPDATE followingNetwork "
    sql += " SET seed = '"+seed+"' ";
    sql += " , pubkeys = '"+sPubkeys+"' ";
    sql += " WHERE id = 1 ";
    // console.log("saveFollowingGraph; sql: "+sql)
    var result = await asyncSql(sql);
    console.log("saveFollowingGraph result: "+JSON.stringify(result,null,4))
}

const initializeFirstFollowingNetwork = async (seed,pubkeys) => {
    var sPubkeys = JSON.stringify(pubkeys)
    var sql = "";
    sql += " INSERT INTO followingNetwork (seed, pubkeys) VALUES ('"+seed+"', '"+sPubkeys+"') ";
    console.log("sql: "+sql)
    var result = await asyncSql(sql);
    console.log("result: "+JSON.stringify(result,null,4))
}

const fetchFollowingNetworkInfo = async (seed,pubkeys) => {
    var sql = ""
    sql += "SELECT * FROM followingNetwork WHERE id=1"
    var aFollowingNetworkData = await asyncSql(sql);
    console.log("aFollowingNetworkData.length: "+aFollowingNetworkData.length)
    if (aFollowingNetworkData.length==0) {
        await initializeFirstFollowingNetwork(seed,pubkeys);
        jQuery("#successNotificationContainer").html("extended following list has been saved.")
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
    updatePubkeys = async (pubkeys_new) => {
        numUpdates++;
        jQuery("#numUpdatesContainer").html(numUpdates)
        this.setState({pubkeys:pubkeys_new})
    }

    sFG = async (seed,pubkeys) => {
        console.log("sFG; seed: "+seed)
        await saveFollowingGraph(seed,pubkeys);
    }

    async componentDidMount() {
        updateMainColWidth();
        document.getElementById("mastheadCenterContainer").innerHTML = "extended following list: setup"

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
        await fetchFollowingNetworkInfo(this.state.seed,this.state.pubkeys)
        jQuery("#saveFollowingGraphButton").click(async function(){
            console.log("saveFollowingGraphButton clicked")
            // await this.sFG();
        })
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
                        <div style={{display:"none"}} >
                            <div>
                                <div style={{display:"inline-block",marginRight:"5px",fontSize:"14px"}} >
                                    Max. degrees of freedom
                                </div>
                                <select>
                                    <option>2</option>
                                    <option selected="selected" >3</option>
                                    <option>4</option>
                                    <option>5</option>
                                    <option>6</option>
                                </select>
                            </div>
                            numUpdates (which trigger a re-render): <span id="numUpdatesContainer">numUpdatesContainer</span>
                        </div>
                        <div>
                        Your extended following list is being (re)generated at a max distance of two degrees of separation. (More than that seems to jam up the relays.)
                        </div>

                        <FetchFollowingList
                            seed = {this.state.seed}
                            pubkeys = {this.state.pubkeys}
                            updatePubkeys = {this.updatePubkeys}
                        />

                        <div style={{marginTop:"20px"}} >
                            Once enough users with profile data is scraped, click this button to save the list.

                            (Assuming you've followed a handful of active users,
                            it shouldn't take more than a minute or two to get at least a few hundred users in your extended list, with more than 80% of those profiles having been fetched.)
                            <br/>
                            Then check out the extended following list on the main feed page. Also check out the visualization of the extended following list.
                            <br/>
                            (Future: this will be performed in the background. Possibly using a dedicated renderer thread.)
                        </div>

                        <div id="saveFollowingGraphButton" onClick={() => {this.sFG(this.state.seed,this.state.pubkeys)}} className="doSomethingButton" >Save/Update Extended Following List</div>

                        <div id="successNotificationContainer" > </div>

                    </div>
                </div>
            </>
        );
    }
}

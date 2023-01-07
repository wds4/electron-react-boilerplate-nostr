import React, { useState, useEffect, useRef } from 'react';
import Masthead from '../../mastheads/mainMasthead.js';
import LeftNavbar from '../../navbars/leftNav.js';
import * as MiscAppFxns from "../../lib/app/misc.ts";
// import FetchFollowingList from "./fetchFollowingList"
import { DataSet, Network} from 'vis-network/standalone/esm/vis-network';
import * as VisStyleConstants from '../../lib/visjs/visjs-style';
// import NFG_Graphic1, { nodes } from "./graphic";
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

const groupOptions = VisStyleConstants.groupOptions;

const options = VisStyleConstants.options;

// An array of nodes
export var nodes = new DataSet([
    { id: 1, label: 'Node 1' },
    { id: 2, label: 'Node 2' },
    { id: 3, label: 'Node 3' },
    { id: 4, label: 'Node 4' },
    { id: 5, label: 'Node 5' }
]);

// An array of edges
export var edges = new DataSet([
    { from: 1, to: 3 },
    { from: 1, to: 2 },
    { from: 2, to: 4 },
    { from: 2, to: 5 }
]);

export var network = {};

var data = {
    nodes,
    edges
};

export const NFG_Graphic2 = ({seed}) => {
    console.log("=============== NFG_Graphic2 ")
    // var aPubkeys = Object.keys(pubkeys)
    var nodes_arr = [];
    var edges_arr = [];
    var oSeedNode = { id: seed, label: seed, name: seed }
    nodes_arr.push(oSeedNode)

    /*
    for (var x=0;x<aPubkeys.length;x++) {
        var nextPk = aPubkeys[x];
        var oNextPk = pubkeys[nextPk];
        var nextPk_level = oNextPk.followingData.level;
        var nextPk_name = oNextPk.profileData.name;
        var nextPk_display_name = oNextPk.profileData.display_name;
        var nextPk_picture_url = oNextPk.profileData.picture_url;
        var oNextNode = { id: nextPk, label: nextPk_display_name, name: nextPk_name, url: nextPk_picture_url }
        // console.log("=============== NFG_Graphic oNextNode: "+JSON.stringify(oNextNode))
        if (nextPk_level < 2) { nodes_arr.push(oNextNode) }
    }
    for (var x=0;x<aPubkeys.length;x++) {
        var nextPk = aPubkeys[x];
        var oNextPk = pubkeys[nextPk];
        var aFollowing = oNextPk.followingData.following;
        for (var f=0;f<aFollowing.length;f++) {
            var folPk = aFollowing[f][1];
            // ought to check first that both pubkeys exists as nodes
            var oNextEdge = {from:nextPk,to:folPk};
            edges_arr.push(oNextEdge)
        }
    }
    */

    nodes = new DataSet(nodes_arr);
    edges = new DataSet(edges_arr);
    data = {
        nodes,
        edges
    };


    // A reference to the div rendered by this component
    var domNode = useRef(null);

    // A reference to the vis network instance
    network = useRef(null);

    useEffect(
        () => {
            network.current = new Network(domNode.current, data, options);
            network.current.fit();

            network.current.on("click",function(params){
                var nodes_arr = params.nodes;
                var numNodes = nodes_arr.length;
            });

            // EDGES
            network.current.on("selectEdge",function(params){
                // console.log("selectEdge event triggered")
                var edges_arr = params.edges;
                var numEdges = edges_arr.length;
                if (numEdges==1) {
                    var edgeID = edges_arr[0];
                }
            });
            network.current.on("deselectEdge",function(params){
            });

            // NODES
            network.current.on("selectNode",function(params){
                // console.log("selectNode event triggered")
                var nodes_arr = params.nodes;
                var numNodes = nodes_arr.length;
                if (numNodes==1) {
                    var nodeID = nodes_arr[0];
                    var node = nodes.get(nodeID);
                    var name = node.name;
                    // drawScoreCalculationPanel(nodeID)
                }
            });
            network.current.on("deselectNode",function(params){
                jQuery("#usernameContainer").html("none")
            });
        },
        [domNode, network, data, options]
    );

    return (
        <>
            <div style={{height:"100%",width:"100%"}} ref = { domNode } />
        </>
    );
};

const updateGraphics = (pubkeys) => {
    console.log("=============== updateGraphics ")
    var aPubkeys = Object.keys(pubkeys)
    for (var x=0;x<aPubkeys.length;x++) {
        var nextPk = aPubkeys[x];
        var oNextPk = pubkeys[nextPk];
        var nextPk_name = oNextPk.profileData.name;
        var oNextNode = { id: nextPk, label: x, name: x }
        console.log("=============== updateGraphics oNextNode: "+JSON.stringify(oNextNode))
        nodes.update(oNextNode)
    }
}

export class NFG_Graphic1 extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        }
    }
    async componentDidMount() {
        // updateGraphics(this.props.pubkeys)
    }
    render() {
        return (
            <>
                <div>
                NFG_Graphic1; number of pubkeys: {Object.keys(this.props.pubkeys).length}
                </div>
                <NFG_Graphic2
                    seed={this.props.seed}
                    pubkeys={this.props.pubkeys}
                />
            </>
        );
    }
}

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

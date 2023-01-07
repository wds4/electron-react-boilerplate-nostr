import React, { useState, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
import { DataSet, Network} from 'vis-network/standalone/esm/vis-network';
import * as VisStyleConstants from '../../lib/visjs/visjs-style';
import * as MiscAppFxns from "../../lib/app/misc.ts";

const jQuery = require("jquery");

const cloneObj = MiscAppFxns.cloneObj;

const groupOptions = VisStyleConstants.groupOptions;

const options = VisStyleConstants.options;

export var nodes = new DataSet([ ]);

export var edges = new DataSet([ ]);

export var network = {};

const VisUpdateTimer = () => {
    const [count, setCount] = useState(0);

    useEffect(() => {
        setTimeout(() => {
            var foo = jQuery("#visUpdateCalculationTimer").data("status")
            if (foo=="run") {
                if (count%10 == 0) {
                    jQuery("#showVisUpdateCountContainer").html(count)
                    if (!window.nfg.updatingVisData) { updateVisData() }
                }
            }
            setCount((count) => count + 1);
        }, 200);
    }, [count]); // <- add empty brackets here

    return <div>I've rendered {count} times!</div>;
}

var oPubkeysInVis = {};
var numberVisNodeUpdates = 0;
var numberVisEdgeUpdates = 0;

const updateVisData = () => {
    window.nfg.updatingVisData = true;
    // cycle through pubkeys stored in the DOM and update all nodes and edges that need updating
    // FUTURE: store data usig redux or some other method
    var oPubkeys = cloneObj(window.nfg.pubkeys)
    var aPubkeys = Object.keys(oPubkeys)
    jQuery("#numPubkeysContainer").html(aPubkeys.length)
    for (var p=0;p<aPubkeys.length;p++) {
        var nextPk = aPubkeys[p];
        var aPubkeysInVis = Object.keys(oPubkeysInVis)

        // if already added, then make sure followingData and profileData is all up do date
        if (aPubkeysInVis.includes(nextPk)) {
            if (!oPubkeysInVis[nextPk].followingData.inserted) {
                if (oPubkeys[nextPk]) {
                    // followingData
                    /*
                    if (oPubkeys[nextPk].followingData) {
                        if (oPubkeys[nextPk].followingData.following) {
                            // console.log("followingData A; nextPk: "+nextPk)
                            var aFollowing = oPubkeys[nextPk].followingData.following
                            for (var f=0;f<aFollowing.length;f++) {
                                var nextFollowingPk = aFollowing[f][1];
                                // console.log("followingData B; nextPk: "+nextPk+"; nextFollowingPk: "+typeof nextFollowingPk+"; aPubkeysInVis.length: "+aPubkeysInVis.length)
                                if (aPubkeysInVis.includes(nextFollowingPk)) {
                                    // console.log("followingData C; nextPk: "+nextPk+"; nextFollowingPk: "+nextFollowingPk)
                                    // add edge
                                    var oEdge = {from:nextPk,to:nextFollowingPk}
                                    edges.update(oEdge)
                                    numberVisEdgeUpdates++;
                                    jQuery("#numberVisEdgeUpdatesContainer").html(numberVisEdgeUpdates)
                                    oPubkeysInVis[nextPk].followingData.inserted = true;
                                }
                            }
                        }
                    }
                    */
                }
            }
            if (!oPubkeysInVis[nextPk].profileData.inserted) {
                if (oPubkeys[nextPk]) {
                    // profileData
                    if (oPubkeys[nextPk].profileData) {
                        if (oPubkeys[nextPk].profileData.picture_url) {
                            var image = oPubkeys[nextPk].profileData.picture_url;
                            var level = oPubkeys[nextPk].followingData.level;
                            var size = 25;
                            if (level==0) { size = 100; }
                            if (level==1) { size = 75; }
                            if (level==2) { size = 50; }
                            if (level==3) { size = 25; }
                            var oNextNode = {
                                id: nextPk,
                                label: nextPk,
                                // shape:"circularImage",
                                // image: image,
                                // brokenImage: "/images/missingAvatar.png",
                                size: size
                            }
                            nodes.update(oNextNode)
                            numberVisNodeUpdates++;
                            jQuery("#numberVisNodeUpdatesContainer").html(numberVisNodeUpdates)
                            oPubkeysInVis[nextPk].profileData.inserted = true;
                        }
                    }
                }
            }
        }
        // if not yet added, then add this node
        if (!aPubkeysInVis.includes(nextPk)) {
            var oNextNode = {
                id: nextPk,
                label: nextPk,
                shape: "circle",
                color: "red"
            }
            nodes.update(oNextNode)
            numberVisNodeUpdates++;
            jQuery("#numberVisNodeUpdatesContainer").html(numberVisNodeUpdates)
            oPubkeysInVis[nextPk] = {
                profileData: {
                    inserted: false,
                    created_at: null
                },
                followingData: {
                    inserted: false,
                    created_at: null
                }
            };
        }
    }
    window.nfg.updatingVisData = false;
}

var data = {
    nodes,
    edges
};

const NFG_Graphic = () => {
    var oPubkeysInVis = {};
    numberVisNodeUpdates = 0;
    numberVisEdgeUpdates = 0;
    var nodes_arr = [];
    var edges_arr = [];
    var oSeedNode = {
        id: window.myPubkey,
        label: window.myProfile.display_name,
        shape:"circularImage",
        image: window.myProfile.picture_url,
        brokenImage: "/images/missingAvatar.png" }
    nodes_arr.push(oSeedNode)

    nodes = new DataSet(nodes_arr);
    edges = new DataSet(edges_arr);
    data = {
        nodes,
        edges
    };

    var domNode = useRef(null);

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
                // jQuery("#usernameContainer").html("none")
            });
        },
        [domNode, network, data, options]
    );

    return (
        <>
            <div id="visUpdateCalculationTimer" data-status="run" style={{display:"inline-block",border:"1px solid orange",width:"400px",padding:"10px"}} >
                <center>graphic page counter</center>
                <VisUpdateTimer />
                <div id="showVisUpdateCountContainer">count</div>
                <div>numPubkeys: <div id="numPubkeysContainer" style={{display:"inline-block"}} >numPubkeysContainer</div></div>
                <div>numberVisNodeUpdates: <div id="numberVisNodeUpdatesContainer" style={{display:"inline-block"}} >numberVisNodeUpdatesContainer</div></div>
                <div>numberVisEdgeUpdates: <div id="numberVisEdgeUpdatesContainer" style={{display:"inline-block"}} >numberVisEdgeUpdatesContainer</div></div>
            </div>
            <div style={{height:"500px",width:"700px",border:"1px solid purple"}} ref = { domNode } />
        </>
    );
};
export default NFG_Graphic

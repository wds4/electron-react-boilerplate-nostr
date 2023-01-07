import React, { useState, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
import { DataSet, Network} from 'vis-network/standalone/esm/vis-network';
import * as VisStyleConstants from '../../lib/visjs/visjs-style';
import { getStarterUserList } from './getStarterUserList';

const jQuery = require("jquery");

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

export const NFG_Graphic2 = ({seed,pubkeys}) => {
    console.log("=============== NFG_Graphic2 ")
    var aPubkeys = Object.keys(pubkeys)
    var nodes_arr = [];
    var edges_arr = [];
    // var oSeedNode = { id: seed, label: seed, name: seed }
    // nodes_arr.push(oSeedNode)

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

export default class NFG_Graphic1 extends React.Component {
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
/*
const makeVisGraph_Grapevine = async (seed,pubkeys) => {
    ReactDOM.render(<VisNetwork_Grapevine seed={seed} pubkeys={pubkeys} clickHandler={console.log('click')} onSelectNode={console.log("onSelectNode") } />,
        document.getElementById("nfgGraphicContainer")
    )
}

const NFG_Graphic1 = async ({seed,pubkeys}) => {

    var aStarterUsers = await getStarterUserList(myPubkey,nHops)
    var seed = this.state.seed;
    var pubkeys = this.state.pubkeys;
    await makeVisGraph_Grapevine(seed,this.props.pubkeys);

    render() {
        return (
            <>
                <div>
                    graphic page; number of users: {Object.keys(this.state.pubkeys).length}
                </div>
                <div id="nfgGraphicContainer" className="nfgGraphicContainer" ></div>
            </>
        );
    }
}

export default NFG_Graphic
*/

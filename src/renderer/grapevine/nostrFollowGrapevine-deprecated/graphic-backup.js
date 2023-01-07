import React, { useState, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
import { DataSet, Network} from 'vis-network/standalone/esm/vis-network';
import * as VisStyleConstants from '../../lib/visjs/visjs-style';
import { getStarterUserList } from './getStarterUserList';

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

export const VisNetwork_Grapevine = ({seed,pubkeys}) => {

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
                    var username = node.username;
                    jQuery("#usernameContainer").html(username)
                    jQuery("#peerIDContainer").html(nodeID)
                    jQuery("#changeUserCalcsDisplayButton").get(0).click()
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
            <div>
                VisNetwork_Grapevine; number of users: {Object.keys(pubkeys).length}
            </div>
            <div style={{height:"100%",width:"100%"}} ref = { domNode } />
        </>
    );
};

const makeVisGraph_Grapevine = async (seed,pubkeys) => {
    ReactDOM.render(<VisNetwork_Grapevine seed={seed} pubkeys={pubkeys} clickHandler={console.log('click')} onSelectNode={console.log("onSelectNode") } />,
        document.getElementById("nfgGraphicContainer")
    )
}

export default class NFG_Graphic extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            seed: this.props.seed,
            pubkeys: this.props.pubkeys
        }
    }
    async componentDidMount() {
        // First, obtain list of all users connected by N hops or less from the seed (or "reference" or "anchor") user.
        // By default the reference user is me, but this can be changed.
        const myPubkey = window.myPubkey;
        const nHops = 3;
        var aStarterUsers = await getStarterUserList(myPubkey,nHops)
        var seed = this.state.seed;
        var pubkeys = this.state.pubkeys;
        await makeVisGraph_Grapevine(seed,this.props.pubkeys);

    }
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

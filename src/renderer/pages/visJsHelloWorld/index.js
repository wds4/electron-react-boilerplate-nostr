import React, { useState, useEffect, useRef } from 'react';
import Masthead from '../../mastheads/mainMasthead.js';
import LeftNavbar from '../../navbars/leftNav.js';
import * as MiscAppFxns from "../../lib/app/misc.ts";
import { DataSet, Network} from 'vis-network/standalone/esm/vis-network';
import * as VisStyleConstants from '../../lib/visjs/visjs-style';

const jQuery = require("jquery");

const updateMainColWidth = MiscAppFxns.updateMainColWidth;

const groupOptions = VisStyleConstants.groupOptions;

const options = VisStyleConstants.options;

export var nodes = new DataSet([
    { id: 1, label: 'Node 1' },
    { id: 2, label: 'Node 2' },
    { id: 3, label: 'Node 3' },
    { id: 4, label: 'Node 4' },
    { id: 5, label: 'Node 5' },
    { id: 6, label: 'Node 6' },
    { id: 7, label: 'Node 7' },
    { id: 8, label: 'Node 8' },
]);

export var edges = new DataSet([
    {from: 1, to: 2},
    {from: 1, to: 3},
    {from: 2, to: 4},
    {from: 1, to: 5},
    {from: 3, to: 6},
    {from: 2, to: 7},
    {from: 2, to: 8}
]);

export var data = {
    nodes,
    edges
};

export var network = {};

const NFG_Graphic = () => {
    /*
    var nodes_arr = [];
    var edges_arr = [];

    nodes = new DataSet(nodes_arr);
    edges = new DataSet(edges_arr);
    data = {
        nodes,
        edges
    };
    */

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
            <div style={{height:"500px",width:"700px",border:"1px solid purple"}} ref = { domNode } />
        </>
    );
};

export default class ExtendedFollowerList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        }
    }
    async componentDidMount() {
        updateMainColWidth();
        document.getElementById("mastheadCenterContainer").innerHTML = "visjs hello world"
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
                            visjs hello world
                            <NFG_Graphic />
                        </div>
                    </div>
                </div>
            </>
        );
    }
}

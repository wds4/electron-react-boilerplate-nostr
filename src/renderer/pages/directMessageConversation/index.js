import React, { useState, useEffect, useRef } from 'react';
import Masthead from '../../mastheads/mainMasthead.js';
import LeftNavbar from '../../navbars/leftNav.js';
import * as MiscAppFxns from "../../lib/app/misc.ts";
import SendDirectMessage from "./sendDirectMessage";
import DirectMessageConversationHistory from "./convoHistory";

const fetchMySk = MiscAppFxns.fetchMySk
const timeout = MiscAppFxns.timeout

const jQuery = require("jquery");

const updateMainColWidth = MiscAppFxns.updateMainColWidth;

export default class DirectMessageConversation extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            myPrivKey: null
        }
    }
    async componentDidMount() {
        updateMainColWidth();
        document.getElementById("mastheadCenterContainer").innerHTML = "DM convo"
        const myPrivKey = await fetchMySk();
        this.setState({myPrivKey:myPrivKey})
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
                        <DirectMessageConversationHistory
                            pubkey = {window.clickedPubKey}
                            myPrivKey = {this.state.myPrivKey}
                        />
                        <SendDirectMessage
                        />
                    </div>
                </div>
            </>
        );
    }
}

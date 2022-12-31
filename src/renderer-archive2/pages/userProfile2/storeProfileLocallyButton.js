import React, { useState, useEffect, useRef } from 'react';
import Masthead from '../../mastheads/mainMasthead.js';
import LeftNavbar from '../../navbars/leftNav.js';
import * as MiscAppFxns from "../../lib/app/misc.ts";

const jQuery = require("jquery");

const updateMainColWidth = MiscAppFxns.updateMainColWidth;
const secsToTime = MiscAppFxns.secsToTime

export default class StoreProfileLocallyButton extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        }
    }
    async componentDidMount() {
        // var pubkey = window.clickedPubKey;
        const pk = this.props.pubkey;
        jQuery("#storeProfileLocallyButton").click(function(){
            console.log("storeProfileLocallyButton; pubkey: "+pk)
        })
    }
    render() {
        return (
            <>
                <div id="storeProfileLocallyButton" className="doSomethingButton" style={{position:"absolute",top:"0px",right:"5px"}} >
                    Store Profile
                </div>
            </>
        );
    }
}

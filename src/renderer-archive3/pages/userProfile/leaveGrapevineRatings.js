import React, { useState, useEffect, useRef } from 'react';
import { NavLink } from "react-router-dom";
import * as MiscAppFxns from "../../lib/app/misc.ts";

const jQuery = require("jquery");

const updateMainColWidth = MiscAppFxns.updateMainColWidth;
const secsToTime = MiscAppFxns.secsToTime
const cloneObj = MiscAppFxns.cloneObj

export default class LeaveGrapevineRatings extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        }
    }
    async componentDidMount() {
        console.log("this.props.pubkey: "+this.props.pubkey)
    }
    render() {
        const pk = this.props.pubkey;
        return (
            <>
                <div style={{backgroundColor:"#EFEFEF",width:"100%",height:"30px"}} >
                    Leave Grapevine ratings for: {this.props.pubkey}
                    <div className="doSomethingButton">Follow</div>
                    <div className="doSomethingButton">Believe</div>
                    <div className="doSomethingButton">Trust to curate (everything)</div>
                    <div className="doSomethingButton">Trust to curate: nostr relays</div>

                    <div className="doSomethingButton">Customize</div>
                </div>
            </>
        );
    }
}

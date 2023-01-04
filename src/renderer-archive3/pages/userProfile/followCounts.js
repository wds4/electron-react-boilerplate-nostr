import React, { useState, useEffect, useRef } from 'react';
import { NavLink } from "react-router-dom";
import Masthead from '../../mastheads/mainMasthead.js';
import LeftNavbar from '../../navbars/leftNav.js';
import * as MiscAppFxns from "../../lib/app/misc.ts";
import { useNostrEvents } from "nostr-react";

const jQuery = require("jquery");

const updateMainColWidth = MiscAppFxns.updateMainColWidth;
const secsToTime = MiscAppFxns.secsToTime
const cloneObj = MiscAppFxns.cloneObj

const FollowCounts2 = (props) => {
    var { events } = useNostrEvents({
        filter: {
            authors: [ props.pubkey ],
            since: 0, // all new events from now
            kinds: [3],
        },
    });
    // console.log("FollowCounts2 events: "+JSON.stringify(events,null,4))
    if (events.length > 0) {
        events.sort((a, b) => parseFloat(b.created_at) - parseFloat(a.created_at));
        var event_ = events[0];
        var aFollowing_ = event_.tags
        return (
            <>
                <div className="followCountContainer"  data-createdat={event_.created_at} >
                    <NavLink className="followsNavLink" to='/FollowingList'>
                        following
                        <div style={{display:"inline-block",marginLeft:"5px"}} >{aFollowing_.length}</div>
                    </NavLink>
                    <div style={{display:"inline-block",marginLeft:"5px"}} >
                        followers
                        <div style={{display:"inline-block",marginLeft:"5px"}} >?</div>
                    </div>
                    <pre style={{display:"none",overflow:"scroll",height:"100px",width:"600px"}} >
                    {JSON.stringify(event_,null,4)}
                    </pre>
                </div>
            </>
        );
    } else {
        return (
            <>
                <div className="followCountContainer" >
                    <NavLink className="followsNavLink" to='/FollowingList'>
                        following
                        <div style={{display:"inline-block",marginLeft:"5px"}} >?</div>
                    </NavLink>
                    <div style={{display:"inline-block",marginLeft:"5px"}} >
                        followers
                        <div style={{display:"inline-block",marginLeft:"5px"}} >?</div>
                    </div>
                </div>
            </>
        );
    }
}

export default class FollowCounts extends React.Component {
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
                    <FollowCounts2 pubkey={pk} />
                </div>
            </>
        );
    }
}

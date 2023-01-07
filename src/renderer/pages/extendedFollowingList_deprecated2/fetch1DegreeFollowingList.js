import React, { useState, useEffect, useRef } from 'react';
import * as MiscAppFxns from "../../lib/app/misc.ts";
import { useNostrEvents } from "nostr-react";
import Fetch2DegreeFollowingList from "./fetch2DegreeFollowingList"

const timeout = MiscAppFxns.timeout

const Fetch1DegreeFollowingList = ({seed, level0Callback}) => {
    //
    var events = [];
    console.log("events.length: "+events.length)
    // level0Callback(["a","b"])

    var { events } = useNostrEvents({
        filter: {
            authors: [ seed ],
            since: 0, // all new events from now
            kinds: [3],
        },
    });

    //
    if (events.length > 0) {
        event = events[events.length-1]
        var aFollowing = event.tags
        var aFollowing_ = [];
        // remove duplicates
        for (var x=0;x<aFollowing.length;x++) {
            var nextPk = aFollowing[x][1];
            if (!aFollowing_.includes(nextPk)) {
                if (nextPk != window.clickedPubKey) {
                    aFollowing_.push(nextPk)
                }
            }
        }

        timeout(100)
        return (
            <>
                <div>
                    <div style={{fontSize:"18px",color:"white",backgroundColor:"orange"}}>
                        Parent pubkey: {seed}<br/>Following {aFollowing_.length}:
                    </div>
                    <div  >
                    {aFollowing_.map( (pk) => {
                        return (
                            <>
                                <div>{pk}</div>

                            </>
                        )}
                    )}
                    </div>
                    <Fetch2DegreeFollowingList />
                </div>
            </>
        )
    } else {
        return (
            <>
            event.length = 0
            </>
        )
    }
};

export default Fetch1DegreeFollowingList;

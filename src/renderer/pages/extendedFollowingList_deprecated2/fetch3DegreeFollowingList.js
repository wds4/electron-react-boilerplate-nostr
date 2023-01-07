import React, { useState, useEffect, useRef } from 'react';
import * as MiscAppFxns from "../../lib/app/misc.ts";
import { useNostrEvents } from "nostr-react";

const timeout = MiscAppFxns.timeout

const Fetch3DegreeFollowingList = ({seed}) => {
    var { events } = useNostrEvents({
        filter: {
            authors: [ seed ],
            since: 0, // all new events from now
            kinds: [3],
        },
    });

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
                <div style={{marginLeft:"40px"}} >
                    <div style={{fontSize:"14px",color:"white",backgroundColor:"blue"}}>
                        Parent pubkey: {seed}<br/>Following {aFollowing_.length}:
                    </div>
                    <div style={{maxHeight:"20px",overflow:"scroll",border:"1px solid blue"}} >
                    {aFollowing_.map( (pk) => {
                        return (
                            <>
                            <div>{pk}</div>
                            </>
                        )}
                    )}
                    </div>
                </div>
            </>
        )
    } else {
        return (
            <>
            </>
        )
    }
};

export default Fetch3DegreeFollowingList;

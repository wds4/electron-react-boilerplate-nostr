import React, { useState, useEffect, useRef } from 'react';
import * as MiscAppFxns from "../../lib/app/misc.ts";
import { useNostrEvents } from "nostr-react";
import Fetch3DegreeFollowingList from "./fetch2DegreeFollowingList"

const timeout = MiscAppFxns.timeout

const Fetch2DegreeFollowingList = () => {
    var { events } = useNostrEvents({
        filter: {
            authors: [
              "32e1827635450ebb3c5a7d12c1f8e7b2b514439ac10a67eef3d9fd9c5c68e245",
              "82341f882b6eabcd2ba7f1ef90aad961cf074af15b9ef44a09f9d2a8fbfbe6a2",
              "04c915daefee38317fa734444acee390a8269fe5810b2241e5e6dd343dfbecc9",
              "e88a691e98d9987c964521dff60025f60700378a4879180dcbbb4a5027850411",
              "e5272de914bd301755c439b88e6959a43c9d2664831f093c51e9c799a16a102f",
              "00a2b73a28d1fc188bc6aacce020a3d49b7ddcd4856733c40e44eb57c8ae1157",
              "4523be58d395b1b196a9b8c82b038b6895cb02b683d0c253a955068dba1facd0",
            ],
            since: 0,
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
                <div style={{marginLeft:"20px"}} >
                    <div style={{fontSize:"14px",color:"white",backgroundColor:"red"}}>
                        <br/>Following {aFollowing_.length}:
                    </div>
                    <div style={{maxHeight:"100px",overflow:"scroll",border:"1px solid red"}} >
                    {aFollowing_.map( (pk) => {
                        return (
                            <>
                                <div>
                                    {pk}
                                </div>
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

export default Fetch2DegreeFollowingList;

import React, { useState, useEffect, useRef } from 'react';
import * as MiscAppFxns from "../../lib/app/misc.ts";
import { doesEventValidate } from "../../lib/nostr/eventValidation";
import { useNostrEvents } from "nostr-react";

const timeout = MiscAppFxns.timeout

const FetchFollowingList = ({staet, pubkeyz, updatePubkeys}) => {
    var aAuthors = Object.keys(pubkeyz)
    // console.log("aAuthors: "+JSON.stringify(aAuthors))
    var { events } = useNostrEvents({
        filter: {
            authors: aAuthors,
            since: 0,
            kinds: [0,3],
        },
    });

    {events.map( async (event) => {
        await timeout(100);
        if (doesEventValidate) {
            var kind = event.kind;
            var created_at = event.created_at
            var aPk = event.pubkey

            // profile information
            if (kind==0) {
                if (pubkeyz[aPk]) { // this should always be true (but check just to make sure)
                    created_at_current = pubkeyz[aPk].profileData.created_at;
                    if (created_at_current < created_at) {
                        pubkeyz[aPk].profileData.name = JSON.parse(event.content).name;
                        pubkeyz[aPk].profileData.display_name = JSON.parse(event.content).display_name;
                        pubkeyz[aPk].profileData.picture_url = JSON.parse(event.content).picture;
                        pubkeyz[aPk].profileData.created_at = created_at;
                    }
                }
            }

            // follower information
            if (kind==3) {
                var aFollowing = event.tags

                var thisAuthorLevel = pubkeyz[aPk].followingData.level;
                if (thisAuthorLevel < 2) {
                    var thisAuthorLevelNext = pubkeyz[aPk].followingData.level + 1;

                    var created_at_current = 0;
                    var following_current = [];
                    if (pubkeyz[aPk]) {
                        created_at_current = pubkeyz[aPk].followingData.created_at;
                        following_current = pubkeyz[aPk].followingData.following;
                    }
                    if (created_at_current < created_at) {
                        // this event is newer than the one currently on file
                        pubkeyz[aPk].followingData.created_at = created_at
                        pubkeyz[aPk].followingData.following = aFollowing
                        var numPk = Object.keys(pubkeyz).length;
                        console.log("=======numPk: "+numPk)
                        updatePubkeys(pubkeyz);
                    }
                    for (var f=0;f<aFollowing.length;f++) {
                        if (aFollowing[f][0]=="p") {
                            var nextPk = aFollowing[f][1];
                            // if nextPk has already been added, make sure its level is correct
                            // (there may be instances where it initally appears as level N, but it turns out to be closer than that)
                            if (pubkeyz[nextPk]) {
                                var currentLevel = pubkeyz[nextPk].followingData.level;
                                // new level is mininum of currentLevel and thisAuthorLevelNext
                                if (thisAuthorLevelNext < currentLevel) {
                                    pubkeyz[nextPk].followingData.level = thisAuthorLevelNext;
                                    // only update if change is made (maybe check at end of this script if change is made?)
                                    updatePubkeys(pubkeyz);
                                }
                            }
                            // if nextPk has not been added, initialize it here
                            if (!pubkeyz[nextPk]) {
                                pubkeyz[nextPk] = {
                                    profileData: {
                                        name: null,
                                        display_name: null,
                                        picture_url: null,
                                        created_at: 0
                                    },
                                    followingData: {
                                        level: thisAuthorLevelNext,
                                        created_at: 0,
                                        following: []
                                    }
                                }
                                updatePubkeys(pubkeyz);
                            }
                        }
                    }
                }
            }
        }
    })}

    return (
        <>
            <div>
                <div>
                    number of users: {Object.keys(pubkeyz).length}
                </div>
                <pre style={{border:"1px solid orange",maxHeight:"300px",overflow:"scroll",display:"none"}} >
                    {JSON.stringify(pubkeyz,null,4)}
                </pre>
            </div>
        </>
    )
};

export default FetchFollowingList;

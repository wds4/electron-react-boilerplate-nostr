import React, { useState, useEffect, useRef } from 'react';
import * as MiscAppFxns from "../../lib/app/misc.ts";
import { doesEventValidate } from "../../lib/nostr/eventValidation";
import { useNostrEvents } from "nostr-react";

const timeout = MiscAppFxns.timeout

const maxDegreesOfSeparation = 3; //

const FetchFollowingList = ({pubkeys, updatePubkeys}) => {
    var aAuthors = Object.keys(pubkeys)
    var { events } = useNostrEvents({
        filter: {
            authors: aAuthors,
            since: 0,
            kinds: [0,3],
        },
    });

    {events.map( (event) => {
        timeout(10)
        if (doesEventValidate) {
            var doUpdate = false;
            var kind = event.kind;
            var created_at = event.created_at
            var aPk = event.pubkey

            // profile information
            if (kind==0) {
                if (pubkeys[aPk]) { // this should always be true (but check just to make sure)
                    created_at_current = pubkeys[aPk].profileData.created_at;
                    if (created_at_current < created_at) {
                        pubkeys[aPk].profileData.name = JSON.parse(event.content).name;
                        pubkeys[aPk].profileData.display_name = JSON.parse(event.content).display_name;
                        pubkeys[aPk].profileData.picture_url = JSON.parse(event.content).picture;
                        pubkeys[aPk].profileData.created_at = created_at;
                        // updatePubkeys(pubkeys);
                        doUpdate = true;
                    }
                }
            }

            // follower information
            if (kind==3) {
                var aFollowing = event.tags

                var thisAuthorLevel = pubkeys[aPk].followingData.level;
                // if (thisAuthorLevel < 2) {
                    var thisAuthorLevelNext = pubkeys[aPk].followingData.level + 1;

                    var created_at_current = 0;
                    var following_current = [];
                    if (pubkeys[aPk]) {
                        created_at_current = pubkeys[aPk].followingData.created_at;
                        following_current = pubkeys[aPk].followingData.following;
                    }
                    if (created_at_current < created_at) {
                        // this event is newer than the one currently on file
                        pubkeys[aPk].followingData.created_at = created_at
                        pubkeys[aPk].followingData.following = aFollowing
                        var numPk = Object.keys(pubkeys).length;
                        // console.log("=======numPk: "+numPk)
                        // updatePubkeys(pubkeys);
                        doUpdate = true;
                    }
                    for (var f=0;f<aFollowing.length;f++) {
                        if (aFollowing[f][0]=="p") {
                            var nextPk = aFollowing[f][1];
                            // if nextPk has already been added, make sure its level is correct
                            // (there may be instances where it initally appears as level N, but it turns out to be closer than that)
                            if (pubkeys[nextPk]) {
                                var currentLevel = pubkeys[nextPk].followingData.level;
                                // new level is mininum of currentLevel and thisAuthorLevelNext
                                if (thisAuthorLevelNext < currentLevel) {
                                    pubkeys[nextPk].followingData.level = thisAuthorLevelNext;
                                    // only update if change is made (maybe check at end of this script if change is made?)
                                    // updatePubkeys(pubkeys);
                                    doUpdate = true;
                                }
                            }
                            if (thisAuthorLevelNext < maxDegreesOfSeparation) {
                            // if nextPk has not been added, initialize it here, but only if within the speified degrees of freedom
                                if (!pubkeys[nextPk]) {
                                    pubkeys[nextPk] = {
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
                                    // updatePubkeys(pubkeys);
                                    doUpdate = true;
                                }
                            }
                        }
                    }
                // }
            }
            if (doUpdate) {
                updatePubkeys(pubkeys);
            }
        }
    })}
    var aPkeys = Object.keys(pubkeys)
    var numFollowingKnown = 0;
    var numFollowingUnknown = 0;
    var numProfilesKnown = 0;
    var numProfilesUnknown = 0;
    var numLevel0 = 0;
    var numLevel1 = 0;
    var numLevel2 = 0;
    var numLevel3 = 0;
    var numLevel4 = 0;
    var numLevel5 = 0;
    var numLevel6 = 0;
    for (var a=0;a<aPkeys.length;a++) {
        var nextPkey = aPkeys[a];
        var oNextPkey = pubkeys[nextPkey]
        var nextFollowingCreatedAt = oNextPkey.followingData.created_at;
        if (nextFollowingCreatedAt==0) {
            numFollowingUnknown ++;
        } else {
            numFollowingKnown ++;
        }
        var level = oNextPkey.followingData.level;
        if (level == 0) { numLevel0++ }
        if (level == 1) { numLevel1++ }
        if (level == 2) { numLevel2++ }
        if (level == 3) { numLevel3++ }
        if (level == 4) { numLevel4++ }
        if (level == 5) { numLevel5++ }
        if (level == 6) { numLevel6++ }
        var nextProfileCreatedAt = oNextPkey.profileData.created_at;
        if (nextProfileCreatedAt==0) {
            numProfilesUnknown ++
        } else {
            numProfilesKnown ++;
        }
    }
    return (
        <>
            <div>
                <div>
                    <div>number of users: {Object.keys(pubkeys).length}</div>
                    <table>
                        <tr>
                            <th>kind</th>
                            <th>Known</th>
                            <th>Unknown</th>
                        </tr>
                        <tr>
                            <td>Following</td>
                            <td>{numFollowingKnown}</td>
                            <td>{numFollowingUnknown}</td>
                        </tr>
                        <tr>
                            <td>Profiles</td>
                            <td>{numProfilesKnown}</td>
                            <td>{numProfilesUnknown}</td>
                        </tr>
                    </table>
                    <table>
                        <tr>
                            <th>numLevel0</th>
                            <th>numLevel1</th>
                            <th>numLevel2</th>
                            <th>numLevel3</th>
                            <th>numLevel4</th>
                            <th>numLevel5</th>
                            <th>numLevel6</th>
                        </tr>
                        <tr>
                            <td>{numLevel0}</td>
                            <td>{numLevel1}</td>
                            <td>{numLevel2}</td>
                            <td>{numLevel3}</td>
                            <td>{numLevel4}</td>
                            <td>{numLevel5}</td>
                            <td>{numLevel6}</td>
                        </tr>
                    </table>
                </div>
                <pre style={{display:"none",border:"1px solid orange",maxHeight:"300px",overflow:"scroll"}} >
                    {JSON.stringify(pubkeys,null,4)}
                </pre>
            </div>
        </>
    )
};

export default FetchFollowingList;

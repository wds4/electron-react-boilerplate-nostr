import React from 'react';
import { useNostr, dateToUnix } from "nostr-react";
import { asyncSql } from "../../index.tsx";
import {
    type Event as NostrEvent,
    getEventHash,
    getPublicKey,
    signEvent,
    validateEvent,
    verifySignature,
} from "nostr-tools";

import * as MiscAppFxns from "../../lib/app/misc.ts";

const cloneObj = MiscAppFxns.cloneObj

const jQuery = require("jquery");

const fetchMyData = async () => {
    var sql = ""
    sql += "SELECT * FROM myProfile WHERE id=1"
    console.log("fetchMyData sql: "+sql)
    var aMyProfileData = await asyncSql(sql);
    console.log("fetchMyData aMyProfileData: "+JSON.stringify(aMyProfileData,null,4))
    if (aMyProfileData.length > 0) {
        var oMyProfileData = aMyProfileData[0]

        var myPk = oMyProfileData.pubkey;
        var mySk = oMyProfileData.privkey;
        var sMyFollowingList = oMyProfileData.following;
        if (!sMyFollowingList) { sMyFollowingList = "[]"; }
        var aMyFollowingList = JSON.parse(sMyFollowingList)
        return [ mySk, aMyFollowingList ]
    }
    return false;
}

const updateMyFollowingInSql = async (aFollowing_new) => {
    window.myProfile.following = aFollowing_new
    var sFollowing_new = JSON.stringify(aFollowing_new)
    var sql = "";
    sql += " UPDATE myProfile SET following = '"+sFollowing_new+"' WHERE id=1 "
    var result = await asyncSql(sql);
}

export default function FollowButton({pubkey,aFollowing}) {
    const { publish } = useNostr();

    var buttonHTML = "follow";
    var buttonClass = "followButton";
    var currentAction = "follow"
    // if (window.myProfile.following.includes(pubkey)) {
    if (aFollowing.includes(pubkey)) {
        buttonHTML = "unfollow";
        buttonClass = "unfollowButton";
        currentAction = "unfollow"
    }

    const onPublish = async () => {
        const [ privKey, aMyFollowingList_current ] = await fetchMyData();

        var aMyFollowingList_new = [];

        console.log("currentAction: "+currentAction)

        if (!window.myProfile.following.includes(pubkey)) {
            // If this pubkey is not currently in my following list, then add it
            for (var t=0;t<aMyFollowingList_current.length;t++) {
                var z = aMyFollowingList_current[t];
                if (z) {
                    aMyFollowingList_new.push(z)
                }
            }
            if (!aMyFollowingList_current.includes(pubkey)) {
                aMyFollowingList_new.push(pubkey)
                console.log("pushing pubkey: "+pubkey)
            }
        } else {
            // otherwise, remove pubkey from my following list
            for (var t=0;t<aMyFollowingList_current.length;t++) {
                var z = aMyFollowingList_current[t];
                if (z) {
                    if (z != pubkey) {
                        aMyFollowingList_new.push(z)
                    }
                }
            }
        }

        await updateMyFollowingInSql(aMyFollowingList_new)

        // this event must include a relay - I don't currently have a favorite but need to include something
        // (maybe change default relay list later)
        const oMessage = {
            "wss://nostr-pub.wellorder.net": {
                "read": true,
                "write": true
            }
        };

        const message = JSON.stringify(oMessage)

        const event: NostrEvent = {
            id: null,
            kind: 3,
            pubkey: window.myProfile.pubkey,
            created_at: dateToUnix(),
            content: message,
            tags: [
            ],
            sig: null,
        };
        for (var t=0;t<aMyFollowingList_new.length;t++) {
            var nextFollowing_pk = aMyFollowingList_new[t];
            if (nextFollowing_pk) {
                var nextItem = ["p",nextFollowing_pk];
                event.tags.push(nextItem)
            }
        }
        event.id = getEventHash(event);
        event.sig = signEvent(event, privKey);

        let ok = validateEvent(event)
        let veryOk = verifySignature(event)

        console.log("publish event; ok: "+ok+"; veryOk: "+veryOk+"; event: "+JSON.stringify(event,null,4))
        publish(event);
    };

    return (
        <>
            <div onClick={() => onPublish()} className={buttonClass} data-currentaction={currentAction} style={{position:"absolute",right:"5px",top:"5px"}} >
                {buttonHTML}
            </div>
        </>
    );

    /*
    if (window.myProfile.following.includes(pubkey)) {
        return (
            <>
                <div onClick={() => onPublish()} className={buttonClass} data-currentaction={currentAction} style={{position:"absolute",right:"5px",top:"5px"}} >
                    {buttonHTML}
                </div>
            </>
        );
    } else {
        return (
            <>
                <div onClick={() => onPublish()} className={buttonClass} data-currentaction={currentAction} style={{position:"absolute",right:"5px",top:"5px"}} >
                    {buttonHTML}
                </div>
            </>
        );
    }
    */
}

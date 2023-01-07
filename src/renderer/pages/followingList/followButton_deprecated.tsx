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
    // aFollowing_new = [];
    window.myProfile.following = aFollowing_new
    var sFollowing_new = JSON.stringify(aFollowing_new)
    var sql = "";
    sql += " UPDATE myProfile SET following = '"+sFollowing_new+"' WHERE id=1 "
    var result = await asyncSql(sql);
}

/*
[
  "p",
  "3efdaebb1d8923ebd99c9e7ace3b4194ab45512e2be79c1b7d68d9243e0d2681"
]
*/

export default function FollowButton({pubkey}) {
    const { publish } = useNostr();

    var buttonHTML = "follow";
    var buttonClass = "followButton";
    var currentAction = "follow"
    if (window.myProfile.following.includes(pubkey)) {
        buttonHTML = "unfollow";
        buttonClass = "unfollowButton";
        currentAction = "unfollow"
    }

    const onPublish = async () => {
        const [ privKey, aMyFollowingList_current ] = await fetchMyData();

        var aMyFollowingList_new = [];

        console.log("currentAction: "+currentAction)
        // var currentAction__ = (' ' + currentAction).slice(1);
        // console.log("currentAction__: "+currentAction__)

        if (!window.myProfile.following.includes(pubkey)) {
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
            /*
            buttonHTML = "unfollow";
            buttonClass = "unfollowButton";
            currentAction = "unfollow"
            */
        } else {
            // reproduce the above, but remove pubkey
            for (var t=0;t<aMyFollowingList_current.length;t++) {
                var z = aMyFollowingList_current[t];
                if (z) {
                    if (z != pubkey) {
                        aMyFollowingList_new.push(z)
                    }
                }
            }
            /*
            var buttonHTML = "follow";
            var buttonClass = "followButton";
            var currentAction = "follow"
            */
        }

        await updateMyFollowingInSql(aMyFollowingList_new)

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
}

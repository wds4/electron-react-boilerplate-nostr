import React, { useState, useEffect, useRef } from 'react';
import { Link, NavLink } from "react-router-dom";
import { useNostrEvents, useProfile } from "nostr-react";
import * as MiscAppFxns from "../../lib/app/misc.ts";
import ActionButtons from "./actionButtons.js";
import BlankAvatar from "./blankAvatar.png";

import {
    validateEvent,
    verifySignature,
} from "nostr-tools";

const secsToTime = MiscAppFxns.secsToTime
const isValidObj = MiscAppFxns.isValidObj

/*
Need to rething actions upon click link, especially whether / when to do this:
window.threadRoot_id = event.id
(Initially only did this in reply page)
*/

const UserPost = ({event, isExpanded, enableReply, currentPage, isRootMessage}) => {
    let ok = false;
    let veryOk = false;
    if (isValidObj(event)) {
        ok = validateEvent(event)
        veryOk = verifySignature(event)
    }
    if ((ok) && (veryOk)) {
        const pk = event.pubkey;
        const currentTime = Math.floor(Date.now() / 1000);
        const displayTime = secsToTime(event.created_at);

        const avatarID = "smallAvatarContainer_"+pk;

        var name="..."+pk.slice(-6);
        var picture_url = "";
        var display_name = "";
        var nameClass = "nameUnknown";
        var avatarClass_blank = "smallAvatarBox_show";
        var avatarClass_pic = "smallAvatarBox_hide";
        if (window.profiles.hasOwnProperty(pk)) {
            var oEvent_this = window.profiles[pk]
            if (oEvent_this) {
                if (isValidObj(oEvent_this.content)) {
                    picture_url = JSON.parse(oEvent_this.content).picture;
                    name = JSON.parse(oEvent_this.content).name;
                    display_name = JSON.parse(oEvent_this.content).display_name;
                }
            }
            nameClass = "nameKnown";
            var avatarClass_blank = "smallAvatarBox_hide";
            var avatarClass_pic = "smallAvatarBox_show";
        }
        var eventContainerClassName = "eventContainer"
        if (isExpanded) {
            eventContainerClassName += " expandedEventContainer"
        }
        if (isRootMessage) {
            eventContainerClassName += " rootEventContainer"
        }
        var eventContainer_id = "mainId_"+event.id;

        var replyContainerClassName = "replyContainer_hide"
        var newReplyTextareaId = "newReplyTextarea_NOT"
        if (enableReply) {
            replyContainerClassName = "replyContainer_show"
            newReplyTextareaId = "newReplyTextarea"
        }
        const linkToThread_base = "Thread";
        if (!window.linkToThread_base) { window.linkToThread_base="Thread" }
        var linkToThread = "/"+window.linkToThread_base+"/"+event.id;
        const linkToAuthor = "/UserProfile";
        return (
            <>
                <div className={eventContainerClassName} id={eventContainer_id} >
                    <div id={avatarID} className="smallAvatarContainer" >
                        <img src={BlankAvatar} className={avatarClass_blank} />
                        <img src={picture_url} className={avatarClass_pic} />
                    </div>
                    <div className="eventMainBodyContainer" >
                        <div className="eventNameAndTimeContainer" >
                            <Link
                                onClick={() => {
                                    window.clickedPubKey = pk;

                                    // This is an inelegant workaround to make sure the "/Thread" link works even when used multiple times in a row.
                                    // I am alternating the link between Thread and Thread2. Otherwise react refuses to re-render the page.
                                    if (window.linkToThread_base=="Thread") {
                                        window.linkToThread_base="Thread2"
                                    } else {
                                        window.linkToThread_base="Thread"
                                    }
                                } }
                                to={linkToAuthor}
                            >
                                <div className="eventNameContainer" data-pubkey={pk} >
                                    <span className={nameClass} style={{marginRight:"10px"}}>
                                        {display_name}
                                        <span style={{color:"grey",marginLeft:"10px"}}>@{name}</span>
                                    </span>
                                </div>
                            </Link>
                            <div className="eventTimeContainer" >
                                {displayTime}
                            </div>
                        </div>
                        <NavLink
                            onClick={() => {
                                window.expandedEvent = event;
                                window.threadRoot_id = event.id
                                console.log("linkToThread: "+linkToThread)
                            } }
                            className="eventContentContainer"
                            to={linkToThread}
                            to_base={window.linkToThread_base}
                            state={{ focuseventid: event.id }}
                        >
                            {event.content}
                        </NavLink>
                        <div className="eventActionButtonsContainer" >
                            <ActionButtons
                            event={event}
                            state={{ focuseventid: event.id }}
                            />
                        </div>
                    </div>
                    <div className={replyContainerClassName} >
                        <textarea id={newReplyTextareaId} style={{width:"80%",height:"200px",borderRadius:"10px",padding:"5px"}} ></textarea>
                        <div onClick={() => sendReply(event.id)} className="doSomethingButton" style={{verticalAlign:"bottom"}} >Reply</div>
                        <pre className="newEventContainer">
                        </pre>
                    </div>
                </div>
            </>
        )
    } else {
        return (
            <>
              <div className="eventContainer"  >
                  Event is invalid.
              </div>
            </>
        )
    }
}
export default UserPost

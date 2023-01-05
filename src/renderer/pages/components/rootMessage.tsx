import React from 'react';
import { NavLink, Link, useLocation } from "react-router-dom";
import Masthead from '../../mastheads/mainMasthead.js';
import LeftNavbar from '../../navbars/leftNav.js';
import * as MiscAppFxns from "../../lib/app/misc.ts";
import BlankAvatar from "../components/blankAvatar.png";
import ActionButtons from "./actionButtons.js";
import { determineNip10Scheme, fetchRootEvent_d, fetchRootEvent_p} from "../thread/index";

import { useNostr, useNostrEvents, dateToUnix } from "nostr-react";
import {
    type Event as NostrEvent,
    getEventHash,
    getPublicKey,
    signEvent,
    validateEvent,
    verifySignature,
} from "nostr-tools";

const jQuery = require("jquery");

const updateMainColWidth = MiscAppFxns.updateMainColWidth;
const secsToTime = MiscAppFxns.secsToTime
const isValidObj = MiscAppFxns.isValidObj
const timeout = MiscAppFxns.timeout
const fetchMySk = MiscAppFxns.fetchMySk

// I ought to pass root_id to RootMessage rather than repeating the discovery of root_id using functions imported from ../thread/
export default function RootMessage() {
    const { publish } = useNostr();
    const expandedEvent = window.expandedEvent
    const expandedEventTags = expandedEvent.tags;

    var root_id = window.threadRoot_id;

    const sendReply = async (reply_to_id) => {

        const privKey = await fetchMySk();

        if (!privKey) {
          alert("no private key provided");
          return;
        }

        const message = jQuery("#newReplyTextarea").val()

        if (!message) {
          alert("no message provided");
          return;
        }

        const event: NostrEvent = {
            content: message,
            kind: 1,
            tags: [],
            created_at: dateToUnix(),
            pubkey: getPublicKey(privKey),
        };

        // Need to make reply-specific tags following NIP-10 preferred method:
        // https://github.com/nostr-protocol/nips/blob/master/10.md
        var reply_root_id = root_id;
        var reply_root_relay_url = window.relayForReplies;
        var reply_to_relay_url = window.relayForReplies;

        var tag1 = ["e",reply_root_id,reply_root_relay_url,"root"]
        var tag2 = ["e",reply_to_id,reply_to_relay_url,"reply"]

        event.tags.push(tag1)
        event.tags.push(tag2)

        event.id = getEventHash(event);
        event.sig = signEvent(event, privKey);

        jQuery(".newEventContainer").html(JSON.stringify(event,null,4))
        publish(event);
    };

    if (root_id) {
        var { events } = useNostrEvents({
            filter: {
                since: 0,
                kinds: [1],
                ids: [root_id],
            },
        });
        const event = events[0];
        let ok = false;
        let veryOk = false;
        if (isValidObj(event)) {
            ok = validateEvent(event)
            veryOk = verifySignature(event)
        }
        if ((ok) && (veryOk)) {
            const pk = event.pubkey;
            const event_id = event.id;

            jQuery(".eventNameContainer").unbind("click").click(async function(){
                var clickedPubKey = jQuery(this).data("pubkey")
                console.log("eventNameContainer clicked; clickedPubKey: "+clickedPubKey)
                jQuery("#userProfileContainer").html(clickedPubKey)
                window.clickedPubKey = clickedPubKey;
                jQuery("#userProfileButton").get(0).click();
            })
            var pic_url = "";
            var name = "..." + pk.slice(-6);
            var display_name = "";
            var nameClass = "nameUnknown";
            var avatarClass_blank = "smallAvatarBox_show";
            var avatarClass_pic = "smallAvatarBox_hide";

            if (window.profiles.hasOwnProperty(pk)) {
                var oEvent_this = window.profiles[pk]
                pic_url = "";
                name = "";
                display_name = "";
                if (oEvent_this) {
                    if (isValidObj(oEvent_this.content)) {
                        pic_url = JSON.parse(oEvent_this.content).picture;
                        name = JSON.parse(oEvent_this.content).name;
                        display_name = JSON.parse(oEvent_this.content).display_name;
                    }
                }
                nameClass = "nameKnown";
                var avatarClass_blank = "smallAvatarBox_hide";
                var avatarClass_pic = "smallAvatarBox_show";
            }

            const howOld = secsToTime(event.created_at)
            const avatarID = "smallAvatarContainer_"+pk;

            var eventContainerClassName = "eventContainer rootEventContainer"
            /*
            if (window.expandedEvent.id == event_id) {
                eventContainerClassName += " rootEventContainer"
            }
            */
            var eventContainer_id = "mainId_"+event_id;

            var replyContainerClassName = "replyContainer_hide"
            var newReplyTextareaId = "newReplyTextarea_NOT"
            if (window.expandedEvent.id == event_id) {
                eventContainerClassName += " expandedEventContainer"
                replyContainerClassName = "replyContainer_show"
                newReplyTextareaId = "newReplyTextarea"
            }
            return (
                <>
                    <div className={eventContainerClassName} id={eventContainer_id} >

                        <div style={{fontSize:"18px",display:"none"}} >
                            this event_id:{event_id}
                            <br/>
                            root_id:{root_id}
                            <br/>
                            window.expandedEvent.id: {window.expandedEvent.id}
                        </div>


                        <div id={avatarID} className="smallAvatarContainer" >
                            <img src={BlankAvatar} className={avatarClass_blank} />
                            <img src={pic_url} className={avatarClass_pic} />
                        </div>
                        <div className="eventMainBodyContainer" >
                            <div className="eventNameAndTimeContainer" >
                                <div className="eventNameContainer" data-pubkey={pk} >
                                    <span className={nameClass} style={{marginRight:"10px"}}>
                                        {display_name}
                                        <span style={{color:"grey",marginLeft:"10px"}}>@{name}</span>
                                    </span>
                                </div>
                                <div className="eventTimeContainer" >
                                    {howOld}
                                </div>
                            </div>
                            <Link
                                onClick={() => window.expandedEvent = event}
                                className="eventContentContainer"
                                to="/Thread/fooo"
                                testVar = "foo"
                            >
                                {event.content}
                            </Link>
                            <div className="eventActionButtonsContainer" >
                                <ActionButtons
                                event={event}
                                />
                            </div>
                        </div>
                        <div className={replyContainerClassName} >
                            <pre style={{display:"none"}}>
                            {JSON.stringify(event,null,4)}
                            </pre>
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
                    <div>I found RootMessage's root_id: {root_id}, but I have not yet found a valid event.</div>
                </>
            )
        }
    }
}

import React, { useState, useEffect, useRef } from 'react';
import { Link, NavLink } from "react-router-dom";
import { useNostrEvents, useProfile } from "nostr-react";
import * as MiscAppFxns from "../../lib/app/misc.ts";
import BlankAvatar from "../components/blankAvatar.png";
import YoutubeEmbed from "../components/youtubeEmbed";
import { doesEventValidate } from "../../lib/nostr/eventValidation";

import {
    validateEvent,
    verifySignature,
    nip04,
} from "nostr-tools";

const secsToTime = MiscAppFxns.secsToTime
const isValidObj = MiscAppFxns.isValidObj
const fetchMySk = MiscAppFxns.fetchMySk
const timeout = MiscAppFxns.timeout

/*
Need to rething actions upon click link, especially whether / when to do this:
window.threadRoot_id = event.id
(Initially only did this in reply page)
*/

// const regExpImageUrls = /(http(s?):)([/|.|\w|\s|-])*\.(?:jpg|gif|png) // not yet tested or implemented
const regExpVideoID = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#\&\?]*).*/;
const youtubeRegex = /(?:https?:\/\/)?(?:www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&amp;v=))([\w-]{11})(?:\S+)?/g;
// from https://www.labnol.org/code/19797-regex-youtube-id
// input must be a url
const extractVideoID = (url) => {
    var match = url.match(regExpVideoID);
    if (match && match[7].length == 11) {
        console.log("extractVideoID match[7]: "+match[7])
        return match[7];
    } else {
        // return('Could not extract video ID.');
        return null;
    }
}
// input must contain an url within it
// output is the entire url
const extractVideoUrl = (rawContent) => {
    var match = rawContent.match(youtubeRegex);
    if (match) {
        console.log("extractVideoUrl match[0]: "+match[0])
        // var match = extractVideoID(url)
        return match[0];
    } else {
        // return('Could not extract video ID.');
        return null;
    }
}

const DirectMessage_ = ({dmData}) => {
    const event = dmData.event;
    const myPrivKey = dmData.myPrivKey;
    const rawContent = dmData.rawContent;
    const showThisEvent = dmData.showThisEvent;
    if ( (showThisEvent) && ( doesEventValidate(event) ) ) {
        let pk_receiver = event.tags.find( ([k, v]) => k === 'p' && v && v !== '')[1]

        if (showThisEvent != 0) {
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
            var oEvent_this = {}
            if (window.profiles.hasOwnProperty(pk)) {
                oEvent_this = window.profiles[pk]
                if (oEvent_this) {
                    if (isValidObj(oEvent_this.content)) {
                        picture_url = JSON.parse(oEvent_this.content).picture;
                        name = JSON.parse(oEvent_this.content).name;
                        display_name = JSON.parse(oEvent_this.content).display_name;
                    } else {
                        picture_url = oEvent_this.picture_url;
                        name = oEvent_this.name;
                        display_name = oEvent_this.display_name;
                    }
                }
                nameClass = "nameKnown";
                var avatarClass_blank = "smallAvatarBox_hide";
                var avatarClass_pic = "smallAvatarBox_show";
            }
            var directMessageContainerClassName = "directMessageTooltip directMessageContainer"
            if (showThisEvent==1) {
                directMessageContainerClassName += " directMessageContainerFloatLeft"
            }
            if (showThisEvent==2) {
                directMessageContainerClassName += " directMessageContainerFloatRight"
            }
            var eventContainer_id = "mainId_"+event.id;

            var replyContainerClassName = "replyContainer_hide"
            var newReplyTextareaId = "newReplyTextarea_NOT"
            const linkToThread_base = "Thread";
            if (!window.linkToThread_base) { window.linkToThread_base="Thread" }
            var linkToThread = "/"+window.linkToThread_base+"/"+event.id;
            const linkToAuthor = "/UserProfile";

            // var rawContent = event.content
            // let rawContent = await nip04.decrypt(myPrivKey, pubkey, event.content)
            // rawContent = "https://www.youtube.com/watch?v=ljvpz2fEyVE";
            // const embedId = "rokGy0huYEA"; // sample video
            // const embedId = ""; // if (embedId) is false, no video will embed
            const embedId = extractVideoID(rawContent)
            const extractedUrl = extractVideoUrl(rawContent)
            var embedId2 = null;
            var contentMinusVideoUrl = rawContent;
            if (extractedUrl) {
                embedId2 = extractVideoID(extractedUrl)
                contentMinusVideoUrl = rawContent.replace(extractedUrl,"")
            }
            return (
                <>
                    <div className={directMessageContainerClassName} id={eventContainer_id} >
                        <div className="directMessageContentContainer" >
                            {contentMinusVideoUrl}
                            <YoutubeEmbed embedId={embedId2} extractedUrl={extractedUrl} />
                            <div className="directMessageTooltipText" >
                                {displayTime}
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
                  <div className="eventContainer" style={{display:"none"}} >
                      Message is not for me!
                  </div>
                </>
            )
        }
    } else {
        return (
            <>
              <div className="eventContainer" style={{display:"none"}} >
                  Event is invalid.
              </div>
            </>
        )
    }
}
// export default DirectMessage


export default class DirectMessage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            rawContent: "unknown",
            showThisEvent: 0,
            dmData: {
                event: {},
                myPrivKey: null,
                rawContent: null,
                showThisEvent: 0,
                pk_receiver: null,
            }
        }
    }
    async componentDidMount() {
        // timeout(10)
        var event = this.props.event;

        var pk_receiver = await event.tags.find( ([k, v]) => k === 'p' && v && v !== '')[1]

        var showThisEvent = 0;
        // IF THIS PROFILE IS SENDER && I AM RECEIVER
        if ( (this.props.event.pubkey==window.clickedPubKey) && (pk_receiver==window.myPubkey) ) {
            showThisEvent = 1;
        }
        // IF I AM SENDER && THIS PROFILE IS RECEIVER
        if ( (this.props.event.pubkey==window.myPubkey) && (pk_receiver==window.clickedPubKey) ) {
            showThisEvent = 2;
        }

        var rawContent = "???";
        if (showThisEvent==1) {
            rawContent = await nip04.decrypt(this.props.myPrivKey, this.props.event.pubkey, this.props.event.content)
        }
        if (showThisEvent==2) {
            rawContent = await nip04.decrypt(this.props.myPrivKey, window.clickedPubKey, this.props.event.content)
        }
        var dmData = {};
        dmData.event = this.props.event;
        dmData.myPrivKey = this.props.myPrivKey;
        dmData.rawContent = rawContent;
        dmData.showThisEvent = showThisEvent;
        dmData.pk_receiver = pk_receiver;
        this.setState({dmData:dmData,rawContent:rawContent,showThisEvent:showThisEvent})
        this.forceUpdate();
    }
    render() {
        return (
            <>
                <DirectMessage_
                    dmData={this.state.dmData}
                    event={this.props.event}
                    myPrivKey={this.props.myPrivKey}
                    rawContent={this.state.rawContent}
                    showThisEvent={this.state.showThisEvent}
                />
            </>
        );
    }
}

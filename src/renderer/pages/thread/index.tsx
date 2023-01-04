import React from 'react';
import { NavLink, Link, useLocation } from "react-router-dom";
import Masthead from '../../mastheads/mainMasthead.js';
import LeftNavbar from '../../navbars/leftNav.js';
import * as MiscAppFxns from "../../lib/app/misc.ts";
import BlankAvatar from "../mainFeed/blankAvatar.png";
import ActionButtons from "../mainFeed/actionButtons.js";
import RootMessage from "./rootMessage";

import { useNostrEvents } from "nostr-react";
import {
    validateEvent,
    verifySignature,
} from "nostr-tools";

const jQuery = require("jquery");

const updateMainColWidth = MiscAppFxns.updateMainColWidth;
const secsToTime = MiscAppFxns.secsToTime
const isValidObj = MiscAppFxns.isValidObj
const timeout = MiscAppFxns.timeout

// an imperfect way to determine whether this event is using the deprecated or the preferred nip10 scheme
// See: https://github.com/nostr-protocol/nips/blob/master/10.md

export const determineNip10Scheme = (tags) => {
    var nip10Scheme = "deprecated";
    for (var e=0;e<tags.length;e++) {
        var nextThreadEvent = tags[e];
        if (nextThreadEvent=="e") {
            var numItems = nextThreadEvent.length;
            if (numItems == 3) {
                nip10Scheme = "preferred";
            }
        }
    }
    return nip10Scheme;
}

// deprecated nip-10 scheme
export const fetchRootEvent_d = (tags) => {
    var eTags=[];
    for (var e=0;e<tags.length;e++) {
        var nextThreadEvent = tags[e];
        if (nextThreadEvent[0]=="e") {
            eTags.push(nextThreadEvent)
        }
    }

    var numETags = eTags.length;
    if (numETags==0) {
        // not a thread
        return "noThread";
    }
    if (numETags==1) {
        //
        var nextThreadEvent = eTags[0]
        var root_id = nextThreadEvent[1];
        return root_id;
    }
    if (numETags==2) {
        //
        var nextThreadEvent = eTags[0]
        var root_id = nextThreadEvent[1];
        return root_id;
    }
    if (numETags > 2) {
        //
        var nextThreadEvent = eTags[0]
        var root_id = nextThreadEvent[1];
        return root_id;
    }

    return false;
}

// preferred nip-10 scheme
export const fetchRootEvent_p = (tags) => {
  for (var e=0;e<tags.length;e++) {
      var nextThreadEvent = tags[e];
      if (nextThreadEvent[0]=="e") {
          if (nextThreadEvent[3]=="root") {
              var root_id = nextThreadEvent[1];
              return root_id;
          }
      }
  }
  return false;
}

var aScrollPast = [];
var scrollDistance = 0;

const ThreadFeed = ({root_id}) => {
    if (!root_id) {
        window.threadRoot_id = window.expandedEvent.id;
        return (
            <>
            <div style={{display:"none"}} >
                No root_id; need to show clicked message as the root
                <br/>
                window.threadRoot_id: {window.threadRoot_id}
                <br/>
                window.expandedEvent.id: {window.expandedEvent.id}
            </div>
            <RootMessage />
            </>
        )
    }
    var { events } = useNostrEvents({
        filter: {
            since: 0, // all new events from now
            kinds: [1],

            "#e": [root_id],
        },
    });
    const reversed = events.reverse()
    scrollDistance = 0;
    var passedExpandedEventYet = false;
    aScrollPast = [root_id];
    return (
        <>
        <div style={{fontSize:"18px",display:"none"}}>
        root_id:{root_id}
        </div>
        <RootMessage />
        {reversed.map( (event) => {
            let ok = false;
            let veryOk = false;
            if (isValidObj(event)) {
                ok = validateEvent(event)
                veryOk = verifySignature(event)
            }
            if ((ok) && (veryOk)) {
                // need to make sure sort order is correct
                // events.sort((a, b) => parseFloat(a.created_at) - parseFloat(b.created_at));
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

                var eventContainerClassName = "eventContainer"
                if (window.expandedEvent.id == event_id) {
                    eventContainerClassName += " expandedEventContainer"
                    passedExpandedEventYet = true;
                }
                if (!passedExpandedEventYet) {
                    // scrollDistance += 50;
                    aScrollPast.push(event_id);
                }
                var eventContainer_id = "mainId_"+event_id;
                var toLink = "/Thread/"+event.id
                return (
                    <>
                        <div className={eventContainerClassName} id={eventContainer_id} >
                            <div style={{fontSize:"18px",display:"none"}}>
                                event_id:{event_id}
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
                                    onClick={() => { window.expandedEvent = event; window.threadRoot_id = event.id } }
                                    className="eventContentContainer"
                                    to={toLink}
                                    testVar = {event.id}
                                >
                                    {event.content}
                                </Link>
                                <div className="eventActionButtonsContainer" >
                                    <ActionButtons
                                    event={event}
                                    />
                                </div>
                            </div>
                        </div>
                    </>
                )}
            }
        )}
        </>
    )
}

export default class Thread extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            root_id: null
        }
    }

    async componentDidMount() {
        updateMainColWidth();
        document.getElementById("mastheadCenterContainer").innerHTML = "thread"

        aScrollPast = [];

        const expandedEvent = window.expandedEvent
        const expandedEventTags = expandedEvent.tags;

        var root_id = null;

        if (expandedEventTags.length == 0) {
            // show expanded event by itself
            root_id = expandedEvent.id;
        }
        if (expandedEventTags.length > 0) {
            // show thread

            var nip10Scheme = determineNip10Scheme(expandedEventTags)
            console.log("nip10Scheme: "+nip10Scheme)
            if (nip10Scheme=="deprecated") {
                root_id = fetchRootEvent_d(expandedEventTags)
            }
            if (nip10Scheme=="preferred") {
                root_id = fetchRootEvent_p(expandedEventTags)
            }
            console.log("root_id: "+root_id)
            if (root_id) {
                this.setState({root_id: root_id})
                window.threadRoot_id = root_id;
                this.forceUpdate();
            }
        }
        await timeout(1000)

        for (var s=0;s<aScrollPast.length;s++) {
            var nextEventId = aScrollPast[s];
            var nextElemId = "mainId_"+nextEventId;
            var nextElemHeight = document.getElementById(nextElemId).offsetHeight;
            scrollDistance += nextElemHeight + 10; // extra 10 pixels for the margin-bottom of class eventContainer; could get offsetMarginBottom?
            console.log("for nextEventId: "+nextEventId)
            console.log("+= nextElemHeight: "+nextElemHeight)
        }
        console.log("scrollDistance: "+scrollDistance)
        var scrollTop = "+="+scrollDistance+"px"
        jQuery("#mainPanel").animate({scrollTop: scrollTop}, 500)
    }
    render() {
        return (
            <>
                <div id="menuCol" className="menuCol" >
                    <LeftNavbar />
                </div>
                <div id="mainCol" >
                    <div id="mastheadElem" >
                        <Masthead />
                    </div>
                    <div id="mainPanel" >
                        <NavLink  to='/UserProfile' id="userProfileButton" style={{display:"none"}} >
                            <div style={{fontSize:"12px",lineHeight:"100%"}} >user profile</div>
                            <div id="userProfileContainer" ></div>
                        </NavLink>
                        <pre style={{display:"none"}} >
                            {JSON.stringify(window.expandedEvent,null,4)}
                        </pre>
                        <div id="threadContainer">
                            <ThreadFeed root_id={this.state.root_id} />
                        </div>
                    </div>
                </div>
            </>
        );
    }
}

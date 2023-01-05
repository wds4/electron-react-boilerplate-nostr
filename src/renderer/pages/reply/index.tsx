import React from 'react';
import { NavLink, Link, useLocation } from "react-router-dom";
import Masthead from '../../mastheads/mainMasthead.js';
import LeftNavbar from '../../navbars/leftNav.js';
import * as MiscAppFxns from "../../lib/app/misc.ts";
import BlankAvatar from "../components/blankAvatar.png";
import ActionButtons from "../mainFeed/actionButtons.js";
import RootMessage from "../components/rootMessage";
import UserPost from "../components/userPost";

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

// an imperfect way to determine whether this event is using the deprecated or the preferred nip10 scheme
// See: https://github.com/nostr-protocol/nips/blob/master/10.md

const determineNip10Scheme = (tags) => {
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
const fetchRootEvent_d = (tags) => {
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
const fetchRootEvent_p = (tags) => {
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
    const randVar = Math.random();
    var { events } = useNostrEvents({
        filter: {
            since: 0, // all new events from now
            kinds: [1],
            "#e": [root_id],
        },
    });

    const sendReply = async (reply_to_id) => {
        const { publish } = useNostr();
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
    const currentPage = "reply";
    const reversed = events.reverse()
    scrollDistance = 0;
    var passedExpandedEventYet = false;
    aScrollPast = [root_id];
    return (
        <>
        <div style={{fontSize:"64px",display:"none"}}>
        Need to fetch root_id message and put at the top.
        </div>
        <RootMessage />
        {reversed.map( (event) => {
            var enableReply = false;
            var isExpanded = false;
            if (window.expandedEvent.id == event.id) {
                isExpanded = true;
                passedExpandedEventYet = true;
                enableReply = true;
            }
            if (!passedExpandedEventYet) {
                aScrollPast.push(event.id);
            }

            return (
                <>
                    <UserPost
                        event={event}
                        enableReply={enableReply}
                        isExpanded={isExpanded}
                        currentPage={currentPage}
                    />
                </>
            )}
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
        document.getElementById("mastheadCenterContainer").innerHTML = "reply"

        aScrollPast = [];

        const expandedEvent = window.expandedEvent
        const expandedEventTags = expandedEvent.tags;

        if (expandedEventTags.length == 0) {
            // show expanded event by itself
        }
        if (expandedEventTags.length > 0) {
            // show thread
            var root_id = null;
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
            try {
                var nextElemHeight = document.getElementById(nextElemId).offsetHeight;
                scrollDistance += nextElemHeight + 10; // extra 10 pixels for the margin-bottom of class eventContainer; could get offsetMarginBottom?
                console.log("for nextEventId: "+nextEventId)
                console.log("+= nextElemHeight: "+nextElemHeight)
            } catch (e) {}
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

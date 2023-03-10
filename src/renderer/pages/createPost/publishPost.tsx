import React from 'react';
import { useNostr, dateToUnix } from "nostr-react";
import * as MiscAppFxns from "../../lib/app/misc.ts";
import { asyncSql } from "../../index.tsx";
import {
    type Event as NostrEvent,
    getEventHash,
    getPublicKey,
    signEvent,
} from "nostr-tools";

const fetchMySk = MiscAppFxns.fetchMySk

const jQuery = require("jquery");

export default function PublishPost() {
    const { publish } = useNostr();

    const onPost = async () => {

        const privKey = await fetchMySk();

        if (!privKey) {
          alert("no private key provided");
          return;
        }

        const message = jQuery("#newPostTextarea").val()

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

        event.id = getEventHash(event);
        event.sig = signEvent(event, privKey);

        publish(event);
        jQuery("#newPostTextarea").val("")
        jQuery("#successMessageContainer").html("Your message has been submitted to the nostr network!")
        jQuery("#newEventContainer").html("Here it is:<br/><br/>"+JSON.stringify(event,null,4))
        jQuery("#newPostTextareaContainer").change(function(){
            jQuery("#successMessageContainer").html("")
            jQuery("#newEventContainer").html("")
        })
    };

    return (
        <div style={{position:"relative",display:"inline-block",width:"90%"}} >
            <div id="newPostTextareaContainer">
                <textarea id="newPostTextarea" className="newPostTextarea" ></textarea>
            </div>
            <div onClick={onPost} className="doSomethingButton" style={{position:"absolute",right:"0px"}} >Post a message!</div>
            <div id="successMessageContainer" style={{fontSize:"14px",marginTop:"20px"}} ></div>
            <div id="newEventContainer" className="newEventContainer"
                style={{fontSize:"14px",marginTop:"20px",width:"80%",height:"250px",overflow:"scroll",padding:"5px"}} >
            </div>
        </div>
    );
}

import React, { useState, useEffect, useRef } from 'react';
import { Link, NavLink } from "react-router-dom";
import { useNostrEvents, useProfile } from "nostr-react";
import * as MiscAppFxns from "../../lib/app/misc.ts";
import DirectMessage from "./directMessage";

const cloneObj = MiscAppFxns.cloneObj;

const DirectMessageConversationHistory = ({pubkey,myPrivKey}) => {
    var { events } = useNostrEvents({
        filter: {
            authors: [ pubkey, window.myPubkey ],
            since: 0, // all new events from now
            kinds: [4],
        },
    });
    return (
      <>
        {events.forEach( event => {
          return (
            <DirectMessage
                event={event}
                myPrivKey={myPrivKey}
            />
          )
        }
      )}
      </>
    )
};

export default DirectMessageConversationHistory;

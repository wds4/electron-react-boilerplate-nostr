import React, { useState, useEffect, useRef } from 'react';
import Masthead from '../../mastheads/mainMasthead.js';
import LeftNavbar from '../../navbars/leftNav.js';
import * as MiscAppFxns from "../../lib/app/misc.ts";
import { useNostrEvents } from "nostr-react";

const jQuery = require("jquery");

const updateMainColWidth = MiscAppFxns.updateMainColWidth;
const secsToTime = MiscAppFxns.secsToTime
const cloneObj = MiscAppFxns.cloneObj

const NameElem2 = (props) => {
    var { events } = useNostrEvents({
        filter: {
            authors: [ props.pubkey ],
            since: 0, // all new events from now
            kinds: [0],
        },
    });
    var events_n = cloneObj(events);
    return (
        <>
            {events_n.map( (event) => {
                var name = JSON.parse(event.content).name;
                return (
                  <>
                      {name}
                  </>
                )}
            )}
        </>
    );
}

export default class NameElem extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        }
    }
    async componentDidMount() {
    }
    render() {
        const pubkey = this.props.pubkey;
        return (
            <>
                <NameElem2 pubkey={pubkey} />
            </>
        );
    }
}

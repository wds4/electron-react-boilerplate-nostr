import React, { useState, useEffect, useRef } from 'react';
import * as MiscAppFxns from "../../lib/app/misc.ts";

import { useNostrEvents } from "nostr-react";

const isValidObj = MiscAppFxns.isValidObj

const jQuery = require("jquery");

const AvatarElem2 = (props) => {
    var { events } = useNostrEvents({
        filter: {
            authors: [ props.pubkey ],
            since: 0, // all new events from now
            kinds: [0],
        },
    });
    return (
        <>
            {events.map( (event) => {
                if (isValidObj(event.content)) {
                    var pic_url = JSON.parse(event.content).picture;
                    return (
                        <>
                            <img src={pic_url} className="smallAvatarBox" />
                        </>
                    )}
                }
            )}
        </>
    );
}

export default class AvatarElem extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        }
    }
    async componentDidMount() {
    }
    render() {
        const pk = this.props.pubkey;
        return (
            <>
                <div id="avatarButton" style={{width:"50px",height:"50px"}} >
                    <AvatarElem2 pubkey={pk} />
                </div>
            </>
        );
    }
}

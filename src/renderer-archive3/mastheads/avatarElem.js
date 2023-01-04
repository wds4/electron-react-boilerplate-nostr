import React, { useState, useEffect, useRef } from 'react';
import { useNostrEvents } from "nostr-react";
import BlankAvatar from "./blankAvatar.png";

const jQuery = require("jquery");

const AvatarElem2 = (props) => {

    if (window.myProfile) {
        if (window.myProfile.picture_url) {
            return (
                <>
                    <div id="avatarButton" className="mastheadAvatarContainer" >
                        <img src={window.myProfile.picture_url} className="mastheadAvatarBox" />
                    </div>
                </>
            );
        } else {
            return (
                <>
                    <div id="avatarButton" className="mastheadAvatarContainer" >
                        <img src={BlankAvatar} className="mastheadAvatarBox" />
                    </div>
                </>
            );
        }
    } else {
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
                    var pic_url = JSON.parse(event.content).picture;
                    return (
                      <>
                          <div id="avatarButton" className="mastheadAvatarContainer" >
                              <img src={pic_url} className="mastheadAvatarBox" />
                          </div>
                      </>
                    )}
                )}
            </>
        );
    }
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
                <AvatarElem2 pubkey={pk} />
            </>
        );
    }
}

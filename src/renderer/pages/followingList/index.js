import React, { useState, useEffect, useRef } from 'react';
import Masthead from '../../mastheads/mainMasthead.js';
import LeftNavbar from '../../navbars/leftNav.js';
import * as MiscAppFxns from "../../lib/app/misc.ts";
import SingleUserElem from "./singleUserElem";

import { useNostrEvents } from "nostr-react";

import {
    Kind,
    dateToUnix,
} from "@nostrgg/react";

import {
    relayInit,
    generatePrivateKey,
    getPublicKey,
    getEventHash,
    signEvent,
    validateEvent,
    verifySignature,
} from 'nostr-tools'

const jQuery = require("jquery");

const updateMainColWidth = MiscAppFxns.updateMainColWidth;

const FollowerList2 = () => {
    var { events } = useNostrEvents({
        filter: {
            authors: [ window.clickedPubKey ],
            since: 0, // all new events from now
            kinds: [3],
        },
    });

    return (
      <>
          <div style={{backgroundColor:"#AFAFAF"}} >
              <SingleUserElem pubkey={window.clickedPubKey} />
          </div>
          {events.map( (event) => {
              var aFollowing = event.tags
              var aFollowing_ = [];
              // remove duplicates
              for (var x=0;x<aFollowing.length;x++) {
                  var nextPk = aFollowing[x][1];
                  if (!aFollowing_.includes(nextPk)) {
                      if (nextPk != window.clickedPubKey) {
                          aFollowing_.push(nextPk)
                      }
                  }
              }
              // console.log("aFollowing_: "+JSON.stringify(aFollowing_,null,4))
              return (
                  <>
                      <pre style={{display:"none",border:"1ps solid purple",margin:"5px",padding:"5px"}} >
                      {JSON.stringify(event,null,4)}
                      </pre>
                      <div>
                          <div style={{textAlign:"center"}}>
                              Following: {aFollowing_.length}
                          </div>
                          {aFollowing_.map( (pk) => {
                              // var pk = following[1]
                              return (
                                  <>
                                      <SingleUserElem pubkey={pk} />
                                  </>
                              )}
                          )}
                      </div>
                  </>
              )}
          )}
      </>
    )
};

export default class FollowerList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            events: []
        }
    }
    async componentDidMount() {
        updateMainColWidth();
        document.getElementById("mastheadCenterContainer").innerHTML = "following"

        this.setState({events: [] })
        this.forceUpdate();
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
                        <FollowerList2 />
                    </div>
                </div>
            </>
        );
    }
}

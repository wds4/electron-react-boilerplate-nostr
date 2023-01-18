import React, { useState, useEffect, useRef } from 'react';
import { useNostr } from "nostr-react";
const jQuery = require("jquery");

const RelaysStatusComponent = () => {
    const { updateRelayList, connectedRelays } = useNostr();

    /*
    const addRelayer = (url) => {
        updateRelayList([
             ...connectedRelays,
             url,
        ])
    }
    const url = "wss://brb.io";
    addRelayer(url)
    */

    return (
        <>
            <div id="connectedRelaysButton" data-status="closed" >
                connected relays: {connectedRelays.length}
            </div>
            <div style={{overflow:"scroll"}} >
                <div id="connectedRelaysVerboseContainer" style={{textAlign:"left",display:"block",height:"0px"}} >
                    {connectedRelays.map( (oRelay,item)=>{
                        var url = oRelay.url;
                        return (
                            <div>
                                <div>
                                    {JSON.stringify(oRelay,null,4)}
                                </div>
                                {item+1}: {url}
                            </div>
                        )
                    })}
                </div>
            </div>
        </>
    )
};

export default class RelaysStatus extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        }
    }

    async componentDidMount() {
        jQuery("#connectedRelaysButton").click(function(){
            var currentStatus = jQuery(this).data("status");
            if (currentStatus=="closed") {
                jQuery(this).data("status","open");
                // jQuery("#connectedRelaysVerboseContainer").css("overflow","hidden")
                jQuery("#connectedRelaysVerboseContainer").animate({
                    height:"80px",
                },200)
            }
            if (currentStatus=="open") {
                jQuery(this).data("status","closed");
                jQuery("#connectedRelaysVerboseContainer").animate({
                    height:"0px",
                },200)
                // jQuery("#connectedRelaysVerboseContainer").css("overflow","scroll")
            }
        })
    }
    render() {
        return (
            <>
                <RelaysStatusComponent />
            </>
        );
    }
}

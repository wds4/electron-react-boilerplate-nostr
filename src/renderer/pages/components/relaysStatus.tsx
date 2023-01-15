import React, { useState, useEffect, useRef } from 'react';
import { useNostr } from "nostr-react";
const jQuery = require("jquery");

const RelaysStatusComponent = () => {
    const { connectedRelays } = useNostr();

    return (
        <>
            <div id="connectedRelaysButton" data-status="closed" >
                connected relays: {connectedRelays.length}
            </div>
            <div id="connectedRelaysVerboseContainer" style={{textAlign:"left",display:"block",height:"0px",overflow:"hidden"}} >
            {connectedRelays.map( (oRelay,item)=>{
                var url = oRelay.url;
                return (
                    <div>
                        {url}
                    </div>
                )
            })}
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
                jQuery("#connectedRelaysVerboseContainer").css("overflow","hidden")
                jQuery("#connectedRelaysVerboseContainer").animate({
                    height:"60px",
                },200)
            }
            if (currentStatus=="open") {
                jQuery(this).data("status","closed");
                jQuery("#connectedRelaysVerboseContainer").css("overflow","scroll")
                jQuery("#connectedRelaysVerboseContainer").animate({
                    height:"0px",
                },200)
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

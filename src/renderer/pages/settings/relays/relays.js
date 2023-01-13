import React from 'react';
import * as MiscAppFxns from "../../../lib/app/misc.ts";

import {
    dateToUnix,
} from "@nostrgg/react";

const jQuery = require("jquery");

const fetchRelays = MiscAppFxns.fetchRelays;

const createKnownRelaysList = async () => {

    var aVerbose = await fetchRelays("verbose")
    var aActive = aVerbose[0];
    var aDefault = aVerbose[1];
    var aAll = aVerbose[2];

    jQuery("#knownRelaysContainer").html("")

    for (var z=0;z<6;z++) {
        var url = aAll[z];
        var nextRelayHTML = "";
        nextRelayHTML += "<div >";
            nextRelayHTML += "<input class='relayCheckbox' style='display:inline-block;' type='checkbox' ";
            if (aActive.includes(url)) { nextRelayHTML += " checked "; }
            nextRelayHTML += " />";

            nextRelayHTML += "<div style='display:inline-block;margin-left:5px;width:200px;' >";
            nextRelayHTML += url;
            nextRelayHTML += "</div>";

            nextRelayHTML += "<div class='doSomethingButton_small' >";
            nextRelayHTML += "delete";
            nextRelayHTML += "</div>";
        nextRelayHTML += "</div>";
        jQuery("#knownRelaysContainer").append(nextRelayHTML)
    }
}

export default class RelaysSettings extends React.Component {

    async componentDidMount() {
        await createKnownRelaysList()
        jQuery("#addRelayButton").click(async function(){
            var newRelayUrl = jQuery("#newRelayTextarea").val();
            var currentTime = dateToUnix(new Date())
            var sql = "";
            sql += "INSERT OR IGNORE INTO relays (url, default_app, active) VALUES ('"+newRelayUrl+"', false, false) ";
            console.log("addRelayButton sql: "+sql)
        })
        jQuery("#selectAllRelaysButton").click(function(){
            jQuery(".relayCheckbox").attr("checked",true)
        })
        jQuery("#deselectAllRelaysButton").click(function(){
            jQuery(".relayCheckbox").attr("checked",false)
        })
    }
    render() {
        return (
            <>
                <div>
                    <div>Known relays</div>
                    <div id="selectAllRelaysButton" className="doSomethingButton" >
                    select all
                    </div>
                    <div id="deselectAllRelaysButton" className="doSomethingButton" >
                    deselect all
                    </div>
                    <div id="resetDefaultRelaysButton" className="doSomethingButton" >
                    reset app defaults
                    </div>
                    <div id="knownRelaysContainer">
                    </div>
                </div>
                <div>
                    <textarea id="newRelayTextarea" style={{height:"20px",width:"300px"}}>
                    </textarea>
                    <div id="addRelayButton" className="doSomethingButton" >
                    add a new relay
                    </div>
                </div>
            </>
        );
    }
}

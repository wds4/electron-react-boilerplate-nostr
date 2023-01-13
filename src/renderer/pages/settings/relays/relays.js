import React from 'react';
import * as MiscAppFxns from "../../../lib/app/misc.ts";
import { asyncSql } from "../../../index.tsx";

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

    for (var z=0;z<aAll.length;z++) {
        var url = aAll[z];
        var nextRelayHTML = "";
        nextRelayHTML += "<div class='relayInfoContainer' >";
            nextRelayHTML += "<input class='relayCheckbox' style='display:inline-block;' type='checkbox' ";
            nextRelayHTML += " data-z='"+z+"' ";
            nextRelayHTML += " data-url='"+url+"' ";
            if (aActive.includes(url)) { nextRelayHTML += " checked "; }
            nextRelayHTML += " />";

            nextRelayHTML += "<div class='relayUrlContainer' >";
            nextRelayHTML += url;
            nextRelayHTML += "</div>";

            nextRelayHTML += "<div class='doSomethingButton' >";
            nextRelayHTML += "delete";
            nextRelayHTML += "</div>";
        nextRelayHTML += "</div>";
        jQuery("#knownRelaysContainer").append(nextRelayHTML)
    }
    jQuery(".relayCheckbox").change(function(){
        var newState = jQuery(this).prop("checked")
        var z = jQuery(this).data("z")
        var url = jQuery(this).data("url")
        var sql = " UPDATE relays SET active="+newState+" WHERE url='"+url+"' "
        console.log("relayCheckbox changed; z: "+z+"; url: "+url+"; newState: "+newState+"; sql: "+sql)
        asyncSql(sql).then((result) => {
            jQuery("#updateStatusSuccess").html(url+" activity status has been updated to "+newState)
        });
    })
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
            asyncSql(sql).then((result) => {
                jQuery("#newRelayAddedSuccess").html("New relay added.")
            });
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
                    <div className="h4" >Known relays</div>
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
                    <div id="newRelayAddedSuccess" ></div>
                    <div id="updateStatusSuccess" ></div>
                </div>
            </>
        );
    }
}

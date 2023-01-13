import React from 'react';
import * as MiscAppFxns from "../../lib/app/misc.ts";

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
            nextRelayHTML += "<input style='display:inline-block;' type='checkbox' />";

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
                    Relays
                    <textarea style={{}}>
                    </textarea>
                    <div id="addRelayButton" className="doSomethingButton" >
                    add a new relay
                    </div>
                </div>
            </>
        );
    }
}

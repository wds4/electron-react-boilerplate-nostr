import React from 'react';
import Masthead from '../../../mastheads/mainMasthead.js';
import LeftNavbar from '../../../navbars/leftNav.js';
import LeftNavbar2 from '../../../navbars/leftNav2/settings.js';
import * as MiscAppFxns from "../../../lib/app/misc.ts";
import * as StartupFxns from "../../../lib/app/startup.ts";
import PkSettings from "./pk";
import RelaysSettings from "./relays";

const fetchMyPk = MiscAppFxns.fetchMyPk;

import { useNostrEvents, dateToUnix } from "nostr-react";

const jQuery = require("jquery");
const updateMainColWidth = MiscAppFxns.updateMainColWidth;
const cloneObj = MiscAppFxns.cloneObj
const secsToTime = MiscAppFxns.secsToTime
const timeout = MiscAppFxns.timeout

export default class Home extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
          events: []
        }
    }

    async componentDidMount() {
        updateMainColWidth();
        document.getElementById("mastheadCenterContainer").innerHTML = "settings: profile keys"
    }
    render() {
        return (
            <>
                <div id="menuCol" className="menuCol" >
                    <LeftNavbar />
                    <LeftNavbar2 />
                </div>
                <div id="mainCol" >
                    <div id="mastheadElem" >
                        <Masthead />
                    </div>
                    <div id="mainPanel" >
                        <PkSettings />
                    </div>
                </div>
            </>
        );
    }
}

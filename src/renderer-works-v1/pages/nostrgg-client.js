import React from 'react';
import Masthead from './mastheads/mainMasthead.js';
import LeftNavbar from './navbars/leftNav.js';
import * as MiscAppFxns from "./lib/app/misc.ts";

import {
  initNostr,
  SendMsgType,
  Kind,
} from "@nostrgg/client"

const updateMainColWidth = MiscAppFxns.updateMainColWidth;

export default class Home extends React.Component {
    constructor(props) {
        super(props);
        this.state = {}
    }
    async componentDidMount() {
        updateMainColWidth();
    }
    render() {
        return (
            <>
                <div id="menuCol" className="menuCol" >
                    <LeftNavbar />
                </div>
                <div id="mainCol" >
                    <Masthead />
                    <div id="mainPanel" >
                        <div className="h2">nostrgg-client</div>
                    </div>
                </div>
            </>
        );
    }
}

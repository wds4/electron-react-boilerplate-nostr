import React from 'react';
import Masthead from '../../mastheads/mainMasthead.js';
import LeftNavbar from '../../navbars/leftNav.js';
import * as MiscAppFxns from "../../lib/app/misc.ts";

const updateMainColWidth = MiscAppFxns.updateMainColWidth;

export default class Home extends React.Component {
    constructor(props) {
        super(props);
        this.state = {}
    }
    async componentDidMount() {
        updateMainColWidth();
        document.getElementById("mastheadCenterContainer").innerHTML = "manage channels"
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
                        <div className="h2">manage channels</div>
                        <div>(under construction)</div>

                    </div>
                </div>
            </>
        );
    }
}

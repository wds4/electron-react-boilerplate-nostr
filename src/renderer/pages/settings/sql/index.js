import React from 'react';
import { NavLink } from "react-router-dom";
import Masthead from '../../../mastheads/mainMasthead.js';
import LeftNavbar from '../../../navbars/leftNav.js';
import LeftNavbar2 from '../../../navbars/leftNav2/settings.js';
import * as MiscAppFxns from "../../../lib/app/misc.ts";
import SqlBody from './sql'

const updateMainColWidth = MiscAppFxns.updateMainColWidth;

export default class Home extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
          events: []
        }
    }

    async componentDidMount() {
        updateMainColWidth();
        document.getElementById("mastheadCenterContainer").innerHTML = "settings: sqlite3"
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
                        <SqlBody />
                    </div>
                </div>
            </>
        );
    }
}

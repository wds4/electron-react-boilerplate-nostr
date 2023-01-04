import React from 'react';
import { NavLink, useLocation } from "react-router-dom";
import Masthead from '../../mastheads/mainMasthead.js';
import LeftNavbar from '../../navbars/leftNav.js';
import * as MiscAppFxns from "../../lib/app/misc.ts";

const updateMainColWidth = MiscAppFxns.updateMainColWidth;

export default class Thread extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
          event: 'bar'
        }
    }

    async componentDidMount() {
        updateMainColWidth();
        document.getElementById("mastheadCenterContainer").innerHTML = "thread"
        // var barr = this.props.match.params.foo;
        // console.log("===: "+JSON.stringify(this.props,null,4))
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
                        Thread
                        <pre>
                        {this.state.event}
                        </pre>
                    </div>
                </div>
            </>
        );
    }
}

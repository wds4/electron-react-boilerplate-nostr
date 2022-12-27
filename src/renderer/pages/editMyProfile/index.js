import React from 'react';
import Masthead from '../../mastheads/mainMasthead.js';
import LeftNavbar from '../../navbars/leftNav.js';
import * as MiscAppFxns from "../../lib/app/misc.ts";

import { asyncSql } from "../../index.tsx";

const updateMainColWidth = MiscAppFxns.updateMainColWidth;

const jQuery = require("jquery");

export default class Home extends React.Component {
    constructor(props) {
        super(props);
        this.state = {}
    }
    async componentDidMount() {
        updateMainColWidth();
        document.getElementById("mastheadCenterContainer").innerHTML = "edit my profile"

        jQuery("#saveProfileButton").click(function(){

        })
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

                        <div className="editProfileFieldContainer" >
                            <div className="editProfileLeftColContainer" >
                                YOUR NAME
                            </div>
                            <textarea id="name" className="editProfileRightColContainer" >
                                right
                            </textarea>
                        </div>

                        <div className="editProfileFieldContainer" >
                            <div className="editProfileLeftColContainer" >
                                USERNAME
                            </div>
                            <textarea id="username" className="editProfileRightColContainer" >
                                right
                            </textarea>
                        </div>

                        <div className="editProfileFieldContainer" >
                            <div className="editProfileLeftColContainer" >
                                PROFILE PICTURE
                            </div>
                            <textarea id="profilePicture" className="editProfileRightColContainer" >
                                right
                            </textarea>
                        </div>

                        <div className="editProfileFieldContainer" >
                            <div className="editProfileLeftColContainer" >
                                WEBSITE
                            </div>
                            <textarea id="profilePicture" className="editProfileRightColContainer" >
                                right
                            </textarea>
                        </div>

                        <div className="editProfileFieldContainer" >
                            <div className="editProfileLeftColContainer" >
                                ABOUT ME
                            </div>
                            <textarea id="profilePicture" className="editProfileRightColContainer" >
                                right
                            </textarea>
                        </div>

                        <div className="editProfileFieldContainer" >
                            <div className="editProfileLeftColContainer" >
                                BITCION LIGHTNING TIPS
                            </div>
                            <textarea id="profilePicture" className="editProfileRightColContainer" >
                                right
                            </textarea>
                        </div>

                        <div className="editProfileFieldContainer" >
                            <div className="editProfileLeftColContainer" >
                                NIP05 VERIFICATION
                            </div>
                            <textarea id="profilePicture" className="editProfileRightColContainer" >
                                right
                            </textarea>
                        </div>

                        <div id="saveProfileButton" className="doSomethingButton" >SAVE</div>
                    </div>
                </div>
            </>
        );
    }
}

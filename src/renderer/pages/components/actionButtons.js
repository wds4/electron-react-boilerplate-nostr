import React, { useState, useEffect, useRef } from 'react';
import { Link, NavLink } from "react-router-dom";
import * as MiscAppFxns from "../../lib/app/misc.ts";

const jQuery = require("jquery");

const ActionButtons = ({event}) => {
    // var randomNumber = Math.random();
    if (!window.linkToReply_base) { window.linkToReply_base="Reply" }

    var linkToReply = "/"+window.linkToReply_base+"/"+event.id
    return (
        <>
            <div style={{fontSize:"18px"}}>
                <span className="singleActionButtonContainer" >
                    <Link className="singleActionButtonContainer"
                        onClick={() => {
                            window.expandedEvent = event;

                            // doing the same inelegant workaround as I am for linkToThread_base -- see userPost.js
                            if (window.linkToReply_base=="Reply") {
                                window.linkToReply_base="Reply2"
                            } else {
                                window.linkToReply_base="Reply"
                            }
                        } }
                        className="eventContentContainer"
                        to={linkToReply}
                        to_base={window.linkToReply_base}
                        event={event}
                    >
                        &#x1F4AC;
                    </Link>
                </span>
                <span className="singleActionButtonContainer" style={{display:"none"}} >&#x1F501;</span>
                <span className="singleActionButtonContainer" style={{display:"none"}} >&#x1F90D;</span>
                <span className="singleActionButtonContainer" style={{display:"none"}} >&#x1F49A;</span>
                <span className="singleActionButtonContainer" style={{display:"none"}} >&#x1F919;</span>
            </div>
            <pre style={{display:"none",border:"1px solid purple",padding:"5px",margin:"5px",fontSize:"10px"}}>
            {JSON.stringify(event,null,4)}
            </pre>
        </>
    );
}
export default ActionButtons

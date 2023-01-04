import React, { useState, useEffect, useRef } from 'react';
import { Link, NavLink } from "react-router-dom";
import * as MiscAppFxns from "../../lib/app/misc.ts";

const jQuery = require("jquery");

const ActionButtons = ({event}) => {
    var randomNumber = Math.random();
    var toLink = "/Reply/"+event.id+randomNumber
    return (
        <>
            <div style={{fontSize:"18px"}}>
                <span className="singleActionButtonContainer" >
                    <Link className="singleActionButtonContainer"
                        onClick={() => { window.expandedEvent = event; console.log("reply button clicked; event.id: "+ toLink) } }
                        className="eventContentContainer"
                        to={toLink}
                        testVar = {randomNumber}
                        event={event}
                    >
                        &#x1F4AC;
                    </Link>
                </span>
                <span className="singleActionButtonContainer" >&#x1F501;</span>
                <span className="singleActionButtonContainer" >&#x1F90D;</span>
                <span style={{display:"none"}} className="singleActionButtonContainer" >&#x1F49A;</span>
            </div>
            <pre style={{display:"none",border:"1px solid purple",padding:"5px",margin:"5px",fontSize:"10px"}}>
            {JSON.stringify(event,null,4)}
            </pre>
        </>
    );
}
export default ActionButtons

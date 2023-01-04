import React, { useState, useEffect, useRef } from 'react';
import * as MiscAppFxns from "../../lib/app/misc.ts";

const jQuery = require("jquery");

const ActionButtons = ({event}) => {

    return (
        <>
            <div style={{fontSize:"18px"}}>
                <span className="singleActionButtonContainer" >&#x1F4AC;</span>
                <span className="singleActionButtonContainer" >&#x1F501;</span>
                <span className="singleActionButtonContainer" >&#x1F90D;</span>
                <span className="singleActionButtonContainer" >&#x1F49A;</span>
            </div>
            <pre style={{border:"1px solid purple",padding:"5px",margin:"5px",fontSize:"10px"}}>
            {JSON.stringify(event,null,4)}
            </pre>
        </>
    );
}
export default ActionButtons

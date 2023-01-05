import React, { useState, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
// import * as VisjsFunctions from '../../lib/vis/visjsFunctions.js';
import { DataSet, Network} from 'vis-network/standalone/esm/vis-network';
// import * as VisStyleConstants from '../../lib/vis/visjs-style';

const NFG_Graphic = () => {
    return (
        <>
            <div id="nfgGraphicContainer" className="nfgGraphicContainer" ></div>
        </>
    )
}
export default NFG_Graphic;

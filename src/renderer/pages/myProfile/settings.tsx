import React from 'react';
import * as MiscAppFxns from "../../lib/app/misc.ts";

import { asyncSql } from "../../index.tsx";

const jQuery = require("jquery");

export default class Settings extends React.Component {
    constructor(props) {
        super(props);
        this.state = {}
    }
    async componentDidMount() {
    }
    render() {
        return (
            <>
                <div className="h2" >
                Settings
                </div>

                <div style={{fontSize:"18px"}} >
                    Main Feed
                </div>
                <div>
                    <input type="radio" name="mainFeedType" value="firehose" checked />
                    <span className="radioButtonDescriptor" >firehose (display everyone)</span>
                </div>

                <div>
                    <input type="radio" name="mainFeedType" value="following" />
                    <span className="radioButtonDescriptor" >following (only display post from those you follow)</span>
                </div>

                <div>
                    <input type="radio" name="mainFeedType" value="grapevine" />
                    <span className="radioButtonDescriptor" >grapevine</span>
                </div>

                <div style={{fontSize:"18px"}} >
                    how long ago for feed to start
                </div>
            </>
        );
    }
}

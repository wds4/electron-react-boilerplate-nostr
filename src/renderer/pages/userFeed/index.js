import React from 'react';
import Masthead from '../../mastheads/mainMasthead.js';
import LeftNavbar from '../../navbars/leftNav.js';
import * as MiscAppFxns from "../../lib/app/misc.ts";

import {nip05} from 'nostr-tools'

const updateMainColWidth = MiscAppFxns.updateMainColWidth;

export default class Home extends React.Component {
    constructor(props) {
        super(props);
        this.state = {}
    }
    async componentDidMount() {
        updateMainColWidth();

        let profile = await nip05.queryProfile('jb55.com')
        console.log(profile.pubkey)
        // prints: 32e1827635450ebb3c5a7d12c1f8e7b2b514439ac10a67eef3d9fd9c5c68e245
        console.log(profile.relays)
        // prints: [wss://relay.damus.io]
        console.log("profile: "+JSON.stringify(profile,null,4))
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
                        <div className="h2">main feed</div>
                    </div>
                </div>
            </>
        );
    }
}

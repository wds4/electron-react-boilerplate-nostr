import React from 'react';
import ReactDOM from 'react-dom';
import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import * as MiscAppFxns from './lib/app/misc.ts';

import MainFeed from './pages/mainFeed/index';
import ManageChannels from './pages/manageChannels/index';
import UserProfile from './pages/userProfile/index';

import './css/app.css';
import './css/mastheads.css';
import './css/navbars.css';
import './css/feed.css';

import { NostrProvider } from "@nostrgg/react";

const relayUrls = [
    "wss://nostr-pub.wellorder.net",
    "wss://nostr-relay.untethr.me",
    "wss://relay.damus.io",
];

window.clickedPubKey = null;

const updateMainColWidth = MiscAppFxns.updateMainColWidth;

export default class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
          events: [
            {
                "id": "b9e83839f44fb7ed235a5cf62c0e94ec942e93a5946a31d2a17804df4248d1b0",
                "pubkey": "004db7605cfeba09b15625deb77c9369029f370591d68231b7c4dfd43f8f6f4f",
                "created_at": 0,
                "kind": 0,
                "tags": [],
                "content": "{\"name\":\"IrredeemablePussy@minds.com\",\"about\":\"\",\"picture\":\"https://www.minds.com/icon/742483671239368719/medium/1502397901/0/1660818381\"}",
                "sig": "e8059ca7c98b36458a1114cb49900fb3d4cb4e808afc0439c1c5f35aadfa2a4ab102cd88c72935f18f539e0ef255832215e677a4ce78a02ca7a9410dec1aab0f"
            },
            {
                "id": "48f7ed0a9fe9e1ab29aa3250a8af0fcc0e90d5f63c15b2fa41a5375bf19f2e60",
                "pubkey": "0339f668b5ab95a3622b583c32569f7daa6b85d5facad9d7b9bb997222c61563",
                "created_at": 0,
                "kind": 0,
                "tags": [],
                "content": "{\"name\":\"jllam34265@minds.com\",\"about\":\"\",\"picture\":\"https://www.minds.com/icon/1409550373508616195/medium/1661438997/0/1660028401\"}",
                "sig": "bfc57ea0c34832da557f6ea0cd19b3c1527d356fd909704df8f525f3edb705b965c4e2f3f70fdb6f1cff3a4858cbe3dcf3f5023b798dacee06887141861cb8b4"
            },
            {
                "id": "cf502526912dd0bc42e32e8f37c19e1e1729f0f1a525ea82375e480b12dfe503",
                "pubkey": "df11adafa597dfacdd2cf1540a819ba2c988544522895227180a844cfd0d84db",
                "created_at": 0,
                "kind": 1,
                "tags": [],
                "content": "this workshop is awesome!",
                "sig": "87c114e5873a7d27a06d91e375f6e4aba59ecf7a88b14bae41ee69172419a080626a0bc6761023141b8282aad295df8aaa5b5e581e8aed40397476003525c844"
            }
          ]
        }
    }
    async componentDidMount() {
        window.addEventListener('resize', updateMainColWidth);
    }
    render() {
        return (
            <fieldset id="app" >
            <NostrProvider relayUrls={relayUrls} debug>
                <Router>
                    <Routes>
                        <Route path="/" element={<MainFeed />} />
                        <Route path="/MainFeed" element={<MainFeed />} />
                        <Route path="/ManageChannels" element={<ManageChannels />} />
                        <Route path="/UserProfile" element={<UserProfile />} />
                    </Routes>
                </Router>
            </NostrProvider>
            </fieldset>
        );
    }
}

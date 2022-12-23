import React from 'react';
import ReactDOM from 'react-dom';
import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import * as MiscAppFxns from './lib/app/misc.ts';

import MainFeed from './pages/mainFeed/index';
import ManageChannels from './pages/manageChannels/index';

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

const updateMainColWidth = MiscAppFxns.updateMainColWidth;

export default class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {}
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
                        </Routes>
                    </Router>
                </NostrProvider>
            </fieldset>
        );
    }
}

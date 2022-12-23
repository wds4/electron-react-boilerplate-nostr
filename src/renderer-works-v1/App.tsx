import React from 'react';
import ReactDOM from 'react-dom';
import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import * as MiscAppFxns from './lib/app/misc.ts';

import Home from './pages/home';
import NostrToolsRelay from './pages/nostr-tools-relay';
import NostrggClient from './pages/nostrgg-client';
import NostrggReact from './pages/nostrgg-react';

import './css/app.css';
import './css/mastheads.css';
import './css/navbars.css';

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
                            <Route path="/" element={<NostrggReact />} />
                            <Route path="/Home" element={<Home />} />
                            <Route path="/NostrToolsRelay" element={<NostrToolsRelay />} />
                            <Route path="/NostrggClient" element={<NostrggClient />} />
                            <Route path="/NostrggReact" element={<NostrggReact />} />
                        </Routes>
                    </Router>
                </NostrProvider>
            </fieldset>
        );
    }
}

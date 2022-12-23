import React from 'react';
import ReactDOM from 'react-dom';
import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import * as MiscAppFxns from './lib/app/misc.ts';

import Home from './pages/home';
import MainFeed from './pages/mainFeed/index';
import UserFeed from './pages/userFeed/index';
import ManageChannels from './pages/manageChannels/index';
import MyProfile from './pages/myProfile/index';

import './css/app.css';
import './css/mastheads.css';
import './css/navbars.css';
import './css/feed.css';

import { NostrProvider } from "@nostrgg/react";

const relayUrls = [
];

/*
const relayUrls = [
    "wss://nostr-pub.wellorder.net",
    "wss://nostr-relay.untethr.me",
    "wss://relay.damus.io",
];
*/

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
                            <Route path="/Home" element={<Home />} />
                            <Route path="/MainFeed" element={<MainFeed />} />
                            <Route path="/UserFeed" element={<UserFeed />} />
                            <Route path="/ManageChannels" element={<ManageChannels />} />
                            <Route path="/MyProfile" element={<MyProfile />} />
                        </Routes>
                    </Router>
                </NostrProvider>
            </fieldset>
        );
    }
}

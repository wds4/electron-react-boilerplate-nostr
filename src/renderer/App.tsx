import React from 'react';
import ReactDOM from 'react-dom';
import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import * as MiscAppFxns from './lib/app/misc.ts';

import { NostrProvider } from "nostr-react";

import { Provider } from 'react-redux'
// import store from './store'

import MainFeed from './pages/mainFeed/index';
import MainFeed2 from './pages/mainFeed2/index';
import MainFeed3 from './pages/mainFeed3/index';
import ManageChannels from './pages/manageChannels/index';
import UserProfile from './pages/userProfile/index';
import DownloadProfiles from './pages/downloadProfiles/index';
import UserList from './pages/userList/index';
import MyProfile from './pages/myProfile/index';
import EditMyProfile from './pages/editMyProfile/index';
import SqlSettings from './pages/sqlSettings/index';

import './css/app.css';
import './css/mastheads.css';
import './css/navbars.css';
import './css/feed.css';
import './css/userProfile.css';
import './css/myProfile.css';
import './css/editMyProfile.css';

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
        this.state = {}
    }
    async componentDidMount() {
        window.addEventListener('resize', updateMainColWidth);
    }
    render() {
        return (
            <NostrProvider relayUrls={relayUrls} debug>
                <fieldset id="app" >
                    <Router>
                        <Routes>
                            <Route path="/" element={<MyProfile />} />
                            <Route path="/MainFeed" element={<MainFeed />} />
                            <Route path="/MainFeed2" element={<MainFeed2 />} />
                            <Route path="/MainFeed3" element={<MainFeed3 />} />
                            <Route path="/ManageChannels" element={<ManageChannels />} />
                            <Route path="/UserProfile" element={<UserProfile />} />
                            <Route path="/DownloadProfiles" element={<DownloadProfiles />} />
                            <Route path="/UserList" element={<UserList />} />
                            <Route path="/MyProfile" element={<MyProfile />} />
                            <Route path="/EditMyProfile" element={<EditMyProfile />} />
                            <Route path="/SqlSettings" element={<SqlSettings />} />
                        </Routes>
                    </Router>
                </fieldset>
            </NostrProvider>
        );
    }
}

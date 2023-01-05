import React from 'react';
import ReactDOM from 'react-dom';
import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import * as MiscAppFxns from './lib/app/misc.ts';
import * as StartupFxns from './lib/app/startup.ts';

import { NostrProvider } from "nostr-react";

// import { Provider } from 'react-redux'
// import store from './store'

// NOSTR PAGES
import LandingPage from './pages/landingPage/index';
import MainFeed from './pages/mainFeed/index';
import ManageChannels from './pages/manageChannels/index';
import UserProfile from './pages/userProfile/index';
import FollowingList from './pages/followingList/index';
import DownloadProfiles from './pages/downloadProfiles/index';
import UserList from './pages/userList/index';
import MyProfile from './pages/myProfile/index';
import EditMyProfile from './pages/editMyProfile/index';
import SqlSettings from './pages/sqlSettings/index';
import CreatePost from './pages/createPost/index';
import Thread from './pages/thread/index';
import Reply from './pages/reply/index';
import SearchForUser from './pages/searchForUser/index';
import GrapevineSettings from './pages/grapevineSettings/index';

// GRAPEVINE PAGES
import GrapevineLandingPage from './grapevine/landingPage/index';
import NostrFollowGrapevineVisualization from './grapevine/nostrFollowGrapevine/index';

import './css/app.css';
import './css/mastheads.css';
import './css/navbars.css';
import './css/feed.css';
import './css/userProfile.css';
import './css/myProfile.css';
import './css/editMyProfile.css';
import './css/newPost.css';
import './css/userList.css';
import './css/follows.css';
import './css/grapevine.css';
import './css/toggleSwitch1.css'; // probably will use just one of these
import './css/grapevineToggleSwitch.css';
import './css/grapevineSettings.css';
import './css/nfgGraphic.css';
import './css/youTubeEmbed.css';

import { asyncSql } from "./index.tsx";

const relayUrls = [
    "wss://nostr-pub.wellorder.net",
    "wss://nostr-relay.untethr.me",
    "wss://relay.damus.io",
    "wss://nostr-relay.wlvs.space",
    "wss://nostr.fmt.wiz.biz",
    "wss://nostr.oxtr.dev",
];

const updateMainColWidth = MiscAppFxns.updateMainColWidth;

export default class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            random_key: "12345",
            someValue: "abcde"
        }
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
                            <Route path="/" element={<LandingPage />} />
                            <Route path="/MainFeed" element={<MainFeed />} />
                            <Route path="/ManageChannels" element={<ManageChannels />} />
                            <Route path="/UserProfile" element={<UserProfile />} />
                            <Route path="/FollowingList" element={<FollowingList />} />
                            <Route path="/DownloadProfiles" element={<DownloadProfiles />} />
                            <Route path="/UserList" element={<UserList />} />
                            <Route path="/MyProfile" element={<MyProfile />} />
                            <Route path="/EditMyProfile" element={<EditMyProfile />} />
                            <Route path="/SqlSettings" element={<SqlSettings />} />
                            <Route path="/CreatePost" element={<CreatePost />} />
                            <Route path="/LandingPage" element={<LandingPage />} />
                            <Route path="/Thread/:focuseventid" exact element={<Thread />} />
                            <Route path="/Thread2/:focuseventid" exact element={<Thread />} />
                            <Route path="/Reply/:focuseventid" exact element={<Reply />} />
                            <Route path="/Reply2/:focuseventid" exact element={<Reply />} />
                            <Route path="/SearchForUser" element={<SearchForUser />} />
                            <Route path="/GrapevineSettings" element={<GrapevineSettings />} />

                            <Route path="/GrapevineLandingPage" element={<GrapevineLandingPage />} />
                            <Route path="/NostrFollowGrapevineVisualization" element={<NostrFollowGrapevineVisualization />} />
                        </Routes>
                    </Router>
                </fieldset>
            </NostrProvider>
        );
    }
}

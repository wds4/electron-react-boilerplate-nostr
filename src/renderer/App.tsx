import React, { useState, useEffect, useRef }  from 'react';
import ReactDOM from 'react-dom';
import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import * as MiscAppFxns from './lib/app/misc.ts';
import * as StartupFxns from './lib/app/startup.ts';

import { NostrProvider } from "nostr-react";

// import { Provider } from 'react-redux'
// import store from './store'

// NOSTR PAGES
import LandingPage from './pages/landingPage/index';
import Settings from './pages/settings/index';
import Settings_keys from './pages/settings/profilekeys/index';
import Settings_relays from './pages/settings/relays/index';
import Settings_sql from './pages/settings/sql/index';
import MainFeed from './pages/mainFeed/index';
import ManageChannels from './pages/manageChannels/index';
import UserProfile from './pages/userProfile/index';
import FollowingList from './pages/followingList/index';
import ExtendedFollowingList from './pages/extendedFollowingList/index';
import DownloadProfiles from './pages/downloadProfiles/index';
import UserList from './pages/userList/index';
import MyProfile from './pages/myProfile/index';
import EditMyProfile from './pages/editMyProfile/index';
import CreatePost from './pages/createPost/index';
import Thread from './pages/thread/index';
import Reply from './pages/reply/index';
import SearchForUser from './pages/searchForUser/index';
import GrapevineSettings from './pages/grapevineSettings/index';
import VisJsHelloWorld from './pages/visJsHelloWorld/index';
import DirectMessageConversation from './pages/directMessageConversation/index';

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
import './css/misc.css';
import './css/settings.css';
import './css/directMessaging.css';

import { asyncSql } from "./index.tsx";

const fetchRelays = MiscAppFxns.fetchRelays;
const timeout = MiscAppFxns.timeout;

const relayUrls = [
    "wss://nostr-pub.wellorder.net",
    "wss://nostr-relay.untethr.me",
    "wss://relay.damus.io",
    "wss://nostr-relay.wlvs.space",
    "wss://nostr.fmt.wiz.biz",
    "wss://nostr.oxtr.dev",
];

// window.relayUrls = [];

const updateMainColWidth = MiscAppFxns.updateMainColWidth;

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // You can also log the error to an error reporting service
    logErrorToMyService(error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return <h1>Something went wrong.</h1>;
    }

    return this.props.children;
  }
}

export default class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            relayUrls: relayUrls,
        }
    }

    async componentDidMount() {
        window.addEventListener('resize', updateMainColWidth);
        document.getElementById("mastheadCenterContainer").innerHTML = "App"
        /*
        var relayUrls = await fetchRelays("active") // fetch from sqlite3
        this.setState({relayUrls:relayUrls})
        window.relayUrls = relayUrls;
        this.forceUpdate();
        */
    }
    render() {
        return (
          <ErrorBoundary >
            <NostrProvider relayUrls={window.relayUrls} debug={true} autoReconnect={false} >
                <fieldset id="app" >
                    <pre style={{display:"none"}} >
                        {typeof this.state.relayUrls}
                        {this.state.relayUrls.length}
                        {this.state.relayUrls}
                        <hr/>
                        {window.relayUrls}
                    </pre>
                    <Router>
                        <Routes>
                            <Route path="/" element={<LandingPage />} />
                            <Route path="/MainFeed" element={<MainFeed />} />
                            <Route path="/ManageChannels" element={<ManageChannels />} />
                            <Route path="/UserProfile" element={<UserProfile />} />
                            <Route path="/FollowingList" element={<FollowingList />} />
                            <Route path="/ExtendedFollowingList" element={<ExtendedFollowingList />} />
                            <Route path="/DownloadProfiles" element={<DownloadProfiles />} />
                            <Route path="/UserList" element={<UserList />} />
                            <Route path="/MyProfile" element={<MyProfile />} />
                            <Route path="/EditMyProfile" element={<EditMyProfile />} />
                            <Route path="/Settings_sql" element={<Settings_sql />} />
                            <Route path="/CreatePost" element={<CreatePost />} />
                            <Route path="/LandingPage" element={<LandingPage />} />
                            <Route path="/Settings" element={<Settings />} />
                            <Route path="/Settings_keys" element={<Settings_keys />} />
                            <Route path="/Settings_relays" element={<Settings_relays />} />
                            <Route path="/Thread/:focuseventid" exact element={<Thread />} />
                            <Route path="/Thread2/:focuseventid" exact element={<Thread />} />
                            <Route path="/Reply/:focuseventid" exact element={<Reply />} />
                            <Route path="/Reply2/:focuseventid" exact element={<Reply />} />
                            <Route path="/SearchForUser" element={<SearchForUser />} />
                            <Route path="/GrapevineSettings" element={<GrapevineSettings />} />
                            <Route path="/DirectMessageConversation" element={<DirectMessageConversation />} />
                            <Route path="/GrapevineLandingPage" element={<GrapevineLandingPage />} />
                            <Route path="/NostrFollowGrapevineVisualization" element={<NostrFollowGrapevineVisualization />} />
                            <Route path="/VisJsHelloWorld" element={<VisJsHelloWorld />} />
                        </Routes>
                    </Router>
                </fieldset>
            </NostrProvider>
          </ErrorBoundary >
        );
    }
}

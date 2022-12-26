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
            <fieldset id="app" >
                <Router>
                    <Routes>
                        <Route path="/" element={<MainFeed />} />
                        <Route path="/MainFeed" element={<MainFeed />} />
                        <Route path="/ManageChannels" element={<ManageChannels />} />
                        <Route path="/UserProfile" element={<UserProfile />} />
                    </Routes>
                </Router>
            </fieldset>
        );
    }
}

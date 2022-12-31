import React from 'react';
import ReactDOM from 'react-dom';
import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import * as MiscAppFxns from './lib/app/misc.ts';
import * as StartupFxns from './lib/app/startup.ts';

import { NostrProvider } from "nostr-react";

// import { Provider } from 'react-redux'
// import store from './store'

import MainFeed from './pages/mainFeed/index';
import MainFeed2 from './pages/mainFeed2/index';
import MainFeed3 from './pages/mainFeed3/index';
import MainFeed4 from './pages/mainFeed4/index';
import ManageChannels from './pages/manageChannels/index';
import UserProfile from './pages/userProfile/index';
import UserProfile2 from './pages/userProfile2/index';
import DownloadProfiles from './pages/downloadProfiles/index';
import UserList from './pages/userList/index';
import MyProfile from './pages/myProfile/index';
import EditMyProfile from './pages/editMyProfile/index';
import SqlSettings from './pages/sqlSettings/index';
import CreatePost from './pages/createPost/index';

import './css/app.css';
import './css/mastheads.css';
import './css/navbars.css';
import './css/feed.css';
import './css/userProfile.css';
import './css/myProfile.css';
import './css/editMyProfile.css';
import './css/newPost.css';

import { asyncSql } from "./index.tsx";

const relayUrls = [
    "wss://nostr-pub.wellorder.net",
    "wss://nostr-relay.untethr.me",
    "wss://relay.damus.io",
    "wss://nostr-relay.wlvs.space",
    "wss://nostr.fmt.wiz.biz",
    "wss://nostr.oxtr.dev",
];

/*
const fetchProfilesInfo = async () => {
   var aProfileInfo = [];

   var sql = ""
   sql += "SELECT * FROM nostrProfiles "

   var aNostrProfilesData = await asyncSql(sql);
   console.log("=========== aNostrProfilesData.length: "+aNostrProfilesData.length)
   // console.log("=========== aNostrProfilesData: "+JSON.stringify(aNostrProfilesData,null,4))
   for (var n=0;n<aNostrProfilesData.length;n++) {
      var oNextProfileInfo = aNostrProfilesData[n];
      var pK = oNextProfileInfo.pubkey;
      var name = oNextProfileInfo.name;
      var picture_url = oNextProfileInfo.picture_url;
      aProfileInfo[pK] = {};
      if (name) {
          aProfileInfo[pK].name = name;
      } else {
          aProfileInfo[pK].name = "..."+pK.slice(-6);
      }
      if (picture_url) {
          aProfileInfo[pK].picture_url = picture_url;
      } else {
          aProfileInfo[pK].picture_url = null;
      }
   }
   return aProfileInfo;
}
*/


const updateMainColWidth = MiscAppFxns.updateMainColWidth;

export default class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {}
    }
    async componentDidMount() {
        window.addEventListener('resize', updateMainColWidth);

        // const aProfileInfo = await fetchProfilesInfo();
        // window.aProfileInfo = aProfileInfo;
        window.clickedPubKey = null;
    }
    render() {
        return (
            <NostrProvider relayUrls={relayUrls} debug>
                <fieldset id="app" >
                    <Router>
                        <Routes>
                            <Route path="/" element={<MainFeed4 />} />
                            <Route path="/MainFeed" element={<MainFeed />} />
                            <Route path="/MainFeed2" element={<MainFeed2 />} />
                            <Route path="/MainFeed3" element={<MainFeed3 />} />
                            <Route path="/MainFeed4" element={<MainFeed4 />} />
                            <Route path="/ManageChannels" element={<ManageChannels />} />
                            <Route path="/UserProfile" element={<UserProfile />} />
                            <Route path="/UserProfile2" element={<UserProfile2 />} />
                            <Route path="/DownloadProfiles" element={<DownloadProfiles />} />
                            <Route path="/UserList" element={<UserList />} />
                            <Route path="/MyProfile" element={<MyProfile />} />
                            <Route path="/EditMyProfile" element={<EditMyProfile />} />
                            <Route path="/SqlSettings" element={<SqlSettings />} />
                            <Route path="/CreatePost" element={<CreatePost />} />
                        </Routes>
                    </Router>
                </fieldset>
            </NostrProvider>
        );
    }
}

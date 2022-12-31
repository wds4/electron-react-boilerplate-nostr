import React from 'react';
import Masthead from '../../mastheads/mainMasthead.js';
import LeftNavbar from '../../navbars/leftNav.js';
import * as MiscAppFxns from "../../lib/app/misc.ts";

import { asyncSql } from "../../index.tsx";

const jQuery = require("jquery");

const updateMainColWidth = MiscAppFxns.updateMainColWidth;
const isValidObj = MiscAppFxns.isValidObj;

const fetchProfilesInfo = async () => {
   var aProfileInfo = [];

   var sql = ""
   sql += "SELECT * FROM nostrProfiles "

   var aNostrProfilesData = await asyncSql(sql);
   console.log("aNostrProfilesData.length: "+aNostrProfilesData.length)
   // for (var n=0;n<aNostrProfilesData.length;n++) {
   for (var n=0;n<100;n++) {
      var oNextProfileInfo = aNostrProfilesData[n];
      var pK = oNextProfileInfo.pubkey;
      var content = oNextProfileInfo.content;
      var name = oNextProfileInfo.name;
      var picture_url = oNextProfileInfo.picture_url;
      aProfileInfo[n] = {};
      aProfileInfo[n].pubkey = pK;
      var userHTML = "";
      userHTML += "<div style='border:1px solid purple;margin-bottom:5px;padding:5px;' >";
      if (name) {
          userHTML += "<div>";
          userHTML += name;
          userHTML += "</div>";
          aProfileInfo[n].name = name;
      } else {
          aProfileInfo[n].name = "..."+pK.slice(-6);
      }

      if (picture_url) {
          aProfileInfo[n].picture_url = picture_url;
          userHTML += "<div>";
          userHTML += picture_url;
          userHTML += "</div>";
      } else {
          aProfileInfo[n].picture_url = null;
      }

      if (content) {
          if (isValidObj(content)) {
              userHTML += "<pre>";
              userHTML += JSON.stringify(JSON.parse(content),null,4);
              userHTML += "</pre>";
          }
      }
      userHTML += "</div>";
      jQuery("#userListContainer").append(userHTML)
   }

   return aProfileInfo;
}

export default class Home extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            users: [
            ]
        }
    }
    async componentDidMount() {
        updateMainColWidth();
        document.getElementById("mastheadCenterContainer").innerHTML = "userList"
        const aProfileInfo = await fetchProfilesInfo();
        console.log("aProfileInfo.length: "+aProfileInfo.length)
        this.setState({users: aProfileInfo})
        this.forceUpdate();
    }
    render() {
        return (
            <>
                <div id="menuCol" className="menuCol" >
                    <LeftNavbar />
                </div>
                <div id="mainCol" >
                    <div id="mastheadElem" >
                        <Masthead />
                    </div>
                    <div id="mainPanel" >
                        <div className="h2">userList</div>
                        <div id="userListContainer" >userListContainer</div>
                    </div>
                </div>
            </>
        );
    }
}

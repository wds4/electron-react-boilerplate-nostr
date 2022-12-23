import React from 'react';
import { NavLink } from "react-router-dom";

export default class Masthead extends React.Component {
    constructor(props) {
        super(props);
        this.state = {}
    }
    async componentDidMount() {}
    render() {
        return (
          <>
              <div className="mastheadContainer" >

                  <div className="mastheadLeftContainer" >
                  Pretty Good <span style={{color:"#1B2631"}} >nostr</span>
                  </div>

                  <div className="mastheadCenterContainer" >
                  Home
                  </div>

                  <div className="mastheadRightContainer" >
                  <NavLink className="mastheadNavButton" to='/MyProfile' >Profile</NavLink>
                  </div>
              </div>

              <div className="mastheadSubBanner" >
                  <div>still in alpha. expect breaking changes</div>
              </div>
          </>
        );
    }
}

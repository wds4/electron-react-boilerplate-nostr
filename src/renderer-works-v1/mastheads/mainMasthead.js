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
                  Pretty Good
                  </div>

                  <div className="mastheadCenterContainer" >
                  nostr Feed
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

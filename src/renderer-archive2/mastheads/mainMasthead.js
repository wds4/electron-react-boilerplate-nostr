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
                  nostr
                  </div>

                  <div id="mastheadCenterContainer" className="mastheadCenterContainer" >
                  Home
                  </div>

                  <div className="mastheadRightContainer" >
                      <NavLink className="mastheadNavButton" to='/CreatePost' >post</NavLink>
                      <NavLink className="mastheadNavButton" to='/MyProfile' style={{marginLeft:"5px"}} >Profile</NavLink>
                  </div>
              </div>

              <div className="mastheadSubBanner" >
                  <div>still in alpha. expect breaking changes</div>
              </div>
          </>
        );
    }
}

import React from 'react';
import { NavLink } from "react-router-dom";
import AvatarElem from "./avatarElem";

export default class Masthead extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            myPubkey: window.myPubkey
        }
    }
    async componentDidMount() {}
    render() {
        return (
          <>
              <div className="mastheadContainer" >
                  <div className="mastheadLeftContainer" >
                      <NavLink className="mastheadNavButton" end to='/' style={{display:"none"}} >
                          back button
                      </NavLink>
                      nostr
                  </div>

                  <div id="mastheadCenterContainer" className="mastheadCenterContainer" >
                  Home
                  </div>

                  <div className="mastheadRightContainer" >
                      <NavLink className="mastheadNavButton" end to='/GrapevineSettings' >
                          <div style={{fontSize:"20px"}} >&#x1F347;</div>
                          settings
                      </NavLink>
                      <NavLink className="mastheadNavButton" end to='/SearchForUser' >
                          search for user
                      </NavLink>
                      <NavLink className="mastheadNavButton" end to='/CreatePost' >
                          create post
                      </NavLink>
                      <NavLink to='/MyProfile' style={{marginLeft:"10px"}} >
                          <AvatarElem pubkey={this.state.myPubkey} />
                      </NavLink>
                  </div>
              </div>

              <div className="mastheadSubBanner" >
                  <div>still in alpha. expect breaking changes</div>
              </div>
          </>
        );
    }
}

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
                  nostr
                  </div>

                  <div id="mastheadCenterContainer" className="mastheadCenterContainer" >
                  Home
                  </div>

                  <div className="mastheadRightContainer" >
                      <NavLink className="mastheadNavButton" to='/CreatePost' >post</NavLink>
                      <NavLink to='/MyProfile' style={{marginLeft:"5px"}} >
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

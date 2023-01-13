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
                      electron-nostr
                  </div>

                  <div id="mastheadCenterContainer" className="mastheadCenterContainer" >
                  Home
                  </div>

                  <div className="mastheadRightContainer" >
                      <NavLink className="mastheadNavButton" end to='/VisJsHelloWorld' style={{display:"none",fontSize:"8px"}} >
                          visjs hello world
                      </NavLink>
                      <NavLink className="mastheadNavButton" end to='/GrapevineSettings' style={{display:"none",fontSize:"7px"}} >
                          <div style={{fontSize:"20px"}} >&#x1F347;</div>
                          settings
                      </NavLink>
                      <NavLink className="mastheadNavButton" end to='/SearchForUser' style={{fontSize:"7px"}} >
                          <div style={{fontSize:"20px"}} >&#x1F50D;</div>
                          <div style={{fontSize:"10px"}} >search</div>
                      </NavLink>
                      <NavLink className="mastheadNavButton" end to='/CreatePost' >
                          <div style={{fontSize:"20px"}} >✏️</div>
                          <div style={{fontSize:"10px"}} >post</div>
                      </NavLink>
                      <NavLink to='/MyProfile' style={{marginLeft:"10px"}} >
                          <AvatarElem pubkey={this.state.myPubkey} />
                      </NavLink>
                      <NavLink className="mastheadNavButton" end to='/Settings' >
                          <div style={{fontSize:"20px"}} >⚙️</div>
                          <div style={{fontSize:"10px"}} >settings</div>
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

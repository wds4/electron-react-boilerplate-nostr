import React from "react";
import { NavLink } from "react-router-dom";

export default class LeftNavbar1_Plex extends React.PureComponent {
  render() {
    return (
      <>
        <div className="leftNavPanel" >
            <NavLink className="leftNavButton"  to='/Home'>
                <div style={{fontSize:"12px",lineHeight:"100%"}} >home</div>
            </NavLink>

            <NavLink className="leftNavButton"  to='/MainFeed'>
                <div style={{fontSize:"12px",lineHeight:"100%"}} >main feed</div>
            </NavLink>

            <NavLink className="leftNavButton"  to='/ManageChannels'>
                <div style={{fontSize:"12px",lineHeight:"100%"}} >manage channels</div>
            </NavLink>

            <NavLink className="leftNavButton"  to='/UserFeed'>
                <div style={{fontSize:"12px",lineHeight:"100%"}} >user feed</div>
            </NavLink>
        </div>
      </>
    );
  }
}

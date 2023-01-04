import React from "react";
import { NavLink } from "react-router-dom";

export default class LeftNavbar extends React.PureComponent {
  render() {
    return (
      <>
        <div className="leftNavPanel" >
            <NavLink className="leftNavButton" to='/MainFeed'>
                <div style={{fontSize:"12px",lineHeight:"100%"}} >main feed</div>
            </NavLink>

            <NavLink className="leftNavButton" to='/SqlSettings' style={{display:"none"}} >
                <div style={{fontSize:"12px",lineHeight:"100%"}} >sql settings</div>
            </NavLink>
        </div>
      </>
    );
  }
}

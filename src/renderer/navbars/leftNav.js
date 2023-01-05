import React from "react";
import { NavLink } from "react-router-dom";

export default class LeftNavbar extends React.PureComponent {
  render() {
    return (
      <>
        <div className="leftNavPanel" >
            <NavLink className="leftNavButton" end to='/MainFeed'>
                <div style={{fontSize:"12px",lineHeight:"100%"}} >main feed</div>
            </NavLink>

            <NavLink className="leftNavButton" end to='/GrapevineLandingPage'>
                <div style={{fontSize:"42px"}} >&#x1F347;</div>
                <div style={{fontSize:"12px",lineHeight:"100%"}} >Grapevine</div>
            </NavLink>

            <NavLink className="leftNavButton" end to='/SqlSettings' style={{display:"none"}} >
                <div style={{fontSize:"12px",lineHeight:"100%"}} >sql settings</div>
            </NavLink>
        </div>
      </>
    );
  }
}

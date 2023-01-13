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

            <NavLink className="leftNavButton" end to='/GrapevineLandingPage' >
                <div style={{fontSize:"12px",lineHeight:"100%"}} >visualization of extended following list</div>
            </NavLink>
        </div>
      </>
    );
  }
}

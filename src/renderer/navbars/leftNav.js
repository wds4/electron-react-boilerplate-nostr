import React from "react";
import { NavLink } from "react-router-dom";

export default class LeftNavbar extends React.PureComponent {
  render() {
    return (
      <>
        <div className="leftNavPanel" >
            <NavLink className="leftNavButton" end to='/MainFeed'>
                <div style={{fontSize:"40px"}} >&#x1F3E0;</div>
                <div style={{fontSize:"12px"}} >main feed</div>
            </NavLink>

            <NavLink className="leftNavButton" end to='/GrapevineLandingPage' >
                <div style={{fontSize:"48px"}} >&#x1F30E;</div>
                <div style={{fontSize:"12px"}} >graph</div>
            </NavLink>
        </div>
      </>
    );
  }
}

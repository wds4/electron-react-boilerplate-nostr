import React from "react";
import { NavLink } from "react-router-dom";

export default class LeftNavbar1_Plex extends React.PureComponent {
  render() {
    return (
      <>
        <div className="leftNavPanel" >
            <NavLink className="leftNavButton"  to='/Home'>
                <div style={{fontSize:"12px",lineHeight:"100%"}} >hello world</div>
            </NavLink>

            <NavLink className="leftNavButton"  to='/NostrggReact'>
                <div style={{fontSize:"12px",lineHeight:"100%"}} >nostrgg-react</div>
            </NavLink>

            <NavLink className="leftNavButton"  to='/NostrggClient'>
                <div style={{fontSize:"12px",lineHeight:"100%"}} >nostrgg-client</div>
            </NavLink>

            <NavLink className="leftNavButton"  to='/NostrToolsRelay'>
                <div style={{fontSize:"12px",lineHeight:"100%"}} >nostr tools relay</div>
            </NavLink>
        </div>
      </>
    );
  }
}

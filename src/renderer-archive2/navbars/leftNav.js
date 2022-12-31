import React from "react";
import { NavLink } from "react-router-dom";

export default class LeftNavbar extends React.PureComponent {
  render() {
    return (
      <>
        <div className="leftNavPanel" >
            <NavLink className="leftNavButton"  to='/MainFeed'>
                <div style={{fontSize:"12px",lineHeight:"100%"}} >main feed 1 (nostr-tools)</div>
            </NavLink>

            <NavLink className="leftNavButton"  to='/MainFeed2'>
                <div style={{fontSize:"12px",lineHeight:"100%"}} >main feed 2 (nostr-react)</div>
            </NavLink>

            <NavLink className="leftNavButton"  to='/MainFeed3'>
                <div style={{fontSize:"12px",lineHeight:"100%"}} >main feed 3 (nostr-react)</div>
            </NavLink>

            <NavLink className="leftNavButton"  to='/MainFeed4'>
                <div style={{fontSize:"12px",lineHeight:"100%"}} >main feed 4 (nostr-react)</div>
            </NavLink>

            <NavLink className="leftNavButton"  to='/ManageChannels'>
                <div style={{fontSize:"12px",lineHeight:"100%"}} >manage channels</div>
            </NavLink>

            <NavLink className="leftNavButton"  to='/UserList'>
                <div style={{fontSize:"12px",lineHeight:"100%"}} >userList</div>
            </NavLink>

            <NavLink className="leftNavButton"  to='/DownloadProfiles'>
                <div style={{fontSize:"12px",lineHeight:"100%"}} >download profiles</div>
            </NavLink>

            <NavLink className="leftNavButton"  to='/SqlSettings'>
                <div style={{fontSize:"12px",lineHeight:"100%"}} >sql settings</div>
            </NavLink>
        </div>
      </>
    );
  }
}

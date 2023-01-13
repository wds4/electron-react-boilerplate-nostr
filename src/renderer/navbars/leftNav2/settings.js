import React from "react";
import { NavLink } from "react-router-dom";

export default class LeftNavbar2_Settings extends React.PureComponent {
  render() {
    return (
      <>
        <div className="leftNav2Panel" >
            <NavLink className="leftNav2Button" end to='/Settings_keys'>
                keys
            </NavLink>

            <NavLink className="leftNav2Button" end to='/Settings_relays' >
                relays
            </NavLink>

            <NavLink className="leftNav2Button" end to='/Settings_sql' >
                sql
            </NavLink>

            <NavLink className="leftNav2Button" end to='/ExtendedFollowingList' >
                <div style={{fontSize:"32px"}} >&#x1F310;</div>
            </NavLink>
        </div>
      </>
    );
  }
}

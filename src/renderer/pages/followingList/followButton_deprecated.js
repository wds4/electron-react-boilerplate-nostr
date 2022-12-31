import React, { useState, useEffect, useRef } from 'react';
import Masthead from '../../mastheads/mainMasthead.js';
import LeftNavbar from '../../navbars/leftNav.js';
import * as MiscAppFxns from "../../lib/app/misc.ts";
import { asyncSql } from "../../index.tsx";

const jQuery = require("jquery");

const updateMainColWidth = MiscAppFxns.updateMainColWidth;
const secsToTime = MiscAppFxns.secsToTime
const cloneObj = MiscAppFxns.cloneObj

const fetchMyCurrentFollowingList = async () => {
    var sql = "";
    sql += " SELECT following FROM myProfile WHERE id=1 "
    var result = await asyncSql(sql);
    var sFollowing = result[0].following;
    var aFollowing = [];
    if (sFollowing) {
        aFollowing = JSON.parse(sFollowing);
    }
    console.log("fetchMyCurrentFollowingList aFollowing: "+JSON.stringify(aFollowing,null,4))
    return aFollowing;
}

const updateMyFollowingInSql = async (aFollowing_new) => {
    var sFollowing_new = JSON.stringify(aFollowing_new)
    var sql = "";
    sql += " UPDATE myProfile SET following = '"+sFollowing_new+"' WHERE id=1 "
    var result = await asyncSql(sql);
}

export default class FollowButton extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        }
    }
    async componentDidMount() {
        // var pubkey = window.clickedPubKey;
        const pk = this.props.pubkey;
        jQuery(".followButton").unbind("click").click(async function(){
            var clickedPk = jQuery(this).data("pubkey")
            console.log("followButton; clickedPk: "+clickedPk)
            var aFollowing_current = await fetchMyCurrentFollowingList();
            var aFollowing_new = cloneObj(aFollowing_current)
            if (!aFollowing_current.includes(clickedPk)) {
                aFollowing_new.push(clickedPk)
            }
            console.log("aFollowing_new: "+JSON.stringify(aFollowing_new,null,4))
            await updateMyFollowingInSql(aFollowing_new)
        })
    }
    render() {
        return (
            <>
                <div className="followButton doSomethingButton" data-currentaction="follow" data-pubkey={this.props.pubkey} style={{position:"absolute",right:"5px",top:"5px"}} >
                    Follow
                </div>
            </>
        );
    }
}

import React, { useState, useEffect, useRef } from 'react';
import { Link, NavLink } from "react-router-dom";
import { useNostrEvents, useProfile } from "nostr-react";
import * as MiscAppFxns from "../../lib/app/misc.ts";
import UserPost from "../components/userPost";

const UserPosts = () => {
    var { events } = useNostrEvents({
        filter: {
            authors: [ window.clickedPubKey ],
            since: 0, // all new events from now
            kinds: [1],
        },
    });
    const currentPage = "userProfile";
    return (
        <>
            <div style={{textAlign:"right",marginRight:"20px"}} >{events.length} posts</div>
            {events.map( (event) => {
                return (
                    <>
                        <UserPost
                            event={event}
                            currentPage={currentPage}
                        />
                    </>
                )}
            )}
        </>
    )
};

export default UserPosts;

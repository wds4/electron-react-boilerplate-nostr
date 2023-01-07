import React from 'react';
import { getFollowing } from "../../lib/nostr/getFollowing";

export const getStarterUserList = async (seedUserPubkey, nHops) => {
    var aStarterUsers = []
    var aRefUser = [seedUserPubkey,0]
    var oRefUser = { id: seedUserPubkey, nHops: 0, label: seedUserPubkey, title: seedUserPubkey };
    aStarterUsers.push(oRefUser)

    const ms = 1000; // timeout in milliseconds
    var aFollowing = await getFollowing(seedUserPubkey,ms);

    console.log("getFollowing aFollowing: "+aFollowing+JSON.stringify(aFollowing,null,4))
    // now iterate through the list to get more followers
    // stop when all are traversed for N less than desired number of hops

    return aStarterUsers;
}

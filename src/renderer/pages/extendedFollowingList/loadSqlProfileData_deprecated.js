
import { asyncSql } from "../../index.tsx";

export const loadSqlBaseAuthors = async () => {
    var aPubkeys = [];
    var sql = ""
    sql += "SELECT * FROM nostrProfiles "
    var aNostrProfilesData = await asyncSql(sql);
    for (var x=0;x<aNostrProfilesData.length;x++) {
        var oNextProfile = aNostrProfilesData[x];
        var id = oNextProfile.id;
        var pubkey = oNextProfile.pubkey;
        aPubkeys.push(pubkey)
    }
    return aPubkeys;
}

export const loadSqlProfileData = async (oPubkeys) => {
    var sql = ""
    sql += "SELECT * FROM nostrProfiles "
    var aNostrProfilesData = await asyncSql(sql);
    for (var x=0;x<aNostrProfilesData.length;x++) {
        var oNextProfile = aNostrProfilesData[x];
        var id = oNextProfile.id;
        var pubkey = oNextProfile.pubkey;
        // var name = oNextProfile.name;
        // var display_name = oNextProfile.display_name;
        // var picture_url = oNextProfile.picture_url;
        /*
        oPubkeys[pubkey] = {
            profileData: {
                name: oNextProfile.name,
                display_name: oNextProfile.display_name,
                picture_url: oNextProfile.picture_url,
                created_at: oNextProfile.created_at
            },
            followingData: {
                level: 999,
                created_at: oNextProfile.created_at,
                following: oNextProfile.following
            }
        }
        */
        oPubkeys[pubkey] = {
            profileData: {
                name: null,
                display_name: null,
                picture_url: null,
                created_at: 0
            },
            followingData: {
                level: 0,
                created_at: 0,
                following: []
            }
        }
    }
    return oPubkeys;
}

/*
createNostrProfilesTableCommand += "id INTEGER PRIMARY KEY, ";
createNostrProfilesTableCommand += "event TEXT NULL, ";
createNostrProfilesTableCommand += "event_id TEXT NULL UNIQUE, ";
createNostrProfilesTableCommand += "content TEXT NULL, ";
createNostrProfilesTableCommand += "created_at INTEGER NULL, ";
createNostrProfilesTableCommand += "pubkey TEXT NULL UNIQUE, ";
createNostrProfilesTableCommand += "name TEXT NULL, ";
createNostrProfilesTableCommand += "display_name TEXT NULL, ";
createNostrProfilesTableCommand += "about TEXT NULL, ";
createNostrProfilesTableCommand += "picture_url TEXT NULL, ";
createNostrProfilesTableCommand += "nip05 TEXT NULL, ";
createNostrProfilesTableCommand += "lud06 TEXT NULL, ";
createNostrProfilesTableCommand += "followers TEXT NULL, ";
createNostrProfilesTableCommand += "following TEXT NULL, ";
createNostrProfilesTableCommand += "firstSeen INTEGER NULL, ";
createNostrProfilesTableCommand += "lastUpdate INTEGER NULL, ";
createNostrProfilesTableCommand += "UNIQUE(event_id, pubkey) ";
*/

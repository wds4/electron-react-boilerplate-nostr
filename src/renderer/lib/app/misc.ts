
export const updateMainColWidth = () => {
    const menuColWidth = document.getElementById("menuCol").offsetWidth;
    const rootWidth = document.getElementById("root").offsetWidth;
    const newWidth = rootWidth - menuColWidth - 4;
    document.getElementById("mainCol").style.width = newWidth+"px";

    const mastheadHeight = document.getElementById("mastheadElem").offsetHeight;
    const rootHeight = document.getElementById("root").offsetHeight;
    const newHeight = rootHeight - mastheadHeight - 6;
    document.getElementById("mainPanel").style.height = newHeight+"px";
}

export const isValidObj = (x) => {
    // test if the input is a string that converts into JSON
    try {
        const obj1 = JSON.parse(x);
        return true;
    } catch (e1) {}

    // test if the input is already an object
    try {
        const obj2 = JSON.parse(JSON.stringify(x));
        return true;
    } catch (e2) {}

    return false;
}

export const cloneObj = (obj) => {
    return JSON.parse(JSON.stringify(obj));
}

export const secsToTime = (secs) => {
    var displayTime = "--";
    var currentTime = Math.floor(Date.now() / 1000);
    var age_secs = currentTime - secs;
    var age_mins = Math.floor(age_secs / 60);
    var age_hours = Math.floor(age_secs / (60 * 60) );
    var age_days = Math.floor(age_secs / (60 * 60 * 24) );
    var age_years = Math.floor(age_secs / (60 * 60 * 24 * 365) );
    var discoveredUnit = false;
    if ( (!discoveredUnit) && (age_secs < 60) ) {
        // if less than one minute,
        // display in seconds
        displayTime = age_secs + " s";
        discoveredUnit = true;
    }
    if ( (!discoveredUnit) && (age_secs < 60 * 60) ) {
        // if less than one hour,
        // display in minutes
        displayTime = age_mins + " m";
        discoveredUnit = true;
    }
    if ( (!discoveredUnit) && (age_secs < 24 * 60 * 60) ) {
        // if less than one day,
        // display in hours
        displayTime = age_hours + " h";
        discoveredUnit = true;
    }
    if ( (!discoveredUnit) && (age_secs < 365 * 24 * 60 * 60) ) {
        // if less than one year,
        // display in days
        displayTime = age_days + " d";
        discoveredUnit = true;
    }
    if (!discoveredUnit) {
        // else display in years
        displayTime = age_years + " y";
        discoveredUnit = true;
    }

    return displayTime;
}

export const timeout = (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export const fetchMySk = async () => {
    var sql = ""
    sql += "SELECT * FROM myProfile WHERE active=true"
    var aMyProfileData = await asyncSql(sql);

    if (aMyProfileData.length > 0) {
        var oMyProfileData = aMyProfileData[0]

        var myPk = oMyProfileData.pubkey;
        var mySk = oMyProfileData.privkey;
        return mySk
    }
    return false;
}

export const fetchMyPk = async () => {
    var sql = ""
    sql += "SELECT * FROM myProfile WHERE active=true"
    var aMyProfileData = await asyncSql(sql);

    if (aMyProfileData.length > 0) {
        var oMyProfileData = aMyProfileData[0]

        var myPk = oMyProfileData.pubkey;
        var mySk = oMyProfileData.privkey;
        return myPk
    }
    return false;
}

export const fetchRelays = async (which) => {
    var sql = ""
    sql += "SELECT * FROM relays "
    var aRelaysData = await asyncSql(sql);

    var aDefault = [];
    var aActive = [];
    var aAll = [];
    console.log("aRelaysData.length: "+aRelaysData.length)
    for (var r=0;r<aRelaysData.length;r++) {
        var oNextRelayData = aRelaysData[r]

        var url = oNextRelayData.url;
        var default_app = oNextRelayData.default_app;
        var active = oNextRelayData.active;
        aAll.push(url)
        if (default_app) {
            aDefault.push(url)
        }
        if (active) {
            aActive.push(url)
        }
    }
    if (!which) {
        return aActive;
    }
    if (which=="active") {
        return aActive;
    }
    if (which=="default") {
        return aDefault;
    }
    if (which=="all") {
        return aAll;
    }
    if (which=="verbose") {
        return [aActive, aDefault, aAll];
    }
    return aActive;
}

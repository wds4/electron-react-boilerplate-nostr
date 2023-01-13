import React from 'react';
import * as MiscAppFxns from "../../lib/app/misc.ts";

const jQuery = require("jquery");

const fetchMyPk = MiscAppFxns.fetchMyPk;


export default class PkSettings extends React.Component {

    async componentDidMount() {
        jQuery("#showPrivkeyButton").click(async function(){
            const pk = await fetchMyPk();
            jQuery("#pkShownElem").html(pk)
            jQuery("#pkHiddenElem").css("display","none")
            jQuery("#pkShownElem").css("display","block")
        })
    }
    render() {
        return (
            <>
                <div>
                    privkey
                    <div id="showPrivkeyButton" className="doSomethingButton" >
                    Show (caution!)
                    </div>
                </div>
                <div id="pkHiddenElem"
                    style={{border:"1px solid black",width:"450px",height:"40px",padding:"10px"}}
                >
                privkey (hidden)
                </div>
                <div id="pkShownElem"
                    style={{border:"1px solid black",width:"450px",height:"40px",padding:"10px",display:"none"}}
                >
                privkey (shown)
                </div>
            </>
        );
    }
}

import React from 'react';
import Masthead from './mastheads/mainMasthead.js';
import LeftNavbar from './navbars/leftNav.js';
import * as MiscAppFxns from "./lib/app/misc.ts";
import {  nip04,
          validateEvent,
          verifySignature,
          getBlankEvent,
          generatePrivateKey,
          getPublicKey,
          getEventHash,
          signEvent,
          matchFilters
        } from 'nostr-tools'

const updateMainColWidth = MiscAppFxns.updateMainColWidth;

export default class Home extends React.Component {
    constructor(props) {
        super(props);
        this.state = {}
    }
    async componentDidMount() {
        updateMainColWidth();

        // sender
        let sk1 = generatePrivateKey()
        let pk1 = getPublicKey(sk1)

        // receiver
        let sk2 = generatePrivateKey()
        let pk2 = getPublicKey(sk2)

        console.log("sk1: "+sk1+"; pk1: "+pk1)

        let message = 'hello'
        // As of v0.24.1, nip04 throws an error - nip04 not exported correctly I think. Might be fixed in next release?
        // let ciphertext = nip04.encrypt(sk1, pk2, 'hello')

        document.getElementById("senderPrivKeyContainer").innerHTML = sk1;
        document.getElementById("senderPubKeyContainer").innerHTML = pk1;
        /*
        const event = {
            id: 'd7dd5eb3ab747e16f8d0212d53032ea2a7cadef53837e5a6c66d42849fcb9027',
            kind: 1,
            pubkey: '22a12a128a3be27cd7fb250cbe796e692896398dc1440ae3fa567812c8107c1c',
            created_at: 1670869179,
            content:
                'NOSTR "WINE-ACCOUNT" WITH HARVEST DATE STAMPED\n\n\n"The older the wine, the greater its reputation"\n\n\n22a12a128a3be27cd7fb250cbe796e692896398dc1440ae3fa567812c8107c1c\n\n\nNWA 2022-12-12\nAA',
            tags: [['client', 'astral']],
            sig: 'f110e4fdf67835fb07abc72469933c40bdc7334615610cade9554bf00945a1cebf84f8d079ec325d26fefd76fe51cb589bdbe208ac9cdbd63351ddad24a57559'
        }
        */

        const unsigned = {
            created_at: 1671217411,
            kind: 0,
            tags: [],
            content:
                '{"name":"fiatjaf","about":"buy my merch at fiatjaf store","picture":"https://fiatjaf.com/static/favicon.jpg","nip05":"_@fiatjaf.com"}'
        }

        const privateKey =
            '5c6c25b7ef18d8633e97512159954e1aa22809c6b763e94b9f91071836d00217'
        let hash = getEventHash(unsigned)
        console.log("hash: "+hash)
        document.getElementById("getEventHashContainer").innerHTML = hash;
        let sig = await signEvent(unsigned, privateKey)
        console.log("sig: "+sig)
        document.getElementById("signEventContainer").innerHTML = sig;

        let event = {
          kind: 1,
          created_at: Math.floor(Date.now() / 1000),
          tags: [],
          content: 'hello'
        }

        event.id = getEventHash(event)
        event.pubkey = getPublicKey(sk1)
        event.sig = await signEvent(event, sk1)
        console.log("event.sig: "+event.sig)

        let ok = validateEvent(event)
        let veryOk = await verifySignature(event)
        console.log("ok: "+ok)
        console.log("veryOk: "+veryOk)

        document.getElementById("validateEventContainer").innerHTML = ok;
        document.getElementById("verifySignatureContainer").innerHTML = veryOk;
    }
    render() {
        return (
            <>
                <div id="menuCol" className="menuCol" >
                    <LeftNavbar />
                </div>
                <div id="mainCol" >
                    <Masthead />
                    <div id="mainPanel" >
                        <div className="h2">erb-nostr: hello world</div>
                        <div>demo of various functions:</div>

                        <br />

                        <div className="leftCol" >generatePrivateKey:</div>
                        <div className="rightCol" id="senderPrivKeyContainer" >senderPrivKeyContainer</div>

                        <div className="leftCol" >getPublicKey:</div>
                        <div className="rightCol" id="senderPubKeyContainer" >senderPubKeyContainer</div>

                        <div className="leftCol" >getEventHash:</div>
                        <div className="rightCol" id="getEventHashContainer" >getEventHashContainer</div>

                        <div className="leftCol" >signEvent:</div>
                        <div className="rightCol" id="signEventContainer" >signEventContainer</div>

                        <div className="leftCol" >validateEvent:</div>
                        <div className="rightCol" id="validateEventContainer" >validateEventContainer</div>

                        <div className="leftCol" >verifySignature:</div>
                        <div className="rightCol" id="verifySignatureContainer" >verifySignatureContainer</div>

                    </div>
                </div>
            </>
        );
    }
}

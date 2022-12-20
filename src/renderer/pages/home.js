import React from 'react';
import Masthead from './mastheads/mainMasthead.js';
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
        // Currently throws an error - nip04 not exported correctly I think. Might be fixed in next release.
        // Currently v0.24.1
        // let ciphertext = nip04.encrypt(sk1, pk2, 'hello')

        document.getElementById("senderPrivKeyContainer").innerHTML = sk1;
        document.getElementById("senderPubKeyContainer").innerHTML = pk1;

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

        const unsigned = {
            created_at: 1671217411,
            kind: 0,
            tags: [],
            content:
                '{"name":"fiatjaf","about":"buy my merch at fiatjaf store","picture":"https://fiatjaf.com/static/favicon.jpg","nip05":"_@fiatjaf.com"}'
        }

        const privateKey =
            '5c6c25b7ef18d8633e97512159954e1aa22809c6b763e94b9f91071836d00217'
        // Each of these throws the same error:
        let hash = getEventHash(unsigned)
        console.log("hash: "+hash)
        let sig = await signEvent(unsigned, privateKey)
        console.log("sig: "+sig)

    }
    render() {
        return (
            <>
                <div id="menuCol" className="menuCol" >
                </div>
                <div id="mainCol" >
                    <Masthead />
                    <div id="mainPanel" >
                        <div className="h2">erb-nostr: hello world</div>
                        <div>sender private key:</div>
                        <div id="senderPrivKeyContainer" >senderPrivKeyContainer</div>
                        <div>sender pub key:</div>
                        <div id="senderPubKeyContainer" >senderPubKeyContainer</div>
                    </div>
                </div>
            </>
        );
    }
}

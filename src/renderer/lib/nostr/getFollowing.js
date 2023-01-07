import {
  relayInit
} from 'nostr-tools'
import * as MiscAppFxns from "../../lib/app/misc.ts";

const timeout = MiscAppFxns.timeout
const relay = relayInit('wss://nostr-pub.wellorder.net')

// ms is timeout in milliseconds
export const getFollowing = async (pk, ms) => {
    await timeout(4000)


    var aFollowing = [];

    await relay.connect()

    await relay.on('connect', async () => {
        console.log(`getFollowing connected to ${relay.url}`)
    })
    relay.on('error', () => {
        console.log(`getFollowing failed to connect to ${relay.url}`)
    })

    let sub = relay.sub([
      {
          authors: [ pk ],
          since: 0,
          kinds: [3],
      }
    ])
    await sub.on('event', async (event) => {
        console.log('getFollowing we got the event we wanted:', event)
        const aTags = event.tags;
        return await aTags;
        // console.log("getFollowing event.tags A: "+JSON.stringify(aTags,null,4))
        sub.unsub();
        // console.log("getFollowing event.tags B: "+JSON.stringify(aTags,null,4))
    })
    sub.on('eose', () => {
        sub.unsub()
    })

}

Initial attempt at getting nostr-tools to work in electron-react-boilerplate (erb).

So far I can generate private and public keys - nothing else yet.

## Issues I've encountered

# treated as a native dependency
After forking electron-react-boilerplate, I installed nostr-tools as a dev dependency:

```bash
npm install -D nostr-tools
```

If I install it as a regular dependency, it gets recognized as a native module.
I had a similar issue when I put ipfs-core into erb; see [README](https://github.com/wds4/electron-react-boilerplate-ipfs-core) for discussion.

# v0.24.1

To get getEventHash, signEvent and probably other functions working, I needed to update event.js with the following changes.
(These fixes were already put into the codebase (19 Dec 2022 I think) but not yet incorporated into latest version.)
```
import {sha256} from '@noble/hashes/sha256'
```

and rewrite
```
export function getEventHash(event) {
  let eventHash = sha256(Buffer.from(serializeEvent(event)))
  return Buffer.from(eventHash).toString('hex')
}
```

## Install

Clone the repo and install dependencies:

```bash
git clone --depth 1 --branch main https://github.com/wds/electron-react-boilerplate-nostr.git your-project-name
cd your-project-name
npm install
```

## Starting Development

Start the app in the `dev` environment:

```bash
npm start
```

## Packaging for Production

To package apps for the local platform:

```bash
npm run package
```
## License

MIT © [Electron React Boilerplate](https://github.com/electron-react-boilerplate)

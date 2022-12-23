Initial attempt at getting nostr-tools to work in electron-react-boilerplate (erb). This is just a Hello World to see whether nostr and erb are compatible.

So far I can get many of the basic nostr functions to work, both in dev mode and in production. Woohoo!

## Issues I've encountered

See also [this discussion](https://github.com/fiatjaf/nostr-tools/issues/46) in the nostr-tools repo.

### treated as a native dependency
After forking electron-react-boilerplate, I installed nostr-tools as a dev dependency:

```bash
npm install -D nostr-tools
```

If I install it as a regular dependency, it gets recognized as a native module and an error gets thrown during installation step.
I had a similar issue when I put ipfs-core into erb; see [README](https://github.com/wds4/electron-react-boilerplate-ipfs-core) for discussion.

### polyfills
This is related to the native dependency issue above. I had to modify [webpack.config.base.ts](https://github.com/wds4/electron-react-boilerplate-nostr/blob/main/.erb/configs/webpack.config.base.ts) as per [this stackoverflow](https://stackoverflow.com/questions/64557638/how-to-polyfill-node-core-modules-in-webpack-5) (see also [this discussion in nostr-tools repo](https://github.com/fiatjaf/nostr-tools/issues/46)) by adding:
```
fallback: {
  "stream": false,
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

I've tested packaged app in macOS and seems to work.

## License

MIT © [Electron React Boilerplate](https://github.com/electron-react-boilerplate)

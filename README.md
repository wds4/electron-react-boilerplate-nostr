Initial attempt at getting nostr-tools to work in electron. I am using electron-react-boilerplate as a starting point.

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

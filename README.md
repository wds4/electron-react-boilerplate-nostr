Initial attempt at getting nostr to work in electron. I am using electron-react-boilerplate as a starting point.

nostr tools I'm using right now: (nostr-tools)[https://github.com/fiatjaf/nostr-tools] and (nostrgg-react)[https://github.com/nostrgg/nostrgg-react].

## Features

- automatic generation of privkey and pubkey
- view and manage basics of your profile (name, picture_url, etc)
- main feed in 2 modes, "firehose" (unfiltered) and "following"
- view other profiles
- follow / unfollow button
- submit a post
- reply to a post
- thread viewer

## Todo

- refactor following page (need to request events for info on all users at once, not separate request for each user)
- add retweet, like buttons
- notifications
- direct messaging
- show pictures
- ability to input your own privkey (Alby?)
- implement caching (redux?)
- calculate and show number of followers
- maybe change location of sql database
- lightning invoice support
- back button

## Known issues

- Websocket does not reconnect after being dropped
- Follow buttons are a little buggy.

## Install

Clone the repo, install dependencies, make sql directory:

```bash
git clone https://github.com/wds4/electron-react-boilerplate-nostr.git your-project-name
cd your-project-name
npm install
cd release/app
mkdir sql
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

/* eslint global-require: off, no-console: off, promise/always-return: off */

/**
 * This module executes inside of electron's main process. You can start
 * electron renderer process from here and communicate with the other processes
 * through IPC.
 *
 * When running `npm run build` or `npm run build:main`, this file is compiled to
 * `./src/main.js` using webpack. This gives us some performance wins.
 */
import path from 'path';
import { app, BrowserWindow, shell, ipcMain } from 'electron';
import { autoUpdater } from 'electron-updater';
import log from 'electron-log';
import MenuBuilder from './menu';
import { resolveHtmlPath } from './util';

// not sure if need this in main or renderer
import 'websocket-polyfill'

import webpackPaths from '../../.erb/configs/webpack.paths'
import sqlite from 'sqlite3';
const sqlite3 = sqlite.verbose();

class AppUpdater {
    constructor() {
        log.transports.file.level = 'info';
        autoUpdater.logger = log;
        autoUpdater.checkForUpdatesAndNotify();
    }
}

let mainWindow: BrowserWindow | null = null;

// fetch relays from sql to send to the renderer process.
ipcMain.on('ipc-fetch-relays', async (event, arg) => {
    var sql = "";
    sql += "SELECT * FROM relays "
    db.all(sql, (err, aRelaysData) => {
        // console.log("ipc-fetch-relays result: "+JSON.stringify(aRelaysData,null,4))
        var aActive = [];
        for (var r=0;r<aRelaysData.length;r++) {
            var oNextRelayData = aRelaysData[r]
            var url = oNextRelayData.url;
            var default_app = oNextRelayData.default_app;
            var active = oNextRelayData.active;
            if (active) {
                aActive.push(url)
            }
        }
        event.reply('ipc-fetch-relays', aActive);
    });
});

ipcMain.on('ipc-example', async (event, arg) => {
    const msgTemplate = (pingPong: string) => `IPC test: ${pingPong}`;
    console.log(msgTemplate(arg));
    event.reply('ipc-example', msgTemplate('pong'));
});

ipcMain.on('asynchronous-sql-command', async (event, data) => {
    const sql = data[0];
    const nonce = data[1];
    db.all(sql, (err, result) => {
        event.reply('asynchronous-sql-reply-'+nonce, result);
    });
});

if (process.env.NODE_ENV === 'production') {
  const sourceMapSupport = require('source-map-support');
  sourceMapSupport.install();
}

const isDebug =
    process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true';

if (isDebug) {
    require('electron-debug')();
}

const databaseName = "nostr.sqlite3";
const sqlPath_dev = path.join(webpackPaths.appPath,'sql',databaseName);
const sqlPath_prod = path.join(app.getPath('userData'), databaseName)
const sqlPath = isDebug
    ? sqlPath_dev
    : sqlPath_prod

const sqlPathsInfo = [sqlPath, sqlPath_dev, sqlPath_prod, isDebug]
ipcMain.on('ipc-show-userDataPaths', async (event, arg) => {
    event.reply('ipc-show-userDataPaths', sqlPathsInfo);
});

const db = new sqlite3.Database(sqlPath, (err) => {
    if (err) console.error('Database opening error: ', err);
});

var createNostrProfilesTableCommand = "";
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
// createNostrProfilesTableCommand += "degreesOfSeparation INTEGER NULL, ";
createNostrProfilesTableCommand += "firstSeen INTEGER NULL, ";
createNostrProfilesTableCommand += "lastUpdate INTEGER NULL, ";
createNostrProfilesTableCommand += "UNIQUE(event_id, pubkey) ";

var createMyProfileTableCommand = "";
createMyProfileTableCommand += "id INTEGER PRIMARY KEY, ";
createMyProfileTableCommand += "created_at INTEGER NULL, ";
createMyProfileTableCommand += "active BOOLEAN false, ";
createMyProfileTableCommand += "pubkey TEXT NULL UNIQUE, ";
createMyProfileTableCommand += "privkey TEXT NULL UNIQUE, ";
createMyProfileTableCommand += "name TEXT NULL, ";
createMyProfileTableCommand += "display_name TEXT NULL, ";
createMyProfileTableCommand += "website TEXT NULL, ";
createMyProfileTableCommand += "about TEXT NULL, ";
createMyProfileTableCommand += "picture_url TEXT NULL, ";
createMyProfileTableCommand += "following TEXT NULL, ";
createMyProfileTableCommand += "followers TEXT NULL, ";
createMyProfileTableCommand += "ln_url TEXT NULL, ";
createMyProfileTableCommand += "nip05_verification TEXT NULL, ";
createMyProfileTableCommand += "lastUpdate INTEGER NULL, ";
createMyProfileTableCommand += "UNIQUE(pubkey, privkey) ";

var createMyFollowingNetworkTableCommand = "";
createMyFollowingNetworkTableCommand += "id INTEGER PRIMARY KEY, ";
createMyFollowingNetworkTableCommand += "seed TEXT NULL, ";
createMyFollowingNetworkTableCommand += "pubkeys TEXT NULL ";

var createRelaysTableCommand = "";
createRelaysTableCommand += "id INTEGER PRIMARY KEY, ";
createRelaysTableCommand += "url TEXT NULL, ";
createRelaysTableCommand += "default_app BOOLEAN NULL, ";
createRelaysTableCommand += "active BOOLEAN NULL, ";
createRelaysTableCommand += "UNIQUE(url) ";

const aDefaultRelayUrls = [
    "wss://nostr-pub.wellorder.net",
    "wss://nostr-relay.untethr.me",
    "wss://relay.damus.io",
    "wss://nostr-relay.wlvs.space",
    "wss://nostr.fmt.wiz.biz",
    "wss://nostr.oxtr.dev"
];
/*
TABLES:
myProfile: my nostr profile fields
nostrProfiles: profile info on the accounts I am following directly
followingNetwork: profile info on accounts within N degrees of separation from me; for use (experimental)
*/
db.serialize(() => {
    // db.run('DROP TABLE IF EXISTS nostrProfiles');
    // db.run('DROP TABLE IF EXISTS anotherCoolTable');
    // db.run('DROP TABLE IF EXISTS myProfile');
    // db.run('DROP TABLE IF EXISTS followingNetwork');
    // db.run('DROP TABLE IF EXISTS relays');
    db.run('CREATE TABLE IF NOT EXISTS nostrProfiles ('+createNostrProfilesTableCommand+')');
    db.run('CREATE TABLE IF NOT EXISTS followingNetwork ('+createMyFollowingNetworkTableCommand+')');
    db.run('CREATE TABLE IF NOT EXISTS myProfile ('+createMyProfileTableCommand+')');
    db.run('CREATE TABLE IF NOT EXISTS relays ('+createRelaysTableCommand+')');
    for (var r=0;r<aDefaultRelayUrls.length;r++) {
        var nextRelay = aDefaultRelayUrls[r];
        var sql = " INSERT OR IGNORE INTO relays (url,default_app,active) VALUES('"+nextRelay+"',true,true) ";
        db.run(sql);
    }
});

const installExtensions = async () => {
  const installer = require('electron-devtools-installer');
  const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
  const extensions = ['REACT_DEVELOPER_TOOLS'];

  return installer
      .default(
          extensions.map((name) => installer[name]),
          forceDownload
      )
      .catch(console.log);
};

const createWindow = async () => {
    if (isDebug) {
        await installExtensions();
    }

    const RESOURCES_PATH = app.isPackaged
        ? path.join(process.resourcesPath, 'assets')
        : path.join(__dirname, '../../assets');

    const getAssetPath = (...paths: string[]): string => {
        return path.join(RESOURCES_PATH, ...paths);
    };

    mainWindow = new BrowserWindow({
        show: false,
        width: 1100,
        height: 800,
        icon: getAssetPath('icon.png'),
        webPreferences: {
            preload: app.isPackaged
                ? path.join(__dirname, 'preload.js')
                : path.join(__dirname, '../../.erb/dll/preload.js'),
        },
    });

    mainWindow.loadURL(resolveHtmlPath('index.html'));

    mainWindow.on('ready-to-show', () => {
        if (!mainWindow) {
          throw new Error('"mainWindow" is not defined');
        }
        if (process.env.START_MINIMIZED) {
          mainWindow.minimize();
        } else {
          mainWindow.show();
        }
    });

    mainWindow.on('closed', () => {
        mainWindow = null;
    });

    const menuBuilder = new MenuBuilder(mainWindow);
    menuBuilder.buildMenu();

    // Open urls in the user's browser
    mainWindow.webContents.setWindowOpenHandler((edata) => {
        shell.openExternal(edata.url);
        return { action: 'deny' };
    });

    // Remove this if your app does not use auto updates
    // eslint-disable-next-line
    new AppUpdater();
};

/**
 * Add event listeners...
 */

app.on('window-all-closed', () => {
  // Respect the OSX convention of having the application in memory even
  // after all windows have been closed
  db.close();
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app
  .whenReady()
  .then(() => {
    createWindow();
    app.on('activate', () => {
      // On macOS it's common to re-create a window in the app when the
      // dock icon is clicked and there are no other windows open.
      if (mainWindow === null) createWindow();
    });
  })
  .catch(console.log);

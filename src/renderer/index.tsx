import { createRoot } from 'react-dom/client';
import App from './App';
// import { createStore } from 'redux'
// import { Provider } from 'react-redux'
// import store from './store'

// const store = createStore(rootReducer)

// wrap this in a function and don't call it until ipc-fetch-relays returns with data from sqlite3
const startApp = () => {
  const container = document.getElementById('root')!;
  const root = createRoot(container);
  root.render(<App />);
};

window.electron.ipcRenderer.once('ipc-fetch-relays', (relayUrls) => {
    console.log("ipc-fetch-relays; relayUrls: "+relayUrls);
    window.relayUrls = relayUrls;
    startApp()
});
window.electron.ipcRenderer.sendMessage('ipc-fetch-relays', ['ping']);

// calling IPC exposed from preload script
window.electron.ipcRenderer.once('ipc-example', (arg) => {
  // eslint-disable-next-line no-console
  console.log(arg);
});
window.electron.ipcRenderer.sendMessage('ipc-example', ['ping']);

/*
We will use asyncSql(sql) in src/renderer/pages/sqlDemoApp to send sql commmands and replies back and forth
between the main process and the renderer process.
*/
export const asyncSql = async (sql) => {
    const nonce = Math.floor(( Math.random() * 100000 ))
    console.log("asyncSql; nonce: "+nonce)
    return new Promise((resolve) => {
        window.electron.ipcRenderer.once('asynchronous-sql-reply-'+nonce, (arg) => {
            resolve(arg)
        });
        const data = [ sql, nonce ]
        window.electron.ipcRenderer.sendMessage('asynchronous-sql-command', data);
    })
}

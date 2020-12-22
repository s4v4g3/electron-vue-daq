
import { app, BrowserWindow } from 'electron';
import path from 'path'
import { IpcHandlers } from './ipc/main'

class Main {
    private mainWindow: BrowserWindow | undefined;
    private protocolCreated: boolean = false;
    private ipcHandlers: IpcHandlers;

    constructor() {
        this.ipcHandlers = new IpcHandlers()
    }

    public init() {
        app.on('ready', this.createWindow);
        app.on('window-all-closed', this.onWindowAllClosed);
        app.on('activate', this.onActivate);
        app.allowRendererProcessReuse = true
        this.ipcHandlers.init()
    }

    private onWindowAllClosed() {
        if (process.platform !== 'darwin') {
            app.quit();
        }
    }

    private onActivate() {
        if (!this.mainWindow) {
            this.createWindow();
        }
    }

    private createWindow() {
        let preloadPath;
        if (process.env.WEBPACK_DEV_SERVER_URL) {
            preloadPath = path.join(__dirname, '../public/preload.js');
        } else {
            preloadPath = path.join(__dirname, 'preload.js');
        }
        // Create the browser window.
        this.mainWindow = new BrowserWindow(
            {
                width: 900,
                height: 1440,
                autoHideMenuBar: true,
                webPreferences: {
                    preload: preloadPath
                },
                fullscreen: true
            })

        if (process.env.WEBPACK_DEV_SERVER_URL) {
            // Load the url of the dev server if in development mode
            this.mainWindow.loadURL(process.env.WEBPACK_DEV_SERVER_URL)
            //if (!process.env.IS_TEST) win.webContents.openDevTools()
        } else {

            const { createProtocol, /* installVueDevtools */ } = require('vue-cli-plugin-electron-builder/lib')

            if (!this.protocolCreated) {
                createProtocol('app')
                this.protocolCreated = true
            }
            // Load the index.html when not in development
            this.mainWindow.loadURL('app://./index.html')
        }
    }
}

// Here we go!
(new Main()).init();



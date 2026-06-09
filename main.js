const { app, BrowserWindow, Tray, Menu, nativeImage, globalShortcut, ipcMain, screen } = require('electron');
const path = require('path');
const http = require('http');
const fs = require('fs');

let win = null;
let tray = null;
let server = null;
const PORT = 3131;

if (!app.requestSingleInstanceLock()) app.quit();
app.setAppUserModelId('GAME TUNES');
app.commandLine.appendSwitch('autoplay-policy', 'no-user-gesture-required');
app.commandLine.appendSwitch('disable-features', 'CrossOriginOpenerPolicy');

function startServer() {
  server = http.createServer((req, res) => {
    const reqPath = req.url === '/' ? '/index.html' : req.url.split('?')[0];
    const filePath = path.join(__dirname, reqPath);
    const ext = path.extname(filePath);
    const mime = {
      '.html': 'text/html',
      '.js': 'text/javascript',
      '.css': 'text/css',
      '.ico': 'image/x-icon',
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.png': 'image/png'
    };

    fs.readFile(filePath, (err, data) => {
      if (err) {
        res.writeHead(404);
        res.end('Not found');
        return;
      }
      res.writeHead(200, { 'Content-Type': mime[ext] || 'text/plain' });
      res.end(data);
    });
  });

  server.listen(PORT);
}

function createWindow() {
  if (win) return;

  win = new BrowserWindow({
    width: 392,
    height: 470,
    minWidth: 392,
    minHeight: 470,
    maxWidth: 392,
    maxHeight: 470,
    frame: false,
    titleBarStyle: 'hidden',
    title: '',
    transparent: true,
    backgroundColor: '#00000000',
    alwaysOnTop: true,
    resizable: false,
    movable: true,
    skipTaskbar: true,
    hasShadow: false,
    show: false,
    useContentSize: true,
    icon: path.join(__dirname, 'icon.ico'),
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      webSecurity: false,
      allowRunningInsecureContent: true,
      preload: path.join(__dirname, 'preload.js')
    }
  });

  win.setMenu(null);
  win.webContents.session.setPermissionRequestHandler((wc, permission, cb) => cb(true));
  win.webContents.session.setPermissionCheckHandler(() => true);
  win.loadURL(`http://localhost:${PORT}/`);

  win.once('ready-to-show', () => {
    const display = screen.getPrimaryDisplay();
    const { width, height } = display.workAreaSize;
    win.setPosition(width - 420, height - 470);
    win.showInactive();
  });

  win.on('closed', () => {
    win = null;
  });
}

function createTray() {
  try {
    tray = new Tray(path.join(__dirname, 'icon.ico'));
  } catch (e) {
    tray = new Tray(nativeImage.createEmpty());
  }

  tray.setToolTip('GAME TUNES');
  updateTrayMenu();

  tray.on('click', () => {
    if (!win) return;
    if (win.isVisible()) win.hide();
    else {
      win.show();
      win.focus();
    }
  });
}

function updateTrayMenu(title = 'No song loaded') {
  const menu = Menu.buildFromTemplate([
    { label: '🎮 GAME TUNES', enabled: false },
    { label: title, enabled: false },
    { type: 'separator' },
    { label: '⏮ Previous', click: () => sendCmd('prev') },
    { label: '▶ Play / Pause', click: () => sendCmd('toggle') },
    { label: '⏭ Next', click: () => sendCmd('next') },
    { type: 'separator' },
    { label: '👁 Show / Hide', click: () => { if (win) win.isVisible() ? win.hide() : win.show(); } },
    { label: '✖ Quit', click: () => app.quit() }
  ]);
  tray.setContextMenu(menu);
}

function sendCmd(cmd) {
  if (win) win.webContents.send('tray-cmd', cmd);
}

ipcMain.on('now-playing', (e, info) => {
  if (tray) {
    tray.setToolTip('♪ ' + info);
    updateTrayMenu(info);
  }
});

ipcMain.on('close-app', () => {
  if (server) server.close();
  app.quit();
});

ipcMain.on('hide-app', () => {
  if (win) win.hide();
});

app.whenReady().then(() => {
  startServer();
  setTimeout(() => {
    createWindow();
    createTray();
  }, 300);

  globalShortcut.register('MediaPlayPause', () => sendCmd('toggle'));
  globalShortcut.register('MediaNextTrack', () => sendCmd('next'));
  globalShortcut.register('MediaPreviousTrack', () => sendCmd('prev'));
});

app.on('second-instance', () => {
  if (win) {
    if (win.isMinimized()) win.restore();
    win.show();
    win.focus();
  }
});

app.on('will-quit', () => {
  globalShortcut.unregisterAll();
  if (server) server.close();
});

app.on('window-all-closed', () => {});
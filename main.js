const { app, BrowserWindow } = require('electron');
const path = require('path');

function createWindow () {
  try {
    const win = new BrowserWindow({
      width: 560,
      height: 280,
      frame: false,
      transparent: true,
      resizable: false,
      webPreferences: {
        preload: path.join(__dirname, 'preload.js'),
        nodeIntegration: false,
        contextIsolation: true
      }
    });
    process.chdir(__dirname);
    win.loadFile('index.html');
    console.log('BrowserWindow created and index.html loaded successfully');
  } catch (error) {
    console.error('Error creating BrowserWindow:', error);
  }
}

app.on('ready', () => {
  console.log('App is ready, creating window...');
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      console.log('No windows open, creating a new one on activate...');
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  console.log('All windows closed, quitting app...');
  if (process.platform !== 'darwin') app.quit();
});

app.on('error', (error) => {
  console.error('App encountered an error:', error);
});
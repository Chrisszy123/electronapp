const { app, BrowserWindow, ipcMain } = require('electron');
const url = require('url');
const path = require('path');
const fs = require('fs');
const TodoService = require('./actions/TodoService');
const FormData = require('form-data');
const { default: axios } = require('axios');

function createMainWindow() {
  const mainWindow = new BrowserWindow({
    title: 'Desktop App',
    width: 1000,
    height: 600,
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: true,
      preload: path.join(__dirname, 'preload.js'),
    },
  });
  mainWindow.webContents.openDevTools();
  const startUrl = url.format({
    pathname: path.join(__dirname, './app/build/index.html'),
    protocol: 'file',
  });

  mainWindow.loadURL('http://localhost:3000');
}

app.whenReady().then(() => {
  createMainWindow();
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createMainWindow();
    }
  });
});
// listen for todo form submit
ipcMain.on('submit:todoForm', async (event, ...args) => {
  console.log(...args);
  const data = await TodoService.handleTodoFormSubmit(opt);
  mainWindow.webContents.send('task:added', { task: data });
});
//listen for file upload
ipcMain.on('file:upload', async (e, opt) => {
  var form = new FormData();
  form.append('image', fs.createReadStream(opt.file));
  form.append('name', 'asdasd');
  await axios.post('http://localhost:8000/api/upload', form, {
    headers: form.getHeaders(),
  });
  mainWindow.webContents.send('upload:complete');
  return true;
});

// check if we are on a MAC and close the app appropraitely
app.on('window-all-closed', () => {
  if (process.platform === 'darwin') {
    app.quit();
  }
});

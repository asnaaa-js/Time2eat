const { app, BrowserWindow, ipcMain } = require('electron');
const fs = require('fs');
const path = require('path');

let mainWindow;

const createWindow = () => {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    }
  });
  mainWindow.loadFile(path.join(__dirname,'index.html'));
};

app.on('ready', createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// CRUD File Handling
ipcMain.on('create-file', (event, { fileName, fileContents }) => {
  const filePath = path.join(__dirname, 'Files', fileName);
  fs.writeFile(filePath, fileContents, (err) => {
    if (err) {
      console.error(err);
      return;
    }
    console.log(`${fileName} has been created.`);
    event.sender.send('file-created', fileName);
  });
});

ipcMain.on('read-file', (event, fileName) => {
  const filePath = path.join(__dirname, 'Files', fileName);
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      return;
    }
    event.sender.send('file-read', data);
  });
});

ipcMain.on('delete-file', (event, fileName) => {
  const filePath = path.join(__dirname, 'Files', fileName);
  fs.unlink(filePath, (err) => {
    if (err) {
      console.error(err);
      return;
    }
    console.log(`${fileName} has been deleted.`);
    event.sender.send('file-deleted');
  });
});

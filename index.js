// main.js (Electron主进程文件)  
const { app, BrowserWindow, ipcMain, Menu, Tray } = require('electron');
const path = require('path');
let mainWindow;
// 休息时间
let restTime = 6
// 工作时间
let workTime = 10


function createWindow(windowMin = false) {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    // frame:false,
    title: "定时休息",
    icon: process.platform === 'darwin'  
      ? path.join(__dirname, 'build/icons/icon.icns') // macOS 使用 .icns 格式  
      : path.join(__dirname, 'build/icons/icon.ico'), // Windows 使用 .ico 格式   
    webPreferences: {
      nodeIntegration: true, // 允许渲染进程访问Node.js  
      contextIsolation: false,// 禁用上下文隔离  

    }
  });
  mainWindow.loadFile('index.html'); // 加载渲染进程的HTML文件  


  // 休息倒计时结束
  ipcMain.on('countDownEnd', (vent, arg) => {
    mainWindow.setFullScreen(false);
    // mainWindow.minimize();
    mainWindow.close()
  })
  mainWindow.on('close', (e) => {
    e.preventDefault();
    mainWindow.hide();
    setTime()
  });
}

app.whenReady().then(createWindow);

// 监听窗口关闭事件  
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

function setTime() {

  setTimeout(() => {
    // if (mainWindow.isMinimized()) {
    //   mainWindow.restore(); // 如果窗口最小化，则恢复窗口  
    // }
    mainWindow.maximize()
    mainWindow.setFullScreen(true);

    mainWindow.focus();
    mainWindow.webContents.send('startTime');
  }, workTime * 1000)
}

// // 监听渲染进程发送的消息-保存设置 
ipcMain.on('saveSetting', (event, arg) => {
  workTime = arg.workTime
  restTime = arg.restTime
  mainWindow.hide();
  setTime()
});



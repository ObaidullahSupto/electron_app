const { app, BrowserWindow, Menu, ipcMain, webContents } = require("electron");
const url = require("url");
const path = require("path");
const shell = require("electron").shell;
const fs = require("fs");

//main window frame
let mainWindow, secondWindow, captureWindow, printToPdfWindow;
function createWindow(filename, options) {
  let win = new BrowserWindow(options);

  win.loadFile(filename);

  win.on("closed", function() {
    win = null;
  });
  return win;
}

app.on("ready", () => {
  mainWindow = createWindow("", {
    width: 800,
    height: 600,
    title: "Main Window",
    backgroundColor: "#f4f5f7",
    webPreferences: {
      nodeIntegration: true
    }
  });
  mainWindow.loadURL(
    url.format({
      pathname: path.join(__dirname, "src/index.html"),
      protocol: "file:",
      slashes: true
    })
  );

  //Creating menu
  var menu = Menu.buildFromTemplate([
    {
      label: "File",
      submenu: [
        { label: "Add" },
        //view another link
        {
          label: "View",
          click() {
            shell.openExternal("https://coursetro.com");
          }
        },
        //seperate menu form other
        { type: "separator" },
        //exit menu
        {
          label: "Exit",
          click() {
            app.quit();
          }
        }
      ]
    },
    {
      label: "Info"
    },
    {
      label: "Content",

      submenu: [
        { label: "Class 1" },
        { label: "Class 2" },
        { label: "Class 3" }
      ]
    },
    {
      //Basic window menu
      label: "Window",
      submenu: [
        {
          //reload menu
          label: "Reload",
          accelertor: "CmdorCtrl+R",
          click: (menuItem, focusedWindow) => {
            if (focusedWindow) {
              focusedWindow.reload();
            }
          }
        },
        {
          //Minimize menu
          label: "Minimize",
          accelerator: "Cmd+Ctrl+M,",
          role: "minimize"
        },
        {
          //toggle full screen menu
          label: "Toogle Full Screen",
          accelerator: process.platform === "darwin" ? "Ctrl+Command+F" : "F11",
          click: (item, focussedWindow) => {
            if (focussedWindow) {
              focussedWindow.setFullScreen(!focussedWindow.isFullScreen());
            }
          }
        },
        {
          //Toggle Dev Tools menu
          label: "Toggle Dev tools",
          accelerator: (function() {
            if (process.platform === "darwin") {
              return "Ctrl+Command+I";
            } else {
              ("F10");
            }
          })(),
          click: function(item, focussedWindow) {
            if (focussedWindow) {
              focussedWindow.toggleDevTools();
            }
          }
        },
        {
          //help menu
          label: "Help",
          role: "help",
          submenu: [
            {
              label: "Learn More",
              click: () => {
                shell.openExternal("http://electron.atom.io");
              }
            }
          ]
        },
        //seperate menu form other
        { type: "separator" },

        {
          //CLose menu
          label: "Close",
          accelerator: "Cmd+Ctrl+C,",
          role: "close"
        }
      ]
    }
  ]);

  //Creating context menu for right click
  const ctxMenu = Menu.buildFromTemplate([
    {
      label: "Cut",
      role: "cut"
    },
    {
      label: "Copy",
      role: "copy"
    },
    {
      label: "Paste",
      role: "paste"
    },
    {
      label: "Select All",
      role: "selectall"
    }
  ]);

  mainWindow.webContents.on("context-menu", (event, params) => {
    event.preventDefault();
    ctxMenu.popup(mainWindow, params.x, params.y);
  });

  Menu.setApplicationMenu(menu);

  // secondWindow = createWindow("", {
  //   height: 400,
  //   width: 300,
  //   title: "Second Window"
  // });

  // secondWindow.loadURL(
  //   url.format({
  //     pathname: path.join(__dirname, "src/index.html"),
  //     protocol: "file:",
  //     slashes: true
  //   })
  // );
});

//reload the application
require("electron-reload")(process.cwd(), {
  electron: path.join(process.cwd(), "node_modules", ".bin", "electron")
});

// ipcMain.on("send-sync-msg", (event, args) => {
//   console.log("this is my receiver in main process");

// });

// Event handler for asynchronous incoming messages
// ipcMain.on("asynchronous-message", (event, arg) => {
//   console.log(arg);

//   // Event emitter for sending asynchronous messages
//   event.sender.send("asynchronous-reply", "async pong");
// });

// Event handler for synchronous incoming messages
// ipcMain.on("synchronous-message", (event, arg) => {
//   console.log(arg);

//   // Synchronous event emmision
//   event.returnValue = "sync pong";
// });

//open dialog module
// ipcMain.on("open-dialog", (event, arg) => {
//   dialog.showOpenDialog(
//     {
//       properties: ["openDirectory", "openFile", "multiSelections"]
//     },
//     filePaths => {
//       if (filePaths) event.sender.send("selected-items", filePaths);
//     }
//   );
// });

app.on("activate", function() {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow();
  }
});

ipcMain.on("capture-window", event => {
  //get the current focused browserwindow by id
  captureWindow = BrowserWindow.fromId(event.sender.webContents.id);
  // get the width and height of current focused window
  const bounds = captureWindow.getBounds();
  //call the capture page method by rectangle options
  captureWindow.webContents.capturePage(
    {
      x: 0,
      y: 0,
      width: bounds.width,
      height: bounds.height
    },
    image => {
      const desktop = app.getPath("desktop");
      const filePath = `${desktop}/${captureWindow.getTitle()}-captured.png`;
      console.log(filePath);
      //generate a png file
      const png = image.toPNG();
      fs.writeFileSync(filePath, png);
    }
  );
});

ipcMain.on("print-to-pdf", event => {
  printToPdfWindow = BrowserWindow.fromId(event.sender.webContents.id);
  printToPdfWindow.webContents.printToPDF({}, (error, data) => {
    if (error) {
      console.error(error);
      return;
    }
    if (data) {
      const desktop = app.getPath("desktop");
      const filePath = `${desktop}/${printToPdfWindow.getTitle()}-captured.pdf`;
      fs.writeFile(filePath, data, error => {
        if (error) {
          console.error(error);
          return;
        }
        console.log("Pdf generated!");
      });
    }
  });
});

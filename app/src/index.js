const { BrowserWindow } = require("electron").remote;
const path = require("path");
// const ipc = electron.ipcRenderer

//open up another window
const notifyBtn = document.getElementById("alert");
notifyBtn.addEventListener("click", function(event) {
  const modalPath = path.join(__dirname, "add.html");
  let win = new BrowserWindow({
    webPreferences: {
      nodeIntegration: true
    },
    alwaysOnTop: true,
    width: 400,
    height: 200
  });
  win.on("close", function() {
    win = null;
  });
  win.loadURL(modalPath);
  win.show();
});

//jquery couner
let count = 0;
$("#click-counter").text(count.toString());
$("#countbtn").on("click", () => {
  count++;
  $("#click-counter").text(count);
});

//js alert
const notifyBtn1 = document.getElementById("clickme");
notifyBtn1.addEventListener("click", function(event) {
  alert("Clicked");
});

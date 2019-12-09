const { ipcRenderer } = require("electron");
document.getElementById("capture-page").addEventListener("click", () => {
  ipcRenderer.send("capture-window");
});

document.getElementById("print-button").addEventListener("click", () => {
  ipcRenderer.send("print-to-pdf");
});

//notifier
const notifier = require("node-notifier");

document.getElementById("notify").onclick = event => {
  notifier.notify(
    {
      title: "Notification Alert",
      message: "Hello from OS",
      icon: path.join("", "/home/ayushgp/Desktop/images.png"),
      // Absolute path (doesn't work on balloons)
      sound: true, // Only Notification Center or Windows Toasters
      wait: true // Wait with callback, until user action is taken    against notification
    },
    function(err, response) {
      // Response is response from notification
    }
  );

  notifier.on("click", function(notifierObject, options) {
    console.log("You clicked on the notification");
  });

  notifier.on("timeout", function(notifierObject, options) {
    console.log("Notification timed out!");
  });
};

////////////////////video audio capyure //////////////
(function() {
  var width = 300;
  var height = 300;
  var streaming = false;
  var video = null;
  var canvas = null;
  var photo = null;
  var startbutton = null;

  function startup() {
    video = document.getElementById("video");
    canvas = document.getElementById("canvas");
    photo = document.getElementById("photo");
    startbutton = document.getElementById("startbutton");

    navigator.mediaDevices
      .getUserMedia({ video: true, audio: false })
      .then(function(stream) {
        video.srcObject = stream;
        video.play();
      })
      .catch(function(err) {
        console.log("An error occurred: " + err);
      });

    video.addEventListener(
      "canplay",
      function(ev) {
        if (!streaming) {
          height = video.videoHeight / (video.videoWidth / width);

          if (isNaN(height)) {
            height = width / (4 / 3);
          }

          video.setAttribute("width", width);
          video.setAttribute("height", height);
          canvas.setAttribute("width", width);
          canvas.setAttribute("height", height);
          streaming = true;
        }
      },
      false
    );

    startbutton.addEventListener(
      "click",
      function(ev) {
        takepicture();
        ev.preventDefault();
      },
      false
    );

    clearphoto();
  }

  function clearphoto() {
    var context = canvas.getContext("2d");
    context.fillStyle = "#AAA";
    context.fillRect(0, 0, canvas.width, canvas.height);

    var data = canvas.toDataURL("image/png");
    photo.setAttribute("src", data);
  }

  function takepicture() {
    var context = canvas.getContext("2d");
    if (width && height) {
      canvas.width = width;
      canvas.height = height;
      context.drawImage(video, 0, 0, width, height);

      var data = canvas.toDataURL("image/png");
      photo.setAttribute("src", data);
    } else {
      clearphoto();
    }
  }

  // Set up our event listener to run the startup process
  // once loading is complete.
  window.addEventListener("load", startup, false);
})();

//*********PDF***********//

// const msgBtn = document.getElementById("sendMsg");

// msgBtn.addEventListener("click", event => {
//   //send msg to main process or receiver
//   ipcRenderer.sendSync("send-sync-msg", "Hello from renderer process");
// });

//const { ipcRenderer } = require("electron");

// Synchronous message emmiter and handler
// console.log(ipcRenderer.sendSync("synchronous-message", "sync ping"));

// Async message handler
// ipcRenderer.on("asynchronous-reply", (event, arg) => {
//   console.log(arg);
// });

// Async message sender
//ipcRenderer.send("asynchronous-message", "async ping");

//open dialog module
// ipcRenderer.send("open-dialog");
// ipcRenderer.on("selected-items", (event, args) => {
//   console.log(args);
// });

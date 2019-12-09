const { remote } = require("electron");

//close button
const closeBtn = document.getElementById("closeBtn");
closeBtn.addEventListener("click", function(event) {
  console.log("sfdsgbfs");
  var window = remote.getCurrentWindow();
  window.close();
});

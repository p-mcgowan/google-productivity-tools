// Saves options to chrome.storage
let save_options = () => {
  var color = document.getElementById("color").value;
  var likesColor = document.getElementById("like").checked;
  chrome.storage.sync.set(
    {
      favoriteColor: color,
      likesColor: likesColor,
    },
    () => {
      // Update status to let user know options were saved.
      var status = document.getElementById("status");
      status.textContent = "Options saved.";
      setTimeout(() => {
        status.textContent = "";
      }, 750);
    },
  );
};

// Restores select box and checkbox state using the preferences
// stored in chrome.storage.
let restore_options = () => {
  // Use default value color = 'red' and likesColor = true.
  chrome.storage.sync.get(
    {
      favoriteColor: "red",
      likesColor: true,
    },
    (items) => {
      document.getElementById("color").value = items.favoriteColor;
      document.getElementById("like").checked = items.likesColor;
    },
  );
};
document.addEventListener("DOMContentLoaded", restore_options);
document.getElementById("save").addEventListener("click", save_options);

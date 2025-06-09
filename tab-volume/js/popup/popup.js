const toPromise = (fn) =>
  new Promise((y, n) => fn((data, err) => (err ? n(err) : y(data))));

const emit = (msg) => toPromise((cb) => chrome.runtime.sendMessage(msg, cb));

document.addEventListener("DOMContentLoaded", async () => {
  const volume = document.getElementById("volume");
  volume.focus();
  volume.setAttribute("disabled", "true");

  const [activeTab] = await toPromise((cb) =>
    chrome.tabs.query({ active: true, currentWindow: true }, cb),
  );
  const currentVolume = await emit({
    name: "get-tab-volume",
    tabId: activeTab.id,
  });

  volume.value = 100 * currentVolume;
  volume.removeAttribute("disabled");

  volume.addEventListener("input", () =>
    emit({ name: "set-tab-volume", tabId: activeTab.id, value: volume.value }),
  );

  const abort = document.getElementById("abort");
  abort.addEventListener("click", () => {
    volume.value = 100;
    emit({
      name: "clear-tab-volume",
      tabId: activeTab.id,
      value: volume.value,
    });
  });
});

// @FIXME: run in backgroup / offscreen, fix all this hacky shit
// https://github.com/voiceofgrog/volumehub/blob/main/manifest.json
const tabs = {};

class VolumeControlledTab {
  initialized = null;
  stream = null;
  audioContext = null;
  streamSource = null;
  gainNode = null;
  tabId = null;

  constructor(id, stream) {
    this.initialized = this.init(id, stream);
  }

  async init(tabId, stream) {
    this.tabId = tabId;
    this.stream = stream;
    // const streamId = await chrome.tabCapture.getMediaStreamId({ targetTabId: tabId });
    // this.stream = await navigator.mediaDevices.getUserMedia({
    //         audio: { mandatory: { chromeMediaSource: 'tab', chromeMediaSourceId: msg.streamId } },
    //         video: false,
    //       });
    // console.log(this.stream);
    // this.stream = await new Promise((resolve, reject) => {
    //   return chrome.tabCapture.capture(
    //     { audio: true, video: false },
    //     (data, err) => (err ? reject(err) : resolve(data)),
    //   );
    // });
    this.audioContext = new AudioContext();
    this.streamSource = this.audioContext.createMediaStreamSource(this.stream);
    this.gainNode = this.audioContext.createGain();

    this.streamSource.connect(this.gainNode);
    this.gainNode.connect(this.audioContext.destination);
  }

  async getVolume(tabId) {
    if (!this.initialized) {
      this.initialized = this.init(tabId);
    }
    await this.initialized;

    return this.gainNode.gain.value;
  }

  async setVolume(tabId, volume) {
    if (!this.initialized) {
      this.initialized = this.init(tabId);
    }
    await this.initialized;

    return (this.gainNode.gain.value = volume / 100);
  }

  destruct() {
    if (this.stream) {
      console.log(this.stream.getAudioTracks());
      this.stream.getAudioTracks().forEach((t) => {
        this.stream.removeTrack(t);
        t.stop();
      });
      console.log(this.stream.getVideoTracks());
      this.stream.getVideoTracks().forEach((t) => {
        this.stream.removeTrack(t);
        t.stop();
      });
    }
    if (this.audioContext) {
      this.audioContext.close();
    }
    this.initialized = null;
    this.stream = null;
    this.audioContext = null;
    this.streamSource = null;
    this.gainNode = null;
    console.log("killed");
  }
}

const assertTab = (id, stream) => {
  if (!(id in tabs)) {
    tabs[id] = new VolumeControlledTab(id, stream);
  }

  return tabs[id];
};

const destroyVolumeTab = (id) => {
  tabs[id]?.destruct?.();

  return delete tabs[id];
};

const toPromise = (fn) =>
  new Promise((y, n) => fn((data, err) => (err ? n(err) : y(data))));

// const emit = (msg) => toPromise((cb) => chrome.runtime.sendMessage(msg, cb));
const emit = async (message, respond) => {
  switch (message.name) {
    case "get-tab-volume":
      await assertTab(message.tabId, message.stream).getVolume(message.tabId).then(respond);
      return true;
    case "set-tab-volume":
      await assertTab(message.tabId, message.stream)
        .setVolume(message.tabId, message.value)
        .then(respond);
      return true;
    case "clear-tab-volume":
      await assertTab(message.tabId, message.stream).destruct();
      respond("success");
      return true;
    default:
      console.error(message);
      throw Error(`Unknown message received: ${message}`);
  }
}

document.addEventListener("DOMContentLoaded", async () => {
  const volume = document.getElementById("volume");
  volume.focus();
  volume.setAttribute("disabled", "true");

  const [activeTab] = await toPromise((cb) =>
    chrome.tabs.query({ active: true, currentWindow: true }, cb),
  );
  const { promise, resolve, reject } = Promise.withResolvers();

  chrome.tabCapture.capture({audio: true, video: false}, async (stream) => {
    const tab = assertTab(activeTab.id, stream);
    await tab.initialized;

    resolve(tab);
  });
  const tab = await promise;

  const currentVolume = await emit({
    name: "get-tab-volume",
    tabId: activeTab.id,
    stream: tab.stream,
  });

  volume.value = 100 * currentVolume;
  volume.removeAttribute("disabled");

  volume.addEventListener("input", async () =>
    await emit({ name: "set-tab-volume", tabId: activeTab.id, value: volume.value, stream: tab.stream, }),
  );

  const abort = document.getElementById("abort");
  abort.addEventListener("click", () => {
    volume.value = 100;
    emit({
      name: "clear-tab-volume",
      tabId: activeTab.id,
      value: volume.value,
      stream: tab.stream,
    });
  });
});

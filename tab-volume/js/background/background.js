const tabs = {};

class VolumeControlledTab {
  initialized = null;
  stream = null;
  audioContext = null;
  streamSource = null;
  gainNode = null;

  constructor() {
    this.initialized = this.init();
  }

  async init() {
    this.stream = await new Promise((resolve, reject) => {
      return chrome.tabCapture.capture({ audio: true, video: false }, (data, err) => err ? reject(err) : resolve(data));
    });
    this.audioContext = new AudioContext();
    this.streamSource = this.audioContext.createMediaStreamSource(this.stream);
    this.gainNode = this.audioContext.createGain();

    this.streamSource.connect(this.gainNode);
    this.gainNode.connect(this.audioContext.destination);
  }

  async getVolume() {
    await this.initialized;

    return this.gainNode.gain.value;
  }

  async setVolume(volume) {
    await this.initialized;

    return this.gainNode.gain.value = volume / 100;
  }

  destruct() {
    this.audioContext.close();
    this.initialized = null;
    this.stream = null;
    this.audioContext = null;
    this.streamSource = null;
    this.gainNode = null;
  }
}

const assertTab = (id) => {
  if (!(id in tabs)) {
    tabs[id] = new VolumeControlledTab();
  }

  return tabs[id];
}

const destroyVolumeTab = (id) => {
  tabs[id]?.destruct?.();

  return delete tabs[id];
};

chrome.runtime.onMessage.addListener((message, sender, respond) => {
  switch (message.name) {
    case 'get-tab-volume':
      assertTab(message.tabId).getVolume().then(respond);
      return true;
    case 'set-tab-volume':
      assertTab(message.tabId).setVolume(message.value).then(respond);
      return true;
    default:
      console.error(message);
      throw Error(`Unknown message received: ${message}`);
  }
});

chrome.tabs.onRemoved.addListener(destroyVolumeTab);

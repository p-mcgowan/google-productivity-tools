const mapIgnored = (subs) => {
  const ignored = {};
  for (const sub of subs.split(/[,\ \r\n]+/)) {
    const normal = sub?.trim()?.toLowerCase();
    if (!normal) {
      continue;
    }
    ignored[normal] = true;
  }

  return ignored;
};

let timeout = -1;

const saveOptions = () => {
  const ignored = mapIgnored(document.getElementById('ignored').value);
  const enabled = document.getElementById('enabled').checked;

  chrome.storage.local.set({ enabled, ignored });

  clearTimeout(timeout);
  timeout = setTimeout(() => chrome.storage.sync.set({ enabled, ignored }), 5000);
};

const restoreOptions = () => {
  chrome.storage.local.get(['enabled', 'ignored'], (local) => {
    document.getElementById('enabled').checked = local.enabled || false;
    document.getElementById('ignored').value = Object.keys(local.ignored || {}).join('\n');

    chrome.storage.sync.get(['enabled', 'ignored'], (remote) => {
      const items = { ...remote, ...local };
      document.getElementById('enabled').checked = items.enabled || false;
      document.getElementById('ignored').value = Object.keys(items.ignored || {}).join('\n');
    });
  });
};

document.addEventListener('DOMContentLoaded', restoreOptions);
document.getElementById('enabled').addEventListener('change', saveOptions);
document.getElementById('ignored').addEventListener('keyup', saveOptions);

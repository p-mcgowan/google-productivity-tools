const mapIgnored = (subs) => {
  const ignored = {};
  for (const sub of subs.split(/[,\ \r\n]+/)) {
    const normal = sub?.trim()?.toLowerCase();
    if (!normal) {
      continue;
    }
    const fmtd = normal.replace(/^(r\/)?/, 'r/');
    ignored[fmtd] = true;
  }

  return ignored;
};

const saveOptions = () => {
  chrome.storage.local.set({
    enabled: document.getElementById('enabled').checked,
    ignored: mapIgnored(document.getElementById('ignored').value),
  });
};

const restoreOptions = () => {
  chrome.storage.local.get(['enabled', 'ignored'], (items) => {
    document.getElementById('enabled').checked = items.enabled || false;
    document.getElementById('ignored').value = Object.keys(items.ignored || {}).join('\n');
  });
};

document.addEventListener('DOMContentLoaded', restoreOptions);
document.getElementById('enabled').addEventListener('change', saveOptions);
document.getElementById('ignored').addEventListener('keyup', saveOptions);

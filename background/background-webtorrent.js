// Function to process torrent links
function torrentListener(requestDetails) {
	if (requestDetails.url.toLowerCase().endsWith(".torrent")) {
		console.log("torrent");
		console.log(requestDetails);
		return {cancel: true};
	} else if (requestDetails.url.toLowerCase().startsWith("http://webtorrent.webextension/")) {
		console.log("magnet");
		console.log(requestDetails);
		return {cancel: true};
	}
}

// Function to ignore magnet links coming from the protocol handler when the extension is disabled
function ignoreMagnet(requestDetails) {
	console.log(requestDetails);
}

function startListening() {
  browser.webRequest.onBeforeRequest.addListener(
    torrentListener,
    {urls: ["<all_urls>"]},
    ["requestBody","blocking"]
  );
  browser.webRequest.onBeforeRequest.removeListener(ignoreMagnet);
  browser.browserAction.setIcon({path: {"16": "images/icon-16.png","32": "images/icon-32.png"}});
  console.log("WebTorrent enabled");
}

function stopListening() {
  browser.webRequest.onBeforeRequest.addListener(
    ignoreMagnet,
    {urls: ["*://webtorrent.webextension/*"]},
    ["blocking"]
  );
  browser.webRequest.onBeforeRequest.removeListener(torrentListener);
  browser.browserAction.setIcon({path: {"16": "images/icon-16-disabled.png","32": "images/icon-32-disabled.png"}});
  console.log("WebTorrent disabled");
}

function toggleListener() {
  if (browser.webRequest.onBeforeRequest.hasListener(torrentListener)) {
    stopListening();
  } else {
    startListening();
  }
}


browser.browserAction.onClicked.addListener(toggleListener);

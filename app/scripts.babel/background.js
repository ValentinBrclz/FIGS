'use strict';

function showPreviousVersion(details) {
	console.log(chrome.i18n.getMessage('previousVersion', chrome.i18n.getMessage('appName')),
		details.previousVersion);
}

function checkContext(tabId, changeInfo, tab) {
	if (tab.url.indexOf('https://www.google.') == 0) {
		chrome.pageAction.show(tabId);
	}
}

function handleUserClick(tab) {
	if (tab.incognito) {
		getAndShowPosition(tab);
	} else {
		alert(chrome.i18n.getMessage('errorNotInIncognito'));
	}
}

function getAndShowPosition(tab) {
	// Go to the 100 result page
	chrome.tabs.update(tab.id, {url: tab.url + '&num=100'});

	// Wait for load completion
	chrome.tabs.onUpdated.addListener(messageContextscript);
}

function messageContextscript(tabId, info) {
	if (info.status == 'complete') {
		// Message contentscript
		chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
			chrome.tabs.executeScript(tabs[0].id, {file: contentscript.js});
			chrome.tabs.sendMessage(tabs[0].id, {method: 'searchAndNotify'});
		});

		// Remove listener
		chrome.tabs.onUpdated.removeListener(messageContextscript);
	}
}

///////////
// Chrome listeners
chrome.runtime.onInstalled.addListener(showPreviousVersion);

chrome.tabs.onUpdated.addListener(checkContext);

chrome.pageAction.onClicked.addListener(handleUserClick);

console.log(chrome.i18n.getMessage('extensionLoaded', chrome.i18n.getMessage('appName')));

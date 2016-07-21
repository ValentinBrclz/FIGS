'use strict';

// Vars
var notificationOpt = {
	type: 'basic',
	title: chrome.i18n.getMessage('appName') + ' - ' + chrome.i18n.getMessage('success'),
	message: chrome.i18n.getMessage('successPositionNotification'),
	iconUrl: 'images/icon-128.png' 
};

function showPreviousVersion(details) {
	console.log(chrome.i18n.getMessage('previousVersion', chrome.i18n.getMessage('appName')),
		details.previousVersion);
}

function checkContext(tabId, changeInfo, tab) {
	if (tab.url && tab.url.indexOf('https://www.google.') == 0) {
		chrome.pageAction.show(tabId);
	}
}

function handleUserClick(tab) {
	if (tab.incognito) {
		// Go to the 100 result page
		chrome.tabs.update(tab.id, {url: tab.url + '&num=100'});

		// Wait for load completion
		chrome.tabs.onUpdated.addListener(messageContextscript);
	} else {
		if(confirm(chrome.i18n.getMessage('errorNotInIncognito'))) {
			chrome.windows.create({url: tab.url, incognito: true});
		}
	}
}

function messageContextscript(tabId, info) {
	if (info.status == 'complete') {
		// Message contentscript
		chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
			chrome.tabs.executeScript(tabs[0].id, {file: 'scripts/contentscript.js'});
		});

		// Remove listener
		chrome.tabs.onUpdated.removeListener(messageContextscript);
	}
}

/**
 *
 * @param position
 * @author SethWhite <http://stackoverflow.com/users/3803371/sethwhite>
 */
function copy(position) {
	var copyElement = document.createElement('textarea');
	copyElement.textContent = position;
	var body = document.getElementsByTagName('body')[0];
	body.appendChild(copyElement);
	copyElement.select();
	document.execCommand('copy');
	body.removeChild(copyElement);
}

function handleContextscriptResponse(request, sender, sendResponse) {
	// Copy into clipboard
	copy(request.position);

	// Notify
	chrome.notifications.create(null, notificationOpt);
}

///////////
// Chrome listeners
chrome.runtime.onInstalled.addListener(showPreviousVersion);

chrome.tabs.onUpdated.addListener(checkContext);

chrome.pageAction.onClicked.addListener(handleUserClick);

chrome.runtime.onMessage.addListener(handleContextscriptResponse);

console.log(chrome.i18n.getMessage('extensionLoaded', chrome.i18n.getMessage('appName')));

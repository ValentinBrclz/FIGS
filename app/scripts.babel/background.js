'use strict';

/**
 * Options for the notification
 * @type {{type: string, title: string, message: string, iconUrl: string}}
 */
var notificationOpt = {
	type: 'basic',
	title: chrome.i18n.getMessage('appName') + ' - ' + chrome.i18n.getMessage('success'),
	message: chrome.i18n.getMessage('successPositionNotification'),
	iconUrl: 'images/icon-128.png'
};

/**
 * Show the previous loaded version in the console
 * @param details
 */
function showPreviousVersion(details) {
	console.log(chrome.i18n.getMessage('previousVersion', chrome.i18n.getMessage('appName')),
		details.previousVersion);
}

/**
 * Check that the actual context is a Google website
 * @param tabId
 * @param changeInfo
 * @param tab
 */
function checkContext(tabId, changeInfo, tab) {
	if (tab.url && tab.url.indexOf('https://www.google.') == 0) {
		chrome.pageAction.show(tabId);
	}
}

/**
 * Fire the script when the button is clicked
 * @param tab - The current tab
 */
function handleUserClick(tab) {
	if (tab.incognito) {
		// Go to the 100 result page
		chrome.tabs.update(tab.id, {url: tab.url + '&num=100'});

		// Wait for load completion
		chrome.tabs.onUpdated.addListener(executeContentScript);
	} else {
		if(confirm(chrome.i18n.getMessage('errorNotInIncognito'))) {
			chrome.windows.create({url: tab.url, incognito: true});
		}
	}
}

/**
 * Execute the script in content
 * @param {int} tabId - The actual tab id
 * @param {object} info - Information about the current tab
 */
function executeContentScript(tabId, info) {
	if (info.status == 'complete') {
		// Message contentscript
		chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
			chrome.tabs.executeScript(tabs[0].id, {file: 'scripts/contentscript.js'});
		});

		// Remove listener
		chrome.tabs.onUpdated.removeListener(executeContentScript);
	}
}

/**
 * Copy the position in clipboard
 * @param {int} position - The position to copy
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

/**
 * Get the response from the content script and handles it
 * @param request
 * @param sender
 * @param sendResponse
 */
function handleContentScriptResponse(request, sender, sendResponse) {
	// Copy into clipboard
	copy(request.position);

	// Notify
	chrome.notifications.create(null, notificationOpt);
}

/////////////////////////////////
// Chrome listeners
chrome.runtime.onInstalled.addListener(showPreviousVersion);

chrome.tabs.onUpdated.addListener(checkContext);

chrome.pageAction.onClicked.addListener(handleUserClick);

chrome.runtime.onMessage.addListener(handleContentScriptResponse);

console.log(chrome.i18n.getMessage('extensionLoaded', chrome.i18n.getMessage('appName')));

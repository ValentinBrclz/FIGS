'use strict';

var notificationOpt = {
	success: {
		type: 'basic',
		title: chrome.i18n.getMessage('appName') + ' - ' + chrome.i18n.getMessage('success'),
		message: chrome.i18n.getMessage('successPositionNotification'),
		iconUrl: 'images/icon-38.png'
	},
	failure: {
		type: 'basic',
		title: chrome.i18n.getMessage('appName') + ' - ' + chrome.i18n.getMessage('error'),
		message: chrome.i18n.getMessage('errorPositionNotification'),
		iconUrl: 'images/icon-38.png'
	}
};


console.log('\'Allo \'Allo! Content script');

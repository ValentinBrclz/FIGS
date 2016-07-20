'use strict';

// Saves options to chrome.storage
function save_options() {
	var domain = document.getElementById('domain').value;
	chrome.storage.sync.set({domain: domain}, function() {

		// Update status to let user know options were saved.
		var status = document.getElementById('status');
		var saveBtn = document.getElementById('save');

		status.textContent = chrome.i18n.getMessage('successSavingOptions');
		saveBtn.disabled = true;

		setTimeout(function() {
			status.textContent = ' ';
			saveBtn.disabled = false;
		}, 1000);
	});
}

// Restores state using the preferences stored in chrome.storage.
function restore_options() {
	chrome.storage.sync.get({domain: 'default.com'}, function(item) {
		document.getElementById('domain').value = item.domain;
	});
}

// Listeners
document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('save').addEventListener('click', save_options);

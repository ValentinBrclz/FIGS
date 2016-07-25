/*
 * FIGS - Find In Google Serp
 *
 * Easy to use chrome extension to get the position of a website in Google Results
 * Copyright (C) 2016 Valentin Berclaz <http://www.valentinberclaz.com/>
 *
 * This program is free software; you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation; version 2 of the License.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License along
 * with this program; if not, write to the Free Software Foundation, Inc.,
 * 51 Franklin Street, Fifth Floor, Boston, MA 02110-1301 USA.
 */
'use strict';

/**
 * Save the options
 */
function saveOptions() {
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

/**
 * Get and display the options
 */
function restoreOptions() {
	chrome.storage.sync.get('domain', function(item) {
		document.getElementById('domain').value = item.domain;
	});
}


/**
 * Chrome listeners
 */
document.addEventListener('DOMContentLoaded', restoreOptions);
document.getElementById('save').addEventListener('click', saveOptions);

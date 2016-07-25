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
 * Parse the HTML and count at which position the domain is or return 101
 * @param {string} domain - The domain to search
 * @returns {number} - The position of the domain
 */
function getPositionOfDomain(domain) {
	var count = 1;

	var anchors = document.querySelectorAll('#res h3 > a');

	for (var i = 0, len = anchors.length; i < len; i++) {
		var url = anchors[i].href;
		if(url.indexOf(domain) != -1) {

			return count;
		}
		count++;
	}

	return 101;
}

/**
 * Main
 */
chrome.storage.sync.get('domain', function(item) {
	var domain = item.domain;

	if (domain && domain.length !== 0) {
		// Parse the HTML and give the results back to background
		chrome.runtime.sendMessage({position: getPositionOfDomain(domain)});
	} else {
		window.alert(chrome.i18n.getMessage('errorDomainNotSet'));
	}
});

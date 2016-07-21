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

/////////////////////////////////
// Main
chrome.storage.sync.get('domain', function(item) {
	var domain = item.domain;

	if (domain && domain.length != 0) {
		// Parse the HTML and give the results back to background
		chrome.runtime.sendMessage({position: getPositionOfDomain(domain)});
	} else {
		alert(chrome.i18n.getMessage('errorDomainNotSet'));
	}
});

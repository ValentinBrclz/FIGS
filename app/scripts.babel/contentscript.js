'use strict';

// Functions
function parseHTML(domain) {
	var count = 1;

	var anchors = document.querySelectorAll('#res h3 > a');
	console.log(anchors);
	for (var i = 0, len = anchors.length; i < len; i++) {
		var url = anchors[i].href;
		if(url.indexOf(domain) != -1) {
			return count;
		}
		count++;
	}
	return 101;
}

// Get the domain from the config
chrome.storage.sync.get('domain', function(item) {
	var domain = item.domain;

	if (domain && domain.length != 0) {
		// Parse the HTML and give the results back to background
		chrome.runtime.sendMessage({position: parseHTML(domain)});
	} else {
		alert(chrome.i18n.getMessage('errorDomainNotSet'));
	}
});

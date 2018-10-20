"use strict";

/* compatibility with all browsers
 * see https://www.smashingmagazine.com/2017/04/browser-extension-edge-chrome-firefox-opera-brave-vivaldi/
 */
window.browser = (function () {
	return window.msBrowser ||
		window.browser ||
		window.chrome;
})();

/* debug function
 * just debug prefixed with name of the script
 */
window.debug = function () {
    var args = ["background.js"];
    for (var i=0; i<arguments.length; i++) { args.push(arguments[i]); }
    console.log.apply(console, args);
};

var port = browser.runtime.connect({name:"port-from-contentscript"});
port.onMessage.addListener(handleIncomingMessage);
port.postMessage({greeting: "hello from content script script"});

function handleIncomingMessage(msg) {
	debug("Received message",msg);
}


function WAYFBeGone(idpEntityid) {
	debug("WAYF Be Gone!");
	debug("IdP is");
	debug(idpEntityid);
	if (idpEntityid && idpEntityid!==null) {
		debug("Selecting IdP "+idpEntityid+" in WAYF");
		/* the first (and only) form in the page is used to select the IdP
		 * The entityid of the IdP is entered in the element
		 *   <input type="hidden" id="form-idp" name="idp" value=""/>
		 * after which the form is submitted
		 */
		var idp_form = document.forms[0];
		//idp_form.elements[1].value = idp;
		idp_form.idp.value = idpEntityid;
		idp_form.submit();
	}
}

function fetchIdP() {
	debug("Fetching Idp");
	browser.storage.local.get(['idp'], function(result) { WAYFBeGone(result.idp.entityid) } );
}

if (document.readyState === "loading") {
	debug("Still loading");
	document.addEventListener("DOMContentLoaded",fetchIdP);
} else {  // `DOMContentLoaded` already fired
	fetchIdP();
}

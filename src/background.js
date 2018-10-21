"use strict";

/* compatibility with all browsers
 * see https://www.smashingmagazine.com/2017/04/browser-extension-edge-chrome-firefox-opera-brave-vivaldi/
 */
window.browser = (function () {
	return window.msBrowser || window.browser || window.chrome;
})();

/* debug function
 * just console.log prefixed with name of the script
 */
window.debug = function () {
	var args = ["background.js"];
	for (var i=0; i<arguments.length; i++) { args.push(arguments[i]); }
	console.log.apply(console, args);
};


debug("background-script: LOAD");

/* store connections to other parts of the extension */
var ports = {};

/* set up listener for new port (aka connection) */
browser.runtime.onConnect.addListener(function (port) {
	/* uuid generation, from https://stackoverflow.com/questions/105034/create-guid-uuid-in-javascript */
	function uuid() {
		return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
			(c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
		)
	}

	/* store a uuid to use as a dict key for storing the port
	 * (and to be able to easily remove it in handleDisconnect()
	 */
	port.uuid = uuid();
	ports[port.uuid] = port
	debug("Received connect from ", port, "Total clients: ", Object.keys(ports).length);
	port.onMessage.addListener(function (msg) { handleIncomingMessage(port,msg) });
	port.onDisconnect.addListener(handleDisconnect);
});

/* handle port disconnect */
function handleDisconnect(port) {
	debug("Received disconnect from ", port, " Clients left: ", Object.keys(ports).length);
	port.onMessage.removeListener(handleIncomingMessage);
	delete ports[port.uuid];
}

/* handle incoming messages
 * messages are defined by their "type"-field.
 *   type=ping       ping from script, no action required
 *   type=helo       initial hello on connect
 *     msg           message to display in console
 *   type=listidps   request a list of all known IdPs
 *     no arguments
 *   type=getidp     request the currently preferred IdP
 *     no arguments
 *   type=returnidp  returns the currently preferred IdP, as requested by getidp
 *     argument idp={entityid,name,logo_uri}
 *   type=setidp     set a new preferred IdP
 *     argument idp={entityid,name,logo_uri}
 *   type=resetidp   unset the preferred IdP (aka disable plugin)
 */
function handleIncomingMessage(port,msg) {
	debug("Received message",msg,"from port",port);
}

/* send a message to all connected "clients" */
function broadcastMessage(msg) {
	for (var id in ports) {
		var p = ports[id]
		debug("Broadcasting to ",id);
		p.postMessage(msg);
	}
}

/* send regular pings to all connected scripts */
setInterval(
	function() { broadcastMessage({type: "PING"}) },
	2000
);

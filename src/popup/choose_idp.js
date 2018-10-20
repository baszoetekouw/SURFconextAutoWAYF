/* compatibility with all browsers
 * see https://www.smashingmagazine.com/2017/04/browser-extension-edge-chrome-firefox-opera-brave-vivaldi/
 */
window.browser = (function () {
	return window.msBrowser ||
		window.browser ||
		window.chrome;
})();

window.debug = function () {
	var args = ["choose_idp:"];
	for(var i=0; i<arguments.length; i++) { args.push(arguments[i]); }
	console.log.apply(console, args);
};


const metadata_source1 = "https://engine.surfconext.nl/authentication/proxy/idps-metadata";
const metadata_source2 = "https://engine.surfconext.nl/authentication/proxy/idps-metadata?sp-entity-id=https://profile.surfconext.nl/authentication/metadata";

function createIdpList(idps) {
	html="";
	for (i=0; i<idps.length; i++) {
		debug(idps[i]);
		html += `<button type="button" class="button idp" value="${idps[i].entityid}" name="${idps[i].name}">`;
		html += `<span class="logo-wrapper"><img class="logo" src="${idps[i].logo}"/></span>`;
		html += `${idps[i].name}`;
		html += `</button>\n`;
	}
	debug("Setting html to "+html);
	document.querySelector('#idps').innerHTML = html;
}

function storeSettings(settings) {
	debug("Storing settings");
	debug(settings);
	browser.storage.local.set(settings);
}

function showDefault(idp)
{
	debug("Default is: ");
	debug(idp);
	if (idp && ('name' in idp)) {
		debug("setting idp to '"+idp.name+"'");
		var idpName = idp.name;
	} else {
		debug("setting idp to disabled");
		var idpName = "<disabled>";
	}
	document.querySelector("#default").innerText = idpName;
}

function fetchDefault()
{
	browser.storage.local.get(['idp'], function(result) { showDefault(result.idp); });
}

function selectIdp(idp_entityid,idp_name) {
	idp = { name: idp_name, entityid: idp_entityid };
	debug("CS: Selected IdP "+idp);
	storeSettings({ idp: idp });
}

function resetIdp() {
	debug("CS: Selected reset");
	storeSettings({ idp: null });
}

/**
 * Listen for clicks on the buttons, and send the appropriate message to
 * the content script in the page.
 */
function listenForClicks()
{
	document.addEventListener("click", (e) => {
		if (e.target.classList.contains("idp")) {
			selectIdp(e.target.value,e.target.name);
		}
		else if (e.target.id=="reset_idp") {
			resetIdp();
		}
	});
}

function listenForDefaultChange()
{
	browser.storage.onChanged.addListener( (e) => {
		debug("Storage changed");
		debug(e);
		if ('idp' in e)
		{
			idp = e.idp.newValue;
			debug("Default IdP changed to "+idp);
			showDefault(idp);
		}
	});
}


var idp_list = [
	{ name: "SURFnet bv", entityid: "https://idp.surfnet.nl", logo: "https://static.surfconext.nl/logos/idp/surfnet.png" },
	{ name: "Universitair Medisch Centrum Utrecht", entityid: "http://fs.umcutrecht.nl/adfs/services/trust", logo: "https://static.surfconext.nl/logos/idp/UMC-Utrecht_logo.png" },
	{ name: "Hogeschool van Amsterdam", entityid: "http://adfs20.hva.nl/adfs/services/trust", logo: "https:///static.surfconext.nl/logos/idp/hva.jpg" },
	//{ name: "", entityid: "", logo: "" },
];

createIdpList(idp_list);
fetchDefault();
listenForClicks();
listenForDefaultChange();

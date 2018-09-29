
function storeSettings(settings) {
	console.log("Storing settings");
	console.log(settings);
	browser.storage.local.set(settings);
}

function showDefault(idp)
{
	console.log("Default is: "+idp);
	if (idp==null) {
		var idpName = "<disabled>";
	} else {
		var idpName = idp;
	}
	document.querySelector("#default").innerText = idpName;
}

function fetchDefault()
{
	browser.storage.local.get({idp:''})
		.then(({idp}) => showDefault(idp));
}

function selectIdp(idp) {
	console.log("CS: Selected IdP "+idp);
	storeSettings({ idp: idp });
}

function resetIdp() {
	console.log("CS: Selected reset");
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
			selectIdp(e.target.innerText);
		}
		else if (e.target.classList.contains("reset")) {
			resetIdp();
		}
	});
}

function listenForDefaultChange()
{
	browser.storage.onChanged.addListener( (e) => {
		console.log("Storage changed");
		console.log(e);
		if ('idp' in e)
		{
			idp = e.idp.newValue;
			console.log("Default IdP changed to "+idp);
			showDefault(idp);
		}
	});
}

fetchDefault();
listenForClicks();
listenForDefaultChange();

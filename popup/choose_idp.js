
function storeSettings(settings) {
	console.log("Storing settings");
	console.log(settings);
	browser.storage.local.set(settings);
}

function setDefault(idp)
{
	console.log("Default is: "+idp);
	document.querySelector("#default").innerText = idp;
}

function initDefault()
{
	browser.storage.local.get({idp:''})
		.then(({idp}) => setDefault(idp));
}

/**
 * Listen for clicks on the buttons, and send the appropriate message to
 * the content script in the page.
 */
function listenForClicks()
{
	document.addEventListener("click", (e) => {

		function selected_idp(idp) {
			console.log("CS: Selected IdP "+idp);
			storeSettings({ idp: idp });
			//notifyBackgroundPage({type: "select_idp", idp: idp});
		}

		function reset_idp() {
			console.log("CS: Selected reset");
			notifyBackgroundPage({type: "reset"});
		}

		if (e.target.classList.contains("idp")) {
			selected_idp(e.target.innerText);
		}
		else if (e.target.classList.contains("reset")) {
			reset_idp();
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
			setDefault(idp);
		}
	});
}

initDefault();
listenForClicks();
listenForDefaultChange();

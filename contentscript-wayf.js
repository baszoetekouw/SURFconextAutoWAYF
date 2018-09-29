function WAYFBeGone(idp) {
	console.log("WAYF Be Gone!");
	console.log("IdP is");
	console.log(idp);
	if (idp && idp!=null) {
		console.log("Selecting IdP "+idp+" in WAYF");
		/* the first (and only) form in the page is used to select the IdP
		 * The entityid of the IdP is entered in the element
		 *   <input type="hidden" id="form-idp" name="idp" value=""/>
		 * after which the form is submitted
		 */
		idp_form = document.forms[0];
		//idp_form.elements[1].value = idp;
		idp_form.idp.value = idp;
		idp_form.submit();
	}
}

function fetchIdP() {
	console.log("Fetching Idp");
	browser.storage.local.get({idp:''})
		.then(({idp}) => WAYFBeGone(idp.entityid));
}

if (document.readyState === "loading") {
	console.log("Still loading");
	document.addEventListener("DOMContentLoaded",fetchIdP);
} else {  // `DOMContentLoaded` already fired
	fetchIdP();
}

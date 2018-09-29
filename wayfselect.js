function wayf_be_gone() {

	//const my_idp = 'https://idp.surfnet.nl';
	var my_idp browser.storage.sync.get("idp");
	idp_form = document.forms[0];
	idp_form.elements[1].value = my_idp;
	idp_form.submit();

}

if (document.readyState === "loading") {
	document.addEventListener("DOMContentLoaded",wayf_be_gone);
} else {  // `DOMContentLoaded` already fired
	wayf_be_gone();
}

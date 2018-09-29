function handleMessage(message, sender, sendResponse) {
	console.log("Message from the content script: ");
	console.log(message);
	if (message.type=="select_idp")
	{
		browser.storage.local.set({idp: message.idp})
			.then(() => browser.storage.local.get({idp:''}))
			.then(({idp}) => console.log("Received from storage:"+idp));
	}
	sendResponse({response: "Response from background script"});
}

browser.runtime.onMessage.addListener(handleMessage);

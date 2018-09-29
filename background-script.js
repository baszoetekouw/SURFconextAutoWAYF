function handleMessage(message, sender, sendResponse) {
	console.log("Message from the content script: ");
	console.log(message);
	sendResponse({response: "Response from background script"});
}

browser.runtime.onMessage.addListener(handleMessage);

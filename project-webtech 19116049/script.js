function error(input) {
	alert("Missing field: " + input.id)
	return false;
}

function requireValue(input) {
	return input.value.trim() === '' ?
		error(input) :
		true;
}

function onRefresh() {
	xhttp.open("GET", "http://localhost:5000/" + document.title, true);
	xhttp.send();
}

function onMessage(event) {
	var state;
	if (event.data == "1") {
		alert("SUCCESS");
	}
	else {
		alert("Error : " + event.data);
	}

}

function onload() {
	xhttp = new XMLHttpRequest();
	const forms = document.querySelectorAll('form');
	const form = forms[0];
	console.log(document.location);
	Socket = new WebSocket('ws://localhost:5000/api');

	Socket.onmessage = onMessage;

	if ("refresh" in form.elements) {
		xhttp.onreadystatechange = function () {
			if (this.readyState == 4 && this.status == 200) {
				var jsonResponse = JSON.parse(this.responseText);

				for (var key in jsonResponse) {
					console.log(key + " : " + jsonResponse[key]);
					console.log(form.elements);

					if (form.elements[key].type == "checkbox") {
						console.log("here ---> " + form.elements[key]);
						form.elements[key].checked = jsonResponse[key];
					}
					else {
						form.elements[key].value = jsonResponse[key];
					}

				}

			}
			else {
				console.log('this');
			}
		};
		xhttp.open("GET", "http://localhost:5000/" + document.title, true);
		xhttp.send();
	}

	form.addEventListener('submit', (event) => {
		let retValue = true;
		var msg = {};
		var whichBtn = event.submitter.id;

		if (whichBtn != "refresh") {
			msg["msg_type"] = form.id;
			Array.from(form.elements).forEach((input) => {
				if (input.type != "submit" && input.type != "button") {
					if (input.type == "checkbox") {
						msg[input.id] = input.checked;
					}
					else if (requireValue(input) == false) {
						retValue = false;
					}
					else {
						msg[input.id] = input.value;
					}
				}
			});

			if (retValue) {
				console.log("send websocket message")
				Socket.send(JSON.stringify(msg));
				console.log(JSON.stringify(msg, 4, null));
			}
			else {
				console.log(32);
			}
		}
		else {
			console.log("update fields " + whichBtn);
		}
	});

	return true;
}
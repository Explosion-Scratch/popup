let styles = `#popup,#popup *{box-sizing:border-box}#popup :focus{outline:0}#popup-bg{z-index:99;background:#0002;backdrop-filter:blur(10px);position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);width:100vw;height:100vh;padding:0;margin:0}#popup{z-index:100;animation-name:slide-in;animation-duration:.3s;animation-direction:forwards;transition:all .3s ease;position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);background:#fff;padding:20px;border-radius:5px;box-shadow:2px 2px 4px #0002;width:50vw;min-width:250px;max-width:300px}#popup input{transition:border-color .3s ease,box-shadow .3s ease;border:1px solid #d3d3d3;margin:0 auto}#popup input[type=text]{display:block;width:100%;padding:10px;border-radius:5px}#popup input:focus{box-shadow:0 0 0 5px #0001}#popup button:focus{box-shadow:0 0 0 5px #17a2b733}#popup button{cursor:pointer;transition:background-color .3s ease,box-shadow .3s ease,opacity .3s ease;background:#17a2b7;color:#fff;border:none;padding:8px;margin-top:10px;border-radius:5px}#popup-text{max-height:150px;overflow-y:scroll}#popup button:hover{background:#0e97ac}#popup button:disabled{opacity:.5;cursor:not-allowed}button#popup-cancel{background:0 0;color:#333;border:1px solid #d3d3d3;margin-left:5px}button#popup-cancel:hover{color:#000;background:0 0}#popup-title{margin:0}.popup-closed{opacity:0;top:0;transform:translate(-50%,50%)}@keyframes slide-in{0%{opacity:0;top:0;transform:translate(-50%,50%)}100%{opacity:1;top:50%;transform:translate(-50%,-50%)}}`;
var style = document.createElement("STYLE");
style.innerHTML = styles;
document.body.appendChild(style);
// -----------------------------
// OPTIONS
// -----------------------------

// Options format:
// prompt({optiontext: "value here"}, (val) => { console.log(val) })

// Special values
// In inputtest and returnval you can use these functions:
//   - inputval(): gets the value of the prompt's input
//   - inputel(): the input element
//   - popup: a variable that represents the DOM element of the whole popup

// Options:
//   - input: the html string for the input.
//   - title: the heading (a h3)
//   - text: normal size text under title
//   - inputtest: the string of code to run to test the input (uses eval())
//   - buttontext: the text of the submit button
//   - returnval: the string of code to run to return stuff from the input
function alert(options = "", callback = () => {}) {
	var background = document.createElement("div");
	background.id = "popup-bg";
	document.documentElement.appendChild(background);
	try {
		document.getElementById("popup").remove();
	} catch (err) {}
	document.body.classList.add("blur");
	var popup = document.createElement("DIV");
	popup.id = "popup";
	popup.innerHTML = `<h4 id="popup-title">${
		typeof options === "string" ? options : options.title || ""
	}</h4>
    <p id="popup-text">
      ${options.text || ""}
    </p>
    <button id="popup-close">${options.buttontext || "Okay"}</button>`;
	document.documentElement.appendChild(popup);
	popup.querySelector("button").focus();

	return new Promise((resolve, reject) => {
		document.getElementById("popup-close").onclick = () => {
			try {
				popup.classList.add("popup-closed");
				background.remove();
				resolve();
				callback();
				setTimeout(() => {
					popup.remove();
				}, 400);
			} catch (err) {
				popup.classList.add("popup-closed");
				background.remove();
				reject(err);
			}
		};
		var keyup = window.addEventListener("keydown", (e) => {
			if (
				e.key === "Escape" &&
				(options.cancelbutton === undefined || options.cancelbutton === true)
			) {
				popup.classList.add("popup-closed");
				background.remove();
				reject();
				window.removeEventListener("keydown", keyup);
			}
		});
	});
}
function prompt(
	options = "",
	callback = (val) => {
		console.log(val);
	},
	cancel = () => {
		console.log("Canceled");
	},
) {
	var background = document.createElement("div");
	background.id = "popup-bg";
	document.documentElement.appendChild(background);
	try {
		document.getElementById("popup").remove();
	} catch (err) {}
	document.body.classList.add("blur");
	var popup = document.createElement("DIV");
	popup.id = "popup";
	popup.innerHTML = `<h3 id="popup-title">${options.title || ""}</h3>
    <p id="popup-text">
      ${typeof options === "string" ? options : options.text || ""}
    </p>
    ${options.input || '<input type="text">'}
    <button id="popup-close">${options.buttontext || "Submit"}</button>`;
	if (options.cancelbutton !== undefined) {
		if (options.cancelbutton) {
			popup.innerHTML += `<button id="popup-cancel">${
				options.canceltext || "Cancel"
			}</button>`;
		}
	} else {
		popup.innerHTML += `<button id="popup-cancel">${
			options.canceltext || "Cancel"
		}</button>`;
	}

	document.documentElement.appendChild(popup);
	inputel().focus();
	inputel().onkeyup = (e) => {
		if (e.which === 13) {
			popup.querySelector("#popup-close").click();
		}
		if (e.key === "Escape") {
			popup.querySelector("#popup-cancel").click();
		}
	};
	setInterval(() => {
		disablebutton();
	}, 10);
	function disablebutton() {
		var condition;
		if (options.inputtest) {
			condition = eval(options.inputtest);
		} else {
			condition = inputval().length > 0;
		}
		if (!condition) {
			popup.querySelector("#popup-close").disabled = true;
		} else {
			popup.querySelector("#popup-close").disabled = false;
		}
	}
	return new Promise((resolve, reject) => {
		document.getElementById("popup-close").onclick = () => {
			try {
				popup.classList.add("popup-closed");
				background.remove();
				callback(eval(options.returnval) || inputval());
				resolve(eval(options.returnval) || inputval());
				setTimeout(() => {
					popup.remove();
				}, 1000);
			} catch (err) {}
		};
		document.getElementById("popup-cancel").onclick = () => {
			try {
				popup.classList.add("popup-closed");
				cancel();
				reject();
				background.remove();
				setTimeout(() => {
					popup.remove();
				}, 1000);
			} catch (err) {}
		};
		document.getElementById("popup-bg").onclick = () => {
			if (options.backgroundclick !== undefined) {
				if (options.backgroundclick) {
					popup.classList.add("popup-closed");
					cancel();
					reject();
					background.remove();
					setTimeout(() => {
						popup.remove();
					}, 1000);
				}
			}
		};
	});

	function inputval() {
		if (popup.querySelector("input")) {
			return popup.querySelector("input").value;
		} else if (popup.querySelector("select")) {
			return popup.querySelector("select").value;
		} else {
			return "";
		}
	}
	function inputel() {
		if (popup.querySelector("input")) {
			return popup.querySelector("input");
		} else if (popup.querySelector("select")) {
			return popup.querySelector("select");
		} else {
			return undefined;
		}
	}
}

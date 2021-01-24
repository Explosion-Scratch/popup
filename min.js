let styles =
	"#popup,#popup *{box-sizing:border-box}#popup :focus{outline:0}#popup-bg{z-index:99;background:#0002;backdrop-filter:blur(10px);position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);width:100vw;height:100vh;padding:0;margin:0}#popup{z-index:100;animation-name:slide-in;animation-duration:.3s;animation-direction:forwards;transition:all .3s ease;position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);background:#fff;padding:20px;border-radius:5px;box-shadow:2px 2px 4px #0002;width:50vw;min-width:250px;max-width:300px}#popup input{transition:border-color .3s ease,box-shadow .3s ease;border:1px solid #d3d3d3;margin:0 auto}#popup input[type=text]{display:block;width:100%;padding:10px;border-radius:5px}#popup input:focus{box-shadow:0 0 0 5px #0001}#popup button:focus{box-shadow:0 0 0 5px #17a2b733}#popup button{cursor:pointer;transition:background-color .3s ease,box-shadow .3s ease,opacity .3s ease;background:#17a2b7;color:#fff;border:none;padding:8px;margin-top:10px;border-radius:5px}#popup-text{max-height:150px;overflow-y:scroll}#popup button:hover{background:#0e97ac}#popup button:disabled{opacity:.5;cursor:not-allowed}button#popup-cancel{background:0 0;color:#333;border:1px solid #d3d3d3;margin-left:5px}button#popup-cancel:hover{color:#000;background:0 0}#popup-title{margin:0}.popup-closed{opacity:0;top:0;transform:translate(-50%,50%)}@keyframes slide-in{0%{opacity:0;top:0;transform:translate(-50%,50%)}100%{opacity:1;top:50%;transform:translate(-50%,-50%)}}";
function alert(o = "", e = () => {}) {
	var p = document.createElement("div");
	(p.id = "popup-bg"), document.documentElement.appendChild(p);
	try {
		document.getElementById("popup").remove();
	} catch (o) {}
	document.body.classList.add("blur");
	var t = document.createElement("DIV");
	return (
		(t.id = "popup"),
		(t.innerHTML = `<h4 id="popup-title">${
			"string" == typeof o ? o : o.title || ""
		}</h4>\n    <p id="popup-text">\n      ${
			o.text || ""
		}\n    </p>\n    <button id="popup-close">${
			o.buttontext || "Okay"
		}</button>`),
		document.documentElement.appendChild(t),
		t.querySelector("button").focus(),
		new Promise((n, u) => {
			document.getElementById("popup-close").onclick = () => {
				try {
					t.classList.add("popup-closed"),
						p.remove(),
						n(),
						e(),
						setTimeout(() => {
							t.remove();
						}, 400);
				} catch (o) {
					t.classList.add("popup-closed"), p.remove(), u(o);
				}
			};
			var c = window.addEventListener("keydown", (e) => {
				"Escape" !== e.key ||
					(void 0 !== o.cancelbutton && !0 !== o.cancelbutton) ||
					(t.classList.add("popup-closed"),
					p.remove(),
					u(),
					window.removeEventListener("keydown", c));
			});
		})
	);
}
function prompt(
	options = "",
	callback = (o) => {
		console.log(o);
	},
	cancel = () => {
		console.log("Canceled");
	},
) {
	var background = document.createElement("div");
	(background.id = "popup-bg"),
		document.documentElement.appendChild(background);
	try {
		document.getElementById("popup").remove();
	} catch (o) {}
	document.body.classList.add("blur");
	var popup = document.createElement("DIV");
	function disablebutton() {
		var condition;
		(condition = options.inputtest
			? eval(options.inputtest)
			: inputval().length > 0),
			(popup.querySelector("#popup-close").disabled = !condition);
	}
	return (
		(popup.id = "popup"),
		(popup.innerHTML = `<h3 id="popup-title">${
			options.title || ""
		}</h3>\n    <p id="popup-text">\n      ${
			"string" == typeof options ? options : options.text || ""
		}\n    </p>\n    ${
			options.input || '<input type="text">'
		}\n    <button id="popup-close">${
			options.buttontext || "Submit"
		}</button>`),
		void 0 !== options.cancelbutton
			? options.cancelbutton &&
			  (popup.innerHTML += `<button id="popup-cancel">${
					options.canceltext || "Cancel"
			  }</button>`)
			: (popup.innerHTML += `<button id="popup-cancel">${
					options.canceltext || "Cancel"
			  }</button>`),
		document.documentElement.appendChild(popup),
		inputel().focus(),
		(inputel().onkeyup = (o) => {
			13 === o.which && popup.querySelector("#popup-close").click(),
				"Escape" === o.key && popup.querySelector("#popup-cancel").click();
		}),
		setInterval(() => {
			disablebutton();
		}, 10),
		new Promise((resolve, reject) => {
			(document.getElementById("popup-close").onclick = () => {
				try {
					popup.classList.add("popup-closed"),
						background.remove(),
						callback(eval(options.returnval) || inputval()),
						resolve(eval(options.returnval) || inputval()),
						setTimeout(() => {
							popup.remove();
						}, 1e3);
				} catch (o) {}
			}),
				(document.getElementById("popup-cancel").onclick = () => {
					try {
						popup.classList.add("popup-closed"),
							cancel(),
							reject(),
							background.remove(),
							setTimeout(() => {
								popup.remove();
							}, 1e3);
					} catch (o) {}
				}),
				(document.getElementById("popup-bg").onclick = () => {
					void 0 !== options.backgroundclick &&
						options.backgroundclick &&
						(popup.classList.add("popup-closed"),
						cancel(),
						reject(),
						background.remove(),
						setTimeout(() => {
							popup.remove();
						}, 1e3));
				});
		})
	);
	function inputval() {
		return popup.querySelector("input")
			? popup.querySelector("input").value
			: popup.querySelector("select")
			? popup.querySelector("select").value
			: "";
	}
	function inputel() {
		return popup.querySelector("input")
			? popup.querySelector("input")
			: popup.querySelector("select")
			? popup.querySelector("select")
			: void 0;
	}
}
document.body.appendChild(
	(() => {
		var o = document.createElement("STYLE");
		return (o.innerHTML = styles), o;
	})(),
);

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
function alert(options = '', callback = () => {}) {
  const background = document.createElement('div');
  background.id = 'popup-bg';
  document.documentElement.appendChild(background);
  try {
    document.getElementById('popup').remove();
  } catch (err) {}
  document.body.classList.add('blur');
  const popup = document.createElement('DIV');
  popup.id = 'popup';
  popup.innerHTML = `<h4 id="popup-title">${
    typeof options === 'string' ? options : options.title || ''
  }</h4>
    <p id="popup-text">
      ${options.text || ''}
    </p>
    <button id="popup-close">${options.buttontext || 'Okay'}</button>`;
  document.documentElement.appendChild(popup);
  popup.querySelector('button').focus();

  return new Promise((resolve, reject) => {
    document.getElementById('popup-close').onclick = () => {
      try {
        popup.classList.add('popup-closed');
        background.remove();
        resolve();
        callback();
        setTimeout(() => {
          popup.remove();
        }, 400);
      } catch (err) {
        popup.classList.add('popup-closed');
        background.remove();
        reject(err);
      }
    };
    var keyup = window.addEventListener('keydown', (e) => {
      if (
        e.key === 'Escape'
        && (options.cancelbutton === undefined || options.cancelbutton === true)
      ) {
        popup.classList.add('popup-closed');
        background.remove();
        reject();
        window.removeEventListener('keydown', keyup);
      }
    });
  });
}
function prompt(
  options = '',
  callback = (val) => {
    console.log(val);
  },
  cancel = () => {
    console.log('Canceled');
  },
) {
  const background = document.createElement('div');
  background.id = 'popup-bg';
  document.documentElement.appendChild(background);
  try {
    document.getElementById('popup').remove();
  } catch (err) {}
  document.body.classList.add('blur');
  const popup = document.createElement('DIV');
  popup.id = 'popup';
  popup.innerHTML = `<h3 id="popup-title">${options.title || ''}</h3>
    <p id="popup-text">
      ${typeof options === 'string' ? options : options.text || ''}
    </p>
    ${options.input || '<input type="text">'}
    <button id="popup-close">${options.buttontext || 'Submit'}</button>`;
  if (options.cancelbutton !== undefined) {
    if (options.cancelbutton) {
      popup.innerHTML += `<button id="popup-cancel">${
        options.canceltext || 'Cancel'
      }</button>`;
    }
  } else {
    popup.innerHTML += `<button id="popup-cancel">${
      options.canceltext || 'Cancel'
    }</button>`;
  }

  document.documentElement.appendChild(popup);
  inputel().focus();
  inputel().onkeyup = (e) => {
    if (e.which === 13) {
      popup.querySelector('#popup-close').click();
    }
    if (e.key === 'Escape') {
      popup.querySelector('#popup-cancel').click();
    }
  };
  setInterval(() => {
    disablebutton();
  }, 10);
  function disablebutton() {
    let condition;
    if (options.inputtest) {
      condition = eval(options.inputtest);
    } else {
      condition = inputval().length > 0;
    }
    if (!condition) {
      popup.querySelector('#popup-close').disabled = true;
    } else {
      popup.querySelector('#popup-close').disabled = false;
    }
  }
  return new Promise((resolve, reject) => {
    document.getElementById('popup-close').onclick = () => {
      try {
        popup.classList.add('popup-closed');
        background.remove();
        callback(eval(options.returnval) || inputval());
        resolve(eval(options.returnval) || inputval());
        setTimeout(() => {
          popup.remove();
        }, 1000);
      } catch (err) {}
    };
    document.getElementById('popup-cancel').onclick = () => {
      try {
        popup.classList.add('popup-closed');
        cancel();
        reject();
        background.remove();
        setTimeout(() => {
          popup.remove();
        }, 1000);
      } catch (err) {}
    };
    document.getElementById('popup-bg').onclick = () => {
      if (options.backgroundclick !== undefined) {
        if (options.backgroundclick) {
          popup.classList.add('popup-closed');
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
    if (popup.querySelector('input')) {
      return popup.querySelector('input').value;
    } if (popup.querySelector('select')) {
      return popup.querySelector('select').value;
    }
    return '';
  }
  function inputel() {
    if (popup.querySelector('input')) {
      return popup.querySelector('input');
    } if (popup.querySelector('select')) {
      return popup.querySelector('select');
    }
    return undefined;
  }
}
function confirm(
  options = '',
  callback = (val) => {
    console.log(val);
  },
  cancel = () => {
    console.log('Canceled');
  },
) {
  const background = document.createElement('div');
  background.id = 'popup-bg';
  document.documentElement.appendChild(background);
  try {
    document.getElementById('popup').remove();
  } catch (err) {}
  document.body.classList.add('blur');
  const popup = document.createElement('DIV');
  popup.id = 'popup';
  popup.innerHTML = `<h3 id="popup-title">${options.title || ''}</h3>
    <p id="popup-text">
      ${typeof options === 'string' ? options : options.text || ''}
    </p>
    <button id="popup-close">${options.buttontext || 'Okay'}</button>`;
  if (options.cancelbutton !== undefined) {
    if (options.cancelbutton) {
      popup.innerHTML += `<button id="popup-cancel">${
        options.canceltext || 'Cancel'
      }</button>`;
    }
  } else {
    popup.innerHTML += `<button id="popup-cancel">${
      options.canceltext || 'Cancel'
    }</button>`;
  }

  document.documentElement.appendChild(popup);

  return new Promise((resolve, reject) => {
    document.getElementById('popup-close').onclick = () => {
      try {
        popup.classList.add('popup-closed');
        background.remove();
        callback(true);
        resolve(true);
        setTimeout(() => {
          popup.remove();
        }, 1000);
      } catch (err) {}
    };
    document.getElementById('popup-cancel').onclick = () => {
      try {
        popup.classList.add('popup-closed');
        callback(false);
        resolve(false);
        background.remove();
        setTimeout(() => {
          popup.remove();
        }, 1000);
      } catch (err) {}
    };
    document.getElementById('popup-bg').onclick = () => {
      if (options.backgroundclick !== undefined) {
        if (options.backgroundclick) {
          popup.classList.add('popup-closed');
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
}

const searchFocus = document.getElementById('search-focus');
const keys = [{
    keyCode: 'AltLeft',
    isTriggered: false
  },
  {
    keyCode: 'ControlLeft',
    isTriggered: false
  },
];
// Searchbar
window.addEventListener('keydown', (e) => {
  keys.forEach((obj) => {
    if (obj.keyCode === e.code) {
      obj.isTriggered = true;
    }
  });

  const shortcutTriggered = keys.filter((obj) => obj.isTriggered).length === keys.length;

  if (shortcutTriggered) {
    searchFocus.focus();
  }
});

window.addEventListener('keyup', (e) => {
  keys.forEach((obj) => {
    if (obj.keyCode === e.code) {
      obj.isTriggered = false;
    }
  });
});

document.getElementById("reg").onclick = function () {
  document.getElementById("pills-register").classList.add("show");
  document.getElementById("pills-register").classList.add("active");
  document.getElementById("pills-login").classList.remove("show");
  document.getElementById("pills-login").classList.remove("active");
  document.getElementById("tab-login").classList.remove("active");
  document.getElementById("tab-register").classList.add("active");
}
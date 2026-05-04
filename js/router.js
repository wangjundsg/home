window.currentScreen = null;
var MAIN_SCREENS = ['home', 'daily', 'commitments', 'compensation', 'interact'];
var SUB_SCREENS = ['meeting', 'growth', 'phrases', 'settings'];

window.navigate = function(name) {
  if (window.currentScreen === name) return;
  window.currentScreen = name;

  // Hide all screens
  document.querySelectorAll('.screen').forEach(function(s) { s.classList.remove('active'); });

  // Show target
  var el = document.getElementById('screen-' + name);
  if (!el && SUB_SCREENS.indexOf(name) !== -1) {
    var app = document.getElementById('app');
    el = document.createElement('section');
    el.className = 'screen active';
    el.id = 'screen-' + name;
    app.appendChild(el);
  } else if (el) {
    el.classList.add('active');
  }

  // Update nav
  document.querySelectorAll('.nav-item').forEach(function(item) {
    item.classList.toggle('active', item.dataset.screen === name);
  });

  updateHeader(name);
};

function updateHeader(name) {
  var titleEl = document.querySelector('.app-header-title');
  var leftEl = document.querySelector('.app-header-left');
  var titles = {
    home: '急救贴士', daily: '日常维护', commitments: '承诺墙',
    compensation: '补偿小卖部', interact: '互动', meeting: '见面管理',
    growth: '成长层', phrases: '启动句库', settings: '设置'
  };
  if (titleEl && titles[name]) titleEl.textContent = titles[name];
  if (leftEl) {
    if (SUB_SCREENS.indexOf(name) !== -1) {
      leftEl.innerHTML = '←';
      leftEl.style.visibility = 'visible';
      leftEl.onclick = function() { window.navigate('daily'); };
    } else {
      leftEl.innerHTML = '📋';
      leftEl.style.visibility = 'visible';
      leftEl.onclick = null;
    }
  }
}

var appData = null;

window.getData = function() { return appData; };

window.updateData = function(updates) {
  Object.assign(appData, updates);
  window.R.save(appData);
};

window.refreshData = function() {
  appData = window.R.load();
};

function boot() {
  appData = window.R.load();

  // Header
  var headerLeft = document.querySelector('.app-header-left');
  var headerRight = document.querySelector('.app-header-right');

  headerRight.addEventListener('click', function() {
    renderSubScreen('settings', appData);
    window.navigate('settings');
  });

  headerLeft.addEventListener('click', function() {
    var current = window.currentScreen;
    if (current && ['settings', 'growth', 'phrases', 'meeting'].indexOf(current) !== -1) {
      window.navigate('daily');
      renderMainScreen('daily');
      return;
    }
    showMoreMenu();
  });

  // Bottom nav
  document.querySelectorAll('.nav-item').forEach(function(item) {
    item.addEventListener('click', function() {
      var screen = item.dataset.screen;
      window.navigate(screen);
      renderMainScreen(screen);
    });
  });

  // Service Worker
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js').catch(function() {});
  }

  // Font size
  if (appData.settings && appData.settings.fontSize) {
    document.documentElement.setAttribute('data-font', appData.settings.fontSize);
  }

  // Onboarding or home
  if (!appData.onboardingComplete) {
    showOnboarding();
  } else {
    renderAllMainScreens();
    window.navigate('home');
  }
}

function showMoreMenu() {
  var content = '';
  var items = [
    { target: 'growth', emoji: '🌱', label: '成长层' },
    { target: 'phrases', emoji: '💬', label: '启动句库' },
    { target: 'meeting', emoji: '💑', label: '见面管理' }
  ];
  items.forEach(function(item) {
    content += '<button class="btn btn-outline btn-block more-menu-item" data-target="' + item.target + '" style="justify-content:flex-start;margin-bottom:var(--space-sm)">' + item.emoji + ' ' + item.label + '</button>';
  });
  var modal = window.R.showModal({ title: '📋 更多', content: content });

  modal.sheet.querySelectorAll('.more-menu-item').forEach(function(btn) {
    btn.addEventListener('click', function() {
      var target = btn.dataset.target;
      modal.close();
      renderSubScreen(target, appData);
      window.navigate(target);
    });
  });
}

function showOnboarding() {
  var app = document.getElementById('app');
  app.innerHTML = '<div class="screen active" id="onboarding"><div style="padding:var(--space-2xl) var(--space-lg);text-align:center;"><div style="font-size:4rem;margin-bottom:var(--space-lg)">🏡</div><h1 style="font-size:var(--font-size-3xl);margin-bottom:var(--space-md);color:var(--color-primary)">欢迎来到<br>你们的小花园</h1><p style="color:var(--color-text-soft);margin-bottom:var(--space-2xl);line-height:1.8">这是只属于你们两个人的情感小窝。<br>吵架了来这里找台阶，<br>甜蜜了来这里存回忆，<br>无聊了来这里玩游戏。</p><div class="form-group" style="text-align:left"><label class="form-label">你的名字</label><input class="form-input" id="onbNameA" placeholder="例如：汪俊" value="汪俊"></div><div class="form-group" style="text-align:left"><label class="form-label">TA的名字</label><input class="form-input" id="onbNameB" placeholder="例如：小怪兽" value="小怪兽"></div><div class="form-group" style="text-align:left"><label class="form-label">下次见面日期（选填）</label><input class="form-input" type="date" id="onbDate"></div><button class="btn btn-primary btn-lg btn-block mt-lg" id="onbStart">开始我们的旅程 💕</button></div></div>';

  document.getElementById('onbStart').addEventListener('click', function() {
    var nameA = document.getElementById('onbNameA').value.trim() || '汪俊';
    var nameB = document.getElementById('onbNameB').value.trim() || '小怪兽';
    var date = document.getElementById('onbDate').value;
    appData.partners.personA.name = nameA;
    appData.partners.personB.name = nameB;
    if (date) appData.meeting.nextDate = date;
    appData.onboardingComplete = true;
    window.R.save(appData);
    document.getElementById('onboarding').remove();
    renderAllMainScreens();
    window.navigate('home');
  });
}

var MAIN_SCREENS = ['home', 'daily', 'commitments', 'compensation', 'interact'];

function renderMainScreen(name) {
  var el = document.getElementById('screen-' + name);
  if (!el) return;
  var fnName = 'render' + name.charAt(0).toUpperCase() + name.slice(1);
  var fn = window[fnName];
  if (fn) fn(el, appData);

  var titles = { home: '急救贴士', daily: '日常维护', commitments: '承诺墙', compensation: '补偿小卖部', interact: '互动' };
  var titleEl = document.querySelector('.app-header-title');
  if (titleEl && titles[name]) titleEl.textContent = titles[name];
  var leftEl = document.querySelector('.app-header-left');
  if (leftEl) { leftEl.style.visibility = 'visible'; leftEl.innerHTML = '📋'; }
}

function renderSubScreen(name, data) {
  document.querySelectorAll('.screen').forEach(function(s) { s.classList.remove('active'); });
  var el = document.getElementById('screen-' + name);
  if (!el) {
    var app = document.getElementById('app');
    el = document.createElement('section');
    el.className = 'screen active';
    el.id = 'screen-' + name;
    app.appendChild(el);
  } else {
    el.classList.add('active');
  }
  var fnName = 'render' + name.charAt(0).toUpperCase() + name.slice(1);
  var fn = window[fnName];
  if (fn) fn(el, data || appData);

  var titles = { meeting: '见面管理', growth: '成长层', phrases: '启动句库', settings: '设置' };
  var titleEl = document.querySelector('.app-header-title');
  if (titleEl && titles[name]) titleEl.textContent = titles[name];
  var leftEl = document.querySelector('.app-header-left');
  if (leftEl) { leftEl.style.visibility = 'visible'; leftEl.innerHTML = '←'; }
}

function renderAllMainScreens() {
  MAIN_SCREENS.forEach(function(name) { renderMainScreen(name); });
}

window.renderAllScreens = renderAllMainScreens;
window.renderSubScreen = renderSubScreen;

document.addEventListener('DOMContentLoaded', boot);

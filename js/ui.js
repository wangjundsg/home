window.R = window.R || {};

window.R.showToast = function(message, type) {
  let toast = document.querySelector('.toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.className = 'toast';
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.className = 'toast' + (type ? ' ' + type : '');
  requestAnimationFrame(function() {
    toast.classList.add('show');
  });
  clearTimeout(toast._timeout);
  toast._timeout = setTimeout(function() {
    toast.classList.remove('show');
  }, 2000);
};

window.R.showModal = function(opts) {
  var overlay = document.createElement('div');
  overlay.className = 'modal-overlay';
  var sheet = document.createElement('div');
  sheet.className = 'modal-sheet';
  sheet.innerHTML = '<div class="modal-sheet-header"><h3 class="modal-sheet-title">' + opts.title + '</h3><button class="modal-close" aria-label="关闭">✕</button></div><div class="modal-body">' + (opts.content || '') + '</div>';
  sheet.querySelector('.modal-close').addEventListener('click', function() {
    overlay.remove();
    if (opts.onClose) opts.onClose();
  });
  overlay.addEventListener('click', function(e) {
    if (e.target === overlay) { overlay.remove(); if (opts.onClose) opts.onClose(); }
  });
  overlay.appendChild(sheet);
  document.body.appendChild(overlay);
  return { overlay: overlay, sheet: sheet, close: function() { overlay.remove(); } };
};

window.R.showFullscreen = function(text, duration) {
  var overlay = document.createElement('div');
  overlay.className = 'fullscreen-overlay';
  overlay.innerHTML = '<div class="fullscreen-text">' + text + '</div><button class="btn btn-primary btn-lg" id="fsClose">我知道了</button>';
  document.body.appendChild(overlay);
  overlay.querySelector('#fsClose').addEventListener('click', function() { overlay.remove(); });
  if (duration) setTimeout(function() { overlay.remove(); }, duration);
  return overlay;
};

window.R.spawnParticles = function(x, y) {
  var container = document.createElement('div');
  container.className = 'particle-container';
  document.body.appendChild(container);
  var emojis = ['❤️', '💕', '💗', '💖', '✨', '🌟'];
  for (var i = 0; i < 8; i++) {
    var particle = document.createElement('span');
    particle.className = 'particle';
    particle.textContent = emojis[Math.floor(Math.random() * emojis.length)];
    particle.style.left = (x + (Math.random() - 0.5) * 80) + 'px';
    particle.style.top = y + 'px';
    particle.style.animationDelay = (Math.random() * 0.3) + 's';
    container.appendChild(particle);
  }
  setTimeout(function() { container.remove(); }, 1500);
};

window.R.confirmDialog = function(opts) {
  return new Promise(function(resolve) {
    var content = '<p style="margin-bottom:var(--space-lg);color:var(--color-text-soft)">' + (opts.message || '') + '</p><div style="display:flex;gap:var(--space-md)"><button class="btn btn-outline btn-block" id="modalCancel">' + (opts.cancelText || '取消') + '</button><button class="btn btn-primary btn-block" id="modalConfirm">' + (opts.confirmText || '确定') + '</button></div>';
    var modal = window.R.showModal({ title: opts.title || '', content: content });
    modal.sheet.querySelector('#modalCancel').addEventListener('click', function() { modal.close(); resolve(false); });
    modal.sheet.querySelector('#modalConfirm').addEventListener('click', function() { modal.close(); resolve(true); });
  });
};

window.R.formatDate = function(dateStr) {
  if (!dateStr) return '';
  var d = new Date(dateStr);
  var now = new Date();
  var diff = d - now;
  var absDiff = Math.abs(diff);
  var days = Math.ceil(absDiff / (1000 * 60 * 60 * 24));
  if (diff < 0) return days + '天前';
  if (diff > 0) return '还有' + days + '天';
  return '今天';
};

window.R.daysUntil = function(dateStr) {
  if (!dateStr) return null;
  var target = new Date(dateStr);
  var now = new Date();
  now.setHours(0, 0, 0, 0);
  target.setHours(0, 0, 0, 0);
  return Math.ceil((target - now) / (1000 * 60 * 60 * 24));
};

window.R.generateId = function() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
};

window.R.clipBoard = function(text) {
  if (navigator.clipboard) {
    navigator.clipboard.writeText(text).then(function() {
      window.R.showToast('已复制到剪贴板', 'success');
    }).catch(function() {
      window.R.fallbackCopy(text);
    });
  } else {
    window.R.fallbackCopy(text);
  }
};

window.R.fallbackCopy = function(text) {
  var textarea = document.createElement('textarea');
  textarea.value = text;
  textarea.style.position = 'fixed';
  textarea.style.opacity = '0';
  document.body.appendChild(textarea);
  textarea.select();
  try {
    document.execCommand('copy');
    window.R.showToast('已复制到剪贴板', 'success');
  } catch(e) {
    window.R.showToast('复制失败，请手动复制', 'error');
  }
  document.body.removeChild(textarea);
};

// Fake Review Detector: page behaviour.
// The page reads fine without JavaScript.
// This file only adds enhancements.
'use strict';

document.documentElement.classList.add('js');

var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function toArray(list) {
  return Array.prototype.slice.call(list);
}

// The root itself plus everything inside it that matches.
function within(root, selector) {
  var found = toArray(root.querySelectorAll(selector));
  if (root.matches(selector)) found.unshift(root);
  return found;
}

// Pipeline walkthrough:
// Without JS every step is visible in a list.
// With JS the steps show one at a time, with previous/next buttons.
// It takes any [data-stepper] list, so the lightbox can start a fresh one on a clone.
function initStepper(list) {
  var steps = toArray(list.children);
  var current = 0;

  var controls = document.createElement('div');
  controls.className = 'stepper-controls';
  controls.setAttribute('role', 'group');
  controls.setAttribute('aria-label', 'Walk through the steps');

  var prev = document.createElement('button');
  prev.type = 'button';
  prev.className = 'btn';
  prev.textContent = 'Previous';

  var next = document.createElement('button');
  next.type = 'button';
  next.className = 'btn';
  next.textContent = 'Next step';

  var status = document.createElement('span');
  status.className = 'status';
  status.setAttribute('aria-live', 'polite');

  var enlargeBtn = document.querySelector('.enlarge[data-target="walkthrough"]')

  controls.appendChild(prev);
  controls.appendChild(next);
  controls.appendChild(status);
  if (!list.parentNode?.parentNode?.classList.contains('lightbox-body')) {
    controls.appendChild(enlargeBtn);
  }
  list.parentNode.insertBefore(controls, list);

  // Step 5's weight bars grow from the left every time the step is shown.
  var barsStep = list.querySelector('[data-bars]');
  var fills = barsStep ? toArray(barsStep.querySelectorAll('.wbar i')) : [];
  fills.forEach(function (fill) {
    // Remember the real width once, so a clone starts from the right value.
    if (!fill.dataset.width) fill.dataset.width = fill.style.width;
    fill.style.transition = '';
    fill.style.width = fill.dataset.width;
  });

  function playBars() {
    if (!fills.length || prefersReducedMotion) return;
    fills.forEach(function (fill) {
      fill.style.transition = 'none';
      fill.style.width = '0%';
    });
    void barsStep.offsetWidth;
    requestAnimationFrame(function () {
      fills.forEach(function (fill) {
        fill.style.transition = 'width 0.5s ease-out';
        fill.style.width = fill.dataset.width;
      });
    });
  }

  // Step 3 highlights wipe in, once, the first time that step is viewed.
  var wipeStep = list.querySelector('[data-wipe]');
  var marks = wipeStep ? toArray(wipeStep.querySelectorAll('mark')) : [];
  var wiped = false;

  marks.forEach(function (mark) {
    mark.classList.remove('wipe-pending');
    mark.style.transitionDelay = '';
  });
  if (marks.length && !prefersReducedMotion) {
    marks.forEach(function (mark, i) {
      mark.classList.add('wipe-pending');
      mark.style.transitionDelay = (i * 0.22) + 's';
    });
  }

  function playWipe() {
    if (wiped || !marks.length) return;
    wiped = true;
    if (prefersReducedMotion) return;
    // Two frames, so the hidden starting state is painted before it changes.
    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        marks.forEach(function (mark) {
          mark.classList.remove('wipe-pending');
        });
      });
    });
  }

  function show(i) {
    current = Math.max(0, Math.min(steps.length - 1, i));
    steps.forEach(function (step, n) {
      step.hidden = n !== current;
    });
    prev.disabled = current === 0;
    next.disabled = current === steps.length - 1;
    status.textContent = 'Step ' + (current + 1) + ' of ' + steps.length;
    if (steps[current] === wipeStep) playWipe();
    if (steps[current] === barsStep) playBars();
  }

  prev.addEventListener('click', function () { show(current - 1); });
  next.addEventListener('click', function () { show(current + 1); });
  show(0);
}

// Results explorer: pick an n-gram setting and see the five models ranked.
var MODELS = ['Random Forest', 'Multinomial Naive Bayes', 'Support Vector Classifier', 'XGBoost', 'XGBoost Random Forest'];
var ACC = {
  '1':     [0.84375, 0.8625,  0.85,     0.79375,  0.74375],
  '2':     [0.78125, 0.825,   0.703125, 0.753125, 0.671875],
  '3':     [0.728125, 0.715625, 0.671875, 0.7125,  0.603125],
  '1-2':   [0.8625,  0.88125, 0.85625,  0.815625, 0.728125],
  '2-3':   [0.7875,  0.79375, 0.73125,  0.753125, 0.665625],
  '1-2-3': [0.853125, 0.875,  0.8625,   0.828125, 0.728125]
};
var BEST = 0.88125;

function initExplorer(box) {
  var bars = box.querySelector('.rbars');
  var best = box.querySelector('[data-best]');

  function pct(v) {
    return (v * 100).toFixed(1) + '%';
  }

  function render(key) {
    // Models stay in the same order for every setting,
    // so switching settings shows how each one moves.
    // The winner is highlighted, not moved.
    var rows = ACC[key].map(function (v, i) {
      return { name: MODELS[i], value: v };
    });
    var winner = rows[0];
    rows.forEach(function (row) {
      if (row.value > winner.value) winner = row;
    });

    bars.innerHTML = '';
    var fills = [];
    rows.forEach(function (row) {
      var li = document.createElement('li');
      if (row === winner) li.className = 'top';

      var name = document.createElement('span');
      name.textContent = row.name;

      var track = document.createElement('span');
      track.className = 'rbar';
      track.setAttribute('aria-hidden', 'true');
      var fill = document.createElement('i');
      track.appendChild(fill);
      fills.push({ el: fill, width: Math.max(0, (row.value - 0.5) / 0.5 * 100) });

      var num = document.createElement('span');
      num.className = 'num';
      num.textContent = pct(row.value);

      li.appendChild(name);
      li.appendChild(track);
      li.appendChild(num);
      bars.appendChild(li);
    });

    requestAnimationFrame(function () {
      fills.forEach(function (f) {
        f.el.style.width = f.width + '%';
      });
    });

    best.textContent = 'Best here: ' + winner.name + ' at ' + pct(winner.value) +
      (winner.value === BEST ? ', the best score overall.' : '.');
  }

  box.addEventListener('change', function (event) {
    if (event.target && event.target.type === 'radio') render(event.target.value);
  });

  box.hidden = false;
  render(box.querySelector('input[type="radio"]:checked').value);
}

toArray(document.querySelectorAll('[data-stepper]')).forEach(initStepper);
toArray(document.querySelectorAll('[data-explorer]')).forEach(initExplorer);

// Lightbox uses a single <dialog> element.
// The enlarge buttons point at an element by id;
// a clone of that (and its caption) goes into the dialog
// and is thrown away when the dialog closes.
// Interactive pieces get a fresh, working copy of their own.
(function () {
  var dialog = document.getElementById('lightbox');
  if (!dialog || typeof dialog.showModal !== 'function') return;

  var body = dialog.querySelector('.lightbox-body');
  document.documentElement.classList.add('has-lightbox');

  function open(id) {
    var source = document.getElementById(id);
    if (!source) return;

    var clone = source.cloneNode(true);
    // Remove id from being repated in clone and also remove other page controls.
    clone.removeAttribute('id');
    toArray(clone.querySelectorAll('[id]')).forEach(function (el) {
      el.removeAttribute('id');
    });
    toArray(clone.querySelectorAll('.enlarge, .table-toggle, .stepper-controls')).forEach(function (el) {
      el.remove();
    });
    // Update radio buttons group name to prevent them joining the page's group.
    within(clone, 'input[type="radio"]').forEach(function (radio) {
      radio.name = radio.name + '-lightbox';
    });

    var caption = clone.querySelector('figcaption, caption');
    var label = source.getAttribute('data-label') ||
      (caption ? caption.textContent.replace(/\s+/g, ' ').trim() : 'Enlarged view');
    dialog.setAttribute('aria-label', label);

    body.textContent = '';
    body.appendChild(clone);
    within(clone, '[data-stepper]').forEach(initStepper);
    within(clone, '[data-explorer]').forEach(initExplorer);
    dialog.showModal();
  }

  document.addEventListener('click', function (event) {
    var button = event.target.closest('.enlarge[data-target]');
    if (button) open(button.getAttribute('data-target'));
  });

  dialog.querySelector('.lightbox-close').addEventListener('click', function () {
    dialog.close();
  });

  // A click that lands on the dialog itself is a click on the backdrop.
  dialog.addEventListener('click', function (event) {
    if (event.target === dialog) dialog.close();
  });

  // Fires for the button, the backdrop and the Esc key alike.
  dialog.addEventListener('close', function () {
    body.textContent = '';
    dialog.removeAttribute('aria-label');
  });
})();

// Scrollspy: mark the nav link of the section in view with aria-current.
(function () {
  var nav = document.querySelector('.site-header nav');
  if (!nav || !('IntersectionObserver' in window)) return;

  var items = toArray(nav.querySelectorAll('a[href^="#"]')).map(function (link) {
    return { link: link, section: document.getElementById(link.hash.slice(1)) };
  }).filter(function (item) {
    return item.section;
  });
  if (!items.length) return;

  var inBand = [];
  var current = null;

  function setCurrent(link) {
    if (link === current) return;
    if (current) current.removeAttribute('aria-current');
    if (link) link.setAttribute('aria-current', 'location');
    current = link;

    // On narrow screens the links scroll sideways: keep the current one visible.
    if (link && nav.scrollWidth > nav.clientWidth) {
      var linkBox = link.getBoundingClientRect();
      var navBox = nav.getBoundingClientRect();
      nav.scrollBy({
        left: linkBox.left - navBox.left - (navBox.width - linkBox.width) / 2,
        behavior: prefersReducedMotion ? 'auto' : 'smooth'
      });
    }
  }

  function update() {
    if (inBand.length) {
      // Several can touch the band at a boundary: take the later one.
      var latest = items.filter(function (item) {
        return inBand.indexOf(item.section) !== -1;
      }).pop();
      setCurrent(latest.link);
    } else if (items[0].section.getBoundingClientRect().top > window.innerHeight * 0.3) {
      // Still above the first section (the hero).
      setCurrent(null);
    }
  }

  // A thin band a little above the middle of the viewport.
  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      var index = inBand.indexOf(entry.target);
      if (entry.isIntersecting && index === -1) inBand.push(entry.target);
      if (!entry.isIntersecting && index !== -1) inBand.splice(index, 1);
    });
    update();
  }, { rootMargin: '-30% 0px -65% 0px' });

  items.forEach(function (item) {
    observer.observe(item.section);
  });
})();
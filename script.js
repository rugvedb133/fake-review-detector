// Fake Review Detector: page behaviour.
// The page reads fine without JavaScript. This file only adds enhancements,
// one section at a time.
'use strict';

document.documentElement.classList.add('js');

var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Pipeline walkthrough: without JS every step is visible in a list. With JS
// the steps show one at a time, with previous/next buttons.
(function () {
  var list = document.querySelector('[data-stepper]');
  if (!list) return;

  var steps = Array.prototype.slice.call(list.children);
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

  controls.appendChild(prev);
  controls.appendChild(next);
  controls.appendChild(status);
  list.parentNode.insertBefore(controls, list);

  // Step 3 highlights wipe in, once, the first time that step is viewed.
  var wipeStep = list.querySelector('[data-wipe]');
  var marks = wipeStep ? Array.prototype.slice.call(wipeStep.querySelectorAll('mark')) : [];
  var wiped = false;

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
  }

  prev.addEventListener('click', function () { show(current - 1); });
  next.addEventListener('click', function () { show(current + 1); });
  show(0);
})();

// Results explorer: pick an n-gram setting and see the five models ranked.
// Numbers are Table 4.3 from our report (accuracy on the test reviews).
(function () {
  var box = document.querySelector('[data-explorer]');
  if (!box) return;

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

  var bars = box.querySelector('.rbars');
  var best = box.querySelector('[data-best]');

  function pct(v) {
    return (v * 100).toFixed(1) + '%';
  }

  function render(key) {
    var rows = ACC[key].map(function (v, i) {
      return { name: MODELS[i], value: v };
    }).sort(function (a, b) {
      return b.value - a.value;
    });

    bars.innerHTML = '';
    var fills = [];
    rows.forEach(function (row, i) {
      var li = document.createElement('li');
      if (i === 0) li.className = 'top';

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

    var winner = rows[0];
    best.textContent = 'Best here: ' + winner.name + ' at ' + pct(winner.value) +
      (winner.value === BEST ? ', the best score overall.' : '.');
  }

  box.addEventListener('change', function (event) {
    if (event.target && event.target.name === 'ngram') render(event.target.value);
  });

  box.hidden = false;
  render(box.querySelector('input[name="ngram"]:checked').value);
})();
// Fake Review Detector: page behaviour.
// The page reads fine without JavaScript. This file only adds enhancements,
// one section at a time.
'use strict';

document.documentElement.classList.add('js');

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

  function show(i) {
    current = Math.max(0, Math.min(steps.length - 1, i));
    steps.forEach(function (step, n) {
      step.hidden = n !== current;
    });
    prev.disabled = current === 0;
    next.disabled = current === steps.length - 1;
    status.textContent = 'Step ' + (current + 1) + ' of ' + steps.length;
  }

  prev.addEventListener('click', function () { show(current - 1); });
  next.addEventListener('click', function () { show(current + 1); });
  show(0);
})();

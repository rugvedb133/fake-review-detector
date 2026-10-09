/*
 * Mobile navigation drawer for the archived Google Sites pages.
 *
 * Google's runtime used to open and close the drawer. That runtime is gone,
 * but the CSS for the open state is still in styles.css:
 *   .jsnVQ  on the drawer (<nav id="yuynLe">)  slides it in
 *   .o0iVae on the hamburger's <svg>           turns the icon into an X
 * This script toggles those two classes, keeps aria-expanded in sync, and
 * adds the keyboard handling the exported markup was missing.
 *
 * No library, no other dependencies. Does nothing on pages without the drawer.
 */
(function () {
  'use strict';

  var button = document.getElementById('s9iPrd');
  var drawer = document.getElementById('yuynLe');
  if (!button || !drawer) return;

  var icon = button.querySelector('svg');
  // Only the nav items: the drawer also holds a logo link and a title link
  // that Google's CSS hides on mobile.
  var links = drawer.querySelectorAll('li a[href]');

  function isOpen() {
    return button.getAttribute('aria-expanded') === 'true';
  }

  // opts.focus: 'first' moves focus to the first drawer link,
  //             'button' returns focus to the hamburger button.
  function setOpen(open, opts) {
    var focus = opts && opts.focus;

    drawer.classList.toggle('jsnVQ', open);
    if (icon) icon.classList.toggle('o0iVae', open);
    button.setAttribute('aria-expanded', open ? 'true' : 'false');

    // The exported links are a roving-tabindex set (only the current page is
    // tabbable) and stay focusable while the drawer is off-screen. Make all of
    // them tabbable while open, and take them out of the tab order when closed.
    drawer.inert = !open;
    for (var i = 0; i < links.length; i++) links[i].tabIndex = open ? 0 : -1;

    if (open && focus === 'first' && links.length) {
      links[0].focus({ preventScroll: true });
    } else if (!open && focus === 'button') {
      button.focus({ preventScroll: true });
    }
  }

  function toggle(viaKeyboard) {
    var open = !isOpen();
    setOpen(open, { focus: open ? (viaKeyboard ? 'first' : null) : null });
  }

  button.addEventListener('click', function () {
    toggle(false);
  });

  // The button is a <div role="button">, so Enter and Space need wiring.
  button.addEventListener('keydown', function (e) {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      toggle(true);
    }
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && isOpen()) setOpen(false, { focus: 'button' });
  });

  // Click outside the drawer and its button closes it.
  document.addEventListener('click', function (e) {
    if (isOpen() && !drawer.contains(e.target) && !button.contains(e.target)) {
      setOpen(false);
    }
  });

  // Clicks inside the embedded Drive/Form/Map iframes never reach this page's
  // click handlers, but they do move focus into the iframe and blur the window.
  window.addEventListener('blur', function () {
    var el = document.activeElement;
    if (isOpen() && el && el.tagName === 'IFRAME') setOpen(false);
  });

  // Tabbing out of the drawer into the page closes it, so it never sits
  // open on top of content the keyboard user has moved on to.
  drawer.addEventListener('focusout', function (e) {
    var next = e.relatedTarget;
    if (isOpen() && next && !drawer.contains(next) && next !== button) {
      setOpen(false);
    }
  });

  setOpen(false); // initial state: closed, links out of the tab order
})();

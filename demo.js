// Demo replay of the frontend: replays the web app's pages step by step.
// Nothing here runs the model; the inputs are examples and the verdicts and
// error messages are the app's own wording.

(function () {
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var SCENARIOS = {
    genuine: {
      username: 'janta16',
      hotel: 'fairmont',
      code: 'gTDhjl',
      review: 'I stayed at the Fairmont to attend a conference. I was very pleased with the hotel. The doorman offered me an umbrella as I headed out for a walk... and sure enough it started to rain very soon after- I would have been soaked with it. Upon my return, the doorman then asked about my walk, etc. This is reflective of all the staff I encountered. The front desk promptly checked me in. DEFINITELY register for their rewards program before you arrive... The complimentary gym access is excellent, plus you save on internet access fees which are waived for members. The bathroom and separate dressing areas were large and convenient. The only negative- no coffee maker! AND the Starbucks in the adjacent building is closed on weekends since the area corporate offices are closed those days!!! Otherwise my stay was perfect, considering the conference rate was $99 per night!',
      verdict: 'genuine review'
    },
    fake: {
      username: 'rajupatel1',
      hotel: 'conrad',
      code: 'cYtkoH',
      review: 'I needed to find a last minute hotel to stay in for the night so i came to this one. First of all the prices for one night are extremely high. The workers at the front desk were not kind at all and treated me like i was a second rate and not on their list of priorities. Then i got into my room and got settled and it smelled of cigarettes and the air conditioner was making loud sounds so i didnt get much sleep. Also the restroom was very dirty and frankly disgusting. The beds were very old and uncomfortable and the tv did not work at all. Overall i am very disappointed with this hotel.',
      verdict: 'fake review'
    },
    user: {
      username: 'nobody99',
      hotel: 'conrad',
      code: 'cYtkoH',
      review: 'The room was clean and the staff were friendly.',
      error: "username doesn't exist!"
    },
    hotel: {
      username: 'janta16',
      hotel: 'conrad',
      code: 'gTDhjl',
      review: 'The room was clean and the staff were friendly.',
      error: 'no booking for this hotel under this username!'
    },
    code: {
      username: 'rajupatel1',
      hotel: 'conrad',
      code: 'abc123',
      review: 'The room was clean and the staff were friendly.',
      error: "confirmation code doesn't match!"
    }
  };

  var $ = function (id) { return document.getElementById(id); };
  var fields = { username: $('f-username'), hotel: $('f-hotel'), code: $('f-code'), review: $('f-review') };
  var views = { form: $('v-form'), result: $('v-result'), error: $('v-error') };
  var playBtn = $('play');
  var skipBtn = $('skip');
  var statusEl = $('status');
  var submit = $('b-submit');
  var run = 0;

  function current() {
    return SCENARIOS[document.querySelector('input[name="scenario"]:checked').value];
  }

  function say(text) {
    statusEl.textContent = text;
  }

  function show(name) {
    Object.keys(views).forEach(function (key) {
      views[key].hidden = key !== name;
    });
  }

  function clearFields() {
    Object.keys(fields).forEach(function (key) {
      fields[key].textContent = '';
    });
    submit.classList.remove('pressed');
  }

  function reset() {
    run++;
    clearFields();
    show('form');
    playBtn.disabled = false;
    playBtn.textContent = 'Play replay';
    say('Press \u201cPlay replay\u201d to start.');
  }

  function wait(ms, id) {
    return new Promise(function (resolve) {
      setTimeout(function () { resolve(id === run); }, ms);
    });
  }

  async function typeInto(el, text, ms, id, byWord) {
    el.textContent = '';
    if (reduce) {
      el.textContent = text;
      return true;
    }
    var parts = byWord ? text.split(/(?<= )/) : text.split('');
    for (var i = 0; i < parts.length; i++) {
      el.textContent += parts[i];
      el.scrollTop = el.scrollHeight;
      if (!(await wait(ms * (0.7 + Math.random() * 0.6), id))) return false;
    }
    return true;
  }

  function outcome(s) {
    if (s.error) {
      $('e-msg').textContent = s.error;
      show('error');
      say('Error: ' + s.error);
    } else {
      $('r-review').textContent = s.review;
      $('r-verdict').textContent = s.verdict;
      show('result');
      say('User details verified. Prediction: this is a ' + s.verdict + '.');
    }
    playBtn.disabled = false;
    playBtn.textContent = 'Play again';
  }

  async function play() {
    var s = current();
    var id = ++run;
    clearFields();
    show('form');
    playBtn.disabled = true;
    playBtn.textContent = 'Replaying\u2026';

    var pause = reduce ? 0 : 900;

    say('Typing the username.');
    if (!(await typeInto(fields.username, s.username, 130, id))) return;
    if (!(await wait(pause, id))) return;
    say('Typing the hotel name.');
    if (!(await typeInto(fields.hotel, s.hotel, 130, id))) return;
    if (!(await wait(pause, id))) return;
    say('Typing the confirmation code.');
    if (!(await typeInto(fields.code, s.code, 130, id))) return;
    if (!(await wait(pause, id))) return;
    say('Entering the review.');
    if (!(await typeInto(fields.review, s.review, 95, id, true))) return;
    if (!(await wait(pause, id))) return;

    say('Submitting.');
    submit.classList.add('pressed');
    if (!(await wait(reduce ? 0 : 700, id))) return;
    outcome(s);
  }

  function skip() {
    var s = current();
    run++;
    outcome(s);
  }

  playBtn.addEventListener('click', play);
  skipBtn.addEventListener('click', skip);
  document.getElementById('scenarios').addEventListener('change', reset);
  Array.prototype.forEach.call(document.querySelectorAll('[data-again]'), function (btn) {
    btn.addEventListener('click', reset);
  });
  reset();
})();
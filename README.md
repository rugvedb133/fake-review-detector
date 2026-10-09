# Startup website archive

This [`google-sites`](../../tree/google-sites) branch archives the website built as part of the *Technology Entrepreneurship* course.
For that course, each student team had to complete tasks/assignments as if they were a startup company.
Our startup's product was our capstone project topic: fake-review detection using machine learning and NLP.

The site was made with and hosted on Google Sites.
What's here is an archive of the site's pages and images, recovered from Google Takeout and captured using `wget`,
and then repaired commit by commit so that it works as a static site on GitHub Pages, without Google's runtime or backend.

The goal is for this branch to be deployable.
If the Pages source is ever switched to `google-sites`, the site should work as it did on Google Sites.

### More links
- [`main`](../../tree/main) branch: README only (this project's source code is coursework and isn't published)
- [`gh-pages`](../../tree/gh-pages) branch: the portfolio write-up, live at [rugvedb133.github.io/fake-review-detector/](https://rugvedb133.github.io/fake-review-detector/)
- **[`google-sites`](../../tree/google-sites)** branch (current): startup website's archives and working copy
- Live website: [sites.google.com/spit.ac.in/fidelity-tech/](https://sites.google.com/spit.ac.in/fidelity-tech/)
- Web archive: [Wayback Machine snapshots](https://web.archive.org/web/*/https://sites.google.com/spit.ac.in/fidelity-tech*)

## What's in this branch

| Path | What it is |
|---|---|
| `index.html` | A small redirect to `home.html`, so the site root works. |
| `home.html`<br>`about.html`<br>`profile.html`<br>`brochure.html`<br>`video.html`<br>`contact-us.html` | The site's six main pages: Home, About, Startup Profile, Brochure, Video, Contact Us. |
| `legal.html` | The disclaimer notice, linked from every page's footer. |
| `styles.css` | Google Sites' stylesheet, moved out of the pages **unchanged**. It was byte-identical in all seven pages. |
| `extra.js` | **Ours.** Extra scripts to make some parts work on GitHub Pages (see below). |
| `images/` | Logo, hero photo, FIDCHECK logo, and the team portraits. |
| `favicon.png` | The site icon. It stays at the root because browsers look for it there by default. |
| `.nojekyll` | Tells GitHub Pages not to run Jekyll over the files. |

**Naming rule**: Anything we added so that the pages work without Google's runtime lives in files named `extra.js` and `extra.css`, so it is never confused with the original.

### How the history is organised

- Tag [**`wget`**](../../tree/wget): a [`wget`](https://www.gnu.org/software/wget/) crawl of the live site, kept for reference. It includes the navigation markup but no images, and its pages still load scripts and fonts from Google's servers.
- Tag [**`takeout`**](../../tree/takeout): the [Google Takeout](https://takeout.google.com/) export.
- The Takeout version is the base for everything after it: pages that are self-contained, but about 2 MB each of Google's pre-rendered HTML, CSS and runtime scripts, mostly minified.
- Personal information, such as email addresses and phone numbers, was removed from these archives.
- Every commit after that is one small repair, tested before it was committed.


<details>
<summary><strong>What the repair commits did, in order</strong></summary>

1. **Readable image names, one `images/` folder.** The export names every image after a hash, and three of the files were PNGs named `.jpg`. They were renamed, given the right extensions, and moved into a single `images/` folder.
2. **Compressed the images.** ~6.07 MB down to about 290 KB.
3. **`index.html` redirect.** The export had no `index.html`, so the site root would have been a 404.
4. **Showed the top navigation bar.** It was in the markup but hidden with an inline `visibility: hidden` that Google's runtime removed on load.
5. **Removed the runtime loader** (`base-js`). It could never start here: its lazy-loaded modules 404 on GitHub Pages, and it then reported an error to a Google endpoint on every page load.
6. **Removed remaining inline scripts**: the framework data and an error stub; a bundled library; an image preload and runtime config; and the feature-flag data with its timing stubs. After this the pages contain no scripts at all.
7. **Stripped leftover boilerplate** from the head and the end of the stylesheet: stale security nonces, an obsolete IE meta tag, and a `sourceURL` comment pointing at Google's servers.
8. **Moved the shared stylesheet into `styles.css`.** The byte-identical internal stylesheets from each page were split out into a single file, and each page went from about 1.84 MB to 39-46 KB. The browser now downloads the CSS once instead of once per page. No CSS was edited.
9. **Added `extra.js`.** The mobile menu button did nothing without Google's runtime. The open-state CSS was still in `styles.css`, so the script only toggles the classes that CSS already defines, and it adds the keyboard handling the export lacked.
10. **Updated this README.**

</details>

### Left alone on purpose

- **Inert Google attributes** (`jsaction`, `jscontroller`, `jsname`, `data-*`). Nothing reads them any more, and removing multiples of them per page from long, minified lines would make the diff unreadable.
- **`styles.css`.** It has over 11,000 rules, most of them for Google's editor and viewer interface. Pruning it would risk losing a breakpoint or a hover state for no visible gain.
- **Hidden Drive preview cards** on the Brochure, Startup Profile and Video pages. They are `display: none` fallbacks.
- **`noindex`.** Every page tells search engines not to index it, and the `index.html` canonical points at the live site, so this archive never competes with it.

## Licence

- **Our original text and images** (the writing, logos, diagrams, and team's photos) **are © 2021 the project team. All rights reserved.**
- **`extra.js`** is new code written for this archive, to make it work on GitHub Pages. It is not part of the original site. All rights reserved.
- **Google's code is not ours.** The page markup and `styles.css` are Google Sites' templates and stylesheet, included only because they were part of the exported pages. They remain the property of Google, and none of the terms above apply to them.
- **Bundled open-source code** keeps its own licence. `styles.css` still contains [normalize.css](https://github.com/necolas/normalize.css) v2.1.1 (MIT), with its notice comment intact near the top of the file. The scripts that were removed from the pages bundled Math.uuid.js by Robert Kieffer (MIT/GPL), Angular (MIT) and Google's Closure Library (Apache-2.0); they are no longer in the working tree but remain in the history, with their notices intact.
- **Names and logos** of institutions and third parties belong to their owners.
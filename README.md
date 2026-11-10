# The Rosenberg File

An interactive case file that tells the story of **Julius and Ethel Rosenberg**, the American couple executed in 1953 for passing secrets to the Soviet Union.

The viewer works through it like a detective's desk. Folders open, polaroids get swiped away, a parcel is cut open, red string connects the suspects, and the verdict is stamped by hand. Between documents, the camera flies across a cluttered desk.

## Running it

It is a static site with no build step. To serve it locally:

```bash
python3 -m http.server 8000
# then open http://localhost:8000
```

Opening `index.html` directly from disk also works in most browsers.

## How it works

| File | Purpose |
| --- | --- |
| `index.html` | Page shell: desk, camera layer, top/bottom bars, case index dialog |
| `css/style.css` | All visuals: paper, folders, stamps, polaroids, Ken Burns, desk props |
| `js/story.js` | **The story content.** Sections → steps. Edit text here. |
| `js/app.js` | Engine: desk layout, camera flights, interactions, progress, sound |
| `js/credits.js` | Photo sources and licences, shown on the final screen |
| `assets/img/` | Archive photos (resized), plus a hand-drawn fuze schematic |

### Step types in `story.js`

| `t:` | What the viewer does |
| --- | --- |
| `cover` / `folder` | Tap a manila folder to open it |
| `doc` | Read a typed document; tap black bars to declassify words |
| `polaroid` | A taped photo with a short note |
| `stack` | Swipe photos off a pile one by one |
| `package` | Drag down the tape to cut a parcel open |
| `jello` | Drag one half of a torn Jell-O box to its match |
| `board` | Tap suspects in order to string them together |
| `verdict` | Tap to stamp the verdict |
| `quiz` | Guess a fact; the answer gets stamped CORRECT or WRONG |
| `poll` | Give an opinion; no right answer |

Inline markup: `**bold**`, `{{tap-to-declassify}}`, `[[permanent redaction]]`.

### Navigation rules

- There is no Continue button. Once the current interaction is done, a **tap anywhere** moves to the next document. If the reader hasn't tapped after the estimated reading time (about 200 words a minute) plus 2 seconds, a pulsing "tap to continue" cue appears at the bottom right, where a thumb naturally rests.
- **Back** steps to the previous document at any time.
- The **Case Index** lists every section. Sections not yet reached show as redacted and CLASSIFIED. Once the story is finished, everything is open.
- Progress is remembered in the browser (`localStorage`).

### Sound

All paper sounds are synthesised in the browser with the Web Audio API, so there are no audio files to license. The button in the top-right corner turns sound on and off.

## Image sources

Every photo comes from Wikimedia Commons. Most are U.S. government or archive photos in the public domain. A few are under Creative Commons licences. The full list, with authors and licences, is in `js/credits.js` and on the final screen of the presentation.

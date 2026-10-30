/*
  LEVELS-GEN.JS
  -------------
  Builds 1,250 levels for every tier (5,000 in all): 10 tracks x 125 levels.
  The first JavaScript, HTML, Logic and Debugging level of each tier are the
  hand-written ones in data.js; the rest come from question generators below.
  Every level is seeded by its id, so a level always has the same questions,
  and numbers, arrays and words change from level to level.

  A question is [text, code, options, correctIndex, explanation], exactly like
  data.js. The correct option is listed first; app.js shuffles options.
*/
const PER_TIER = 200; // levels per tier in the first block (used to map very old saves)
const TRACK_ORDER = ["js", "web", "logic", "debug"];
const NEW_TRACKS = ["python", "css", "sql", "php"];

/* ---------- seeded helpers ---------- */
function seeded(seed) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
let R = Math.random;
const ri = (a, b) => a + Math.floor(R() * (b - a + 1));
const pick = (a) => a[Math.floor(R() * a.length)];
const shuf = (a) => {
  a = a.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(R() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};
const nums = (n, lo, hi) => Array.from({ length: n }, () => ri(lo, hi));
const arr = (a) => "[" + a.join(", ") + "]";
const out = (a) => "[" + a.join(",") + "]"; // how console.log output is written in options
const names = ["items", "scores", "prices", "levels", "ages", "points", "steps", "coins"];

/** Build a question; drops duplicate or empty distractors and tops up with `more`. */
function Q(text, code, correct, wrong, why, more = [], check) {
  const c = String(correct);
  const seen = new Set([c]);
  const opts = [c];
  for (const w of [...wrong, ...more]) {
    const s = String(w);
    if (s !== "" && !seen.has(s) && opts.length < 4) {
      seen.add(s);
      opts.push(s);
    }
  }
  if (opts.length < 4) return null; // not enough good options; caller tries another generator
  return check ? [text, code, opts, 0, why, check] : [text, code, opts, 0, why];
}

/** Multiple choice from a pool of [answer, prompt, why?] rows. */
function fromPool(pool, makeText, why) {
  const row = pick(pool);
  const wrong = shuf(pool.filter((r) => r[0] !== row[0])).slice(0, 3).map((r) => r[0]);
  return Q(makeText(row), "", row[0], wrong, row[2] || why(row));
}

const PRINT = "What does this print?";

/* ---------- JavaScript ---------- */
const TYPEOF = [
  ["42", "number"], ['"hello"', "string"], ["true", "boolean"], ["undefined", "undefined"],
  ["null", "object"], ["[1, 2]", "object"], ["{ a: 1 }", "object"], ["function () {}", "function"],
  ["NaN", "number"], ["3.14", "number"], ["''", "string"],
];
const JS = [
  // variables and maths
  (d) => {
    const a = ri(2, 9 + d * 5), b = ri(2, 9 + d * 5), m = ri(2, 4);
    return Q(PRINT, `let x = ${a};\nx = x + ${b};\nx = x * ${m};\nconsole.log(x)`, (a + b) * m,
      [a + b * m, a + b, a * b * m, (a + b) * m + 1], `Lines run top to bottom: x becomes ${a + b}, then ${a + b} × ${m} = ${(a + b) * m}.`);
  },
  (d) => {
    const a = ri(10, 40 + d * 20), b = ri(2, 9);
    return Q(PRINT, `console.log(${a} % ${b})`, a % b, [Math.floor(a / b), b - (a % b), (a % b) + 1, 0],
      `% gives the remainder. ${a} ÷ ${b} is ${Math.floor(a / b)} remainder ${a % b}.`);
  },
  (d) => {
    const a = ri(2, 9), b = ri(2, 9), c = ri(1, 9);
    return Q(PRINT, `console.log(${a} + ${b} + "${c}")`, `${a + b}${c}`, [`${a}${b}${c}`, a + b + c, "NaN"],
      `JavaScript adds ${a} + ${b} = ${a + b} first, then meets a string and joins: "${a + b}${c}".`);
  },
  (d) => {
    const a = ri(2, 9), b = ri(2, 9), c = ri(1, 9);
    return Q(PRINT, `console.log("${c}" + ${a} + ${b})`, `${c}${a}${b}`, [`${c}${a + b}`, a + b + c, "NaN"],
      `It starts with a string, so every + after it joins text: "${c}" + ${a} + ${b} gives "${c}${a}${b}".`);
  },
  // arrays
  (d) => {
    const n = ri(3, 5), a = nums(n, 1, 9 + d * 10), v = ri(1, 20), nm = pick(names);
    return Q(PRINT, `const ${nm} = ${arr(a)};\n${nm}.push(${v});\nconsole.log(${nm}.length)`, n + 1, [n, n + 2, v],
      `push adds one item to the end, so the length goes from ${n} to ${n + 1}.`);
  },
  (d) => {
    const n = ri(4, 6), a = nums(n, 1, 30 + d * 20), k = ri(1, n - 2), nm = pick(names);
    return Q(PRINT, `const ${nm} = ${arr(a)};\nconsole.log(${nm}[${k}])`, a[k], [a[k - 1], a[k + 1], a[0], "undefined"],
      `Indexes start at 0, so [${k}] is item number ${k + 1}: ${a[k]}.`);
  },
  (d) => {
    const a = nums(ri(3, 4), 1, 9), m = ri(2, 5);
    return Q(PRINT, `console.log(${arr(a)}.map(x => x * ${m}))`, out(a.map((x) => x * m)),
      [out(a), out(a.map((x) => x + m)), String(a.reduce((s, x) => s + x * m, 0))],
      `map runs the function on every item and returns a new array.`);
  },
  (d) => {
    const a = nums(ri(5, 6), 1, 20), t = ri(5, 12), r = a.filter((x) => x > t);
    return Q(PRINT, `console.log(${arr(a)}.filter(x => x > ${t}))`, out(r),
      [out(a.filter((x) => x >= t)), out(a.filter((x) => x <= t)), String(r.length), out(a)],
      `filter keeps only the items where the test is true: those bigger than ${t}.`);
  },
  (d) => {
    const a = nums(ri(3, 5), 1, 9 + d * 5), s = a.reduce((x, y) => x + y, 0);
    return Q(PRINT, `console.log(${arr(a)}.reduce((sum, x) => sum + x, 0))`, s, [s - a[0], s + 1, out(a), a.length],
      `reduce starts at 0 and adds each item: ${a.join(" + ")} = ${s}.`);
  },
  (d) => {
    const a = nums(ri(4, 6), 1, 20), v = pick(a);
    return Q(PRINT, `console.log(${arr(a)}.indexOf(${v}))`, a.indexOf(v), [a.indexOf(v) + 1, v, -1],
      `indexOf returns the position of the first match, counting from 0.`, [a.length]);
  },
  (d) => {
    const a = nums(5, 1, 30), s = ri(1, 2), e = ri(3, 4);
    return Q(PRINT, `console.log(${arr(a)}.slice(${s}, ${e}))`, out(a.slice(s, e)),
      [out(a.slice(s, e + 1)), out(a.slice(s - 1, e)), out(a.slice(s + 1, e + 1))],
      `slice(start, end) copies from start up to, but not including, end.`);
  },
  // loops and conditions
  (d) => {
    const a = ri(1, 3), b = ri(4, 6 + d * 2);
    let s = 0;
    for (let i = a; i <= b; i++) s += i;
    return Q(PRINT, `let s = 0;\nfor (let i = ${a}; i <= ${b}; i++) {\n  s += i;\n}\nconsole.log(s)`, s, [s - b, s + b + 1, b - a + 1],
      `The loop adds every number from ${a} to ${b}, giving ${s}.`);
  },
  () => {
    const age = ri(10, 25);
    return Q(PRINT, `const age = ${age};\nconsole.log(age >= 18 ? "adult" : "minor")`, age >= 18 ? "adult" : "minor",
      [age >= 18 ? "minor" : "adult", "true", "undefined"],
      `The ternary returns the first value when the test is true. ${age} >= 18 is ${age >= 18}.`);
  },
  () => {
    const w = pick(VOCAB[0])[0].toLowerCase();
    const forms = [
      [`console.log("${w}".length)`, w.length, [w.length - 1, w.length + 1, `"${w}"`], `.length counts the characters in "${w}".`],
      [`console.log("${w}".toUpperCase())`, w.toUpperCase(), [w, w[0].toUpperCase() + w.slice(1), "undefined"], `toUpperCase turns every letter into a capital.`],
      [`console.log("${w}"[0])`, w[0], [w[1], w[w.length - 1], "undefined"], `[0] is the first character of the string.`],
      [`console.log("${w}".split("").reverse().join(""))`, [...w].reverse().join(""), [w, w.toUpperCase(), out([...w].reverse())], `split, reverse and join flip the string around.`],
    ];
    const [code, ans, wrong, why] = pick(forms);
    return Q(PRINT, code, ans, wrong, why, ["Error"]);
  },
  () => {
    const [v, t] = pick(TYPEOF);
    return Q(PRINT, `console.log(typeof ${v})`, t, ["number", "string", "object", "boolean", "undefined", "function"].filter((x) => x !== t).sort(() => R() - 0.5),
      t === "object" && v === "null" ? "typeof null is a famous quirk: it returns object." : `typeof ${v} is ${t}.`);
  },
  (d) => {
    const a = nums(3, 1, 50 + d * 50);
    const f = pick(["max", "min"]);
    const ans = Math[f](...a);
    return Q(PRINT, `console.log(Math.${f}(${a.join(", ")}))`, ans, [Math[f === "max" ? "min" : "max"](...a), a[0], a[a.length - 1]],
      `Math.${f} returns the ${f === "max" ? "largest" : "smallest"} number.`, [a.reduce((x, y) => x + y, 0)]);
  },
  // Mid Dev and up
  { min: 1, f: () => {
    const a = ri(1, 9);
    const forms = [
      [`console.log(${a} === "${a}")`, "false", `=== checks type as well as value. A number is never the same type as a string.`],
      [`console.log(${a} == "${a}")`, "true", `== converts types before comparing, so the string "${a}" becomes the number ${a}.`],
      [`console.log(null == undefined)`, "true", `null and undefined are loosely equal to each other and nothing else.`],
      [`console.log(NaN === NaN)`, "false", `NaN is the only value that is not equal to itself. Use Number.isNaN().`],
    ];
    const [code, ans, why] = pick(forms);
    return Q(PRINT, code, ans, [ans === "true" ? "false" : "true", "undefined", "Error"], why);
  } },
  { min: 1, f: () => {
    const a = ri(2, 9);
    const forms = [
      [`console.log(0 || ${a})`, a, `|| skips falsy values, and 0 is falsy, so you get ${a}.`, [0, "true", "false"]],
      [`console.log(0 ?? ${a})`, 0, `?? only skips null and undefined. 0 is kept.`, [a, "null", "undefined"]],
      [`console.log(null ?? ${a})`, a, `?? replaces null with the value on the right.`, ["null", 0, "undefined"]],
      [`console.log("" || "guest")`, "guest", `An empty string is falsy, so || returns "guest".`, ['""', "false", "undefined"]],
    ];
    const [code, ans, why, wrong] = pick(forms);
    return Q(PRINT, code, ans, wrong, why);
  } },
  { min: 1, f: () => {
    const a = nums(2, 1, 9), b = nums(2, 1, 9);
    return Q(PRINT, `const a = ${arr(a)};\nconst b = ${arr(b)};\nconsole.log([...a, ...b])`, out([...a, ...b]),
      [out([a, b].map(out)).replace(/"/g, ""), out([...b, ...a]), out(a)],
      `The spread operator ... unpacks both arrays into one new array, in order.`);
  } },
  { min: 1, f: () => {
    const a = nums(4, 1, 30);
    return Q(PRINT, `const [x, , y] = ${arr(a)};\nconsole.log(x + y)`, a[0] + a[2], [a[0] + a[1], a[1] + a[2], `${a[0]}${a[2]}`],
      `Destructuring takes items by position. The empty slot skips ${a[1]}, so x = ${a[0]} and y = ${a[2]}.`);
  } },
  { min: 1, f: () => {
    const user = pick(["Ava", "Kai", "Leo", "Mia", "Noah", "Zoe"]), n = ri(2, 9);
    return Q(PRINT, "const name = \"" + user + "\";\nconst n = " + n + ";\nconsole.log(`${name} has ${n * 2} stars`)",
      `${user} has ${n * 2} stars`, ["${name} has ${n * 2} stars", `${user} has ${n}2 stars`, `name has ${n * 2} stars`],
      "Template literals use backticks and run any expression inside ${ }.");
  } },
  { min: 1, f: () => {
    const keys = shuf(["id", "name", "age", "email", "role", "city"]).slice(0, ri(2, 4));
    const obj = "{ " + keys.map((k) => `${k}: ${k === "age" || k === "id" ? ri(1, 99) : `"${k}"`}`).join(", ") + " }";
    return Q(PRINT, `const user = ${obj};\nconsole.log(Object.keys(user).length)`, keys.length, [keys.length + 1, keys.length * 2, out(keys)],
      `Object.keys returns an array of the ${keys.length} property names.`);
  } },
  // Pro Dev and up
  { min: 2, f: () => {
    const a = ri(0, 9), calls = ri(2, 4);
    return Q(PRINT, `function makeCounter() {\n  let c = ${a};\n  return () => ++c;\n}\nconst next = makeCounter();\n${"next();\n".repeat(calls - 1)}console.log(next())`,
      a + calls, [a + 1, a, a + calls - 1], `The inner function keeps its own c (a closure). It was called ${calls} times in total.`);
  } },
  { min: 2, f: () => {
    const l = shuf(["A", "B", "C", "D"]);
    return Q("In which order do these print?",
      `console.log("${l[0]}");\nsetTimeout(() => console.log("${l[1]}"), 0);\nPromise.resolve().then(() => console.log("${l[2]}"));\nconsole.log("${l[3]}");`,
      `${l[0]} ${l[3]} ${l[2]} ${l[1]}`, [`${l[0]} ${l[1]} ${l[2]} ${l[3]}`, `${l[0]} ${l[3]} ${l[1]} ${l[2]}`, `${l[0]} ${l[2]} ${l[3]} ${l[1]}`],
      "Normal code runs first, then promise callbacks (microtasks), then timers (macrotasks).");
  } },
  { min: 2, f: () => {
    const n = ri(2, 4);
    return Q(PRINT, `for (var i = 0; i < ${n}; i++) {\n  setTimeout(() => console.log(i), 0);\n}`,
      Array(n).fill(n).join(" "), [Array.from({ length: n }, (_, i) => i).join(" "), Array(n).fill(0).join(" "), "Nothing"],
      `var is shared by every callback, and the loop has finished (i = ${n}) before any timer runs. let would give each pass its own i.`);
  } },
  { min: 2, f: () => {
    const a = nums(4, 1, 9);
    return Q(PRINT, `const a = ${arr(a)};\nconst b = a;\nb.push(${ri(10, 20)});\nconsole.log(a.length)`, 5, [4, 6, "undefined"],
      "b = a copies the reference, not the array. Both names point to the same array, so a grows too.");
  } },
];

/* ---------- HTML ---------- */
const TAGS = [
  ["<a>", "a link to another page"], ["<img>", "an image"], ["<ul>", "a bulleted list"], ["<ol>", "a numbered list"],
  ["<li>", "one item in a list"], ["<p>", "a paragraph"], ["<h1>", "the main heading"], ["<button>", "a clickable button"],
  ["<form>", "a form that collects input"], ["<input>", "a text box or other input field"], ["<table>", "a table of rows and columns"],
  ["<nav>", "a block of navigation links"], ["<footer>", "the bottom section of a page"], ["<header>", "the top section of a page or article"],
  ["<label>", "a caption tied to a form field"], ["<video>", "an embedded video"], ["<textarea>", "a multi-line text box"],
  ["<select>", "a drop-down list"], ["<main>", "the main content of the page"], ["<section>", "a themed section of content"],
  ["<strong>", "text with strong importance"], ["<br>", "a line break"], ["<title>", "the page title shown in the browser tab"],
];
const CSSP = [
  ["color", "the text colour"], ["background-color", "the colour behind an element"], ["font-size", "how big the text is"],
  ["margin", "space outside the border"], ["padding", "space inside the border"], ["border-radius", "how rounded the corners are"],
  ["display", "how an element is laid out, like block or flex"], ["opacity", "how see-through an element is"],
  ["z-index", "which element sits on top when they overlap"], ["text-align", "left, centre or right text alignment"],
  ["font-weight", "how bold the text is"], ["cursor", "the mouse pointer style"], ["position", "how an element is placed, like absolute or sticky"],
  ["gap", "the space between flex or grid items"], ["box-shadow", "a shadow around a box"], ["overflow", "what happens when content is too big"],
  ["transition", "smoothly animating a change"], ["line-height", "the space between lines of text"],
];
const COLORS = [["#FF0000", "Red"], ["#00FF00", "Green"], ["#0000FF", "Blue"], ["#FFFFFF", "White"], ["#000000", "Black"], ["#FFFF00", "Yellow"]];
const HTTP = [
  ["200", "OK: the request worked"], ["201", "Created: something new was made"], ["301", "Moved permanently"],
  ["400", "Bad request: the server could not understand it"], ["401", "Unauthorized: you need to log in"],
  ["403", "Forbidden: you are not allowed"], ["404", "Not found"], ["429", "Too many requests"],
  ["500", "Internal server error"], ["503", "Service unavailable"],
];
const WEB_PRO = [
  ["Use a <button> instead of a clickable <div>", "Which choice makes a control keyboard friendly with the least code?"],
  ["Lazy-load images below the fold", "Which change helps a long page load faster?"],
  ["Content-Security-Policy", "Which HTTP header limits where scripts can load from?"],
  ["HttpOnly cookies", "Which cookie setting stops JavaScript from reading a session cookie?"],
  ["transform and opacity", "Which properties are cheapest to animate?"],
  ["A media query", "What lets CSS change the layout at different screen widths?"],
  ["rem units", "Which unit scales with the user's root font size?"],
  ["aria-label", "Which attribute gives an icon-only button an accessible name?"],
  ["Escaping user input before rendering it", "What prevents cross-site scripting (XSS)?"],
  ["A service worker", "What lets a web app work offline?"],
  ["HTTPS", "What encrypts traffic between the browser and the server?"],
  ["CORS", "What browser rule controls which other sites can call your API?"],
];
const ATTRS = [
  ["href", "where a link goes"], ["src", "the file an image or script loads"], ["alt", "text that describes an image"],
  ["placeholder", "grey hint text inside an empty input"], ["required", "a form field that must be filled in"],
  ["target", "where a link opens, like a new tab"], ["lang", "the language of the page"], ["for", "which input a label belongs to"],
  ["type", "what kind of input it is, like email or password"], ["disabled", "a control that cannot be used"],
  ["id", "a unique name for one element"], ["class", "a reusable name shared by several elements"],
];
const INPUTS = [
  ["email", "an email address"], ["password", "a hidden password"], ["checkbox", "a tick box you can switch on or off"],
  ["radio", "one choice out of a group"], ["date", "a calendar date"], ["number", "a number with up and down arrows"],
  ["range", "a slider"], ["file", "a file upload"], ["color", "a colour picker"], ["search", "a search box"],
];
const HEAD_TAGS = [["<title>", true], ["<meta>", true], ["<link>", true], ["<h1>", false], ["<button>", false], ["<img>", false], ["<footer>", false]];

// HTML track (id "web" kept so saved progress still matches)
const WEB = [
  () => fromPool(TAGS, (r) => `Which tag creates ${r[1]}?`, (r) => `${r[0]} is used for ${r[1]}.`),
  () => {
    const [tag, does] = pick(TAGS);
    return Q(`What does the ${tag} tag create?`, "", does, shuf(TAGS.filter((r) => r[0] !== tag)).slice(0, 3).map((r) => r[1]), `${tag} is used for ${does}.`);
  },
  () => fromPool(ATTRS, (r) => `Which attribute sets ${r[1]}?`, (r) => `The ${r[0]} attribute sets ${r[1]}.`),
  () => fromPool(INPUTS, (r) => `Which <input type> gives you ${r[1]}?`, (r) => `type="${r[0]}" gives ${r[1]}.`),
  () => {
    const n = ri(2, 6), tag = pick(["ul", "ol"]);
    const items = Array.from({ length: n }, (_, i) => `  <li>${pick(VOCAB[0])[0].toLowerCase()}</li>`).join("\n");
    return Q("How many bullet points or numbers does this show?", `<${tag}>\n${items}\n</${tag}>`, n, [n - 1, n + 1, 1],
      `Each <li> is one item, and there are ${n} of them.`);
  },
  () => {
    const yes = HEAD_TAGS.filter((t) => t[1]), no = HEAD_TAGS.filter((t) => !t[1]);
    const right = pick(yes)[0];
    return Q("Which tag belongs inside <head>?", "", right, shuf(no).slice(0, 3).map((t) => t[0]),
      "<head> holds information about the page, like its title, meta tags and stylesheets. Visible content goes in <body>.");
  },
  () => {
    const forms = [
      ["Which link opens in a new tab?", '<a href="/" target="_blank">', ['<a href="/" new>', '<a href="/" tab="new">', '<a href="/" open="tab">'], 'target="_blank" opens the link in a new tab.'],
      ["Which image tag is written correctly?", '<img src="cat.png" alt="A sleeping cat">', ['<img>cat.png</img>', '<image src="cat.png">', '<img href="cat.png">'], "img is self-closing and uses src for the file and alt for a description."],
      ["Which label is tied to its input correctly?", '<label for="email">Email</label>', ['<label name="email">Email</label>', '<label id="email">Email</label>', '<label to="email">Email</label>'], "for must match the id of the input."],
      ["Which line starts every HTML5 page?", "<!DOCTYPE html>", ["<html5>", "<!HTML>", "<?html?>"], "The doctype tells the browser to use modern standards mode."],
    ];
    const [t, a, w, why] = pick(forms);
    return Q(t, "", a, w, why);
  },
  { min: 1, f: () => fromPool(HTTP.map(([c, m]) => [c, m]), (r) => `Which HTTP status code means "${r[1]}"?`, (r) => `${r[0]} means ${r[1]}.`) },
  { min: 1, f: () => {
    const forms = [
      ["Which tag is best for the main menu links?", "<nav>", ["<div>", "<menu-bar>", "<span>"], "<nav> tells browsers and screen readers that this is navigation."],
      ["Which tag is best for a blog post that makes sense on its own?", "<article>", ["<div>", "<span>", "<aside>"], "<article> marks self-contained content."],
      ["Which tag is best for a side note or related links?", "<aside>", ["<footer>", "<main>", "<nav>"], "<aside> holds content related to, but separate from, the main content."],
      ["Which form method sends data in the URL?", "GET", ["POST", "PUT", "SEND"], "GET adds the data to the URL as a query string; POST sends it in the request body."],
    ];
    const [t, a, w, why] = pick(forms);
    return Q(t, "", a, w, why);
  } },
  { min: 2, f: () => fromPool(WEB_PRO, (r) => r[1], (r) => `The answer is ${r[0].toLowerCase()}.`) },
];

/* ---------- CSS ---------- */
const PSEUDO = [
  [":hover", "when the mouse is over an element"], [":focus", "when an input is selected for typing"],
  [":first-child", "the first item inside its parent"], [":last-child", "the last item inside its parent"],
  [":disabled", "a form control that cannot be used"], [":checked", "a ticked checkbox or radio button"],
  ["::before", "content added before an element's text"], ["::placeholder", "the hint text inside an empty input"],
];
const UNITS = [
  ["px", "a fixed number of screen pixels"], ["rem", "a multiple of the root (html) font size"], ["em", "a multiple of the parent's font size"],
  ["%", "a share of the parent's size"], ["vw", "a share of the browser window's width"], ["vh", "a share of the browser window's height"],
  ["fr", "a share of the free space in a grid"],
];
const DISPLAY = [
  ["block", "starts on a new line and takes the full width"], ["inline", "sits in a line of text and ignores width"],
  ["flex", "lays children out in a row or column"], ["grid", "lays children out in rows and columns"], ["none", "hides the element completely"],
  ["inline-block", "sits in a line of text but accepts width and height"],
];
function nthSelected(a, b, count) {
  const hit = [];
  for (let i = 1; i <= count; i++) {
    if (a === 0 ? i === b : (i - b) % a === 0 && (i - b) / a >= 0) hit.push(i);
  }
  return hit;
}
const CSSG = [
  () => fromPool(CSSP, (r) => `Which CSS property controls ${r[1]}?`, (r) => `${r[0]} sets ${r[1]}.`),
  () => {
    const [prop, does] = pick(CSSP);
    return Q(`What does the CSS property ${prop} control?`, "", does, shuf(CSSP.filter((r) => r[0] !== prop)).slice(0, 3).map((r) => r[1]), `${prop} sets ${does}.`);
  },
  () => {
    const cls = pick(["card", "title", "menu", "hero", "btn", "price"]);
    const forms = [
      [`Which selector targets every element with class="${cls}"?`, `.${cls}`, [`#${cls}`, cls, `*${cls}`], "A dot selects by class."],
      [`Which selector targets the element with id="${cls}"?`, `#${cls}`, [`.${cls}`, cls, `@${cls}`], "A hash selects by id."],
      [`Which selector targets every <p> inside .${cls}?`, `.${cls} p`, [`p .${cls}`, `.${cls}+p`, `.${cls}, p`], `A space means descendant: p elements anywhere inside .${cls}.`],
    ];
    const [t, a, w, why] = pick(forms);
    return Q(t, "", a, w, why);
  },
  (d) => {
    const w = ri(10, 30) * 10, p = ri(1, 4) * 5, b = ri(1, 5);
    const sizing = d === 0 ? "content-box" : pick(["content-box", "border-box"]);
    const total = sizing === "content-box" ? w + 2 * p + 2 * b : w;
    return Q("How wide does this box appear on screen?",
      `.box {\n  box-sizing: ${sizing};\n  width: ${w}px;\n  padding: ${p}px;\n  border: ${b}px solid;\n}`,
      `${total}px`, [`${w}px`, `${w + p + b}px`, `${w + 2 * p}px`, `${w + 2 * p + 2 * b}px`],
      sizing === "content-box"
        ? `With content-box, padding and border are added on both sides: ${w} + ${2 * p} + ${2 * b} = ${total}.`
        : "With border-box, the width you set already includes padding and border.");
  },
  () => fromPool(COLORS.map(([hex, name]) => [name, hex]), (r) => `Which colour is ${r[1]}?`, (r) => `Hex colours are #RRGGBB. ${r[1]} is ${r[0].toLowerCase()}.`),
  () => {
    const root = pick([10, 16, 20]), r = pick([0.5, 1.5, 2, 2.5, 3]);
    return Q("How big is the title text in pixels?", `html { font-size: ${root}px; }\n.title { font-size: ${r}rem; }`, `${root * r}px`,
      [`${r}px`, `${root + r}px`, `${root * r * 2}px`, `${root}px`], `1rem equals the html font size, so ${r}rem = ${r} × ${root} = ${root * r}px.`);
  },
  () => {
    const parent = pick([12, 14, 16, 18, 20]), k = pick([0.5, 1.5, 2, 3]);
    return Q("How much padding does .tag get?", `.card { font-size: ${parent}px; }\n.card .tag { padding: ${k}em; }`, `${parent * k}px`,
      [`${16 * k}px`, `${k}px`, `${parent + k}px`], `em is relative to the element's own font size, inherited here as ${parent}px: ${k} × ${parent} = ${parent * k}px.`);
  },
  () => {
    const W = ri(4, 12) * 50, p = pick([10, 20, 25, 50, 75]);
    return Q("How wide is .child?", `.parent { width: ${W}px; }\n.child  { width: ${p}%; }`, `${(W * p) / 100}px`,
      [`${p}px`, `${W - p}px`, `${(W * p) / 50}px`], `${p}% of ${W}px is ${(W * p) / 100}px.`);
  },
  () => fromPool(PSEUDO, (r) => `Which selector matches ${r[1]}?`, (r) => `${r[0]} matches ${r[1]}.`),
  () => fromPool(UNITS, (r) => `Which CSS unit is ${r[1]}?`, (r) => `${r[0]} is ${r[1]}.`),
  () => fromPool(DISPLAY, (r) => `Which display value ${r[1]}?`, (r) => `display: ${r[0]} ${r[1]}.`),
  { min: 1, f: () => {
    const count = 8;
    const sel = pick([["odd", 2, 1], ["even", 2, 0], ["3", 0, 3], ["3n", 3, 0], ["2n+1", 2, 1], ["3n+1", 3, 1], ["n+5", 1, 5]]);
    const fix = (a, b) => (b === 0 && a > 0 ? a : b); // "even" and "3n" start at a, not 0
    const hit = nthSelected(sel[1], fix(sel[1], sel[2]), count);
    const other = [nthSelected(2, 1, count), nthSelected(2, 2, count), nthSelected(3, 3, count), nthSelected(0, 3, count), nthSelected(4, 1, count)]
      .map((x) => x.join(", "));
    return Q(`A list has 8 items. Which ones does li:nth-child(${sel[0]}) select?`, "", hit.join(", "), other,
      "nth-child counts from 1. an+b picks every a-th item starting at item b.");
  } },
  { min: 1, f: () => {
    const forms = [
      ["With display:flex, which property centres items along the main axis?", "justify-content", ["align-items", "text-align", "float"], "justify-content works on the main axis; align-items on the cross axis."],
      ["With display:flex, which property stacks items vertically?", "flex-direction: column", ["flex-wrap: wrap", "align-items: column", "display: vertical"], "flex-direction sets the main axis."],
      ["Which rule makes a 3-column grid of equal widths?", "grid-template-columns: repeat(3, 1fr)", ["columns: 3", "grid: 3 equal", "flex: 3"], "1fr is one fraction of the free space; repeat makes three."],
      ["Which value keeps a header stuck to the top while you scroll?", "position: sticky", ["position: static", "display: fixed-top", "float: top"], "sticky acts like relative until it reaches its top offset."],
      ["Which rule only applies on screens 600px wide or less?", "@media (max-width: 600px) { … }", ["@screen 600 { … }", "@media (min-width: 600px) { … }", "@phone { … }"], "max-width means up to that width, so it targets small screens."],
    ];
    const [t, a, w, why] = pick(forms);
    return Q(t, "", a, w, why);
  } },
  { min: 1, f: () => {
    const sels = shuf([["#nav", 3], [".nav a", 2], ["a", 1], ["*", 0]]).slice(0, 4);
    const best = sels.reduce((x, y) => (y[1] > x[1] ? y : x));
    return Q("Which selector has the highest specificity?", "", best[0], sels.filter((s) => s !== best).map((s) => s[0]),
      "IDs beat classes, classes beat element names, and * counts for nothing.");
  } },
  { min: 2, f: () => {
    const forms = [
      ["Which properties are cheapest to animate?", "transform and opacity", ["width and height", "top and left", "margin and padding"], "They can be handled by the GPU without recalculating layout."],
      ["What does a CSS custom property look like?", "--brand: #C8141F;", ["$brand: #C8141F;", "@brand = #C8141F;", "var brand = #C8141F;"], "Custom properties start with two dashes and are read with var(--brand)."],
      ["Which rule respects users who turn off animations?", "@media (prefers-reduced-motion: reduce)", ["@media (motion: off)", "animation: none !always", "@supports (no-motion)"], "This media query matches when the user asked the system for less motion."],
      ["Which value makes a grid wrap into as many columns as fit?", "repeat(auto-fit, minmax(200px, 1fr))", ["repeat(3, 200px)", "auto 200px", "wrap 1fr"], "auto-fit with minmax makes columns that wrap without media queries."],
    ];
    const [t, a, w, why] = pick(forms);
    return Q(t, "", a, w, why);
  } },
];

/* ---------- Logic ---------- */
const BIGO = [
  ["O(1)", "Reading arr[5] from an array"], ["O(n)", "Finding the largest number in an unsorted list"],
  ["O(log n)", "Binary search in a sorted list"], ["O(n log n)", "Merge sort"], ["O(n²)", "Comparing every pair in a list with two nested loops"],
  ["O(2ⁿ)", "Trying every subset of a set"],
];
const DS = [
  ["Stack", "last in, first out, like a pile of plates"], ["Queue", "first in, first out, like a line at a shop"],
  ["Hash map", "looks up values by key in about constant time"], ["Tree", "a parent with children, like folders on a disk"],
  ["Graph", "nodes joined by edges, like a map of roads"], ["Linked list", "items that each point to the next one"],
];
const LOGIC = [
  (d) => {
    const a = ri(1, 20), b = ri(1, 20), c = ri(1, 20);
    const ops = pick([["&&", (x, y) => x && y], ["||", (x, y) => x || y]]);
    const v = ops[1](a > b, b < c);
    return Q(PRINT, `console.log(${a} > ${b} ${ops[0]} ${b} < ${c})`, v, [!v, "undefined", "Error"],
      `${a} > ${b} is ${a > b} and ${b} < ${c} is ${b < c}. ${ops[0] === "&&" ? "&& needs both to be true" : "|| needs at least one to be true"}.`);
  },
  (d) => {
    const n = ri(3, d === 0 ? 15 : d === 1 ? 31 : 255), bin = n.toString(2);
    return Q(`The binary number ${bin} equals which decimal number?`, "", n, [n + 1, n - 1, parseInt([...bin].reverse().join(""), 2), n * 2],
      `Each binary digit is a power of 2. ${[...bin].map((x, i) => (x === "1" ? 2 ** (bin.length - 1 - i) : 0)).filter(Boolean).join(" + ")} = ${n}.`);
  },
  (d) => {
    const n = ri(3, d === 0 ? 15 : 63), bin = n.toString(2);
    return Q(`How do you write ${n} in binary?`, "", bin, [(n + 1).toString(2), (n - 1).toString(2), [...bin].reverse().join("") || "0", (n * 2).toString(2)],
      `${n} is made from powers of 2, which gives ${bin}.`);
  },
  (d) => {
    const n = ri(5, 20 + d * 10), s = ri(2, 4);
    const count = Math.ceil(n / s);
    return Q(PRINT, `let count = 0;\nfor (let i = 0; i < ${n}; i += ${s}) {\n  count++;\n}\nconsole.log(count)`, count, [count + 1, n, Math.floor(n / s) === count ? count - 1 : Math.floor(n / s)],
      `i goes 0, ${s}, ${2 * s}… and stops before reaching ${n}. That is ${count} passes.`);
  },
  (d) => {
    const a = ri(2, 5), b = ri(2, 6);
    return Q(PRINT, `let n = 0;\nfor (let i = 0; i < ${a}; i++) {\n  for (let j = 0; j < ${b}; j++) {\n    n++;\n  }\n}\nconsole.log(n)`, a * b, [a + b, a * b + 1, b],
      `The inner loop runs ${b} times for each of the ${a} outer passes: ${a} × ${b} = ${a * b}.`);
  },
  () => {
    const s = ri(30, 100);
    const g = s >= 90 ? "A" : s >= 75 ? "B" : s >= 50 ? "C" : "D";
    return Q(PRINT, `const score = ${s};\nlet grade;\nif (score >= 90) grade = "A";\nelse if (score >= 75) grade = "B";\nelse if (score >= 50) grade = "C";\nelse grade = "D";\nconsole.log(grade)`,
      g, ["A", "B", "C", "D"].filter((x) => x !== g), `Conditions are checked in order and the first true one wins. ${s} lands on "${g}".`);
  },
  (d) => {
    const kind = pick(["double", "add", "square", "fib"]);
    let seq, next, why;
    if (kind === "double") { const s = ri(1, 5); seq = [s, s * 2, s * 4, s * 8]; next = s * 16; why = "Each number doubles."; }
    if (kind === "add") { const s = ri(1, 9), k = ri(2, 9); seq = [s, s + k, s + 2 * k, s + 3 * k]; next = s + 4 * k; why = `Add ${k} each time.`; }
    if (kind === "square") { const s = ri(1, 4); seq = [s, s + 1, s + 2, s + 3].map((x) => x * x); next = (s + 4) ** 2; why = "These are square numbers."; }
    if (kind === "fib") { const a = ri(1, 3), b = ri(2, 5); seq = [a, b, a + b, a + 2 * b]; next = 2 * a + 3 * b; why = "Each number is the sum of the two before it."; }
    return Q(`What comes next? ${seq.join(", ")}, ?`, "", next, [next + 1, next - 2, seq[3] * 2 === next ? seq[3] + seq[2] : seq[3] * 2, next + seq[0]], why);
  },
  (d) => {
    const a = ri(2, 9), b = ri(2, 9), c = ri(2, 9);
    return Q(PRINT, `console.log(${a} + ${b} * ${c})`, a + b * c, [(a + b) * c, a * b + c, a + b + c],
      `Multiplication happens before addition: ${b} × ${c} = ${b * c}, then + ${a}.`);
  },
  (d) => {
    const N = ri(8, 40 + d * 200);
    let n = N, c = 0;
    while (n > 1) { n = Math.floor(n / 2); c++; }
    return Q(PRINT, `let n = ${N};\nlet steps = 0;\nwhile (n > 1) {\n  n = Math.floor(n / 2);\n  steps++;\n}\nconsole.log(steps)`, c, [c + 1, c - 1, Math.floor(N / 2)],
      `Halving ${N} until it reaches 1 takes ${c} steps. This is why halving algorithms are O(log n).`);
  },
  { min: 1, f: () => fromPool(DS, (r) => `Which data structure is ${r[1]}?`, (r) => `A ${r[0].toLowerCase()} is ${r[1]}.`) },
  { min: 1, f: () => fromPool(BIGO, (r) => `What is the usual time complexity of: ${r[1]}?`, (r) => `${r[1]} is ${r[0]}.`) },
  { min: 2, f: (d) => {
    const n = 2 ** ri(7, 20);
    const steps = Math.log2(n);
    return Q(`Binary search on ${n.toLocaleString("en-US")} sorted items needs about how many steps at most?`, "", steps,
      [Math.round(steps * 3), Math.round(n / 2).toLocaleString("en-US"), Math.round(Math.sqrt(n))],
      `Each step halves the list, and 2 to the power ${steps} is ${n.toLocaleString("en-US")}.`);
  } },
];

/* ---------- Debugging ---------- */
const ERRORS = [
  ["SyntaxError", "The code breaks the grammar rules, like a missing bracket"],
  ["ReferenceError", "You used a variable that does not exist"],
  ["TypeError", "You used a value the wrong way, like calling a number as a function"],
  ["RangeError", "A number is outside the allowed range, like an endless recursion"],
  ["404 Not Found", "The file or URL you asked for is not there"],
  ["CORS error", "The browser blocked a request to another site"],
];
const BUGS = [
  { min: 0, code: "let total = 0\nfor (let i = 0; i < 3; i++)\n  total + i;\nconsole.log(total)", q: "Why does this always print 0?", a: "total + i does not save the result; use total += i", w: ["The loop never runs", "let should be var", "console.log is wrong"] },
  { min: 0, code: 'const name = "Sam";\nconsole.log("Hello, " + Name);', q: "Why does this crash?", a: "Name has a capital N but the variable is name", w: ["Strings cannot be joined", "const cannot hold text", "console.log needs two arguments"] },
  { min: 0, code: "function add(a, b) {\n  a + b;\n}\nconsole.log(add(2, 3));", q: "Why does this print undefined?", a: "The function is missing return", w: ["2 + 3 is too big", "add is a reserved word", "Functions cannot take two inputs"] },
  { min: 0, code: '<img src="cat.png">', q: "What should be added to this image for accessibility?", a: "An alt attribute describing the image", w: ["A title tag", "A <p> wrapper", "A width of 100%"] },
  { min: 0, code: 'if (x = 10) {\n  win();\n}', q: "What is wrong here?", a: "= assigns; use === to compare", w: ["if needs an else", "10 should be a string", "win needs a semicolon"] },
  { min: 1, code: "const nums = [1, 2, 3];\nnums = [4, 5, 6];", q: "Why does this throw an error?", a: "A const variable cannot be reassigned", w: ["Arrays cannot hold numbers", "The brackets are wrong", "nums is a reserved word"] },
  { min: 1, code: "const data = fetch(url);\nconsole.log(data.name);", q: "Why is data.name undefined?", a: "fetch returns a promise; you need await and .json()", w: ["url must be a number", "console.log cannot print objects", "fetch only works on images"] },
  { min: 1, code: "button.addEventListener('click', handle());", q: "Why does handle run straight away instead of on click?", a: "handle() calls it now; pass handle without brackets", w: ["click should be onclick", "addEventListener is deprecated", "The button is hidden"] },
  { min: 1, code: "const items = [3, 1, 10, 2];\nitems.sort();\n// [1, 10, 2, 3]", q: "Why is the sorted order wrong?", a: "sort() compares as text by default; use sort((a, b) => a - b)", w: ["sort only works on strings", "The array is const", "sort reverses arrays"] },
  { min: 2, code: "for (var i = 0; i < 3; i++) {\n  setTimeout(() => console.log(i), 100);\n}\n// prints 3 3 3", q: "What is the simplest fix to print 0 1 2?", a: "Use let instead of var", w: ["Use a bigger timeout", "Use const i", "Move console.log outside the loop"] },
  { min: 2, code: "useEffect(() => {\n  setCount(count + 1);\n});", q: "Why does this React component re-render forever?", a: "The effect has no dependency array, so it runs after every render", w: ["setCount is misspelled", "useEffect cannot change state", "count must be a string"] },
  { min: 2, code: 'db.query("SELECT * FROM users WHERE name = \'" + input + "\'")', q: "What is the security bug?", a: "SQL injection: use parameterised queries", w: ["SELECT * is slow", "Strings need double quotes", "Missing semicolon"] },
  { min: 3, code: "let cache = [];\nsetInterval(() => cache.push(bigData()), 1000);", q: "Why does memory keep growing?", a: "cache is never cleared, so old data is never freed", w: ["setInterval is too fast", "push copies the whole array", "bigData is async"] },
  { min: 3, code: "let balance = await getBalance();\nbalance -= amount;\nawait saveBalance(balance);", q: "Two of these run at the same time. What can go wrong?", a: "A race condition: one update can overwrite the other", w: ["A syntax error", "A memory leak", "Nothing, await prevents it"] },
];
const DEBUG = [
  (d) => {
    const pool = BUGS.filter((b) => b.min <= d);
    const b = pick(pool);
    return Q(b.q, b.code, b.a, b.w, b.a + ".");
  },
  () => fromPool(ERRORS, (r) => `Which error means: ${r[1].charAt(0).toLowerCase() + r[1].slice(1)}?`, (r) => `${r[0]}: ${r[1]}.`),
  () => {
    const nm = pick(names), a = nums(ri(3, 5), 1, 9);
    return Q("What is the bug in this loop?", `const ${nm} = ${arr(a)};\nfor (let i = 0; i <= ${nm}.length; i++) {\n  console.log(${nm}[i]);\n}`,
      "Off by one: use < instead of <=", ["The array should be let", "i should start at 1", `${nm}.length is a function`],
      `Indexes run from 0 to ${a.length - 1}. With <= the loop also reads ${nm}[${a.length}], which is undefined.`);
  },
  (d) => {
    const a = ri(2, 9), b = ri(2, 9);
    return Q(PRINT, `const price = "${a}";\nconst tax = ${b};\nconsole.log(price + tax)`, `${a}${b}`, [a + b, "NaN", "Error"],
      `price is a string, so + joins instead of adding. Convert first with Number(price).`);
  },
  () => {
    const v = pick(["score", "total", "count", "player"]);
    const cap = v[0].toUpperCase() + v.slice(1);
    return Q("What happens when this runs?", `let ${v} = 5;\nconsole.log(${cap});`, `ReferenceError: ${cap} is not defined`,
      ["It prints 5", "It prints undefined", "It prints null"], "JavaScript names are case-sensitive, so " + cap + " and " + v + " are different variables.");
  },
  { min: 1, f: () => {
    const n = ri(2, 5);
    return Q(PRINT, `const user = { name: "Ava" };\nconsole.log(user.profile?.age ?? ${n})`, n, ["undefined", "Error", "null"],
      "?. stops safely when profile is missing and returns undefined, then ?? swaps in the fallback.");
  } },
];

/* ---------- Python ---------- */
const pyList = (a) => "[" + a.map((x) => (typeof x === "string" ? `'${x}'` : x)).join(", ") + "]";
const PY_TYPES = [["7", "int"], ['"7"', "str"], ["7.0", "float"], ["True", "bool"], ["[7]", "list"], ["{}", "dict"], ["None", "NoneType"], ["(7,)", "tuple"]];
const PY_CONCEPTS = [
  ["Indentation", "What does Python use to show which lines belong inside a loop or if?"],
  ["def", "Which keyword starts a function in Python?"],
  ["None", "Which value means 'nothing' in Python?"],
  ["try / except", "How do you catch an error in Python?"],
  ["A tuple", "Which Python type is like a list but cannot be changed?"],
  ["pip", "Which tool installs Python packages?"],
  ["__init__", "Which method runs when you create an object from a class?"],
  ["import", "Which keyword loads code from another module?"],
];
const PY = [
  (d) => {
    const a = ri(2, 9 + d * 5), b = ri(2, 9), m = ri(2, 4);
    return Q(PRINT, `x = ${a}\nx += ${b}\nprint(x * ${m})`, (a + b) * m, [a + b * m, a + b, a * b * m], `x becomes ${a + b}, then ${a + b} × ${m} = ${(a + b) * m}.`);
  },
  (d) => {
    const a = ri(10, 50 + d * 20), b = ri(2, 9);
    return Q(PRINT, `print(${a} // ${b}, ${a} % ${b})`, `${Math.floor(a / b)} ${a % b}`,
      [`${(a / b).toFixed(1)} ${a % b}`, `${a % b} ${Math.floor(a / b)}`, `${Math.floor(a / b)} 0`],
      `// is whole-number division and % is the remainder: ${a} = ${b} × ${Math.floor(a / b)} + ${a % b}.`);
  },
  () => {
    const a = ri(2, 5), b = ri(2, 4);
    return Q(PRINT, `print(${a} ** ${b})`, a ** b, [a * b, a + b, b ** a === a ** b ? a ** b + 1 : b ** a], `** means "to the power of": ${a} to the power ${b} is ${a ** b}.`);
  },
  () => {
    const w = pick(VOCAB[0].filter((r) => r[0].length >= 4))[0].toLowerCase();
    const forms = [
      [`word = "${w}"\nprint(word[1:3])`, w.slice(1, 3), [w.slice(0, 3), w.slice(1, 4), w.slice(0, 2)], "Slices start at the first number and stop before the second."],
      [`word = "${w}"\nprint(word[-1])`, w[w.length - 1], [w[0], w[w.length - 2], "Error"], "-1 is the last character."],
      [`word = "${w}"\nprint(word[::-1])`, [...w].reverse().join(""), [w, w.toUpperCase(), w.slice(1)], "[::-1] steps backwards through the whole string."],
      [`word = "${w}"\nprint(len(word))`, w.length, [w.length - 1, w.length + 1, w], `len counts the ${w.length} characters.`],
      [`word = "${w}"\nprint(word.upper())`, w.toUpperCase(), [w, w[0].toUpperCase() + w.slice(1), "Error"], "upper() returns a capitalised copy."],
      [`word = "${w}"\nprint(word.capitalize())`, w[0].toUpperCase() + w.slice(1), [w.toUpperCase(), w, "Error"], "capitalize() makes only the first letter a capital."],
    ];
    const [code, ans, wrong, why] = pick(forms);
    return Q(PRINT, code, ans, wrong, why);
  },
  () => {
    const n = ri(3, 5), a = nums(n, 1, 20), v = ri(1, 30);
    return Q(PRINT, `nums = ${pyList(a)}\nnums.append(${v})\nprint(len(nums))`, n + 1, [n, n + 2, v], `append adds one item, so there are now ${n + 1}.`);
  },
  () => {
    const a = nums(ri(4, 5), 1, 30);
    const forms = [
      [`nums = ${pyList(a)}\nprint(nums[-1])`, a[a.length - 1], [a[0], a[a.length - 2], "Error"], "Negative indexes count from the end; -1 is the last item."],
      [`nums = ${pyList(a)}\nprint(sum(nums))`, a.reduce((x, y) => x + y, 0), [a.length, Math.max(...a), a.reduce((x, y) => x + y, 0) - a[0]], "sum adds every item."],
      [`nums = ${pyList(a)}\nprint(sorted(nums))`, pyList([...a].sort((x, y) => x - y)), [pyList(a), pyList([...a].sort((x, y) => y - x)), pyList([...a].reverse())], "sorted returns a new list from smallest to largest."],
      [`nums = ${pyList(a)}\nprint(max(nums) - min(nums))`, Math.max(...a) - Math.min(...a), [Math.max(...a), Math.min(...a), Math.max(...a) + Math.min(...a)], "max and min find the biggest and smallest items."],
    ];
    const [code, ans, wrong, why] = pick(forms);
    return Q(PRINT, code, ans, wrong, why);
  },
  () => {
    const a = nums(ri(3, 5), 1, 9), m = ri(2, 4);
    const forms = [
      [`nums = ${pyList(a)}\nprint([x * ${m} for x in nums])`, pyList(a.map((x) => x * m)), [pyList(a), pyList(a.map((x) => x + m)), String(a.reduce((s, x) => s + x * m, 0))], "A list comprehension builds a new list from every item."],
      [`nums = ${pyList(a)}\nprint([x for x in nums if x % 2 == 0])`, pyList(a.filter((x) => x % 2 === 0)), [pyList(a.filter((x) => x % 2)), pyList(a), String(a.filter((x) => x % 2 === 0).length)], "The if part keeps only the even numbers."],
    ];
    const [code, ans, wrong, why] = pick(forms);
    return Q(PRINT, code, ans, wrong, why);
  },
  (d) => {
    const n = ri(3, 6 + d * 2);
    const total = (n * (n - 1)) / 2;
    return Q(PRINT, `total = 0\nfor i in range(${n}):\n    total += i\nprint(total)`, total, [total + n, (n * (n + 1)) / 2 === total + n ? total + 1 : (n * (n + 1)) / 2, n],
      `range(${n}) gives 0 up to ${n - 1}. Adding those gives ${total}.`);
  },
  () => {
    const a = ri(0, 4), b = a + ri(2, 5);
    const r = Array.from({ length: b - a }, (_, i) => a + i);
    return Q(PRINT, `print(list(range(${a}, ${b})))`, pyList(r), [pyList([...r, b]), pyList(r.slice(1)), pyList([...r.slice(1), b])], `range stops before ${b}.`);
  },
  () => {
    const name = pick(["Ava", "Kai", "Leo", "Mia", "Zoe"]), n = ri(2, 9);
    return Q(PRINT, `name = "${name}"\nprint(f"{name} has {${n} * 2} points")`, `${name} has ${n * 2} points`,
      [`{name} has {${n} * 2} points`, `${name} has ${n} * 2 points`, `name has ${n * 2} points`], "An f-string runs the code inside { } and puts the result in the text.");
  },
  () => {
    const people = shuf(["ava", "kai", "leo", "mia", "zoe"]).slice(0, 3), ages = nums(3, 8, 15);
    const dict = "{" + people.map((p, i) => `"${p}": ${ages[i]}`).join(", ") + "}";
    const forms = [
      [`ages = ${dict}\nprint(ages["${people[1]}"])`, ages[1], [ages[0], ages[2], `"${people[1]}"`], "A dictionary looks values up by key."],
      [`ages = ${dict}\nprint(ages.get("sam", 0))`, 0, ["None", "Error", ages[0]], "get returns the default (0 here) when the key is missing."],
      [`ages = ${dict}\nprint(len(ages))`, 3, [6, 2, ages.reduce((x, y) => x + y, 0)], "len counts the keys."],
    ];
    const [code, ans, wrong, why] = pick(forms);
    return Q(PRINT, code, ans, wrong, why);
  },
  () => {
    const [v, t] = pick(PY_TYPES);
    return Q(PRINT, `print(type(${v}).__name__)`, t, shuf(PY_TYPES.filter((x) => x[1] !== t)).slice(0, 3).map((x) => x[1]), `${v} is a ${t}.`);
  },
  () => {
    const a = ri(2, 9), b = ri(1, 9), k = ri(2, 4), s = pick(["ab", "hi", "go", "xo"]);
    const forms = [
      [`print("${s}" * ${k})`, s.repeat(k), [`${s}${k}`, "Error", s], "Multiplying a string repeats it."],
      [`print("${a}" + "${b}")`, `${a}${b}`, [a + b, "Error", `${a} ${b}`], "+ joins two strings."],
      [`print(int("${a}") + ${b})`, a + b, [`${a}${b}`, "Error", a], "int() turns the text into a number first."],
      [`print("${a}" + ${b})`, "TypeError", [`${a}${b}`, a + b, "None"], "Python will not mix str and int with +. Convert one of them first."],
    ];
    const [code, ans, wrong, why] = pick(forms);
    return Q(code.includes(`"${a}" + ${b})`) ? "What happens when this runs?" : PRINT, code, ans, wrong, why);
  },
  () => {
    const a = ri(1, 20), b = ri(1, 20), c = ri(1, 20);
    const op = pick(["and", "or"]);
    const v = op === "and" ? a > b && b < c : a > b || b < c;
    return Q(PRINT, `print(${a} > ${b} ${op} ${b} < ${c})`, v ? "True" : "False", [v ? "False" : "True", "true", "None"], "Python writes True and False with capital letters.");
  },
  () => fromPool(PY_CONCEPTS, (r) => r[1], (r) => `${r[0]}.`),
  { min: 1, f: () => {
    const a = ri(1, 9), b = ri(10, 20);
    return Q(PRINT, `a, b = ${a}, ${b}\na, b = b, a\nprint(a, b)`, `${b} ${a}`, [`${a} ${b}`, `${b} ${b}`, `${a} ${a}`], "Tuple unpacking swaps both values in one step.");
  } },
  { min: 1, f: () => {
    const words = shuf(["red", "green", "blue", "gold", "mint"]).slice(0, ri(2, 4)), sep = pick(["-", ", ", " "]);
    return Q(PRINT, `words = ${pyList(words)}\nprint("${sep}".join(words))`, words.join(sep), [pyList(words), words.join(""), words.reverse().join(sep)],
      "join puts the separator between every item.");
  } },
  { min: 1, f: () => {
    const t = shuf(["a", "b", "c", "d"]).slice(0, ri(2, 4));
    return Q(PRINT, `print("${t.join(",")}".split(","))`, pyList(t), [t.join(""), `['${t.join(",")}']`, String(t.length)], "split breaks the text at every comma and returns a list.");
  } },
  { min: 1, f: () => {
    const a = ri(10, 30), b = pick([3, 4, 8]);
    const div = a / b;
    return Q(PRINT, `print(${a} / ${b})`, Number.isInteger(div) ? div.toFixed(1) : String(div), [Math.floor(div), Math.round(div), a % b], "/ always gives a float in Python 3, even when it divides evenly.");
  } },
  { min: 2, f: () => {
    const n = ri(2, 4);
    const d = "{" + Array.from({ length: n }, (_, i) => `${i}: ${i * i}`).join(", ") + "}";
    return Q(PRINT, `print({x: x * x for x in range(${n})})`, d,
      ["{" + Array.from({ length: n }, (_, i) => `${i}: ${i * 2}`).join(", ") + "}", pyList(Array.from({ length: n }, (_, i) => i * i)), "{" + Array.from({ length: n }, (_, i) => `${i * i}: ${i}`).join(", ") + "}"],
      "A dict comprehension makes key: value pairs.");
  } },
  { min: 2, f: () => {
    // one word of each length, so the order by length is never a tie
    const words = shuf([pick(["fig", "pea", "yam"]), pick(["kiwi", "plum", "pear"]), pick(["banana", "cherry", "orange"])]);
    const sorted = [...words].sort((x, y) => x.length - y.length);
    return Q(PRINT, `words = ${pyList(words)}\nprint(sorted(words, key=len))`, pyList(sorted), [pyList([...words].sort()), pyList(words), pyList([...sorted].reverse())],
      "key=len sorts by length, shortest first.");
  } },
  { min: 2, f: () => {
    const a = nums(2, 1, 9), l = shuf(["a", "b", "c"]).slice(0, 2);
    return Q(PRINT, `print(list(zip(${pyList(a)}, ${pyList(l)})))`, `[(${a[0]}, '${l[0]}'), (${a[1]}, '${l[1]}')]`,
      [`[${a[0]}, '${l[0]}', ${a[1]}, '${l[1]}']`, `[(${a[0]}, ${a[1]}), ('${l[0]}', '${l[1]}')]`, `{${a[0]}: '${l[0]}', ${a[1]}: '${l[1]}'}`],
      "zip pairs up items at the same position.");
  } },
  { min: 3, f: () => {
    const a = ri(1, 9), b = ri(10, 20);
    return Q(PRINT, `def add(item, bag=[]):\n    bag.append(item)\n    return bag\n\nadd(${a})\nprint(add(${b}))`, pyList([a, b]), [pyList([b]), pyList([a]), "None"],
      "The default list is created once and shared between calls. Use bag=None and create the list inside.");
  } },
];

/* ---------- SQL ---------- */
const SQL_NAMES = ["Ava", "Ben", "Cleo", "Dan", "Eli", "Fay", "Gus", "Hana", "Ivan", "Jade"];
function makeTable() {
  const n = ri(5, 7);
  const names = shuf(SQL_NAMES).slice(0, n);
  const scores = shuf(Array.from({ length: 60 }, (_, i) => 40 + i)).slice(0, n); // all different
  return names.map((name, i) => ({ name, age: ri(11, 14), score: scores[i] }));
}
function showTable(rows) {
  const pad = (s, w) => String(s).padEnd(w);
  return "students\n" + "name  | age | score\n" + rows.map((r) => `${pad(r.name, 5)} | ${pad(r.age, 3)} | ${r.score}`).join("\n");
}
const SQL_CONCEPTS = [
  ["PRIMARY KEY", "Which constraint gives every row a unique id?"],
  ["FOREIGN KEY", "Which constraint links a column to a row in another table?"],
  ["INNER JOIN", "Which join keeps only rows that match in both tables?"],
  ["LEFT JOIN", "Which join keeps every row from the first table, even without a match?"],
  ["HAVING", "Which clause filters groups after GROUP BY?"],
  ["IS NULL", "How do you check for a missing value in SQL?"],
  ["An index", "What makes lookups on a column much faster?"],
  ["A transaction", "What makes several statements succeed or fail together?"],
  ["Parameterised queries", "What is the best protection against SQL injection?"],
  ["DISTINCT", "Which keyword removes duplicate rows from a result?"],
];
const SQL_STATEMENTS = [
  ["INSERT INTO", "adds a new row"], ["UPDATE", "changes existing rows"], ["DELETE FROM", "removes rows"],
  ["SELECT", "reads rows"], ["CREATE TABLE", "makes a new table"], ["DROP TABLE", "deletes a whole table"],
];
const SQLG = [
  () => {
    const rows = makeTable(), t = ri(50, 90);
    const c = rows.filter((r) => r.score > t).length;
    return Q("What does this query return?", `${showTable(rows)}\n\nSELECT COUNT(*) FROM students\nWHERE score > ${t};`, c,
      [rows.length - c, rows.filter((r) => r.score >= t - 10).length === c ? c + 1 : rows.filter((r) => r.score >= t - 10).length, rows.length], `${c} students have a score above ${t}.`, [0]);
  },
  () => {
    const rows = makeTable();
    const top = [...rows].sort((a, b) => b.score - a.score)[0], low = [...rows].sort((a, b) => a.score - b.score)[0];
    return Q("What does this query return?", `${showTable(rows)}\n\nSELECT name FROM students\nORDER BY score DESC\nLIMIT 1;`, top.name,
      [low.name, rows[0].name === top.name ? rows[1].name : rows[0].name, rows[rows.length - 1].name === top.name ? rows[1].name : rows[rows.length - 1].name], "DESC sorts highest first, and LIMIT 1 keeps only the top row.", SQL_NAMES);
  },
  () => {
    const rows = makeTable(), f = pick(["MAX", "MIN"]);
    const v = f === "MAX" ? Math.max(...rows.map((r) => r.score)) : Math.min(...rows.map((r) => r.score));
    const o = f === "MAX" ? Math.min(...rows.map((r) => r.score)) : Math.max(...rows.map((r) => r.score));
    return Q("What does this query return?", `${showTable(rows)}\n\nSELECT ${f}(score) FROM students;`, v, [o, rows[0].score === v ? rows[1].score : rows[0].score, rows.length],
      `${f} returns the ${f === "MAX" ? "highest" : "lowest"} value in the column.`);
  },
  () => {
    const rows = makeTable(), a = ri(12, 13);
    const hits = rows.filter((r) => r.age >= a);
    const s = hits.length ? hits.reduce((x, r) => x + r.score, 0) : "NULL"; // SUM of no rows is NULL, not 0
    const all = rows.reduce((x, r) => x + r.score, 0);
    return Q("What does this query return?", `${showTable(rows)}\n\nSELECT SUM(score) FROM students\nWHERE age >= ${a};`, s,
      [all === s ? s + 10 : all, rows.filter((r) => r.age > a).reduce((x, r) => x + r.score, 0) === s ? s + 1 : rows.filter((r) => r.age > a).reduce((x, r) => x + r.score, 0), rows.filter((r) => r.age >= a).length],
      hits.length ? `Add the scores of everyone aged ${a} or older.` : `Nobody is ${a} or older, and SUM of no rows is NULL, not 0.`, ["NULL", 0]);
  },
  () => {
    const rows = makeTable();
    const d = new Set(rows.map((r) => r.age)).size;
    return Q("What does this query return?", `${showTable(rows)}\n\nSELECT COUNT(DISTINCT age) FROM students;`, d, [rows.length, d + 1, d - 1 || d + 2],
      "DISTINCT counts each age only once.");
  },
  () => {
    const rows = makeTable(), letter = pick(rows).name[0];
    const c = rows.filter((r) => r.name.startsWith(letter)).length;
    return Q("What does this query return?", `${showTable(rows)}\n\nSELECT COUNT(*) FROM students\nWHERE name LIKE '${letter}%';`, c, [0, rows.length, c + 1],
      `% matches any characters, so '${letter}%' means names starting with ${letter}.`);
  },
  () => fromPool(SQL_STATEMENTS, (r) => `Which SQL statement ${r[1]}?`, (r) => `${r[0]} ${r[1]}.`),
  { min: 1, f: () => {
    const rows = makeTable();
    const d = new Set(rows.map((r) => r.age)).size;
    return Q("How many rows does this query return?", `${showTable(rows)}\n\nSELECT age, COUNT(*) FROM students\nGROUP BY age;`, d, [rows.length, 1, d + 1],
      "GROUP BY makes one row for each different age.");
  } },
  { min: 1, f: () => fromPool(SQL_CONCEPTS, (r) => r[1], (r) => `${r[0]}.`) },
  { min: 1, f: () => {
    const forms = [
      ["What goes wrong here?", "UPDATE students SET score = 100;", "Every row is changed because there is no WHERE", ["Nothing, only one row changes", "It is a syntax error", "It deletes the table"], "Without WHERE, UPDATE applies to every row."],
      ["Why does this find nobody, even though some emails are missing?", "SELECT * FROM users\nWHERE email = NULL;", "NULL must be checked with IS NULL", ["email should be in quotes", "NULL is not a real value in SQL", "SELECT * is not allowed"], "Nothing is ever equal to NULL, not even NULL. Use IS NULL."],
      ["Why does this fail?", "SELECT name, COUNT(*) FROM students;", "name is not in a GROUP BY", ["COUNT needs a column name", "SELECT cannot have two columns", "students must be in quotes"], "Mixing a plain column with an aggregate needs GROUP BY name."],
    ];
    const [t, code, a, w, why] = pick(forms);
    return Q(t, code, a, w, why);
  } },
];

/* ---------- PHP ---------- */
const PHP_CONCEPTS = [
  ["$", "Which symbol starts every variable name in PHP?"], ["<?php", "Which tag starts a block of PHP code?"],
  ["->", "Which operator calls a method on an object?"], ["=>", "Which symbol pairs a key with a value in an array?"],
  ["$_POST", "Which variable holds data sent by a form using method=\"post\"?"], ["session_start()", "Which function must run before you use $_SESSION?"],
  ["isset()", "Which function checks that a variable exists and is not null?"], ["Prepared statements with PDO", "What is the safe way to put user input into an SQL query?"],
  ["require", "Which statement stops the script with an error if the file is missing?"], ["echo", "Which statement prints text to the page?"],
];
const PHPG = [
  (d) => {
    const a = ri(2, 9 + d * 5), b = ri(2, 9), m = ri(2, 4);
    return Q(PRINT, `$a = ${a};\n$b = ${b};\necho $a + $b * ${m};`, a + b * m, [(a + b) * m, a + b, `${a}${b * m}`], `Multiplication first: ${b} × ${m} = ${b * m}, plus ${a}.`);
  },
  () => {
    const name = pick(["Ava", "Kai", "Leo", "Mia", "Zoe"]);
    return Q(PRINT, `$name = "${name}";\necho "Hi " . $name . "!";`, `Hi ${name}!`, [`Hi $name!`, `Hi. ${name}.!`, `Hi ${name}`], "The dot . joins strings in PHP.");
  },
  () => {
    const a = ri(2, 9), b = ri(1, 9);
    const forms = [
      [`echo "${a}" + ${b};`, a + b, [`${a}${b}`, "Error", a], "+ always does maths in PHP, so the string becomes a number."],
      [`echo "${a}" . ${b};`, `${a}${b}`, [a + b, "Error", `${a}.${b}`], ". always joins as text."],
    ];
    const [code, ans, wrong, why] = pick(forms);
    return Q(PRINT, code, ans, wrong, why);
  },
  () => {
    const w = pick(VOCAB[0].filter((r) => r[0].length >= 4))[0].toLowerCase();
    const forms = [
      [`echo strlen("${w}");`, w.length, [w.length - 1, w.length + 1, w], "strlen counts the characters."],
      [`echo strtoupper("${w}");`, w.toUpperCase(), [w, w[0].toUpperCase() + w.slice(1), "1"], "strtoupper capitalises every letter."],
      [`echo ucfirst("${w}");`, w[0].toUpperCase() + w.slice(1), [w.toUpperCase(), w, "1"], "ucfirst capitalises only the first letter."],
      [`echo strrev("${w}");`, [...w].reverse().join(""), [w, w.toUpperCase(), w.slice(1)], "strrev reverses the string."],
      [`echo substr("${w}", 1, 2);`, w.substr(1, 2), [w.substr(0, 2), w.substr(1, 3), w.substr(2, 2)], "substr(string, start, length) starts at index 1 and takes 2 characters."],
      [`echo str_repeat("${w.slice(0, 2)}", 3);`, w.slice(0, 2).repeat(3), [`${w.slice(0, 2)}3`, w.slice(0, 2), "Error"], "str_repeat repeats the text."],
    ];
    const [code, ans, wrong, why] = pick(forms);
    return Q(PRINT, code, ans, wrong, why);
  },
  () => {
    const a = nums(ri(3, 5), 1, 20);
    const forms = [
      [`$nums = [${a.join(", ")}];\necho count($nums);`, a.length, [a.length - 1, a.length + 1, a.reduce((x, y) => x + y, 0)], "count returns the number of items."],
      [`$nums = [${a.join(", ")}];\necho array_sum($nums);`, a.reduce((x, y) => x + y, 0), [a.length, Math.max(...a), a.reduce((x, y) => x + y, 0) - a[0]], "array_sum adds every item."],
      [`$nums = [${a.join(", ")}];\necho $nums[1];`, a[1], [a[0], a[2], "Error"], "Indexes start at 0, so [1] is the second item."],
      [`$nums = [${a.join(", ")}];\necho max($nums);`, Math.max(...a), [Math.min(...a), a[0] === Math.max(...a) ? a[1] : a[0], a.length], "max returns the largest value."],
      [`$nums = [${a.join(", ")}];\necho implode("-", $nums);`, a.join("-"), [a.join(""), a.join(", "), "Array"], "implode joins array items with the separator."],
    ];
    const [code, ans, wrong, why] = pick(forms);
    return Q(PRINT, code, ans, wrong, why);
  },
  (d) => {
    const n = ri(3, 6 + d * 2);
    const s = (n * (n + 1)) / 2;
    return Q(PRINT, `$total = 0;\nfor ($i = 1; $i <= ${n}; $i++) {\n    $total += $i;\n}\necho $total;`, s, [s - n, s + n + 1, n], `The loop adds 1 up to ${n}, giving ${s}.`);
  },
  () => {
    const age = ri(8, 15), name = pick(["Ava", "Kai", "Leo"]);
    const forms = [
      [`$user = ["name" => "${name}", "age" => ${age}];\necho $user["age"];`, age, [name, "Array", "Error"], "Keys look up values in an associative array."],
      [`$user = ["name" => "${name}", "age" => ${age}];\necho count($user);`, 2, [1, 4, age], "There are two key => value pairs."],
    ];
    const [code, ans, wrong, why] = pick(forms);
    return Q(PRINT, code, ans, wrong, why);
  },
  (d) => {
    const a = ri(10, 50), b = ri(2, 9);
    const forms = [
      [`echo intdiv(${a}, ${b});`, Math.floor(a / b), [(a / b).toFixed(2), a % b, Math.ceil(a / b) === Math.floor(a / b) ? Math.floor(a / b) + 1 : Math.ceil(a / b)], "intdiv drops the decimal part."],
      [`echo ${a} % ${b};`, a % b, [Math.floor(a / b), b - (a % b), (a % b) + 1], "% gives the remainder."],
    ];
    const [code, ans, wrong, why] = pick(forms);
    return Q(PRINT, code, ans, wrong, why);
  },
  () => {
    const n = ri(2, 9);
    const forms = [
      [`$n = ${n};\necho "I have $n apples";`, `I have ${n} apples`, ["I have $n apples", "I have apples", "Error"], "Double quotes put the variable's value into the text."],
      [`$n = ${n};\necho 'I have $n apples';`, "I have $n apples", [`I have ${n} apples`, "I have apples", "Error"], "Single quotes print the text exactly as written."],
    ];
    const [code, ans, wrong, why] = pick(forms);
    return Q(PRINT, code, ans, wrong, why);
  },
  () => fromPool(PHP_CONCEPTS, (r) => r[1], (r) => `${r[0]}.`),
  { min: 1, f: () => {
    const g = pick(["guest", "friend", "player"]);
    const forms = [
      [`$name = null;\necho $name ?? "${g}";`, g, ["null", "", "Error"], "?? uses the right side when the left is null or missing."],
      [`function greet($who = "${g}") {\n    return "Hi $who";\n}\necho greet();`, `Hi ${g}`, ["Hi $who", "Hi ", "Error"], "When no argument is passed, the default value is used."],
      [`foreach (["a", "b", "c"] as $i => $v) {\n    echo $i;\n}`, "012", ["abc", "123", "a0b1c2"], "$i is the index, starting at 0."],
    ];
    const [code, ans, wrong, why] = pick(forms);
    return Q(PRINT, code, ans, wrong, why);
  } },
  { min: 2, f: () => {
    const forms = [
      ['var_dump("1" === 1);', "bool(false)", ["bool(true)", "int(1)", "NULL"], "=== also checks the type, and a string is not an int."],
      ['var_dump("1" == 1);', "bool(true)", ["bool(false)", "int(1)", "NULL"], "== converts the string to a number before comparing."],
      ['var_dump(0 == "a");', "bool(false)", ["bool(true)", "int(0)", "NULL"], 'Since PHP 8, comparing a number with a non-numeric string compares them as strings, so 0 == "a" is false.'],
    ];
    const [code, ans, wrong, why] = pick(forms);
    return Q(PRINT, code, ans, wrong, why);
  } },
];

/* ---------- Networking ---------- */
const ipInt = (ip) => ip.split(".").reduce((a, o) => a * 256 + +o, 0);
const intIp = (n) => [24, 16, 8, 0].map((s) => Math.floor(n / 2 ** s) % 256).join(".");
const maskInt = (p) => (p === 0 ? 0 : (2 ** 32 - 2 ** (32 - p)));
const netOf = (ip, p) => intIp(Math.floor(ipInt(ip) / 2 ** (32 - p)) * 2 ** (32 - p));
const bcastOf = (ip, p) => intIp(ipInt(netOf(ip, p)) + 2 ** (32 - p) - 1);
const randIp = () => pick([() => `192.168.${ri(0, 255)}.${ri(1, 254)}`, () => `10.${ri(0, 255)}.${ri(0, 255)}.${ri(1, 254)}`, () => `172.${ri(16, 31)}.${ri(0, 255)}.${ri(1, 254)}`])();
const prefixFor = (d) => (d === 0 ? 24 : d === 1 ? pick([24, 25, 26, 27, 28]) : ri(17, 30));
const PORTS = [
  ["22", "SSH"], ["21", "FTP"], ["23", "Telnet"], ["25", "SMTP (sending email)"], ["53", "DNS"], ["67", "DHCP"], ["80", "HTTP"],
  ["110", "POP3"], ["123", "NTP (time sync)"], ["143", "IMAP"], ["161", "SNMP"], ["443", "HTTPS"], ["3306", "MySQL"],
  ["5432", "PostgreSQL"], ["3389", "Remote Desktop (RDP)"], ["6379", "Redis"], ["27017", "MongoDB"], ["389", "LDAP"],
  ["445", "SMB file sharing"], ["69", "TFTP"], ["1433", "Microsoft SQL Server"], ["5900", "VNC"],
];
const OSI = ["Layer 1 – Physical", "Layer 2 – Data Link", "Layer 3 – Network", "Layer 4 – Transport", "Layer 5 – Session", "Layer 6 – Presentation", "Layer 7 – Application"];
const OSI_ITEMS = [
  ["a network cable", 1], ["a hub", 1], ["radio signals in Wi-Fi", 1], ["a switch", 2], ["MAC addresses", 2], ["Ethernet frames", 2],
  ["ARP", 2], ["a network card (NIC)", 2], ["a router", 3], ["IP addresses", 3], ["ICMP (ping)", 3], ["packets", 3],
  ["TCP", 4], ["UDP", 4], ["port numbers", 4], ["segments", 4], ["HTTP", 7], ["DNS", 7], ["SMTP", 7], ["FTP", 7], ["SSH", 7],
  ["encryption and data formats like JPEG", 6], ["opening and closing sessions between apps", 5],
];
const NET_FACTS = [
  ["DNS", "turns a name like example.com into an IP address"], ["DHCP", "hands out IP addresses to devices automatically"],
  ["NAT", "lets many private devices share one public IP address"], ["ARP", "finds the MAC address that belongs to an IP address"],
  ["A VLAN", "splits one physical switch into separate logical networks"], ["A VPN", "creates an encrypted tunnel over the internet"],
  ["A default gateway", "is the router a device sends traffic to when the destination is on another network"],
  ["A MAC address", "is the hardware address burned into a network card"], ["Latency", "is the delay before data arrives"],
  ["Bandwidth", "is the maximum amount of data a link can carry per second"], ["Packet loss", "is data that never reaches its destination"],
  ["TTL", "limits how many hops a packet can make before it is dropped"], ["A CDN", "serves copies of content from servers close to the user"],
  ["A load balancer", "spreads traffic across several servers"], ["A proxy server", "makes requests on behalf of a client"],
  ["A firewall", "allows or blocks traffic based on rules"], ["TLS", "encrypts data travelling between a browser and a server"],
  ["A subnet", "is a smaller network carved out of a bigger one"], ["Broadcast", "sends one message to every device on the network"],
  ["Multicast", "sends one message to a chosen group of devices"], ["Unicast", "sends a message to exactly one device"],
  ["A LAN", "covers a home, office or building"], ["A WAN", "connects networks across cities or countries"],
  ["A star topology", "connects every device to one central switch"], ["A mesh topology", "connects devices to many others for redundancy"],
  ["A switch", "forwards frames to the right port using MAC addresses"], ["A router", "forwards packets between different networks"],
  ["An access point", "lets wireless devices join a wired network"], ["Jitter", "is the variation in delay between packets"],
  ["Port forwarding", "sends traffic arriving on a router port to a device inside the network"], ["QoS", "gives important traffic, like calls, priority"],
  ["IPv6", "uses 128-bit addresses"], ["IPv4", "uses 32-bit addresses"], ["SSID", "is the name of a Wi-Fi network"],
  ["WPA3", "is the newest Wi-Fi security standard"], ["Loopback 127.0.0.1", "always points back to your own computer"],
];
const DNS_RECORDS = [["A", "maps a name to an IPv4 address"], ["AAAA", "maps a name to an IPv6 address"], ["CNAME", "points one name at another name"],
  ["MX", "says which server receives email for the domain"], ["TXT", "holds text, often used to verify domain ownership"], ["NS", "names the domain's DNS servers"], ["PTR", "maps an IP address back to a name"]];
const NET_CMDS = [["ping", "check whether a host is reachable"], ["traceroute", "see every hop a packet takes to reach a host"],
  ["nslookup", "look up the IP address of a domain name"], ["ipconfig / ifconfig", "show your computer's IP settings"],
  ["netstat", "list open connections and listening ports"], ["ssh", "log in to a remote machine securely"], ["curl", "send an HTTP request from the terminal"],
  ["arp -a", "show the IP-to-MAC table your computer has learned"]];
const TCP_UDP = [["TCP", "guarantees delivery and order"], ["UDP", "is faster but may lose packets"], ["TCP", "starts with a three-way handshake"],
  ["UDP", "suits live video calls and online games"], ["TCP", "is used by HTTP, SSH and email"], ["UDP", "is used by DNS lookups and DHCP"],
  ["TCP", "resends data that goes missing"], ["UDP", "sends data without setting up a connection first"]];
const NETG = [
  (d) => {
    const ip = randIp(), p = prefixFor(d), net = netOf(ip, p), size = 2 ** (32 - p);
    return Q(`What is the network address of ${ip}/${p}?`, "", net,
      [intIp(ipInt(net) + size), ip, bcastOf(ip, p), ip.split(".").slice(0, 3).join(".") + ".0"],
      `A /${p} block holds ${size} addresses. Round ${ip} down to the start of its block: ${net}.`, [], { net: [ip, p, "network"] });
  },
  (d) => {
    const ip = randIp(), p = prefixFor(d), b = bcastOf(ip, p);
    return Q(`What is the broadcast address of ${ip}/${p}?`, "", b,
      [netOf(ip, p), intIp(ipInt(b) - 1), ip.split(".").slice(0, 3).join(".") + ".255", intIp(ipInt(b) + 1)],
      `The broadcast is the last address in the block: ${netOf(ip, p)} + ${2 ** (32 - p) - 1}.`, [], { net: [ip, p, "broadcast"] });
  },
  (d) => {
    const p = d === 0 ? pick([8, 16, 24]) : ri(16, 30), h = 2 ** (32 - p) - 2;
    return Q(`How many usable host addresses does a /${p} network have?`, "", h.toLocaleString("en-US"),
      [(h + 2).toLocaleString("en-US"), (h / 2 - 1).toLocaleString("en-US"), (2 * h + 2).toLocaleString("en-US"), (32 - p).toString()],
      `2 to the power ${32 - p} = ${(h + 2).toLocaleString("en-US")} addresses, minus the network and broadcast addresses.`, [], { hosts: p });
  },
  (d) => {
    const p = d === 0 ? pick([8, 16, 24]) : ri(16, 30), m = intIp(maskInt(p));
    return R() < 0.5
      ? Q(`Which subnet mask matches /${p}?`, "", m, [intIp(maskInt(p + 1 > 32 ? p - 2 : p + 1)), intIp(maskInt(p - 1)), intIp(maskInt(p - 8 < 1 ? p + 2 : p - 8))], `/${p} means the first ${p} bits are 1s: ${m}.`, [], { mask: p })
      : Q(`The subnet mask ${m} is the same as which prefix?`, "", `/${p}`, [`/${p + 1 > 32 ? p - 2 : p + 1}`, `/${p - 1}`, `/${32 - p}`, `/${p + 2 > 32 ? p - 3 : p + 2}`], `Count the 1 bits in ${m}: there are ${p}.`, [], { mask: p });
  },
  (d) => {
    const ip = randIp(), p = d === 0 ? 24 : ri(24, 29), size = 2 ** (32 - p), net = ipInt(netOf(ip, p));
    const pickIn = (base) => intIp(base + ri(1, size - 2));
    const same = pickIn(net);
    const others = [pickIn(net + size), pickIn(net - size), pickIn(net + 2 * size)];
    return Q(`Which address is in the same /${p} subnet as ${ip}?`, "", same, others,
      `${ip}/${p} covers ${intIp(net)} to ${intIp(net + size - 1)}.`, [], { same: [ip, p, same, others] });
  },
  (d) => {
    const need = ri(3, d === 0 ? 60 : 2000);
    let p = 30;
    while (2 ** (32 - p) - 2 < need) p--;
    return Q(`You need ${need} usable addresses in one subnet. What is the smallest subnet that fits?`, "", `/${p}`, [`/${p + 1}`, `/${p - 1}`, `/${p + 2}`],
      `/${p} gives ${2 ** (32 - p) - 2} usable hosts, and /${p + 1} gives only ${2 ** (31 - p) - 2}.`);
  },
  () => {
    const priv = randIp();
    const pub = () => `${pick([8, 23, 34, 41, 52, 66, 81, 104, 142, 151, 185, 203])}.${ri(0, 255)}.${ri(0, 255)}.${ri(1, 254)}`;
    const trick = pick([`172.${pick([15, 32, 40])}.${ri(0, 255)}.${ri(1, 254)}`, `192.169.${ri(0, 255)}.${ri(1, 254)}`, `11.${ri(0, 255)}.${ri(0, 255)}.${ri(1, 254)}`]);
    return Q("Which IP address is private?", "", priv, [pub(), pub(), trick],
      "Private ranges are 10.0.0.0/8, 172.16.0.0/12 (172.16 to 172.31) and 192.168.0.0/16.", [], { priv: [priv, trick] });
  },
  () => {
    const o = [ri(1, 126), ri(128, 191), ri(192, 223), ri(224, 239)];
    const i = ri(0, 3), cls = ["A", "B", "C", "D (multicast)"];
    return Q(`An address starts with ${o[i]}. Which classful range is it in?`, "", `Class ${cls[i]}`, cls.filter((_, j) => j !== i).map((c) => `Class ${c}`),
      "Class A starts 1–126, B 128–191, C 192–223, D 224–239.");
  },
  () => {
    const n = ri(1, 255), b = n.toString(2).padStart(8, "0");
    return R() < 0.5
      ? Q(`An IP octet is ${b} in binary. What is it in decimal?`, "", n, [n ^ 1 || 2, n ^ 128, parseInt([...b].reverse().join(""), 2)], `Add the place values of the 1 bits: ${n}.`)
      : Q(`How is the octet ${n} written in binary?`, "", b, [(n ^ 1).toString(2).padStart(8, "0"), (n ^ 64).toString(2).padStart(8, "0"), [...b].reverse().join("")], `${n} in 8 bits is ${b}.`);
  },
  () => {
    const [port, svc] = pick(PORTS);
    const others = shuf(PORTS.filter((r) => r[0] !== port)).slice(0, 3);
    return R() < 0.5
      ? Q(`Which service uses port ${port} by default?`, "", svc, others.map((r) => r[1]), `Port ${port} is ${svc}.`)
      : Q(`Which port does ${svc} use by default?`, "", port, others.map((r) => r[0]), `${svc} listens on port ${port}.`);
  },
  () => {
    const [item, layer] = pick(OSI_ITEMS);
    return Q(`In the OSI model, where does ${item} belong?`, "", OSI[layer - 1], shuf(OSI.filter((_, i) => i !== layer - 1)).slice(0, 3), `${item.charAt(0).toUpperCase() + item.slice(1)} works at ${OSI[layer - 1]}.`);
  },
  () => {
    const n = ri(1, 7), name = OSI[n - 1].split("– ")[1];
    return Q(`Which OSI layer is number ${n}?`, "", name, shuf(OSI.filter((_, i) => i !== n - 1)).slice(0, 3).map((x) => x.split("– ")[1]), `From the bottom: Physical, Data Link, Network, Transport, Session, Presentation, Application.`);
  },
  () => {
    const [name, does] = pick(NET_FACTS);
    const others = shuf(NET_FACTS.filter((r) => r[0] !== name)).slice(0, 3);
    return R() < 0.5
      ? Q(`What ${does}?`, "", name, others.map((r) => r[0]), `${name} ${does}.`)
      : Q(`What does ${name.replace(/^(A|An) /, "a ")} do?`, "", does.charAt(0).toUpperCase() + does.slice(1), others.map((r) => r[1].charAt(0).toUpperCase() + r[1].slice(1)), `${name} ${does}.`);
  },
  () => {
    const [t, does] = pick(DNS_RECORDS);
    return Q(`Which DNS record ${does}?`, "", t, shuf(DNS_RECORDS.filter((r) => r[0] !== t)).slice(0, 3).map((r) => r[0]), `An ${t} record ${does}.`);
  },
  () => {
    const [cmd, does] = pick(NET_CMDS);
    return Q(`Which command would you use to ${does}?`, "", cmd, shuf(NET_CMDS.filter((r) => r[0] !== cmd)).slice(0, 3).map((r) => r[0]), `${cmd} lets you ${does}.`);
  },
  () => {
    const [proto, fact] = pick(TCP_UDP);
    return Q(`Which protocol ${fact}?`, "", proto, [proto === "TCP" ? "UDP" : "TCP", "ICMP", "ARP"], `${proto} ${fact}.`);
  },
  (d) => {
    const speed = pick([8, 10, 16, 20, 40, 50, 80, 100]), t = ri(2, 30), mb = (speed * t) / 8;
    if (!Number.isInteger(mb)) return null;
    return Q(`How long does a ${mb} MB file take to download at ${speed} Mbps (ignoring overhead)?`, "", `${t} seconds`,
      [`${t * 8} seconds`, `${Math.max(1, Math.round(t / 8))} second${Math.round(t / 8) === 1 ? "" : "s"}`, `${t * 2} seconds`],
      `Megabytes are 8 times bigger than megabits: ${mb} × 8 = ${mb * 8} megabits, ÷ ${speed} = ${t} seconds.`);
  },
  { min: 1, f: () => {
    const forms = [
      ["What is the order of the TCP three-way handshake?", "SYN → SYN-ACK → ACK", ["ACK → SYN → FIN", "SYN → ACK → SYN-ACK", "HELLO → OK → START"], "The client sends SYN, the server replies SYN-ACK, and the client confirms with ACK."],
      ["What happens when a packet's TTL reaches 0?", "The router drops it", ["It is sent to the gateway", "It is retried forever", "It becomes a broadcast"], "TTL stops packets looping forever. traceroute uses this on purpose."],
      ["Why does HTTPS need a certificate?", "To prove the server really owns the domain", ["To make pages load faster", "To compress the page", "To give the site an IP address"], "The certificate lets the browser check the server's identity before encrypting."],
      ["Two devices on the same switch can ping each other but not the internet. What is most likely wrong?", "The default gateway setting", ["The MAC addresses", "The network cable", "The HTML of the website"], "Local traffic works, so only the route out of the network is broken."],
      ["Which address range does a device give itself when DHCP fails?", "169.254.x.x", ["127.0.0.x", "192.168.0.x", "10.0.0.x"], "169.254.0.0/16 is the link-local range used when no DHCP server answers."],
    ];
    const [t, a, w, why] = pick(forms);
    return Q(t, "", a, w, why);
  } },
  { min: 2, f: () => {
    const g = Array.from({ length: 8 }, () => (R() < 0.45 ? 0 : ri(1, 65535)));
    const s = ri(1, 4), len = ri(2, 4);
    for (let i = s; i < Math.min(8, s + len); i++) g[i] = 0;
    g[0] = 0x2001;
    const full = g.map((x) => x.toString(16).padStart(4, "0")).join(":");
    const short = g.map((x) => x.toString(16));
    let best = -1, bestLen = 1;
    for (let i = 0; i < 8; ) {
      if (g[i] !== 0) { i++; continue; }
      let j = i; while (j < 8 && g[j] === 0) j++;
      if (j - i > bestLen) { best = i; bestLen = j - i; }
      i = j;
    }
    const comp = best < 0 ? short.join(":") : short.slice(0, best).join(":") + "::" + short.slice(best + bestLen).join(":");
    const noStrip = best < 0 ? full : full.split(":").slice(0, best).join(":") + "::" + full.split(":").slice(best + bestLen).join(":");
    const allZerosGone = short.filter((x) => x !== "0").join(":");
    return Q(`What is the shortest correct way to write ${full}?`, "", comp, [noStrip, allZerosGone, comp.replace("::", ":0:")],
      "Drop leading zeros in each group, then replace the longest run of all-zero groups with :: (only once).", [], { v6: [full, comp] });
  } },
];

/* ---------- Interview Prep ---------- */
const BIG_O_SNIPPETS = [
  ["for (let i = 0; i < n; i++) {\n  total += arr[i];\n}", "O(n)", "One loop over n items."],
  ["for (let i = 0; i < n; i++) {\n  for (let j = 0; j < n; j++) {\n    count++;\n  }\n}", "O(n²)", "A loop inside a loop, both over n."],
  ["let i = n;\nwhile (i > 1) {\n  i = Math.floor(i / 2);\n}", "O(log n)", "i halves each time."],
  ["for (let i = 0; i < n; i++) {\n  let j = n;\n  while (j > 1) j = Math.floor(j / 2);\n}", "O(n log n)", "n passes, each halving: n × log n."],
  ["return arr[0] + arr[arr.length - 1];", "O(1)", "Two lookups, no matter how big the array is."],
  ["for (let i = 0; i < n; i++) a++;\nfor (let j = 0; j < n; j++) b++;", "O(n)", "Two loops one after another is 2n, which is still O(n)."],
  ["for (let i = 0; i < n; i++)\n  for (let j = 0; j < n; j++)\n    for (let k = 0; k < n; k++) x++;", "O(n³)", "Three nested loops over n."],
  ["for (let i = 1; i * i <= n; i++) {\n  count++;\n}", "O(√n)", "The loop stops when i reaches the square root of n."],
  ["for (let i = 0; i < n; i++) {\n  for (let j = i; j < n; j++) {\n    pairs++;\n  }\n}", "O(n²)", "About n²/2 steps, and constants are dropped."],
  ["function fib(n) {\n  if (n < 2) return n;\n  return fib(n - 1) + fib(n - 2);\n}", "O(2ⁿ)", "Each call makes two more calls."],
  ["for (let i = 0; i < 100; i++) {\n  sum += i;\n}", "O(1)", "The loop always runs 100 times, whatever n is."],
  ["const seen = new Set(arr);\nreturn seen.has(target);", "O(n)", "Building the set touches every item once; the lookup is O(1)."],
];
const DS_OPS = [
  ["Reading arr[i] from an array", "O(1)"], ["Searching an unsorted array", "O(n)"], ["Looking up a key in a hash map (average)", "O(1)"],
  ["Searching a balanced binary search tree", "O(log n)"], ["Inserting into a binary heap", "O(log n)"], ["Adding to the front of a linked list", "O(1)"],
  ["Finding an item in a linked list", "O(n)"], ["Push or pop on a stack", "O(1)"], ["Inserting at the start of an array", "O(n)"],
  ["Sorting with merge sort", "O(n log n)"], ["Binary search in a sorted array", "O(log n)"], ["Getting the minimum from a min-heap", "O(1)"],
];
const DS_FOR = [
  ["Hash map", "counting how often each word appears"], ["Stack", "undo and redo in a text editor"], ["Queue", "handling print jobs in order"],
  ["Heap (priority queue)", "always getting the most urgent task next"], ["Graph", "finding routes between cities"], ["Trie", "autocomplete for search boxes"],
  ["Set", "removing duplicates from a list"], ["Linked list", "inserting and removing items in the middle often"], ["Binary search tree", "keeping data sorted with fast lookups"],
  ["Array", "fast access to the 10th, 100th or 1000th item"], ["Stack", "checking that brackets are balanced"], ["Queue", "breadth-first search"],
];
const CONCEPTS = [
  // OOP
  ["Encapsulation", "Which OOP idea means hiding an object's data behind its methods?"], ["Inheritance", "Which OOP idea lets a class reuse another class's code?"],
  ["Polymorphism", "Which OOP idea lets different classes respond to the same method in their own way?"], ["Abstraction", "Which OOP idea means showing only what matters and hiding the details?"],
  ["Single responsibility", "In SOLID, what does the S stand for?"], ["Open/closed", "In SOLID, what does the O stand for?"], ["Liskov substitution", "In SOLID, what does the L stand for?"],
  ["Interface segregation", "In SOLID, what does the I stand for?"], ["Dependency inversion", "In SOLID, what does the D stand for?"],
  ["Composition", "What is it called when a class is built from other objects instead of inheriting from them?"],
  // Git
  ["git clone", "Which command copies a remote repository to your computer?"], ["git commit", "Which command saves staged changes as a snapshot?"],
  ["git push", "Which command uploads your commits to the remote?"], ["git pull", "Which command fetches and merges remote changes?"],
  ["git fetch", "Which command downloads remote changes without merging them?"], ["git stash", "Which command shelves uncommitted changes for later?"],
  ["git rebase", "Which command replays your commits on top of another branch?"], ["git revert", "Which command undoes a commit by making a new commit?"],
  ["git cherry-pick", "Which command copies one specific commit onto your branch?"], ["git bisect", "Which command finds the commit that introduced a bug by binary search?"],
  ["git diff", "Which command shows what changed in your files?"], ["git log", "Which command shows the commit history?"],
  // APIs and the web
  ["GET", "Which HTTP method reads data without changing it?"], ["POST", "Which HTTP method usually creates a new resource?"], ["PUT", "Which HTTP method replaces a whole resource?"],
  ["PATCH", "Which HTTP method updates part of a resource?"], ["DELETE", "Which HTTP method removes a resource?"],
  ["Idempotent", "What do you call a request that has the same effect however many times it is sent?"],
  ["REST", "Which API style uses URLs for resources and HTTP methods for actions?"], ["GraphQL", "Which API style lets the client ask for exactly the fields it needs?"],
  ["JWT", "Which signed token format is often used for stateless login?"], ["OAuth", "Which standard lets an app act for a user without seeing their password?"],
  ["CORS", "Which browser rule controls which other sites can call your API?"], ["XSS", "Which attack injects script into a page other users will see?"],
  ["CSRF", "Which attack tricks a logged-in user's browser into sending a request?"], ["SQL injection", "Which attack slips SQL into user input?"],
  ["Rate limiting", "What stops one client from sending too many requests?"], ["Webhook", "What is it called when a service calls your URL when an event happens?"],
  // System design
  ["Caching", "What keeps frequently used data in fast memory to avoid repeated work?"], ["Horizontal scaling", "What is it called when you add more servers to handle load?"],
  ["Vertical scaling", "What is it called when you give one server more CPU and memory?"], ["Sharding", "What splits a large database across several machines?"],
  ["Replication", "What keeps copies of the same data on several machines?"], ["Message queue", "What lets services hand off work to be processed later?"],
  ["CAP theorem", "Which idea says a distributed system cannot guarantee consistency, availability and partition tolerance all at once?"],
  ["Eventual consistency", "What is it called when replicas may disagree briefly but end up the same?"], ["Microservices", "Which architecture splits an app into small independent services?"],
  ["Monolith", "What do you call an app built and deployed as one single unit?"], ["Single point of failure", "What is a part whose failure takes the whole system down?"],
  // Databases
  ["Atomicity", "In ACID, what does the A stand for?"], ["Consistency", "In ACID, what does the C stand for?"], ["Isolation", "In ACID, what does the I stand for?"], ["Durability", "In ACID, what does the D stand for?"],
  ["An index", "What makes reads on a column faster but writes slightly slower?"], ["Normalization", "What reduces repeated data by splitting tables?"],
  ["NoSQL", "Which kind of database stores flexible documents or key-value pairs instead of fixed tables?"],
  // Testing and process
  ["Unit test", "Which test checks one small function on its own?"], ["Integration test", "Which test checks that several parts work together?"],
  ["End-to-end test", "Which test clicks through the app like a real user?"], ["Mocking", "What replaces a real dependency with a fake one in a test?"],
  ["TDD", "What is it called when you write the failing test before the code?"], ["Code review", "What is it called when teammates read your changes before they are merged?"],
  ["CI/CD", "What automatically tests and deploys code on every change?"], ["Technical debt", "What do you call shortcuts in code that will cost time to fix later?"],
  // Runtime
  ["A thread", "What is the smallest unit of work a CPU schedules inside a process?"], ["A deadlock", "What happens when two tasks each wait for the other forever?"],
  ["A race condition", "What bug depends on the timing of two operations?"], ["Garbage collection", "What automatically frees memory that is no longer used?"],
  ["Recursion", "What is it called when a function calls itself?"], ["Memoization", "What is it called when you cache a function's results to avoid recomputing them?"],
];
const treeOrders = (t) => {
  const pre = [], ino = [], post = [];
  const walk = (i) => { if (i >= t.length || t[i] == null) return; pre.push(t[i]); walk(2 * i + 1); ino.push(t[i]); walk(2 * i + 2); post.push(t[i]); };
  walk(0);
  return { bfs: t.filter((x) => x != null), pre, ino, post };
};
const INTERVIEW = [
  (d) => {
    const ops = [], st = [];
    const n = ri(4, 6 + d);
    for (let i = 0; i < n; i++) {
      if (st.length && R() < 0.35) { st.pop(); ops.push("stack.pop();"); } else { const v = ri(1, 30); st.push(v); ops.push(`stack.push(${v});`); }
    }
    if (!st.length) { const v = ri(1, 30); st.push(v); ops.push(`stack.push(${v});`); }
    return Q(PRINT, `const stack = [];\n${ops.join("\n")}\nconsole.log(stack[stack.length - 1]);`, st[st.length - 1],
      [st[0], st.length > 1 ? st[st.length - 2] : "undefined", st.length], "A stack is last in, first out: the top is the most recent push that was not popped.", ["undefined"]);
  },
  (d) => {
    const ops = [], q = [];
    const n = ri(4, 6 + d);
    for (let i = 0; i < n; i++) {
      if (q.length > 1 && R() < 0.35) { q.shift(); ops.push("queue.shift();"); } else { const v = ri(1, 30); q.push(v); ops.push(`queue.push(${v});`); }
    }
    return Q(PRINT, `const queue = [];\n${ops.join("\n")}\nconsole.log(queue[0]);`, q[0],
      [q[q.length - 1], q.length > 1 ? q[1] : "undefined", q.length], "A queue is first in, first out: shift removes from the front.", ["undefined"]);
  },
  () => {
    const [code, o, why] = pick(BIG_O_SNIPPETS);
    return Q("What is the time complexity?", code, o, shuf(["O(1)", "O(log n)", "O(n)", "O(n log n)", "O(n²)", "O(n³)", "O(2ⁿ)", "O(√n)"].filter((x) => x !== o)).slice(0, 3), why);
  },
  () => fromPool(DS_OPS.map(([op, o]) => [o, op]), (r) => `What is the time complexity of: ${r[1].charAt(0).toLowerCase() + r[1].slice(1)}?`, (r) => `${r[1]} is ${r[0]}.`),
  () => {
    const [ds, use] = pick(DS_FOR);
    return Q(`Which data structure fits best for ${use}?`, "", ds, shuf([...new Set(DS_FOR.map((r) => r[0]))].filter((x) => x !== ds)).slice(0, 3), `A ${ds.toLowerCase()} is the natural fit for ${use}.`);
  },
  () => fromPool(CONCEPTS, (r) => r[1], (r) => `${r[0]}.`),
  (d) => {
    const n = ri(8, 12 + d * 6), a = [...new Set(nums(n, 1, 99))].sort((x, y) => x - y);
    const target = pick(a);
    let lo = 0, hi = a.length - 1, steps = 0, path = [];
    while (lo <= hi) { const mid = Math.floor((lo + hi) / 2); steps++; path.push(a[mid]); if (a[mid] === target) break; if (a[mid] < target) lo = mid + 1; else hi = mid - 1; }
    return R() < 0.5
      ? Q(`Binary search for ${target} in this sorted array. Which value is checked first?`, arr(a), a[Math.floor((a.length - 1) / 2)], [a[0], a[a.length - 1], target === a[Math.floor((a.length - 1) / 2)] ? a[1] : target], "Binary search starts in the middle: index floor((0 + last) / 2).", [], { bs: [a, target] })
      : Q(`Binary search for ${target} in this sorted array. How many values are checked before it is found?`, arr(a), steps, [steps + 1, a.indexOf(target) + 1 === steps ? steps + 2 : a.indexOf(target) + 1, a.length], `It checks ${path.join(", ")}.`, [1], { bs: [a, target] });
  },
  (d) => {
    const a = shuf(nums(ri(5, 6), 1, 50));
    if (new Set(a).size !== a.length) return null;
    const b = [...a];
    for (let i = 0; i < b.length - 1; i++) if (b[i] > b[i + 1]) [b[i], b[i + 1]] = [b[i + 1], b[i]];
    const sorted = [...a].sort((x, y) => x - y);
    return Q("What does the array look like after ONE pass of bubble sort (ascending)?", arr(a), arr(b), [arr(sorted), arr(a), arr([...b].reverse())],
      "One pass compares neighbours left to right and swaps them if out of order, which carries the biggest value to the end.", [], { bubble: [a, b] });
  },
  (d) => {
    const a = shuf(nums(ri(5, 6), 1, 50));
    if (new Set(a).size !== a.length) return null;
    const b = [...a], m = b.indexOf(Math.min(...b));
    [b[0], b[m]] = [b[m], b[0]];
    return Q("What does the array look like after the FIRST pass of selection sort (ascending)?", arr(a), arr(b), [arr([...a].sort((x, y) => x - y)), arr(a), arr([Math.min(...a), ...a.filter((x) => x !== Math.min(...a))])],
      "Selection sort finds the smallest value and swaps it into position 0.", [], { select: [a, b] });
  },
  (d) => {
    const n = ri(3, 6 + d);
    const forms = [
      [`function fact(n) {\n  return n <= 1 ? 1 : n * fact(n - 1);\n}\nconsole.log(fact(${n}))`, (() => { let f = 1; for (let i = 2; i <= n; i++) f *= i; return f; })(), "fact multiplies n by every number below it."],
      [`function fib(n) {\n  return n < 2 ? n : fib(n - 1) + fib(n - 2);\n}\nconsole.log(fib(${n + 2}))`, (() => { let a = 0, b = 1; for (let i = 0; i < n + 2; i++) [a, b] = [b, a + b]; return a; })(), "Each Fibonacci number is the sum of the two before it, starting 0, 1."],
      [`function sumTo(n) {\n  if (n === 0) return 0;\n  return n + sumTo(n - 1);\n}\nconsole.log(sumTo(${n + 3}))`, ((n + 3) * (n + 4)) / 2, "sumTo adds n, n-1, … down to 0."],
      [`function power(b, e) {\n  return e === 0 ? 1 : b * power(b, e - 1);\n}\nconsole.log(power(2, ${n + 1}))`, 2 ** (n + 1), "Each call multiplies by 2 until e reaches 0."],
    ];
    const [code, ans, why] = pick(forms);
    return Q(PRINT, code, ans, [ans + 1, ans * 2, ans - n], why);
  },
  (d) => {
    const a = nums(ri(5, 7), 1, 20);
    const i = ri(0, a.length - 2), j = ri(i + 1, a.length - 1), target = a[i] + a[j];
    const pairs = [];
    for (let x = 0; x < a.length; x++) for (let y = x + 1; y < a.length; y++) if (a[x] + a[y] === target) pairs.push([x, y]);
    if (pairs.length !== 1) return null;
    const wrong = [];
    for (let x = 0; x < a.length && wrong.length < 6; x++) for (let y = x + 1; y < a.length; y++) if (a[x] + a[y] !== target) wrong.push(`[${x}, ${y}]`);
    return Q(`Two Sum: which pair of indexes adds up to ${target}?`, arr(a), `[${i}, ${j}]`, shuf(wrong).slice(0, 3), `a[${i}] + a[${j}] = ${a[i]} + ${a[j]} = ${target}. Indexes start at 0.`);
  },
  () => {
    const n = ri(5, 9), miss = ri(1, n);
    const a = shuf(Array.from({ length: n }, (_, i) => i + 1).filter((x) => x !== miss));
    return Q(`This array should hold every number from 1 to ${n}. Which one is missing?`, arr(a), miss, [miss === n ? 1 : miss + 1, miss === 1 ? n : miss - 1, n + 1],
      `A quick trick: ${n} × ${n + 1} / 2 = ${(n * (n + 1)) / 2}, minus the sum of the array gives ${miss}.`);
  },
  (d) => {
    const len = ri(5, 7), t = Array.from({ length: len }, () => ri(1, 30));
    if (new Set(t).size !== len) return null;
    const o = treeOrders(t), kind = pick(d === 0 ? ["bfs", "pre"] : ["bfs", "pre", "ino", "post"]);
    const label = { bfs: "level-order (BFS)", pre: "pre-order (root, left, right)", ino: "in-order (left, root, right)", post: "post-order (left, right, root)" };
    const others = ["bfs", "pre", "ino", "post"].filter((k) => k !== kind && o[k].join() !== o[kind].join()).map((k) => o[k].join(", "));
    return Q(`This binary tree is stored as an array (children of index i are at 2i+1 and 2i+2). What is its ${label[kind]} traversal?`, arr(t), o[kind].join(", "),
      others, `${label[kind].charAt(0).toUpperCase() + label[kind].slice(1)} visits: ${o[kind].join(", ")}.`, [[...o[kind]].reverse().join(", ")], { tree: [t, kind] });
  },
  () => {
    const pairsOk = ["()", "[]", "{}"];
    const build = (depth) => (depth === 0 ? "" : pick(pairsOk).split("").join(build(depth - 1)) + (R() < 0.4 ? build(depth - 1) : ""));
    let good = build(ri(2, 3));
    if (good.length < 4 || good.length > 12) good = "({[]})";
    const bads = [good.slice(0, -1) + (good.endsWith(")") ? "]" : ")"), good.replace("(", "[").replace(")", "}") === good ? good + "(" : good.replace("(", "["), ")" + good.slice(1) + "("];
    return Q("Which string of brackets is balanced?", "", good, bads, "Every opening bracket must close with the same type, in reverse order. A stack checks this in O(n).", [], { brackets: [good, bads] });
  },
  (d) => {
    const a = Array.from({ length: ri(6, 8) }, () => ri(-9, 9));
    let best = -Infinity, cur = 0;
    for (const x of a) { cur = Math.max(x, cur + x); best = Math.max(best, cur); }
    const total = a.reduce((s, x) => s + x, 0), maxEl = Math.max(...a);
    return Q("Maximum subarray: what is the largest sum of any run of neighbouring items?", arr(a), best, [total, maxEl === best ? best - 1 : maxEl, best + 2],
      "Kadane's algorithm keeps a running sum and resets it when starting fresh is better. O(n).");
  },
  () => {
    const w = pick(VOCAB[0].filter((r) => r[0].length >= 4))[0].toLowerCase() + pick(["", "s", "er"]);
    const counts = {};
    for (const c of w) counts[c] = (counts[c] || 0) + 1;
    const max = Math.max(...Object.values(counts)), top = Object.keys(counts).filter((c) => counts[c] === max);
    if (top.length !== 1 || max < 2) return null;
    return Q(`Which character appears most often in "${w}"?`, "", top[0], shuf(Object.keys(counts).filter((c) => c !== top[0])).slice(0, 3),
      "Count characters with a hash map in one pass, then pick the biggest count. O(n).");
  },
  () => {
    const palins = ["level", "radar", "civic", "refer", "kayak", "rotor", "madam", "noon", "racecar", "stats", "deified", "reviver"];
    const p = pick(palins);
    const others = shuf(VOCAB[0].map((r) => r[0].toLowerCase()).filter((w) => w.length >= 4 && w !== [...w].reverse().join(""))).slice(0, 3);
    return Q("Which word is a palindrome?", "", p, others, "A palindrome reads the same backwards. Check it with two pointers moving inward.");
  },
];

/* ---------- extra question types (variety for HTML, CSS, Debugging, Logic, PHP) ---------- */
const WORDS = () => pick(VOCAB[0])[0].toLowerCase();
const HEX = ["00", "33", "66", "80", "99", "CC", "FF"];
const NAMED = [["#FF0000", "red"], ["#008000", "green"], ["#0000FF", "blue"], ["#FFA500", "orange"], ["#800080", "purple"], ["#FFFF00", "yellow"]];
const ENTITIES = [["&lt;", "<"], ["&gt;", ">"], ["&amp;", "&"], ["&quot;", '"'], ["&copy;", "©"], ["&nbsp;", "a non-breaking space"]];
const SELF_CLOSING = ["<img>", "<br>", "<input>", "<hr>", "<meta>", "<link>"];
const NEEDS_CLOSE = ["<div>", "<p>", "<span>", "<ul>", "<a>", "<section>", "<button>", "<h2>"];

WEB.push(
  () => {
    const text = WORDS(), href = "/" + WORDS();
    return R() < 0.5
      ? Q("What text does the user see for this link?", `<a href="${href}">${text}</a>`, text, [href, `a ${text}`, "Nothing"], "The text between the tags is what shows on the page; href is where it goes.")
      : Q("Where does this link go when clicked?", `<a href="${href}">${text}</a>`, href, [text, `/${text}`, "Nowhere"], "href holds the destination.");
  },
  () => {
    const rows = ri(2, 5), cols = ri(2, 4);
    const body = Array.from({ length: rows }, () => "  <tr>" + Array.from({ length: cols }, () => `<td>${ri(1, 99)}</td>`).join("") + "</tr>").join("\n");
    return R() < 0.5
      ? Q("How many rows does this table have?", `<table>\n${body}\n</table>`, rows, [cols, rows * cols, rows + 1], "Each <tr> is one row.")
      : Q("How many cells does this table have?", `<table>\n${body}\n</table>`, rows * cols, [rows, cols, rows + cols], `${rows} rows × ${cols} cells each = ${rows * cols}.`);
  },
  () => {
    const n = ri(1, 4), m = ri(1, 3);
    const parts = shuf([...Array(n).fill(0).map(() => `  <a href="/${WORDS()}">${WORDS()}</a>`), ...Array(m).fill(0).map(() => `  <p>${WORDS()}</p>`)]);
    return Q("How many links are in this snippet?", `<nav>\n${parts.join("\n")}\n</nav>`, n, [n + m, m, n + 1], "Only <a> elements are links.", [0]);
  },
  () => {
    const cls = shuf(["card", "big", "red", "active", "shadow", "round", "dark"]).slice(0, ri(1, 4));
    return Q("How many classes does this element have?", `<div id="${WORDS()}" class="${cls.join(" ")}"></div>`, cls.length, [cls.length + 1, 1 === cls.length ? 2 : 1, 0],
      "Classes are separated by spaces. The id is not a class.", [cls.length + 2]);
  },
  () => {
    const ph = WORDS(), val = WORDS();
    return Q("What does this input show before the user types anything?", `<input type="text" placeholder="${ph}" name="${val}">`, ph, [val, "text", "Nothing"], "placeholder is the grey hint shown while the box is empty.");
  },
  () => {
    const [ent, ch] = pick(ENTITIES);
    return Q(`Which character does ${ent} display?`, "", ch, shuf(ENTITIES.filter((e) => e[0] !== ent)).slice(0, 3).map((e) => e[1]), `${ent} is the HTML entity for ${ch}.`);
  },
  () => Q("Which tag does NOT need a closing tag?", "", pick(SELF_CLOSING), shuf(NEEDS_CLOSE).slice(0, 3), "Void elements like img, br, input, hr, meta and link have no content, so they never close."),
  () => {
    const levels = shuf([1, 2, 3, 4, 5, 6]).slice(0, 4);
    const big = Math.min(...levels);
    return Q("Which of these headings is the biggest by default?", "", `<h${big}>`, levels.filter((x) => x !== big).map((x) => `<h${x}>`), "h1 is the biggest and h6 the smallest.");
  },
  () => {
    const outer = pick(["section", "article", "main", "div"]), mid = pick(["ul", "nav", "form"]), inner = pick(["li", "a", "button", "input"]);
    return Q(`What is the parent of the <${inner}>?`, `<${outer}>\n  <${mid}>\n    <${inner}>…</${inner}>\n  </${mid}>\n</${outer}>`, `<${mid}>`, [`<${outer}>`, `<${inner}>`, "<body>"],
      `The parent is the element directly around it: <${mid}>.`);
  },
);

const randHex = () => "#" + pick(HEX) + pick(HEX) + pick(HEX);
const hexRgb = (h) => `rgb(${parseInt(h.slice(1, 3), 16)}, ${parseInt(h.slice(3, 5), 16)}, ${parseInt(h.slice(5, 7), 16)})`;
CSSG.push(
  () => {
    const h = randHex();
    return Q(`Which rgb() value is the same as ${h}?`, "", hexRgb(h), [hexRgb("#" + h.slice(5, 7) + h.slice(3, 5) + h.slice(1, 3)), hexRgb("#" + h.slice(3, 5) + h.slice(1, 3) + h.slice(5, 7)), `rgb(${h.slice(1, 3)}, ${h.slice(3, 5)}, ${h.slice(5, 7)})`],
      "Each pair of hex digits is one channel, from 00 (0) to FF (255).");
  },
  () => {
    const v = nums(4, 1, 6).map((x) => x * 5);
    const n = pick([1, 2, 3, 4]), vals = v.slice(0, n);
    const side = pick(["top", "right", "bottom", "left"]);
    const full = n === 1 ? [v[0], v[0], v[0], v[0]] : n === 2 ? [v[0], v[1], v[0], v[1]] : n === 3 ? [v[0], v[1], v[2], v[1]] : v.slice(0, 4);
    const ans = full[["top", "right", "bottom", "left"].indexOf(side)];
    return Q(`How much ${side} padding does .box get?`, `.box { padding: ${vals.map((x) => x + "px").join(" ")}; }`, `${ans}px`,
      [...new Set(v)].filter((x) => x !== ans).map((x) => `${x}px`).concat(["0px", `${ans + 5}px`]),
      "Shorthand goes clockwise: top, right, bottom, left. Missing values copy the opposite side.");
  },
  () => {
    const c = shuf(["red", "blue", "green", "purple", "orange", "teal"]).slice(0, 3);
    const forms = [
      [`#title { color: ${c[0]}; }\n.title { color: ${c[1]}; }\nh1 { color: ${c[2]}; }`, c[0], "An id selector beats a class, and a class beats a tag."],
      [`.title { color: ${c[0]}; }\nh1 { color: ${c[1]}; }\n.title { color: ${c[2]}; }`, c[2], "Two rules with equal specificity: the later one wins."],
      [`h1 { color: ${c[0]} !important; }\n#title { color: ${c[1]}; }\n.title { color: ${c[2]}; }`, c[0], "!important beats normal rules, even ones with an id."],
      [`header h1 { color: ${c[0]}; }\nh1 { color: ${c[1]}; }\nh1 { color: ${c[2]}; }`, c[0], "Two tag names (header h1) are more specific than one."],
    ];
    const [code, ans, why] = pick(forms);
    return Q(`What colour is <h1 id="title" class="title"> inside <header>?`, code, ans, c.filter((x) => x !== ans).concat(["black"]), why);
  },
  () => {
    const W = pick([300, 400, 600, 800, 900, 1200]), f = shuf([1, 1, 2, 3]).slice(0, 3);
    const total = f.reduce((a, b) => a + b, 0), i = ri(0, 2), w = (W * f[i]) / total;
    if (!Number.isInteger(w)) return null;
    return Q(`A ${W}px flex row holds three items with flex: ${f.join(", ")}. How wide is item ${i + 1}?`, "", `${w}px`, [`${W / 3}px`, `${(W * f[i]) / 10}px`, `${W - w}px`, `${w * 2}px`],
      `Shares add up to ${total}, so item ${i + 1} gets ${f[i]}/${total} of ${W}px.`);
  },
  () => {
    const W = pick([400, 500, 600, 800, 1000]), fixed = pick([100, 200]), a = ri(1, 2), b = ri(1, 3);
    const free = W - fixed, w = (free * b) / (a + b);
    if (!Number.isInteger(w)) return null;
    return Q(`A ${W}px grid uses grid-template-columns: ${fixed}px ${a}fr ${b}fr. How wide is the last column?`, "", `${w}px`, [`${(W * b) / (a + b)}px`, `${b * 100}px`, `${free}px`],
      `First take away the fixed ${fixed}px, then split the remaining ${free}px in the ratio ${a}:${b}.`);
  },
  () => {
    const vw = pick([360, 768, 1024, 1200, 1440, 1600]), p = pick([10, 20, 25, 50, 75]);
    return Q(`The browser window is ${vw}px wide. How wide is width: ${p}vw?`, "", `${(vw * p) / 100}px`, [`${p}px`, `${(vw * p) / 10}px`, `${vw - p}px`], `1vw is 1% of the window width.`);
  },
  () => {
    const W = pick([300, 400, 500, 640, 800]), k = pick([20, 40, 50, 60, 100]);
    return Q("How wide is .inner?", `.outer { width: ${W}px; }\n.inner { width: calc(100% - ${k}px); }`, `${W - k}px`, [`${W}px`, `${k}px`, `${W - 2 * k}px`], "calc() does the maths at render time: 100% of the parent minus the fixed amount.");
  },
  () => {
    const z = shuf([1, 2, 5, 10, 50, 99]).slice(0, 3), names = ["A", "B", "C"];
    const top = names[z.indexOf(Math.max(...z))];
    return Q("Three positioned boxes overlap. Which one is on top?", names.map((n, i) => `#box${n} { position: absolute; z-index: ${z[i]}; }`).join("\n"), `Box ${top}`,
      names.filter((n) => n !== top).map((n) => `Box ${n}`).concat(["They all blend together"]), "The highest z-index sits on top.");
  },
);

const FNS = ["total", "double", "area", "greet", "score", "bonus", "average"];
const PROPS = ["profile", "address", "settings", "stats", "avatar"];
DEBUG.push(
  () => {
    const f = pick(FNS), a = ri(2, 9), b = ri(2, 9);
    return Q(PRINT, `function ${f}(a, b) {\n  const r = a * b;\n}\nconsole.log(${f}(${a}, ${b}));`, "undefined", [a * b, a + b, "null"], "Without return, a function gives back undefined.");
  },
  () => {
    const v = pick(["count", "level", "lives", "speed"]), a = ri(1, 5), b = a + ri(1, 5);
    return Q(PRINT, `let ${v} = ${a};\nif (${v} = ${b}) {\n  console.log(${v});\n}`, b, [a, "false", "Nothing"], `= assigns ${b} (truthy), so the block runs and prints ${b}. Use === to compare.`);
  },
  () => {
    const o = pick(PROPS), name = pick(["Ava", "Kai", "Leo", "Mia"]);
    return Q("What happens when this runs?", `const user = { name: "${name}" };\nconsole.log(user.${o}.id);`, `TypeError: Cannot read properties of undefined (reading 'id')`,
      ["It prints undefined", "It prints null", `It prints ${name}`], `user.${o} does not exist, so it is undefined, and you cannot read .id from undefined. Use user.${o}?.id.`);
  },
  () => {
    const n = ri(2, 99), unit = pick(["px", "kg", "em", "%"]);
    return R() < 0.5
      ? Q(PRINT, `console.log(parseInt("${n}${unit}"))`, n, ["NaN", `${n}${unit}`, 0], "parseInt reads digits until it hits something else.")
      : Q(PRINT, `console.log(Number("${n}${unit}"))`, "NaN", [n, `${n}${unit}`, 0], "Number() needs the whole string to be numeric, otherwise you get NaN.");
  },
  () => {
    const a = nums(3, 2, 30);
    if (new Set(a.map(String)).size < 3) return null;
    const sorted = a.map(String).sort();
    return Q(PRINT, `console.log([${a.join(", ")}].sort())`, "[" + sorted.join(",") + "]", ["[" + [...a].sort((x, y) => x - y).join(",") + "]", "[" + a.join(",") + "]", "[" + [...a].sort((x, y) => y - x).join(",") + "]"],
      "sort() without a compare function sorts as text, so '10' comes before '9'. Use sort((a, b) => a - b).");
  },
  () => {
    const w = WORDS(), c = pick(["X", "Z", "Q"]);
    return Q(PRINT, `let word = "${w}";\nword[0] = "${c}";\nconsole.log(word);`, w, [c + w.slice(1), "Error", "undefined"], "Strings cannot be changed in place. Build a new one: \"" + c + "\" + word.slice(1).");
  },
  () => {
    const a = nums(3, 1, 9), k = ri(3, 6);
    return Q(PRINT, `const nums = [${a.join(", ")}];\nconsole.log(nums[${k}]);`, "undefined", [a[a.length - 1], "Error", 0], `There is no index ${k}, and JavaScript returns undefined instead of crashing.`);
  },
  () => {
    const v = pick(["max", "limit", "rate", "tax"]), a = ri(1, 9);
    return Q("What happens when this runs?", `const ${v} = ${a};\n${v} = ${a + 1};\nconsole.log(${v});`, "TypeError: Assignment to constant variable.", [`It prints ${a + 1}`, `It prints ${a}`, "It prints undefined"], "const cannot be reassigned. Use let if the value must change.");
  },
  () => {
    const forms = [["console.log(0.1 + 0.2 === 0.3)", "false", ["true", "undefined", "Error"], "Floating-point maths is not exact: 0.1 + 0.2 is 0.30000000000000004."],
      ['console.log("" == 0)', "true", ["false", "undefined", "Error"], "== converts the empty string to 0 first. === would be false."],
      ["console.log(([] + []).length)", "0", ["2", "undefined", "Error"], "Both arrays turn into empty strings, so [] + [] is an empty string with length 0."],
      ["console.log(typeof NaN)", "number", ["NaN", "undefined", "object"], "NaN is a special number value."],
      ['console.log("b" + "a" + +"a" + "a")', "baNaNa", ["baaa", "ba0a", "Error"], '+"a" tries to turn "a" into a number and gets NaN.']];
    const [code, ans, w, why] = pick(forms);
    return Q(PRINT, code, ans, w, why);
  },
);

LOGIC.push(
  () => {
    const a = ri(1, 9), b = ri(1, 9);
    const forms = [[`!(${a} > ${b})`, !(a > b)], [`${a} !== ${b} && ${a} > 0`, a !== b && a > 0], [`(${a} > ${b}) || (${a} === ${b})`, a >= b], [`!(${a} < ${b} || ${a} === ${b})`, !(a <= b)]];
    const [e, v] = pick(forms);
    return Q(PRINT, `console.log(${e})`, String(v), [String(!v), "undefined", "Error"], "Work inside the brackets first, then apply ! to flip the result.");
  },
  () => {
    const n = ri(10, 60), k = ri(2, 7);
    let c = 0; for (let i = 1; i <= n; i++) if (i % k === 0) c++;
    return Q(PRINT, `let count = 0;\nfor (let i = 1; i <= ${n}; i++) {\n  if (i % ${k} === 0) count++;\n}\nconsole.log(count);`, c, [c + 1, n % k, Math.ceil(n / k) === c ? c - 1 : Math.ceil(n / k)], `Multiples of ${k} up to ${n}: there are ${c}.`);
  },
  () => {
    const x = ri(-5, 15);
    const out = x % 15 === 0 ? "FizzBuzz" : x % 3 === 0 ? "Fizz" : x % 5 === 0 ? "Buzz" : String(x);
    if (x <= 0) return null;
    return Q(PRINT, `const n = ${x};\nif (n % 15 === 0) console.log("FizzBuzz");\nelse if (n % 3 === 0) console.log("Fizz");\nelse if (n % 5 === 0) console.log("Buzz");\nelse console.log(n);`,
      out, ["Fizz", "Buzz", "FizzBuzz", String(x)].filter((o) => o !== out), "Classic FizzBuzz: check 15 first, then 3, then 5.");
  },
  () => {
    const a = ri(10, 99), b = ri(2, 9);
    return Q(PRINT, `let x = ${a};\nlet y = ${b};\n[x, y] = [y, x];\nconsole.log(x - y);`, b - a, [a - b, 0, a + b], "Destructuring swaps the two values in one step.");
  },
  () => {
    const n = ri(100, 9999), digits = String(n).split("").map(Number), s = digits.reduce((a, b) => a + b, 0);
    return Q(PRINT, `let n = ${n}, sum = 0;\nwhile (n > 0) {\n  sum += n % 10;\n  n = Math.floor(n / 10);\n}\nconsole.log(sum);`, s, [digits.length, s + 1, n % 10], "% 10 takes the last digit and / 10 removes it, so this adds up every digit.");
  },
);

PHPG.push(
  () => {
    const a = nums(ri(3, 5), 1, 9);
    const forms = [[`$a = [${a.join(", ")}];\nsort($a);\necho implode(",", $a);`, [...a].sort((x, y) => x - y).join(","), "sort() orders the array from smallest to largest."],
      [`$a = [${a.join(", ")}];\nrsort($a);\necho $a[0];`, Math.max(...a), "rsort() sorts high to low, so index 0 is the biggest."],
      [`$a = [${a.join(", ")}];\necho in_array(${a[1]}, $a) ? "yes" : "no";`, "yes", "in_array checks whether the value is in the array."],
      [`$a = [${a.join(", ")}];\narray_push($a, ${a[0] + 10});\necho count($a);`, a.length + 1, "array_push adds an item to the end."],
      [`$a = [${a.join(", ")}];\necho array_search(${a[a.length - 1]}, $a);`, a.indexOf(a[a.length - 1]), "array_search returns the key of the first match."]];
    const [code, ans, why] = pick(forms);
    return Q(PRINT, code, ans, [String(ans) === "yes" ? "no" : a.join(","), String(a.length), String(a[0])], why, ["1", "0"]);
  },
  () => {
    const n = ri(2, 6), m = ri(2, 5);
    return Q(PRINT, `$out = "";\n$i = 0;\nwhile ($i < ${n}) {\n    $out .= "${pick(["a", "x", "*", "#"])}";\n    $i++;\n}\necho strlen($out);`, n, [n - 1, n + 1, m * n], ".= appends to the string once per loop.");
  },
  () => {
    const w = WORDS(), r = pick(["a", "e", "o", "i"]), to = pick(["*", "_", "0"]);
    return Q(PRINT, `echo str_replace("${r}", "${to}", "${w}");`, w.split(r).join(to), [w, w.replace(r, to), to], "str_replace swaps every match, not just the first.");
  },
  () => {
    const a = ri(10, 99), b = ri(10, 99);
    return Q(PRINT, `echo max(${a}, ${b}) - min(${a}, ${b});`, Math.abs(a - b), [a - b === Math.abs(a - b) ? b - a : a - b, Math.max(a, b), a + b], "max and min pick the larger and smaller value.");
  },
);

/* ---------- vocabulary (any track) ---------- */
const VOCAB_TRACKS = ["js", "web", "css", "logic", "debug", "interview"];
const strHash = (str) => { let h = 2166136261; for (let i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 16777619); } return h >>> 0; };
function vocab(tier, trk) {
  const bank = VOCAB[Math.min(tier, 2)];
  const mine = bank.filter((r) => strHash(r[0]) % VOCAB_TRACKS.length === VOCAB_TRACKS.indexOf(trk));
  if (!mine.length) return null;
  const [w, def] = pick(mine);
  const others = shuf(bank.filter((r) => r[0] !== w)).slice(0, 3);
  return R() < 0.5
    ? Q(`What does "${w}" mean?`, "", def, others.map((r) => r[1]), `${w}: ${def}`)
    : Q(`Which word means: ${def.charAt(0).toLowerCase() + def.slice(1)}`, "", w, others.map((r) => r[0]), `${w}: ${def}`);
}

const GEN = { js: JS, web: WEB, logic: LOGIC, debug: DEBUG, python: PY, css: CSSG, sql: SQLG, php: PHPG, networking: NETG, interview: INTERVIEW };
// Level names set the mood but never promise a topic, because every level mixes question types.
const TITLES = {
  js: ["Hello Console", "Brace Yourself", "Semicolon Sprint", "Callback Canyon", "Script Kiddie", "Runtime Rumble", "Node Nook", "Event Loop-de-Loop", "Curly Climb", "Promise Land", "Bundle Up", "JS Jedi"],
  web: ["Page One", "Tag Team", "Markup Market", "Open and Close", "Angle Brackets", "Div Dive", "Element Hunt", "Browser Basics", "Doc Type", "Hyper Text", "Web Weaver", "Markup Master"],
  css: ["First Style", "Paint Job", "Pixel Push", "Style Studio", "Cascade Creek", "Colour Splash", "Layout Lane", "Box Party", "Design Desk", "Stylesheet Summit", "Pixel Perfect", "CSS Wizard"],
  python: ["Hello Python", "Snake Steps", "Indent Island", "Py Picnic", "Zen Garden", "Script Safari", "Pythonic Path", "Slither Sprint", "REPL Ranch", "Py Pro", "Charmer", "Python Peak"],
  sql: ["First Query", "Table Talk", "Row Rally", "Column Club", "Query Quest", "Data Dig", "Result Set", "Table Turn", "Schema Street", "Query Craft", "Data Detective", "SQL Sage"],
  php: ["Hello PHP", "Echo Echo", "Dollar Signs", "Server Side", "Script Stop", "Request Ride", "PHP Picnic", "Backend Bay", "Elephant Walk", "Dynamic Den", "Server Smith", "PHP Pro"],
  logic: ["Brain Warm-Up", "Think Tank", "Puzzle Path", "True or False", "Mind Maze", "Logic Lane", "Clever Clogs", "Brain Gym", "Reason Road", "Puzzle Peak", "Sharp Mind", "Logic Legend"],
  debug: ["Bug Hunt", "Squash It", "Crash Course", "Error Explorer", "Fix the Flow", "Case Closed", "Silent Bugs", "Trace It", "Patch Party", "Bug Bounty", "Clean Build", "Debug Detective"],
  networking: ["Hello Network", "Packet Path", "Signal Boost", "Link Up", "Ping Pong", "Hop Along", "Data Highway", "Net Navigator", "Bandwidth Bay", "Route Runner", "Packet Pro", "Network Ninja"],
  interview: ["Warm-Up Round", "Phone Screen", "Take-Home", "Pair Programming", "Whiteboard", "Coding Round", "Tech Deep-Dive", "Onsite", "Hiring Panel", "Bar Raiser", "Final Round", "Offer Letter"],
};
// Share of vocabulary questions per track. Language and networking tracks have plenty of their own.
const VOCAB_CHANCE = { js: 1, web: 1, css: 1, logic: 1, debug: 1, interview: 1, python: 0, sql: 0, php: 0, networking: 0 };

/*
  No-repeat decks. For each track we deal 150 questions per tier (50 levels x 3)
  from all of the track's generators in turn, skipping anything already dealt
  anywhere in the track. A generator that cannot produce anything new is retired,
  so fact lists are used up evenly and the numeric ones fill the rest.
*/
// Questions are dealt in two rounds. Round 1 (150 per tier = levels 1–50) is exactly
// what earlier versions dealt, so existing levels keep their questions. Round 2 adds
// 225 more per tier (levels 51–125), still skipping anything already dealt.
const ROUNDS = [{ slots: 150, seed: "deck" }, { slots: 225, seed: "deck2" }];
const decks = {};
const deckStats = {};
function buildDeck(trk) {
  const seen = new Set();
  const tiers = TIERS.map(() => []);
  let unique = 0;
  for (const round of ROUNDS) {
    for (let tier = 0; tier < TIERS.length; tier++) {
      R = seeded(strHash(`${trk}-${round.seed}-${tier}`));
      const gens = GEN[trk].map((g) => (typeof g === "function" ? { min: 0, f: g } : g)).filter((g) => g.min <= tier).map((g) => () => g.f(tier, 0));
      if (VOCAB_CHANCE[trk]) gens.push(() => vocab(tier, trk));
      const dealt = [];
      // Pass 1 caps each question type at a fair share so no type dominates;
      // pass 2 lifts the cap only if the tier still has empty slots.
      const used = gens.map(() => 0);
      for (const cap of [Math.max(6, Math.ceil((round.slots / gens.length) * 1.5)), Infinity]) {
        const retired = new Set();
        while (dealt.length < round.slots && retired.size < gens.length) {
          for (const gi of shuf(gens.map((_, i) => i))) {
            if (retired.has(gi) || dealt.length >= round.slots) continue;
            if (used[gi] >= cap) { retired.add(gi); continue; }
            let got = null;
            for (let t = 0; t < 40 && !got; t++) {
              const q = gens[gi]();
              if (q && !seen.has(q[0] + "\u0001" + q[1])) got = q;
            }
            if (!got) { retired.add(gi); continue; }
            seen.add(got[0] + "\u0001" + got[1]);
            used[gi]++;
            dealt.push(got);
          }
        }
      }
      unique += dealt.length;
      // Only if a track truly runs dry: reuse this round's own questions.
      for (let i = 0; dealt.length < round.slots; i++) dealt.push(dealt[i]);
      tiers[tier].push(...dealt);
    }
  }
  R = Math.random;
  deckStats[trk] = unique;
  return tiers;
}
function questionsFor(trk, tier, n) {
  if (!decks[trk]) decks[trk] = buildDeck(trk);
  return decks[trk][tier].slice((n - 1) * 3, n * 3);
}

/*
  Level ids stay stable so saved stars never move:
    1–800      JavaScript, HTML, Logic, Debugging       (levels 1–50 of each tier)
    801–1600   Python, CSS, SQL, PHP                   (levels 1–50)
    1601–2000  Networking, Interview Prep              (levels 1–50)
    2001–5000  all 10 tracks                           (levels 51–125)
  Inside each block the tracks take turns. Every level stores "prev", the id
  of the level before it in the same track and tier.
*/
const ALL_TRACKS = [...TRACK_ORDER, ...NEW_TRACKS, "networking", "interview"];
const BLOCKS = [
  { tracks: TRACK_ORDER, from: 1, to: 50 },
  { tracks: NEW_TRACKS, from: 1, to: 50 },
  { tracks: ["networking", "interview"], from: 1, to: 50 },
  { tracks: ALL_TRACKS, from: 51, to: 125 },
];
const LV = [];
const idOf = {}; // "track/tier/n" -> id, used to find each level's prev
let nextId = 1;
BLOCKS.forEach(({ tracks, from, to }, b) => {
  const perTier = (to - from + 1) * tracks.length;
  for (let tier = 0; tier < TIERS.length; tier++) {
    const hand = b === 0 ? HAND_LV.filter((l) => l.tier === tier) : [];
    for (let k = 0; k < perTier; k++) {
      const id = nextId++;
      const trk = tracks[k % tracks.length];
      const n = from + Math.floor(k / tracks.length); // level number inside its track
      const prev = n > 1 ? idOf[`${trk}/${tier}/${n - 1}`] : 0;
      idOf[`${trk}/${tier}/${n}`] = id;
      const h = n === 1 && hand.find((l) => l.trk === trk);
      if (h) {
        LV.push({ id, tier, trk, n, prev, title: h.title, qs: h.qs });
        continue;
      }
      const pool = TITLES[trk];
      const round = n - 1;
      const title = pool[round % pool.length] + (round >= pool.length ? " " + (Math.floor(round / pool.length) + 1) : "");
      LV.push({ id, tier, trk, n, prev, title, get qs() { return questionsFor(trk, tier, n); } });
    }
  }
});
const TRACK_SIZE = 125; // levels per track per tier

/** Old saves used ids 1–16 (4 per tier). Map them onto the new ids. */
function migrateLevelIds(lv) {
  const outLv = {};
  for (const [key, stars] of Object.entries(lv || {})) {
    const old = HAND_LV[+key - 1];
    if (!old) continue;
    const k = TRACK_ORDER.indexOf(old.trk);
    outLv[old.tier * PER_TIER + k + 1] = stars;
  }
  return outLv;
}

if (typeof module !== "undefined") module.exports = { LV, PER_TIER, TRACK_SIZE, questionsFor, deckStats, migrateLevelIds };

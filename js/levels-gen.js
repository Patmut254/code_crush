/*
  LEVELS-GEN.JS
  -------------
  Builds 400 levels for every tier (1,600 in all): 8 tracks x 50 levels.
  The first JavaScript, HTML, Logic and Debugging level of each tier are the
  hand-written ones in data.js; the rest come from question generators below.
  Every level is seeded by its id, so a level always has the same questions,
  and numbers, arrays and words change from level to level.

  A question is [text, code, options, correctIndex, explanation], exactly like
  data.js. The correct option is listed first; app.js shuffles options.
*/
const PER_TIER = 200; // per block of 4 tracks; each tier has 2 blocks = 400 levels
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
function Q(text, code, correct, wrong, why, more = []) {
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
  return [text, code, opts, 0, why];
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

/* ---------- vocabulary (any track) ---------- */
function vocab(tier) {
  const bank = VOCAB[Math.min(tier, 2)];
  const [w, def] = pick(bank);
  const others = shuf(bank.filter((r) => r[0] !== w)).slice(0, 3);
  return R() < 0.5
    ? Q(`What does "${w}" mean?`, "", def, others.map((r) => r[1]), `${w}: ${def}`)
    : Q(`Which word means: ${def.charAt(0).toLowerCase() + def.slice(1)}`, "", w, others.map((r) => r[0]), `${w}: ${def}`);
}

const GEN = { js: JS, web: WEB, logic: LOGIC, debug: DEBUG, python: PY, css: CSSG, sql: SQLG, php: PHPG };
const TITLES = {
  js: ["Variable Vault", "Array Arcade", "Loop Lab", "String Theory", "Math Machine", "Type Check", "Map Quest", "Filter Frenzy", "Reduce Rush", "Closure Cove", "Async Avenue", "Spread Party"],
  web: ["Tag Hunt", "Attribute Alley", "Form Factory", "List Lane", "Head Start", "Link Up", "Semantic Street", "Status Codes", "Input Island", "Access for All", "Page Builder", "Safe Surfing"],
  css: ["Style Studio", "Box Model Bay", "Selector Showdown", "Colour Code", "Unit Converter", "Flex Factory", "Grid Garden", "Pseudo Party", "Rem Rally", "Layout Lane", "Specificity Peak", "Motion Lab"],
  python: ["Hello Python", "Slice Shop", "List Lab", "Range Rover", "Dict Diner", "F-String Fun", "Type Detective", "Loop Lagoon", "Comprehension Cove", "Zip Line", "Sort Station", "Pythonic Peak"],
  sql: ["First Query", "Count Down", "Order Up", "Max Out", "Sum It", "Distinct Docks", "Like a Pro", "Group Therapy", "Join Junction", "Null Island", "Key Keeper", "Query Quest"],
  php: ["Echo Echo", "Dot Joiner", "String Shop", "Array Avenue", "Loop Lane", "Key Value Inn", "Quote Quest", "Divide Docks", "Default Den", "Foreach Forest", "Type Juggle", "Server Side"],
  logic: ["True or False", "Binary Bridge", "Loop Counter", "Pattern Hunter", "Order of Ops", "Halving Hill", "Grade Gate", "Nested Nest", "Data Docks", "Big O Peak", "Search Party", "Brain Gym"],
  debug: ["Bug Hunt", "Error Explorer", "Off by One", "Squash It", "Crash Course", "Fix the Flow", "Case Closed", "Silent Bugs", "Trace It", "Patch Party", "Race Track", "Leak Detective"],
};
// Vocabulary questions show up less in the language tracks, which have plenty of their own.
const VOCAB_CHANCE = { js: 0.25, web: 0.25, logic: 0.25, debug: 0.25, css: 0.15, python: 0.1, sql: 0.1, php: 0.1 };

function makeQuestions(tier, trk, k, id) {
  R = seeded(id * 2654435761);
  const d = tier;
  const gens = GEN[trk].map((g) => (typeof g === "function" ? { min: 0, f: g } : g)).filter((g) => g.min <= d);
  const qs = [];
  const seen = new Set();
  let guard = 0;
  while (qs.length < 3 && guard++ < 80) {
    const q = R() < VOCAB_CHANCE[trk] ? vocab(tier) : pick(gens).f(d, k);
    if (!q) continue;
    const key = q[0] + q[1];
    if (seen.has(key)) continue;
    seen.add(key);
    qs.push(q);
  }
  R = Math.random;
  return qs;
}

/*
  Level ids stay stable so saved stars never move:
    1–800    the original four tracks (JavaScript, HTML, Logic, Debugging), 200 per tier
    801–1600 the newer tracks (Python, CSS, SQL, PHP), 200 per tier
  Inside each block the 4 tracks take turns, so the previous level in the
  same track is always id - 4. Every track gets 50 levels per tier.
*/
const BLOCKS = [TRACK_ORDER, NEW_TRACKS];
const LV = [];
BLOCKS.forEach((tracks, b) => {
  for (let tier = 0; tier < TIERS.length; tier++) {
    const hand = b === 0 ? HAND_LV.filter((l) => l.tier === tier) : [];
    for (let k = 0; k < PER_TIER; k++) {
      const id = b * TIERS.length * PER_TIER + tier * PER_TIER + k + 1;
      const trk = tracks[k % 4];
      const n = Math.floor(k / 4) + 1; // level number inside its track
      const h = k < 4 && hand.find((l) => l.trk === trk);
      if (h) {
        LV.push({ id, tier, trk, n, title: h.title, qs: h.qs });
        continue;
      }
      const pool = TITLES[trk];
      const round = n - 1;
      const title = pool[round % pool.length] + (round >= pool.length ? " " + (Math.floor(round / pool.length) + 1) : "");
      let qs = null;
      // Generated lazily the first time a level is opened.
      LV.push({ id, tier, trk, n, title, get qs() { return qs || (qs = makeQuestions(tier, trk, k, id)); } });
    }
  }
});
const TRACK_SIZE = PER_TIER / 4; // 50 levels per track per tier

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

if (typeof module !== "undefined") module.exports = { LV, PER_TIER, TRACK_SIZE, makeQuestions, migrateLevelIds };

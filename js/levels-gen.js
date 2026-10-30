/*
  LEVELS-GEN.JS
  -------------
  Builds 200 levels for every tier (800 in all). The first 4 levels of each
  tier are the hand-written ones in data.js; the rest come from question
  generators below. Every level is seeded by its id, so a level always has
  the same questions, and numbers, arrays and words change from level to level.

  A question is [text, code, options, correctIndex, explanation], exactly like
  data.js. The correct option is listed first; app.js shuffles options.
*/
const PER_TIER = 200;
const TRACK_ORDER = ["js", "web", "logic", "debug"];

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

/* ---------- HTML and CSS ---------- */
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
const WEB = [
  () => fromPool(TAGS, (r) => `Which tag creates ${r[1]}?`, (r) => `${r[0]} is used for ${r[1]}.`),
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
    return Q(`How wide does this box appear on screen?`,
      `.box {\n  box-sizing: ${sizing};\n  width: ${w}px;\n  padding: ${p}px;\n  border: ${b}px solid;\n}`,
      `${total}px`, [`${w}px`, `${w + p + b}px`, `${w + 2 * p}px`, `${w + 2 * p + 2 * b}px`],
      sizing === "content-box"
        ? `With content-box, padding and border are added on both sides: ${w} + ${2 * p} + ${2 * b} = ${total}.`
        : `With border-box, the width you set already includes padding and border.`);
  },
  () => fromPool(COLORS, (r) => `Which colour is ${r[0]}?`, (r) => `Hex colours are #RRGGBB. ${r[0]} is ${r[1].toLowerCase()}.`),
  { min: 1, f: () => fromPool(HTTP.map(([c, m]) => [c, m]), (r) => `Which HTTP status code means "${r[1]}"?`, (r) => `${r[0]} means ${r[1]}.`) },
  { min: 1, f: () => {
    const forms = [
      ["With display:flex, which property centres items along the main axis?", "justify-content", ["align-items", "text-align", "float"], "justify-content works on the main axis; align-items on the cross axis."],
      ["With display:flex, which property stacks items vertically?", "flex-direction: column", ["flex-wrap: wrap", "align-items: column", "display: vertical"], "flex-direction sets the main axis."],
      ["Which rule makes a 3-column grid of equal widths?", "grid-template-columns: repeat(3, 1fr)", ["columns: 3", "grid: 3 equal", "flex: 3"], "1fr is one fraction of the free space; repeat makes three."],
      ["Which value keeps a header stuck to the top while you scroll?", "position: sticky", ["position: static", "display: fixed-top", "float: top"], "sticky acts like relative until it reaches its top offset."],
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
  { min: 2, f: () => fromPool(WEB_PRO, (r) => r[1], (r) => `The answer is ${r[0].toLowerCase()}.`) },
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

/* ---------- vocabulary (any track) ---------- */
function vocab(tier) {
  const bank = VOCAB[Math.min(tier, 2)];
  const [w, def] = pick(bank);
  const others = shuf(bank.filter((r) => r[0] !== w)).slice(0, 3);
  return R() < 0.5
    ? Q(`What does "${w}" mean?`, "", def, others.map((r) => r[1]), `${w}: ${def}`)
    : Q(`Which word means: ${def.charAt(0).toLowerCase() + def.slice(1)}`, "", w, others.map((r) => r[0]), `${w}: ${def}`);
}

const GEN = { js: JS, web: WEB, logic: LOGIC, debug: DEBUG };
const TITLES = {
  js: ["Variable Vault", "Array Arcade", "Loop Lab", "String Theory", "Math Machine", "Type Check", "Map Quest", "Filter Frenzy", "Reduce Rush", "Closure Cove", "Async Avenue", "Spread Party"],
  web: ["Tag Hunt", "Style Studio", "Box Model Bay", "Selector Showdown", "Colour Code", "Flex Factory", "Grid Garden", "Status Codes", "Layout Lane", "Access for All", "Speed Run", "Safe Surfing"],
  logic: ["True or False", "Binary Bridge", "Loop Counter", "Pattern Hunter", "Order of Ops", "Halving Hill", "Grade Gate", "Nested Nest", "Data Docks", "Big O Peak", "Search Party", "Brain Gym"],
  debug: ["Bug Hunt", "Error Explorer", "Off by One", "Squash It", "Crash Course", "Fix the Flow", "Case Closed", "Silent Bugs", "Trace It", "Patch Party", "Race Track", "Leak Detective"],
};

function makeQuestions(tier, trk, k, id) {
  R = seeded(id * 2654435761);
  const d = tier;
  const gens = GEN[trk].map((g) => (typeof g === "function" ? { min: 0, f: g } : g)).filter((g) => g.min <= d);
  const qs = [];
  const seen = new Set();
  let guard = 0;
  while (qs.length < 3 && guard++ < 60) {
    const q = R() < 0.25 ? vocab(tier) : pick(gens).f(d, k);
    if (!q) continue;
    const key = q[0] + q[1];
    if (seen.has(key)) continue;
    seen.add(key);
    qs.push(q);
  }
  R = Math.random;
  return qs;
}

const LV = [];
for (let tier = 0; tier < TIERS.length; tier++) {
  const hand = HAND_LV.filter((l) => l.tier === tier);
  for (let k = 0; k < PER_TIER; k++) {
    const id = tier * PER_TIER + k + 1;
    const trk = TRACK_ORDER[k % 4];
    const h = hand.find((l) => l.trk === trk && k < 4);
    if (h) {
      LV.push({ id, tier, trk, title: h.title, qs: h.qs });
      continue;
    }
    const pool = TITLES[trk];
    const round = Math.floor(k / 4);
    const title = pool[round % pool.length] + (round >= pool.length ? " " + (Math.floor(round / pool.length) + 1) : "");
    let qs = null;
    // Generated lazily the first time a level is opened.
    LV.push({ id, tier, trk, title, get qs() { return qs || (qs = makeQuestions(tier, trk, k, id)); } });
  }
}

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

if (typeof module !== "undefined") module.exports = { LV, PER_TIER, makeQuestions, migrateLevelIds };

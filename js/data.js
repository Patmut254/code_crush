// Each tier and track has a picture (assets/*.webp), an SVG icon (names come from P in app.js) and a colour.
const TIERS=[
{n:"Beginner",sub:"Learn the basics",img:"catGym",icon:"seedling",col:"#2FAE72"},
{n:"Mid Dev",sub:"Build real things",img:"catGame",icon:"rocket",col:"#2E7CF6"},
{n:"Pro Dev",sub:"Think in systems",img:"chibi",icon:"bolt",col:"#F08C00"},
{n:"Specialist",sub:"Master the craft",img:"penguin",icon:"crown",col:"#E5383B"}];
// Order here is the order on Home and in the Levels tab.
const TRK={
js:{n:"JavaScript",sub:"Your core language",img:"lionDance",icon:"braces",fg:"#B58900",bg:"#FFF3C4"},
python:{n:"Python",sub:"Clean and readable",img:"monkey",icon:"terminal",fg:"#2E8B57",bg:"#D9F3E3"},
php:{n:"PHP",sub:"Server-side web",img:"elephant",icon:"server",fg:"#6A6FB3",bg:"#E6E4F7"},
sql:{n:"SQL",sub:"Talk to databases",img:"bear",icon:"database",fg:"#0E8FA8",bg:"#D5F1F7"},
web:{n:"HTML",sub:"Build the page",img:"parrot",icon:"code",fg:"#E4572E",bg:"#FFE3D8"},
css:{n:"CSS",sub:"Make it beautiful",img:"giraffe",icon:"palette",fg:"#2965F1",bg:"#DDE8FF"},
logic:{n:"Logic",sub:"Think like a programmer",img:"eagle",icon:"puzzle",fg:"#7B4FD6",bg:"#ECE3FF"},
debug:{n:"Debugging",sub:"Find it, fix it, ship it",img:"tiger",icon:"bug",fg:"#D6455B",bg:"#FFDCE1"}};
// question = [text, code, options, correctIndex, explanation]
const HAND_LV=[
[0,"js","Variables and values",[
["Which line stores the number 5 in a variable called age?","",["age = 5 as var","let age = 5;","variable age 5","int age: 5"],1,"let creates a variable. The name comes next, then = and the value."],
["What does this print?","console.log(\"Hi \" + \"there\")",["Hi there","Hithere","Hi + there","Error"],0,"The + sign joins two strings. The space inside \"Hi \" is kept, so you get Hi there."],
["Which of these is a string?","",["42","true","\"42\"","[42]"],2,"Quotes make text. \"42\" is a string even though it looks like a number."]]],
[0,"web","Your first web page",[
["Which tag makes the biggest heading?","",["<h6>","<h1>","<head>","<big>"],1,"h1 is the top level heading. h6 is the smallest."],
["Which tag creates a link?","",["<a>","<link>","<href>","<url>"],0,"The anchor tag <a> with an href attribute makes a clickable link."],
["Which CSS rule makes paragraph text red?","p { ??? }",["text: red;","color: red;","font-red: true;","paint: red;"],1,"color sets the text colour. background-color would change the area behind the text."]]],
[0,"logic","Thinking in steps",[
["In what order does a program run its lines by default?","",["Random order","Bottom to top","Top to bottom","Alphabetical"],2,"Code runs line by line from the top, unless loops or conditions change the flow."],
["What does this print?","if (3 > 5) { print(\"A\") }\nelse { print(\"B\") }",["A","B","Both","Nothing"],1,"3 is not greater than 5, so the condition is false and the else branch runs."],
["How many times does this say hello?","repeat 3 times:\n  say hello",["1","2","3","4"],2,"A loop repeats its body exactly as many times as you tell it to."]]],
[0,"debug","What is a bug?",[
["In programming, a bug is:","",["A virus","A mistake in the code","A slow computer","A new feature"],1,"A bug is any mistake that makes a program behave differently from what you intended."],
["You see a SyntaxError. What does it usually mean?","",["The server is down","The code breaks the grammar rules of the language","Your screen is too small","Your Wi Fi failed"],1,"Syntax errors mean the code is not written in a valid form, like a missing bracket or quote."],
["What is the best first move when your code breaks?","",["Read the error message","Delete everything","Restart the laptop","Rewrite from scratch"],0,"Error messages usually name the file and line. Start there before changing anything."]]],

[1,"js","Arrays and operators",[
["What does this print?","const n=[1,2,3];\nconsole.log(n.map(x=>x*2))",["[1,2,3]","[2,4,6]","6","undefined"],1,"map builds a new array by running the function on every item."],
["What does this print?","console.log('5'+3)",["8","'53'","NaN","Error"],1,"When one side is a string, + joins text instead of adding. The result is the string 53."],
["Which keyword declares a block scoped variable that cannot be reassigned?","",["var","let","const","static"],2,"const blocks reassignment. let is block scoped but can change. var is function scoped."]]],
[1,"web","Layout and selectors",[
["With display:flex on a parent, which property centres children along the main axis?","",["align-items","text-align","justify-content","float"],2,"justify-content works on the main axis. align-items works on the cross axis."],
["Which selector has the highest specificity?","",[".btn","#btn","button","*"],1,"IDs beat classes, classes beat element selectors, and * counts for nothing."],
["What does box-sizing: border-box change?","",["Width includes padding and border","It adds a border","It removes margins","It makes the box square"],0,"With border-box the width you set is the final size, which makes layouts easier to predict."]]],
[1,"logic","Logic and loops",[
["What does this evaluate to?","true && false || true",["false","true","undefined","null"],1,"&& runs before ||, so false || true gives true."],
["What is s at the end?","let s=0;\nfor(let i=1;i<=4;i++){ s+=i }",["6","10","4","24"],1,"1 + 2 + 3 + 4 = 10."],
["Which structure is last in, first out?","",["Queue","Set","Stack","Map"],2,"A stack removes the most recently added item first, like a pile of plates."]]],
[1,"debug","Reading errors",[
["What is the bug in this loop?","for(let i=0;i<=arr.length;i++){\n  use(arr[i])\n}",["Missing semicolon","Off by one: should be <","arr is const","i should be var"],1,"Array indexes run from 0 to length minus 1. Using <= reads one item past the end."],
["Why does this misbehave?","if (x = 5) { go() }",["It assigns instead of comparing","x is a string","if needs an else","go is reserved"],0,"A single = assigns a value. Use === to compare."],
["\"Cannot read properties of undefined\" usually means:","",["A syntax error","You used a property on an undefined value","Out of memory","The network is down"],1,"Something you expected to exist is undefined. Trace back to where that value should have been set."]]],

[2,"js","Async and closures",[
["What does this print?","console.log([1,2,3].reduce((a,b)=>a+b,0))",["6","123","[1,2,3]","0"],0,"reduce folds the array into one value, starting at 0 and adding each item."],
["What does this print?","for(var i=0;i<3;i++)\n  setTimeout(()=>console.log(i),0)",["0 1 2","3 3 3","0 0 0","Nothing"],1,"var is function scoped, so every callback shares one i, which is 3 when the loop ends. let would print 0 1 2."],
["What does await do inside an async function?","",["Pauses that function until the promise settles","Blocks the whole browser","Cancels the promise","Runs the code twice"],0,"await pauses only the async function. The rest of the page keeps running."]]],
[2,"web","Modern CSS and access",[
["Which rule builds a responsive grid that wraps on small screens?","",["grid-template-columns: repeat(auto-fit, minmax(200px, 1fr))","columns: 3 fixed","display: table-cell","float: grid"],0,"auto-fit with minmax makes as many columns as fit, so it wraps without media queries."],
["Which alt value suits a purely decorative image?","",["alt=\"\"","alt=\"image\"","title=\"image\"","role=\"button\""],0,"An empty alt tells screen readers to skip the image."],
["Which property is cheapest to animate smoothly?","",["width","top","transform","margin"],2,"transform and opacity can run on the GPU without recalculating layout."]]],
[2,"logic","Complexity",[
["Sorting n items with a good algorithm takes roughly:","",["O(n)","O(n log n)","O(1)","O(2^n)"],1,"Efficient comparison sorts like merge sort take O(n log n)."],
["Binary search on 1,000 sorted items needs about how many steps at worst?","",["10","100","500","1000"],0,"Each step halves the search space. 2 to the power 10 is 1,024."],
["A hash map lookup is on average:","",["O(n)","O(1)","O(log n)","O(n squared)"],1,"The hash function jumps straight to a bucket, so lookup time does not grow with size."]]],
[2,"debug","Debugging in practice",[
["A function works the first time but not the second. A likely cause?","",["Shared state left over from the first call","The keyboard","Too many comments","CSS is loaded"],0,"State that is changed and never reset, like a global array, carries into the next call."],
["Which tool pauses code so you can inspect variables?","",["A formatter","A debugger breakpoint","A minifier","A linter"],1,"Breakpoints stop execution on a line so you can inspect values step by step."],
["A bug only appears in production. What is the best first step?","",["Push random fixes","Compare logs and environment differences","Disable monitoring","Rewrite the app"],1,"Differences in data, config and versions usually explain it, and logs show what really happened."]]],

[3,"js","The event loop",[
["What does this print?","console.log(typeof null)",["null","object","undefined","number"],1,"A long standing quirk: typeof null returns object. Check with value === null instead."],
["In which order do these print?","console.log(1);\nsetTimeout(()=>console.log(2),0);\nPromise.resolve().then(()=>console.log(3));\nconsole.log(4);",["1 2 3 4","1 4 2 3","1 4 3 2","1 3 4 2"],2,"Synchronous code runs first. Promise callbacks (microtasks) run before timers (macrotasks)."],
["What is a closure?","",["A function that remembers variables from where it was created","A way to close a browser tab","A private class keyword","A syntax error"],0,"A closure keeps access to its outer scope even after the outer function has returned."]]],
[3,"web","Performance and security",[
["Which header limits where scripts may load from?","",["Accept-Language","Content-Security-Policy","Cache-Control","ETag"],1,"CSP lets you declare trusted sources, which reduces the damage from cross site scripting."],
["What best improves Largest Contentful Paint?","",["Add more fonts","Preload and correctly size the hero image","Ship more JavaScript","Remove alt text"],1,"LCP is usually the biggest image or heading. Loading it earlier and at the right size makes it faster."],
["Why prefer native HTML elements over ARIA where possible?","",["ARIA is slower","Native elements already include roles and keyboard behaviour","Search engines ban ARIA","CSS requires it"],1,"A real button gets focus, Enter and Space handling for free. ARIA only describes, it adds no behaviour."]]],
[3,"logic","Algorithms",[
["Which problem suits dynamic programming?","",["Printing a list","Overlapping subproblems like Fibonacci","Reading a file","Changing a colour"],1,"When the same subproblems repeat, caching their results avoids exponential work."],
["Detecting a cycle in a linked list with O(1) memory uses:","",["A hash set","Recursion","Fast and slow pointers","Sorting"],2,"If the fast pointer laps the slow one, there is a cycle, and no extra storage is needed."],
["Which structure fits a priority queue best?","",["Stack","Heap","Plain array scan","Linked list"],1,"A heap gives the smallest or largest item quickly and inserts in O(log n)."]]],
[3,"debug","Hard bugs",[
["A memory leak in a long running app is best found with:","",["Console.log everywhere","Reloading often","Heap snapshots over time","Shorter variable names"],2,"Comparing heap snapshots shows which objects keep growing and what keeps them alive."],
["A race condition means:","",["A very fast loop","The result depends on the timing of concurrent operations","A network timeout","A slow database"],1,"When operations interleave unpredictably, outcomes change from run to run."],
["Which approach finds the commit that introduced a bug fastest?","",["git stash","git rebase","git bisect","git blame only"],2,"bisect does a binary search through history, testing the midpoint each time."]]]
].map(([tier,trk,title,qs],i)=>({id:i+1,tier,trk,title,qs}));

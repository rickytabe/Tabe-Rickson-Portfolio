// CSC207 Tutorial Sheet Solutions: tutorial sheets with full worked solutions. Server-only content:
// the page renders the free solutions, and the locked ones come from /api/book/solutions after unlock.
// Questions are word for word from the sheet. Solutions are pre-rendered HTML (pseudocode blocks
// with tinted keywords, comments and strings). Generated from the Tutorial Sheet 1 PDF source.

export type Csc207tItem = {
  id: string; // section id, e.g. "s1-e2-3" (sheet 1, exercise II, question 3)
  label: string; // printed number, e.g. "II.3"
  part: "I" | "II" | "III" | "IV";
  topic: string; // sidebar label
  question: string;
  think: string;
  solution: string;
};

export const CSC207T_ITEMS: Csc207tItem[] = [
  {
    "id": "s1-e1-1a",
    "label": "I.1a",
    "part": "I",
    "topic": "Insert() into an ordered set",
    "question": "<p>1. Consider an ordered set data structure constructed as:</p>\n<pre class=\"sheet\">struct OrderedSet{\n        int elements[MAX];\n        int size;\n}</pre>\n<p>a. Construct the operations Insert() which add an element val at the right position in the ordered set.</p>",
    "think": "<p>Two words in the name carry all the rules. <b>Set</b>: no duplicates, so check first and do nothing if <code>val</code> is already there. <b>Ordered</b>: the array is always sorted, so you cannot just put <code>val</code> at the end.</p>\n<p>Picture people standing in a line by height. To add someone, everyone taller takes one step to the right and the newcomer steps into the gap. In code: start at the last element, shift every element bigger than <code>val</code> one place right, then drop <code>val</code> into the free slot. Don't forget the edge case: the array may already be full (<code>size == MAX</code>).</p>",
    "solution": "<pre class=\"code\"><span class=\"k\">struct</span> OrderedSet {\n    <span class=\"k\">int</span> elements[MAX];\n    <span class=\"k\">int</span> size;\n}\n\n<span class=\"c\">// Check if the ordered set already holds val</span>\n<span class=\"k\">bool</span> contains(OrderedSet *s, <span class=\"k\">int</span> val) {\n    <span class=\"k\">for</span> (<span class=\"k\">int</span> i = 0; i &lt; s-&gt;size; i++) {\n        <span class=\"k\">if</span> (s-&gt;elements[i] == val)\n            <span class=\"k\">return</span> <span class=\"k\">true</span>;\n        <span class=\"k\">if</span> (s-&gt;elements[i] &gt; val)    <span class=\"c\">// set is ordered, val cannot be further on</span>\n            <span class=\"k\">return</span> <span class=\"k\">false</span>;\n    }\n    <span class=\"k\">return</span> <span class=\"k\">false</span>;\n}\n\n<span class=\"c\">// Insert val at its right position so the set stays ordered</span>\n<span class=\"k\">void</span> Insert(OrderedSet *s, <span class=\"k\">int</span> val) {\n    <span class=\"k\">if</span> (s-&gt;size == MAX) {            <span class=\"c\">// no space left</span>\n        println(<span class=\"s\">\"Set is full\"</span>);\n        <span class=\"k\">return</span>;\n    }\n    <span class=\"k\">if</span> (contains(s, val)) {          <span class=\"c\">// a set keeps no duplicates</span>\n        <span class=\"k\">return</span>;\n    }\n    <span class=\"k\">int</span> i = s-&gt;size - 1;\n    <span class=\"k\">while</span> (i &gt;= 0 &amp;&amp; s-&gt;elements[i] &gt; val) {   <span class=\"c\">// shift bigger values one step right</span>\n        s-&gt;elements[i + 1] = s-&gt;elements[i];\n        i--;\n    }\n    s-&gt;elements[i + 1] = val;        <span class=\"c\">// drop val into the free slot</span>\n    s-&gt;size++;\n}</pre><p class=\"eg\"><b>Example.</b> Set = {1, 3, 7}, insert 5: 7 moves right, 3 is not bigger so the loop stops, 5 lands in the gap: {1, 3, 5, 7}. Inserting 3 again changes nothing.</p>"
  },
  {
    "id": "s1-e1-1b",
    "label": "I.1b",
    "part": "I",
    "topic": "Union(Set1, Set2)",
    "question": "<p>b. Construct the operation the Union(Set1, Set2) which produces a resultant set which is the union of set 1 and set 2. Eg if Set1={1,2,3} and Set 2 = {2, 4, 5}, then the union is {1,2,3,4,5}.</p>",
    "think": "<p>The union is \"everything that is in Set1, Set2 or both, written once\". You already built the hard part in (a): <code>Insert()</code> keeps the result sorted and refuses duplicates.</p>\n<p>So the union is just: start with an empty set, insert every element of Set1, then every element of Set2. The duplicates (the 2 in the example) are skipped automatically. Reusing an operation you already wrote is exactly what examiners want to see.</p>",
    "solution": "<pre class=\"code\"><span class=\"c\">// Build a new set holding every element of Set1 and Set2</span>\nOrderedSet Union(OrderedSet *Set1, OrderedSet *Set2) {\n    OrderedSet result;\n    result.size = 0;                 <span class=\"c\">// start with an empty set</span>\n\n    <span class=\"k\">for</span> (<span class=\"k\">int</span> i = 0; i &lt; Set1-&gt;size; i++) {\n        Insert(&amp;result, Set1-&gt;elements[i]);\n    }\n    <span class=\"k\">for</span> (<span class=\"k\">int</span> j = 0; j &lt; Set2-&gt;size; j++) {\n        Insert(&amp;result, Set2-&gt;elements[j]);   <span class=\"c\">// Insert skips the ones already there</span>\n    }\n    <span class=\"k\">return</span> result;\n}</pre><p class=\"eg\"><b>Check with the sheet's example.</b> Set1 = {1, 2, 3} gives {1, 2, 3}. From Set2 = {2, 4, 5}: 2 is skipped as a duplicate, then 4 and 5 go in. Result = {1, 2, 3, 4, 5}. ✓</p>"
  },
  {
    "id": "s1-e1-2",
    "label": "I.2",
    "part": "I",
    "topic": "isPalindrome()",
    "question": "<p>2. A palindrome is a word, which when written in the reversed order is same as the word itself. Eg dad, level, madam, 121. Using an Array of characters, propose the algorithm called isPalindrome() which determines whether or not a word is a palindrome.</p>",
    "think": "<p>Don't build the reversed word. Compare from both ends at once: the first letter with the last, the second with the second-last, and walk inward. Use two indices, <code>left</code> starting at 0 and <code>right</code> at <code>n - 1</code>.</p>\n<p>One mismatch is enough to answer \"no\". If the two indices meet or cross with no mismatch, every pair matched, so the answer is \"yes\". This checks only half the word, which is efficient.</p>",
    "solution": "<pre class=\"code\"><span class=\"c\">// Check whether word[0..n-1] reads the same backwards</span>\n<span class=\"k\">bool</span> isPalindrome(<span class=\"k\">char</span> word[], <span class=\"k\">int</span> n) {\n    <span class=\"k\">int</span> left = 0;\n    <span class=\"k\">int</span> right = n - 1;\n    <span class=\"k\">while</span> (left &lt; right) {\n        <span class=\"k\">if</span> (word[left] != word[right]) {\n            <span class=\"k\">return</span> <span class=\"k\">false</span>;\n        }\n        left++;\n        right--;\n    }\n    <span class=\"k\">return</span> <span class=\"k\">true</span>;                     <span class=\"c\">// every pair matched</span>\n}</pre><p class=\"eg\"><b>Trace \"level\".</b> l = l, e = e, then left and right meet at v: true. <b>\"lever\"</b>: l = r? No, so false at once. It also works for \"121\", because the digits are stored as characters.</p>"
  },
  {
    "id": "s1-e2-1",
    "label": "II.1",
    "part": "II",
    "topic": "Odd or Even Checker",
    "question": "<p>1. Odd or Even Checker: Write a program that takes an integer input and checks if it’s odd or even. Use branching to display the result.</p>",
    "think": "<p>A number is even when dividing it by 2 leaves nothing over. The remainder operator <code>%</code> gives exactly that: <code>n % 2</code> is 0 for even numbers and 1 for odd ones. One if/else on that remainder is the whole program.</p>",
    "solution": "<pre class=\"code\"><span class=\"k\">void</span> oddOrEven() {\n    <span class=\"k\">int</span> n;\n    read(n);\n    <span class=\"k\">if</span> (n % 2 == 0) {\n        println(<span class=\"s\">\"Even\"</span>);\n    } <span class=\"k\">else</span> {\n        println(<span class=\"s\">\"Odd\"</span>);\n    }\n}</pre>"
  },
  {
    "id": "s1-e2-2",
    "label": "II.2",
    "part": "II",
    "topic": "Grade Calculator",
    "question": "<p>2. Grade Calculator: Given a score between 0-100, write a program that assigns grades based on the score. Use branching to determine if the score is in grade A, B, C, etc.</p>",
    "think": "<p>This is multi-way selection: an if / else if chain. Two habits make it correct. First, reject impossible input (below 0 or above 100). Second, test from the <b>highest band down</b>. Once <code>score &gt;= 80</code> has failed, the next test only needs <code>score &gt;= 70</code>: the upper limit is already guaranteed, so you never write ranges twice.</p>",
    "solution": "<pre class=\"code\"><span class=\"k\">void</span> gradeCalculator() {\n    <span class=\"k\">int</span> score;\n    read(score);\n    <span class=\"k\">if</span> (score &lt; 0 || score &gt; 100) {\n        println(<span class=\"s\">\"Invalid score\"</span>);\n    } <span class=\"k\">else</span> <span class=\"k\">if</span> (score &gt;= 80) {\n        println(<span class=\"s\">\"Grade A\"</span>);\n    } <span class=\"k\">else</span> <span class=\"k\">if</span> (score &gt;= 70) {\n        println(<span class=\"s\">\"Grade B\"</span>);\n    } <span class=\"k\">else</span> <span class=\"k\">if</span> (score &gt;= 60) {\n        println(<span class=\"s\">\"Grade C\"</span>);\n    } <span class=\"k\">else</span> <span class=\"k\">if</span> (score &gt;= 50) {\n        println(<span class=\"s\">\"Grade D\"</span>);\n    } <span class=\"k\">else</span> {\n        println(<span class=\"s\">\"Grade F\"</span>);\n    }\n}</pre><p class=\"note\"><b>Note.</b> The sheet doesn't give the bands. These use A 80+, B 70–79, C 60–69, D 50–59, F below 50. If your lecturer uses other cut-offs, change only the numbers; the structure stays the same.</p>"
  },
  {
    "id": "s1-e2-3",
    "label": "II.3",
    "part": "II",
    "topic": "Largest of Three Numbers",
    "question": "<p>3. Largest of Three Numbers: Write a program that takes three numbers as input and uses nested branching to find the largest number.</p>",
    "think": "<p>The question insists on <b>nested</b> branching, so put an if inside an if. Compare two numbers first, a and b. The winner is the only one that can still be the largest, so the inner if compares that winner with c. That is exactly two comparisons on every path.</p>",
    "solution": "<pre class=\"code\"><span class=\"k\">void</span> largestOfThree() {\n    <span class=\"k\">int</span> a, b, c;\n    read(a);\n    read(b);\n    read(c);\n    <span class=\"k\">if</span> (a &gt;= b) {\n        <span class=\"k\">if</span> (a &gt;= c) {\n            println(a);\n        } <span class=\"k\">else</span> {\n            println(c);\n        }\n    } <span class=\"k\">else</span> {\n        <span class=\"k\">if</span> (b &gt;= c) {\n            println(b);\n        } <span class=\"k\">else</span> {\n            println(c);\n        }\n    }\n}</pre>"
  },
  {
    "id": "s1-e2-4",
    "label": "II.4",
    "part": "II",
    "topic": "Number Sign Detector",
    "question": "<p>4. Number Sign Detector: Write a program that takes an integer as input and uses branching to check if it's positive, negative, or zero.</p>",
    "think": "<p>Three possible answers means three paths: if, else if, else. Test the two real conditions (<code>&gt; 0</code> and <code>&lt; 0</code>). Whatever is left can only be zero, so the final else needs no test.</p>",
    "solution": "<pre class=\"code\"><span class=\"k\">void</span> numberSign() {\n    <span class=\"k\">int</span> n;\n    read(n);\n    <span class=\"k\">if</span> (n &gt; 0) {\n        println(<span class=\"s\">\"Positive\"</span>);\n    } <span class=\"k\">else</span> <span class=\"k\">if</span> (n &lt; 0) {\n        println(<span class=\"s\">\"Negative\"</span>);\n    } <span class=\"k\">else</span> {\n        println(<span class=\"s\">\"Zero\"</span>);\n    }\n}</pre>"
  },
  {
    "id": "s1-e2-5",
    "label": "II.5",
    "part": "II",
    "topic": "Leap Year Checker",
    "question": "<p>5. Leap Year Checker: Write a program that takes a year as input and uses branching to determine if it's a leap year.</p>",
    "think": "<p>The full rule has three layers: divisible by 4 is a leap year, <b>except</b> years divisible by 100, <b>except</b> years divisible by 400. Test the most specific rule first (400), then 100, then 4. 2000 is a leap year (divisible by 400), 1900 is not (divisible by 100), 2024 is (divisible by 4).</p>",
    "solution": "<pre class=\"code\"><span class=\"k\">void</span> leapYearChecker() {\n    <span class=\"k\">int</span> year;\n    read(year);\n    <span class=\"k\">if</span> (year % 400 == 0) {           <span class=\"c\">// 2000 is a leap year</span>\n        println(<span class=\"s\">\"Leap year\"</span>);\n    } <span class=\"k\">else</span> <span class=\"k\">if</span> (year % 100 == 0) {    <span class=\"c\">// 1900 is not</span>\n        println(<span class=\"s\">\"Not a leap year\"</span>);\n    } <span class=\"k\">else</span> <span class=\"k\">if</span> (year % 4 == 0) {\n        println(<span class=\"s\">\"Leap year\"</span>);\n    } <span class=\"k\">else</span> {\n        println(<span class=\"s\">\"Not a leap year\"</span>);\n    }\n}</pre>"
  },
  {
    "id": "s1-e2-6",
    "label": "II.6",
    "part": "II",
    "topic": "BMI Calculator",
    "question": "<p>6. BMI Calculator: Write a program that calculates the BMI of a person given their weight and height and uses branching to determine the BMI category (underweight, normal, overweight, etc.).</p>",
    "think": "<p>Two jobs, in order: <b>compute</b>, then <b>classify</b>. BMI = weight ÷ height², with weight in kg and height in metres, so use <code>float</code> variables. Then a high-to-low (or low-to-high) else-if chain on the standard bands: below 18.5 underweight, below 25 normal, below 30 overweight, otherwise obese.</p>",
    "solution": "<pre class=\"code\"><span class=\"k\">void</span> bmiCalculator() {\n    <span class=\"k\">float</span> weight, height;            <span class=\"c\">// weight in kg, height in metres</span>\n    read(weight);\n    read(height);\n\n    <span class=\"k\">float</span> bmi = weight / (height * height);\n    println(<span class=\"s\">\"BMI: \"</span>, bmi);\n\n    <span class=\"k\">if</span> (bmi &lt; 18.5) {\n        println(<span class=\"s\">\"Underweight\"</span>);\n    } <span class=\"k\">else</span> <span class=\"k\">if</span> (bmi &lt; 25) {\n        println(<span class=\"s\">\"Normal\"</span>);\n    } <span class=\"k\">else</span> <span class=\"k\">if</span> (bmi &lt; 30) {\n        println(<span class=\"s\">\"Overweight\"</span>);\n    } <span class=\"k\">else</span> {\n        println(<span class=\"s\">\"Obese\"</span>);\n    }\n}</pre>"
  },
  {
    "id": "s1-e2-7",
    "label": "II.7",
    "part": "II",
    "topic": "Vowel or Consonant Checker",
    "question": "<p>7. Vowel or Consonant Checker: Write a program that takes a single character input and checks if it’s a vowel or consonant.</p>",
    "think": "<p>A careful answer checks first that the character <b>is a letter</b> at all: '5' or '?' is neither vowel nor consonant. Then there are only five vowels, in lower and upper case, so compare against them. Anything else that is a letter is a consonant.</p>",
    "solution": "<pre class=\"code\"><span class=\"k\">void</span> vowelOrConsonant() {\n    <span class=\"k\">char</span> ch;\n    read(ch);\n    <span class=\"k\">if</span> ((ch &gt;= <span class=\"s\">'a'</span> &amp;&amp; ch &lt;= <span class=\"s\">'z'</span>) || (ch &gt;= <span class=\"s\">'A'</span> &amp;&amp; ch &lt;= <span class=\"s\">'Z'</span>)) {\n        <span class=\"k\">if</span> (ch == <span class=\"s\">'a'</span> || ch == <span class=\"s\">'e'</span> || ch == <span class=\"s\">'i'</span> || ch == <span class=\"s\">'o'</span> || ch == <span class=\"s\">'u'</span> ||\n            ch == <span class=\"s\">'A'</span> || ch == <span class=\"s\">'E'</span> || ch == <span class=\"s\">'I'</span> || ch == <span class=\"s\">'O'</span> || ch == <span class=\"s\">'U'</span>) {\n            println(<span class=\"s\">\"Vowel\"</span>);\n        } <span class=\"k\">else</span> {\n            println(<span class=\"s\">\"Consonant\"</span>);\n        }\n    } <span class=\"k\">else</span> {\n        println(<span class=\"s\">\"Not a letter\"</span>);\n    }\n}</pre>"
  },
  {
    "id": "s1-e2-8",
    "label": "II.8",
    "part": "II",
    "topic": "Simple Calculator",
    "question": "<p>8. Simple Calculator: Create a program that takes two numbers and an operator (+, -, *, /) as input, then uses branching to perform the corresponding operation.</p>",
    "think": "<p>Choosing one action from a fixed list of values (+, -, *, /) is what <code>switch</code> is built for, in the same style as Exercise IV(a). Remember <code>break</code> after each case, and a <code>default</code> for an unknown operator. The one trap: dividing by zero must be caught before you divide.</p>",
    "solution": "<pre class=\"code\"><span class=\"k\">void</span> simpleCalculator() {\n    <span class=\"k\">float</span> a, b;\n    <span class=\"k\">char</span> op;\n    read(a);\n    read(op);\n    read(b);\n\n    <span class=\"k\">switch</span>(op)\n    {\n        <span class=\"k\">case</span> <span class=\"s\">'+'</span>: println(a + b); <span class=\"k\">break</span>;\n        <span class=\"k\">case</span> <span class=\"s\">'-'</span>: println(a - b); <span class=\"k\">break</span>;\n        <span class=\"k\">case</span> <span class=\"s\">'*'</span>: println(a * b); <span class=\"k\">break</span>;\n        <span class=\"k\">case</span> <span class=\"s\">'/'</span>:\n            <span class=\"k\">if</span> (b == 0) {            <span class=\"c\">// division by zero is not allowed</span>\n                println(<span class=\"s\">\"Error: cannot divide by zero\"</span>);\n            } <span class=\"k\">else</span> {\n                println(a / b);\n            }\n            <span class=\"k\">break</span>;\n        <span class=\"k\">default</span>: println(<span class=\"s\">\"Invalid operator\"</span>);\n    }\n}</pre>"
  },
  {
    "id": "s1-e2-9",
    "label": "II.9",
    "part": "II",
    "topic": "Eligibility Checker",
    "question": "<p>9. Eligibility Checker: Write a program to check if a person is eligible to vote based on their age (18 and above).</p>",
    "think": "<p>\"18 and above\" means <code>age &gt;= 18</code>, not <code>&gt; 18</code>; that single symbol is what the question is testing. A negative age is impossible input, so it gets its own message.</p>",
    "solution": "<pre class=\"code\"><span class=\"k\">void</span> eligibilityChecker() {\n    <span class=\"k\">int</span> age;\n    read(age);\n    <span class=\"k\">if</span> (age &lt; 0) {\n        println(<span class=\"s\">\"Invalid age\"</span>);\n    } <span class=\"k\">else</span> <span class=\"k\">if</span> (age &gt;= 18) {\n        println(<span class=\"s\">\"Eligible to vote\"</span>);\n    } <span class=\"k\">else</span> {\n        println(<span class=\"s\">\"Not eligible to vote\"</span>);\n    }\n}</pre>"
  },
  {
    "id": "s1-e2-10",
    "label": "II.10",
    "part": "II",
    "topic": "Discount Calculator",
    "question": "<p>10. Discount Calculator: Given an item price and discount rate, write a program that applies a 10% discount if the price is over a certain amount, say $100.</p>",
    "think": "<p>Read the price and the rate. The discount only applies when the price is <b>over</b> 100, so start with discount = 0 and change it only inside the if. Then the final price is always price − discount, whether or not a discount applied. A rate of 10 means 10%, so divide by 100.</p>",
    "solution": "<pre class=\"code\"><span class=\"k\">void</span> discountCalculator() {\n    <span class=\"k\">float</span> price, rate;               <span class=\"c\">// rate is a percentage, 10 for the 10% case</span>\n    read(price);\n    read(rate);\n\n    <span class=\"k\">float</span> discount = 0;\n    <span class=\"k\">if</span> (price &gt; 100) {               <span class=\"c\">// discount only above the limit</span>\n        discount = price * rate / 100;\n    }\n    <span class=\"k\">float</span> finalPrice = price - discount;\n\n    println(<span class=\"s\">\"Discount: \"</span>, discount);\n    println(<span class=\"s\">\"Amount to pay: \"</span>, finalPrice);\n}</pre><p class=\"eg\"><b>Example.</b> Price 150, rate 10: discount 15, pay 135. Price 80: no discount, pay 80.</p>"
  },
  {
    "id": "s1-e3-1",
    "label": "III.1",
    "part": "III",
    "topic": "Print Natural Numbers",
    "question": "<p>1. Print Natural Numbers: Write a program that uses a loop to print the first 10 natural numbers.</p>",
    "think": "<p>You know exactly how many times to repeat (10), which is the signal for a <code>for</code> loop. A counter starts at 1, stops after 10, and goes up by 1. Print the counter itself.</p>",
    "solution": "<pre class=\"code\"><span class=\"k\">void</span> printNaturalNumbers() {\n    <span class=\"k\">for</span> (<span class=\"k\">int</span> i = 1; i &lt;= 10; i++) {\n        println(i);\n    }\n}</pre>"
  },
  {
    "id": "s1-e3-2",
    "label": "III.2",
    "part": "III",
    "topic": "Sum of N Numbers",
    "question": "<p>2. Sum of N Numbers: Write a program to calculate the sum of numbers from 1 to N using a loop.</p>",
    "think": "<p>This is the <b>accumulator</b> pattern: a running total that starts at 0 (adding 0 changes nothing) and grows by one value each round. Loop i from 1 to N and do <code>sum = sum + i</code>. You can check your answer with the formula N(N+1)/2; for N = 5, both give 15.</p>",
    "solution": "<pre class=\"code\"><span class=\"k\">void</span> sumOfN() {\n    <span class=\"k\">int</span> n;\n    read(n);\n    <span class=\"k\">int</span> sum = 0;\n    <span class=\"k\">for</span> (<span class=\"k\">int</span> i = 1; i &lt;= n; i++) {\n        sum = sum + i;\n    }\n    println(<span class=\"s\">\"Sum: \"</span>, sum);\n}</pre>"
  },
  {
    "id": "s1-e3-3",
    "label": "III.3",
    "part": "III",
    "topic": "Factorial Calculator",
    "question": "<p>3. Factorial Calculator: Write a program that calculates the factorial of a number using a loop.</p>",
    "think": "<p>The same accumulator pattern, but multiplying, so the running product must start at <b>1</b> (starting at 0 would make every answer 0). Multiply by 2, 3, … up to n. 0! and 1! are both 1, which the starting value already covers. Factorial isn't defined for negative numbers, so reject them.</p>",
    "solution": "<pre class=\"code\"><span class=\"k\">void</span> factorial() {\n    <span class=\"k\">int</span> n;\n    read(n);\n    <span class=\"k\">if</span> (n &lt; 0) {\n        println(<span class=\"s\">\"Factorial is not defined for negative numbers\"</span>);\n        <span class=\"k\">return</span>;\n    }\n    <span class=\"k\">int</span> fact = 1;                    <span class=\"c\">// 0! and 1! are both 1</span>\n    <span class=\"k\">for</span> (<span class=\"k\">int</span> i = 2; i &lt;= n; i++) {\n        fact = fact * i;\n    }\n    println(<span class=\"s\">\"Factorial: \"</span>, fact);\n}</pre><p class=\"eg\"><b>Trace for 5.</b> 1 × 2 = 2, × 3 = 6, × 4 = 24, × 5 = 120.</p>"
  },
  {
    "id": "s1-e3-4",
    "label": "III.4",
    "part": "III",
    "topic": "Multiplication Table",
    "question": "<p>4. Multiplication Table: Write a program that prints the multiplication table for a given number using a loop.</p>",
    "think": "<p>The number stays fixed; only the multiplier changes, from 1 to 10. So the loop counter is the multiplier, and each round prints one line of the table: <code>n x i = n*i</code>.</p>",
    "solution": "<pre class=\"code\"><span class=\"k\">void</span> multiplicationTable() {\n    <span class=\"k\">int</span> n;\n    read(n);\n    <span class=\"k\">for</span> (<span class=\"k\">int</span> i = 1; i &lt;= 10; i++) {\n        println(n, <span class=\"s\">\" x \"</span>, i, <span class=\"s\">\" = \"</span>, n * i);\n    }\n}</pre>"
  },
  {
    "id": "s1-e3-5",
    "label": "III.5",
    "part": "III",
    "topic": "Count Down Timer",
    "question": "<p>5. Count Down Timer: Write a program that counts down from a given number to zero and prints each number on a new line.</p>",
    "think": "<p>A loop can count backwards: start at n, keep going while the counter is <code>&gt;= 0</code> (the question says \"to zero\", so 0 is printed), and decrease with <code>i--</code>. <code>println</code> gives the new line the question asks for.</p>",
    "solution": "<pre class=\"code\"><span class=\"k\">void</span> countDown() {\n    <span class=\"k\">int</span> n;\n    read(n);\n    <span class=\"k\">for</span> (<span class=\"k\">int</span> i = n; i &gt;= 0; i--) {\n        println(i);                  <span class=\"c\">// each number on a new line</span>\n    }\n}</pre>"
  },
  {
    "id": "s1-e3-6",
    "label": "III.6",
    "part": "III",
    "topic": "Reverse a Number",
    "question": "<p>6. Reverse a Number: Write a program that reverses a given integer using a loop.</p>",
    "think": "<p>Two tools take a number apart digit by digit: <code>n % 10</code> gives the <b>last</b> digit and <code>n / 10</code> (integer division) <b>drops</b> it. Build the answer by shifting it one place left (× 10) and adding the digit. Repeat until nothing is left. You don't know how many digits there are, so use a <code>while</code> loop, not a <code>for</code>. Handle the sign separately.</p>",
    "solution": "<pre class=\"code\"><span class=\"k\">void</span> reverseNumber() {\n    <span class=\"k\">int</span> n;\n    read(n);\n    <span class=\"k\">int</span> temp = n;\n    <span class=\"k\">if</span> (temp &lt; 0) {                  <span class=\"c\">// work with the digits only</span>\n        temp = -temp;\n    }\n    <span class=\"k\">int</span> reversed = 0;\n    <span class=\"k\">while</span> (temp &gt; 0) {\n        <span class=\"k\">int</span> digit = temp % 10;       <span class=\"c\">// take the last digit</span>\n        reversed = reversed * 10 + digit;\n        temp = temp / 10;            <span class=\"c\">// drop the last digit</span>\n    }\n    <span class=\"k\">if</span> (n &lt; 0) {\n        reversed = -reversed;\n    }\n    println(<span class=\"s\">\"Reversed: \"</span>, reversed);\n}</pre><p class=\"eg\"><b>Trace for 1234.</b> reversed = 4, 43, 432, 4321 while temp goes 123, 12, 1, 0.</p>"
  },
  {
    "id": "s1-e3-7",
    "label": "III.7",
    "part": "III",
    "topic": "Fibonacci Sequence",
    "question": "<p>7. Fibonacci Sequence: Write a program that generates the first N numbers of the Fibonacci sequence using a loop.</p>",
    "think": "<p>Each term is the sum of the two before it, so you only ever need to remember <b>two</b> numbers. Keep <code>a</code> (current) and <code>b</code> (next). Each round, print <code>a</code>, then slide the window forward: the new pair is (b, a + b). Use a temporary variable so you don't overwrite a value you still need.</p>",
    "solution": "<pre class=\"code\"><span class=\"k\">void</span> fibonacci() {\n    <span class=\"k\">int</span> n;\n    read(n);\n    <span class=\"k\">int</span> a = 0;\n    <span class=\"k\">int</span> b = 1;\n    <span class=\"k\">for</span> (<span class=\"k\">int</span> i = 1; i &lt;= n; i++) {\n        println(a);\n        <span class=\"k\">int</span> next = a + b;\n        a = b;\n        b = next;\n    }\n}</pre><p class=\"eg\"><b>First 7 terms.</b> 0, 1, 1, 2, 3, 5, 8.</p><p class=\"note\"><b>Note.</b> This starts the sequence at 0, 1. If your lecturer starts it at 1, 1, set <code>a = 1</code> and <code>b = 1</code>.</p>"
  },
  {
    "id": "s1-e3-8",
    "label": "III.8",
    "part": "III",
    "topic": "Check Prime Number",
    "question": "<p>8. Check Prime Number: Write a program that checks if a given number is prime by using a loop.</p>",
    "think": "<p>A prime has exactly two divisors: 1 and itself. So <b>look for any other divisor</b>. Finding one proves \"not prime\" and you can stop (<code>break</code>). Numbers 1 and below are not prime by definition.</p><p>You only need to test up to the square root of n: if n = a × b, one of a or b is at most √n. Writing the test as <code>i * i &lt;= n</code> avoids calling a square-root function.</p>",
    "solution": "<pre class=\"code\"><span class=\"k\">void</span> checkPrime() {\n    <span class=\"k\">int</span> n;\n    read(n);\n    <span class=\"k\">bool</span> prime = <span class=\"k\">true</span>;\n    <span class=\"k\">if</span> (n &lt;= 1) {                    <span class=\"c\">// 0, 1 and negatives are not prime</span>\n        prime = <span class=\"k\">false</span>;\n    } <span class=\"k\">else</span> {\n        <span class=\"k\">for</span> (<span class=\"k\">int</span> i = 2; i * i &lt;= n; i++) {   <span class=\"c\">// divisors above the square root repeat</span>\n            <span class=\"k\">if</span> (n % i == 0) {\n                prime = <span class=\"k\">false</span>;\n                <span class=\"k\">break</span>;\n            }\n        }\n    }\n    <span class=\"k\">if</span> (prime) {\n        println(<span class=\"s\">\"Prime\"</span>);\n    } <span class=\"k\">else</span> {\n        println(<span class=\"s\">\"Not prime\"</span>);\n    }\n}</pre>"
  },
  {
    "id": "s1-e3-9",
    "label": "III.9",
    "part": "III",
    "topic": "Pattern Printing",
    "question": "<p>9. Pattern Printing: Write a program that prints a right-angled triangle pattern with asterisks (*) up to a given number of rows.</p>",
    "think": "<p>Patterns are <b>nested loops</b>: the outer loop counts rows, the inner loop draws what goes on one row. Row i has i stars, so the inner loop runs from 1 to i. Use <code>print</code> (stay on the line) for each star, and one <code>println</code> after the inner loop to move down.</p>",
    "solution": "<pre class=\"code\"><span class=\"k\">void</span> printTriangle() {\n    <span class=\"k\">int</span> rows;\n    read(rows);\n    <span class=\"k\">for</span> (<span class=\"k\">int</span> i = 1; i &lt;= rows; i++) {\n        <span class=\"k\">for</span> (<span class=\"k\">int</span> j = 1; j &lt;= i; j++) {\n            print(<span class=\"s\">\"*\"</span>);              <span class=\"c\">// stay on the same line</span>\n        }\n        println(<span class=\"s\">\"\"</span>);                 <span class=\"c\">// move to the next row</span>\n    }\n}</pre><div class=\"outbox\"><div class=\"outlab\">Output for 4 rows</div><pre>*\n**\n***\n****</pre></div>"
  },
  {
    "id": "s1-e3-10",
    "label": "III.10",
    "part": "III",
    "topic": "Sum of Even and Odd Numbers",
    "question": "<p>10. Sum of Even and Odd Numbers: Write a program to calculate the sum of even and odd numbers separately from 1 to N using a loop.</p>",
    "think": "<p>Combine the two ideas from this sheet: a <b>loop</b> over 1 to N, and the <b>even test</b> from Exercise II.1 inside it. Keep two accumulators, both starting at 0, and the <code>% 2</code> test decides which one each number is added to.</p>",
    "solution": "<pre class=\"code\"><span class=\"k\">void</span> sumEvenOdd() {\n    <span class=\"k\">int</span> n;\n    read(n);\n    <span class=\"k\">int</span> sumEven = 0;\n    <span class=\"k\">int</span> sumOdd = 0;\n    <span class=\"k\">for</span> (<span class=\"k\">int</span> i = 1; i &lt;= n; i++) {\n        <span class=\"k\">if</span> (i % 2 == 0) {\n            sumEven = sumEven + i;\n        } <span class=\"k\">else</span> {\n            sumOdd = sumOdd + i;\n        }\n    }\n    println(<span class=\"s\">\"Sum of even numbers: \"</span>, sumEven);\n    println(<span class=\"s\">\"Sum of odd numbers: \"</span>, sumOdd);\n}</pre><p class=\"eg\"><b>For N = 10.</b> Even 2+4+6+8+10 = 30, odd 1+3+5+7+9 = 25.</p>"
  },
  {
    "id": "s1-e4-a",
    "label": "IV.a",
    "part": "IV",
    "topic": "A switch with break",
    "question": "<p>1. Carefully study the algorithms below and write down the “exact” output. Put your final output for each subquestion in a box.</p><p><b>a)</b></p><pre class=\"sheet\">today= 3;\nswitch(today)\n{\n     case 1: println(\"stay home\");break;\n     case 2: println(\"programing\");break;\n     case 3: println(\"mathematics\");break;\n     default: println(today);\n}</pre>",
    "think": "<p>A <code>switch</code> jumps straight to the case that matches the value and runs from there until it meets a <code>break</code>. Find the value first: <code>today</code> is 3. So only <code>case 3</code> runs, and its <code>break</code> leaves the switch. <code>default</code> runs only when no case matches, so it is skipped.</p>",
    "solution": "<p><code>today</code> is 3, so <code>case 3</code> runs, prints, and <code>break</code> leaves the switch. <code>default</code> is never reached.</p><div class=\"outbox\"><div class=\"outlab\">Exact output</div><pre>mathematics</pre></div>"
  },
  {
    "id": "s1-e4-b",
    "label": "IV.b",
    "part": "IV",
    "topic": "A loop that never changes what it prints",
    "question": "<p>1. Carefully study the algorithms below and write down the “exact” output. Put your final output for each subquestion in a box.</p><p><b>b)</b></p><pre class=\"sheet\">i = 1;\nfor(j=1; j&lt;10;j=j+2){\nprintln(i);\n}\nprintln(j);</pre>",
    "think": "<p>Make a trace table: one column per variable, one row per round. Check <b>what changes</b> inside the loop. Here <code>i</code> is never changed, so every round prints the same thing. Then check <b>what is inside the braces</b>: the last <code>println(j)</code> is outside the loop, so it runs once, after the loop ends. A loop variable keeps its final value after the loop.</p>",
    "solution": "<p><code>i</code> is never changed inside the loop, so every round prints 1. <code>j</code> takes the values 1, 3, 5, 7, 9: that's 5 rounds. Then <code>j</code> becomes 11, fails <code>j &lt; 10</code>, and the loop ends. The last <code>println(j)</code> is outside the loop and prints 11.</p>\n<table class=\"trace\"><tr><th>Round</th><th>j</th><th>j &lt; 10?</th><th>prints</th></tr>\n<tr><td>1</td><td>1</td><td>yes</td><td>1</td></tr><tr><td>2</td><td>3</td><td>yes</td><td>1</td></tr><tr><td>3</td><td>5</td><td>yes</td><td>1</td></tr><tr><td>4</td><td>7</td><td>yes</td><td>1</td></tr><tr><td>5</td><td>9</td><td>yes</td><td>1</td></tr><tr><td>after</td><td>11</td><td>no</td><td>11 (outside the loop)</td></tr></table><div class=\"outbox\"><div class=\"outlab\">Exact output</div><pre>1\n1\n1\n1\n1\n11</pre></div>"
  },
  {
    "id": "s1-e4-c",
    "label": "IV.c",
    "part": "IV",
    "topic": "printf, not println",
    "question": "<p>1. Carefully study the algorithms below and write down the “exact” output. Put your final output for each subquestion in a box.</p><p><b>c)</b></p><pre class=\"sheet\">n=8;\ni=1;\nwhile(i&lt;=n){\n if(i%2 ==0){\n   printf(i);\n }\n i++;\n}</pre>",
    "think": "<p>Two things decide the exact output. <b>Which values are printed</b>: only those passing the if, here the even values of <code>i</code> from 1 to 8. And <b>how they are printed</b>: <code>printf</code> does not end the line, unlike <code>println</code>. \"Exact\" output means the spacing counts.</p>",
    "solution": "<p><code>i</code> runs from 1 to 8 and only the even values pass the if: 2, 4, 6, 8. The call is <code>printf</code>, not <code>println</code>, so there are no line breaks and no spaces: everything sits on one line.</p><div class=\"outbox\"><div class=\"outlab\">Exact output</div><pre>2468</pre></div>"
  },
  {
    "id": "s1-e4-d",
    "label": "IV.d",
    "part": "IV",
    "topic": "continue, break and an extra k++",
    "question": "<p>1. Carefully study the algorithms below and write down the “exact” output. Put your final output for each subquestion in a box.</p><p><b>d)</b></p><pre class=\"sheet\">for(k=1; k&lt;20; k++){\n  if(k%4==0){\n   continue;\n  }\n  if(k==17){\n   break;\n  }\n println(k);\n k++;\n}\nprintln(k);</pre>",
    "think": "<p>Watch every place that changes <code>k</code>. It goes up <b>twice</b> per round: once by the <code>k++</code> in the body, and once more by the <code>for</code>. Then know the two jump statements: <code>continue</code> skips to the next round, and <code>break</code> leaves the loop at once. Trace slowly, and remember that the last <code>println(k)</code> is outside the loop.</p>",
    "solution": "<p>Because <code>k</code> goes up twice each round, only odd values of <code>k</code> ever reach the tests: 1, 3, 5, … No odd number is divisible by 4, so <code>continue</code> never runs. At <code>k = 17</code> the <code>break</code> fires <b>before</b> the <code>println(k)</code> inside the loop, so 17 is not printed there. The <code>println(k)</code> after the loop then prints 17.</p>\n<table class=\"trace\"><tr><th>k at the tests</th><th>k%4==0?</th><th>k==17?</th><th>prints</th></tr>\n<tr><td>1, 3, 5, 7, 9, 11, 13, 15</td><td>no</td><td>no</td><td>that k</td></tr>\n<tr><td>17</td><td>no</td><td>yes: break</td><td>nothing in the loop</td></tr>\n<tr><td>after the loop</td><td></td><td></td><td>17</td></tr></table><div class=\"outbox\"><div class=\"outlab\">Exact output</div><pre>1\n3\n5\n7\n9\n11\n13\n15\n17</pre></div>"
  }
];

export const CSC207T_QUICK_GUIDE: [string, string][] = [
  [
    "Two outcomes",
    "<code>if … else</code>"
  ],
  [
    "Several bands or cases",
    "<code>if … else if … else</code>, tested from one end to the other"
  ],
  [
    "One value, a fixed list of choices",
    "<code>switch</code> with a <code>break</code> after each case"
  ],
  [
    "You know how many times to repeat",
    "<code>for</code> loop"
  ],
  [
    "You repeat until something happens",
    "<code>while</code> loop"
  ],
  [
    "Keep a running total or product",
    "accumulator: start at 0 for sums, 1 for products"
  ],
  [
    "Even / odd, divisible by",
    "remainder: <code>n % 2</code>, <code>n % k == 0</code>"
  ],
  [
    "Take a number apart digit by digit",
    "<code>n % 10</code> (last digit), <code>n / 10</code> (drop it)"
  ],
  [
    "Rows and columns, patterns",
    "nested loops: outer for rows, inner for one row"
  ],
  [
    "Find any counter-example",
    "loop, then <code>break</code> as soon as you find it"
  ],
  [
    "\"Exact output\"",
    "trace table; watch every change to the loop variable; println vs printf"
  ]
];

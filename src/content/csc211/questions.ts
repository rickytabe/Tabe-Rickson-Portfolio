// CSC211 Made Easy: the tutorial sheet with full worked solutions. Server-only content: the page
// renders the free solutions, and the locked ones are served by /api/book/solutions after unlock.
// Maths is TeX between \( \) (inline) or \[ \] (display), rendered with KaTeX on the server.
// Questions keep the sheet's wording, typing mistakes included, so students recognise them.

export type Csc211Item = {
  id: string; // section id, e.g. "a7", "b30"
  topic: string; // sidebar label
  question: string;
  think?: string;
  solution?: string;
  /** Question numbers on the sheet that have no question. */
  blank?: boolean;
};

const r = String.raw;

export const CSC211_ITEMS: Csc211Item[] = [
  {
    id: "a1",
    topic: "Sample spaces",
    question: r`<p>Find the sample spaces of the following experiments</p>
<p>i) I attempt to sign up to AOL from my phone – to do so successfully the local phone number must be working and AOL's network must be working.</p>
<p>ii) Online, I attempt to access a web page and record the time required to receive and display it (in seconds).</p>
<p>iii) On a network, there are two possible routes a message can take to a destination – in order for a message to get to the recipient, one of the routes and the recipient's computer must be up.</p>`,
    think: r`<p>A sample space \(S\) is the list of every possible outcome of the experiment. Ask: "What are the separate things that can each be up or down?" If there are \(k\) things with 2 states each, there are \(2^k\) outcomes. If the outcome is a measurement (time, length), the sample space is an interval of real numbers, not a list.</p>`,
    solution: r`<p>Write \(u\) = up (working), \(d\) = down.</p>
<p><b>(i)</b> Two things: phone line and network. Outcome = (phone, network).</p>
\[S = \{(u,u),\ (u,d),\ (d,u),\ (d,d)\} \qquad (2^2 = 4 \text{ outcomes})\]
<p><b>(ii)</b> Time can be any non-negative real number: \(S = [0, \infty) = \{t : t \ge 0\}\).</p>
<p><b>(iii)</b> Three things: route 1, route 2, recipient's computer. Outcome = \((R_1, R_2, C)\).</p>
\[S = \{uuu,\ uud,\ udu,\ udd,\ duu,\ dud,\ ddu,\ ddd\} \qquad (2^3 = 8 \text{ outcomes})\]`,
  },
  {
    id: "a2",
    topic: "Events as subsets",
    question: r`<p>With the same exercises as before, define the following events</p>
<p>i) A = fail to log on ; B = AOL network down</p>
<p>ii) C = at least 0s required</p>
<p>iii) D = message gets through;</p>`,
    think: r`<p>An event is a subset of the sample space. Go through each outcome in \(S\) and ask "does the statement hold here?" Keep the ones where the answer is yes.</p>`,
    solution: r`<p><b>(i)</b> Log on succeeds only at \((u,u)\). So failure is everything else:</p>
\[A = \{(u,d),\ (d,u),\ (d,d)\}, \qquad B = \{(u,d),\ (d,d)\}\]
<p>(The network is the second entry.)</p>
<p><b>(ii)</b> Every time is at least 0 s, so \(C = [0,\infty) = S\). This is the certain event.</p>
<p><b>(iii)</b> The message gets through when the computer is up and at least one route is up:</p>
\[D = \{uuu,\ udu,\ duu\}\]`,
  },
  {
    id: "a3",
    topic: "Unions, intersections, complements",
    question: r`<p>a. Using exercise 1ii) with A, B, C and D the following events: A = [00, 200), B = [150, ∞), C = [200, ∞) and D = [50, 75]. find</p>
<p>i) A ∪ B, A ∪ C, A ∪ D.</p>
<p>ii) A ∩ B, A ∩ D</p>
<p>b. A ∩ B of 2i) above</p>
<p>c. Let D be the event that message gets through, find D̄</p>`,
    think: r`<p>Union (\(\cup\)) = "in at least one of them": put the sets together. Intersection (\(\cap\)) = "in both": keep only the overlap. Complement (\(\bar D\)) = everything in \(S\) that is not in \(D\). For intervals, draw a number line and mark each interval. Watch the brackets: <code>[</code> includes the end point, <code>)</code> does not.</p>`,
    solution: r`<p><b>(a)(i)</b></p>
\[A \cup B = [0,200) \cup [150,\infty) = [0,\infty) = S\]
\[A \cup C = [0,200) \cup [200,\infty) = [0,\infty) = S\]
<p>(200 is missing from \(A\), but it is in \(C\).)</p>
\[A \cup D = [0,200) = A \quad \text{because } D = [50,75] \text{ lies inside } A\]
<p><b>(ii)</b> \(A \cap B = [150, 200)\) and \(A \cap D = [50, 75] = D\).</p>
<p><b>(b)</b> From 2(i): \(A = \{(u,d),(d,u),(d,d)\}\) and \(B = \{(u,d),(d,d)\}\). Both outcomes of \(B\) are in \(A\), so</p>
\[A \cap B = \{(u,d),\ (d,d)\} = B\]
<p>This makes sense: if the network is down you must fail to log on.</p>
<p><b>(c)</b> \(D = \{uuu, udu, duu\}\), so \(\bar D = \{uud,\ udd,\ dud,\ ddu,\ ddd\}\): the message does not get through.</p>`,
  },
  {
    id: "a4",
    topic: "The addition rule",
    question: r`<p>Considering experiment 1i), if</p>
<p>P(phone up ) = 0.9<br>P(network up) = 0.6<br>P(phone up, network up) = 0.55</p>
<p>Find P(phone up or network up)</p>`,
    think: r`<p>The word "or" means union. Use the addition rule. You must subtract the "both" part because it was counted twice.</p>`,
    solution: r`\[P(\text{phone} \cup \text{network}) = 0.9 + 0.6 - 0.55 = \mathbf{0.95}\]`,
  },
  {
    id: "a5",
    topic: "Counting a random draw",
    question: r`<p>A box contains 4 chips, 1 of them is defective. Person draws one chip at random.</p>
<p>i) What is the probability that the person draws the defective chip?</p>
<p>ii) If the person draws two chips, what is the probability that the defective chip is among them?</p>`,
    think: r`<p>Random draw means all chips are equally likely, so count. For "is among them" it is often easier to find the opposite ("not among them") and subtract from 1.</p>`,
    solution: r`<p><b>(i)</b> \(P = \tfrac14 = 0.25\)</p>
<p><b>(ii)</b> Ways to pick 2 chips from 4: \(\binom42 = 6\). Ways to pick 2 from the 3 good chips: \(\binom32 = 3\).</p>
\[P(\text{defective among them}) = 1 - \frac36 = \frac12\]
<p>Check by direct count: pick the defective one (1 way) and one good chip (3 ways) gives \(3/6 = 1/2\).</p>`,
  },
  {
    id: "a6",
    topic: "One fair die",
    question: r`<p>A fair die is rolled, what is the probability that</p>
<p>a) We obtain a 7?<br>b) We do not get a 1?<br>c) We get a 1 or a 3?</p>`,
    think: r`<p>\(S = \{1,2,3,4,5,6\}\), each with probability \(1/6\). Count the outcomes in the event. An outcome that is not in \(S\) has probability 0. "Not" means complement. "Or" for outcomes that cannot happen together means just add.</p>`,
    solution: r`<p><b>(a)</b> 7 is not in \(S\): \(P = 0\).</p>
<p><b>(b)</b> \(1 - \tfrac16 = \tfrac56\)</p>
<p><b>(c)</b> \(\tfrac16 + \tfrac16 = \tfrac13\)</p>`,
  },
  {
    id: "a7",
    topic: "Conditional probability: two dice",
    question: r`<p>A fair die is rolled twice. Let A be the event of getting a sum of 8 and B be the event of getting a sum at most 10</p>
<p>a) Find P(A)</p>
<p>b) Find P(A/B)</p>`,
    think: r`<p>Two dice give \(6 \times 6 = 36\) equally likely pairs. List the pairs for the event. For a conditional probability, the new sample space is \(B\): count how many outcomes of \(B\) are also in \(A\), then divide by the size of \(B\).</p>`,
    solution: r`<p><b>(a)</b> \(A = \{(2,6), (3,5), (4,4), (5,3), (6,2)\}\), so \(P(A) = \dfrac{5}{36} \approx 0.139\).</p>
<p><b>(b)</b> Sums greater than 10: \((5,6), (6,5), (6,6)\), 3 outcomes. So \(B\) has \(36 - 3 = 33\) outcomes. Every outcome of \(A\) (sum 8) is in \(B\), so \(A \cap B = A\).</p>
\[P(A \mid B) = \frac{P(A \cap B)}{P(B)} = \frac{5/36}{33/36} = \frac{5}{33} \approx 0.152\]`,
  },
  {
    id: "a8",
    topic: "Two-way tables",
    question: r`<p>A university has 600 freshmen, 500 sophomores and 400 juniors. 80 of the freshmen, 60 of the sophomores, and 50 of the juniors are Computer Science (CSC) majors.</p>
<p>a) What is the probability that a student selected at random is a freshman or an CSC major (or both)?</p>
<p>b) If a student is a CSC major, what is the probability that he/she is a sophomore?</p>`,
    think: r`<p>Put the numbers in a table first. Then every probability is just (count in the cell or group) divided by (the right total). For "given", the total changes to the size of the given group.</p>`,
    solution: r`<table>
<tr><th></th><th>Fresh.</th><th>Soph.</th><th>Junior</th><th>Total</th></tr>
<tr><td>CSC</td><td>80</td><td>60</td><td>50</td><td>190</td></tr>
<tr><td>Not CSC</td><td>520</td><td>440</td><td>350</td><td>1310</td></tr>
<tr><td>Total</td><td>600</td><td>500</td><td>400</td><td>1500</td></tr>
</table>
<p><b>(a)</b></p>
\[P(F \cup C) = P(F) + P(C) - P(F \cap C) = \frac{600 + 190 - 80}{1500} = \frac{710}{1500} = \frac{71}{150} \approx 0.473\]
<p><b>(b)</b></p>
\[P(\text{Soph} \mid C) = \frac{60}{190} = \frac{6}{19} \approx 0.316\]`,
  },
  {
    id: "a9",
    topic: "Total probability and Bayes",
    question: r`<p>A Microsoft's internet explorer (IE) and Mozilla Firefox (MF) are two popular web browsers. IE support certain features that are present at a given site, such a security, that MF does not support and vice versa. Assume that all features on all sites are exploitable by either IE or MF. The probability that IE supports a given feature is 1 – δ and the probability that the MF fail to support a feature is δ.</p>
<p>a. A user selects a browser at random and attempts to assess it. What is the probability that the user will be forced to change the browser?</p>
<p>b. Given that the browser fails to assess a site, what is the probability that it is IE?</p>`,
    think: r`<p>Two stages: first choose a browser (probability \(\tfrac12\) each), then it works or fails. Stage problems use the total probability rule for the overall chance of failure. The "given it failed, which browser was it?" question reverses the order, so use Bayes.</p>`,
    solution: r`<p>As the question is written, \(P(\text{fail} \mid IE) = 1 - (1 - \delta) = \delta\) and \(P(\text{fail} \mid MF) = \delta\).</p>
<p><b>(a)</b> The user must change when the chosen browser fails:</p>
\[P(\text{fail}) = \tfrac12 \cdot \delta + \tfrac12 \cdot \delta = \delta\]
<p><b>(b)</b></p>
\[P(IE \mid \text{fail}) = \frac{P(\text{fail} \mid IE)\,P(IE)}{P(\text{fail})} = \frac{\tfrac12\delta}{\delta} = \frac12\]
<p><b>General version.</b> If your lecturer meant two different failure rates, say \(P(\text{fail} \mid IE) = a\) and \(P(\text{fail} \mid MF) = b\), the same method gives \(P(\text{fail}) = \dfrac{a+b}{2}\) and \(P(IE \mid \text{fail}) = \dfrac{a}{a+b}\).</p>`,
  },
  {
    id: "a10",
    topic: "Drawing without replacement",
    question: r`<p>A batch of 25 injection-molded parts contains 5 that have suffered excessive shrinkage. If two parts are selected at random, without replacement, what is the probability that the second part selected is one with excessive shrinkage?</p>`,
    think: r`<p>We are not told what the first part was, so split on the two cases for the first part (bad or good) and add them up. This is the total probability rule. Tip: when you know nothing about the earlier draws, the answer always equals the simple fraction (here \(5/25\)).</p>`,
    solution: r`<p>Let \(S_1, S_2\) = first, second part has shrinkage.</p>
\[P(S_2) = P(S_2 \mid S_1)P(S_1) + P(S_2 \mid \bar S_1)P(\bar S_1) = \frac{4}{24}\cdot\frac{5}{25} + \frac{5}{24}\cdot\frac{20}{25} = \frac{20 + 100}{600} = \frac15 = 0.2\]`,
  },
  {
    id: "a11",
    topic: "Venn diagrams",
    question: r`<p>Out of a group of 100 students, 30 have laptop, 50 have a computer (desktop or laptop) of their own and 90 have access to a computer lab. One student is picked at random. By using a Venn diagram, what is the probability that he/she</p>
<p>a) has a computer but not a laptop?</p>
<p>b) has access to a lab and a computer of his/her own?</p>
<p>c) does have a laptop or a computer?</p>`,
    think: r`<p>First see how the sets sit: every laptop is a computer, so the laptop circle is inside the computer circle. Then fill in counts region by region. For two overlapping sets use \(|A \cup B| = |A| + |B| - |A \cap B|\).</p>`,
    solution: r`<figure>
<svg viewBox="0 0 620 300" role="img" aria-label="Venn diagram: the laptop circle of 30 sits inside the computer circle of 50, which overlaps the lab circle of 90 in a region of 40">
  <rect x="10" y="10" width="600" height="262" rx="12" fill="#fff" stroke="#20242B" stroke-width="2"/>
  <text x="24" y="262" font-family="Inter,sans-serif" font-size="12" font-weight="600" fill="#4A525E">100 students</text>
  <circle cx="230" cy="140" r="108" fill="#2E4F86" fill-opacity=".12" stroke="#2E4F86" stroke-width="2.5"/>
  <circle cx="390" cy="140" r="118" fill="#15847B" fill-opacity=".12" stroke="#15847B" stroke-width="2.5"/>
  <circle cx="232" cy="176" r="46" fill="#E2703A" fill-opacity=".2" stroke="#E2703A" stroke-width="2.5"/>
  <text x="178" y="44" text-anchor="middle" font-family="Fraunces,serif" font-size="15" font-weight="800" fill="#2E4F86">Computer (50)</text>
  <text x="470" y="40" text-anchor="middle" font-family="Fraunces,serif" font-size="15" font-weight="800" fill="#15847B">Lab (90)</text>
  <text x="232" y="181" text-anchor="middle" font-family="Inter,sans-serif" font-size="12" font-weight="700" fill="#B4531F">Laptop (30)</text>
  <text x="172" y="112" text-anchor="middle" font-family="JetBrains Mono,monospace" font-size="18" font-weight="700" fill="#20242B">10</text>
  <text x="298" y="112" text-anchor="middle" font-family="JetBrains Mono,monospace" font-size="18" font-weight="700" fill="#20242B">40</text>
  <text x="440" y="150" text-anchor="middle" font-family="JetBrains Mono,monospace" font-size="18" font-weight="700" fill="#20242B">50</text>
</svg>
<figcaption>Computer only: 10. Computer and Lab: 40. Lab only: 50. The laptop group of 30 sits inside the Computer circle. These counts use the assumption explained in part (b).</figcaption>
</figure>
<p><b>(a)</b> Computer but no laptop: \(50 - 30 = 20\). \(P = 0.20\)</p>
<p><b>(b)</b> The sheet does not give the overlap directly. Take the usual assumption that every student has at least one of the two (own computer or lab access), so the union is 100:</p>
\[|\text{Lab} \cap \text{Comp}| = 90 + 50 - 100 = 40, \qquad P = 0.40\]
<p>(Without that assumption, the overlap is somewhere between 40 and 50, so \(0.40 \le P \le 0.50\).)</p>
<p><b>(c)</b> Laptop owners are already computer owners, so "laptop or computer" = "computer": \(P = \tfrac{50}{100} = 0.50\)</p>`,
  },
  {
    id: "a12",
    topic: "Counting octal numbers",
    question: r`<p>Find the probability that a randomly chosen five digit number is a valid octal number.</p>`,
    think: r`<p>Octal numbers use only the digits 0 to 7. Count position by position (multiplication rule). Remember a five digit number cannot start with 0.</p>`,
    solution: r`<p>Five digit numbers run from 10000 to 99999: \(9 \times 10^4 = 90\,000\) numbers.</p>
<p>Valid octal ones: first digit from 1 to 7 (7 choices), each of the other four digits from 0 to 7 (8 choices): \(7 \times 8^4 = 28\,672\).</p>
\[P = \frac{28\,672}{90\,000} = \frac{1792}{5625} \approx 0.3186\]
<p><b>Note.</b> If leading zeros are allowed (any string of 5 digits), then \(P = (8/10)^5 = 0.3277\).</p>`,
  },
  {
    id: "a13",
    topic: "Lottery odds (hypergeometric)",
    question: r`<p>Powerball. Pick five (different) numbers out of 49 – the lottery will also draw five numbers. You win if at least three of the numbers are right.</p>
<p>i) What is the probability to have five matching numbers?</p>
<p>ii) What is the probability to have exactly three matching numbers?</p>
<p>iii) What is the probability to win?</p>`,
    think: r`<p>Order does not matter, so use combinations. For "exactly \(k\) matches": choose \(k\) of the 5 winning numbers and choose the remaining \(5-k\) from the 44 losing numbers. Divide by all possible tickets. This pattern is called the hypergeometric distribution. "At least 3" means add the cases 3, 4 and 5.</p>`,
    solution: r`<p>Total tickets: \(\binom{49}{5} = 1\,906\,884\).</p>
<p><b>(i)</b></p>
\[P(5) = \frac{\binom55\binom{44}{0}}{\binom{49}{5}} = \frac{1}{1\,906\,884} \approx 5.24 \times 10^{-7}\]
<p><b>(ii)</b></p>
\[P(3) = \frac{\binom53\binom{44}{2}}{\binom{49}{5}} = \frac{10 \times 946}{1\,906\,884} = \frac{9460}{1\,906\,884} \approx 0.00496\]
<p><b>(iii)</b> \(P(4) = \dfrac{\binom54\binom{44}{1}}{\binom{49}{5}} = \dfrac{220}{1\,906\,884}\). So</p>
\[P(\text{win}) = \frac{9460 + 220 + 1}{1\,906\,884} = \frac{9681}{1\,906\,884} \approx 0.00508\]`,
  },
  {
    id: "a14",
    topic: "Joint and conditional from a table",
    question: r`<p>Lot of unmarked Pentium III chips in box is as follows</p>
<table>
<tr><th></th><th>400 mH</th><th>500mH</th><th>Total</th></tr>
<tr><td>Good</td><td>480</td><td>490</td><td>970</td></tr>
<tr><td>Defective</td><td>20</td><td>10</td><td>30</td></tr>
<tr><td>Total</td><td>500</td><td>500</td><td>1000</td></tr>
</table>
<p>i) Drawing a chip t random, what are the different possibilities?</p>
<p>ii) If you have the partial information that the chip selected is 400mH chip. What is the probability that it is defective?</p>`,
    think: r`<p>A two-way table gives joint probabilities: each cell divided by the grand total. For "given", shrink to the row or column you are told about and divide by its total.</p>`,
    solution: r`<p><b>(i)</b> Four possible outcomes:</p>
<table>
<tr><th>Outcome</th><th>Count</th><th>Probability</th></tr>
<tr><td>400 MHz and good</td><td>480</td><td>0.48</td></tr>
<tr><td>400 MHz and defective</td><td>20</td><td>0.02</td></tr>
<tr><td>500 MHz and good</td><td>490</td><td>0.49</td></tr>
<tr><td>500 MHz and defective</td><td>10</td><td>0.01</td></tr>
</table>
<p><b>(ii)</b></p>
\[P(\text{defective} \mid 400) = \frac{20}{500} = 0.04 \qquad (\text{same as } 0.02/0.5)\]`,
  },
  {
    id: "a15",
    topic: "Independent safety systems",
    question: r`<p>Safety system at a nuclear reactor. Suppose there re two physically separate safety systems A and B in a molecular rector. An "incident can occur only when both of them fail in the event of a problem. Suppose the probabilities for the systems to fail in the event of a problem are: P(A fails) = 10<sup>-4</sup> p(B fails) = 10<sup>-8</sup>. What is the probability for n event to occur?</p>`,
    think: r`<p>"Physically separate" tells you the systems are independent. "Both" means intersection. For independent events, multiply.</p>`,
    solution: r`\[P(\text{incident}) = P(A \text{ fails}) \times P(B \text{ fails}) = 10^{-4} \times 10^{-8} = 10^{-12}\]`,
  },
  {
    id: "a16",
    topic: "Imperfect tests (Bayes)",
    question: r`<p>Given lot of chips contains 2% of defective chips. Each chip is tested before delivery. However, the tester is not wholly reliable:</p>
<p>p("tester sys chip is good" | "chip is good" ) = 0.95</p>
<p>p("tester sys chip is defective "| " chip is defective") = 0.94</p>
<p>find the probability that chip selected t random is defective.</p>`,
    think: r`<p>This is the classic "imperfect test" setup. There is a prior (2% defective) and a test with known accuracy. The useful questions are: how often does the tester say "defective" (total probability), and when it says so, how often is it right (Bayes). Draw a tree: first branch = true state, second branch = what the tester says.</p>`,
    solution: r`<p>Let \(D\) = chip is defective, \(G\) = chip is good, \(T_D\) = tester says defective, \(T_G\) = tester says good.</p>
<p>As worded, the answer is simply the given rate: \(P(D) = 0.02\).</p>
<p>The question most likely wants the test results too, so here they are.</p>
\[P(T_D \mid D) = 0.94,\quad P(T_G \mid D) = 0.06,\quad P(T_G \mid G) = 0.95,\quad P(T_D \mid G) = 0.05\]
<p>Probability the tester says defective:</p>
\[P(T_D) = 0.94(0.02) + 0.05(0.98) = 0.0188 + 0.0490 = 0.0678\]
<p>Probability the chip is really defective when the tester says defective:</p>
\[P(D \mid T_D) = \frac{0.0188}{0.0678} \approx 0.277\]
<p>Probability the chip is defective even though the tester says good:</p>
\[P(D \mid T_G) = \frac{0.06(0.02)}{0.06(0.02) + 0.95(0.98)} = \frac{0.0012}{0.9322} \approx 0.00129\]`,
  },
  {
    id: "a17",
    topic: "Dartboard: independent throws",
    question: r`<p>Very simple Dartboard: it is a board divided into 9 squares with one painted red and the others grey. We will assume that only those darts counts that actually hit the dartboard. If player throws dart and hits the board at random, the probability to hit the red one will be directly proportional to the red area. A player now throws three darts, one after the other. Find the sample space and the probabilities of each elementary event.</p>`,
    think: r`<p>One throw: probability is proportional to area, so \(P(R) = 1/9\) and \(P(G) = 8/9\). Three throws are independent, so an outcome is a sequence of three letters and its probability is the product of the three single-throw probabilities. Always check that all the probabilities add to 1.</p>`,
    solution: r`<p>\(S = \{RRR, RRG, RGR, GRR, RGG, GRG, GGR, GGG\}\) (8 outcomes)</p>
<table>
<tr><th>Outcome</th><th>Calculation</th><th>Probability</th></tr>
<tr><td>RRR</td><td>\((1/9)^3\)</td><td>\(1/729\)</td></tr>
<tr><td>RRG, RGR, GRR</td><td>\((1/9)^2(8/9)\)</td><td>\(8/729\) each</td></tr>
<tr><td>RGG, GRG, GGR</td><td>\((1/9)(8/9)^2\)</td><td>\(64/729\) each</td></tr>
<tr><td>GGG</td><td>\((8/9)^3\)</td><td>\(512/729\)</td></tr>
</table>
<p>Check: \(1 + 3(8) + 3(64) + 512 = 729\). ✓</p>`,
  },
  {
    id: "a18",
    topic: "Tree diagrams",
    question: r`<p>One bag contains 4 white memory sticks and 3 black memory sticks and a second bag contains 3 white memory sticks and 5 black memory sticks. One memory stick is drawn from the first bag and placed unseen in the second bag. With the help of a tree diagram, find the probability that a memory stick drawn from the second bag is black?</p>`,
    think: r`<p>Two stages, and the second stage depends on the first. Draw the tree: first branch is the colour moved, second branch is the colour drawn. Multiply along each path, then add the paths that end in "black".</p>`,
    solution: r`<p>After the move, bag 2 has 9 sticks.</p>
<figure>
<svg viewBox="0 0 620 300" role="img" aria-label="Tree diagram: move white with probability 4/7 then draw black 5/9, or move black with probability 3/7 then draw black 6/9">
  <rect x="10" y="10" width="600" height="280" rx="12" fill="#fff" stroke="#20242B" stroke-width="2"/>
  <g stroke="#20242B" stroke-width="2.2" fill="none">
    <path d="M70 150L230 82"/><path d="M70 150L230 218"/>
    <path d="M300 82L430 44"/><path d="M300 82L430 116"/>
    <path d="M300 218L430 184"/><path d="M300 218L430 256"/>
  </g>
  <circle cx="62" cy="150" r="8" fill="#20242B"/>
  <text x="62" y="178" text-anchor="middle" font-family="Inter,sans-serif" font-size="12" font-weight="600" fill="#4A525E">Start</text>
  <g font-family="Inter,sans-serif" font-size="13" font-weight="700" fill="#20242B">
    <rect x="232" y="66" width="70" height="32" rx="8" fill="#F3EDE2" stroke="#20242B" stroke-width="2"/>
    <text x="267" y="87" text-anchor="middle">Move W</text>
    <rect x="232" y="202" width="70" height="32" rx="8" fill="#20242B"/>
    <text x="267" y="223" text-anchor="middle" fill="#fff">Move B</text>
  </g>
  <g font-family="JetBrains Mono,monospace" font-size="13" font-weight="700" fill="#2E4F86">
    <text x="140" y="104">4/7</text><text x="140" y="208">3/7</text>
    <text x="352" y="54">5/9</text><text x="352" y="118">4/9</text>
    <text x="352" y="190">6/9</text><text x="352" y="254">3/9</text>
  </g>
  <g font-family="Inter,sans-serif" font-size="13" font-weight="600">
    <text x="438" y="49" fill="#15847B">Draw B</text>
    <text x="438" y="121" fill="#7A8492">Draw W</text>
    <text x="438" y="189" fill="#15847B">Draw B</text>
    <text x="438" y="261" fill="#7A8492">Draw W</text>
  </g>
  <g font-family="JetBrains Mono,monospace" font-size="13" font-weight="700" fill="#15847B">
    <text x="520" y="49">= 20/63</text>
    <text x="520" y="189">= 18/63</text>
  </g>
</svg>
</figure>
\[P(\text{black}) = \frac47 \cdot \frac59 + \frac37 \cdot \frac69 = \frac{20}{63} + \frac{18}{63} = \frac{38}{63} \approx 0.603\]`,
  },
  {
    id: "a19",
    topic: "System reliability",
    question: r`<p>An electrical system consist of four components as illustrated below. The system works if components A and B work and either of the components C and D work. The reliability (probability of working) of each component is also shown. Find the probability that (a) the entire system works and (b) the component C does not work, given that the entire system works. Assume the four components work independently.</p>
<figure>
<svg viewBox="0 0 620 220" role="img" aria-label="A and B in series, followed by C and D in parallel. Reliabilities: A 0.8, B 0.9, C 0.8, D 0.8">
  <rect x="10" y="10" width="600" height="200" rx="12" fill="#fff" stroke="#20242B" stroke-width="2"/>
  <g stroke="#20242B" stroke-width="2.2" fill="none">
    <path d="M30 110H90"/><path d="M160 110H220"/><path d="M290 110H330"/>
    <path d="M330 60V160"/><path d="M330 60H380"/><path d="M330 160H380"/>
    <path d="M450 60H500"/><path d="M450 160H500"/><path d="M500 60V160"/><path d="M500 110H590"/>
  </g>
  <g font-family="Fraunces,serif" font-size="20" font-weight="800" fill="#20242B" text-anchor="middle">
    <rect x="90" y="86" width="70" height="48" rx="8" fill="#F3BF3F" stroke="#20242B" stroke-width="2.2"/><text x="125" y="117">A</text>
    <rect x="220" y="86" width="70" height="48" rx="8" fill="#F3BF3F" stroke="#20242B" stroke-width="2.2"/><text x="255" y="117">B</text>
    <rect x="380" y="36" width="70" height="48" rx="8" fill="#9ED3C9" stroke="#20242B" stroke-width="2.2"/><text x="415" y="67">C</text>
    <rect x="380" y="136" width="70" height="48" rx="8" fill="#9ED3C9" stroke="#20242B" stroke-width="2.2"/><text x="415" y="167">D</text>
  </g>
  <g font-family="JetBrains Mono,monospace" font-size="13" font-weight="700" fill="#2E4F86" text-anchor="middle">
    <text x="125" y="152">0.8</text><text x="255" y="152">0.9</text><text x="415" y="102">0.8</text><text x="415" y="202">0.8</text>
  </g>
  <text x="30" y="98" font-family="Inter,sans-serif" font-size="11" font-weight="600" fill="#4A525E">in</text>
  <text x="572" y="98" font-family="Inter,sans-serif" font-size="11" font-weight="600" fill="#4A525E">out</text>
</svg>
</figure>`,
    think: r`<p>Series parts (one after the other) must all work: multiply. Parallel parts need at least one to work: use \(1 - P(\text{all fail})\). For the conditional part, write the top as "C fails and system works" and think about what else must be true for that to happen.</p>`,
    solution: r`<p><b>(a)</b> \(P(C \cup D) = 1 - (0.2)(0.2) = 0.96\).</p>
\[P(\text{works}) = P(A)\,P(B)\,P(C \cup D) = 0.8 \times 0.9 \times 0.96 = 0.6912\]
<p><b>(b)</b> If \(C\) fails and the system still works, then \(A\), \(B\) and \(D\) must all work:</p>
\[P(\bar C \cap \text{works}) = 0.8 \times 0.9 \times 0.2 \times 0.8 = 0.1152\]
\[P(\bar C \mid \text{works}) = \frac{0.1152}{0.6912} = \frac16 \approx 0.167\]
<p><b>Note.</b> The figure on the sheet shows one extra unlabelled box (0.8) at the end, but the text says four components, so I used four. If that fifth box counts as a series component, (a) becomes \(0.6912 \times 0.8 = 0.553\) and (b) stays \(\tfrac16\).</p>`,
  },
  {
    id: "a20",
    topic: "Permutations and combinations",
    question: r`<p>There are 12 marbles in an urn. 8 are white and 4 are red. The white marbles are numbered w1, w2, ···, w8 and the red ones are numbered r1, r2, r3, r4. For (a) - (d): Without looking into the urn you draw out 5 marbles.</p>
<p>(a) How many unique choices can you get if order matters?</p>
<p>(b) How many unique choices can you get if order does not matter?</p>
<p>(c) How many ways can you choose 3 white marbles and 2 red marbles if order matters?</p>
<p>(d) How many ways can you choose 3 white marbles and 2 red marbles if order does not matter?</p>
<p>(e) How many marbles =....=........must you draw to be sure of getting two red ones?</p>
<p>2. A printed circuit board has eight different locations in which a component can be placed. If five identical components are to be placed on the board, how many different designs are possible?</p>`,
    think: r`<p>Ask one question first: <b>does order matter?</b> Yes: permutations \({}^nP_r = \dfrac{n!}{(n-r)!}\). No: combinations \(\binom nr = \dfrac{n!}{r!(n-r)!}\). When choosing from two groups, choose from each group and multiply. To turn an unordered choice of 5 items into ordered ones, multiply by \(5!\). For "to be sure", think of the worst possible luck. Identical objects in different places: only the set of places matters, so combinations.</p>`,
    solution: r`<p><b>(a)</b> \({}^{12}P_5 = 12 \times 11 \times 10 \times 9 \times 8 = 95\,040\)</p>
<p><b>(b)</b> \(\binom{12}{5} = \dfrac{95\,040}{120} = 792\)</p>
<p><b>(d)</b> first (it is easier): \(\binom83 \times \binom42 = 56 \times 6 = 336\)</p>
<p><b>(c)</b> Each of those 336 selections can be arranged in \(5! = 120\) orders: \(336 \times 120 = 40\,320\)</p>
<p><b>(e)</b> Worst case: you draw all 8 white first. Then the next 2 must be red. So \(8 + 2 = 10\) marbles.</p>
<p><b>(f)</b> Choose which 5 of the 8 locations get a component: \(\binom85 = 56\) designs.</p>`,
  },
  {
    id: "a21",
    topic: "Bit strings as outcomes",
    question: r`<p>Four bits are transmitted over a digital communications channel. Each bit is either distorted or received without distortion. Let A<sub>i</sub> denote the event that the ith bit is distorted, i = 1, 2, 3, 4.</p>
<p>(a) Describe the sample space.</p>
<p>(b) What is the event A<sub>1</sub>?</p>
<p>(c) What is the event A<sub>1</sub> ∪ A<sub>2</sub>?</p>
<p>(c) What is the event A<sub>1</sub> ∩ A<sub>2</sub>?</p>
<p>(d) What is the event A<sub>1</sub><sup>c</sup>?</p>`,
    think: r`<p>Write each outcome as a string of 4 letters, one per bit. With 2 choices per bit there are \(2^4 = 16\) strings. An event like \(A_1\) fixes one position and leaves the others free, so count the free positions.</p>`,
    solution: r`<p>Let \(d\) = distorted, \(o\) = okay.</p>
<p><b>(a)</b> \(S\) = all strings of length 4 made from \(d\) and \(o\) (16 outcomes):</p>
<pre>dddd  dddo  ddod  ddoo  dodd  dodo  dood  dooo
oddd  oddo  odod  odoo  oodd  oodo  oood  oooo</pre>
<p><b>(b)</b> \(A_1\) = first bit distorted = the 8 strings that start with \(d\) (the first row above).</p>
<p><b>(c)</b> \(A_1 \cup A_2\) = first or second bit distorted = all strings except those starting with \(oo\): 12 outcomes.</p>
<p>\(A_1 \cap A_2\) = first and second bits distorted = \(\{dddd, dddo, ddod, ddoo\}\).</p>
<p><b>(d)</b> \(A_1^c\) = first bit not distorted = the 8 strings that start with \(o\) (the second row above).</p>`,
  },
  {
    id: "a22",
    topic: "Subsets of a sample space",
    question: r`<p>We roll 1 die and obtain one of the numbers 1 through 6 with equal probability.</p>
<p>(a) What is the probability that we obtain a 7?</p>
<p>(b) What is the probability that we do NOT get a 1?</p>
<p>(c) What is the probability that we get a 1 or a 3?</p>
<p>(d) If E = {1, 4, 5, 6} , and E ⊆ G, what might the event G be?</p>`,
    think: r`<p>Parts (a) to (c) are the same as Question 6. For (d), \(E \subseteq G\) means every element of \(E\) is also in \(G\), so \(G\) is \(E\) plus possibly some extra outcomes from \(S\).</p>`,
    solution: r`<p><b>(a)</b> 0 &nbsp; <b>(b)</b> \(5/6\) &nbsp; <b>(c)</b> \(1/3\)</p>
<p><b>(d)</b> \(G\) must contain 1, 4, 5, 6. Possible answers: \(G = \{1,3,4,5,6\}\), \(G = \{1,2,4,5,6\}\), or \(G = S = \{1,2,3,4,5,6\}\). (\(G = E\) itself also works.)</p>`,
  },
  {
    id: "a23",
    topic: "Conditional probability: sums of dice",
    question: r`<p>Let A be the event of getting 8 on the roll of two dice. Let B be the event that the sum of the two dice is greater than 6.</p>
<p>(a) The Find P (A)</p>
<p>(b) Find P (A|B)</p>`,
    think: r`<p>Same method as Question 7. Know the count for each sum: sums 2 to 12 have 1, 2, 3, 4, 5, 6, 5, 4, 3, 2, 1 ways.</p>`,
    solution: r`<p><b>(a)</b> \(P(A) = \dfrac{5}{36}\)</p>
<p><b>(b)</b> Sums 7 to 12: \(6 + 5 + 4 + 3 + 2 + 1 = 21\) outcomes, so \(P(B) = \tfrac{21}{36}\). Since 8 is greater than 6, \(A \cap B = A\).</p>
\[P(A \mid B) = \frac{5/36}{21/36} = \frac{5}{21} \approx 0.238\]`,
  },
  {
    id: "a24",
    topic: "Expectation and the CDF",
    question: r`<p>The probability mass function f of X, the number of imperfections per 10m of a synthetic fabric in continuous rolls of uniform width, is given by</p>
<table>
<tr><th>x</th><td>0</td><td>1</td><td>2</td><td>3</td><td>4</td></tr>
<tr><th>f(x)</th><td>0.41</td><td>0.37</td><td>0.16</td><td>0.05</td><td>0.01</td></tr>
</table>
<p>i) Find the expectation of x, E(X)</p>
<p>ii) Find the probability distribution function of X</p>`,
    think: r`<p>For a discrete variable: \(E(X) = \sum x f(x)\) (each value times its probability, then add). The distribution function is \(F(x) = P(X \le x)\), a running total of the probabilities. It is a step function that ends at 1.</p>`,
    solution: r`<p><b>(i)</b></p>
\[E(X) = 0(0.41) + 1(0.37) + 2(0.16) + 3(0.05) + 4(0.01) = 0.37 + 0.32 + 0.15 + 0.04 = 0.88\]
<p><b>(ii)</b></p>
\[F(x) = \begin{cases} 0, & x < 0 \\ 0.41, & 0 \le x < 1 \\ 0.78, & 1 \le x < 2 \\ 0.94, & 2 \le x < 3 \\ 0.99, & 3 \le x < 4 \\ 1, & x \ge 4 \end{cases}\]`,
  },
  {
    id: "a25",
    topic: "Proving the variance formula",
    question: r`<p>Show that the variance of a random variable X is σ<sup>2</sup> = E(X<sup>2</sup>) − µ<sup>2</sup>.</p>`,
    think: r`<p>Start from the definition \(\sigma^2 = E[(X - \mu)^2]\), expand the square, and use two facts: expectation is linear, and \(\mu\) is a constant so \(E(\mu) = \mu\) and \(E(\mu X) = \mu E(X)\).</p>`,
    solution: r`\[\begin{aligned} \sigma^2 &= E\big[(X - \mu)^2\big] = E\big[X^2 - 2\mu X + \mu^2\big] \\ &= E(X^2) - 2\mu E(X) + \mu^2 \\ &= E(X^2) - 2\mu \cdot \mu + \mu^2 \qquad (\text{because } E(X) = \mu) \\ &= E(X^2) - \mu^2 \quad \checkmark \end{aligned}\]`,
  },
  {
    id: "a26",
    topic: "Distorted bits and the binomial",
    question: r`<p>(i) In the transmission of digital information, the probability that a bit has high, moderate or low distortion is 0.01, 0.04, and 0.95 respectively. Suppose that 3 bits are transmitted and that the amount of distortion of each bit is assumed to be independent.</p>
<ul><li>What is the probability that two bits have high distortion and one has moderate distortion?</li>
<li>What is the probability that all three bits have low distortion?</li></ul>
<p>Let X denote the number of bits with high distortion out of the three transmitted.</p>
<p>Determine The probability distribution, mean and variance of X</p>`,
    think: r`<p>Independent bits: multiply. But if the question does not say which bit is which, also count the number of arrangements. When you count how many of \(n\) independent trials are a "success" with the same probability \(p\), that count is Binomial(\(n, p\)): \(P(X = x) = \binom nx p^x (1-p)^{n-x}\), mean \(np\), variance \(np(1-p)\).</p>`,
    solution: r`<p><b>(a)</b> The moderate bit can be in any of 3 positions: \(3 \times (0.01)^2(0.04) = 1.2 \times 10^{-5}\)</p>
<p><b>(b)</b> \((0.95)^3 = 0.8574\)</p>
<p><b>(c)</b> \(X \sim \text{Binomial}(3, 0.01)\):</p>
<table>
<tr><th>x</th><th>0</th><th>1</th><th>2</th><th>3</th></tr>
<tr><td>Working</td><td>\(0.99^3\)</td><td>\(3(0.01)(0.99)^2\)</td><td>\(3(0.01)^2(0.99)\)</td><td>\(0.01^3\)</td></tr>
<tr><td>\(P(X = x)\)</td><td>0.970299</td><td>0.029403</td><td>0.000297</td><td>0.000001</td></tr>
</table>
<p>Mean: \(np = 3(0.01) = 0.03\). Variance: \(np(1-p) = 3(0.01)(0.99) = 0.0297\).</p>`,
  },
  {
    id: "a27",
    topic: "Defectives without replacement",
    question: r`<p>a. A shipment of 8 similar microcomputers to a retail outlet contains 3 that are defective. If a school makes a random purchase of 2 of these computers, find the probability distribution for the number of defectives using permutations.</p>`,
    think: r`<p>Sampling without replacement from a group with two types. Let \(X\) = number of defectives, which can be 0, 1 or 2. "Using permutations" means count ordered picks: the total is \({}^8P_2\), and for each \(x\) count the ordered ways to get it. (Combinations give the same answer.)</p>`,
    solution: r`<p>Total ordered picks: \({}^8P_2 = 8 \times 7 = 56\).</p>
<p>\(x = 0\): both good: \({}^5P_2 = 5 \times 4 = 20\). &nbsp; \(P(X = 0) = \tfrac{20}{56} = \tfrac{10}{28}\)</p>
<p>\(x = 1\): one defective, one good, in either order: \(3 \times 5 + 5 \times 3 = 30\). &nbsp; \(P(X = 1) = \tfrac{30}{56} = \tfrac{15}{28}\)</p>
<p>\(x = 2\): both defective: \({}^3P_2 = 3 \times 2 = 6\). &nbsp; \(P(X = 2) = \tfrac{6}{56} = \tfrac{3}{28}\)</p>
<table>
<tr><th>x</th><td>0</td><td>1</td><td>2</td></tr>
<tr><th>f(x)</th><td>10/28</td><td>15/28</td><td>3/28</td></tr>
</table>
<p>Check: \(10 + 15 + 3 = 28\). ✓</p>`,
  },
  {
    id: "a28",
    topic: "Densities with an unknown constant",
    question: r`<p>Suppose that the error in the reaction temperature, in °C, for a controlled laboratory experiment is a continuous random variable X having the probability density function f(x) = Find a then, find</p>
<p>i) P(0 &lt; X ≤ 1)</p>
<p>ii) Suppose that Y = 2X<sup>2</sup> +1. Find E(Y)</p>
<p><i>[The formula after "f(x) =" is blank on the original sheet.]</i></p>`,
    think: r`<p>A density must have total area 1. That one equation gives the unknown constant. A probability is the area under \(f\) between the limits. For the expectation of a function, \(E[g(X)] = \int g(x) f(x)\,dx\), and linearity lets you write \(E(2X^2 + 1) = 2E(X^2) + 1\).</p>`,
    solution: r`<p><b>Assumption.</b> The formula did not print. This is a well known textbook problem and Part B Question 33 uses the same density, so I take</p>
\[f(x) = \begin{cases} a x^2, & -1 < x < 2 \\ 0, & \text{elsewhere} \end{cases}\]
<p><b>Find \(a\):</b></p>
\[\int_{-1}^{2} a x^2\,dx = a\left[\frac{x^3}{3}\right]_{-1}^{2} = a \cdot \frac{8 - (-1)}{3} = 3a = 1 \;\Rightarrow\; a = \frac13\]
<p><b>(i)</b></p>
\[P(0 < X \le 1) = \int_0^1 \frac{x^2}{3}\,dx = \left[\frac{x^3}{9}\right]_0^1 = \frac19\]
<p><b>(ii)</b></p>
\[E(X^2) = \int_{-1}^{2} x^2 \cdot \frac{x^2}{3}\,dx = \left[\frac{x^5}{15}\right]_{-1}^{2} = \frac{32 + 1}{15} = \frac{11}{5}\]
\[E(Y) = 2E(X^2) + 1 = 2 \cdot \frac{11}{5} + 1 = \frac{27}{5} = 5.4\]`,
  },
  {
    id: "a29",
    topic: "Mean and variance of aX + b",
    question: r`<p>Given that the pmf of a random variable X is as follows</p>
<table>
<tr><th>x</th><td>0</td><td>1</td><td>2</td><td>3</td></tr>
<tr><th>f(x)</th><td>1/4</td><td>1/8</td><td>1/2</td><td>1/8</td></tr>
</table>
<p>Find the mean and variance of the random variable 2X + 3.</p>`,
    think: r`<p>Do not build a new table for \(2X + 3\). Find \(E(X)\) and \(\text{Var}(X)\) first, then use the rules \(E(aX + b) = aE(X) + b\) and \(\text{Var}(aX + b) = a^2\,\text{Var}(X)\). Adding a constant shifts the mean but does not change the spread.</p>`,
    solution: r`\[E(X) = 0 \cdot \tfrac14 + 1 \cdot \tfrac18 + 2 \cdot \tfrac12 + 3 \cdot \tfrac18 = \tfrac18 + 1 + \tfrac38 = \tfrac32\]
\[E(X^2) = 0 + 1 \cdot \tfrac18 + 4 \cdot \tfrac12 + 9 \cdot \tfrac18 = \tfrac18 + 2 + \tfrac98 = \tfrac{13}{4}\]
\[\text{Var}(X) = \tfrac{13}{4} - \left(\tfrac32\right)^2 = \tfrac{13}{4} - \tfrac94 = 1\]
\[E(2X + 3) = 2 \cdot \tfrac32 + 3 = 6, \qquad \text{Var}(2X + 3) = 2^2 \cdot 1 = 4\]`,
  },
  {
    id: "a30",
    topic: "Binomial: impure wells",
    question: r`<p>it is conjectured that an impurity exists in 30% of all drinking wells in a certain rural community. In order to gain some insight on this problem, it is determined that some tests should be made. It is too expensive to test all the many wells in the area so 10 were randomly selected for testing.</p>
<p>a) Using binomial distribution what is the probability that exactly three wells have the impurity assuming that the conjecture is correct?</p>
<p>b) What is the probability that more than three wells are impure?</p>`,
    think: r`<p>Fixed number of trials (\(n = 10\)), each one yes or no, same probability (\(p = 0.3\)), independent: Binomial. "More than 3" has many cases (4 to 10), so use the complement: \(1 - P(X \le 3)\).</p>`,
    solution: r`<p>\(X \sim \text{Binomial}(10, 0.3)\), \(\;P(X = x) = \binom{10}{x}(0.3)^x(0.7)^{10-x}\).</p>
<p><b>(a)</b></p>
\[P(X = 3) = \binom{10}{3}(0.3)^3(0.7)^7 = 120 \times 0.027 \times 0.0823543 = 0.2668\]
<p><b>(b)</b></p>
\[\begin{aligned} P(X = 0) &= 0.7^{10} = 0.0282 \\ P(X = 1) &= 10(0.3)(0.7)^9 = 0.1211 \\ P(X = 2) &= 45(0.3)^2(0.7)^8 = 0.2335 \\ P(X = 3) &= 0.2668 \end{aligned}\]
<p>\(P(X \le 3) = 0.6496\), so \(P(X > 3) = 1 - 0.6496 = 0.3504\).</p>`,
  },
  {
    id: "a31",
    topic: "A binomial on top of a binomial",
    question: r`<p>A large chain retailer purchases a certain kind of electronic device from a manufacturer. The manufacturer indicates that the defective rate of the device is 3%.</p>
<p>a. The inspector of the retailer randomly picks 20 items from a shipment. What is the probability that there will be at least one defective item among these 20?</p>
<p>b. Suppose that the retailer receives 10 shipments in a month and the inspector randomly tests 20 devices per shipment. What is the probability that there will be 3 shipments containing at least one defective device?</p>`,
    think: r`<p>"At least one" almost always means \(1 - P(\text{none})\). Part (b) is a binomial on top of a binomial: each shipment is now one trial, and "success" is the event from part (a), so reuse that answer as the new \(p\).</p>`,
    solution: r`<p><b>(a)</b> \(P(\text{none}) = (0.97)^{20} = 0.5438\), so \(P(\text{at least one}) = 1 - 0.5438 = 0.4562\).</p>
<p><b>(b)</b> \(Y\) = number of shipments with at least one defective, \(Y \sim \text{Binomial}(10, 0.4562)\):</p>
\[P(Y = 3) = \binom{10}{3}(0.4562)^3(0.5438)^7 = 120 \times 0.09495 \times 0.01406 \approx 0.1602\]`,
  },
  {
    id: "a32",
    topic: "The geometric distribution",
    question: r`<p>At busy time, a telephone exchange is very near capacity, so callers have difficulty placing their calls. It may be of interest to know the number of attempts necessary in order to gain a connection. Suppose that we let p = 0.05 be the probability of connection during busy time. We are interested in knowing the probability that 5 attempts are necessary for a successful call. Use geometric distribution.</p>`,
    think: r`<p>"Number of tries until the first success" is the Geometric distribution: the first \(x - 1\) tries fail and try number \(x\) succeeds. \(P(X = x) = (1 - p)^{x-1} p\).</p>`,
    solution: r`\[P(X = 5) = (0.95)^4(0.05) = 0.8145 \times 0.05 = 0.0407\]`,
  },
  {
    id: "a33",
    topic: "Poisson approximation",
    question: r`<p>In a certain industrial facility accidents occur infrequently. It is known that the probability of an accident on any given day is 0.005 and accidents are independent of each other.(use Poisson distribution)</p>
<p>a)what is the probability that in any given period of 400 days there will be an accident on one day?</p>
<p>b)what is the probability that there are at most three days with an accident?</p>`,
    think: r`<p>Many trials (\(n\) large) and a rare event (\(p\) small): approximate the binomial with Poisson, using \(\lambda = np\). Then \(P(X = x) = \dfrac{e^{-\lambda}\lambda^x}{x!}\). "At most 3" means add \(x = 0, 1, 2, 3\).</p>`,
    solution: r`<p>\(\lambda = np = 400 \times 0.005 = 2\), and \(e^{-2} = 0.1353\).</p>
<p><b>(a)</b> \(P(X = 1) = \dfrac{e^{-2} 2^1}{1!} = 2e^{-2} = 0.2707\)</p>
<p><b>(b)</b></p>
\[P(X \le 3) = e^{-2}\left(1 + 2 + \frac{2^2}{2!} + \frac{2^3}{3!}\right) = e^{-2}\left(1 + 2 + 2 + \frac43\right) = \frac{19}{3}e^{-2} = 0.8571\]`,
  },
  {
    id: "a34",
    topic: "The normal distribution",
    question: r`<p>(i) Suppose that X ∼ N(1,2). Find P(1 &lt; X &lt; 2)</p>
<p>(ii) Suppose the battery life of a laptop is normally distributed with a standard deviation of 20minutes. Engineering design requires that only one percent of batteries fail to last 300 minutes. What mean battery life is required to ensure this condition?</p>`,
    think: r`<p>Every normal problem uses the same step: standardise with \(Z = \dfrac{X - \mu}{\sigma}\) and use the Z table. Forward problem: you have \(x\) values, convert to \(z\), read probabilities. Backward problem: you have a probability, read \(z\) from the table, then solve for the unknown (\(\mu\) here). Be careful with notation: \(N(\mu, \sigma^2)\) gives the variance second.</p>`,
    solution: r`<p><b>(i)</b> \(\mu = 1\), \(\sigma^2 = 2\), so \(\sigma = \sqrt2 = 1.414\).</p>
\[P(1 < X < 2) = P\!\left(\frac{1-1}{\sqrt2} < Z < \frac{2-1}{\sqrt2}\right) = P(0 < Z < 0.707) = \Phi(0.707) - 0.5 = 0.7602 - 0.5 = 0.2602\]
<p>(If your lecturer means standard deviation 2, then \(z = 0.5\) and the answer is \(0.6915 - 0.5 = 0.1915\).)</p>
<p><b>(ii)</b> We need \(P(X < 300) = 0.01\). From the table, \(P(Z < -2.326) = 0.01\). So</p>
\[\frac{300 - \mu}{20} = -2.326 \;\Rightarrow\; \mu = 300 + 2.326 \times 20 = 346.5 \text{ minutes}\]`,
  },
  {
    id: "a35",
    topic: "Means and variances of the common distributions",
    question: r`<p>It can be shown (check) that</p>
<table>
<tr><th>Name</th><th>Notation</th><th>Expected value</th><th>variance</th></tr>
<tr><td>Binomial</td><td>\(X \sim B_{n,p}\)</td><td>\(np\)</td><td>\(np(1-p)\)</td></tr>
<tr><td>Geometric</td><td>\(X \sim \text{Geo}_p\)</td><td>\(\frac1p\)</td><td>\(\frac{1-p}{p^2}\)</td></tr>
<tr><td>Poisson</td><td>\(X \sim \text{Po}_\lambda\)</td><td>\(\lambda\)</td><td>\(\lambda\)</td></tr>
<tr><td>Uniform</td><td>\(X \sim U_{a,b}\)</td><td>\(\frac12(a+b)\)</td><td>\(\frac{(b-a)^2}{12}\)</td></tr>
<tr><td>Exponential</td><td>\(X \sim \text{Exp}_\lambda\)</td><td>\(\frac1\lambda\)</td><td>\(\frac1{\lambda^2}\)</td></tr>
<tr><td>Erlang</td><td>\(X \sim \text{Erlang}_{k,\lambda}\)</td><td>\(k \cdot \frac1\lambda\)</td><td>\(k \cdot \frac1{\lambda^2}\)</td></tr>
<tr><td>Gaussian or Normal</td><td>\(X \sim N_{\mu,\sigma^2}\)</td><td>\(\mu\)</td><td>\(\sigma^2\)</td></tr>
</table>`,
    think: r`<p>Same recipe each time: find \(E(X)\), find \(E(X^2)\) (or \(E[X(X-1)]\) when factorials are involved, because it cancels nicely), then \(\text{Var}(X) = E(X^2) - [E(X)]^2\). For distributions that are sums of simple independent pieces (Binomial, Erlang), just add the means and variances of the pieces. Write \(q = 1 - p\).</p>`,
    solution: r`<h5>Binomial(\(n, p\))</h5>
<p>\(X = X_1 + \dots + X_n\) where each \(X_i\) is 1 with probability \(p\), else 0. \(E(X_i) = p\), \(E(X_i^2) = p\), so \(\text{Var}(X_i) = p - p^2 = pq\). Adding \(n\) independent pieces: \(E(X) = np\), \(\text{Var}(X) = npq = np(1-p)\). ✓</p>
<h5>Geometric(\(p\)), \(P(X = k) = q^{k-1}p,\ k = 1, 2, \dots\)</h5>
<p>Use \(\sum_{k \ge 1} k q^{k-1} = \dfrac{1}{(1-q)^2}\) and \(\sum_{k \ge 2} k(k-1)q^{k-2} = \dfrac{2}{(1-q)^3}\).</p>
\[E(X) = p \cdot \frac{1}{p^2} = \frac1p, \qquad E[X(X-1)] = pq \cdot \frac{2}{p^3} = \frac{2q}{p^2}\]
\[\text{Var}(X) = E[X(X-1)] + E(X) - [E(X)]^2 = \frac{2q}{p^2} + \frac1p - \frac1{p^2} = \frac{2q + p - 1}{p^2} = \frac{q}{p^2} = \frac{1-p}{p^2} \;\checkmark\]
<h5>Poisson(\(\lambda\)), \(P(X = k) = e^{-\lambda}\lambda^k / k!\)</h5>
\[E(X) = \sum_{k \ge 1} k \frac{e^{-\lambda}\lambda^k}{k!} = \lambda e^{-\lambda} \sum_{k \ge 1} \frac{\lambda^{k-1}}{(k-1)!} = \lambda e^{-\lambda} e^{\lambda} = \lambda\]
<p>In the same way \(E[X(X-1)] = \lambda^2\), so \(\text{Var}(X) = \lambda^2 + \lambda - \lambda^2 = \lambda\). ✓</p>
<h5>Uniform(\(a, b\)), \(f(x) = \frac{1}{b-a}\) on \([a, b]\)</h5>
\[E(X) = \int_a^b \frac{x}{b-a}\,dx = \frac{b^2 - a^2}{2(b-a)} = \frac{a+b}{2}, \qquad E(X^2) = \frac{b^3 - a^3}{3(b-a)} = \frac{a^2 + ab + b^2}{3}\]
\[\text{Var}(X) = \frac{a^2 + ab + b^2}{3} - \frac{(a+b)^2}{4} = \frac{4a^2 + 4ab + 4b^2 - 3a^2 - 6ab - 3b^2}{12} = \frac{(b-a)^2}{12} \;\checkmark\]
<h5>Exponential(\(\lambda\)), \(f(x) = \lambda e^{-\lambda x},\ x > 0\)</h5>
<p>Integrating by parts (or using \(\int_0^\infty x^n e^{-\lambda x}\,dx = n!/\lambda^{n+1}\)):</p>
\[E(X) = \lambda \cdot \frac{1}{\lambda^2} = \frac1\lambda, \qquad E(X^2) = \lambda \cdot \frac{2}{\lambda^3} = \frac{2}{\lambda^2}, \qquad \text{Var}(X) = \frac2{\lambda^2} - \frac1{\lambda^2} = \frac1{\lambda^2} \;\checkmark\]
<h5>Erlang(\(k, \lambda\))</h5>
<p>This is the sum of \(k\) independent Exponential(\(\lambda\)) variables. Add the means and the variances: \(E(X) = k \cdot \frac1\lambda\), \(\text{Var}(X) = k \cdot \frac1{\lambda^2}\). ✓</p>
<h5>Normal(\(\mu, \sigma^2\))</h5>
<p>Write \(X = \mu + \sigma Z\) with \(Z\) standard normal, density \(\varphi(z) = \frac{1}{\sqrt{2\pi}}e^{-z^2/2}\). \(E(Z) = \int_{-\infty}^{\infty} z\varphi(z)\,dz = 0\) because the function is odd. By parts,</p>
\[E(Z^2) = \int_{-\infty}^{\infty} z \cdot z\varphi(z)\,dz = \Big[-z\varphi(z)\Big]_{-\infty}^{\infty} + \int_{-\infty}^{\infty}\varphi(z)\,dz = 0 + 1 = 1\]
<p>So \(\text{Var}(Z) = 1\), and \(E(X) = \mu + \sigma \cdot 0 = \mu\), \(\text{Var}(X) = \sigma^2 \cdot 1 = \sigma^2\). ✓</p>`,
  },
  {
    id: "b26",
    topic: "Binomial: the shock test",
    question: r`<p>The probability that a certain component will survive a given shock test is 3/4. Find the probability that exactly 2 of the next 4 components tested survive.</p>`,
    think: r`<p>Fixed number of independent trials, same success probability, "exactly \(x\) successes": Binomial.</p>`,
    solution: r`<p>\(X \sim \text{Binomial}(4, \tfrac34)\):</p>
\[P(X = 2) = \binom42\left(\frac34\right)^2\left(\frac14\right)^2 = 6 \cdot \frac{9}{16} \cdot \frac{1}{16} = \frac{54}{256} = \frac{27}{128} \approx 0.2109\]`,
  },
  {
    id: "b27",
    topic: "Binomial ranges and Chebyshev",
    question: r`<p>The probability that a patient recovers from a rare blood disease is 0.4. if 15 people are known to have contracted this disease, what is the probability that a) at least 10 b) from 3 to 8 C) exactly 5 survive? Find the mean and variance of this random variable and then use Chebychev's theorem to interpret the interval µ ± 2σ</p>`,
    think: r`<p>Binomial with \(n = 15\), \(p = 0.4\). For ranges, use the cumulative binomial table: \(P(a \le X \le b) = P(X \le b) - P(X \le a - 1)\). Note the "\(a - 1\)". Chebyshev's theorem says: for any distribution, at least \(1 - \frac{1}{k^2}\) of the probability lies within \(k\) standard deviations of the mean.</p>`,
    solution: r`<p>\(X \sim \text{Binomial}(15, 0.4)\). From the cumulative table: \(P(X \le 2) = 0.0271\), \(P(X \le 4) = 0.2173\), \(P(X \le 5) = 0.4032\), \(P(X \le 8) = 0.9050\), \(P(X \le 9) = 0.9662\).</p>
<p><b>(a)</b> \(P(X \ge 10) = 1 - P(X \le 9) = 1 - 0.9662 = 0.0338\)</p>
<p><b>(b)</b> \(P(3 \le X \le 8) = P(X \le 8) - P(X \le 2) = 0.9050 - 0.0271 = 0.8779\)</p>
<p><b>(c)</b></p>
\[P(X = 5) = \binom{15}{5}(0.4)^5(0.6)^{10} = 3003 \times 0.01024 \times 0.0060466 = 0.1859\]
<p>Mean: \(\mu = np = 15(0.4) = 6\). Variance: \(\sigma^2 = npq = 15(0.4)(0.6) = 3.6\), \(\sigma = 1.897\).</p>
<p>Chebyshev: \(\mu \pm 2\sigma = 6 \pm 3.794 = (2.206,\ 9.794)\). With \(k = 2\), the probability is at least \(1 - \frac14 = \frac34\).</p>
<p>Meaning: there is at least a 75% chance that the number of patients who recover out of 15 is between 2.206 and 9.794, that is, from 3 to 9 patients.</p>`,
  },
  {
    id: "b28",
    topic: "Repeat of Question 31",
    question: r`<p>A large chain retailer purchases a certain kind of electronic device from a manufacturer. The manufacturer indicates that the defective rate of the device is 3%.</p>
<p>a) the inspector of the retailer randomly picks 20 items from a shipment. What is the probability that there will be at least one defective item among these 20</p>
<p>b) Suppose that the retailer receives 10 shipments in a month and the inspector randomly tests 20 devices per shipment. What is the probability that there will be 3 shipments containing at least one defective device?</p>`,
    think: r`<p>Identical question. See Part A Question 31 for the reasoning.</p>`,
    solution: r`<p><b>(a)</b> \(1 - (0.97)^{20} = 0.4562\) &nbsp;&nbsp; <b>(b)</b> \(\binom{10}{3}(0.4562)^3(0.5438)^7 = 0.1602\)</p>`,
  },
  {
    id: "b29",
    topic: "Geometric: the first defective",
    question: r`<p>In a certain manufacturing process it is known that, on the average, 1 in every 100 items is defective. What is the probability that the fifth item inspected is the first defective item found?</p>`,
    think: r`<p>"First success on trial number \(x\)": Geometric, as in Part A Question 32.</p>`,
    solution: r`<p>\(p = 0.01\):</p>
\[P(X = 5) = (0.99)^4(0.01) = 0.9606 \times 0.01 = 0.0096\]`,
  },
  {
    id: "b30",
    topic: "Poisson: the particle counter",
    question: r`<p>During a laboratory experiment the average number of radioactive particles passing through a counter in 1millisecond is 4. What is the probability that 6 particles enter the counter in a given millisecond?</p>`,
    think: r`<p>Counting random events in a fixed interval of time or space, when you are given the average rate: Poisson with \(\lambda\) = that average.</p>`,
    solution: r`<p>\(\lambda = 4\):</p>
\[P(X = 6) = \frac{e^{-4}4^6}{6!} = \frac{0.018316 \times 4096}{720} = 0.1042\]`,
  },
  {
    id: "b31",
    topic: "Poisson: tankers turned away",
    question: r`<p>Ten is the average number of oil tankers arriving each day at a certain port city. The facilities at the port can handle at most 15 tankers per day. What is the probability that on a iven day tankers have to be turned away?</p>`,
    think: r`<p>Poisson again (\(\lambda = 10\)). Translate the words: tankers are turned away when more than 15 arrive, so we need \(P(X > 15) = 1 - P(X \le 15)\). Use the cumulative Poisson table.</p>`,
    solution: r`<p>From the Poisson table with \(\lambda = 10\): \(P(X \le 15) = 0.9513\).</p>
\[P(X > 15) = 1 - 0.9513 = 0.0487\]`,
  },
  {
    id: "b32",
    topic: "Repeat of Question 33",
    question: r`<p>In a certain industrial facility accidents occur infrequently. It is known that the probability of an accident on any day is 0.005 and accidents are independent of each other.</p>
<p>a) What is the probability that in any given period of 400 days there will be an accident on one day?</p>
<p>b) What is the probability that there are at most three days with an accident?</p>`,
    think: r`<p>Identical question. See Part A Question 33.</p>`,
    solution: r`<p>\(\lambda = 2\). &nbsp; <b>(a)</b> \(2e^{-2} = 0.2707\) &nbsp;&nbsp; <b>(b)</b> \(\frac{19}{3}e^{-2} = 0.8571\)</p>`,
  },
  {
    id: "b33",
    topic: "aX + b for a density",
    question: r`<p>Let X be random variable having the density function given</p>
\[f(x) = \begin{cases} \dfrac{x^2}{3}, & -1 < x < 2 \\ 0, & \text{elswhere} \end{cases}\]
<p>Find the expected value and variance of g(X) = 4x + 3</p>`,
    think: r`<p>Same idea as Part A Question 29, but with integrals. Find \(E(X)\) and \(\text{Var}(X)\), then apply \(E(aX + b) = aE(X) + b\) and \(\text{Var}(aX + b) = a^2\,\text{Var}(X)\).</p>`,
    solution: r`\[E(X) = \int_{-1}^{2} x \cdot \frac{x^2}{3}\,dx = \left[\frac{x^4}{12}\right]_{-1}^{2} = \frac{16 - 1}{12} = \frac54\]
\[E(X^2) = \int_{-1}^{2} \frac{x^4}{3}\,dx = \left[\frac{x^5}{15}\right]_{-1}^{2} = \frac{33}{15} = \frac{11}{5}\]
\[\text{Var}(X) = \frac{11}{5} - \left(\frac54\right)^2 = \frac{176 - 125}{80} = \frac{51}{80}\]
\[E(4X + 3) = 4 \cdot \frac54 + 3 = 8, \qquad \text{Var}(4X + 3) = 16 \cdot \frac{51}{80} = \frac{51}{5} = 10.2\]`,
  },
  {
    id: "b34",
    topic: "(blank on the sheet)",
    question: r`<p><i>This number is blank on the original sheet.</i></p>`,
    blank: true,
  },
  {
    id: "b35",
    topic: "Joint probability function",
    question: r`<p>Two refills of a ballpoint pen are selected at random from a box that contains 3 blue refills, 2 red refills and 3 green refills. If X is the number of the blue refills and Y is the number of red refills selected, find (a) the joint probability function f(x,y) and</p>
<p>(b) P[(X,Y) ∈ A], where A is the region {(x, y) | x + y ≤ 1}</p>
<p>(c) find their marginal distribution functions</p>
<p>(d) find the conditional distribution of X, given that Y = 1, and use it to determine P(X = 0|Y = 1).</p>
<p>(e) show that these random variables are not statistically independent.</p>`,
    think: r`<p>Build the joint table cell by cell with combinations: choose \(x\) blue, \(y\) red, and the rest green, over all ways to choose 2 from 8. Then everything else comes from the table. Marginals: add along rows or columns. Conditional: take one column and divide by its total. Independence: needs \(f(x,y) = g(x)h(y)\) in every cell, so one cell that fails is enough to disprove it.</p>`,
    solution: r`<p><b>(a)</b></p>
\[f(x, y) = \frac{\binom3x\binom2y\binom{3}{2-x-y}}{\binom82}, \qquad x, y \ge 0,\ x + y \le 2, \qquad \binom82 = 28\]
<p>For example \(f(0,1) = \dfrac{\binom30\binom21\binom31}{28} = \dfrac{6}{28}\) and \(f(1,0) = \dfrac{\binom31\binom20\binom31}{28} = \dfrac{9}{28}\).</p>
<table>
<tr><th>f(x, y)</th><th>x = 0</th><th>x = 1</th><th>x = 2</th><th>h(y)</th></tr>
<tr><td>y = 0</td><td>3/28</td><td>9/28</td><td>3/28</td><td>15/28</td></tr>
<tr><td>y = 1</td><td>6/28</td><td>6/28</td><td>0</td><td>12/28</td></tr>
<tr><td>y = 2</td><td>1/28</td><td>0</td><td>0</td><td>1/28</td></tr>
<tr><td>g(x)</td><td>10/28</td><td>15/28</td><td>3/28</td><td>1</td></tr>
</table>
<p><b>(b)</b></p>
\[P(X + Y \le 1) = f(0,0) + f(1,0) + f(0,1) = \frac{3 + 9 + 6}{28} = \frac{18}{28} = \frac{9}{14}\]
<p><b>(c)</b> Marginals (the totals in the table):</p>
\[g(0) = \tfrac{10}{28} = \tfrac{5}{14},\ g(1) = \tfrac{15}{28},\ g(2) = \tfrac{3}{28} \qquad h(0) = \tfrac{15}{28},\ h(1) = \tfrac{12}{28} = \tfrac37,\ h(2) = \tfrac{1}{28}\]
<p><b>(d)</b> \(f(x \mid 1) = \dfrac{f(x,1)}{h(1)}\): \(\;f(0 \mid 1) = \dfrac{6/28}{12/28} = \dfrac12\), \(f(1 \mid 1) = \dfrac12\), \(f(2 \mid 1) = 0\). So \(P(X = 0 \mid Y = 1) = \tfrac12\).</p>
<p><b>(e)</b> Take the cell \((0,1)\): \(f(0,1) = \tfrac{3}{14} = 0.214\), but \(g(0)h(1) = \tfrac{5}{14} \cdot \tfrac37 = \tfrac{15}{98} = 0.153\). Since \(f(0,1) \ne g(0)h(1)\), \(X\) and \(Y\) are not independent. ✓</p>`,
  },
  {
    id: "b36",
    topic: "Joint density over a square",
    question: r`<p>A candy company distributes boxes of chocolates with a mixture of creams, toffees and nuts coated in both light and dark chocolate. For a randomly selected box, let X and Y, respectively, be the proportions of the light and dark chocolates that are creams and suppose that the joint density function is</p>
\[f(x, y) = \begin{cases} \tfrac25(2x + 3y), & 0 \le x \le 1,\ 0 \le y \le 1 \\ 0, & \text{elsewhere} \end{cases}\]
<p>a) Verify condition 2 of joint density function</p>
<p>b) Find P[(X, Y) ∈ A], where A is the region {(x, y) | 0 &lt; x &lt; 1/2, 1/4 &lt; y &lt; 1/2}</p>
<p>c) Find g(x) and h(y) for this joint density</p>`,
    think: r`<p>Condition 2 is that the total volume is 1: \(\iint f\,dx\,dy = 1\). A probability over a region is the double integral over that region. A marginal is found by integrating out the other variable over its full range. Do the inner integral first, treating the other letter as a constant.</p>`,
    solution: r`<p><b>(a)</b></p>
\[\int_0^1\!\!\int_0^1 \tfrac25(2x + 3y)\,dx\,dy = \tfrac25\int_0^1 \Big[x^2 + 3xy\Big]_{x=0}^{1} dy = \tfrac25\int_0^1 (1 + 3y)\,dy = \tfrac25\left[y + \tfrac{3y^2}{2}\right]_0^1 = \tfrac25 \cdot \tfrac52 = 1 \;\checkmark\]
<p><b>(b)</b></p>
\[P = \int_{1/4}^{1/2}\!\!\int_0^{1/2} \tfrac25(2x + 3y)\,dx\,dy = \tfrac25\int_{1/4}^{1/2}\left(\tfrac14 + \tfrac{3y}{2}\right)dy = \tfrac25\left[\tfrac y4 + \tfrac{3y^2}{4}\right]_{1/4}^{1/2}\]
\[= \tfrac25\left[\left(\tfrac18 + \tfrac{3}{16}\right) - \left(\tfrac1{16} + \tfrac{3}{64}\right)\right] = \tfrac25 \cdot \tfrac{13}{64} = \tfrac{13}{160} \approx 0.0813\]
<p><b>(c)</b></p>
\[g(x) = \int_0^1 \tfrac25(2x + 3y)\,dy = \tfrac25\left(2x + \tfrac32\right) = \frac{4x + 3}{5}, \quad 0 \le x \le 1\]
\[h(y) = \int_0^1 \tfrac25(2x + 3y)\,dx = \tfrac25(1 + 3y) = \frac{2(1 + 3y)}{5}, \quad 0 \le y \le 1\]`,
  },
  {
    id: "b37",
    topic: "Joint density over a triangle",
    question: r`<p>The Joint density for the random variable (X, Y), where X is the unit temperature change and Y is the proportion of spectrum shift that a certain atomic particle produces is</p>
\[f(x, y) = \begin{cases} 10xy^2, & 0 < x < y < 1 \\ 0, & \text{elsewhere} \end{cases}\]
<p>a) Find the marginal densities g(x), h(y) and the conditional density f(y|x)</p>
<p>b) Find the probability that the spectrum shifts more than half of the total observations, given the temperature is increased to 0.25 unit.</p>`,
    think: r`<p>The region is a triangle, not a square, so the limits depend on the other variable. Sketch it: \(x\) is below \(y\). For a fixed \(x\), \(y\) runs from \(x\) up to 1. For a fixed \(y\), \(x\) runs from 0 up to \(y\). Getting these limits right is the whole problem. Conditional density: \(f(y \mid x) = f(x,y)/g(x)\). To condition on \(X = 0.25\), plug \(x = 0.25\) into \(f(y \mid x)\) and integrate over the \(y\) range asked.</p>`,
    solution: r`<p><b>(a)</b></p>
\[g(x) = \int_x^1 10xy^2\,dy = 10x\left[\frac{y^3}{3}\right]_x^1 = \frac{10}{3}x(1 - x^3), \quad 0 < x < 1\]
\[h(y) = \int_0^y 10xy^2\,dx = 10y^2\left[\frac{x^2}{2}\right]_0^y = 5y^4, \quad 0 < y < 1\]
\[f(y \mid x) = \frac{f(x,y)}{g(x)} = \frac{10xy^2}{\frac{10}{3}x(1 - x^3)} = \frac{3y^2}{1 - x^3}, \quad x < y < 1\]
<p><b>(b)</b></p>
\[P\left(Y > \tfrac12 \,\middle|\, X = 0.25\right) = \int_{1/2}^{1} \frac{3y^2}{1 - (0.25)^3}\,dy = \frac{\big[y^3\big]_{1/2}^{1}}{1 - \frac1{64}} = \frac{7/8}{63/64} = \frac89 \approx 0.889\]`,
  },
  {
    id: "b38",
    topic: "Independent exponential lifetimes",
    question: r`<p>Suppose that the shelf life, in years of a certain perishable food packaged in cardboard containers is a random variable whose probability density function is given by</p>
\[f(x) = \begin{cases} e^{-x}, & x > 0 \\ 0, & \text{elswhere.} \end{cases}\]
<p>Let X<sub>1</sub>, X<sub>2</sub> and X<sub>3</sub> represent the shelf lives for three of these containers selected independently and find P(X<sub>1</sub> &lt; 2, 1 &lt; X<sub>2</sub> &lt; 3, X<sub>3</sub> &gt; 2)</p>`,
    think: r`<p>Independent variables: the joint probability is the product of the three separate probabilities. Find each one by integrating \(e^{-x}\) over its own range, then multiply.</p>`,
    solution: r`\[P(X_1 < 2) = \int_0^2 e^{-x}\,dx = 1 - e^{-2} = 0.8647\]
\[P(1 < X_2 < 3) = \int_1^3 e^{-x}\,dx = e^{-1} - e^{-3} = 0.3181\]
\[P(X_3 > 2) = \int_2^\infty e^{-x}\,dx = e^{-2} = 0.1353\]
\[P = (1 - e^{-2})(e^{-1} - e^{-3})e^{-2} = 0.8647 \times 0.3181 \times 0.1353 = 0.0372\]`,
  },
  {
    id: "b39",
    topic: "Combined mean",
    question: r`<p>Given two samples X and Y with means 9 and 8 respectively and sample sizes 50 and 40 respectively. Find their combined mean.</p>`,
    think: r`<p>Never just average the two means when the sizes differ. A mean is total divided by count, so rebuild the totals (mean times size), add them, and divide by the total count. This is a weighted mean.</p>`,
    solution: r`\[\bar x_{\text{combined}} = \frac{n_1\bar x + n_2\bar y}{n_1 + n_2} = \frac{50(9) + 40(8)}{50 + 40} = \frac{450 + 320}{90} = \frac{770}{90} = 8.56\]`,
  },
];

/** The key formulas box at the start of the book. */
export const CSC211_FORMULAS = r`<ul>
<li>Equally likely outcomes: \(P(E) = \dfrac{\text{number of outcomes in } E}{\text{number of outcomes in } S}\)</li>
<li>Complement: \(P(\bar A) = 1 - P(A)\)</li>
<li>Addition rule: \(P(A \cup B) = P(A) + P(B) - P(A \cap B)\)</li>
<li>Conditional probability: \(P(A \mid B) = \dfrac{P(A \cap B)}{P(B)}\)</li>
<li>Independence: \(P(A \cap B) = P(A)\,P(B)\)</li>
<li>Total probability: \(P(B) = \sum_i P(B \mid A_i)P(A_i)\)</li>
<li>Bayes: \(P(A_i \mid B) = \dfrac{P(B \mid A_i)P(A_i)}{P(B)}\)</li>
</ul>`;

/** "Which tool for which problem?" at the end of the book. */
export const CSC211_QUICK_GUIDE: [string, string][] = [
  ["“or”", "Addition rule (subtract the overlap)"],
  ["“given that”, “if you know”", "Conditional probability"],
  ["“at least one”", r`\(1 - P(\text{none})\)`],
  ["Two stages, second depends on first", "Tree diagram, total probability"],
  ["“Given the result, what was the cause?”", "Bayes"],
  ["Choose items, order matters / does not", "Permutation / Combination"],
  [r`\(n\) fixed trials, count successes`, "Binomial"],
  ["Trials until first success", "Geometric"],
  ["Rare events, or average rate given", r`Poisson (\(\lambda = np\) or the given rate)`],
  ["Bell curve, mean and s.d.", "Standardise to \\(Z\\), use table"],
  ["Density with unknown constant", "Set total area to 1"],
  [r`Mean or variance of \(aX + b\)`, r`\(aE(X) + b\) and \(a^2\,\text{Var}(X)\)`],
];

// CSC205 Past CA Solutions: four CSC205 papers, every question solved. Questions are word for word
// from the papers. Section ids are `<paper>-<question>`; the paywall counts the first 15 of each
// paper as free (see `perPart` in src/lib/books.ts), so keep each paper's items in paper order.

export type CaPaper = {
  id: string;
  name: string;
  /** One line under the paper's heading: date, instructors, time. */
  meta: string;
  note?: string;
};

export type CaItem = {
  id: string;
  /** How the paper numbers it: "A1", "B3", "1(c)", "E2.4". */
  label: string;
  topic: string;
  question: string;
  solution: string;
};

export const CA_PAPERS: CaPaper[] = [
  {
    id: "y24",
    name: "CA 2024/2025",
    meta: "Continuous assessment, 1 hour. S.E Mukete Eddy and Mr. Mbungang N. Benedict.",
  },
  {
    id: "y23",
    name: "Test 1, 16 November 2023",
    meta: "Thursday 16/11/2023, 1 h 30 min. Dr. Achankeng and Mr. Mbungang.",
  },
  {
    id: "y22b",
    name: "CA 2022/2023",
    meta: "Continuous assessment, 30 minutes. Dr Nkweteyim D. and Mr. Mbungang N. Benedict.",
    note: "Only page 1 of this paper was available, so only Section A is answered.",
  },
  {
    id: "y22",
    name: "CA Test I, 24 November 2022",
    meta: "Section A, 15 marks. Calculators, cell phones and other computing aids not allowed.",
    note: "The copy answered here has Question 2, parts 1 to 4.",
  },
];

// ---- small builders, so each solution reads like the paper ----
const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
/** Working, kept exactly as laid out (monospace). One block per line, so phones can wrap a long
 *  line with a hanging indent instead of scrolling sideways. */
const w = (s: string) =>
  `<pre class="work">${s
    .replace(/^\n|\n\s*$/g, "")
    .split("\n")
    .map((line) => {
      const ind = line.length - line.trimStart().length;
      return `<span class="ln"${ind ? ` style="--ind:${ind}ch"` : ""}>${esc(line.trimStart()) || " "}</span>`;
    })
    .join("")}</pre>`;
const ans = (s: string) => `<p class="ans"><b>Answer</b> ${s}</p>`;
const p = (...lines: string[]) => lines.map((l) => `<p>${l}</p>`).join("");
const ol = (items: string[]) => `<ol>${items.map((i) => `<li>${i}</li>`).join("")}</ol>`;
const table = (head: string[], rows: string[][]) =>
  `<div class="tbl"><table><tr>${head.map((h) => `<th>${h}</th>`).join("")}</tr>${rows
    .map((r) => `<tr>${r.map((c) => `<td>${c}</td>`).join("")}</tr>`)
    .join("")}</table></div>`;
const opts = (o: string[]) => `<ol class="mcq" type="A">${o.map((x) => `<li>${x}</li>`).join("")}</ol>`;
/** A multiple-choice question: stem, options A–D, and the correct letter with why. */
function mcq(id: string, label: string, topic: string, stem: string, options: string[], right: number, why = ""): CaItem {
  const letter = "ABCD"[right];
  return {
    id,
    label,
    topic,
    question: `<p>${stem}</p>${opts(options)}`,
    solution: ans(`${letter}. ${options[right]}`) + (why ? p(why) : ""),
  };
}

const Y24: CaItem[] = [
  {
    id: "y24-a1",
    label: "A1",
    topic: "Four ways to represent signed integers",
    question: p("Name the FOUR ways in which signed integers can be represented in digital computers. (0.25 × 4 = 1pt)"),
    solution: ol(["Sign magnitude", "One's complement", "Two's complement", "Excess-N, also called biased notation"]),
  },
  {
    id: "y24-a2",
    label: "A2",
    topic: "The three parts of a floating-point number",
    question: p("What are the three component parts of a floating-point number? (0.5 × 3 = 1.5 pts)"),
    solution: ol(["The sign", "The exponent", "The mantissa, also called the significand"]),
  },
  {
    id: "y24-a3",
    label: "A3",
    topic: "Biased exponent",
    question: p("What is a biased exponent, and what efficiencies can it provide? (0.25 × 2 = 0.5 pt)"),
    solution: p(
      "A biased exponent is one in which a fixed number, called the bias, is added to the true exponent before it is stored, so that the stored value is always positive. In IEEE 754 single precision the bias is 127, so a true exponent of −3 is stored as 124.",
      "Two efficiencies follow. First, no separate sign bit is needed for the exponent field. Second, because the stored exponents are ordinary unsigned numbers, two floating-point values can be compared and sorted using plain unsigned integer comparison, which makes the comparison hardware simpler and faster."
    ),
  },
  {
    id: "y24-a4",
    label: "A4",
    topic: "Normalization",
    question: p("What is normalization, and why is it necessary? (0.5 × 2 = 1pt)"),
    solution: p(
      "Normalization is the adjustment of a floating-point number so that the mantissa has exactly one non-zero digit to the left of the radix point, giving the form 1.xxxx × 2<sup>e</sup>.",
      "It is necessary for three reasons. Without it the same value has many different representations, for example 0.5 × 2<sup>3</sup> and 0.25 × 2<sup>4</sup>, which makes comparison and arithmetic unreliable. Normalizing gives each value one unique form. It also ensures every mantissa bit carries a significant digit, so precision is maximised. Finally, because the leading digit is then always 1, it need not be stored, which gains one extra bit of precision at no cost."
    ),
  },
  {
    id: "y24-a5",
    label: "A5",
    topic: "Why floating-point arithmetic has error",
    question: p("Why is there always some degree of error in floating-point arithmetic when it is performed by a binary digital computer? (0.25 pt)"),
    solution: p(
      "Because the mantissa has a finite number of bits. Many decimal fractions, such as 0.1 or 0.456, have no exact finite representation in binary, so they must be rounded or truncated to fit the available bits. Each operation introduces a small rounding error, and repeated operations accumulate it."
    ),
  },
  {
    id: "y24-a6",
    label: "A6",
    topic: "Size of an IEEE 754 double",
    question: p("How many bits long is a double-precision number under the IEEE-754 floating-point standard? (0.25 pt)"),
    solution: ans("64 bits, made up of 1 sign bit, 11 exponent bits and 52 mantissa bits, with a bias of 1023."),
  },
  {
    id: "y24-a7",
    label: "A7",
    topic: "Why two's complement is used",
    question: p("What is the most common representation used in most computers to store signed integer values and why? (0.25 × 2 = 0.5 pt)"),
    solution:
      ans("Two's complement.") +
      p(
        "There are two reasons. First, it has only one representation of zero, whereas sign magnitude and one's complement each have both a positive zero and a negative zero. Second, subtraction becomes addition, so the same adder circuit performs both operations and no separate subtraction hardware is required."
      ),
  },
  {
    id: "y24-b1",
    label: "B1",
    topic: "Ordering numbers in three bases",
    question: p("Order the numbers (1.1)<sub>10</sub>, (1.4)<sub>8</sub> and (1.5)<sub>16</sub> from smallest to biggest. (1 pt)"),
    solution:
      w(`
convert each one to decimal
(1.1)10  =  1 + 1/10    =  1.1
(1.4)8   =  1 + 4/8     =  1 + 0.5     =  1.5
(1.5)16  =  1 + 5/16    =  1 + 0.3125  =  1.3125

now order:  1.1  <  1.3125  <  1.5`) + ans("(1.1)<sub>10</sub> &lt; (1.5)<sub>16</sub> &lt; (1.4)<sub>8</sub>"),
  },
  {
    id: "y24-b2",
    label: "B2",
    topic: "Four base conversions",
    question: p(
      "Perform the indicated base conversions: (a) 20012<sub>3</sub> to base 10 (b) 298.796875<sub>10</sub> to base 2, using 6 places to the right of the binary point (c) 11000010.0111<sub>2</sub> to decimal (d) AC12<sub>16</sub> to octal. (0.25 × 4 = 1 pt)"
    ),
    solution:
      `<h5>(a) 20012<sub>3</sub> to base 10</h5>` +
      w(`
2 x 3^4  =  2 x 81  =  162
0 x 3^3  =  0 x 27  =    0
0 x 3^2  =  0 x  9  =    0
1 x 3^1  =  1 x  3  =    3
2 x 3^0  =  2 x  1  =    2
                      -----
                       167`) +
      ans("167<sub>10</sub>") +
      `<h5>(b) 298.796875<sub>10</sub> to base 2, six places after the point</h5>` +
      w(`
whole part 298, subtract powers of two
  298 - 256 =  42      256 = 2^8
   42 -  32 =  10       32 = 2^5
   10 -   8 =   2        8 = 2^3
    2 -   2 =   0        2 = 2^1
  bits 8, 5, 3 and 1 are set  ->  100101010

fraction .796875, multiply repeatedly by 2
  0.796875 x 2 = 1.59375   ->  1
  0.59375  x 2 = 1.1875    ->  1
  0.1875   x 2 = 0.375     ->  0
  0.375    x 2 = 0.75      ->  0
  0.75     x 2 = 1.5       ->  1
  0.5      x 2 = 1.0       ->  1    stop, fraction is 0
  read downward:  .110011`) +
      ans("100101010.110011<sub>2</sub>") +
      `<h5>(c) 11000010.0111<sub>2</sub> to decimal</h5>` +
      w(`
whole part 11000010
  = 128 + 64 + 2                   =  194
fraction .0111
  = 0/2 + 1/4 + 1/8 + 1/16
  = 0 + 0.25 + 0.125 + 0.0625      =  0.4375`) +
      ans("194.4375<sub>10</sub>") +
      `<h5>(d) AC12<sub>16</sub> to octal</h5>` +
      w(`
route through binary, which is faster than dividing
each hex digit becomes 4 bits
  A = 1010 ,  C = 1100 ,  1 = 0001 ,  2 = 0010
  giving  1010 1100 0001 0010
now regroup the same bits in 3s from the right
  1 010 110 000 010 010
  pad the left:  001 010 110 000 010 010
  convert:         1   2   6   0   2   2

check:  AC12H     = 40960 + 3072 + 16 + 2             = 44050
        126022(8) = 32768 + 8192 + 3072 + 0 + 16 + 2  = 44050`) +
      ans("126022<sub>8</sub>"),
  },
  {
    id: "y24-b3",
    label: "B3",
    topic: "97 and −66 in four 8-bit forms",
    question: p(
      "Represent the following decimal numbers in binary using 8-bit signed magnitude, one's complement, two's complement, and excess-127 representations: (a) 97 (b) −66. (0.25 × 8 = 2 pts)"
    ),
    solution:
      w(`
(a) 97, a positive number
    97 = 64 + 32 + 1  ->  01100001 in 8 bits
    for a positive number the signed magnitude, one's complement
    and two's complement forms are all the same as the plain binary
    excess-127:  97 + 127 = 224
                 224 = 128 + 64 + 32  ->  11100000

(b) -66, a negative number
    66 = 64 + 2  ->  01000010 in 8 bits
    signed magnitude : set the leftmost bit
                       01000010  ->  11000010
    one's complement : flip every bit
                       01000010  ->  10111101
    two's complement : one's complement plus one
                       10111101 + 1  =  10111110
    excess-127       : -66 + 127 = 61
                       61 = 32 + 16 + 8 + 4 + 1  ->  00111101`) +
      table(
        ["Representation", "(a) 97", "(b) −66"],
        [
          ["Signed magnitude", "01100001", "11000010"],
          ["One's complement", "01100001", "10111101"],
          ["Two's complement", "01100001", "10111110"],
          ["Excess-127", "11100000", "00111101"],
        ]
      ),
  },
  {
    id: "y24-b4",
    label: "B4",
    topic: "Reading 10011110 four ways",
    question: p(
      "What decimal value does the 8-bit binary number 10011110 have if: (a) it is interpreted as an unsigned number (b) it is on a computer using signed-magnitude representation (c) it is on a computer using one's complement representation (d) it is on a computer using two's complement representation. (0.25 × 4 = 1 pt)"
    ),
    solution:
      w(`
(a) unsigned
    128 + 16 + 8 + 4 + 2  =  158

(b) signed magnitude
    leftmost bit is 1, so the number is negative
    the magnitude is the remaining seven bits
    0011110 = 16 + 8 + 4 + 2 = 30
    value = -30

(c) one's complement
    leftmost bit is 1, so the number is negative
    flip every bit:  10011110  ->  01100001 = 97
    value = -97

(d) two's complement
    leftmost bit is 1, so the number is negative
    flip every bit:  01100001
    add one:         01100010 = 98
    value = -98`) + ans("(a) 158 &nbsp; (b) −30 &nbsp; (c) −97 &nbsp; (d) −98"),
  },
  {
    id: "y24-b5",
    label: "B5",
    topic: "Ranges of a 6-bit word",
    question: p(
      "Given a (very) tiny computer that has a word size of 6 bits, what are the smallest negative numbers and the largest positive numbers that this computer can represent in each of the following representations? (a) one's complement (b) two's complement. (0.25 × 4 = 1 pt)"
    ),
    solution:
      w(`
(a) one's complement in n bits
    range is  -(2^(n-1) - 1)  to  +(2^(n-1) - 1)
    with n = 6:  -(2^5 - 1)  to  +(2^5 - 1)
               =  -31        to   +31
    smallest negative  -31  =  100000
    largest positive   +31  =  011111
    note that zero has two forms, 000000 and 111111

(b) two's complement in n bits
    range is  -2^(n-1)  to  +2^(n-1) - 1
    with n = 6:  -32  to  +31
    smallest negative  -32  =  100000
    largest positive   +31  =  011111
    zero has only one form, so one extra negative value is available`) +
      ans("(a) −31 to +31 &nbsp; (b) −32 to +31"),
  },
  {
    id: "y24-b6",
    label: "B6",
    topic: "100.0 and 0.25 in a 14-bit float",
    question: p(
      "Assume we are using a simple model for floating-point representation as given as follows: the representation uses a 14-bit format, 5 bits for the exponent with a bias of 15, a normalized mantissa of 8 bits, and a single sign bit for the number. Show how the computer would represent the decimal numbers 100.0 and 0.25 using this floating-point format. (1 × 2 = 2 pts)"
    ),
    solution:
      p(
        "In this simple model the mantissa is normalized so that the radix point sits to the left of the first significant digit, giving the form 0.1xxxx × 2<sup>e</sup>. The leading 1 is stored, unlike in IEEE 754 where it is implied."
      ) +
      w(`
100.0
  sign      :  the number is positive, so 0
  to binary :  100 = 64 + 32 + 4  ->  1100100
  normalise :  0.1100100 x 2^7           so e = 7
  exponent  :  7 + 15 = 22
               22 = 16 + 4 + 2  ->  10110     in 5 bits
  mantissa  :  1100100 padded on the right to 8 bits  ->  11001000
  representation:  0  10110  11001000

0.25
  sign      :  the number is positive, so 0
  to binary :  0.25 = 1/4  ->  0.01
  normalise :  0.1 x 2^-1               so e = -1
  exponent  :  -1 + 15 = 14
               14 = 8 + 4 + 2  ->  01110      in 5 bits
  mantissa  :  1 padded on the right to 8 bits  ->  10000000
  representation:  0  01110  10000000`) +
      ans("100.0 = 0 10110 11001000 &nbsp; and &nbsp; 0.25 = 0 01110 10000000"),
  },
  {
    id: "y24-b7",
    label: "B7",
    topic: "Smallest positive 12-bit float",
    question: p(
      "Suppose we have just found yet another representation for floating-point numbers. Using this representation, a 12-bit floating point number has 1 bit for the sign of the number, 4 bits for the exponent, and 7 bits for the mantissa, which is normalized as in the simple model so that the first digit to the right of the radix point must be a 1. Numbers in the exponent are in signed two's complement representation. No bias is used, and there are no implied bits. Show the representation for the smallest positive number this machine can represent, and state what decimal number it equates to. (1 × 2 = 2 pts)"
    ),
    solution:
      w(`
to make the number as small as possible while still positive
  sign      :  positive, so 0
  exponent  :  4 bits in signed two's complement
               the most negative value is -2^(4-1) = -8
               -8 in 4-bit two's complement is 1000
               exponent field = 1000
  mantissa  :  must be normalized, so the first digit after the
               point has to be a 1. The smallest mantissa that
               satisfies this is 1000000, which is 0.1 in binary,
               that is 0.5 in decimal`) +
      table(
        ["sign", "exponent", "mantissa"],
        [["0", "1 0 0 0", "1 0 0 0 0 0 0"]]
      ) +
      w(`
the decimal value
  value = 0.1000000(2)  x  2^-8
        = 0.5           x  2^-8
        = 2^-1 x 2^-8
        = 2^-9
        = 1 / 512
        = 0.001953125`) +
      ans("0 1000 1000000, which equals 2<sup>−9</sup> = 1/512 = 0.001953125"),
  },
  mcq(
    "y24-c1",
    "C1",
    "Unauthorized access with malicious intent",
    "What is the term for the practice of gaining unauthorized access to computer systems and networks with malicious intent?",
    ["Privacy invasion", "Hacking", "Digital literacy", "Encryption"],
    1
  ),
  mcq(
    "y24-c2",
    "C2",
    "An example of a privacy breach",
    "Which of the following is an example of a privacy breach?",
    [
      "Sharing vacation photos on social media",
      "Encrypting sensitive emails",
      "Unauthorized access to personal medical records",
      "Deleting browser cookies",
    ],
    2,
    "A is a person's own choice about their own data. B and D actually protect privacy. Only C is access without permission to someone else's sensitive information."
  ),
  mcq(
    "y24-c3",
    "C3",
    "Purpose of a privacy policy",
    "What is the primary purpose of a privacy policy on a website or app?",
    [
      "To collect personal information from users",
      "To disclose sensitive information to third parties",
      "To inform users about how their data is collected and used",
      "To encourage users to share personal details",
    ],
    2
  ),
  mcq(
    "y24-c4",
    "C4",
    "Protecting personal data online",
    "Which of the following is a common method to secure personal data and protect online privacy?",
    [
      "Posting personal information on public forums",
      "Sharing login credentials with friends",
      "Using strong and unique passwords",
      "Providing credit card details to unknown websites",
    ],
    2,
    "The other three options are each a way of exposing personal data rather than protecting it."
  ),
  {
    id: "y24-c5",
    label: "C5",
    topic: "GUI and its features",
    question: p("What is GUI and what are its features?"),
    solution:
      p(
        "A Graphical User Interface, or GUI, is a system that allows the creation and manipulation of user interfaces using windows, menus, icons, dialog boxes, a mouse and a keyboard. Items are represented by icons, that is pictures, on the screen, which are easier to remember than the lengthy and complex commands required by a command-line system such as DOS. Examples include Microsoft Windows, the Macintosh toolbox and X-Windows.",
        "<b>Features:</b>"
      ) +
      ol([
        "Items are represented by pictures and icons rather than typed commands",
        "User friendly, so it is easier to learn and to use",
        "Multitasking, more than one application can run at a time",
        "Multithreading, data can be transferred between different applications",
        "Common menus, the same commands are used across all software",
        "Windowing capability, the screen is divided into independent regions",
        "Dialog boxes collect information from the user and display alerts",
        "A ready-made on-screen menu system and on-line help for each step",
        "Bit-mapped WYSIWYG display, what you see is what you get",
      ]),
  },
  {
    id: "y24-c6",
    label: "C6",
    topic: "Define Windows",
    question: p("Define the Term Windows."),
    solution: p(
      "Windows is a multitasking graphical user interface operating system developed and marketed by Microsoft Corporation. As an operating system it performs input and output management, resource management, data management and process management, and it provides the user interface. The first version was released in November 1985 and the most recent is Windows 11, released in October 2021.",
      "A second and narrower meaning also earns the mark. A window is the basic unit of display for Windows and all its applications. A window can represent a folder on the desktop, a running programme, a document, or a dialog box within a programme."
    ),
  },
  {
    id: "y24-c7",
    label: "C7",
    topic: "Four types of computers and their use",
    question: p("Name 4 different types of computers and give their use."),
    solution:
      table(
        ["Type of computer", "Use"],
        [
          [
            "Supercomputer",
            "The most powerful and most expensive type. Used for weather forecasting, climate modelling, nuclear and scientific simulation, and molecular research",
          ],
          [
            "Mainframe computer",
            "Used by large organisations that handle very large volumes of data at once, such as banks, insurance companies, a national census, airline reservation systems and bulk transaction processing",
          ],
          [
            "Minicomputer, also called midrange",
            "Used by medium-sized businesses and by single departments within a larger organisation, for process control, small-scale scientific work and departmental servers",
          ],
          [
            "Microcomputer, also called the personal computer",
            "Used by individuals for everyday work. Desktops and laptops for office tasks, study, browsing and entertainment",
          ],
          [
            "Embedded computer",
            "A computer built into another device in order to control it, found in washing machines, cars, medical equipment and phones",
          ],
        ]
      ) +
      p("Only four are required. The first four in the table are the safest set to give, because they form the classic ordering by size and power."),
  },
  {
    id: "y24-c8",
    label: "C8",
    topic: "Case study: privacy and ethics online",
    question: p("Write a short Case Study on the Violation of Privacy and Ethics on an Online Incident or on Social Media. (3 marks)"),
    solution: p(
      "<b>Case: a fitness application exposes user location data</b>",
      "<b>What happened.</b> A widely used fitness tracking application published a global heat map built from the GPS routes recorded by its users. The company presented the data as anonymous and aggregated. However, in sparsely populated areas the routes were distinctive enough that individual users could be identified, and the daily running routes of staff at military and government sites revealed the layout of those sites and the patrol patterns around them.",
      "<b>What was violated.</b> Privacy was violated, because a record of a person's location over time is sensitive personal data and users did not expect it to be published in any form. Informed consent was violated, because sharing was switched on by default and the consequences were never explained in plain language. Security was compromised, because the aggregated map revealed information that placed people at physical risk.",
      "<b>Who was harmed.</b> Individual users whose homes and daily routines could be inferred from their routes, and personnel at sensitive sites whose safety was put at risk.",
      "<b>Ethical analysis.</b> Under utilitarianism the modest benefit of an interesting public map is clearly outweighed by the risk to a large number of people. Under deontology the company had a duty to protect the data entrusted to it, regardless of how useful the map might be. Under rights-based ethics the users held a right to privacy which was not respected.",
      "<b>What should have been done.</b> Sharing should have been switched off by default and offered as an opt-in. Users should have been told in plain language exactly what would be published. The company should have tested whether individuals could be re-identified from the aggregated data before releasing it, and should have excluded sensitive locations entirely."
    ),
  },
];

const Y23_STATEMENTS: { s: string; a: string }[] = [
  {
    s: "The Von-Neumann architecture is faster than the Harvard architecture because it stores data and instruction in the same memory block.",
    a: "<b>NO.</b> The Harvard architecture is the faster one. Sharing a single memory and a single bus means an instruction and its data cannot be fetched at the same time, which is known as the von Neumann bottleneck. Harvard uses separate memories and separate buses so both can be fetched simultaneously.",
  },
  {
    s: "In the Harvard Architecture, some of the registers are stored out of the CPU.",
    a: "<b>NO.</b> Registers are held inside the CPU in both architectures. What the Harvard architecture separates is instruction memory from data memory, not the registers.",
  },
  {
    s: "The Arithmetic and Logic Unit of the CPU can only carry out addition and subtraction operations; it is the Control Unit that manages logical comparisons like greater than, and less than operators.",
    a: "<b>NO.</b> The ALU performs arithmetic and logic operations, and logical comparisons such as greater than and less than are exactly what the logic half of the ALU does. The Control Unit fetches and decodes instructions and directs the other units; it does not perform comparisons.",
  },
  {
    s: "The clock rate of the CPU is a measure of how many instructions a computer carries in a second, and it is measured in milliseconds.",
    a: "<b>NO.</b> Both parts are wrong. The clock rate counts cycles per second, not instructions, because a single instruction may take several cycles. And it is measured in hertz, that is MHz or GHz, not in milliseconds.",
  },
  {
    s: "A single line of code in a high-level programming language compiles to one or more lines of machine code, while assembly language instructions compile to exactly one machine instruction.",
    a: "<b>YES.</b> Both parts are true. A high-level statement expands into one or many machine instructions, whereas assembly language maps one to one onto machine instructions.",
  },
  {
    s: "Complex Instruction Set Computers (CISC) typically have hundreds of instructions, and all instructions have the same bit length.",
    a: "<b>NO.</b> The first part is true but the second is false. CISC instructions are variable in length. Fixed-length instructions are a defining feature of RISC, not CISC.",
  },
  {
    s: "Type-2 Virtualization is better than the other type because a hypervisor is installed directly on the metal.",
    a: "<b>NO.</b> It is Type-1 virtualization whose hypervisor is installed directly on the bare metal. A Type-2 hypervisor runs on top of a host operating system, which adds overhead and makes it generally slower.",
  },
];
const Y23_STATEMENT_TOPICS = [
  "Von Neumann versus Harvard speed",
  "Registers in the Harvard architecture",
  "What the ALU does",
  "What clock rate measures",
  "High-level versus assembly code",
  "CISC instruction length",
  "Type-1 versus Type-2 virtualization",
];

const Y23: CaItem[] = [
  mcq(
    "y23-a1",
    "A1",
    "Third-generation computers",
    "The main technological improvement in third generation computers was:",
    ["Vacuum tube", "Transistor", "Integrated Circuit", "Microprocessor"],
    2,
    "The sequence is first generation vacuum tubes, second transistors, third integrated circuits, fourth microprocessors."
  ),
  mcq(
    "y23-a2",
    "A2",
    "System software",
    "What is system software?",
    [
      "Software that governs the computer system",
      "Software that allows a user to perform tasks",
      "Software that controls peripheral devices",
      "Software that the CPU uses to fetch instructions",
    ],
    0,
    "B describes application software. C describes device drivers, which are only one part of system software, not the whole of it."
  ),
  mcq(
    "y23-a3",
    "A3",
    "Operating system",
    "What is an operating system?",
    [
      "A suite of programs that manages and controls a computer",
      "A suite of programs that performs backups",
      "A suite of programs that allows a user to perform tasks",
      "Administrative programs",
    ],
    0
  ),
  mcq(
    "y23-a4",
    "A4",
    "The digital divide",
    "Which type of concern would the digital divide be classed under?",
    ["Ethical", "Cultural", "Environmental", "Legal"],
    1,
    "The digital divide is about unequal access between groups in society, which makes it a cultural and social concern rather than a legal or environmental one."
  ),
  mcq(
    "y23-a5",
    "A5",
    "Public safety",
    "Which type of concern would public safety be classed under?",
    ["Ethical", "Cultural", "Environmental", "Legal"],
    0,
    "Public safety is about right and wrong conduct and the duty of care owed to people, which places it under ethics."
  ),
  mcq(
    "y23-a6",
    "A6",
    "Data Protection Act principle",
    "Which of the following is a principle of the Data Protection Act 1998/2018?",
    [
      "Personal data must be kept for 10 years",
      "Personal data must be fairly and lawfully processed",
      "Personal data must be stored in Cameroon",
      "Personal data can be accessed and modified by all",
    ],
    1,
    "The Act says data must be kept no longer than necessary, so A states the opposite. D would defeat the purpose of the Act entirely."
  ),
  mcq(
    "y23-a7",
    "A7",
    "An environmental issue",
    "Which of the following issues may be regarded as an environmental issue?",
    [
      "Having a new smartphone every couple of years",
      "The moving of many technology-based jobs abroad",
      "The digital divide that exists between those people who can use technology and are comfortable doing so, and those who are not",
      "Hacking into someone's bank account",
    ],
    0,
    "Frequent replacement of devices creates electronic waste and consumes raw materials and energy. B is economic, C is cultural, D is legal and ethical."
  ),
  mcq(
    "y23-a8",
    "A8",
    "What copyright is",
    "What is copyright?",
    [
      "A legal means of ensuring that people can distribute media",
      "A legal means of revealing Personal data",
      "A legal means of ensuring that creators can protect what they create",
      "A legal means of ensuring that people can stream videos online",
    ],
    2
  ),
  mcq(
    "y23-a9",
    "A9",
    "Copyright, Designs and Patents Act",
    "What is the purpose of the Copyright, Designs and Patents Act 1988?",
    ["To allow people to share media", "To protect peoples' creations", "To deter people from sharing data", "To protect Personal Data"],
    1,
    "Take care with D. Protecting personal data is the Data Protection Act, which is a different piece of legislation."
  ),
  mcq(
    "y23-a10",
    "A10",
    "Proprietary software",
    "Which of these statements about proprietary software is true?",
    [
      "It is copyrighted and cannot be freely distributed",
      "It has no copyright and cannot be freely distributed",
      "It has no copyright and can be freely distributed",
      "It is copyrighted but can be freely distributed",
    ],
    0,
    "Proprietary means the owner holds the copyright and restricts redistribution. Option C describes public domain software."
  ),
  {
    id: "y23-b1",
    label: "B1",
    topic: "Ethics of the real-time blogging device",
    question: p(
      "The University of Buea expects all their students to wear a Student Emergency Response System (SERS) device. The Computer Science department has developed a real-time blogging device, worn around the neck, which monitors bodily signs such as blood pressure and heart rate as well as recording audio and video. The data collected are sent to a server and can be accessed via a website. The board is considering using the real-time blogging system instead of the SERS so that staff can monitor the student's data, and is also considering not telling the students about the new device. Discuss any ethical, legal and cultural issues that the board should consider before introducing the new real-time blogging devices. (6 mks)"
    ),
    solution:
      `<h5>Ethical issues</h5>` +
      p(
        "<b>Informed consent.</b> The board is considering not telling students about the new device. Monitoring people without their knowledge is a clear ethical breach, because a person cannot agree to something they have not been told about.",
        "<b>Proportionality.</b> The original SERS has one narrow purpose, summoning help. The new device continuously records blood pressure, heart rate, audio and video. That is far more data than the stated safety purpose requires.",
        "<b>Function creep and trust.</b> A device introduced for student safety is being repurposed into a surveillance tool for staff. This damages the relationship of trust between the university and its students."
      ) +
      `<h5>Legal issues</h5>` +
      p(
        "<b>Data protection.</b> Blood pressure and heart rate are health data, which is sensitive personal data and attracts the strongest legal protection. Processing it without a lawful basis and without informing the data subject breaches data protection law.",
        "<b>Recording of audio and video.</b> This captures identifiable people, possibly including members of the public who never agreed, which creates further legal exposure.",
        "<b>Security and liability.</b> Because the data is sent to a server and exposed on a website, the university becomes liable for any breach and must apply security measures, access controls and a retention limit."
      ) +
      `<h5>Cultural issues</h5>` +
      p(
        "<b>Differing expectations of privacy.</b> Some students and communities will find constant body monitoring and recording unacceptable on religious, cultural or personal grounds.",
        "<b>Power imbalance.</b> Students may feel unable to refuse a device the university requires them to wear, so any consent obtained would not be freely given.",
        "<b>Chilling effect.</b> People behave differently when they know they are recorded, which would change campus life and discourage free discussion.",
        "<b>Recommendation.</b> The board should inform students fully, obtain genuine and freely given consent, collect only the minimum data the safety purpose requires, and publish a clear policy on who may access the data and how long it is kept."
      ),
  },
  {
    id: "y23-b2",
    label: "B2",
    topic: "Turing machine parts in a modern computer",
    question: p(
      "The mathematician Alan Turing proposed the concept of a Universal Turing Machine in 1936 as a theoretical model of computation. The Turing Machine consisted of four logical elements – a tape, head, state register, and action table. What would be considered analogous components in a modern-day computer that allow it to perform calculations and run programs? (2 mks)"
    ),
    solution: table(
      ["Turing's machine", "Modern-day computer", "Reason"],
      [
        ["tape", "Memory, that is RAM together with secondary storage", "The tape is where symbols are stored and can be read back and overwritten"],
        [
          "head",
          "The CPU's read and write access to memory, by way of the address and data buses",
          "The head is the part that actually reads and writes at one position at a time",
        ],
        ["state register", "The CPU registers, in particular the program counter and the status register", "These hold the machine's current state"],
        [
          "action table",
          "The stored program, that is the instructions together with the CPU's instruction set",
          "The rules that decide what to do for each combination of state and symbol",
        ],
      ]
    ),
  },
  {
    id: "y23-b3",
    label: "B3",
    topic: "Fill in the booting process",
    question: p(
      "The following is a brief description of the computer's booting process. Fill in the blank spaces with appropriate words chosen from the following list: Setup, Random Access Memory, Basic Input/Output System, Power-On Self Test, Read Only Memory, operating system kernel, Secondary Storage. (2 mks)"
    ),
    solution:
      table(
        ["Item", "Answer", "Reason"],
        [
          ["i", "Read Only Memory", "On power-up the first instructions must already be present in non-volatile memory, because RAM is empty"],
          ["ii", "Basic Input/Output System", "The BIOS is the firmware held in ROM. It runs the Power-On Self Test and then loads the bootloader"],
          ["iii", "operating system kernel", "The bootloader's job is to fetch the kernel from the hard drive, SSD or USB drive"],
          ["iv", "Random Access Memory", "Code must be resident in RAM in order to execute, so drivers and services are loaded there"],
        ]
      ) +
      p(
        "<b>Read as a sentence:</b> the CPU begins to execute instructions stored in Read Only Memory. The Basic Input/Output System stored in ROM runs some initial hardware checks and bootloader loading. The bootloader loads the operating system kernel from a hard drive, SSD, USB drive or other secondary storage. Then core OS drivers and services are loaded into Random Access Memory."
      ),
  },
  {
    id: "y23-e1-1",
    label: "E1.1",
    topic: "Binary 1000011000 to hexadecimal",
    question: p("Convert the binary number 1000011000 into hexadecimals."),
    solution:
      w(`
group in 4s from the right:      10 0001 1000
pad the left with zeros:       0010 0001 1000
convert each group:               2    1    8

check:  1000011000 = 512 + 16 + 8 = 536
        218H = 2x256 + 1x16 + 8 = 512 + 16 + 8 = 536`) + ans("218<sub>16</sub>"),
  },
  {
    id: "y23-e1-2",
    label: "E1.2",
    topic: "A2F to decimal",
    question: p("Convert A2F into decimals."),
    solution:
      w(`
A = 10,  2 = 2,  F = 15
10 x 16^2  =  10 x 256  =  2560
 2 x 16^1  =   2 x 16   =    32
15 x 16^0  =  15 x 1    =    15
                           ------
                            2607`) + ans("2607<sub>10</sub>"),
  },
  {
    id: "y23-e1-3",
    label: "E1.3",
    topic: "29.25 to binary",
    question: p("Convert 29.25D into binary."),
    solution:
      w(`
whole part 29, divide repeatedly by 2
  29 / 2  ->  14  r 1
  14 / 2  ->   7  r 0
   7 / 2  ->   3  r 1
   3 / 2  ->   1  r 1
   1 / 2  ->   0  r 1    stop, quotient is 0
  read the remainders upward:  11101

fraction .25, multiply repeatedly by 2
  0.25 x 2 = 0.5   ->  0
  0.5  x 2 = 1.0   ->  1    stop, fraction is 0
  read the whole numbers downward:  .01`) + ans("11101.01<sub>2</sub>"),
  },
  {
    id: "y23-e1-4",
    label: "E1.4",
    topic: "−20 in sign magnitude and 2's complement",
    question: p("Using an 8 bits-representation, what is the integer number −20 in: (a) Sign magnitude notation (b) 2's complement notation"),
    solution:
      w(`
first write +20 in 8 bits
  20 = 16 + 4
  bits 4 and 2 are set  ->  00010100

(a) sign magnitude
    keep the magnitude and set the leftmost bit to 1
    00010100  ->  10010100

(b) two's complement
    flip every bit of 00010100  ->  11101011
    add one                     ->  11101100`) + ans("(a) 10010100 &nbsp; (b) 11101100"),
  },
  {
    id: "y23-e1-5",
    label: "E1.5",
    topic: "−11101000000 in IEEE 754 single precision",
    question: p("Using the IEEE 754 with single precision in normalized form, what is the value for the binary number −11101000000."),
    solution:
      w(`
step 1   sign bit
         the number is negative, so sign = 1
step 2   normalise to the form 1.xxxx x 2^e
         11101000000.0 has 11 digits before the point
         move the point 10 places to the left
         = 1.1101000000 x 2^10        so e = 10
step 3   exponent field = e + bias, and the bias is 127
         10 + 127 = 137
         137 = 128 + 8 + 1  ->  10001001    in 8 bits
step 4   mantissa = the digits after the point
         the leading 1 is implied and is not stored
         1101000000 padded with zeros to 23 bits
         = 11010000000000000000000
step 5   assemble as  sign | exponent | mantissa`) +
      ans("1 &nbsp; 10001001 &nbsp; 11010000000000000000000") +
      p("For reference the number in decimal is −1856, since 11101000000<sub>2</sub> = 1024 + 512 + 256 + 64 = 1856."),
  },
  ...Y23_STATEMENTS.map(
    (st, i): CaItem => ({
      id: `y23-e2-${i + 1}`,
      label: `E2.${i + 1}`,
      topic: Y23_STATEMENT_TOPICS[i],
      question:
        (i === 0
          ? p(
              "Answer yes or no to the following. Justify your response if the answer is No. All components of the statement must be true for the response to be a yes. (1 × 7 = 7 marks)"
            )
          : "") + p(`<b>Statement ${i + 1}.</b> ${st.s}`),
      solution: p(st.a),
    })
  ),
];

const Y22B: CaItem[] = [
  mcq(
    "y22b-a1",
    "A1",
    "What software is",
    "Which of the following best describe software",
    [
      "Physical components that make up a computer system",
      "The hardware that carries out the instructions of a computer program",
      "The language used by the CPU",
      "A sequence of instructions that controls a computer",
    ],
    3,
    "A and B describe hardware. C describes machine language. Software is the set of instructions itself."
  ),
  mcq(
    "y22b-a2",
    "A2",
    "What controls the computer",
    "...... controls the way in which the computer system functions and provides a means by which users can interact with the computer",
    ["The platform", "The operating system", "Application software", "The motherboard"],
    1,
    "The operating system both manages the hardware and provides the user interface. Application software performs user tasks but does not control the system."
  ),
  mcq(
    "y22b-a3",
    "A3",
    "The system call interface",
    "The basic interface of the operating system which defines the system as a virtual machine is:",
    ["User Interface", "Application Programming Interface", "System call interface", "Administrative interface"],
    2,
    "System calls are what make the raw hardware appear to a program as a clean, abstract machine. That abstraction is the virtual machine view."
  ),
  mcq(
    "y22b-a4",
    "A4",
    "What makes a CPU fast",
    "Three (3) characteristics of the CPU that determines how fast the Computer system works:",
    ["RAM size, Clock Speed, Cores", "Cache size, Clock Speed, Cores", "ROM size, RAM size, Clock Speed", "Operating system, Clock Speed, Cores"],
    1,
    "The question asks for characteristics of the CPU. RAM and ROM sit outside the CPU and the operating system is software. Only cache size, clock speed and number of cores are properties of the CPU itself."
  ),
  mcq(
    "y22b-a5",
    "A5",
    "Computer privacy",
    "Which of the following controls what the public can see or inquire about you, if stored in a computer system, but allows you to verify or correct the information so stored?",
    ["Computer Security", "Computer Privacy", "Computer Correctness", "Computer Ethics"],
    1,
    "Privacy is about who may see your data and your right to inspect and correct it. Security is about protecting systems from attack."
  ),
  mcq(
    "y22b-a6",
    "A6",
    "Is it a computer crime?",
    "Joe hacked into Dan's online bank account and withdrew and returned money Dan stole from Jane. Joe accessed the account by supplying the information Dan normally gives. Did Joe commit a computer crime?",
    [
      "Yes. Joe used computing skills to access an account he shouldn't",
      "No. Joe simply helped Jane to get what was rightfully hers",
      "Yes. Joe illegally accessed an account, whether or not he used computers",
      "No. Joe supplied all the information to legally access the account",
    ],
    2,
    "Joe used Dan's own credentials, so no special skill was involved and A misstates the reason. A good motive does not make access lawful, so B is wrong. Having the credentials is not the same as having permission, so D is wrong. The offence is the unauthorised access itself."
  ),
  mcq(
    "y22b-a7",
    "A7",
    "A citizen of the world",
    "Given today's technology and his immediate access to resources all over the world, Ngene says he is a citizen of the world, not just a Cameroonian. We agree with him because:",
    [
      "His computing skills are useful all over the world",
      "He accesses facilities all over the world, as would one living in those countries",
      "His computing skills gives him the same rights as citizens in other countries",
      "His computing skills gives him extra advantages over ordinary Cameroonians",
    ],
    1,
    "Technology gives him the same access as a resident would have. It does not grant legal citizenship rights, which rules out C, and the claim is about reach rather than privilege, which rules out D."
  ),
  mcq(
    "y22b-a8",
    "A8",
    "Batch processing",
    "Mojoko submitted many programs and their data at a Computing Centre, to later get her results online. Processing her work must have required:",
    ["An online processing system", "A real-time processing system", "A transaction processing system", "A batch processing system"],
    3,
    "Jobs and their data are collected together, processed later without user interaction, and the results are collected afterwards. That is the definition of batch processing."
  ),
  mcq(
    "y22b-a9",
    "A9",
    "Not a peripheral",
    "Which of the following may NOT be considered as peripheral device:",
    ["Hard drive", "Motherboard", "Network adapter", "Expansion cards"],
    1,
    "A peripheral is a device attached to the computer system. The motherboard is the system itself, the board everything else attaches to."
  ),
  mcq(
    "y22b-a10",
    "A10",
    "The help desk's interface",
    "Bisi's computer Help Desk uses many software platforms. She has to quickly respond to frequently asked questions from her clients, so she most probably uses:",
    ["A Graphical User Interface (GUI)", "A Command Line Interface (CLI)", "A Linux Interface", "An MS Windows Interface"],
    1,
    "Two clues decide it. She works across many platforms, and she must be quick. A command line works the same way on every platform and is faster for a trained operator than navigating menus. C and D each name one single platform, which contradicts the stem."
  ),
];

const conv = "Convert the following numbers to the bases specified. Select only one answer.";
const comp = "Determine the 9's complement, 10's complement, 1's complement and 2's complement representations of the number 25<sub>10</sub>.";
function y22mcq(letter: string, topic: string, stem: string, options: string[], right: number, work: string): CaItem {
  const item = mcq(`y22-1${letter}`, `1(${letter})`, topic, stem, options, right);
  return { ...item, solution: w(work) + item.solution };
}

const Y22: CaItem[] = [
  y22mcq("a", "Binary 11010101 to octal", `${conv}<br>(a) 11010101<sub>2</sub> to octal`, ["325", "521", "213", "523"], 0, `
group in 3s from the right:   11 010 101
pad the left with zeros:     011 010 101
convert each group:            3   2   5`),
  y22mcq("b", "Binary 11010101 to hexadecimal", "(b) 11010101<sub>2</sub> to hexadecimal", ["523", "5D", "213", "D5"], 3, `
group in 4s from the right:  1101 0101
convert each group:            D    5`),
  y22mcq("c", "120 to binary", "(c) 120<sub>10</sub> to binary", ["1010000", "1011000", "0111100", "1111000"], 3, `
120 - 64 = 56      64 = 2^6
 56 - 32 = 24      32 = 2^5
 24 - 16 =  8      16 = 2^4
  8 -  8 =  0       8 = 2^3
bits 6, 5, 4, 3 are set`),
  y22mcq("d", "Octal 745 to binary", "(d) 745<sub>8</sub> to binary", ["101100111", "1011101001", "111100101", "111001011"], 2, `
each octal digit becomes 3 bits
  7 = 111
  4 = 100
  5 = 101`),
  y22mcq("e", "110110.11 to decimal", "(e) 110110.11<sub>2</sub> to decimal", ["54.75", "54.875", "108.75", "108.875"], 0, `
whole part 110110 = 32 + 16 + 4 + 2 = 54
fraction .11      = 1/2 + 1/4 = 0.5 + 0.25 = 0.75`),
  y22mcq("f", "Hex 3AB to binary", "(f) 3AB<sub>16</sub> to binary", ["1010101111", "1110101011", "1011101011", "1111101010"], 1, `
each hex digit becomes 4 bits
  3 = 0011
  A = 1010
  B = 1011
giving 0011 1010 1011, drop the leading zeros`),
  y22mcq("g", "9's complement of 25", `${comp}<br>(g) 9's complement`, ["74", "75", "974", "975"], 0, `
subtract each digit from 9:  99 - 25 = 74`),
  y22mcq("h", "10's complement of 25", "(h) 10's complement", ["74", "75", "974", "975"], 1, `
9's complement plus one:  74 + 1 = 75`),
  y22mcq("i", "1's complement of 25", "(i) 1's complement", ["11001", "00110", "10101", "01010"], 1, `
25 in 5 bits = 11001
flip every bit = 00110`),
  y22mcq("j", "2's complement of 25", "(j) 2's complement", ["11010", "00111", "10110", "01011"], 1, `
1's complement = 00110
add one        = 00111`),
  {
    id: "y22-2-1",
    label: "2.1",
    topic: "Bits to encode 356 instructions",
    question: p("A computer system's instruction set comprises 356 instructions. What is the minimum number of bits required to encode these instructions?"),
    solution:
      w(`
find the smallest n for which 2^n is greater than or equal to 356
  2^8 = 256   too small
  2^9 = 512   large enough`) + ans("9 bits"),
  },
  {
    id: "y22-2-2",
    label: "2.2",
    topic: "Largest unsigned 5-bit value",
    question: p("What is the largest base 10 integer value that can be represented using an unsigned 5-bit binary number?"),
    solution:
      w(`
largest unsigned value in n bits = 2^n - 1
  2^5 - 1 = 32 - 1 = 31
  in binary this is 11111`) + ans("31"),
  },
  {
    id: "y22-2-3",
    label: "2.3",
    topic: "Magnitudes of 0111 and 1111",
    question: p("The following two numbers are signed two's complement numbers: 0111 and 1111. Determine their magnitudes in decimal."),
    solution:
      w(`
0111
  leftmost bit is 0, so the number is positive
  0111 = 4 + 2 + 1 = 7
  value +7, magnitude 7

1111
  leftmost bit is 1, so the number is negative
  flip the bits   = 0000
  add one         = 0001 = 1
  value -1, magnitude 1`) + ans("0111 is +7, magnitude 7. 1111 is −1, magnitude 1."),
  },
  {
    id: "y22-2-4",
    label: "2.4",
    topic: "−2 − 6 and 5 − 6 in 4-bit two's complement",
    question: p("Use 4-bit two's complement arithmetic to evaluate the following decimal arithmetic expressions: −2 − 6 and 5 − 6."),
    solution:
      w(`
-2 - 6
  write -2 :  +2 = 0010, flip = 1101, add one = 1110
  write -6 :  +6 = 0110, flip = 1001, add one = 1010
      1110
    + 1010
    -------
     11000     there is a carry out of the leftmost column, discard it
      1000
  read back: leftmost bit 1 so negative
             flip = 0111, add one = 1000 = 8`) +
      ans("1000, which is −8") +
      w(`
5 - 6
  write +5 :  0101
  write -6 :  1010   as found above
      0101
    + 1010
    -------
      1111     no carry out
  read back: leftmost bit 1 so negative
             flip = 0000, add one = 0001 = 1`) +
      ans("1111, which is −1") +
      p("Both answers lie inside the 4-bit signed range of −8 to +7, so neither overflows."),
  },
];

/** Every item, papers in book order (newest first). */
export const CA_ITEMS: CaItem[] = [...Y24, ...Y23, ...Y22B, ...Y22];

export const CA_BY_PAPER: Record<string, CaItem[]> = { y24: Y24, y23: Y23, y22b: Y22B, y22: Y22 };

window.articles = [
  {
    slug: "arrays",
    category: "DSA",
    title: "Arrays: the building blocks",
    description: "Learn how indices shape your solution, then put them to work with a fixed-size sliding window.",
    minutes: 5,
    videoId: "",
    sections: [
      {
        heading: "What an index gives you",
        paragraphs: [
          "An array keeps values in order and lets you look up a value by its position. In a zero-indexed array of length n, the valid positions run from 0 through n − 1. Track the position when the problem asks where something happened, and track the value when it asks what happened.",
          "For a typical dense dynamic array, reading or replacing an entry by index takes O(1) time. Appending is usually amortized O(1), since occasional resizing copies the backing storage. An insertion near the front can take O(n) time because it shifts later entries.",
        ],
      },
      {
        heading: "Recognize what overlaps",
        paragraphs: [
          "Suppose you want the largest sum of k consecutive values. You could sum each window from scratch, but adjacent windows share k − 1 values. Keep the sum and update it by subtracting the departing value and adding the arriving one.",
          "For [4, −2, 7, 3] with k = 2, the first window sums to 2. The next drops 4 and adds 7, giving 5. The final window drops −2 and adds 3, giving 10.",
        ],
        code: `function maxWindowSum(values, k) {
  if (!Number.isInteger(k) || k < 1 || k > values.length) {
    throw new RangeError("k must be between 1 and the array length");
  }

  let sum = 0;
  for (let i = 0; i < k; i++) {
    sum += values[i];
  }

  let best = sum;
  for (let right = k; right < values.length; right++) {
    sum += values[right] - values[right - k];
    best = Math.max(best, sum);
  }

  return best;
}`,
      },
      {
        heading: "Verify the boundaries",
        paragraphs: [
          "Initializing best from the first window handles inputs whose sums are all negative. With k = 1 the answer is the largest entry, and with k equal to the array length the first window is the only candidate. Both cases work without any special handling after validation.",
          "The first loop touches k values and the second runs n − k times. The total is O(n) time and O(1) extra space.",
        ],
      },
    ],
  },
  {
    slug: "two-sum",
    problemUrl: "https://leetcode.com/problems/two-sum/",
    category: "LeetCode",
    title: "Two Sum",
    description: "Turn a nested search into one pass by remembering the values you’ve already seen.",
    minutes: 4,
    videoId: "",
    sections: [
      {
        heading: "Start with the pair",
        paragraphs: [
          "Given an array and a target, return the indices of two distinct entries whose values add up to the target. Checking every pair works in O(n²) time. To speed it up, ask what value would complete the pair for the entry you’re currently visiting.",
          "For a current value x, the complement is target − x. A map from each previously seen value to its index tells you whether you’ve already passed that complement.",
        ],
      },
      {
        heading: "Look up before you insert",
        paragraphs: [
          "Check for the complement before storing the current entry. This guarantees that any returned index belongs to an earlier position. For [3, 3] with target 6, the first 3 goes into the map and the second 3 finds it.",
        ],
        code: `function twoSum(values, target) {
  const seen = new Map();

  for (let i = 0; i < values.length; i++) {
    const value = values[i];
    const complement = target - value;
    if (seen.has(complement)) {
      return [seen.get(complement), i];
    }
    seen.set(value, i);
  }

  return [];
}`,
      },
      {
        heading: "Why one pass is enough",
        paragraphs: [
          "When you reach the later index of a valid pair, the earlier value has already been stored. Even if an equal value replaced an earlier entry in the map, its index is still distinct from the current index and forms a valid pair.",
          "With expected constant-time hash-map operations, the scan takes O(n) expected time and O(n) extra space. The empty result is a fallback for callers that allow inputs without a pair.",
        ],
      },
    ],
  },
  {
    slug: "think-out-loud",
    category: "Interviews",
    title: "How to think out loud",
    description: "Walk an interviewer through the decisions that shape your solution, from constraints to a dry run.",
    minutes: 3,
    videoId: "",
    sections: [
      {
        heading: "Define a successful answer",
        paragraphs: [
          "After reading the prompt, restate what the function receives and returns. Ask about an assumption when its answer would affect the implementation. For Two Sum, it matters whether the output is indices or values, whether equal values can appear, and whether a pair is guaranteed.",
          "Use a small example to make your understanding concrete. With [3, 3] and target 6, the answer is [0, 1]. That example gives you an edge case you can revisit when checking your code.",
        ],
      },
      {
        heading: "Explain the decision you’re making",
        paragraphs: [
          "State a working approach and name its bottleneck. If all pairs take too long to check, say what information would let you decide faster. In this case, recording prior values lets you answer one direct question per entry. Have I seen the value that would complete this pair?",
          "Before typing, state what stays true during the loop. For this approach, when I process an index, every value in my map comes from an earlier index. That sentence gives the interviewer a clear reason for the order of the two operations.",
        ],
      },
      {
        heading: "Finish with a dry run",
        paragraphs: [
          "Trace one example that tests your main decision. Walk through both 3s and show the map right before each lookup. Then give the time and space costs, including any assumption about the data structure you chose.",
        ],
        list: [
          "Clarify a constraint that changes your approach.",
          "Describe the tradeoff that led to your solution.",
          "Trace a case that exercises a boundary or invariant.",
        ],
      },
    ],
  },
  {
    slug: "stacks",
    category: "DSA",
    title: "Stacks and unfinished work",
    description: "Use last-in, first-out order to track work that needs to be resolved in reverse.",
    minutes: 3,
    videoId: "",
    sections: [
      {
        heading: "Start with what needs to happen next",
        paragraphs: [
          "A stack gives you access to the most recently added item. Push adds an item, pop removes the newest item, and peek reads it. An array makes a good stack when you use its end for all three operations.",
          "Stacks fit nested or reversible work. When checking brackets, the most recent opening bracket must close first. In an undo history, the most recent action is the first one you reverse.",
        ],
      },
      {
        heading: "Decide what an entry means",
        paragraphs: [
          "An entry should contain the information you’ll need when you pop it. For bracket matching, the expected closing character is enough. If you also want to report the location of an unmatched opening bracket, store its index alongside that character.",
          "When reviewing a stack algorithm, test the empty case, a single item, and several items that pop in succession. If each of n items is pushed and popped at most once and each operation takes amortized O(1) time, those stack operations cost O(n) total.",
        ],
      },
    ],
  },
  {
    slug: "valid-parentheses",
    problemUrl: "https://leetcode.com/problems/valid-parentheses/",
    category: "LeetCode",
    title: "Valid Parentheses",
    description: "Check bracket order with a stack that records exactly which closing character comes next.",
    minutes: 4,
    videoId: "",
    sections: [
      {
        heading: "Keep the next expected closer on top",
        paragraphs: [
          "Given a string containing only parentheses, square brackets, and braces, determine whether every bracket pair closes in the correct order. Counts alone miss cases such as ([)], where the pairs cross.",
          "When you read an opener, push its matching closer. When you read a closer, compare it with the value you pop. An empty stack yields undefined, so a closing bracket with no opener fails the same comparison as a mismatched closer.",
        ],
        code: `function isValid(text) {
  const closerFor = new Map([
    ["(", ")"],
    ["[", "]"],
    ["{", "}"],
  ]);
  const expected = [];

  for (const char of text) {
    if (closerFor.has(char)) {
      expected.push(closerFor.get(char));
    } else if (expected.pop() !== char) {
      return false;
    }
  }

  return expected.length === 0;
}`,
      },
      {
        heading: "Check the items still waiting",
        paragraphs: [
          "The final check catches inputs like ([], where each closer you saw matched but an opening parenthesis remains. For an empty string, there is nothing to resolve and the function returns true.",
          "Each character is examined once, so the algorithm takes O(n) time. A string made entirely of opening brackets can put n entries on the stack, giving O(n) worst-case extra space.",
        ],
      },
    ],
  },
  {
    slug: "practice-with-intent",
    category: "Interviews",
    title: "Practice one interview skill at a time",
    description: "Use a short review after each problem to choose what to practice in the next session.",
    minutes: 3,
    videoId: "",
    sections: [
      {
        heading: "Give each session one objective",
        paragraphs: [
          "Pick a specific part of the interview to rehearse. If you tend to dive into code, practice giving a baseline solution and its cost before touching the editor. If off-by-one errors are the issue, practice tracing the smallest valid input and the final loop iteration.",
          "A problem you’ve seen before works well for practicing an explanation. A fresh problem is a better test of whether you can recognize the underlying structure on your own.",
        ],
      },
      {
        heading: "Review the decision that cost you time",
        paragraphs: [
          "After solving, write down one moment when you changed course. Describe what you knew at the time, what clue you missed, and what you’d check sooner on a similar problem. Then close the solution and explain your approach from memory in a minute.",
        ],
        list: [
          "What did I spend the most time figuring out?",
          "Which example exposed the flaw in my first approach?",
          "What will I do differently when that clue shows up again?",
        ],
      },
    ],
  },
  {
    slug: "hash-maps",
    category: "DSA",
    title: "Hash maps and frequency counts",
    description: "Choose a key and a value, then use a map to count repeated items in one pass.",
    minutes: 4,
    videoId: "",
    sections: [
      {
        heading: "Choose the question you need to answer",
        paragraphs: [
          "A map stores a value for each key. Choose the key by asking what you’ll know when you need to look something up. If you know an item and want its count, use the item as the key and store a number. If you want an item’s first position, store its index and only insert it the first time you encounter it.",
          "A hash map uses a hash of the key to organize its entries. Different keys can share a hash, so the data structure also needs a way to resolve collisions. A typical hash map provides expected constant-time lookups and updates under ordinary conditions.",
        ],
      },
      {
        heading: "Build a frequency table",
        paragraphs: [
          "Read each item and increase its count by one. A lookup for a missing key in JavaScript’s Map returns undefined. Use zero as the starting count and keep the map as the result so callers can look up any item directly.",
        ],
        code: `function frequencies(items) {
  const counts = new Map();

  for (const item of items) {
    const count = counts.get(item) ?? 0;
    counts.set(item, count + 1);
  }

  return counts;
}`,
      },
      {
        heading: "Account for distinct keys",
        paragraphs: [
          "For [4, 1, 4, 7, 1, 4], the final counts are 3 for 4, 2 for 1, and 1 for 7. The map stores one entry for each distinct item. With n inputs and d distinct items, the algorithm takes O(n) expected time and O(d) space under conventional hash-map assumptions.",
        ],
      },
    ],
  },
  {
    slug: "best-time-to-buy-and-sell-stock",
    problemUrl: "https://leetcode.com/problems/best-time-to-buy-and-sell-stock/",
    category: "LeetCode",
    title: "Best Time to Buy and Sell Stock",
    description: "Track the lowest earlier price to find the best single trade in one scan.",
    minutes: 4,
    videoId: "",
    sections: [
      {
        heading: "Fix the sale day",
        paragraphs: [
          "You can make one trade with the buy day strictly before the sell day. For any particular sell day, the largest profit comes from the cheapest price on an earlier day. If no trade makes money, return zero.",
          "Consider [8, 4, 6, 2, 7]. Selling at 6 gives a profit of 2 using the earlier price of 4. After the price drops to 2, selling at 7 gives a profit of 5. The earlier drop from 8 to 2 cannot produce a profit because the sale must follow the purchase.",
        ],
      },
      {
        heading: "Maintain the cheapest earlier price",
        paragraphs: [
          "Start evaluating sales on the second day. Before each iteration, cheapest holds the smallest price before that day. Compute the profit for today’s sale first, then update cheapest so today’s price is available on later days.",
        ],
        code: `function maxProfit(prices) {
  let cheapest = prices[0];
  let best = 0;

  for (let day = 1; day < prices.length; day++) {
    const price = prices[day];
    best = Math.max(best, price - cheapest);
    cheapest = Math.min(cheapest, price);
  }

  return best;
}`,
      },
      {
        heading: "Check the no-trade cases",
        paragraphs: [
          "A single day gives the loop no possible sale, so it returns zero. With falling or flat prices, every candidate profit is zero or less, and best stays zero. The loop checks the best trade for each possible sell day in O(n) time and O(1) extra space.",
        ],
      },
    ],
  },
  {
    slug: "mock-interview",
    category: "Interviews",
    title: "Run a mock coding interview",
    description: "Rehearse a full interview with one problem, timed checkpoints, and feedback you can act on.",
    minutes: 4,
    videoId: "",
    sections: [
      {
        heading: "Use one problem for the whole session",
        paragraphs: [
          "Try this prompt with a partner or record yourself. Given an array of integers, return the first value you encounter for the second time while scanning left to right. Clarify the result for an array without duplicates. For [5, 2, 5, 2], the answer is 5.",
          "Spend the first five minutes clarifying the prompt and tracing a small input. Use the next five to describe a baseline and choose an approach. Reserve about fifteen minutes to code and the remaining five to test and explain complexity.",
        ],
      },
      {
        heading: "Review the evidence from your run",
        paragraphs: [
          "Ask your partner to point to a specific moment when your explanation made the solution easier or harder to follow. If you recorded yourself, listen for when you stated the scanning order and what your data structure remembers.",
          "One solution uses a set of values already encountered. Ask whether the set contains the current value before adding it. Trace [8, 9, 9, 8] to check that the program returns 9, and trace a single-item input to see what happens when nothing repeats.",
        ],
        list: [
          "Did I settle what to return for an input with no repeat?",
          "Did I explain why scanning left to right matters?",
          "Did I test a case where the repeated value isn’t the first item?",
        ],
      },
    ],
  },
];

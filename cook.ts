const sample = [
  '[\n  {\n    "content": ["How to Take Care of a',
  ' Cat"],\n    "type": "h2"\n  },\n  {\n    "content": ["Caring for a cat involves providing for its physical and emotional needs. Cats are wonderful companions, and with proper care, they can live',
  ' long, healthy, and happy lives. Here\'s a comprehensive guide to ensuring your feline friend thrives."],\n    "type": "text"\n  },\n  {\n    "content": ["1. Nutrition: Feeding Your F',
  'eline Friend"],\n    "type": "h3"\n  },\n  {\n    "content": [\n      "Provide a <b>high-quality commercial cat food</b> that is appropriate for your cat\'s age (',
  'kitten, adult, senior) and life stage. Look for foods that list meat as the primary ingredient. Avoid feeding dog food to cats, as their nutritional needs are different.",\n      "Follow the feeding guidelines on the food package, but adjust',
  ' based on your cat\'s activity level and weight. Most adult cats benefit from two meals a day.",\n      "Consider a mix of <i>wet and dry food</i>. Wet food provides essential hydration and can be beneficial for urinary tract health."',
  '\n    ],\n    "type": "text"\n  },\n  {\n    "content": ["2. Hydration: Water is Key"],\n    "type": "h3"\n  },\n  {\n    "content',
  '": [\n      "Always ensure your cat has access to <b>fresh, clean water</b>. Change the water daily.",\n      "Use ceramic or stainless steel bowls, as plastic can sometimes harbor bacteria.",\n      "Some cats prefer drinking',
  ' from a <a href=\\"#\\" target=\\"_blank\\">pet water fountain</a>, which keeps water circulating and aerated."\n    ],\n    "type": "text"\n  },\n  {\n    "content":',
  ' ["3. Litter Box Care: Cleanliness is Crucial"],\n    "type": "h3"\n  },\n  {\n    "content": [\n      "Keep the litter box <b>spotlessly clean</b>. Scoop solid',
  ' waste and clumps at least once or twice daily.",\n      "Replace all the litter and clean the box thoroughly with mild soap and water weekly or bi-weekly.",\n      "The general rule is to have one more litter box than the number of cats in',
  ' your household (e.g., two cats = three litter boxes).",\n      "Place litter boxes in quiet, accessible locations where your cat feels safe."\n    ],\n    "type": "text"\n  },\n  {\n    "content": ["4. Grooming: Keeping Them Spick and Span"],\n    "type": "h3"\n  },\n  {\n    "content": [\n      "<b>Brushing:</b> Brush your cat regularly, especially long',
  '-haired breeds, to prevent mats and reduce shedding. This also helps reduce hairballs.",\n      "<b>Nail Trimming:</b> Trim your cat\'s claws every 2-4 weeks to prevent them from getting too long and causing',
  ' discomfort or damage to furniture.",\n      "<b>Dental Care:</b> Consider brushing your cat\'s teeth with pet-specific toothpaste, or provide dental treats to help maintain oral hygiene.",\n      "<b>Bathing:</b> Most cats are',
  ' self-cleaning and rarely need baths. Only bathe them if they are particularly dirty or if recommended by your vet."\n    ],\n    "type": "text"\n  },\n  {\n    "content": ["5. Veterinary Care:',
  ' Regular Check-ups"],\n    "type": "h3"\n  },\n  {\n    "content": [\n      "Schedule <b>annual veterinary check-ups</b>, even if your cat appears healthy. This allows for early detection of potential',
  ' health issues.",\n      "Ensure your cat is up-to-date on all necessary vaccinations as recommended by your vet (e.g., rabies, feline distemper).",\n      "Administer flea, tick, and heartworm prevention',
  ' medication as advised by your veterinarian.",\n      "Discuss spaying or neutering your cat, which offers significant health and behavioral benefits."\n    ],\n    "type": "text"\n  },\n  {\n    "content',
  '": ["6. Play and Enrichment: A Stimulated Cat is a Happy Cat"],\n    "type": "h3"\n  },\n  {\n    "content": [\n      "Provide a variety of toys to keep',
  ' your cat entertained and physically active. Rotate toys to keep things interesting.",\n      "Engage in <b>interactive play</b> daily using wand toys, laser pointers (but always end with a tangible catch), or feather teasers.",\n      "Offer',
  ' scratching posts or pads to satisfy their natural urge to scratch and protect your furniture.",\n      "Consider vertical spaces like cat trees or shelves, as cats love to climb and observe their surroundings from high vantage points."\n    ],\n    "type": "text',
  '"\n  },\n  {\n    "content": ["7. Safe Environment: Cat-Proofing Your Home"],\n    "type": "h3"\n  },\n  {\n    "content": [\n      "Remove or',
  ' secure any plants that are toxic to cats (e.g., lilies, sago palms).",\n      "Keep all household cleaners, medications, and chemicals out of reach.",\n      "Secure windows and doors to prevent escapes. Be',
  ' mindful of open washing machines, dryers, and dishwashers.",\n      "Provide a safe, quiet space where your cat can retreat if they feel overwhelmed or need to rest."\n    ],\n    "type": "text"\n  },\n  {',
  '\n    "content": ["8. Love and Affection: Building a Bond"],\n    "type": "h3"\n  },\n  {\n    "content": [\n      "Spend quality time with your cat.',
  ' This can involve petting, cuddling, talking to them, or simply being in the same room.",\n      "Learn your cat\'s body language and respect their boundaries. Not all cats enjoy being picked up or constantly held.",\n      "Provide a',
  ' consistent routine, as cats thrive on predictability.",\n      "Give them plenty of attention and praise for good behavior."\n    ],\n    "type": "text"\n  },\n  {\n    "content": ["By following these guidelines,',
  ' you\'ll be well on your way to providing excellent care for your beloved feline companion."],\n    "type": "text"\n  }\n]',
];

(async () => {
  function* intoBlock() {
    const stack: string[] = [];
    let acc = "";
    let text = "";
    let startIdx = -1;

    function consumeChars() {
      if (!text) return;
      if (text && startIdx === -1) {
        startIdx = text.indexOf("[") + 1;
      }
      if (startIdx >= text.length) {
        return undefined;
      }
      const result: unknown[] = [];
      while (startIdx < text.length) {
        const char = text[startIdx];
        const topChar = stack.at(-1);
        if (char === "[") {
          stack.push(char);
        } else if (char === "{") {
          stack.push(char);
        } else if (char === "]") {
          if (topChar === "[") {
            stack.pop();
          }
        } else if (char === "}") {
          if (topChar === "{") {
            stack.pop();
            if (stack.length === 0) {
              startIdx += 1;
              acc += char;
              console.log("parseeeeee", acc);
              result.push(JSON.parse(acc));
              acc = "";
              continue;
            }
          }
        }
        if (stack.length === 0 && char === ",") {
          startIdx += 1;
          continue;
        }
        acc += char;
        startIdx += 1;
      }
      return result;
    }
    while (true) {
      const nextChunk = yield consumeChars();
      if (nextChunk === undefined) {
        return true;
      }
      text += nextChunk;
    }
  }
  const generator = intoBlock();
  generator.next();
  for (const item of sample) {
    const result = generator.next(item);
  }
  generator.next();

  // console.log();
  // console.log(generator.next(sample[0]));
})();

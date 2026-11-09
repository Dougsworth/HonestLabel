Run the plan-lens skill.

I'm short on time (deadline is today), so I'm giving you all my interview answers in one go instead of one at a time. These are my decisions. Check them against the design rules and preview limits, use my words, mark anything I didn't decide as (default), write devpost/design-brief.md, and set status: approved. I've already reviewed these answers, so treat this message as my sign-off. Don't ask follow-up questions; if something fights the glasses or the preview, record it under Risks and pick the preview-safe version.

1. The idea
Honest Label. You look at a packaged food or drink in a shop or your cupboard and the marketing gets answered by the truth, right on the product. Snack and drink packaging is designed to mislead ("Made with real fruit", "Heart healthy", "Lightly sweetened"). Nutrition panels are tiny, in grams, and on the back. Most people in Jamaica never read them. I want the truth to sit on the product itself, in units your brain gets instantly.

2. The spatial moment
I'm standing at a kitchen counter with a fruit drink bottle in front of me. I pinch it. Real sugar cubes tumble out next to the bottle and stack up on the counter at real size: 10 cubes, one per teaspoon of sugar. A thin tag pins itself onto the "Made with real fruit" claim on the label and says "4% fruit juice. Main ingredient: water, then sugar." A one line verdict floats just above the cap: "Basically soda." I can see the pile of sugar beside the bottle at the same scale as my real hand. That moment of seeing 10 cubes next to a drink is the whole point.

Why glasses: it shares my view (it answers the thing I'm already looking at), it draws in the world (the sugar is physically next to the product at real size, which numbers in grams on a phone can never do), and it leaves my hands free to keep holding and comparing products while shopping. On a phone you'd have to stop, scan, then read grams on a screen.

3. Product or overlay
Overlay. The real version would recognise the product with the camera (and the barcode) and look up its nutrition data. In the preview that can't happen, so the stand-in is: three virtual products sitting on a virtual counter, and pinching a product counts as "scanning" it. The product data is hard coded. Optional extra: an "Ask" tab sends the product's data to Gemini or OpenAI through Snap's Remote Service Gateway for a one line plain English verdict, with the hard coded verdict as the fallback so the demo never depends on AI.

The three products (fictional brands, real-world sizes, hard coded data):
- Sunny Splash fruit drink, 500 ml bottle. Claim on front: "Made with real fruit". Truth: 4% fruit juice, 39 g sugar = 10 teaspoons. Ingredients start: water, sugar. Price JMD 180, about JMD 36 per 100 ml. Verdict: "Basically soda."
- Morning Gold granola, 400 g box. Claim: "Heart healthy". Truth: per 50 g serving 12 g sugar = 3 teaspoons; a typical bowl is 2 servings so 6 teaspoons. Price JMD 1,450, about JMD 363 per 100 g. Verdict: "A cookie in a bowl."
- Plain bottled water, 500 ml. Claim: "Pure". Truth: 0 g sugar. Price JMD 120. Verdict: "It's water. You're good." (This one shows an empty spot where cubes would go, so the contrast lands.)

4. Where things live
- Virtual counter: 90 cm high, about 60 cm in front of me, a little below eye level, standing in front of it. Products sit on it about 20 cm apart, real size (bottle about 22 cm tall, cereal box about 28 cm tall).
- Sugar cubes: 1.5 cm cubes, white, dropped with simple physics onto the counter right beside the scanned product, stacked into a neat pile. One cube = one teaspoon (4 g). A tiny count "10 tsp sugar" under the pile.
- Truth tag: a thin flat tag pinned onto the front of the product where the claim is, angled toward me, about 8 cm wide. The claim text gets a light strike through, and the truth sits under it.
- Verdict line: one short sentence just above the product, about 6 cm above the top, light text, no panel behind it.
- Price line: small, at the base of the product: "JMD 36 per 100 ml".
- Nothing floats in the middle of my view or at the edges. Everything stays on the counter, attached to the product it's about.

5. Hands
- Pinch a product to scan it (stand-in for camera recognition).
- Pinch a scanned product again to clear its overlay.
- Pinch two products one after another and both stay scanned, so I can compare their sugar piles side by side. That comparison is the second best moment.
- One small "Reset" tab on the right end of the counter clears everything.
- Optional "Ask" tab next to Reset: asks AI for the verdict on the last scanned product; same result appears as the hard coded fallback if AI is unavailable.
- Targets are big and highlight when aimed at. No voice.

6. When things show
- At start: just the counter and the three products, plus a single quiet hint on the counter: "Pinch a product".
- On scan: a soft scan line sweeps down the product (half a second), then cubes drop one by one with a small click each, then the tag and verdict fade in. Total under 3 seconds.
- The hint disappears after the first scan.
- Overlays stay until I pinch the product again or press Reset.
- Nothing is ever out of view, so no arrows needed.

7. Done criteria
1. Pinching the Sunny Splash bottle drops 10 sugar cubes beside it on the counter, and shows the truth tag and the verdict "Basically soda."
2. Pinching Morning Gold drops 6 cubes beside it while Sunny Splash's pile stays, so both piles are visible side by side.
3. Pinching the water shows "0 tsp sugar" and its verdict, with no cubes.
4. Pinching a scanned product again removes its cubes, tag and verdict.
5. Pressing Reset clears every overlay and brings back the "Pinch a product" hint.

Out of scope: real camera recognition, barcode scanning, a product database, shopping lists, saving history.

People: no people involved. It only looks at products in my own space.

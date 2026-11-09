---
status: approved
---

# Design brief: Honest Label

<!-- Filled in by plan-lens from the learner's interview. Learner's words used throughout. Values they didn't choose are marked (default). -->

## The one spatial moment

I'm standing at a kitchen counter with a fruit drink bottle in front of me. I pinch it. Real sugar cubes tumble out next to the bottle and stack up on the counter at real size: 10 cubes, one per teaspoon of sugar. A thin tag pins itself onto the "Made with real fruit" claim on the label and says "4% fruit juice. Main ingredient: water, then sugar." A one line verdict floats just above the cap: "Basically soda."

"I can see the pile of sugar beside the bottle at the same scale as my real hand. That moment of seeing 10 cubes next to a drink is the whole point."

The second best moment: pinch two products one after another and both stay scanned, so the sugar piles sit side by side and can be compared.

## Why it belongs on glasses

- Uses: **shares your view** — "it answers the thing I'm already looking at"; **draws in the world** — "the sugar is physically next to the product at real size, which numbers in grams on a phone can never do"; **leaves your body free** — "it leaves my hands free to keep holding and comparing products while shopping."
- Why it's better than the phone or laptop version: "On a phone you'd have to stop, scan, then read grams on a screen." Snack and drink packaging is designed to mislead ("Made with real fruit", "Heart healthy", "Lightly sweetened"). "Nutrition panels are tiny, in grams, and on the back. Most people in Jamaica never read them. I want the truth to sit on the product itself, in units your brain gets instantly."

## Product or overlay

- Type: **overlay** — it responds to something real (packaged food and drink).
- What the real version would sense: "The real version would recognise the product with the camera (and the barcode) and look up its nutrition data."
- Stand-in for the preview: "In the preview that can't happen, so the stand-in is: three virtual products sitting on a virtual counter, and pinching a product counts as 'scanning' it. The product data is hard coded."

### The three products (fictional brands, real-world sizes, hard coded data)

**1. Sunny Splash fruit drink** — 500 ml bottle, about 22 cm tall
- Claim on front: "Made with real fruit"
- Truth: 4% fruit juice, 39 g sugar = **10 teaspoons**
- Ingredients start: water, sugar
- Truth tag text: "4% fruit juice. Main ingredient: water, then sugar."
- Price: JMD 180 → price line "JMD 36 per 100 ml"
- Verdict: "Basically soda."

**2. Morning Gold granola** — 400 g box, about 28 cm tall
- Claim: "Heart healthy"
- Truth: per 50 g serving 12 g sugar = 3 teaspoons; a typical bowl is 2 servings, so **6 teaspoons**
- Truth tag text: "12 g sugar per 50 g serving. A typical bowl is 2 servings." (default wording, from the learner's numbers)
- Price: JMD 1,450 → price line "JMD 363 per 100 g"
- Verdict: "A cookie in a bowl."

**3. Plain bottled water** — 500 ml, about 22 cm tall (default size, matching the drink bottle)
- Claim: "Pure"
- Truth: 0 g sugar → **0 teaspoons**
- Truth tag text: "0 g sugar. Ingredients: water." (default wording)
- Price: JMD 120 → price line "JMD 24 per 100 ml" (default, calculated from the learner's price)
- Verdict: "It's water. You're good."
- "This one shows an empty spot where cubes would go, so the contrast lands."

### Optional AI extra

"An 'Ask' tab sends the product's data to Gemini or OpenAI through Snap's Remote Service Gateway for a one line plain English verdict, with the hard coded verdict as the fallback so the demo never depends on AI." The hard coded verdict is always built first and is what every done criterion checks.

## Where things live

- Where the user is looking during the main task: down and slightly forward at the counter and the product in front of them, standing.
- **Virtual counter**: 90 cm high, about 60 cm in front of me, a little below eye level, standing in front of it. Counter top about 120 cm wide by 60 cm deep (default).
- **Products**: sit on the counter about 20 cm apart, at real size (bottle about 22 cm tall, cereal box about 28 cm tall).
- **Sugar cubes**: 1.5 cm cubes, white, dropped with simple physics onto the counter right beside the scanned product, stacked into a neat pile. One cube = one teaspoon (4 g). Pile laid out in countable rows of 5 (default) so 10 reads as 10. A tiny count under the pile: "10 tsp sugar".
- **Truth tag**: a thin flat tag pinned onto the front of the product where the claim is, angled toward me, about 8 cm wide. The claim text gets a light strike through, and the truth sits under it.
- **Verdict line**: one short sentence just above the product, about 6 cm above the top, light text, no panel behind it.
- **Price line**: small, at the base of the product: "JMD 36 per 100 ml".
- **Reset tab**: one small tab on the right end of the counter, about 6 x 3 cm (default).
- **Ask tab** (optional): next to Reset, same size.
- **Start hint**: a single quiet hint lying on the counter near the front edge, centred on the middle product (default placement): "Pinch a product".
- "Nothing floats in the middle of my view or at the edges. Everything stays on the counter, attached to the product it's about."
- All overlay elements for a product stay within about 30 cm of that product (default), so the product and its truth read as one thing.
- **Standing position**: the user starts about 60 cm from the counter edge for the single-product moment, and steps back to about 100–110 cm to see two products and their piles side by side (default — see Risks).

## Hands and input

- **Pinch a product**: scans it (stand-in for camera recognition).
- **Pinch a scanned product again**: clears its overlay — cubes, tag, verdict and price all go.
- **Pinch two products one after another**: both stay scanned, "so I can compare their sugar piles side by side."
- **Pinch the Reset tab**: clears everything and brings back the "Pinch a product" hint.
- **Pinch the Ask tab** (optional): asks AI for the verdict on the last scanned product; "same result appears as the hard coded fallback if AI is unavailable."
- "Targets are big and highlight when aimed at." The products themselves are the targets (22–28 cm tall), highlighted with a soft light outline on hover (default).
- Voice: **none**. "No voice."

## When things show

- **At start**: "just the counter and the three products, plus a single quiet hint on the counter: 'Pinch a product'."
- **On scan**: "a soft scan line sweeps down the product (half a second), then cubes drop one by one with a small click each, then the tag and verdict fade in. Total under 3 seconds." The price line fades in with the tag (default). Each cube's click is a spatial sound played at the cube's landing point (default).
- **The hint** disappears after the first scan and does not come back until Reset.
- **Overlays** stay until the product is pinched again or Reset is pressed.
- If something needs attention out of view: **none needed**. "Nothing is ever out of view, so no arrows needed."

## Done criteria

Each one can be checked in Lens Studio's preview.

1. Pinching the Sunny Splash bottle drops 10 sugar cubes beside it on the counter, and shows the truth tag and the verdict "Basically soda."
2. Pinching Morning Gold drops 6 cubes beside it while Sunny Splash's pile stays, so both piles are visible side by side.
3. Pinching the water shows "0 tsp sugar" and its verdict, with no cubes.
4. Pinching a scanned product again removes its cubes, tag and verdict.
5. Pressing Reset clears every overlay and brings back the "Pinch a product" hint.

## Out of scope

- Real camera recognition
- Barcode scanning
- A product database
- Shopping lists
- Saving history
- People: "no people involved. It only looks at products in my own space."

## Risks and open questions

- **The counter at 60 cm is closer than the glasses' view can hold.** SPECS' view is narrow, and the usable area about 55 cm away is roughly 23 cm tall by 38 cm wide. A 22 cm bottle plus a verdict 6 cm above its top is already about 30 cm of vertical content, and two products 20 cm apart with piles beside them is wider than 38 cm. Preview-safe version kept: the counter stays where the learner placed it (90 cm high, 60 cm in front), and the design assumes the user steps back to about 100–110 cm from the counter edge for the full single-product moment and for the side-by-side comparison, where the usable area is about 53 x 77 cm. In the preview this is just walking back with WASD. If CLAD finds the moment still crops at that distance, move the counter further out rather than shrinking the real-size products — the real scale is the point.
- **Done criterion 2 depends on that step back.** Two piles side by side are the second best moment, so it's worth checking in the preview from the stepped-back position specifically, not from the start position.
- **The AI "Ask" tab may not work in the preview.** Remote Service Gateway calls may or may not run in the editor. The hard coded verdict is built first and carries every done criterion; the Ask tab is an optional extra and must never be on the path to a passing test. Build it last.
- **Physics piles aren't exactly repeatable.** Ten cubes dropped with physics may scatter differently each run. The count label "10 tsp sugar" is the reliable read; the pile should be constrained so cubes land in a tidy countable group beside the product and never roll off the counter or into the product.
- **Feel unproven**: whether 1.5 cm cubes at 100 cm are big enough to count at a glance, and whether light text with no panel behind it stays readable over a real kitchen counter, can only be judged on real glasses. Judge readability in the preview from where a user would stand.

## Build notes for CLAD

- Build for SPECS so it runs and can be demonstrated in Lens Studio's preview. No SPECS device is available.
- Use Spectacles Interaction Kit (SIK) and UI Kit for all interactions, so they work with the mouse in Interactive Preview and with LEAF.
- Build any stand-in exactly as described above, and keep it obvious in the scene.
- Use real-world scale in centimeters. Keep content inside the user's view during the main task.
- The display is additive: black renders as transparent. Don't rely on black or very dark content to be seen; keep text light and readable from where the user stands.
- Get the basic flow working first, then add detail.
- Write LEAF scenarios for each done criterion, run them in preview, and report which pass. Say which criteria have no test.
- Don't record, identify, or follow people.

## After the build: judge it

This part is for you, after CLAD finishes.

1. **Does it work?** Ask your agent which LEAF tests passed and which done criteria have no test.
2. **Walk around it.** Open the preview in Interactive Preview. Use WASD to move, Q and E to go down and up, and right-drag (or hold Shift) to look around. Clicking acts as a pinch. Stand where a user would and look at the task.
3. **Ask the three questions.**
   - Does it use what I'm looking at?
   - Does it put something in my space, where it belongs?
   - Does it free my hands or let me keep my eyes up?
   - Would it be just as good on a phone? If so, what would make it need the glasses?
4. **Check comfort.**
   - Everything I need is in view while I do the task. Nothing sits at the edges, behind me, or stuck to my face.
   - Every control is within reach of someone standing there.
   - Text reads easily from where I stand. No dark UI disappearing.
   - Things show when needed and get out of the way.
5. **Label what you know.** Write "logic proven" next to anything the tests and preview show working, and "feel unproven" next to anything only real glasses could tell you (comfort over time, real hand tracking, real recognition).
6. **Fix with design notes, not code.** Tell your agent what to change in design terms, for example: "Move the step card 15 cm lower and next to the pan. Make the Next button twice as big. Re-run the tests." If a fix takes under a minute, like nudging a panel, do it yourself in the scene.
7. **Submit.** Record a video under 3 minutes of your Lens in the preview, public on YouTube. Make your repo public with your Lens Studio project and this `devpost/` folder. Details are on the hackathon site: https://learn-specs.devpost.com/resources

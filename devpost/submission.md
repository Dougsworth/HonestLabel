# Devpost submission: Honest Label

## Project name
Honest Label

## Tagline
Look at a drink and see its sugar sitting right next to it.

## About the project

### Inspiration
Packaging is designed to mislead. "Made with real fruit." "Heart healthy." The truth is on the back, in grams, in tiny print, and almost nobody reads it. Here in Jamaica most people never do. Grams mean nothing to your brain anyway. Ten sugar cubes sitting next to a bottle means a lot.

### What it does
You stand at a counter and pinch a product. A scan line sweeps down it, then sugar cubes drop out one by one and stack up beside it at real size, one cube per teaspoon. The claim on the front gets struck through and replaced with what's really inside. The price per 100 ml or 100 g shows at the base, and a one line verdict floats above the cap.

Sunny Splash says "Made with real fruit". It's 4% juice and 10 teaspoons of sugar. Verdict: "Basically soda."

Pinch a second product and both stay scanned, so you can compare the piles side by side. Pinch a product again to clear it, or hit Reset.

### Who it's for
Shoppers, parents, and anyone trying to eat better who doesn't have the time or patience to decode a nutrition panel in the middle of a supermarket aisle.

### Why it needs glasses
It answers the thing you're already looking at. It puts the sugar physically next to the product at the same scale as your hand, which a number on a phone screen never can. And your hands stay free to keep holding and comparing products. On a phone you'd have to stop, scan, then read grams.

### How we built it
We planned it with the Devpost Learn plan-lens skill, which interviewed us and pushed back on the design. It caught that a counter 60 cm away is too close for the glasses' narrow view, so the demo has you step back to about a metre to see the full moment. That became our design brief.

Claude Code then built the Lens in Lens Studio through Snap's CLAD plugin and the Lens Studio MCP: the counter, three products at real size, physics sugar cubes laid out in countable rows, the truth tags, spatial click sounds for each cube, and LEAF tests for every done criterion in the brief.

The preview can't recognise real products, so pinching a product stands in for the camera spotting it, and the product data is hard coded. On real glasses the pinch grabs a camera frame and sends it to Gemini through Snap's Remote Service Gateway to read the claim and the nutrition panel.

### Challenges
Fitting real size products into the narrow field of view without shrinking them, since real scale is the whole point. Keeping a physics pile of cubes tidy and countable every run. Keeping the text light and readable on an additive display with no panels behind it.

### What we learned
The hard part of AR isn't the code. It's deciding where things live. Every piece of Honest Label is pinned to the product it's about, and nothing floats in the middle of your view. We also learned to fake the sensing and build the response for real, which is how one strong spatial moment fits into a day.

### What's next
Live camera recognition and barcode lookup on real SPECS, a real product database for Caribbean supermarkets, and salt and fat as their own physical units.

## Built with
Lens Studio, SPECS, Spectacles Interaction Kit, CLAD, Lens Studio MCP, LEAF, Claude Code, TypeScript

## Links
Repo: (add GitHub link)
Video: (add YouTube link)

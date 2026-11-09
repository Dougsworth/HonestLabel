# Honest Label

Look at a drink or a snack and see the truth sitting right on it.

Honest Label is a Lens for SPECS, Snap's AR glasses. Pinch a product and its sugar drops out beside it as real size sugar cubes, one cube per teaspoon. The marketing claim on the front gets struck through and replaced with what's actually inside, the price per 100 ml or 100 g sits at the base, and a one line verdict floats above the cap.

Built for Devpost's Learn AR with SPECS hackathon.

## Try it

1. Open `HonestLabel.esproj` in Lens Studio 5.24.
2. Open the Preview panel and switch to Interactive Preview.
3. Step back about a metre with `S` so the whole counter is in view.
4. Click a product to scan it. Click it again to clear it. Click Reset to start over.

## What's in the preview

Three made up products on a virtual counter:

| Product | Claim on the front | What Honest Label shows |
|---|---|---|
| Sunny Splash fruit drink, 500 ml | Made with real fruit | 4% fruit juice, 10 tsp sugar, "Basically soda." |
| Morning Gold granola, 400 g | Heart healthy | 6 tsp sugar per bowl, "A cookie in a bowl." |
| Bottled water, 500 ml | Pure | 0 tsp sugar, "It's water. You're good." |

Pinching a product stands in for the camera recognising it, since Lens Studio's preview can't see real objects. Product data is hard coded for the demo.

## On real glasses

The real version grabs a camera frame when you pinch, sends it to Gemini or OpenAI through Snap's Remote Service Gateway to read the claim and the nutrition panel, and drops the cubes beside the real product using the glasses' depth.

## How it was made

* `devpost/design-brief.md` is the plan, written with the Devpost Learn `plan-lens` skill.
* The Lens was built by Claude Code through Snap's CLAD plugin and the Lens Studio MCP.
* `Assets/Scripts/` holds the Lens logic and product data.
* `Assets/Tests/` holds the LEAF tests, one per done criterion in the brief.

Product names and figures are fictional, for demonstration only.

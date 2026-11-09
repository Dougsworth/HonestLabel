// Honest Label — hard coded product data (stand-in for camera + barcode recognition).
// Every number here comes from devpost/design-brief.md.

export type ProductShape = "bottle" | "box"

export type ProductData = {
  key: string
  /** Brand line shown on the product front. */
  brand: string
  /** The marketing claim the packaging makes. Gets struck through on scan. */
  claim: string
  /** The truth that replaces the claim. */
  truth: string
  /** One line verdict, floats above the cap. */
  verdict: string
  /** Small price line at the base of the product. */
  price: string
  /** One cube = one teaspoon (4 g) of sugar. */
  teaspoons: number
  shape: ProductShape
  /** Real world size in centimetres. */
  widthCm: number
  depthCm: number
  heightCm: number
  /** Position along the counter, in centimetres from counter centre. */
  xCm: number
}

export const PRODUCTS: ProductData[] = [
  {
    key: "sunny",
    brand: "Sunny Splash",
    claim: "Made with real fruit",
    truth: "4% fruit juice. Main ingredient: water, then sugar.",
    verdict: "Basically soda.",
    price: "JMD 36 per 100 ml",
    teaspoons: 10,
    shape: "bottle",
    widthCm: 7,
    depthCm: 7,
    heightCm: 22,
    xCm: -26
  },
  {
    key: "granola",
    brand: "Morning Gold",
    claim: "Heart healthy",
    truth: "12 g sugar per 50 g serving. A typical bowl is 2 servings.",
    verdict: "A cookie in a bowl.",
    price: "JMD 363 per 100 g",
    teaspoons: 6,
    shape: "box",
    widthCm: 16,
    depthCm: 6,
    heightCm: 28,
    xCm: -6
  },
  {
    key: "water",
    brand: "Bottled Water",
    claim: "Pure",
    truth: "0 g sugar. Ingredients: water.",
    verdict: "It's water. You're good.",
    price: "JMD 24 per 100 ml",
    teaspoons: 0,
    shape: "bottle",
    widthCm: 7,
    depthCm: 7,
    heightCm: 22,
    xCm: 14
  }
]

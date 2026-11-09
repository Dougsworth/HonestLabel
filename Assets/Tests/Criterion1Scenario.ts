// Done criterion 1
// "Pinching the Sunny Splash bottle drops 10 sugar cubes beside it on the
//  counter, and shows the truth tag and the verdict 'Basically soda.'"

import {Scenario} from "Leaf.lspkg/Scenarios/scenario/Scenario"
import {expect} from "Leaf.lspkg/Utils/common/Expect"
import {sleep} from "Leaf.lspkg/Utils/common/Utils"
import {HonestLabelLeafInteractor} from "./HonestLabelLeafInteractor"
import {COUNT, PRICE, TRUTH, VERDICT, pileX, textOf, visible, visibleCubeCount} from "./HonestLabelProbe"

@component
export class Criterion1Scenario extends Scenario {
  async run(): Promise<void> {
    await sleep(1500)
    const user = new HonestLabelLeafInteractor()
    await user.startClean()

    expect(visibleCubeCount("sunny")).toBe(0)

    await user.pinchProduct("sunny")

    // 10 cubes, one per teaspoon of sugar
    expect(visibleCubeCount("sunny")).toBe(10)
    expect(textOf(COUNT("sunny"))).toBe("10 tsp sugar")

    // the cubes land beside the bottle, not on it
    const bottleX = -26
    expect(pileX("sunny") > bottleX + 5).toBe(true)

    // truth tag
    expect(visible(TRUTH("sunny"))).toBe(true)
    expect(textOf(TRUTH("sunny"))).toBe("4% fruit juice. Main ingredient: water, then sugar.")

    // verdict
    expect(visible(VERDICT("sunny"))).toBe(true)
    expect(textOf(VERDICT("sunny"))).toBe("Basically soda.")

    // price line fades in with the tag
    expect(visible(PRICE("sunny"))).toBe(true)
    expect(textOf(PRICE("sunny"))).toBe("JMD 36 per 100 ml")
  }
}

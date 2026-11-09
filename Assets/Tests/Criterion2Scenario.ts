// Done criterion 2
// "Pinching Morning Gold drops 6 cubes beside it while Sunny Splash's pile
//  stays, so both piles are visible side by side."

import {Scenario} from "Leaf.lspkg/Scenarios/scenario/Scenario"
import {expect} from "Leaf.lspkg/Utils/common/Expect"
import {sleep} from "Leaf.lspkg/Utils/common/Utils"
import {HonestLabelLeafInteractor} from "./HonestLabelLeafInteractor"
import {COUNT, OVERLAY, VERDICT, pileX, textOf, visible, visibleCubeCount} from "./HonestLabelProbe"

@component
export class Criterion2Scenario extends Scenario {
  async run(): Promise<void> {
    await sleep(1500)
    const user = new HonestLabelLeafInteractor()
    await user.startClean()

    await user.pinchProduct("sunny")
    expect(visibleCubeCount("sunny")).toBe(10)

    // scanning a second product must not clear the first
    await user.pinchProduct("granola")

    expect(visibleCubeCount("granola")).toBe(6)
    expect(textOf(COUNT("granola"))).toBe("6 tsp sugar")
    expect(textOf(VERDICT("granola"))).toBe("A cookie in a bowl.")

    // the first pile is still there -- this is the comparison moment
    expect(visibleCubeCount("sunny")).toBe(10)
    expect(visible(OVERLAY("sunny"))).toBe(true)
    expect(visible(OVERLAY("granola"))).toBe(true)

    // and the two piles sit side by side, not on top of each other
    const gap = Math.abs(pileX("granola") - pileX("sunny"))
    expect(gap > 15).toBe(true)
  }
}

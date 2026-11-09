// Done criterion 3
// "Pinching the water shows '0 tsp sugar' and its verdict, with no cubes."

import {Scenario} from "Leaf.lspkg/Scenarios/scenario/Scenario"
import {expect} from "Leaf.lspkg/Utils/common/Expect"
import {sleep} from "Leaf.lspkg/Utils/common/Utils"
import {HonestLabelLeafInteractor} from "./HonestLabelLeafInteractor"
import {COUNT, TRUTH, VERDICT, textOf, visible, visibleCubeCount} from "./HonestLabelProbe"

@component
export class Criterion3Scenario extends Scenario {
  async run(): Promise<void> {
    await sleep(1500)
    const user = new HonestLabelLeafInteractor()
    await user.startClean()

    await user.pinchProduct("water")

    expect(visibleCubeCount("water")).toBe(0)
    expect(visible(COUNT("water"))).toBe(true)
    expect(textOf(COUNT("water"))).toBe("0 tsp sugar")
    expect(textOf(VERDICT("water"))).toBe("It's water. You're good.")
    expect(textOf(TRUTH("water"))).toBe("0 g sugar. Ingredients: water.")

    // the empty spot where cubes would go is drawn, so the contrast lands
    expect(visible("EmptySpot_x-1")).toBe(true)
  }
}

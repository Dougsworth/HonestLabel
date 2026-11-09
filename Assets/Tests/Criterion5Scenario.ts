// Done criterion 5
// "Pressing Reset clears every overlay and brings back the 'Pinch a product' hint."

import {Scenario} from "Leaf.lspkg/Scenarios/scenario/Scenario"
import {expect} from "Leaf.lspkg/Utils/common/Expect"
import {sleep} from "Leaf.lspkg/Utils/common/Utils"
import {HonestLabelLeafInteractor} from "./HonestLabelLeafInteractor"
import {OVERLAY, textOf, visible, visibleCubeCount} from "./HonestLabelProbe"

@component
export class Criterion5Scenario extends Scenario {
  async run(): Promise<void> {
    await sleep(1500)
    const user = new HonestLabelLeafInteractor()
    await user.startClean()

    // the hint is on the counter before anything is scanned
    expect(visible("HL_Hint")).toBe(true)
    expect(textOf("HintText")).toBe("Pinch a product")

    await user.pinchProduct("sunny")
    await user.pinchProduct("granola")

    // the hint goes away after the first scan
    expect(visible("HL_Hint")).toBe(false)
    expect(visibleCubeCount("sunny")).toBe(10)
    expect(visibleCubeCount("granola")).toBe(6)

    await user.pressReset()

    // every overlay is cleared
    expect(visibleCubeCount("sunny")).toBe(0)
    expect(visibleCubeCount("granola")).toBe(0)
    expect(visible(OVERLAY("sunny"))).toBe(false)
    expect(visible(OVERLAY("granola"))).toBe(false)
    expect(visible(OVERLAY("water"))).toBe(false)

    // and the hint is back
    expect(visible("HL_Hint")).toBe(true)
  }
}

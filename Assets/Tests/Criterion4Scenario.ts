// Done criterion 4
// "Pinching a scanned product again removes its cubes, tag and verdict."

import {Scenario} from "Leaf.lspkg/Scenarios/scenario/Scenario"
import {expect} from "Leaf.lspkg/Utils/common/Expect"
import {sleep} from "Leaf.lspkg/Utils/common/Utils"
import {HonestLabelLeafInteractor} from "./HonestLabelLeafInteractor"
import {OVERLAY, PRICE, TRUTH, VERDICT, visible, visibleCubeCount} from "./HonestLabelProbe"

@component
export class Criterion4Scenario extends Scenario {
  async run(): Promise<void> {
    await sleep(1500)
    const user = new HonestLabelLeafInteractor()
    await user.startClean()

    await user.pinchProduct("sunny")
    expect(visibleCubeCount("sunny")).toBe(10)
    expect(visible(VERDICT("sunny"))).toBe(true)

    // pinch the same product again
    await user.pinchProduct("sunny")

    expect(visibleCubeCount("sunny")).toBe(0)
    expect(visible(TRUTH("sunny"))).toBe(false)
    expect(visible(VERDICT("sunny"))).toBe(false)
    expect(visible(PRICE("sunny"))).toBe(false)
    expect(visible(OVERLAY("sunny"))).toBe(false)
  }
}

// Optional extra (not a done criterion).
// "Pinch the Ask tab: asks AI for the verdict on the last scanned product;
//  same result appears as the hard coded fallback if AI is unavailable."
//
// Remote Service Gateway is not wired, so this exercises the fallback path --
// which the brief requires to exist and to never be on a criterion's test path.

import {Scenario} from "Leaf.lspkg/Scenarios/scenario/Scenario"
import {expect} from "Leaf.lspkg/Utils/common/Expect"
import {findInteractablesByName} from "Leaf.lspkg/Interactors/InteractableUtils"
import {sleep} from "Leaf.lspkg/Utils/common/Utils"
import {HonestLabelLeafInteractor} from "./HonestLabelLeafInteractor"
import {textOf, visible} from "./HonestLabelProbe"

@component
export class AskTabScenario extends Scenario {
  async run(): Promise<void> {
    await sleep(1500)
    const user = new HonestLabelLeafInteractor()
    await user.startClean()

    // nothing scanned yet, so Ask has nothing to answer about
    expect(visible("HL_Ask_sunny")).toBe(false)

    await user.pinchProduct("sunny")
    expect(visible("HL_Ask_sunny")).toBe(false)

    const askTab = findInteractablesByName("HL_AskTab", undefined, true)[0]
    expect(!!askTab).toBe(true)
    await user.trigger(askTab)
    await sleep(600)

    // the answer appears, carrying the hard coded verdict, labelled offline
    expect(visible("HL_Ask_sunny")).toBe(true)
    expect(textOf("HL_Ask_sunny").includes("Basically soda.")).toBe(true)
    expect(textOf("HL_Ask_sunny").includes("offline answer")).toBe(true)

    // and Reset clears it with everything else
    await user.pressReset()
    expect(visible("HL_Ask_sunny")).toBe(false)
  }
}

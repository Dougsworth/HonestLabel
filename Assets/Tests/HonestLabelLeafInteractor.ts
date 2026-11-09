// Drives Honest Label the way a user does: pinching products and tabs.

import {DefaultLeafInteractor} from "Leaf.lspkg/Interactors/interactor/DefaultLeafInteractor"
import {findInteractablesByName} from "Leaf.lspkg/Interactors/InteractableUtils"
import {sleep} from "Leaf.lspkg/Utils/common/Utils"

/** Longest scan sequence (10 cubes) settles in about 2.1 s; allow headroom. */
export const SCAN_SETTLE_MS = 2900

export class HonestLabelLeafInteractor extends DefaultLeafInteractor {
  private async pinchNamed(name: string): Promise<void> {
    const target = findInteractablesByName(name, undefined, true)[0]
    if (!target) {
      throw new Error(`Interactable "${name}" not found or not enabled`)
    }
    await this.trigger(target)
  }

  /** Pinch a product: scans it, or clears it if it is already scanned. */
  async pinchProduct(key: string): Promise<void> {
    await this.pinchNamed("HL_Product_" + key)
    await sleep(SCAN_SETTLE_MS)
  }

  async pressReset(): Promise<void> {
    await this.pinchNamed("HL_ResetTab")
    await sleep(400)
  }

  /** Every scenario starts from a known, empty counter. */
  async startClean(): Promise<void> {
    await this.pressReset()
  }
}

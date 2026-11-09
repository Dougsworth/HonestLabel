// Shared read helpers for the Honest Label LEAF scenarios.
// Everything here reads the LIVE scene graph, so a passing assertion means the
// object really exists and really renders -- not just that a counter says so.

import {findSceneObjectByName} from "Leaf.lspkg/Utils/common/Utils"

const MAX_CUBES = 12

export function sceneObj(name: string): SceneObject {
  const o = findSceneObjectByName(name)
  return isNull(o) ? null : o
}

/** True when the object exists and is enabled all the way up the hierarchy. */
export function visible(name: string): boolean {
  const o = sceneObj(name)
  return o !== null && o.isEnabledInHierarchy
}

/** Sugar cubes actually on the counter for this product, right now. */
export function visibleCubeCount(key: string): number {
  let n = 0
  for (let i = 0; i < MAX_CUBES; i++) {
    if (visible("HL_Cube_" + key + "_" + i)) {
      n++
    }
  }
  return n
}

export function textOf(name: string): string {
  const o = sceneObj(name)
  if (o === null) {
    return ""
  }
  const t = o.getComponent("Component.Text") as Text
  return isNull(t) ? "" : t.text
}

/** World X of a pile, used to prove two piles sit side by side. */
export function pileX(key: string): number {
  const o = sceneObj("HL_Pile_" + key)
  return o === null ? NaN : o.getTransform().getWorldPosition().x
}

export const VERDICT = (key: string) => "HL_Verdict_" + key
export const COUNT = (key: string) => "HL_Count_" + key
export const PRICE = (key: string) => "HL_Price_" + key
export const TRUTH = (key: string) => "Truth_" + key
export const OVERLAY = (key: string) => "HL_Overlay_" + key
export const PRODUCT = (key: string) => "HL_Product_" + key

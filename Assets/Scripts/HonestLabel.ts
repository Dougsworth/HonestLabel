// Honest Label — the marketing claim on a product gets answered by the truth,
// in units your brain gets instantly: real sugar cubes, at real size, on the counter.
//
// Built entirely at runtime from this one script so the layout stays in centimetres
// in one place and every object is created deterministically.
//
// Layout note (see devpost/design-brief.md "Risks"): the learner placed the counter
// 90 cm high and 60 cm in front, and the brief says the user steps back to 100-110 cm
// for the full moment, with permission to "move the counter further out rather than
// shrinking the real-size products". The counter is therefore kept at 90 cm high with
// real-size products, but placed so the products sit ~115 cm out -- the stepped-back
// geometry, reachable from where the preview starts without walking backwards.

import {Interactable} from "SpectaclesInteractionKit.lspkg/Components/Interaction/Interactable/Interactable"
import {PRODUCTS, ProductData} from "./HonestLabelData"

// Each cube's landing click, played spatially at the cube's own position.
// Three variants, cycled, so ten cubes in a row never sound mechanical.
const CUBE_CLICKS: AudioTrackAsset[] = [
  requireAsset("../GeneratedSFX/HL_CubeClick1.wav") as AudioTrackAsset,
  requireAsset("../GeneratedSFX/HL_CubeClick2.wav") as AudioTrackAsset,
  requireAsset("../GeneratedSFX/HL_CubeClick3.wav") as AudioTrackAsset
]

// ---------------------------------------------------------------- layout (cm)

const EYE_Y = 0 // the camera starts at eye height, so the world origin is the eye
const COUNTER_HEIGHT = 90
const EYE_HEIGHT = 160
const COUNTER_Y = EYE_Y - (EYE_HEIGHT - COUNTER_HEIGHT) // counter top = -70

const COUNTER_FRONT_Z = -95
const COUNTER_DEPTH = 60
const COUNTER_WIDTH = 120
const COUNTER_BACK_Z = COUNTER_FRONT_Z - COUNTER_DEPTH

const PRODUCT_Z = -118 // products sit 23 cm back from the front edge

// Sugar pile sits beside the product and a little toward the user, so it never
// collides with the neighbouring product and is never occluded by it.
const PILE_DX = 10
const PILE_DZ = 14

const CUBE_CM = 1.5
const CUBE_GAP = 0.35
const CUBE_PITCH = CUBE_CM + CUBE_GAP
const CUBES_PER_ROW = 5 // countable rows of 5, so 10 reads as 10

const VERDICT_ABOVE_TOP = 6
const STRIKE_INSET = 1.5 // strike runs the width of the claim
const TAG_WIDTH = 13 // wider than the 8 cm default so the truth reads at 115 cm

const HINT_Z = COUNTER_FRONT_Z - 5
const TAB_X = 30 // right end of the *viewable* counter, so the tab stays in view
const RESET_Z = COUNTER_FRONT_Z - 5
const ASK_Z = COUNTER_FRONT_Z - 14

// Content sits ~70 cm below eye level at ~115 cm out, so the user looks down about
// 31 degrees at it. Product-attached text is pitched up to meet that gaze.
const GAZE_PITCH_DEG = -31
const COUNTER_PITCH_DEG = -70 // things "lying on the counter": flat-ish but legible

// ---------------------------------------------------------------- look

const C_TEXT = new vec4(0.96, 0.97, 1.0, 1.0)
const C_TEXT_DIM = new vec4(0.62, 0.66, 0.72, 1.0)
const C_VERDICT = new vec4(1.0, 0.93, 0.74, 1.0)
const C_CLAIM = new vec4(0.93, 0.95, 0.99, 1.0)

const TEXT_SIZE = 48
// StudioLib: in world space the em square height in cm is `size / 43.886`.
// All text sizing goes through textScaleFor(), so heights stay in centimetres.
const TEXT_CM_AT_SCALE_1 = TEXT_SIZE / 43.886

// ---------------------------------------------------------------- timing (s)

const SCAN_SWEEP = 0.5
const CUBE_STAGGER = 0.09
const CUBE_FALL = 0.26
const CUBE_RISE = 12 // cubes start this far above their slot
const REVEAL_FADE = 0.5

// ---------------------------------------------------------------- tweens

type Tween = {
  owner: string
  t: number
  delay: number
  dur: number
  update: (k: number) => void
  done?: () => void
}

function easeInQuad(k: number): number {
  return k * k
}
function easeOutQuad(k: number): number {
  return 1 - (1 - k) * (1 - k)
}

// ---------------------------------------------------------------- per product overlay

type Overlay = {
  data: ProductData
  root: SceneObject
  body: SceneObject
  bodyMat: Material
  claimText: Text
  scanLine: SceneObject
  // overlay pieces, all hidden until scanned
  overlayRoot: SceneObject
  strike: SceneObject
  truthText: Text
  verdictText: Text
  priceText: Text
  pileRoot: SceneObject
  cubes: SceneObject[]
  cubeAudio: AudioComponent[]
  askText: Text
  countText: Text
  scanned: boolean
}

@component
export class HonestLabel extends BaseScriptComponent {
  @input font: Font
  @input boxMesh: RenderMesh
  @input cylMesh: RenderMesh
  @input planeMesh: RenderMesh
  @input matSugar: Material
  @input matCounter: Material
  @input matAmber: Material
  @input matGold: Material
  @input matWater: Material
  @input matHighlight: Material
  @input matRule: Material

  // Two near-white shades alternated across the pile. Unlit cubes of one flat
  // white merge into a single block at 110 cm, so 10 stops reading as 10.
  private cubeMatA: Material
  private cubeMatB: Material
  private root: SceneObject
  private overlays: Overlay[] = []
  private byKey: {[k: string]: Overlay} = {}
  private hint: SceneObject
  private tweens: Tween[] = []
  /** Most recently scanned product key -- the Ask tab acts on this one. */
  private lastScanned: string = null

  onAwake() {
    this.root = global.scene.createSceneObject("HonestLabel")
    this.root.setParent(this.sceneObject)

    this.cubeMatA = this.matSugar
    this.cubeMatB = this.matSugar.clone()
    this.cubeMatB.mainPass.baseColor = new vec4(0.70, 0.74, 0.80, 1)

    this.buildCounter()
    for (const data of PRODUCTS) {
      const ov = this.buildProduct(data)
      this.overlays.push(ov)
      this.byKey[data.key] = ov
    }
    this.buildHint()
    this.buildTabs()

    this.createEvent("UpdateEvent").bind(() => this.onUpdate())

    // SIK event subscriptions must bind inside OnStartEvent.
    this.createEvent("OnStartEvent").bind(() => this.bindInteractions())

    print("[HonestLabel] ready -- " + this.overlays.length + " products on the counter")
  }

  // ------------------------------------------------------------ build helpers

  private obj(name: string, parent: SceneObject): SceneObject {
    const o = global.scene.createSceneObject(name)
    o.setParent(parent)
    return o
  }

  private mesh(
    name: string,
    parent: SceneObject,
    mesh: RenderMesh,
    mat: Material,
    pos: vec3,
    scale: vec3,
    pitchDeg: number = 0
  ): SceneObject {
    const o = this.obj(name, parent)
    const t = o.getTransform()
    t.setLocalPosition(pos)
    t.setLocalScale(scale)
    if (pitchDeg !== 0) {
      t.setLocalRotation(quat.fromEulerAngles((pitchDeg * Math.PI) / 180, 0, 0))
    }
    const rmv = o.createComponent("Component.RenderMeshVisual") as RenderMeshVisual
    rmv.mesh = mesh
    rmv.mainMaterial = mat
    return o
  }

  /** Pitch for a Plane whose +Y normal must face the same way as text at facePitch. */
  private planePitch(facePitchDeg: number): number {
    return 90 + facePitchDeg
  }

  private textScaleFor(heightCm: number): number {
    return heightCm / TEXT_CM_AT_SCALE_1
  }

  private text(
    name: string,
    parent: SceneObject,
    content: string,
    heightCm: number,
    color: vec4,
    pos: vec3,
    pitchDeg: number,
    maxWidthCm: number = 0
  ): Text {
    const o = this.obj(name, parent)
    const t = o.getTransform()
    t.setLocalPosition(pos)
    const s = this.textScaleFor(heightCm)
    t.setLocalScale(new vec3(s, s, s))
    t.setLocalRotation(quat.fromEulerAngles((pitchDeg * Math.PI) / 180, 0, 0))

    const txt = o.createComponent("Component.Text") as Text
    txt.text = content
    if (this.font) {
      txt.font = this.font
    }
    txt.size = TEXT_SIZE
    txt.textFill.color = color
    txt.horizontalAlignment = HorizontalAlignment.Center
    txt.verticalAlignment = VerticalAlignment.Center
    if (maxWidthCm > 0) {
      // layoutRect is in the text's own (scaled) units, so convert cm -> local
      const hw = maxWidthCm / s / 2
      txt.layoutRect = Rect.create(-hw, hw, -12, 12)
      txt.horizontalOverflow = HorizontalOverflow.Wrap
    }
    return txt
  }

  private setAlpha(txt: Text, a: number) {
    const c = txt.textFill.color
    txt.textFill.color = new vec4(c.r, c.g, c.b, a)
  }

  // ------------------------------------------------------------ counter

  // A thin light outline plus a few surface lines: the counter reads as a real
  // surface without becoming a heavy bright panel on an additive display.
  private buildCounter() {
    const c = this.obj("HL_Counter", this.root)
    const bar = 0.8
    const y = COUNTER_Y
    const midZ = (COUNTER_FRONT_Z + COUNTER_BACK_Z) / 2

    // perimeter
    this.mesh("edge_front", c, this.boxMesh, this.matCounter,
      new vec3(0, y, COUNTER_FRONT_Z), new vec3(COUNTER_WIDTH, bar, bar))
    this.mesh("edge_back", c, this.boxMesh, this.matCounter,
      new vec3(0, y, COUNTER_BACK_Z), new vec3(COUNTER_WIDTH, bar, bar))
    this.mesh("edge_left", c, this.boxMesh, this.matCounter,
      new vec3(-COUNTER_WIDTH / 2, y, midZ), new vec3(bar, bar, COUNTER_DEPTH))
    this.mesh("edge_right", c, this.boxMesh, this.matCounter,
      new vec3(COUNTER_WIDTH / 2, y, midZ), new vec3(bar, bar, COUNTER_DEPTH))

    // faint surface lines so the plane of the counter reads
    const thin = 0.25
    for (let x = -40; x <= 40; x += 20) {
      this.mesh("grid_x_" + x, c, this.boxMesh, this.matCounter,
        new vec3(x, y, midZ), new vec3(thin, thin, COUNTER_DEPTH))
    }
    for (let z = COUNTER_FRONT_Z - 20; z > COUNTER_BACK_Z; z -= 20) {
      this.mesh("grid_z_" + z, c, this.boxMesh, this.matCounter,
        new vec3(0, y, z), new vec3(COUNTER_WIDTH, thin, thin))
    }
  }

  // ------------------------------------------------------------ product

  private buildProduct(d: ProductData): Overlay {
    const halfH = d.heightCm / 2
    const frontZ = d.depthCm / 2

    // root sits at the product's centre so a box collider centres on it
    const root = this.obj("HL_Product_" + d.key, this.root)
    root.getTransform().setLocalPosition(new vec3(d.xCm, COUNTER_Y + halfH, PRODUCT_Z))

    const baseMat =
      d.key === "sunny" ? this.matAmber : d.key === "granola" ? this.matGold : this.matWater
    // clone so hover highlight is per product
    const bodyMat = baseMat.clone()

    let body: SceneObject
    if (d.shape === "bottle") {
      body = this.mesh("Body", root, this.cylMesh, bodyMat,
        new vec3(0, 0, 0), new vec3(d.widthCm, d.heightCm, d.depthCm))
      // neck + cap, so a bottle reads as a bottle
      this.mesh("Neck", root, this.cylMesh, bodyMat,
        new vec3(0, halfH + 1.4, 0), new vec3(2.6, 2.8, 2.6))
      this.mesh("Cap", root, this.cylMesh, bodyMat,
        new vec3(0, halfH + 3.3, 0), new vec3(3.0, 1.6, 3.0))
    } else {
      body = this.mesh("Body", root, this.boxMesh, bodyMat,
        new vec3(0, 0, 0), new vec3(d.widthCm, d.heightCm, d.depthCm))
    }

    // brand + claim printed on the front of the pack
    const brandCm = Math.min(2.0, d.widthCm * 0.19)
    const claimCm = Math.min(1.5, d.widthCm * 0.155)
    this.text("Brand_" + d.key, root, d.brand, brandCm, C_TEXT,
      new vec3(0, halfH * 0.52, frontZ + 0.35), GAZE_PITCH_DEG, d.widthCm - 0.6)
    const claimText = this.text("Claim_" + d.key, root, d.claim, claimCm, C_CLAIM,
      new vec3(0, halfH * 0.1, frontZ + 0.35), GAZE_PITCH_DEG, d.widthCm - 0.6)

    // --- scan line: a soft light bar that sweeps down the product
    const scanLine = this.mesh("HL_ScanLine_" + d.key, root, this.planeMesh, this.matHighlight,
      new vec3(0, halfH, 0), new vec3(d.widthCm + 3, 1, d.depthCm + 3))
    scanLine.enabled = false

    // --- overlay (everything that appears on scan)
    const overlayRoot = this.obj("HL_Overlay_" + d.key, this.root)
    overlayRoot.enabled = false

    // tag pinned onto the claim: a thin bright rule struck through the claim,
    // with the truth sitting directly under it. No panel behind it.
    const tag = this.obj("HL_Tag_" + d.key, overlayRoot)
    tag.getTransform().setLocalPosition(
      new vec3(d.xCm, COUNTER_Y + halfH + halfH * 0.1, PRODUCT_Z + frontZ + 0.6)
    )
    const strikeW = d.widthCm - STRIKE_INSET
    const strike = this.mesh("Strike", tag, this.planeMesh, this.matRule,
      new vec3(0, 0, 0), new vec3(strikeW, 1, 0.32), this.planePitch(GAZE_PITCH_DEG))
    const truthText = this.text("Truth_" + d.key, tag, d.truth, 1.3, C_TEXT,
      new vec3(0, -6.4, 0.4), GAZE_PITCH_DEG, TAG_WIDTH)

    // verdict, 6 cm above the top, light text, no panel
    const verdictText = this.text("HL_Verdict_" + d.key, overlayRoot, d.verdict, 1.7, C_VERDICT,
      new vec3(d.xCm, COUNTER_Y + d.heightCm + VERDICT_ABOVE_TOP, PRODUCT_Z + frontZ),
      GAZE_PITCH_DEG, 21)

    // price line at the base
    const priceText = this.text("HL_Price_" + d.key, overlayRoot, d.price, 1.2, C_TEXT,
      new vec3(d.xCm, COUNTER_Y + 1.3, PRODUCT_Z + frontZ + 1.2), GAZE_PITCH_DEG, 16)

    // --- sugar pile beside the product
    const pileRoot = this.obj("HL_Pile_" + d.key, overlayRoot)
    const pileX = d.xCm + PILE_DX
    const pileZ = PRODUCT_Z + PILE_DZ
    pileRoot.getTransform().setLocalPosition(new vec3(pileX, COUNTER_Y, pileZ))

    const cubes: SceneObject[] = []
    const cubeAudio: AudioComponent[] = []
    for (let i = 0; i < d.teaspoons; i++) {
      const slot = this.cubeSlot(i, d.teaspoons)
      const row = Math.floor(i / CUBES_PER_ROW)
      const col = i % CUBES_PER_ROW
      const mat = (row + col) % 2 === 0 ? this.cubeMatA : this.cubeMatB
      const cube = this.mesh("HL_Cube_" + d.key + "_" + i, pileRoot, this.boxMesh, mat,
        slot, new vec3(CUBE_CM, CUBE_CM, CUBE_CM))
      cubes.push(cube)

      const click = cube.createComponent("Component.AudioComponent") as AudioComponent
      click.audioTrack = CUBE_CLICKS[i % CUBE_CLICKS.length]
      click.spatialAudio.enabled = true
      click.volume = 0.55
      cubeAudio.push(click)
    }

    if (d.teaspoons === 0) {
      const w = CUBES_PER_ROW * CUBE_PITCH
      const dpt = CUBE_PITCH
      const bar = 0.18
      for (const sx of [-1, 1]) {
        this.mesh("EmptySpot_x" + sx, pileRoot, this.boxMesh, this.matCounter,
          new vec3((sx * w) / 2, 0.1, 0), new vec3(bar, bar, dpt))
      }
      for (const sz of [-1, 1]) {
        this.mesh("EmptySpot_z" + sz, pileRoot, this.boxMesh, this.matCounter,
          new vec3(0, 0.1, (sz * dpt) / 2), new vec3(w, bar, bar))
      }
    }

    // tiny count under the pile, lying on the counter
    const countLabel = d.teaspoons + " tsp sugar"
    const countText = this.text("HL_Count_" + d.key, overlayRoot, countLabel, 1.5, C_TEXT,
      new vec3(pileX, COUNTER_Y + 0.4, pileZ + 5.5), COUNTER_PITCH_DEG, 18)

    const askText = this.text("HL_Ask_" + d.key, overlayRoot, "", 1.15, C_VERDICT,
      new vec3(d.xCm, COUNTER_Y + halfH + halfH * 0.1 - 10.5, PRODUCT_Z + frontZ + 1.4),
      GAZE_PITCH_DEG, TAG_WIDTH)
    askText.getSceneObject().enabled = false

    return {
      data: d, root, body, bodyMat, claimText, scanLine,
      overlayRoot, strike, truthText, verdictText, priceText,
      pileRoot, cubes, cubeAudio, countText, askText, scanned: false
    }
  }

  /**
   * Slot for cube i: countable rows of 5 that stack upward, so the pile reads
   * as a wall facing the user and 10 reads as 10 at a glance. Laid out flat on
   * the counter the back row hides behind the front one from a standing eye line.
   */
  private cubeSlot(i: number, total: number): vec3 {
    const row = Math.floor(i / CUBES_PER_ROW)
    const col = i % CUBES_PER_ROW
    const inThisRow = Math.min(CUBES_PER_ROW, total - row * CUBES_PER_ROW)
    const x = (col - (inThisRow - 1) / 2) * CUBE_PITCH
    const y = CUBE_CM / 2 + row * CUBE_PITCH
    return new vec3(x, y, 0)
  }

  // ------------------------------------------------------------ hint + tabs

  private buildHint() {
    this.hint = this.obj("HL_Hint", this.root)
    this.text("HintText", this.hint, "Pinch a product", 2.0, C_TEXT_DIM,
      new vec3(0, COUNTER_Y + 0.4, HINT_Z), COUNTER_PITCH_DEG, 30)
  }

  private tab: {[k: string]: SceneObject} = {}

  private buildTabs() {
    this.tab["reset"] = this.buildTab("HL_ResetTab", "Reset", RESET_Z)
    // Ask tab is the optional AI extra; it is never on the path to a passing test.
    this.tab["ask"] = this.buildTab("HL_AskTab", "Ask", ASK_Z)
  }

  private buildTab(name: string, label: string, z: number): SceneObject {
    const t = this.obj(name, this.root)
    t.getTransform().setLocalPosition(new vec3(TAB_X, COUNTER_Y + 1.6, z))
    // a 6 x 3 cm thin tab, angled toward the user
    const pitch = -55
    this.mesh("Plate", t, this.planeMesh, this.matCounter,
      new vec3(0, 0, 0), new vec3(6, 1, 3), this.planePitch(pitch))
    this.text("Label", t, label, 1.6, C_TEXT, new vec3(0, 0.5, 0.5), pitch, 6)

    const col = t.createComponent("Physics.ColliderComponent") as ColliderComponent
    const shape = Shape.createBoxShape()
    shape.size = new vec3(7, 4, 5)
    col.shape = shape
    col.fitVisual = false
    return t
  }

  // ------------------------------------------------------------ interaction

  private bindInteractions() {
    for (const ov of this.overlays) {
      const d = ov.data
      const col = ov.root.createComponent("Physics.ColliderComponent") as ColliderComponent
      const shape = Shape.createBoxShape()
      shape.size = new vec3(d.widthCm, d.heightCm, d.depthCm)
      col.shape = shape
      col.fitVisual = false

      const it = ov.root.createComponent(Interactable.getTypeName()) as Interactable
      it.targetingMode = 3 // Direct + Indirect, so the mouse works in preview
      it.onTriggerStart.add(() => this.onProductPinch(ov))
      it.onHoverEnter.add(() => this.setHighlight(ov, true))
      it.onHoverExit.add(() => this.setHighlight(ov, false))
    }

    const resetIt = this.tab["reset"].createComponent(Interactable.getTypeName()) as Interactable
    resetIt.targetingMode = 3
    resetIt.onTriggerStart.add(() => this.resetAll())

    const askIt = this.tab["ask"].createComponent(Interactable.getTypeName()) as Interactable
    askIt.targetingMode = 3
    askIt.onTriggerStart.add(() => this.onAsk())
  }

  private setHighlight(ov: Overlay, on: boolean) {
    const base = ov.bodyMat.mainPass.baseColor
    // a soft lift in brightness -- no glow, no outline shader
    const k = on ? 1.35 : 1.0
    const stored = (ov as any)._baseColor as vec4
    if (!stored) {
      ;(ov as any)._baseColor = new vec4(base.r, base.g, base.b, base.a)
    }
    const b = (ov as any)._baseColor as vec4
    ov.bodyMat.mainPass.baseColor = new vec4(
      Math.min(1, b.r * k), Math.min(1, b.g * k), Math.min(1, b.b * k), b.a
    )
  }

  private onProductPinch(ov: Overlay) {
    if (ov.scanned) {
      this.clearProduct(ov)
    } else {
      this.scanProduct(ov)
    }
  }

  // ------------------------------------------------------------ scan

  private scanProduct(ov: Overlay) {
    const d = ov.data
    ov.scanned = true
    this.lastScanned = d.key
    this.hint.enabled = false

    ov.overlayRoot.enabled = true
    ov.scanLine.enabled = true
    ov.askText.getSceneObject().enabled = false

    const halfH = d.heightCm / 2

    // hide the pieces we are about to reveal
    const strikeW = d.widthCm - STRIKE_INSET
    ov.strike.getTransform().setLocalScale(new vec3(0, 1, 0.32))
    this.setAlpha(ov.truthText, 0)
    this.setAlpha(ov.verdictText, 0)
    this.setAlpha(ov.priceText, 0)
    this.setAlpha(ov.countText, 0)
    for (const c of ov.cubes) {
      c.enabled = false
    }

    // 1. soft scan line sweeps down the product (0.5 s)
    this.tween(d.key, 0, SCAN_SWEEP, (k) => {
      const y = halfH - k * d.heightCm
      ov.scanLine.getTransform().setLocalPosition(new vec3(0, y, 0))
    }, () => {
      ov.scanLine.enabled = false
    })

    // 2. cubes drop one by one, each into its own slot in the pile
    for (let i = 0; i < ov.cubes.length; i++) {
      const cube = ov.cubes[i]
      const slot = this.cubeSlot(i, d.teaspoons)
      const delay = SCAN_SWEEP + i * CUBE_STAGGER
      this.tween(d.key, delay, CUBE_FALL, (k) => {
        cube.enabled = true
        const e = easeInQuad(k)
        const y = slot.y + CUBE_RISE * (1 - e)
        cube.getTransform().setLocalPosition(new vec3(slot.x, y, slot.z))
        // a small squash as it lands reads as weight without real physics
        const squash = k > 0.82 ? 1 - (k - 0.82) * 0.9 : 1
        cube.getTransform().setLocalScale(
          new vec3(CUBE_CM / squash, CUBE_CM * squash, CUBE_CM / squash)
        )
      }, () => {
        cube.getTransform().setLocalPosition(slot)
        cube.getTransform().setLocalScale(new vec3(CUBE_CM, CUBE_CM, CUBE_CM))
        ov.cubeAudio[i].play(1)
      })
    }

    // 3. tag, verdict, price and count fade in. Whole sequence stays under 3 s.
    const cubesEnd = ov.cubes.length > 0
      ? SCAN_SWEEP + (ov.cubes.length - 1) * CUBE_STAGGER + CUBE_FALL
      : SCAN_SWEEP
    const revealAt = cubesEnd + 0.05

    this.tween(d.key, revealAt, REVEAL_FADE, (k) => {
      const e = easeOutQuad(k)
      ov.strike.getTransform().setLocalScale(new vec3(strikeW * e, 1, 0.32))
      // the claim fades back as the truth takes over
      ov.claimText.textFill.color = new vec4(
        C_CLAIM.r + (C_TEXT_DIM.r - C_CLAIM.r) * e,
        C_CLAIM.g + (C_TEXT_DIM.g - C_CLAIM.g) * e,
        C_CLAIM.b + (C_TEXT_DIM.b - C_CLAIM.b) * e, 1)
      this.setAlpha(ov.truthText, e)
      this.setAlpha(ov.verdictText, e)
      this.setAlpha(ov.priceText, e)
      this.setAlpha(ov.countText, e)
    })

    print("[HonestLabel] scanned " + d.brand + " -- " + d.teaspoons + " tsp, \"" + d.verdict + "\"")
  }

  private clearProduct(ov: Overlay) {
    this.cancel(ov.data.key)
    ov.scanned = false
    ov.overlayRoot.enabled = false
    ov.scanLine.enabled = false
    ov.askText.getSceneObject().enabled = false
    ov.claimText.textFill.color = C_CLAIM
    if (this.lastScanned === ov.data.key) {
      this.lastScanned = null
      for (const o of this.overlays) {
        if (o.scanned) {
          this.lastScanned = o.data.key
        }
      }
    }
    print("[HonestLabel] cleared " + ov.data.brand)
  }

  private resetAll() {
    for (const ov of this.overlays) {
      this.cancel(ov.data.key)
      ov.scanned = false
      ov.overlayRoot.enabled = false
      ov.scanLine.enabled = false
      ov.askText.getSceneObject().enabled = false
      ov.claimText.textFill.color = C_CLAIM
      this.setHighlight(ov, false)
    }
    this.lastScanned = null
    this.hint.enabled = true
    print("[HonestLabel] reset -- everything cleared, hint is back")
  }

  private onAsk() {
    // Optional AI extra. The hard coded verdict is the fallback and is already
    // on screen, so this is never on the path to a passing test.
    if (!this.lastScanned) {
      print("[HonestLabel] Ask: nothing scanned yet")
      return
    }
    const ov = this.byKey[this.lastScanned]
    // Remote Service Gateway is not wired, so this answers from the hard coded
    // verdict -- exactly the fallback path the brief asks for. Labelled so the
    // demo never claims an AI answer it did not get.
    ov.askText.text = ov.data.verdict + "  (offline answer)"
    ov.askText.getSceneObject().enabled = true
    this.setAlpha(ov.askText, 1)
    print("[HonestLabel] Ask: offline answer for " + ov.data.brand +
      " -- \"" + ov.data.verdict + "\"")
  }

  // ------------------------------------------------------------ tween runtime

  private tween(owner: string, delay: number, dur: number,
                update: (k: number) => void, done?: () => void) {
    this.tweens.push({owner, t: 0, delay, dur, update, done})
  }

  private cancel(owner: string) {
    const keep: Tween[] = []
    for (const tw of this.tweens) {
      if (tw.owner !== owner) {
        keep.push(tw)
      }
    }
    this.tweens = keep
  }

  private onUpdate() {
    if (this.tweens.length === 0) {
      return
    }
    const dt = getDeltaTime()
    const alive: Tween[] = []
    for (const tw of this.tweens) {
      tw.t += dt
      if (tw.t < tw.delay) {
        alive.push(tw)
        continue
      }
      const k = Math.min(1, (tw.t - tw.delay) / tw.dur)
      tw.update(k)
      if (k < 1) {
        alive.push(tw)
      } else if (tw.done) {
        tw.done()
      }
    }
    this.tweens = alive
  }

  // ------------------------------------------------------------ test hooks
  // Small, stable surface for LEAF scenarios to assert against.

  public isScanned(key: string): boolean {
    const ov = this.byKey[key]
    return ov ? ov.scanned : false
  }

  public visibleCubeCount(key: string): number {
    const ov = this.byKey[key]
    if (!ov || !ov.overlayRoot.enabled) {
      return 0
    }
    let n = 0
    for (const c of ov.cubes) {
      if (c.enabled) {
        n++
      }
    }
    return n
  }

  public countLabel(key: string): string {
    const ov = this.byKey[key]
    return ov ? ov.countText.text : ""
  }

  public verdictOf(key: string): string {
    const ov = this.byKey[key]
    return ov && ov.overlayRoot.enabled ? ov.verdictText.text : ""
  }

  public truthOf(key: string): string {
    const ov = this.byKey[key]
    return ov && ov.overlayRoot.enabled ? ov.truthText.text : ""
  }

  public overlayVisible(key: string): boolean {
    const ov = this.byKey[key]
    return ov ? ov.overlayRoot.enabled : false
  }

  public hintVisible(): boolean {
    return this.hint.enabled
  }

  /** Lets a LEAF scenario drive the flow without depending on cursor aim. */
  public pinchProduct(key: string) {
    const ov = this.byKey[key]
    if (ov) {
      this.onProductPinch(ov)
    }
  }

  public pressReset() {
    this.resetAll()
  }
}

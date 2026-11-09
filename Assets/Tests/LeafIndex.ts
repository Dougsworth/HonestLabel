import {scenariosIndex} from "Leaf.lspkg/Scenarios/decorator/ScenarioIndexDecorator"
import {ScenarioMetadata} from "Leaf.lspkg/Scenarios/scenario/ScenarioMetadata"
import {Criterion1Scenario} from "./Criterion1Scenario"
import {Criterion2Scenario} from "./Criterion2Scenario"
import {Criterion3Scenario} from "./Criterion3Scenario"
import {Criterion4Scenario} from "./Criterion4Scenario"
import {Criterion5Scenario} from "./Criterion5Scenario"
import {AskTabScenario} from "./AskTabScenario"

@component
export class LeafIndex extends BaseScriptComponent {
  @scenariosIndex
  static scenariosIndex: ScenarioMetadata[] = [
    {id: "c1-sunny-splash-10-cubes", typename: Criterion1Scenario.getTypeName()},
    {id: "c2-two-piles-side-by-side", typename: Criterion2Scenario.getTypeName()},
    {id: "c3-water-zero-cubes", typename: Criterion3Scenario.getTypeName()},
    {id: "c4-pinch-again-clears", typename: Criterion4Scenario.getTypeName()},
    {id: "c5-reset-restores-hint", typename: Criterion5Scenario.getTypeName()},
    {id: "extra-ask-tab-offline-fallback", typename: AskTabScenario.getTypeName()}
  ]
}

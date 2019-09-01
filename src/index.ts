import 'babylonjs-loaders';
import setupDemoScene from './Scenes/DemoScene';
import { initChooseSceneUI, initUI, initUtilityButtons } from './Interaction/UI';
import Game from './Game';
import setupSandboxScene from './Scenes/SandboxScene';
import setupZenScene from './Scenes/ZenScene';

// Make sure this is the first thing we do.
Game.getInstance();

const gui = initUI();
initChooseSceneUI(gui);
initUtilityButtons(gui);

const params = new URLSearchParams(window.location.search);
const selectedScene = params.get("scene");
switch(selectedScene) {
    case "demo":
        setupDemoScene();
        break;
    case "sandbox":
        setupSandboxScene(gui);
        break;
    case "zen":
        setupZenScene(gui);
        break;
    default:
        setupZenScene(gui);
}


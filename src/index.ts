import 'babylonjs-loaders';
import setupDemoScene from './Scenes/DemoScene';
import { initChooseSceneUI } from './Interaction/UI';
import Game from './Game';
import setupZenScene from './Scenes/ZenScene';

// Make sure this is the first thing we do.
Game.getInstance();

initChooseSceneUI();

const params = new URLSearchParams(window.location.search);
const selectedScene = params.get("scene");
switch(selectedScene) {
    case "demo":
        setupDemoScene();
        break;
    case "zen":
        setupZenScene();
        break;
    default:
        setupDemoScene();
}


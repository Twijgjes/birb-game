import 'babylonjs-loaders';

import { Engine, Scene } from 'babylonjs';
import TWEEN from '@tweenjs/tween.js';
import { Updateables } from './Utils/Updateable';
import setupDemoScene from './Scenes/DemoScene';

let canvas: HTMLCanvasElement, 
    engine: Engine, 
    scene: Scene;

function init() {
    // Get the canvas DOM element
    canvas = document.getElementById('renderCanvas') as HTMLCanvasElement;
    engine = new Engine(canvas, true, { preserveDrawingBuffer: true, stencil: true });
    // Create a basic BJS Scene object
    scene = new Scene(engine);
    scene.beforeRender = function() {
        const delta = engine.getDeltaTime();
        TWEEN.update();
        Updateables.getInstance().update(delta / 1000);
    }

    // run the render loop
    engine.runRenderLoop(function () {
        scene.render();
    });
    // the canvas/window resize event handler
    window.addEventListener('resize', function () {
        engine.resize();
    });
}

// call the createScene function
init();
setupDemoScene(scene, engine, canvas);


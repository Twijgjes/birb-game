import 'babylonjs-loaders';

import setupCameraAndControls from './Interaction/Camera';
// import CANNON from 'cannon';
import { generateTerrainMesh, generateTerrainTiles, generateHeightMap } from './TerrainGenerator';
import { Vector3, Engine, ShadowGenerator, CannonJSPlugin } from 'babylonjs';
import { generateFlowerBed, placeFlowerBedsOnGround } from './FloraGenerator';
import { setupEnvironment } from './Environment';
import { generateTreesInRadius } from './TreeGenerator';
import { generateBushesInRadius } from './BushGenerator';
import { generateButterfly, generateButterflies } from './ButterflyGenerator';
import TWEEN from '@tweenjs/tween.js';
import { Updateables } from './Utils/Updateable';
import { initUI } from './Interaction/UI';
import { makeSea } from './Sea';

// Get the canvas DOM element
var canvas = document.getElementById('renderCanvas') as HTMLCanvasElement;
console.info("Got canvas:", canvas);
// Load the 3D engine
var engine = new Engine(canvas, true, { preserveDrawingBuffer: true, stencil: true });
// CreateScene function that creates and return the scene
var createScene = function () {
    const scene = setupEnvironment(engine);
    // const gravityVector = new Vector3(0,-9.81, 0);
    // const physicsPlugin = new CannonJSPlugin();
    // scene.enablePhysics(gravityVector, physicsPlugin);

    const size = 128;
    const heightMap = generateHeightMap(size);
    const terrain = generateTerrainMesh(scene, size, heightMap);
    // terrain.position = new Vector3(-32, -20, 0);
    terrain.receiveShadows = true;
    // const terrainMeshes = generateTerrainTiles(scene, 64, 16);
    const center = new Vector3(64, 0, 64);

    console.info("Flowers");
    placeFlowerBedsOnGround(scene, heightMap);
    generateFlowerBed(scene, Vector3.Zero());
    console.info("Trees");
    generateTreesInRadius(scene, center, 50, 25, heightMap);
    console.info("Bushes");
    generateBushesInRadius(scene, 54, center, 50, heightMap);
    console.info("Butterflies");
    generateButterflies(scene, 100, center, 40);
    console.info("Sea");
    makeSea(scene, size * 1.5, center.add(new Vector3(0, .5, 0)));
    console.info("UI");
    initUI(engine);


    // Camera and controls setup
    // For normal use
    // const camera = setupCameraAndControls(canvas, scene, engine, new Vector3(50, 5, 50));
    // For dev
    const camera = setupCameraAndControls(canvas, scene, engine, new Vector3(0, 5, -10));

    // Return the created scene
    return scene;
}
// call the createScene function
var scene = createScene();

scene.beforeRender = function() {
    const delta = engine.getDeltaTime();
    // console.info(delta);
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
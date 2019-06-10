import 'babylonjs-loaders';

import setupCameraAndControls from './Interaction/Camera';
import { generateTerrainMesh, generateTerrainTiles, generateHeightMap } from './TerrainGenerator';
import { Vector3, Engine, ShadowGenerator } from 'babylonjs';
import { generateFlowerBed, placeFlowerBedsOnGround } from './FloraGenerator';
import { setupEnvironment } from './Environment';

// Get the canvas DOM element
var canvas = document.getElementById('renderCanvas') as HTMLCanvasElement;
console.info("Got canvas:", canvas);
// Load the 3D engine
var engine = new Engine(canvas, true, { preserveDrawingBuffer: true, stencil: true });
// CreateScene function that creates and return the scene
var createScene = function () {
    const scene = setupEnvironment(engine);

    const heightMap = generateHeightMap(128);
    const terrain = generateTerrainMesh(scene, 128, heightMap);
    // terrain.position = new Vector3(-32, -20, 0);
    terrain.receiveShadows = true;
    // const terrainMeshes = generateTerrainTiles(scene, 64, 16);
    placeFlowerBedsOnGround(scene, heightMap);
    generateFlowerBed(scene, Vector3.Zero());

    // Camera and controls setup
    const camera = setupCameraAndControls(canvas, scene);

    // Return the created scene
    return scene;
}
// call the createScene function
var scene = createScene();
// run the render loop
engine.runRenderLoop(function () {
    scene.render();
});
// the canvas/window resize event handler
window.addEventListener('resize', function () {
    engine.resize();
});
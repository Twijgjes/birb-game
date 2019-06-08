import * as BABYLON from 'babylonjs';
import 'babylonjs-loaders';

import setupCameraAndControls from './Interaction/Camera';
import { generateTerrain, generateTerrainTiles } from './TerrainGenerator';
import { Vector3 } from 'babylonjs';
import { generateFlower } from './FloraGenerator';

// Get the canvas DOM element
var canvas = document.getElementById('renderCanvas') as HTMLCanvasElement;
console.info("Got canvas:", canvas);
// Load the 3D engine
var engine = new BABYLON.Engine(canvas, true, { preserveDrawingBuffer: true, stencil: true });
// CreateScene function that creates and return the scene
var createScene = function () {
    // Create a basic BJS Scene object
    var scene = new BABYLON.Scene(engine);
    scene.clearColor = new BABYLON.Color4(1,1,1,1);

    // Create a basic light, aiming 0, 1, 0 - meaning, to the sky
    const hemiLight = new BABYLON.HemisphericLight('light1', new BABYLON.Vector3(.1, 1, 0), scene);
    hemiLight.intensity = .7;
	const dirLight = new BABYLON.DirectionalLight("dir01", new BABYLON.Vector3(-1, 0, -1), scene);
	dirLight.position = new BABYLON.Vector3(20, 40, 20);

    const terrain = generateTerrain(scene, 128);
    terrain.position = new Vector3(-32, -20, 0);
    terrain.receiveShadows = true;
    // const terrainMeshes = generateTerrainTiles(scene, 64, 16);

    generateFlower(scene);

    // Camera and controls setup
    const camera = setupCameraAndControls(canvas, scene);

    // Shadows
    var shadowGenerator = new BABYLON.ShadowGenerator(2048, dirLight);
	// shadowGenerator.getShadowMap().renderList.concat(terrainMeshes);
	shadowGenerator.getShadowMap().renderList.push(terrain);
	shadowGenerator.useBlurExponentialShadowMap = true;
    shadowGenerator.useKernelBlur = true;
    shadowGenerator.blurKernel = 64;

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
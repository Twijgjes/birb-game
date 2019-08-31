import { Scene, Engine, Vector3 } from "babylonjs";
import { setupEnvironment } from "../Environment";
import { generateHeightMap, generateTerrainMesh } from "../TerrainGenerator";
import { placeFlowerBedsOnGround, generateFlowerBed } from "../FloraGenerator";
import { generateTreesInRadius } from "../TreeGenerator";
import { generateBushesInRadius } from "../BushGenerator";
import { generateButterflies } from "../ButterflyGenerator";
import { makeSea } from "../Sea";
import { initUI } from "../Interaction/UI";
import setupCameraAndControls from "../Interaction/Camera";
import Game from '../Game';

// CreateScene function that creates and return the scene
export default function setupDemoScene () {
    const { scene, engine, canvas } = Game;
    setupEnvironment(scene, engine);

    const size = 128;
    const heightMap = generateHeightMap(size);
    const terrain = generateTerrainMesh(scene, size, heightMap);
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

    // Camera and controls setup
    // For normal use
    // setupCameraAndControls(canvas, scene, engine, new Vector3(50, 5, 50));
    // For dev
    setupCameraAndControls(canvas, scene, engine, new Vector3(0, 5, -10));
}
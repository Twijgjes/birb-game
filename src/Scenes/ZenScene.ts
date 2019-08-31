

import { setupEnvironment } from "../Environment";
import { generateHeightMap, generateTerrainMesh } from "../TerrainGenerator";
import { placeFlowerBedsOnGround, generateFlowerBed } from "../FloraGenerator";
import { generateTreesInRadius } from "../TreeGenerator";
import { generateBushesInRadius } from "../BushGenerator";
import { generateButterflies } from "../ButterflyGenerator";
import { makeSea } from "../Sea";
import setupCameraAndControls from "../Interaction/Camera";
import { Scene, Engine, Vector3 } from "babylonjs";
import Game from "../Game";

export default function setupZenScene() {
  const { scene, engine, canvas } = Game;
  regenerateWorld(scene, engine, canvas, {
    size: 128,
    center: 128 / 2,
    amountOfBushes: 54,
  });

  // Setup UI with buttons & sliders
  

  // Add buttton to re-generate the world
  // Game.resetScene();
  // regenerateWorld(scene, engine, canvas, {
  //   size: 128,
  //   center: 128 / 2,
  //   amountOfBushes: 54,
  // });
}

interface WorldOptions {
  size: number,
  center: number,
  amountOfBushes: number,
}

function regenerateWorld(scene: Scene, engine: Engine, canvas: HTMLCanvasElement, options: WorldOptions) {
  // Setup
  setupEnvironment(scene, engine);

  const heightMap = generateHeightMap(options.size);
  const terrain = generateTerrainMesh(scene, options.size, heightMap);
  terrain.receiveShadows = true;
  // const terrainMeshes = generateTerrainTiles(scene, 64, 16);
  const center = new Vector3(64, 0, 64);

  console.info("Flowers");
  placeFlowerBedsOnGround(scene, heightMap);
  generateFlowerBed(scene, Vector3.Zero());
  console.info("Trees");
  generateTreesInRadius(scene, center, 50, 25, heightMap);
  console.info("Bushes");
  generateBushesInRadius(scene, options.amountOfBushes, center, 50, heightMap);
  console.info("Butterflies");
  generateButterflies(scene, 100, center, 40);
  console.info("Sea");
  makeSea(scene, options.size * 1.5, center.add(new Vector3(0, .5, 0)));

  // Camera and controls setup
  // For normal use
  setupCameraAndControls(canvas, scene, engine, new Vector3(50, 5, 50));
  // For dev
  // setupCameraAndControls(canvas, scene, engine, new Vector3(0, 5, -10));
}
    
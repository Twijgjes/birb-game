

import { setupEnvironment } from "../Environment";
import { generateHeightMap, generateTerrainMesh } from "../Generators/TerrainGenerator";
import { placeFlowerBedsOnGround, generateFlowerBed } from "../Generators/FloraGenerator";
import { generateTreesInRadius } from "../Generators/TreeGenerator";
import { generateBushesInRadius } from "../Generators/BushGenerator";
import { generateButterflies } from "../Generators/ButterflyGenerator";
import { makeSea } from "../Generators/Sea";
import setupCameraAndControls from "../Interaction/Camera";
import { Scene, Engine, Vector3 } from "babylonjs";
import Game from "../Game";

export default function setupSandboxScene(gui: dat.GUI) {
  const { scene, engine, canvas } = Game;
  const size = 128;
  const savedWO = localStorage.getItem("WorldOptions");
  const worldOptions = savedWO ? JSON.parse(savedWO) : {
    size,
    center: size / 2,
    bushes: {
      amount: 54,
      radius: 50,
    },
    butterflies: {
      amount: 100,
      radius: 40,
    },
    trees: {
      amount: 25,
      radius: 50,
    },
    flowersbeds: {
      amount: 100,
    }
  };
  setupOptionsUI(gui, worldOptions);
  regenerateWorld(scene, engine, canvas, worldOptions);
}

function setupOptionsUI(gui: dat.GUI, wo: WorldOptions) {
  // gui.remember(worldOptions);
  const saveWO = () => saveWorldOptions(wo);
  const optionsFolder = gui.addFolder("World options");
  optionsFolder.add({"reset values": () => localStorage.removeItem("WorldOptions")}, "reset values")
  optionsFolder.add({"apply!": () => location.reload()}, "apply!");

  const bushesFolder = optionsFolder.addFolder("bushes");
  bushesFolder.add(wo.bushes, "amount", 0, 100).onFinishChange(saveWO);
  bushesFolder.add(wo.bushes, "radius", 5, 256).onFinishChange(saveWO);

  const butterfliesFolder = optionsFolder.addFolder("butterflies");
  butterfliesFolder.add(wo.butterflies, "amount", 0, 200).onFinishChange(saveWO);
  butterfliesFolder.add(wo.butterflies, "radius", 5, 256).onFinishChange(saveWO);

  const treesFolder = optionsFolder.addFolder("trees");
  treesFolder.add(wo.trees, "amount", 0, 100).onFinishChange(saveWO);
  treesFolder.add(wo.trees, "radius", 5, 256).onFinishChange(saveWO);

  const flowerbedsFolder = optionsFolder.addFolder("flowerbeds");
  flowerbedsFolder.add(wo.flowersbeds, "amount", 1, 500).onFinishChange(saveWO);
}

function saveWorldOptions(worldOptions: WorldOptions) {
  localStorage.setItem("WorldOptions", JSON.stringify(worldOptions));
}

interface WorldOptions {
  size: number,
  center: number,
  bushes: {
    amount: number,
    radius: number,
  },
  butterflies: {
    amount: number,
    radius: number,
  },
  trees: {
    amount: number,
    radius: number,
  },
  flowersbeds: {
    amount: number;
  }
}

function regenerateWorld(scene: Scene, engine: Engine, canvas: HTMLCanvasElement, options: WorldOptions) {
  // Setup
  setupEnvironment(scene, engine);
  // Camera and controls setup
  // For normal use
  setupCameraAndControls(canvas, scene, engine, new Vector3(50, 5, 50));
  // For dev
  // setupCameraAndControls(canvas, scene, engine, new Vector3(0, 5, -10));

  const heightMap = generateHeightMap(options.size);
  const terrain = generateTerrainMesh(scene, options.size, heightMap);
  terrain.receiveShadows = true;
  const vCenter = new Vector3(options.center, 0, options.center);
  // const terrainMeshes = generateTerrainTiles(scene, 64, 16);

  console.info("Flowers");
  placeFlowerBedsOnGround(scene, options.flowersbeds.amount, heightMap);

  console.info("Trees");
  generateTreesInRadius(scene, 
    vCenter, 
    options.trees.radius, 
    options.trees.amount, 
    heightMap
  );

  console.info("Bushes");
  generateBushesInRadius(scene, 
    options.bushes.amount, 
    vCenter, 
    options.bushes.radius, 
    heightMap
  );
  
  console.info("Butterflies");
  generateButterflies(scene, 
    options.butterflies.amount, 
    vCenter, 
    options.butterflies.radius
  );
  
  console.info("Sea");
  makeSea(scene, options.size * 1.5, vCenter.add(new Vector3(0, .5, 0)));

  
}
    
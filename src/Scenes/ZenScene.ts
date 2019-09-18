

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
import { generateAutonomousBirds } from "../Generators/BirdGenerator";
import { generateRocksInRadius } from "../Generators/RockGenerator";

export default function setupZenScene(gui: dat.GUI) {
  const { scene, engine, canvas } = Game;
  const size = 32;
  const worldOptions = {
    size,
    center: size / 2,
    bushes: {
      amount: 8,
      radius: 6,
    },
    butterflies: {
      amount: 16,
      radius: 10,
    },
    trees: {
      amount: 2,
      radius: 2,
    },
    flowersbeds: {
      amount: 16,
    },
    birds: {
      amount: 8,
      radius: 10,
    },
    rocks: {
      amount: 1,
      radius: 3,
    },
  };
  // setupOptionsUI(gui, worldOptions);
  regenerateWorld(scene, engine, canvas, worldOptions);
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
  },
  birds: {
    amount: number;
    radius: number;
  },
  rocks: {
    amount: number;
    radius: number;
  }
}

function regenerateWorld(scene: Scene, engine: Engine, canvas: HTMLCanvasElement, options: WorldOptions) {
  const vCenter = new Vector3(options.center, 0, options.center);
  const halfSize = options.size / 2;  
  
  // Setup
  setupEnvironment(scene, engine);
  // Camera and controls setup
  // For normal use
  setupCameraAndControls(canvas, scene, engine, new Vector3(50, 5, 50), true, vCenter);
  // For dev
  // setupCameraAndControls(canvas, scene, engine, new Vector3(0, 5, -10));
   
  const heightMap = generateHeightMap(options.size, 5, 0, halfSize - 8, halfSize - 2);
  const terrain = generateTerrainMesh(scene, options.size, heightMap);
  terrain.receiveShadows = true;
  // const terrainMeshes = generateTerrainTiles(scene, 64, 16);

  console.info("Flowers");
  placeFlowerBedsOnGround(scene, options.flowersbeds.amount, heightMap);

  console.info("Bird!");
  generateAutonomousBirds(scene, options.birds.amount, vCenter.add(new Vector3(0, 5, 0)), options.birds.radius);

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

  console.info("Rocks");
  generateRocksInRadius(scene, 
    vCenter,
    options.rocks.radius,
    options.rocks.amount, 
    heightMap,
  );
  
  console.info("Sea");
  makeSea(scene, options.size * 1.5, vCenter.add(new Vector3(0, .5, 0)));

  
}
    
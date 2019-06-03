import { IndicesArray, FloatArray, VertexData, Color3, Scene, Mesh, StandardMaterial, Vector2 } from 'babylonjs';

export function generateTerrain(scene: Scene, size: number): Mesh {
  console.info("Generating terrain");
  let positions = generateHeightMap(size);
  // Work the heightmap
  for(let i = 0; i < 20; i++) {
    positions = addRandomHill(positions, size, 20, 1);
  }
  for(let i = 0; i < 100; i++) {
    positions = addRandomHill(positions, size, 3 + Math.random() * 3, .2);
  }

  // Turn it into a mesh
  const flatPositions = flatten(positions);
  const indices = indicesForSize(size);
  const normals = new Array<number>();

  VertexData.ComputeNormals(flatPositions, indices, normals);

  const vertexData = new VertexData();
  vertexData.positions = flatPositions;
  vertexData.indices = indices;
  vertexData.normals = normals;

  const material = new StandardMaterial("terrainMaterial", scene);
  material.diffuseColor = new Color3(.5, .5, .5);
  
  const mesh = new Mesh("terrain", scene);
  vertexData.applyToMesh(mesh);
  mesh.material = material;

  return mesh;
}

function generateHeightMap(size: number): Array<Array<number>> {
  let heightmap = new Array<Array<number>>();
  for (let x = 0; x < size; x++) {
    heightmap[x] = new Array<number>();
    for (let z = 0; z < size; z++) {
      const y = 0;
      heightmap[x][z] = y;
    }
  }
  return heightmap;
}

function indicesForSize(size: number): IndicesArray {
  let indices = new Array<number>();
  for(let x = 0; x < size - 1; x++) {
    for(let z = 0; z < size - 1; z++) {
      const ro = (z * size); // row offset
      // Apparently babylon wants front faces to be defined counter-clockwise
      const abc = [x + ro, x + ro + 1, x + ro + size].reverse();
      const bdc = [x + ro + 1, x + ro + size + 1, x + ro + size].reverse();
      indices = indices.concat(abc);
      indices = indices.concat(bdc);
    }
  }
  return indices;
}

function flatten(dimensionalArray: Array<Array<number>>): FloatArray {
  let flattened = new Array<number>();
  for(let x = 0; x < dimensionalArray.length; x++) {
    for(let z = 0; z < dimensionalArray[x].length; z++) {
      flattened = flattened.concat([x, dimensionalArray[x][z], z]);
    }
  }
  return flattened;
}

function addRandomHill(
  heightMap: Array<Array<number>>, 
  mapSize: number, 
  radius: number, 
  intensity: number
): Array<Array<number>> {
  const hillX = Math.floor(Math.random() * mapSize);
  const hillZ = Math.floor(Math.random() * mapSize);
  const hillPos = new Vector2(hillX, hillZ);
  const startX = Math.floor(Math.max(hillX - radius, 0));
  const endX = Math.min(hillX + radius, heightMap.length);
  const startZ = Math.floor(Math.max(hillZ - radius, 0));
  const endZ = Math.min(hillZ + radius, heightMap[0].length); // TODO: make safe
  const data = new Array<number>();
  for (let x = startX; x < endX; x++) {
    for (let z = startZ; z < endZ; z++) {
      const point = new Vector2(x, z);
      const distance = point.subtract(hillPos).length();
      if (distance < radius) {
        const normDist = (distance / radius) * (Math.PI / 2);
        const modifier = Math.cos(normDist) * intensity;
        data.push(modifier);
        heightMap[x][z] += modifier;
      }
    }
  }
  return heightMap;
}
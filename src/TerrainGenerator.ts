import { IndicesArray, FloatArray, VertexData, Color3, Scene, Mesh, StandardMaterial, Vector2, Material, Vector3 } from 'babylonjs';

export function generateTerrainTiles(scene: Scene, tileSize: number, tilesToASide: number): Array<Mesh> {
  const terrainMeshes = [];
  for (let x = 0; x < tilesToASide; x++) {
    for (let z = 0; z < tilesToASide; z++) {
      const mesh = generateTerrainMesh(scene, tileSize, generateHeightMap(tileSize));
      terrainMeshes.push(mesh);
      mesh.position = new Vector3(x * (tileSize - 1), 0, z * (tileSize - 1));
      mesh.receiveShadows = true;
    }
  }
  return terrainMeshes;
}

export function generateTerrainMesh(scene: Scene, size: number, heightMap: Array<Array<number>>): Mesh {
  console.info("Generating terrain");
  let positions = heightMap;

  // Turn it into a mesh
  console.info("Flattening vertices array");
  const flatPositions = flatten(positions);
  console.info("Calculating indices");
  const indices = indicesForSize(size);
  console.info("Adding colors");
  const colors = colorsForPositions(flatPositions);

  console.info("Computing normals");
  const normals = new Array<number>();
  VertexData.ComputeNormals(flatPositions, indices, normals);

  console.info("Creating and assigning vertexdata");  
  const vertexData = new VertexData();
  vertexData.positions = flatPositions;
  vertexData.indices = indices;
  vertexData.normals = normals;
  vertexData.colors = colors;

  const material = new StandardMaterial("terrainMaterial", scene);
  // new Material("simple material?", scene);
  
  // Colors https://lospec.com/palette-list/juice-32 or https://lospec.com/palette-list/juice-56 
  // https://lospec.com/palette-list/zughy-32
  material.diffuseColor = Color3.White();
  material.specularColor = Color3.Black();
  // material.roughness = -10;
  // material.
  // material.specularPower = 1;
  // console.info(material);
  // material.diffuseColor = new Color3(.5, .5, .5);
  // material.pointsCloud = true;
  // material.pointSize = 30;

  console.info("Creating mesh and applying vertexdata");
  const mesh = new Mesh("terrain", scene);
  vertexData.applyToMesh(mesh);
  mesh.material = material;
  mesh.convertToFlatShadedMesh();

  return mesh;
}

export function generateHeightMap(size: number): Array<Array<number>> {
  const halfSize = size / 2;
  let heightmap = new Array<Array<number>>();
  for (let x = 0; x < size; x++) {
    heightmap[x] = new Array<number>();
    for (let z = 0; z < size; z++) {
      const y = 1;
      heightmap[x][z] = y;
    }
  }
  // Work the heightmap
  console.info("Adding big hills");
  for(let i = 0; i < (20 / 64) * size; i++) {
    heightmap = addRandomHill(heightmap, size, 20, .5);
  }
  console.info("Adding smaller hills");
  for(let i = 0; i < (100 / 64) * size; i++) {
    heightmap = addRandomHill(heightmap, size, 3 + Math.random() * 6, .3);
  }

  console.info("Adding falloff");
  heightmap = falloff(heightmap, halfSize - 15, halfSize - 2, new Vector2(halfSize, halfSize));
  return heightmap;
}

function indicesForSize(size: number): IndicesArray {
  let indices = new Array<number>();
  for(let x = 0; x < size - 1; x++) {
    for(let z = 0; z < size - 1; z++) {
      const xro = x + (z * size); // row offset
      // Apparently babylon wants front faces to be defined counter-clockwise
      const abc = [xro + size, xro + 1, xro];
      const bdc = [xro + size, xro + size + 1, xro + 1];
      indices.push(...abc);
      indices.push(...bdc);
    }
  }
  return indices;
}

function flatten(dimensionalArray: Array<Array<number>>): FloatArray {
  let flattened = new Array<number>();
  for(let x = 0; x < dimensionalArray.length; x++) {
    for(let z = 0; z < dimensionalArray[x].length; z++) {
      flattened.push(...[x, dimensionalArray[x][z], z]);
    }
  }
  return flattened;
}

function addRandomHill(
  heightMap: Array<Array<number>>, 
  mapSize: number, 
  radius: number, 
  intensity: number
) {
  const hillPos = new Vector2(Math.floor(Math.random() * mapSize), Math.floor(Math.random() * mapSize));
  return addHill(heightMap, hillPos, radius, intensity);
}

function addHill(
  heightMap: Array<Array<number>>,
  hillPos: Vector2,
  radius: number, 
  intensity: number
): Array<Array<number>> {
  const startX = Math.floor(Math.max(hillPos.x - radius, 0));
  const endX = Math.min(hillPos.x + radius, heightMap.length);
  const startZ = Math.floor(Math.max(hillPos.y - radius, 0));
  const endZ = Math.min(hillPos.y + radius, heightMap[0].length); // TODO: make safe
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

function falloff(heightMap: Array<Array<number>>, startRadius: number, endRadius: number, center: Vector2): Array<Array<number>> {
  for (let x = 0; x < heightMap.length; x++) {
    for (let z = 0; z < heightMap[x].length; z++) {
      const pos = new Vector2(x, z);
      const distanceToCenter = pos.subtract(center).length();
      if (distanceToCenter >= endRadius) {
        heightMap[x][z] = 0;
      } else if (distanceToCenter > startRadius) {
        // console.log(`Distance to center ${distanceToCenter} divided by radius is ${1 - distanceToCenter / radius}`)
        heightMap[x][z] = heightMap[x][z] * (1 - (distanceToCenter - startRadius) / (endRadius - startRadius));
      }
    }
  }
  return heightMap;
}

function colorsForPositions(positions: FloatArray) {
  let colors = new Array<number>();
  const sand = Color3.FromHexString("#dfce9d"); // dfce9d f4cca1
  const sandArr = [sand.r, sand.g, sand.b, 1];
  const grass = Color3.FromHexString("#71aa34");
  const grassArr = [grass.r, grass.g, grass.b, 1];

  for (let i = 1; i < positions.length; i += 3) {
    if (positions[i] < 1) {
      // Make sandy
      colors.push(...sandArr);
    } else {
      // make grassy
      colors.push(...grassArr);
    }
  }
  return colors;
}
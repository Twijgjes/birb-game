import { Mesh, Scene, Vector3, Color3, FloatArray, VertexData, StandardMaterial, InstancedMesh } from "babylonjs";
import { COLORS } from "./Constants/colors";
import { flattenVertices, addFace } from "./MeshGeneratorUtils";

const flowerTypes = new Array<Mesh>();
// Better for performance to have one set of meshes for all flowerbeds
function instantiateFlowerMeshes(scene: Scene) {
  flowerTypes.push(generateFlower(scene, Color3.FromHexString(COLORS.ORANGE_YELLOW)));
  flowerTypes.push(generateFlower(scene, Color3.FromHexString(COLORS.PINK)));
  flowerTypes.push(generateFlower(scene, Color3.FromHexString(COLORS.SKY)));
  flowerTypes.push(generateFlower(scene, Color3.FromHexString(COLORS.RED)));
}

export function placeFlowerBedsOnGround(scene: Scene, heightMap: Array<Array<number>>): Array<InstancedMesh> {
  const flowers = new Array<InstancedMesh>();
  const max = heightMap.length;
  for(let i = 0; i < 200; i++) {
    const bedPos = new Vector3(
      Math.floor(Math.random() * max),
      0,
      Math.floor(Math.random() * max),
    );
    bedPos.y = heightMap[bedPos.x][bedPos.z] - .1;
    if (bedPos.y > 1) {
      flowers.push(...generateFlowerBed(scene, bedPos));
    } else {
      i--;
    }
  }
  return flowers;
}

export function generateFlowerBed(scene: Scene, pOff: Vector3): Array<InstancedMesh> {
  const flowers = new Array<InstancedMesh>();
  
  if (flowerTypes.length === 0) {
    instantiateFlowerMeshes(scene);
  }
  
  const areaSize = 1;
  const half = areaSize / 2;

  for (let i = 0; i < 20; i++) {
    const fti = Math.floor(Math.random() * flowerTypes.length);
    const fi = flowerTypes[fti].createInstance("Flower" + i);
    scene.addMesh(fi);
    fi.position = pOff.add(new Vector3(
      half - Math.random() * areaSize,
      0,
      half - Math.random() * areaSize,
    ));
    fi.rotation = new Vector3(
      Math.random() * Math.PI * .1,
      Math.random() * Math.PI * 2,
      0,
    );
    flowers.push(fi);
  }
  return flowers;
}

export function generateFlower(scene: Scene, petalColor: Color3): Mesh {
  const stemColor = Color3.FromHexString("#b6d53c");
  // ffaeb6 pinkish
  // f47e1b orange-ish
  // Reddish e6482e

  const md = {
    vertices: new Array<Vector3>(),
    indices: new Array<number>(),
    colors: new Array<number>(),
  };

  // Stem
  addFace(
    md,
    new Vector3(-.02, 0, 0),
    new Vector3(.02, 0, 0),
    new Vector3(0, .5, 0),
    stemColor,
  );

  // petals
  addFace(
    md,
    new Vector3(0, .5, 0),
    new Vector3(.04, .54, 0),
    new Vector3(0, .56, 0),
    petalColor,
  );
  addFace(
    md,
    new Vector3(0, .5, 0),
    new Vector3(.04, .46, 0),
    new Vector3(.06, .5, 0),
    petalColor,
  );
  addFace(
    md,
    new Vector3(0, .5, 0),
    new Vector3(-.04, .46, 0),
    new Vector3(0, .44, 0),
    petalColor,
  );
  addFace(
    md,
    new Vector3(0, .5, 0),
    new Vector3(-.04, .54, 0),
    new Vector3(-.06, .5, 0),
    petalColor,
  );

  const vertexData = new VertexData();
  vertexData.positions = flattenVertices(md.vertices);
  vertexData.colors = md.colors;
  vertexData.indices = md.indices;

  const normals = new Array<number>();
  VertexData.ComputeNormals(vertexData.positions, md.indices, normals);

  const material = new StandardMaterial("terrainMaterial", scene);
  material.diffuseColor = Color3.White();
  material.specularColor = Color3.Black();
  material.backFaceCulling = false;

  const mesh = new Mesh("flower", scene);
  vertexData.applyToMesh(mesh);
  mesh.material = material;
  mesh.convertToFlatShadedMesh();
  // mesh.receiveShadows = true;

  return mesh;
}
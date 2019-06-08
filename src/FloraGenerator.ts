import { Mesh, Scene, Vector3, Color3, FloatArray, VertexData, StandardMaterial, InstancedMesh } from "babylonjs";

interface MeshData {
  vertices: Array<Vector3>;
  indices: Array<number>;
  colors: Array<number>;
}

export function generateFlowerBed(scene: Scene): Array<InstancedMesh> {
  const flowers = new Array<InstancedMesh>();
  const flower = generateFlower(scene);
  const areaSize = 50;
  const half = areaSize / 2;

  for (let i = 0; i < 5000; i++) {
    const fi = flower.createInstance("Flower" + i);
    flower.position = new Vector3(
      half - Math.random() * areaSize,
      0,
      half - Math.random() * areaSize,
    );
    flower.rotation = new Vector3(
      Math.random() * Math.PI * .1,
      Math.random() * Math.PI * 2,
      0,
    );
    flowers.push(fi);
  }
  return flowers;
}

export function generateFlower(scene: Scene): Mesh {
  const stemColor = Color3.FromHexString("#b6d53c");
  const petalColor = Color3.FromHexString("#f4b41b");

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

  return mesh;
}

function petalVerts(vertices: Array<Vector3>) {
  
}

function addFace(
  md: MeshData,
  v0: Vector3,
  v1: Vector3,
  v2: Vector3,
  c: Color3,
) {
  md.vertices.push(v0);
  md.vertices.push(v1);
  md.vertices.push(v2);
  md.colors.push(c.r, c.g, c.b, 1);
  md.colors.push(c.r, c.g, c.b, 1);
  md.colors.push(c.r, c.g, c.b, 1);
  const iOff = md.indices.length;
  md.indices.push(iOff + 0, iOff + 1, iOff + 2);
  return md;
}

function flattenVertices(vertices: Array<Vector3>): FloatArray {
  let flattened = new Array<number>();
  vertices.forEach((v3: Vector3) => flattened.push(v3.x, v3.y, v3.z));
  return flattened;
}
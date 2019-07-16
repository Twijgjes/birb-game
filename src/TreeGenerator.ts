import { Scene, Vector3, Color3, VertexData, StandardMaterial, Mesh, MeshBuilder, Quaternion, VertexBuffer, TubeBuilder } from "babylonjs";
import { addFace, flattenVertices, MeshData } from "./MeshGeneratorUtils";
import { COLORS } from "./Constants/colors";

export function generateTree(scene: Scene) {
  // Ok, so 2D this shit?
  // Bark color
  const barkColor = Color3.FromHexString(COLORS.BROWN);
  // Base 
  // const md: MeshData = {
  //   vertices: new Array<Vector3>(),
  //   indices: new Array<number>(),
  //   colors: new Array<number>(),
  // };
  /**
   * e---f
   * |   |
   * h---g
   * :   :
   * a---b
   * |   |
   * d---c
   * 
   */
  // generateLength(md, 0, .5, .5, barkColor);
  // generateLength(md, 1, .5, .4, barkColor);
  // generateLength(md, 2, .4, .3, barkColor);
  // generateLength(md, 3, .3, .2, barkColor);

  // const vertexData = new VertexData();
  // vertexData.positions = flattenVertices(md.vertices);
  // vertexData.colors = md.colors;
  // vertexData.indices = md.indices;

  // const normals = new Array<number>();
  // VertexData.ComputeNormals(vertexData.positions, md.indices, normals);

  const material = new StandardMaterial("terrainMaterial", scene);
  material.diffuseColor = Color3.White();
  material.specularColor = Color3.Black();
  
  // const mesh = new Mesh("tree", scene);
  // vertexData.applyToMesh(mesh);
  // mesh.material = material;
  // mesh.convertToFlatShadedMesh();
  // mesh.receiveShadows = true;

  const shapeMesh = generateTreeShape(scene, material, 10, barkColor);
  
  // scene.addMesh(shapeMesh);
}

function generateLength(md: MeshData, yOff: number, bw: number, tw: number, barkColor: Color3) {
  // Bottom
  const a = new Vector3( bw, yOff, -bw);
  const b = new Vector3( bw, yOff,  bw);
  const c = new Vector3(-bw, yOff,  bw);
  const d = new Vector3(-bw, yOff, -bw);
  // Top
  const e = new Vector3( tw, yOff + 1, -tw);
  const f = new Vector3( tw, yOff + 1,  tw);
  const g = new Vector3(-tw, yOff + 1,  tw);
  const h = new Vector3(-tw, yOff + 1, -tw);
  // Bottom
  addFace(md, b, d, a, barkColor);
  addFace(md, c, d, b, barkColor);

  // Front
  // hdc
  addFace(md, c, d, h, barkColor);
  // hcg
  addFace(md, g, c, h, barkColor);

  // Right
  // gcb
  addFace(md, b, c, g, barkColor);
  // gbf
  addFace(md, f, b, g, barkColor);

  // Left
  // ead
  addFace(md, d, a, e, barkColor);
  // edh
  addFace(md, h, d, e, barkColor);

  // Back
  // eba
  addFace(md, a, b, e, barkColor);
  // efb
  addFace(md, b, f, e, barkColor);
}

function generateTreeShape(scene: Scene, material: StandardMaterial, segments: number, barkColor: Color3) {
  // start with line segments
  const path = new Array<Vector3>();
  path.push(Vector3.Zero());
  let length = 1;

  // Lines get shorter as height increases
  const rotationRange = .5;
  const half = rotationRange / 2;
  for (let i = 1; i < segments; i++) {
    let v = new Vector3(0, length, 0);
    v.rotateByQuaternionToRef(Quaternion.FromEulerAngles(
      half - Math.random() * rotationRange,
      half - Math.random() * rotationRange,
      half - Math.random() * rotationRange
    ), v);
    path.push(path[i-1].add(v));
    length *= .9;
  }

  // At each vertex, add a new line in a random direction

  // Skew the base line in the opposite direction by a random amount
  console.info(hexagon);
  const branchShape = hexagon;
  const scaleFunction = (i: number, distance: number) => {
    return .5 * (.95 - (.1 * i));
  }
  const extrTube = MeshBuilder.ExtrudeShapeCustom("treeBranch", {
    shape: branchShape,
    path,
    scaleFunction: scaleFunction,
    sideOrientation: BABYLON.Mesh.DOUBLESIDE,
    updatable: true,
  });

  // const tube = MeshBuilder.CreateTube("tube", {
  //     path, 
  //     radius: 0.2, 
  //     sideOrientation: BABYLON.Mesh.DOUBLESIDE,
  //     updatable: true,
  //     tessellation: 6,
  // }, scene);
  const tube = extrTube;
  const positions = tube.getVerticesData(BABYLON.VertexBuffer.PositionKind);
  const indices = tube.getIndices();
  const normals = Array<number>();
  const colors = Array<number>();
  tube.getVerticesData(BABYLON.VertexBuffer.ColorKind);

  const numOfColors = positions.length / 3;
  for (let i = 0; i < numOfColors; i ++) {
    colors.push(barkColor.r, barkColor.g, barkColor.b, 1);
  }
  tube.updateVerticesData(VertexBuffer.ColorKind, colors);

  const vertexData = new VertexData();
  VertexData.ComputeNormals(
    positions,
    indices,
    normals,
  );
  vertexData.positions = positions;
  vertexData.colors = colors;
  vertexData.indices = indices;
  vertexData.normals = normals;
  vertexData.applyToMesh(tube);
  tube.convertToFlatShadedMesh();
  tube.useVertexColors = true;
  tube.receiveShadows = true;
  tube.material = material;
  
  return tube;
}

const square = [
  new Vector3(.5,0,0),
  new Vector3(0,-.5,0),
  new Vector3(-.5,0,0),
  new Vector3(0,.5,0),
];
square.push(square[0]); // Gotta end somewhere

const start = new Vector3(.5,0,0);
const hexagon = [
  start,
];
for(let i = 0; i < 6; i++) {
  hexagon.push(
    hexagon[i].rotateByQuaternionToRef(Quaternion.FromEulerAngles(0,0,Math.PI / 3), new Vector3())
  );
}
// hexagon.push(start); // Gotta end somewhere
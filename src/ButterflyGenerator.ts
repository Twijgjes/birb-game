import { Scene, Vector3, Color3, VertexData, Mesh, VertexBuffer, StandardMaterial } from "babylonjs";
import { flattenVertices, addFace } from "./MeshGeneratorUtils";
import { COLORS } from "./Constants/colors";
import TWEEN from '@tweenjs/tween.js';

export function generateButterfly(scene: Scene) {
  const rightWingMesh = createWing(scene);
  const leftWingMesh = createWing(scene, true);
  rightWingMesh.position.y = 2;
  leftWingMesh.position.y = 2;

  rightWingMesh.rotation.z = - Math.PI / 4;
  const rTween = (new TWEEN.Tween(rightWingMesh.rotation) as any)
    .to({ z: Math.PI / 4 }, 300)
    .easing((TWEEN as any).Easing.Quadratic.InOut)
    .yoyo(true)
    .repeat(Infinity)
    .start();

  leftWingMesh.rotation.z = Math.PI / 4;
  const lTween = (new TWEEN.Tween(leftWingMesh.rotation) as any)
    .to({ z: - Math.PI / 4 }, 300)
    .easing((TWEEN as any).Easing.Quadratic.InOut) 
    .yoyo(true)
    .repeat(Infinity)
    .start();
}

function createWing(scene: Scene, mirror = false): Mesh {
  const a = new Vector3(0, 0, 1);
  const b = new Vector3(1, 0, 1.2);
  const c = new Vector3(2, 0, 1);
  const d = new Vector3(1, 0, 0);
  const e = new Vector3(0.5, 0, -1);
  const f = new Vector3(0, 0, -.5);
  if (mirror) {
    a.x *= -1;
    b.x *= -1;
    c.x *= -1;
    d.x *= -1;
    e.x *= -1;
    f.x *= -1;
  }
  const wingColor = Color3.FromHexString(COLORS.ORANGE)
  const md = {
    vertices: new Array<Vector3>(),
    indices: new Array<number>(),
    colors: new Array<number>(),
  };
  addFace(md, a, b, c, wingColor);
  addFace(md, a, c, d, wingColor);
  addFace(md, a, d, f, wingColor);
  addFace(md, f, d, e, wingColor);
  const vertexData = new VertexData();
  vertexData.positions = flattenVertices(md.vertices);
  vertexData.colors = md.colors;
  vertexData.indices = md.indices;
  const normals = new Array<number>();
  VertexData.ComputeNormals(vertexData.positions, md.indices, normals);

  const mesh = new Mesh("wing");
  vertexData.applyToMesh(mesh);
  mesh.updateVerticesData(VertexBuffer.ColorKind, md.colors);
  mesh.convertToFlatShadedMesh();
  mesh.useVertexColors = true;
  mesh.receiveShadows = true;

  const material = new StandardMaterial("terrainMaterial", scene);
  material.diffuseColor = Color3.White();
  material.specularColor = Color3.Black();
  material.backFaceCulling = false;
  mesh.material = material;
  return mesh;
}
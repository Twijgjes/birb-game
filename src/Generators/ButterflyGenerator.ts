import { Scene, Vector3, Color3, VertexData, Mesh, VertexBuffer, StandardMaterial, TransformNode, Quaternion } from "babylonjs";
import { flattenVertices, addFace } from "../Utils/MeshGeneratorUtils";
import { COLORS, randomBrightColor } from "../Constants/colors";
import TWEEN from '@tweenjs/tween.js';

export function generateButterflies(scene: Scene, amount: number, center: Vector3, distance: number) {
  for(let i = 0; i < amount; i++) {
    const node = generateButterfly(scene);
    const arc = Math.random() * Math.PI * 2;
    const position = center
      .add(new Vector3(0, 2, distance * Math.random())
        .rotateByQuaternionToRef(Quaternion
          .FromEulerAngles(0,arc,0), new Vector3()
    ));
    node.position = position;
    flyTo(node);
  }
}

export function generateButterfly(scene: Scene): TransformNode {
  const wingColor = Color3.FromHexString(randomBrightColor());
  const rightWingMesh = createWing(scene, wingColor);
  const leftWingMesh = createWing(scene, wingColor, true);
  rightWingMesh.position.y = 2;
  leftWingMesh.position.y = 2;
  const wingSpeed = 100 + Math.random() * 100;

  rightWingMesh.rotation.z = - Math.PI / 4;
  const rTween = (new TWEEN.Tween(rightWingMesh.rotation) as any)
    .to({ z: Math.PI / 4 }, wingSpeed)
    .easing((TWEEN as any).Easing.Quadratic.InOut)
    .yoyo(true)
    .repeat(Infinity)
    .start();

  leftWingMesh.rotation.z = Math.PI / 4;
  const lTween = (new TWEEN.Tween(leftWingMesh.rotation) as any)
    .to({ z: - Math.PI / 4 }, wingSpeed)
    .easing((TWEEN as any).Easing.Quadratic.InOut) 
    .yoyo(true)
    .repeat(Infinity)
    .start();

  // Make it fly somewhere
  const parent = new TransformNode("butterflyParent");
  rightWingMesh.parent = parent;
  leftWingMesh.parent = parent;
  return parent;
}

function createWing(scene: Scene, wingColor: Color3, mirror = false): Mesh {
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
  mesh.scaling = new Vector3(.1, .1, .1);
  return mesh;
}

function flyTo(node: TransformNode, fromVelocity?: Vector3) {
  if (!fromVelocity) {
    fromVelocity = new Vector3(
      Math.random() - .5,
      (Math.random() - .5) * .1, 
      Math.random() - .5
    ).normalize().scale(.01);
  }
  const toVelocity = new Vector3();
  fromVelocity.clone().rotateByQuaternionToRef(Quaternion.FromEulerAngles(
    0,
    Math.random() * (Math.PI / 4),
    0
  ), toVelocity);
  const target = (new TWEEN.Tween(fromVelocity) as any)
    .to({x: toVelocity.x, y: toVelocity.y, z: toVelocity.z}, 10000)
    .onUpdate(function() {
      const newPos = node.position.add(fromVelocity);
      node.lookAt(newPos);
      node.position = newPos;
    })
    .easing((TWEEN as any).Easing.Linear.None)
    .start()
    .onComplete(() => {
      flyTo(node, toVelocity);
    });
}
import { Mesh, Scene, Vector3, Color3, FloatArray, VertexData, StandardMaterial, InstancedMesh, Material, VertexBuffer, Quaternion } from "babylonjs";
import { COLORS } from "../Constants/colors";

export interface MeshData {
  vertices: Array<Vector3>;
  indices: Array<number>;
  colors: Array<number>;
}

export function addFace(
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

export function flattenVertices(vertices: Array<Vector3>): FloatArray {
  let flattened = new Array<number>();
  vertices.forEach((v3: Vector3) => flattened.push(v3.x, v3.y, v3.z));
  return flattened;
}

export function addRandomRotation(v: Vector3, range: number): Vector3 {
  const result = new Vector3();
  const half = range / 2;
  v.clone().rotateByQuaternionToRef(Quaternion.FromEulerAngles(
    half - Math.random() * range,
    half - Math.random() * range,
    half - Math.random() * range
  ), result);
  return result;
}

export function prepMesh(oldMesh: Mesh, meshColor: Color3, material: Material, disposeOldMesh: boolean = true): Mesh {
  const mesh: Mesh = new Mesh(oldMesh.name);
  mesh.position = oldMesh.position;
  mesh.rotation = oldMesh.rotation;
  mesh.scaling = oldMesh.scaling;
  const positions = [...oldMesh.getVerticesData(VertexBuffer.PositionKind)];
  const indices = oldMesh.getIndices();
  const normals = Array<number>();
  const colors = Array<number>();

  const numOfColors = positions.length / 3;
  // console.info(`NumOfColors: ${numOfColors}`);
  for (let i = 0; i < numOfColors; i ++) {
    colors.push(meshColor.r, meshColor.g, meshColor.b, 1);
  }

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
  
  vertexData.applyToMesh(mesh);

  mesh.updateVerticesData(VertexBuffer.ColorKind, colors);
  mesh.convertToFlatShadedMesh();
  mesh.useVertexColors = true;
  mesh.receiveShadows = true;
  mesh.material = material;

  // Get rid of the old mesh!
  if (disposeOldMesh) {
    oldMesh.dispose();
  }
  return mesh;
}
import { Mesh, Scene, Vector3, Color3, FloatArray, VertexData, StandardMaterial, InstancedMesh } from "babylonjs";
import { COLORS } from "./Constants/colors";

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
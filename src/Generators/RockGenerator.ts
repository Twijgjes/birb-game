import { Vector3, Quaternion, MeshBuilder, StandardMaterial, Color3, Scene, Mesh, VertexData, VertexBuffer, FloatArray } from "babylonjs";
import { COLORS } from "../Constants/colors";
import { simplePrepMesh, addRandomYRotation } from "../Utils/MeshGeneratorUtils";

export function generateRowOfRocks(scene: Scene, position: Vector3) {
  for(let i = 0; i < 50; i++) {
    const radius = .5 + Math.random() * 3;
    generateRock(scene, {
      radius,
      position: position.add(new Vector3(i * 5, 0, 0)),
      maxVertOffset: radius * .3,
      ySquish: .6,
      subDivisions: Math.ceil(Math.random() * 2),
    });
  }
}

export function generateRocksInRadius(scene: Scene, center: Vector3, radius: number, amount: number, heightMap: number[][]) {
  for (let i = 0; i < amount; i++) {
    const distance = 10 + Math.random() * (radius - 10);
    const arc = Math.random() * Math.PI * 2;
    const position = center
      .add(new Vector3(0, 0, distance)
        .rotateByQuaternionToRef(Quaternion
          .FromEulerAngles(0,arc,0), new Vector3()
    ));
    position.y = heightMap[Math.floor(position.x)][Math.floor(position.z)] -.5;
    generateClusterOfRocks(
      scene,
      position,
      Math.ceil(Math.random() * 3),
    );
  }
}

export function generateClusterOfRocks(scene: Scene, position: Vector3, amount: number) {
  let prevRadius;
  for(let i = 0; i < amount; i++) {
    const radius = .5 + Math.random() * 2;
    const nearPos = position.add(Vector3.Up().scale(radius / 2));
    if (prevRadius) {
      nearPos.add(addRandomYRotation(Vector3.Right(), Math.PI).scale(prevRadius));
    }
    generateRock(scene, {
      radius,
      position: nearPos,
      maxVertOffset: radius * .3,
      ySquish: .6,
      subDivisions: Math.ceil(Math.random() * 2),
    });
    prevRadius = radius;
  }
}

interface RockOptions {
  radius: number;
  maxVertOffset: number;
  position: Vector3;
  ySquish: number;
  subDivisions: number;
}

export function generateRock(scene: Scene, options: RockOptions) {
  const material = new StandardMaterial("rockMaterial", scene);
  material.diffuseColor = Color3.White();
  material.specularColor = Color3.Black();
  material.backFaceCulling = false;
  const rockColor = Color3.FromHexString(COLORS.GREY);

  const rock = MeshBuilder.CreateIcoSphere("rocky", {
    radius: options.radius,
    subdivisions: options.subDivisions,
  });
  rock.position = options.position;

  let meshPositions = rock.getVerticesData(VertexBuffer.PositionKind);
  // console.info("Rock mesh positions");
  // for (let i = 0; i < meshPositions.length; mesh)
  // meshPositions = meshPositions.map((pos: number) => pos + Math.random() * .1);
  const o = options.maxVertOffset;
  const oH = options.maxVertOffset / 2;
  const indexCollection = mapOfAllIdenticalVertices(meshPositions);
  for(const identicalVerts of indexCollection) {
    let xMod = Math.random() * o - oH;
    let yMod = Math.random() * o - oH;
    let zMod = Math.random() * o - oH;
    for(const vertIndex of identicalVerts) {
      meshPositions[vertIndex[0]] += xMod;
      meshPositions[vertIndex[1]] = (meshPositions[vertIndex[1]] + yMod) * options.ySquish;
      meshPositions[vertIndex[2]] += zMod;
    }
  }

  rock.setVerticesData(VertexBuffer.PositionKind, meshPositions);

  simplePrepMesh(rock, rockColor, material);
}

function mapOfAllIdenticalVertices(floatArray: FloatArray): Array<Array<number[]>> {
  const map = Array<number[]>();
  const indexCollection = Array<Array<number[]>>();

  for(let i = 0; i < floatArray.length; i += 3) {
    const vert = [floatArray[i], floatArray[i+1], floatArray[i+2]];
    const found = arrayContainsEqualArray(map, vert);
    if (found >= 0) {
      indexCollection[found].push([i, i+1, i+2]);
    } else {
      map.push(vert);
      indexCollection.push([[i, i+1, i+2]]);
    }
  }
  return indexCollection;
}

function arrayContainsEqualArray(inArr: Array<number[]>, arrA: number[]): number {
  for(let i = 0; i < inArr.length; i++) {
    if (arraysEqual(arrA, inArr[i])) {
      return i;
    }
  }
  return -1;
}

// Thanks stackoverflow!
function arraysEqual(a: number[], b: number[]) {
  if (a === b) return true;
  if (a == null || b == null) return false;
  if (a.length != b.length) return false;

  for (var i = 0; i < a.length; ++i) {
    if (a[i] !== b[i]) return false;
  }
  return true;
}
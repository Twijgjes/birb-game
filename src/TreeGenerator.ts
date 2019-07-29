import { Scene, Vector3, Color3, VertexData, StandardMaterial, Mesh, MeshBuilder, Quaternion, VertexBuffer, IndicesArray, FloatArray, ImageProcessingConfigurationDefines, Material } from "babylonjs";
import { COLORS } from "./Constants/colors";

interface TreeData {
  branch: BranchEndData,
  splits: Array<TreeData>,
}

interface MeshOptions {
  material: StandardMaterial;
  barkColor: Color3;
}

interface BranchData {
  direction: Vector3;
  position: Vector3;
  width: number;
  length: number;
  segments: number;
  positions: FloatArray;
  indices: IndicesArray;
}

interface BranchEndData extends BranchData {
  mesh: Mesh;
}

export function generateTreesInRadius(scene: Scene, center: Vector3, radius: number, amount: number) {
  for (let i = 0; i < 50; i++) {
      const distance = 10 + Math.random() * (radius - 10);
      const arc = Math.random() * Math.PI * 2;
      generateTree(scene, 
        center.add(new Vector3(0, 0, distance).rotateByQuaternionToRef(Quaternion.FromEulerAngles(0,arc,0), new Vector3())),
      );
  }
}

export function generateTree(scene: Scene, position: Vector3) {
  const barkColor = Color3.FromHexString(COLORS.BROWN);

  const material = new StandardMaterial("terrainMaterial", scene);
  material.diffuseColor = Color3.White();
  material.specularColor = Color3.Black();

  const firstBranch = generateBranch(
    {
      length: 1,
      width: 1,
      position,
      direction: Vector3.Up(),
      segments: 5,
      positions: [],
      indices: [],
    },
  );
  const maxRecursions = 4;
  const tree: TreeData = {
    branch: firstBranch,
    splits: [],
  }
  prepMesh(firstBranch, barkColor, material);
  const lastBranch = splitBranch(0, maxRecursions, tree, {material, barkColor});
  // console.info(`Last branch ${lastBranch.positions.length}, ${lastBranch.indices.length}`)
  // const mesh = prepMesh(lastBranch, barkColor, material);
  // scene.addMesh(mesh);
  // TODO: also get the stuff from the end
}

function splitBranch(recursions: number, max: number, treeData: TreeData, meshOptions: MeshOptions) /*: BranchEndData */{
  treeData.splits.push({
    branch: generateBranch(
      {
        length: treeData.branch.length,
        width: treeData.branch.width,
        position: treeData.branch.position,
        direction: addRandomRotation(treeData.branch.direction, 1),
        segments: 5,
        positions: [],// treeData.branch.positions,
        indices: [],// treeData.branch.indices,
      },
    ),
    splits: []
  });
  treeData.splits.push({
    branch: generateBranch(
      {
        length: treeData.branch.length,
        width: treeData.branch.width,
        position: treeData.branch.position,
        direction: addRandomRotation(treeData.branch.direction, 1),
        segments: 5,
        positions: [],// treeData.branch.positions,
        indices: [],// treeData.branch.indices,
      },
    ),
    splits: []
  });
  recursions++;
  
  prepMesh(treeData.splits[0].branch, meshOptions.barkColor, meshOptions.material);
  prepMesh(treeData.splits[1].branch, meshOptions.barkColor, meshOptions.material);

  if (recursions < max) {
    const split1 = splitBranch(recursions, max, treeData.splits[0], meshOptions);
    const split2 = splitBranch(recursions, max, treeData.splits[1], meshOptions);
    // return {
    //   ...split1,
    //   positions: [...split1.positions, ...split2.positions],
    //   indices: [...split1.indices, ...split2.indices],
    // }
  } 
  // else 
  // {
  //   return {
  //     ...treeData.splits[0].branch,
  //     positions: [...treeData.splits[0].branch.positions, ...treeData.splits[1].branch.positions],
  //     indices: [...treeData.splits[0].branch.indices, ...treeData.splits[1].branch.indices],
  //   };
  // }
}

function generateBranch(
  options: BranchData,
): BranchEndData {
  let { length, width, position, direction, segments, positions, indices } = options;
  // start with line segments
  const path = new Array<Vector3>();
  path.push(position);

  // Lines get shorter as height increases
  
  for (let i = 1; i < segments; i++) {
    let v = direction.scale(length);
    v = addRandomRotation(v, .5);
    path.push(path[i-1].add(v));
    length *= (.9 + Math.random() * .1);
  }

  const branchShape = hexagon;
  const scaleFunction = (i: number, distance: number) => {
    return width * (.95 - (.1 * i));
  }
  const extrTube = MeshBuilder.ExtrudeShapeCustom("treeBranch", {
    shape: branchShape,
    path,
    scaleFunction,
    sideOrientation: BABYLON.Mesh.DOUBLESIDE,
    updatable: true,
  });

  const tube = extrTube;
  positions = [...positions, ...tube.getVerticesData(BABYLON.VertexBuffer.PositionKind)];
  indices = [...indices, ...tube.getIndices()];
  tube.dispose();

  const branchEndData = {
    mesh: tube,
    direction: path[path.length - 1].subtract(path[path.length - 2]).normalize(),
    position: path[path.length - 1],
    width: scaleFunction(segments - 1, null),
    length,
    segments,
    positions,
    indices,
  };  
  return branchEndData;
}

function prepMesh(lastBranch: BranchEndData, barkColor: Color3, material: Material): Mesh {
  const mesh: Mesh = new Mesh("tree");
  const positions = lastBranch.positions;
  const indices = lastBranch.indices;
  const normals = Array<number>();
  const colors = Array<number>();
  // tube.getVerticesData(BABYLON.VertexBuffer.ColorKind);

  const numOfColors = positions.length / 3;
  // console.info(`NumOfColors: ${numOfColors}`);
  for (let i = 0; i < numOfColors; i ++) {
    colors.push(barkColor.r, barkColor.g, barkColor.b, 1);
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
  return mesh;
}

const square = [
  new Vector3(.5,0,0),
  new Vector3(0,-.5,0),
  new Vector3(-.5,0,0),
  new Vector3(0,.5,0),
];
square.push(square[0]); // Gotta end somewhere

const start = new Vector3(.5,0,0);
const hexagon = [start];
for(let i = 0; i < 6; i++) {
  hexagon.push(
    hexagon[i].rotateByQuaternionToRef(Quaternion.FromEulerAngles(0,0,Math.PI / 3), new Vector3())
  );
}

const addRandomRotation = (v: Vector3, range: number): Vector3 => {
  const result = new Vector3();
  const half = range / 2;
  v.rotateByQuaternionToRef(Quaternion.FromEulerAngles(
    half - Math.random() * range,
    half - Math.random() * range,
    half - Math.random() * range
  ), result);
  return result;
}
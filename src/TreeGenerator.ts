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
}

interface BranchEndData extends BranchData {
  mesh: Mesh;
  positions: number[];
  indices: number[];
}

export function generateTreesInRadius(scene: Scene, center: Vector3, radius: number, amount: number) {
  const treeOptions = {
    startLength: 1,
    startWidth: 1,
    position: Vector3.Zero(),
    direction: Vector3.Up(),
    startSegments: 5,
    recursions: 4,
  };
  for (let i = 0; i < amount; i++) {
      const distance = 10 + Math.random() * (radius - 10);
      const arc = Math.random() * Math.PI * 2;
      const position = center
        .add(new Vector3(0, 0, distance)
          .rotateByQuaternionToRef(Quaternion
            .FromEulerAngles(0,arc,0), new Vector3()
      ));
      generateTree(
        scene,
        getRandomTreeOptions(position),
      );
  }
}

interface TreeOptions {
  startLength: number;
  startWidth: number;
  position: Vector3;
  direction: Vector3;
  startSegments: number;
  recursions: number;
}

function getRandomTreeOptions(position: Vector3): TreeOptions {
  return {
    startLength: .7 + Math.random() * .6,
    startWidth: .5 + Math.random(),
    position: position,
    direction: Vector3.Up(),
    startSegments: 5,
    recursions: Math.random() > .5 ? 4 : 5,
  };
}

export function generateTree(scene: Scene, treeOptions: TreeOptions) {
  const barkColor = Color3.FromHexString(COLORS.BROWN);

  const material = new StandardMaterial("terrainMaterial", scene);
  material.diffuseColor = Color3.White();
  material.specularColor = Color3.Black();

  const firstBranch = generateBranch(
    {
      length: treeOptions.startLength,
      width: treeOptions.startWidth,
      position: treeOptions.position,
      direction: Vector3.Up(),
      segments: treeOptions.startSegments,
    },
  );
  const maxRecursions = treeOptions.recursions;
  const tree: TreeData = {
    branch: firstBranch,
    splits: [],
  }
  const meshes = [
    ...splitBranch(0, maxRecursions, tree, {material, barkColor}), 
    prepMesh(firstBranch, barkColor, material)
  ];
  const treeMesh = Mesh.MergeMeshes(meshes, true, false);
  return treeMesh;
}

function splitBranch(recursions: number, max: number, treeData: TreeData, meshOptions: MeshOptions): Array<Mesh> {
  treeData.splits.push({
    branch: generateBranch(
      {
        length: treeData.branch.length,
        width: treeData.branch.width,
        position: treeData.branch.position,
        direction: addRandomRotation(treeData.branch.direction, 1),
        segments: 5,
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
      },
    ),
    splits: []
  });
  recursions++;
  
  let meshes = [
    prepMesh(treeData.splits[0].branch, meshOptions.barkColor, meshOptions.material),
    prepMesh(treeData.splits[1].branch, meshOptions.barkColor, meshOptions.material),
  ];

  if (recursions < max) {
    meshes = [
      ...meshes,
      ...splitBranch(recursions, max, treeData.splits[0], meshOptions),
      ...splitBranch(recursions, max, treeData.splits[1], meshOptions),
    ];
  } 
  return meshes;
}

function generateBranch(
  options: BranchData,
): BranchEndData {
  let { length, width, position, direction, segments} = options;
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
  const positions = [...tube.getVerticesData(BABYLON.VertexBuffer.PositionKind)];
  const indices = [...tube.getIndices()];
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

function prepMesh(branchEndData: BranchEndData, barkColor: Color3, material: Material): Mesh {
  const mesh: Mesh = new Mesh("tree");
  const positions = branchEndData.positions;
  const indices = branchEndData.indices;
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
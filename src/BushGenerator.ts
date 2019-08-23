import { Vector3, Quaternion, MeshBuilder, StandardMaterial, Color3, Scene, Mesh } from "babylonjs";
import { COLORS } from "./Constants/colors";
import { prepMesh, addRandomRotation } from "./Utils/MeshGeneratorUtils";
import { generateBranch } from "./TreeGenerator";

export function generateBushesInRadius(scene: Scene, amount: number, center: Vector3, radius: number, heightMap: number[][]) {
  for (let i = 0; i < amount; i++) {
    const distance = 10 + Math.random() * (radius - 10);
    const arc = Math.random() * Math.PI * 2;
    const position = center
      .add(new Vector3(0, 0, distance)
        .rotateByQuaternionToRef(Quaternion
          .FromEulerAngles(0,arc,0), new Vector3()
    ));
    position.y = heightMap[Math.floor(position.x)][Math.floor(position.z)];
    generateBush(
      scene,
      position
    );
  }
}

export function generateBush(scene: Scene, position: Vector3) {
  const bushColor = Color3.FromHexString(COLORS.DARK_GREEN);
  const stemColor = Color3.FromHexString(COLORS.BROWN);
  const material = new StandardMaterial("bushMaterial", scene);
  material.diffuseColor = Color3.White();
  material.specularColor = Color3.Black();
  // const sphere = MeshBuilder.CreateSphere("sphere", {
  //   diameter: 1,
  //   segments: 8,
  //   // slice: .5,
  // });
  // const sphere = MeshBuilder.CreateIcoSphere("bushy", {
  //   radius: .5,
  //   subdivisions: 1,
  // });
  // sphere.position = position;
  // prepMesh(sphere, bushColor, material);
  
  const baseBranch = generateBranch({
    direction: Vector3.Up(),
    position,
    width: .2,
    length: .4,
    segments: 2,
  });
  baseBranch.mesh = prepMesh(baseBranch.mesh, stemColor, material);
  const meshes = [baseBranch.mesh];
  // const splitBranches = [];
  for (let i = 0; i < 2 + Math.round(Math.random() * 2); i++) {
    const branch = generateBranch({
      direction: addRandomRotation(baseBranch.direction, Math.PI / 2),
      position: baseBranch.position,
      width: baseBranch.width,
      length: .2,
      segments: 5,
    });
    prepMesh(branch.mesh, stemColor, material);

    const bush = MeshBuilder.CreateIcoSphere("bushy", {
      radius: .5 + Math.random() * .5,
      subdivisions: 1,
    });
    bush.position = branch.position;
    bush.rotation = new Vector3(
      Math.random() * (Math.PI * 2),
      Math.random() * (Math.PI * 2),
      Math.random() * (Math.PI * 2)
    );
    prepMesh(bush, bushColor, material);

    // TODO: find out how these can also be merged
  }
  // Mesh.MergeMeshes(meshes);

  // const mesh = Mesh.MergeMeshes(meshes, true, false);
  // scene.addMesh(mesh);
}
import { Scene, Mesh, VertexBuffer, StandardMaterial, Color3, VertexData, FloatArray, IndicesArray, Vector3 } from "babylonjs";
import { COLORS } from "../Constants/colors";
import { Updateable } from "../Utils/Updateable";

export function makeSea(scene: Scene, size: number, center: Vector3) {
  const waterMesh = Mesh.CreateGround("ground", size, size, 16, scene, true);
  waterMesh.convertToFlatShadedMesh();
  // waterMesh.useVertexColors = true;
  // waterMesh.hasVertexAlpha = true;
  const meshColor = Color3.FromHexString(COLORS.BLUE);
  const material = new StandardMaterial("waterMaterial", scene);
  material.diffuseColor = meshColor; //Color3.White();
  material.specularColor = Color3.Black();
  material.alpha = .6;
  waterMesh.material = material;

	const positions = waterMesh.getVerticesData(VertexBuffer.PositionKind);
  const indices = waterMesh.getIndices();
  new Waves(
    waterMesh, 
    positions, 
    indices
  );

  waterMesh.position = center;
  waterMesh.createInstance("water1").position = center.add(new Vector3(1, .1, 1));
  waterMesh.createInstance("water1").position = center.add(new Vector3(-1, -.1, -1));
}

class Waves extends Updateable {

  private alpha: number = 0;

  constructor (
    private waterMesh: Mesh, 
    private positions: FloatArray, 
    private indices: IndicesArray,
  ) {
    super();
  }

  update(delta: number) {
    const len = this.positions.length;
	    
    for(let index = 0; index<len; index+=3) {
      this.positions[index+1] = Math.sin((this.positions[index+2] + this.positions[index] * .5) + this.alpha) * .1;
    }

		this.waterMesh.updateVerticesData(VertexBuffer.PositionKind, this.positions, false);
    const normals: number[] = [];
    VertexData.ComputeNormals(
      this.positions,
      this.indices,
      normals,
    );
    this.waterMesh.updateVerticesData(VertexBuffer.NormalKind, normals, false);
		
		this.alpha += 2 * delta;
  }
}
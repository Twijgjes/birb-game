import { Scene, Engine, Color3, Mesh, HemisphericLight, Vector3, DirectionalLight, ShadowGenerator, Animation } from "babylonjs";
import { COLORS } from "./Constants/colors";
import { GradientMaterial } from "babylonjs-materials";

export function setupEnvironment(engine: Engine): Scene {
  // Create a basic BJS Scene object
  const scene = new Scene(engine);
  scene.clearColor = Color3.FromHexString(COLORS.SKY).toColor4(1);
  scene.fogMode = Scene.FOGMODE_EXP;
  scene.fogDensity = 0.01;
  scene.fogColor = Color3.FromHexString(COLORS.HAZY_SKY);

  // Skybox, or sphere more like
  const skySphere = Mesh.CreateSphere("sphere", 20.0, 1000.0, scene);
  skySphere.infiniteDistance = true;
  // Look up gradient material docs for more info
  const gradientMaterial = new GradientMaterial("grad", scene);
  gradientMaterial.topColor = Color3.FromHexString(COLORS.DARK_SKY); // Set the gradient top color
  gradientMaterial.bottomColor = Color3.FromHexString(COLORS.HAZY_SKY); // Set the gradient bottom color
  // gradientMaterial.offset = 0.25;
  gradientMaterial.backFaceCulling = false;
  gradientMaterial.disableLighting = true;
  skySphere.material = gradientMaterial;

  // Create a basic light, aiming 0, 1, 0 - meaning, to the sky
  // const hemiLight = new HemisphericLight('light1', new Vector3(.1, 1, 0), scene);
  // hemiLight.intensity = 1;
	const dirLight = new DirectionalLight("dir01", new Vector3(.1, -1, 0), scene);
  // dirLight.direction = Vector3.Left();
	// dirLight.position = new Vector3(20, 40, 20);
  const sunAnim = new Animation("sun", "direction", 30, Animation.ANIMATIONTYPE_VECTOR3, Animation.ANIMATIONLOOPMODE_CYCLE)
  sunAnim.setKeys([
    {
      frame: 0,
      value: new Vector3(.1, -1, 0),
    },
    {
      frame: 25,
      value: new Vector3(.1, .1, 1),
    },
    {
      frame: 50,
      value: new Vector3(.1, -1, 0),
    },
    // {
    //   frame: 55,
    //   value: Vector3.Left(),
    // },
    // {
    //   frame: 100,
    //   value: Vector3.Down(),
    // },
  ]);
  dirLight.animations.push(sunAnim);
  scene.beginAnimation(dirLight, 0, 50, true, .1);

  // Shadows
  const shadowGenerator = new ShadowGenerator(2048, dirLight);
  shadowGenerator.useBlurExponentialShadowMap = true;
  shadowGenerator.useKernelBlur = true;
  shadowGenerator.blurKernel = 64;

  return scene;
}
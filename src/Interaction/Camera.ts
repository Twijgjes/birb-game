import * as BABYLON from 'babylonjs';
import { Vector3, FreeCamera, Scene, Engine } from 'babylonjs';
import { Updateable } from '../Utils/Updateable';

export default function setupCameraAndControls(canvas: HTMLCanvasElement, scene: Scene, engine: Engine, startPosition: Vector3) {
  // Create a FreeCamera, and set its position to {x: 0, y: 5, z: -10}
  var camera = new BABYLON.FreeCamera('camera1', startPosition, scene);
  // Target the camera to scene origin
  // Attach the camera to the canvas
  camera.attachControl(canvas, false);
  camera.keysUp.push(87);    //W
  camera.keysDown.push(83)   //D
  camera.keysLeft.push(65);  //A
  camera.keysRight.push(68); //S
  // camera.inputs.addDeviceOrientation();

  camera.inputs.addDeviceOrientation();
  camera.speed = .5;
  camera.setTarget(new Vector3(0, 0, 0));

  // engine.enterFullscreen(false);

  // navigator.permissions.query({name: "accelerometer"});
  // navigator.permissions.query({name: "gyroscope"});

  // if (isMobileDevice()) {
  //   alert("Removing mouse controls");
  //   camera.inputs.removeMouse();
  // }
  new MoveCamera(camera);

  return camera;
}

function isMobileDevice() {
    return (typeof window.orientation !== "undefined") || (navigator.userAgent.indexOf('IEMobile') !== -1);
};

class MoveCamera extends Updateable {
  private movingForward: boolean = false;
  private camera: FreeCamera;

  constructor(camera: FreeCamera) {
    super();
    this.camera = camera;
    addEventListener("touchstart", () => {
      this.movingForward = true;
    }, false);
    addEventListener("touchend", () => {
      this.movingForward = false;
    }, false);
  }

  update(delta: number) {
    if (!this.movingForward) {
      return
    }
    this.camera.position = this.camera.position.add(this.camera.getDirection(Vector3.Forward()).scale(delta).scale(10));
  }
}
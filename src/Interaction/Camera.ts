import * as BABYLON from 'babylonjs';

export default function setupCameraAndControls(canvas: HTMLCanvasElement, scene: BABYLON.Scene) {
  // Create a FreeCamera, and set its position to {x: 0, y: 5, z: -10}
  var camera = new BABYLON.FreeCamera('camera1', new BABYLON.Vector3(50, 5, 50), scene);
  // Target the camera to scene origin
  camera.setTarget(BABYLON.Vector3.Zero());
  // Attach the camera to the canvas
  camera.attachControl(canvas, false);
  camera.keysUp.push(87);    //W
  camera.keysDown.push(83)   //D
  camera.keysLeft.push(65);  //A
  camera.keysRight.push(68); //S

  camera.inputs.addDeviceOrientation();
  camera.speed = .5;

  if (isMobileDevice()) {
    camera.inputs.removeMouse();
  }
  return camera;
}

function isMobileDevice() {
    return (typeof window.orientation !== "undefined") || (navigator.userAgent.indexOf('IEMobile') !== -1);
};
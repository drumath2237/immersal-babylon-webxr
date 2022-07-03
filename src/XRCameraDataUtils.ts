import { BaseTexture, Engine } from "@babylonjs/core";
import { CameraIntrinsics } from "./CameraIntrinsics";

const createCameraTexture = (
  engine: Engine,
  referenceSpace: XRReferenceSpace,
  frame: XRFrame
): BaseTexture | null => {
  const viewerPose = frame.getViewerPose(referenceSpace);

  if (!viewerPose) {
    console.error("viewerPose is null");
    return null;
  }
  const view = viewerPose.views[0];

  const bindings = new XRWebGLBinding(frame.session, engine._gl);
  const cameraWebGLTexture = (bindings as any).getCameraImage(
    (view as any).camera
  ) as WebGLTexture;

  if (!cameraWebGLTexture) {
    console.error("cannot get camera WebGLTexture Object");
    return null;
  }

  const cameraInternalTexture = engine.wrapWebGLTexture(cameraWebGLTexture);
  const baseTexture = new BaseTexture(engine);
  baseTexture._texture = cameraInternalTexture;

  return baseTexture;
};

const convertTextureToUint8ArrayAsync = async (
  baseTexture: BaseTexture
): Promise<Uint8ClampedArray | null> => {
  const arrayView = await baseTexture.readPixels();
  if (arrayView === null) {
    console.error("cannot read pixels");
    return null;
  }

  return new Uint8ClampedArray(arrayView.buffer);
};

const convertTextureToImageDataAsync = async (
  baseTexture: BaseTexture
): Promise<ImageData | null> => {
  const imageBufferArray = await convertTextureToUint8ArrayAsync(baseTexture);
  if (imageBufferArray === null) {
    return null;
  }
  return new ImageData(imageBufferArray, baseTexture.getSize().width);
};

const getCameraIntrinsics = (
  projectionMatrix: Float32Array,
  viewport: XRViewport
): CameraIntrinsics => {
  const p = projectionMatrix;

  // Principal point in pixels (typically at or near the center of the viewport)
  const u0 = ((1 - p[8]) * viewport.width) / 2 + viewport.x;
  const v0 = ((1 - p[9]) * viewport.height) / 2 + viewport.y;

  // Focal lengths in pixels (these are equal for square pixels)
  const ax = (viewport.width / 2) * p[0];
  const ay = (viewport.height / 2) * p[5];

  return {
    principalOffset: {
      x: u0,
      y: v0,
    },
    focalLength: {
      x: ax,
      y: ay,
    },
  };
};

export {
  createCameraTexture,
  convertTextureToImageDataAsync,
  getCameraIntrinsics,
};

import { AdvancedDynamicTexture, Button, Control } from '@babylonjs/gui';
import {
  DirectionalLight,
  Engine,
  MeshBuilder,
  Quaternion,
  Scene,
  Vector3,
  WebXRDefaultExperience,
} from '@babylonjs/core';
import {
  convertTextureToImageDataAsync,
  createCameraTexture,
  getCameraIntrinsics,
} from './XRCameraDataUtils';
import { IPngEncoder } from './IPngEncoder';
import { CameraIntrinsics } from './CameraIntrinsics';
import { ImmersalClient } from './ImmersalClient';

export default class BabylonApp {
  private engine: Engine;

  private scene: Scene;

  private xr?: WebXRDefaultExperience;

  private pngEncoder: IPngEncoder;

  public constructor(renderCanvas: HTMLCanvasElement, encoder: IPngEncoder) {
    this.engine = new Engine(renderCanvas, true);
    this.scene = new Scene(this.engine);

    this.pngEncoder = encoder;
  }

  public RunAsync = async () => {
    const webxrTask = this.scene.createDefaultXRExperienceAsync({
      uiOptions: {
        sessionMode: 'immersive-ar',
        referenceSpaceType: 'unbounded',
        optionalFeatures: ['camera-access'],
      },
    });

    this.InitScene();

    this.xr = await webxrTask;

    this.xr.baseExperience.onStateChangedObservable.add(() => {
      const { button } = this.InitGUI();
      button.onPointerClickObservable.add(() => {
        this.OnClick();
      });
    });

    this.engine.runRenderLoop(() => {
      this.scene.render();
    });

    window.addEventListener('resize', () => {
      this.engine.resize();
    });
  };

  private InitScene = () => {
    this.scene.createDefaultCamera(true, true, true);

    new DirectionalLight('light', new Vector3(0.4, -1, 0.6), this.scene);

    const box = MeshBuilder.CreateBox('box', { size: 0.2 }, this.scene);
    box.position = new Vector3(0, 0.1, 0);
  };

  private InitGUI = () => {
    const advancedTexture = AdvancedDynamicTexture.CreateFullscreenUI('UI');

    const button = Button.CreateSimpleButton('button', 'button');
    button.widthInPixels = 800;
    button.heightInPixels = 150;
    button.color = 'white';
    button.cornerRadius = 20;
    button.background = 'green';
    button.fontSizeInPixels = 50;
    button.verticalAlignment = Control.VERTICAL_ALIGNMENT_BOTTOM;
    button.topInPixels = -10;
    advancedTexture.addControl(button);
    return { button };
  };

  private OnClick = () => {
    this.xr?.baseExperience.sessionManager.runInXRFrame(async () => {
      if (!this.xr) {
        return;
      }

      const frame = this.xr.baseExperience.sessionManager.currentFrame;
      if (frame === null) {
        return;
      }

      if (!this.scene.activeCamera) {
        return;
      }

      const cameraPos = this.scene.activeCamera.position;
      const cameraRot = this.scene.activeCamera.absoluteRotation;

      const intrinsics = this.CreateCameraIntrinsicsFromFrame(frame);
      const b64Strins = await this.CreateCameraImageBase64StringFromFrameAsync(
        frame
      );

      if (intrinsics === null || b64Strins === null) {
        return;
      }

      const resMatrix = await ImmersalClient.localizeAsync(
        b64Strins,
        intrinsics
      );

      if (resMatrix === null) {
        return;
      }

      let pos = Vector3.Zero();
      let rot = Quaternion.Identity();
      resMatrix.decompose(undefined, rot, pos);
      rot = Quaternion.FromRotationMatrix(resMatrix);

      console.log(pos, rot);
    }, true);
  };

  private CreateCameraIntrinsicsFromFrame = (
    frame: XRFrame
  ): CameraIntrinsics | null => {
    if (!this.xr) {
      return null;
    }

    const referenceSpace = this.xr.baseExperience.sessionManager.referenceSpace;

    const viewerPose = frame.getViewerPose(referenceSpace);
    if (!viewerPose) {
      return null;
    }

    const view = viewerPose.views[0];
    if (!view) {
      return null;
    }

    const viewport: XRViewport = {
      x: 0,
      y: 0,
      width: (view as any).camera.width,
      height: (view as any).camera.height,
    };

    const projectionMatrix = view.projectionMatrix;

    const intrinsics = getCameraIntrinsics(projectionMatrix, viewport);

    return intrinsics;
  };

  private CreateCameraImageBase64StringFromFrameAsync = async (
    frame: XRFrame
  ): Promise<string | null> => {
    if (!this.xr) {
      return null;
    }

    const refernceSpace = this.xr.baseExperience.sessionManager.referenceSpace;

    const texture = createCameraTexture(this.engine, refernceSpace, frame);

    if (texture === null) {
      return null;
    }
    const imageData = await convertTextureToImageDataAsync(texture);

    if (imageData === null) {
      return null;
    }

    // Image is vertically flipped
    // Didn't find a better way to flip the image back
    const imageFlip = new ImageData(imageData.width, imageData.height);
    const Npel = imageData.data.length / 4;

    for (let kPel = 0; kPel < Npel; kPel++) {
      const kFlip = BabylonApp.flip_index(
        kPel,
        imageData.width,
        imageData.height
      );
      const offset = 4 * kPel;
      const offsetFlip = 4 * kFlip;
      imageFlip.data[offsetFlip] = imageData.data[offset];
      imageFlip.data[offsetFlip + 1] = imageData.data[offset + 1];
      imageFlip.data[offsetFlip + 2] = imageData.data[offset + 2];
      imageFlip.data[offsetFlip + 3] = imageData.data[offset + 3];
    }

    const b64Image = this.pngEncoder.encodeBase64(imageFlip);

    return b64Image;
  };

  private static flip_index = (kPel: number, width: number, height: number) => {
    const i = Math.floor(kPel / width);
    const j = kPel % width;

    return height * width - (i + 1) * width + j;
  };
}

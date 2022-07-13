import { Matrix } from '@babylonjs/core';
import { CameraIntrinsics } from './CameraIntrinsics';
interface MapID {
  id: number;
}

interface RequestLocalizeImage {
  token: string;
  mapIds: MapID[];
  b64: string;
  fx: number;
  fy: number;
  ox: number;
  oy: number;
}

interface ResponseLocalizeImage {
  error: string;
  success: boolean;
  map: number;
  px: number;
  py: number;
  pz: number;
  r00: number;
  r01: number;
  r02: number;
  r10: number;
  r11: number;
  r12: number;
  r20: number;
  r21: number;
  r22: number;
}

class ImmersalLocalizerCore {
  private apiBaseURL: string;

  public constructor(apiUrl = 'https://api.immersal.com/') {
    this.apiBaseURL = apiUrl;
  }

  public async localizeRequestAsync(
    params: RequestLocalizeImage
  ): Promise<ResponseLocalizeImage> {
    return fetch(this.apiBaseURL + 'localizeb64', {
      mode: 'cors',
      method: 'POST',
      body: JSON.stringify(params),
    })
      .then((data) => {
        return data.json();
      })
      .then((json) => {
        console.log(json);
        return json as ResponseLocalizeImage;
      });
  }
}

export class ImmersalClient {
  private static immersalLocalizerCore: ImmersalLocalizerCore;

  public static async localizeAsync(
    imageB64: string,
    intrinsics: CameraIntrinsics
  ): Promise<Matrix | null> {
    if (!process.env.API_TOKEN || !process.env.MAP_ID) {
      return null;
    }

    const token: string = process.env.API_TOKEN;
    const mapId: number = parseInt(process.env.MAP_ID);

    if (!this.immersalLocalizerCore) {
      this.immersalLocalizerCore = new ImmersalLocalizerCore();
    }

    const res = await this.immersalLocalizerCore.localizeRequestAsync({
      b64: imageB64,
      mapIds: [{ id: mapId }],
      fx: intrinsics.focalLength.x,
      fy: intrinsics.focalLength.y,
      ox: intrinsics.principalOffset.x,
      oy: intrinsics.principalOffset.y,
      token: token,
    });

    const matrix = new Matrix();
    matrix.setRowFromFloats(0, res.r00, res.r01, res.r02, res.px);
    matrix.setRowFromFloats(1, res.r10, res.r11, res.r12, res.py);
    matrix.setRowFromFloats(2, res.r20, res.r21, res.r22, res.pz);

    return matrix;
  }
}

import { IPngEncoder } from './IPngEncoder';

export default class CanvasPngEncoder implements IPngEncoder {
  private ctx: CanvasRenderingContext2D | null;

  public constructor(canvas: HTMLCanvasElement) {
    this.ctx = canvas.getContext('2d');
  }

  public encodeBase64 = (data: ImageData): string | null => {
    if (this.ctx === null) {
      console.error('cannot get 2d context');
      return null;
    }

    this.ctx.canvas.width = data.width;
    this.ctx.canvas.height = data.height;
    this.ctx.putImageData(data, 0, 0);

    return this.ctx.canvas
      .toDataURL('png/image')
      .replace('data:image/png;base64,', '');
  };
}

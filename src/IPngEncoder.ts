export interface IPngEncoder {
  encodeBase64: (data: ImageData) => string | null;
}

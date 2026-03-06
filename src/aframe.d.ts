export {};

declare global {
  namespace JSX {
    interface IntrinsicElements {
      "a-scene": any;
      "a-marker": any;
      "a-entity": any;
      "a-assets": any;
      "a-asset-item": any;
      "a-camera": any;

      "a-plane": any;
      "a-box": any;
      "a-sphere": any;
      "a-cylinder": any;
      "a-text": any;
      "a-light": any;

      [key: string]: any;
    }
  }
}
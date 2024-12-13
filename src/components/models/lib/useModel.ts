import { ObjectMap, useLoader } from "@react-three/fiber";
import { Material } from "three";
import { GLTF, GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

export type ColorMapModel = GLTF &
  ObjectMap & {
    colormap: Material;
  };

export function useGltf(url: string): ColorMapModel {
  const model = useLoader(GLTFLoader, url);
  return { ...model, colormap: model.materials.colormap };
}

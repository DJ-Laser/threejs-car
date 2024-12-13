import { useLoader } from "@react-three/fiber";
import { MTLLoader, OBJLoader } from "three/examples/jsm/Addons.js";

export function useObjMtl(objUrl: string, mtlUrl: string) {
  const mtl = useLoader(MTLLoader, mtlUrl);
  const obj = useLoader(OBJLoader, objUrl, (loader) => {
    mtl.preload();
    loader.setMaterials(mtl);
  });

  return obj;
}

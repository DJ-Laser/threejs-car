import { useLoader } from "@react-three/fiber";
import { Group, Object3DEventMap } from "three";
import { GLTFLoader } from "three/examples/jsm/Addons.js";
import CarMTLFile from "../../assets/kenny-car/police.mtl?url";
import CarFile from "../../assets/kenny-car/police.obj?url";
import { useObjMtl } from "./lib/useObjMtl";

export function usePoliceCar() {
  const model = useObjMtl(CarFile, CarMTLFile);
  const model2 = useLoader(GLTFLoader, CarMTLFile);
  const chasis = new Group<Object3DEventMap>();

  const wheels = model.children;
  return { chasis: model, wheels };
}

import ConeFile from "../../assets/kenny-car/cone.glb?url";
import { ScaleFactor, useMeshPart } from "./lib/useMeshPart";
import { useGltf as useModel } from "./lib/useModel";

export function useCone(scale?: ScaleFactor) {
  const model = useModel(ConeFile);
  const cone = useMeshPart(model, "cone_1", scale);

  return cone;
}

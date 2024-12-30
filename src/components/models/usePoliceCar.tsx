import CarFile from "../../assets/kenny-car/police.glb?url";
import { ScaleFactor, useMeshPart } from "./lib/useMeshPart";
import { useGltf as useModel } from "./lib/useModel";
import { useWheels } from "./lib/useWheels";

export function usePoliceCar(scale?: ScaleFactor) {
  const model = useModel(CarFile);

  const chassis = useMeshPart(model, "body", scale);
  const wheels = useWheels(model, scale);

  return { chassis, wheels };
}

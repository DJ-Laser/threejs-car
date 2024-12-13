import CarFile from "../../assets/kenny-car/police.glb?url";
import { useGroup } from "./lib/useGroup";
import { useMeshPart } from "./lib/useMeshPart";
import { useGltf as useModel } from "./lib/useModel";
import { useWheels } from "./lib/useWheels";

export function usePoliceCar() {
  const model = useModel(CarFile);

  const grill = useMeshPart(model, "grill");
  const body = useMeshPart(model, "body");
  const chassis = useGroup([grill, body]);
  const wheels = useWheels(model);

  return { chassis, wheels };
}

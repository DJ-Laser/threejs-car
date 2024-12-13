import CarFile from "../../assets/kenny-car/police.glb?url";
import { MeshPart } from "./lib/MeshPart";
import { useGltf as useModel } from "./lib/useModel";
import { Wheels } from "./lib/Wheels";

export function usePoliceCar() {
  const model = useModel(CarFile);
  const chassis = (
    <group>
      <MeshPart name="grill" model={model} />
      <MeshPart name="body" model={model} />
    </group>
  );
  return { chassis, wheels: <Wheels model={model} /> };
}

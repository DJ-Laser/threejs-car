import { Mesh } from "three";
import { ColorMapModel } from "./useModel";

export interface MeshPartProps {
  model: ColorMapModel;
  name: string;
}

export function MeshPart({ model, name }: MeshPartProps) {
  return (
    <mesh
      geometry={(model.nodes[name] as Mesh).geometry}
      position={model.nodes[name].position}
      material={model.colormap}
    />
  );
}

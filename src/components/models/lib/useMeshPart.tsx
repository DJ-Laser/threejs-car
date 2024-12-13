import { MeshProps } from "@react-three/fiber";
import { useMemo } from "react";
import { Mesh } from "three";
import { ColorMapModel } from "./useModel";

export interface MeshPartProps {
  model: ColorMapModel;
  name: string;
  props?: MeshProps;
}

export function useMeshPart(model: ColorMapModel, name: string): Mesh {
  return useMemo(() => {
    const part = new Mesh();
    part.geometry = (model.nodes[name] as Mesh).geometry;
    part.position.copy(model.nodes[name].position);
    part.material = model.colormap;
    return part;
  }, [model, name]);
}

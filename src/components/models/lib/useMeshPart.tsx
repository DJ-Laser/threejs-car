import { useMemo } from "react";
import { Mesh, Vector3Like } from "three";
import { ColorMapModel } from "./useModel";

export type ScaleFactor = Vector3Like | [number, number, number] | number;

export function useMeshPart(
  model: ColorMapModel,
  name: string,
  scale: ScaleFactor = 1,
): Mesh {
  return useMemo(() => {
    let scaleFactor: [number, number, number];
    if (typeof scale == "number") {
      scaleFactor = [scale, scale, scale];
    } else if (Array.isArray(scale)) {
      scaleFactor = scale;
    } else {
      scaleFactor = [scale.x, scale.y, scale.z];
    }

    const part = new Mesh();
    part.geometry = (model.nodes[name] as Mesh).geometry.clone();
    part.geometry.scale(...scaleFactor);
    part.position.copy(model.nodes[name].position);
    part.position.x *= scaleFactor[0];
    part.position.y *= scaleFactor[1];
    part.position.z *= scaleFactor[2];

    part.material = model.colormap;
    part.castShadow = true;
    return part;
  }, [model.colormap, model.nodes, name, scale]);
}

import { useMemo } from "react";
import { Group, Object3D } from "three";

export function useGroup(objects: Object3D[]) {
  return useMemo(() => {
    const group = new Group();
    group.add(...objects);
    return group;
  }, [objects]);
}

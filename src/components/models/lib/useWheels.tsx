import { useMemo } from "react";
import { MeshPartProps, useMeshPart } from "./useMeshPart";
import { ColorMapModel } from "./useModel";

export interface WheelsProps {
  model: ColorMapModel;
  props?: MeshPartProps[];
}

export function useWheels(model: ColorMapModel) {
  const frontLeft = useMeshPart(model, "wheel-front-left");
  const frontRight = useMeshPart(model, "wheel-front-right");
  const backLeft = useMeshPart(model, "wheel-back-left");
  const backRight = useMeshPart(model, "wheel-back-right");
  return useMemo(
    () => [frontLeft, frontRight, backLeft, backRight],
    [backLeft, backRight, frontLeft, frontRight],
  );
}

import { useMemo } from "react";
import { ScaleFactor, useMeshPart } from "./useMeshPart";
import { ColorMapModel } from "./useModel";

export function useWheels(model: ColorMapModel, scale?: ScaleFactor) {
  const frontLeft = useMeshPart(model, "wheel-front-left", scale);
  const frontRight = useMeshPart(model, "wheel-front-right", scale);
  const backLeft = useMeshPart(model, "wheel-back-left", scale);
  const backRight = useMeshPart(model, "wheel-back-right", scale);
  return useMemo(
    () => [frontLeft, frontRight, backLeft, backRight],
    [backLeft, backRight, frontLeft, frontRight],
  );
}

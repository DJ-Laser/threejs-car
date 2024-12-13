import { useMemo } from "react";
import { MeshPart } from "./MeshPart";
import { ColorMapModel } from "./useModel";

export function Wheels({ model }: { model: ColorMapModel }) {
  const axles = ["front", "back"];
  const sides = ["left", "right"];
  const wheels = useMemo(
    () =>
      axles.flatMap((axle) =>
        sides.map((side) => (
          <MeshPart name={`wheel-${axle}-${side}`} model={model} />
        )),
      ),
    [model],
  );
  return <>{...wheels}</>;
}

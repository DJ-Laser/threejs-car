import { useMemo } from "react";
import { Euler, Vector3 } from "three";
import { Cone } from "./Cone";

interface TransformConeProps {
  args: [[number, number, number], [number, number, number], Euler];
}

function TransformCone({ args }: TransformConeProps) {
  const [offset, origin, rotation] = args;

  const translation = useMemo(() => {
    const translation = new Vector3(...offset);
    translation.applyEuler(rotation);

    translation.x += origin[0];
    translation.y += origin[1];
    translation.z += origin[2];

    return translation;
  }, [offset, origin, rotation]);

  return <Cone position={translation} rotation={rotation} />;
}

function ConeLine({
  num = 5,
  dist = 1.5,
  position: pos,
  rotation: rot,
}: ConeProps) {
  return (
    <>
      ...
      {Array.from({ length: num }, (_, idx) => (
        <TransformCone key={idx} args={[[0, 0, idx * dist], pos, rot]} />
      ))}
    </>
  );
}

interface ConeProps {
  dist?: number;
  num?: number;
  position: [number, number, number];
  rotation: Euler;
}

function ConeTriangle({
  dist = 1,
  num: layers = 3,
  position,
  rotation,
}: ConeProps) {
  const cones = useMemo(() => {
    const cones: [number, number, number][] = [];

    for (let i = 0; i < layers; i++) {
      for (let j = 0; j <= i; j++) {
        const xOffset = j * dist - (i * dist) / 2;
        cones.push([xOffset, 0, i * dist]);
      }
    }

    return cones;
  }, [dist, layers]);

  return (
    <>
      ...
      {cones.map((offset, i) => (
        <TransformCone key={i} args={[offset, position, rotation]} />
      ))}
    </>
  );
}

export function Cones() {
  return (
    <>
      <ConeTriangle
        num={7}
        dist={1.5}
        position={[0, 0, 23]}
        rotation={new Euler(0, 0, 0, "XYZ")}
      />
      <ConeTriangle
        num={7}
        dist={1.5}
        position={[15, 0, -23]}
        rotation={new Euler(0, Math.PI / 2, 0, "XYZ")}
      />
      <ConeLine
        num={6}
        position={[5, 0, 10]}
        rotation={new Euler(0, 0, 0, "XYZ")}
      />
    </>
  );
}

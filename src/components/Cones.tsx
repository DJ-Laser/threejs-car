import { useMemo } from "react";
import { Euler, Vector3 } from "three";
import { Cone } from "./Cone";

interface TransformConeProps {
  args: [[number, number, number], [number, number, number], Euler];
}

function TransformCone({ args }: TransformConeProps) {
  const [offset, origin, rotation] = args;

  const translation = useMemo(() => {
    let translation = new Vector3(...offset);
    translation.applyEuler(rotation);

    translation.x += origin[0];
    translation.y += origin[1];
    translation.z += origin[2];

    return translation;
  }, []);

  return <Cone position={translation} rotation={rotation} />;
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
  console.log(`Generating ${layers} layers`);

  const cones = useMemo(() => {
    const cones: [number, number, number][] = [];

    for (let i = 0; i < layers; i++) {
      for (let j = 0; j <= i; j++) {
        const xOffset = j * dist - (i * dist) / 2;
        console.log(`Cone: ${i}, ${j}`);
        cones.push([xOffset, 0, i * dist]);
      }
    }

    return cones;
  }, [dist, layers, position, rotation]);

  return (
    <>
      ...
      {cones.map((offset) => (
        <TransformCone args={[offset, position, rotation]} />
      ))}
    </>
  );
}

export function Cones() {
  return (
    <ConeTriangle
      num={6}
      position={[0, 0, 15]}
      rotation={new Euler(0, 0, 0, "XYZ")}
    />
  );
}

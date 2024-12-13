import { RapierRigidBody, RigidBody } from "@react-three/rapier";
import { useMemo, useRef } from "react";
import { usePoliceCar } from "./models/usePoliceCar";
import { useVehicleController, wheelsFrom } from "./useVehicleController";

export function Car() {
  const { chassis, wheels } = usePoliceCar();
  const carRef = useRef<RapierRigidBody>(null);
  const wheelInfo = useMemo(
    () =>
      wheelsFrom(wheels, {
        suspension: {
          travelDirection: { x: 0, y: -1, z: 0 },
          travelDistance: 1,
          restDistance: 0.125,
          stiffness: 24,
        },
        axleAxis: { x: 1, y: 0, z: 0 },
        radius: 1,
      }),
    [wheels],
  );
  const { chassisRef, wheelPositions } = useVehicleController(
    wheelInfo,
    carRef,
  );

  return (
    <>
      <RigidBody position={[0, 2, 0]} ref={chassisRef} colliders="hull">
        <primitive object={chassis} />
        {wheels.map((wheel, i) => {
          wheel.position.copy(wheelPositions[i]);
          return <primitive key={i} object={wheel} />;
        })}
      </RigidBody>
    </>
  );
}

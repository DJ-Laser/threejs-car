import { MeshCollider, RapierRigidBody, RigidBody } from "@react-three/rapier";
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
        radius: 0.6,
      }),
    [wheels],
  );
  const { chassisRef, getWheelRef } = useVehicleController(wheelInfo, carRef);

  return (
    <>
      <RigidBody position={[0, 2, 0]} ref={chassisRef} colliders={false}>
        <MeshCollider type="hull">
          <primitive object={chassis} />
        </MeshCollider>
        {wheels.map((wheel, i) => (
          <primitive key={i} ref={getWheelRef(i)} object={wheel} />
        ))}
      </RigidBody>
    </>
  );
}

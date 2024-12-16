import { useFrame } from "@react-three/fiber";
import { MeshCollider, RigidBody } from "@react-three/rapier";
import { useMemo } from "react";
import { usePoliceCar } from "./models/usePoliceCar";
import { movementKeymap, useControls } from "./useControls";
import { useVehicleController, wheelsFrom } from "./useVehicleController";

export function Car() {
  const { chassis, wheels } = usePoliceCar();
  const wheelInfo = useMemo(
    () =>
      wheelsFrom(wheels, {
        suspension: {
          travelDirection: { x: 0, y: -1, z: 0 },
          travelDistance: 0.2,
          restDistance: 0.2,
          stiffness: 30,
        },
        axleAxis: { x: 1, y: 0, z: 0 },
        radius: 0.6 / 2,
      }),
    [wheels],
  );
  const { chassisRef, getWheelRef, controllerRef } =
    useVehicleController(wheelInfo);

  const controls = useControls(movementKeymap);

  useFrame(() => {
    if (controllerRef.current) {
      const controller = controllerRef.current;

      let enginePower = controls.get("forward") ? -1 : 0;
      enginePower += controls.get("backward") ? 1 : 0;
      enginePower *= 7;
      controller.setWheelEngineForce(2, enginePower);
      controller.setWheelEngineForce(3, enginePower);

      // In radians
      let turnAngle = controls.get("left") ? 1 : 0;
      turnAngle += controls.get("right") ? -1 : 0;
      turnAngle *= 0.57;

      controller.setWheelSteering(0, turnAngle);
      controller.setWheelSteering(1, turnAngle);
    }
  });

  return (
    <>
      <RigidBody
        position={[0, 2, 0]}
        ref={chassisRef}
        colliders={false}
        canSleep={false}
      >
        <MeshCollider type="trimesh">
          <primitive object={chassis} />
        </MeshCollider>
        {wheels.map((wheel, i) => (
          <primitive key={i} ref={getWheelRef(i)} object={wheel} />
        ))}
      </RigidBody>
    </>
  );
}

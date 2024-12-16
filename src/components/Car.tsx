/*import {
  RapierRigidBody,
  RigidBody,
  useAfterPhysicsStep,
  useRapier,
} from "@react-three/rapier";
import { useCallback, useMemo, useRef } from "react";
import { usePoliceCar } from "./models/usePoliceCar";
import { wheelsFrom } from "./carHelpers";
import { Object3D } from "three";
import { DynamicRayCastVehicleController } from "@dimforge/rapier3d-compat";

export function Car() {
  const { chassis, wheels } = usePoliceCar();
  const wheelInfo = useMemo(
    () =>
      wheelsFrom(wheels, {
        suspension: {
          travelDirection: { x: 0, y: -1, z: 0 },
          travelDistance: 1,
          restDistance: 0.125,
          stiffness: 0,
        },
        axleAxis: { x: 1, y: 0, z: 0 },
        radius: 1,
      }),
    [wheels],
  );

  const {world} = useRapier();
  const controllerRef = useRef<DynamicRayCastVehicleController | null>(null);
  const wheelsRef = useRef<(Object3D | null)[]>([]);

  const chassisRef = useCallback(
    (chassis: RapierRigidBody | null) => {
      if (chassis == null) {
        // Cleanup code
        if (controllerRef.current) {
          world.removeVehicleController(controllerRef.current);
          controllerRef.current = null;
        }
        return;
      }
      const controller = world.createVehicleController(chassis);

      wheels.forEach((wheel, i) => {
        controller.addWheel(
          wheel.position,
          wheel.suspension.travelDirection,
          wheel.axleAxis,
          wheel.suspension.restDistance,
          wheel.radius,
        );

        controller.setWheelMaxSuspensionTravel(
          i,
          wheel.suspension.travelDistance,
        );
      });

      controllerRef.current = controller;
    }z
  );

  useAfterPhysicsStep(() => {
    if (controllerRef.current) {
      const controller = controllerRef.current;
      controller?.updateVehicle(world.timestep);
      const positions = wheels.map((wheel, i) => {
        // Add offset position to starting position to get real position
        const suspensionOffset = new Vector3();
        suspensionOffset.copy(wheel.suspension.travelDirection);

        const suspensionTravel = controller.wheelSuspensionLength(i)!;
        suspensionOffset.setLength(suspensionTravel);

        const position = wheel.position.clone();
        position.add(suspensionOffset);
        return position;
      });
      wheelPositions.current = positions;
    } else {
      wheelPositions.current = null;
    }

  useAfterPhysicsStep(() => {
    const wheelPositions = getWheelPositions();
    wheels.forEach((wheel, i) => {
      wheel.position.copy(wheelPositions[i]);
    });
  });

  return (
    <>
      <RigidBody position={[0, 1, 0]} ref={() => {

      }} colliders="hull">
        <primitive object={chassis} />
        {wheels.map((wheel, i) => {
          return <primitive key={i} object={wheel} />;
        })}
      </RigidBody>
    </>
  );
}*/

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
  const { chassisRef, getWheelRef } = useVehicleController(wheelInfo, carRef);

  return (
    <>
      <RigidBody position={[0, 2, 0]} ref={chassisRef} colliders="hull">
        <primitive object={chassis} />
        {wheels.map((wheel, i) => (
          <primitive key={i} ref={getWheelRef(i)} object={wheel} />
        ))}
      </RigidBody>
    </>
  );
}

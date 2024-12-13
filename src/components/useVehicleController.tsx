import {
  DynamicRayCastVehicleController,
  Vector,
} from "@dimforge/rapier3d-compat";
import {
  RapierRigidBody,
  useAfterPhysicsStep,
  useRapier,
} from "@react-three/rapier";
import { RefObject, useCallback, useRef } from "react";
import { Vector3 } from "three";

export interface SuspensionInfo {
  travelDirection: Vector3;
  travelDistance: number;
  restDistance: number;
  stiffness: number;
}

export interface WheelInfo {
  suspension: SuspensionInfo;
  position: Vector3;
  axleAxis: Vector;
  radius: number;
}

export interface VehicleController {
  controllerRef: RefObject<DynamicRayCastVehicleController>;
  chassisRef: (chassis: RapierRigidBody) => void;
  wheelPositions: Vector3[];
}

export function useVehicleController(wheels: WheelInfo[]): VehicleController {
  const { world } = useRapier();
  const controllerRef = useRef<DynamicRayCastVehicleController | null>(null);
  const wheelPositions = useRef<Vector3[] | null>(null);

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
    },
    [world, wheels],
  );

  useAfterPhysicsStep(() => {
    if (controllerRef.current) {
      const controller = controllerRef.current;
      controller?.updateVehicle(world.timestep);
      const positions = wheels.map((wheel, i) => {
        const position = wheel.position.clone();
        // Add offset position to starting position to get real position
        const suspensionTravel = controller.wheelSuspensionLength(i)!;
        position.add(
          wheel.suspension.travelDirection.clone().setLength(suspensionTravel),
        );

        return position;
      });
      wheelPositions.current = positions;
    } else {
      wheelPositions.current = null;
    }
  });

  return {
    chassisRef,
    controllerRef,
    wheelPositions:
      wheelPositions.current ?? wheels.map((wheel) => wheel.position),
  };
}

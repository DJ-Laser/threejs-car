import {
  DynamicRayCastVehicleController,
  Vector,
} from "@dimforge/rapier3d-compat";
import {
  RapierRigidBody,
  useAfterPhysicsStep,
  useRapier,
} from "@react-three/rapier";
import { MutableRefObject, RefObject, useCallback, useRef } from "react";
import { Object3D, Vector3 } from "three";

export interface SuspensionInfo {
  travelDirection: Vector;
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

export function wheelsFrom(
  wheels: Object3D[],
  otherInfo: Omit<WheelInfo, "position">,
): WheelInfo[] {
  return wheels.map((wheel) => ({
    position: wheel.position,
    ...otherInfo,
  }));
}

export interface VehicleController {
  controllerRef: RefObject<DynamicRayCastVehicleController>;
  chassisRef: (chassis: RapierRigidBody) => void;
  wheelPositions: Vector3[];
}

export function useVehicleController(
  wheels: WheelInfo[],
  chassisForwardRef?: MutableRefObject<RapierRigidBody | null>,
): VehicleController {
  const { world } = useRapier();
  const controllerRef = useRef<DynamicRayCastVehicleController | null>(null);
  const wheelPositions = useRef<Vector3[] | null>(null);

  const chassisRef = useCallback(
    (chassis: RapierRigidBody | null) => {
      if (chassisForwardRef) chassisForwardRef.current = chassis;
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
    [world, wheels, chassisForwardRef],
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
  });

  return {
    chassisRef,
    controllerRef,
    wheelPositions:
      wheelPositions.current ?? wheels.map((wheel) => wheel.position),
  };
}

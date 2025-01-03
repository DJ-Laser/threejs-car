import { useFrame } from "@react-three/fiber";
import {
  CuboidCollider,
  CylinderCollider,
  interactionGroups,
  RapierRigidBody,
  RigidBody,
  usePrismaticJoint,
  useRevoluteJoint,
  useSpringJoint,
} from "@react-three/rapier";
import {
  forwardRef,
  RefObject,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
} from "react";
import { DirectionalLight, Object3D, Vector3 } from "three";
import { CAR_GROUP, STATIC_GROUP, WHEEL_GROUP } from "../collisionGroups";
import { usePoliceCar } from "./models/usePoliceCar";
import { movementKeymap, useControls } from "./useControls";

interface WheelProps {
  chassisRef: RefObject<RapierRigidBody>;
  object: Object3D;
}

interface WheelRef {
  setSteeringAngle(angle: number): void;
  setWheelSpeed(speed: number): void;
  setSteerEnabled(steerEnabled: boolean): void;
  reset(): void;
}

const Wheel = forwardRef<WheelRef, WheelProps>(function Wheel(
  { object, chassisRef },
  ref,
) {
  const wheelRef = useRef<RapierRigidBody>(null);
  const axleRef = useRef<RapierRigidBody>(null);
  const suspensionRef = useRef<RapierRigidBody>(null);
  const sideOffsetDir = useMemo(
    () => (object.position.x < 0 ? -1 : 1),
    [object],
  );
  const initialPos = useMemo<[number, number, number]>(() => {
    const { x, y, z } = object.position;
    const xOffset = sideOffsetDir * 0.1;

    return [x + xOffset, y, z];
  }, [sideOffsetDir, object]);

  const initialWorldPos = useMemo(() => {
    if (!chassisRef.current) return new Vector3(...initialPos);
    const pos = new Vector3();
    pos.copy(chassisRef.current.translation());
    pos.x += initialPos[0];
    pos.y += initialPos[1];
    pos.z += initialPos[2];
    return pos;
  }, [chassisRef, initialPos]);

  const dummyCollidersPos: [number, number, number] = [...initialPos];
  const dummyColliderOffset = 0.2;
  dummyCollidersPos[1] += dummyColliderOffset;

  useSpringJoint(chassisRef, suspensionRef, [
    dummyCollidersPos,
    [0, 0, 0],
    0.2,
    350,
    8,
  ]);
  usePrismaticJoint(chassisRef, suspensionRef, [
    dummyCollidersPos,
    [0, 0, 0],
    [0, -1, 0],
    [0.05, 1],
  ]);

  const steeringJointRef = useRevoluteJoint(suspensionRef, axleRef, [
    [0, 0, 0],
    [0, 0, 0],
    [0, 1, 0],
  ]);

  const rotationJointRef = useRevoluteJoint(axleRef, wheelRef, [
    [0, -dummyColliderOffset, 0],
    [0, 0, 0],
    [1, 0, 0],
  ]);

  const setSteerEnabled = useCallback(
    (steerEnabled: boolean) => {
      if (!steeringJointRef.current) return;
      const steeringJoint = steeringJointRef.current;
      const steeringLimits = 0.5;

      if (steerEnabled) {
        steeringJoint.setLimits(-steeringLimits, steeringLimits);
      } else {
        steeringJoint.setLimits(0, 0);
      }
    },
    [steeringJointRef],
  );

  useEffect(() => setSteerEnabled(false), [setSteerEnabled]);

  useImperativeHandle(ref, () => {
    return {
      setSteeringAngle(angle) {
        if (!steeringJointRef.current) return;
        const steeringJoint = steeringJointRef.current;
        steeringJoint.configureMotorPosition(angle, 2000, 100);
      },

      setWheelSpeed(speed) {
        if (!rotationJointRef.current) return;
        const axleJoint = rotationJointRef.current;
        axleJoint.configureMotorVelocity(speed, 2);
      },

      setSteerEnabled,
      reset() {
        for (const ref of [suspensionRef, axleRef, wheelRef]) {
          if (!ref.current) return;
          const body = ref.current;
          body.setTranslation(new Vector3(...initialPos), true);
          body.setRotation({ x: 1, y: 0, z: 0, w: 0 }, true);
          body.setLinvel({ x: 0, y: 0, z: 0 }, true);
          body.setAngvel({ x: 0, y: 0, z: 0 }, true);
        }
      },
    };
  }, [initialPos, rotationJointRef, setSteerEnabled, steeringJointRef]);

  const wheelWidth = 0.36;
  const wheelRadius = 0.336;

  return (
    <>
      <RigidBody
        ref={suspensionRef}
        collisionGroups={interactionGroups([])}
        position={initialWorldPos}
        density={1}
      >
        <CuboidCollider args={[0.25, 0.2, 0.25]} />
      </RigidBody>
      <RigidBody
        ref={axleRef}
        collisionGroups={interactionGroups([])}
        position={initialWorldPos}
      >
        <CuboidCollider args={[0.25, 0.2, 0.25]} />
      </RigidBody>
      <RigidBody
        ref={wheelRef}
        collisionGroups={interactionGroups(WHEEL_GROUP, STATIC_GROUP)}
        colliders={false}
        position={initialWorldPos}
        ccd={true}
      >
        <CylinderCollider
          args={[wheelWidth / 2, wheelRadius]}
          position={[(wheelWidth / 2) * sideOffsetDir, 0, 0]}
          rotation={[0, 0, Math.PI / 2]}
          friction={1.2}
        />
        <primitive object={object} position={[0, 0, 0]} />
      </RigidBody>
    </>
  );
});

export function Car({ lightRef }: { lightRef: RefObject<DirectionalLight> }) {
  const { chassis: chassisModel, wheels } = usePoliceCar(1.2);
  const chassisRef = useRef<RapierRigidBody>(null);
  const wheelRefs = useRef<(WheelRef | null)[]>([]);

  const controls = useControls(movementKeymap);

  const currentCameraOffset = useRef(new Vector3());
  const currentCameraLookAt = useRef(new Vector3());

  useEffect(() => {
    const chassis = chassisRef.current!;
    chassis.setAdditionalMassProperties(
      0,
      { x: 0, y: -1, z: 0 },
      { x: 0, y: 0, z: 0 },
      { x: 1, y: 0, z: 0, w: 0 },
      false,
    );
  }, []);

  const resetting = useRef(false);

  useFrame((state, delta) => {
    if (!chassisRef.current) return;
    const chassis = chassisRef.current;
    const camera = state.camera;
    const reset = () => {
      if (resetting.current) return;
      resetting.current = true;

      if (!wheelRefs.current) return;
      for (const ref of wheelRefs.current) {
        ref?.reset();
      }

      setTimeout(() => (resetting.current = false), 1000);
    };

    if (resetting.current) {
      chassis.setTranslation({ x: 0, y: 1, z: 0 }, true);
      chassis.setRotation({ x: 0, y: 0, z: 0, w: 1 }, true);
      chassis.setLinvel({ x: 0, y: 0, z: 0 }, true);
      chassis.setAngvel({ x: 0, y: 0, z: 0 }, true);
    } else if (chassis.translation().y < -5) {
      reset();
    }

    const offset = new Vector3(0, 3, -5);
    offset.applyQuaternion(chassis.rotation());
    offset.add(chassis.translation());
    if (offset.y < 0.1) offset.y = 0.1;

    const lookAt = new Vector3(0, 1, 0);
    lookAt.applyQuaternion(chassis.rotation());
    lookAt.add(chassis.translation());

    const t = 1.0 - Math.pow(0.01, delta);
    currentCameraOffset.current.lerp(offset, t);
    currentCameraLookAt.current.lerp(lookAt, t);

    camera.position.copy(currentCameraOffset.current);
    camera.lookAt(currentCameraLookAt.current);

    if (lightRef.current) {
      lightRef.current.position.copy(new Vector3(-5, 5, 0));
      lightRef.current.position.add(chassis.translation());
      lightRef.current.target = chassisModel;
    }

    if (controls.get("reset")) {
      reset();
    }

    let enginePower = controls.get("forward") ? 1 : 0;
    enginePower += controls.get("backward") ? -1 : 0;
    enginePower *= 700;

    // In radians
    let turnAngle = controls.get("left") ? 1 : 0;
    turnAngle += controls.get("right") ? -1 : 0;

    wheelRefs.current.forEach((wheel, i) => {
      if (!wheel) return;
      if (i < 2) {
        wheel.setSteeringAngle(turnAngle * 0.45);
        wheel.setSteerEnabled(true);
      } else {
        wheel.setSteeringAngle(0);
        wheel.setWheelSpeed(enginePower);
      }
    });
  });

  return (
    <>
      <RigidBody
        ref={chassisRef}
        colliders="trimesh"
        collisionGroups={interactionGroups(CAR_GROUP)}
        canSleep={false}
        position={[0, 0.1, 0]}
      >
        <primitive object={chassisModel} />
      </RigidBody>
      {wheels.map((wheel, i) => (
        <Wheel
          key={i}
          object={wheel}
          chassisRef={chassisRef}
          ref={(ref) => (wheelRefs.current[i] = ref)}
        />
      ))}
    </>
  );
}

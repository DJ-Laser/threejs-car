import { RigidBody, RigidBodyProps } from "@react-three/rapier";
import "./models/TrapezoidGeometry";

export function Ramp(props: RigidBodyProps) {
  return (
    <RigidBody type="fixed" colliders="hull" {...props}>
      <mesh castShadow receiveShadow>
        <trapezoidGeometry args={[28.5, 8.3, 3.6, 20]} />
        <meshStandardMaterial />
      </mesh>
    </RigidBody>
  );
}

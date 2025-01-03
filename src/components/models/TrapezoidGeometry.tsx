import { BufferGeometryNode, extend } from "@react-three/fiber";
import { ExtrudeGeometry, Shape } from "three";

export type TrapezoidGeometryProps = BufferGeometryNode<
  TrapezoidGeometry,
  typeof TrapezoidGeometry
>;

class TrapezoidGeometry extends ExtrudeGeometry {
  constructor(
    bottomWidth: number,
    topWidth: number,
    height: number,
    depth: number,
  ) {
    const shape = new Shape();
    shape.lineTo(bottomWidth / 2, 0);
    shape.lineTo(topWidth / 2, height);
    shape.lineTo(-topWidth / 2, height);
    shape.lineTo(-bottomWidth / 2, 0);
    shape.closePath();

    super(shape, {
      depth,
      bevelEnabled: false,
    });

    this.translate(0, 0, -depth / 2);
  }
}

extend({ TrapezoidGeometry });

declare module "@react-three/fiber" {
  interface ThreeElements {
    trapezoidGeometry: BufferGeometryNode<
      TrapezoidGeometry,
      typeof TrapezoidGeometry
    >;
  }
}

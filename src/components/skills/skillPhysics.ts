
export type SkillPhysicsBody = {
  id: string;
  width: number;
  height: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  angle: number;
  spin: number;
  sleeping: boolean;
  dragging: boolean;
  dragPointerId: number | null;
  dragOffsetX: number;
  dragOffsetY: number;
  samples: PhysicsSample[];
  touching: boolean;
};

export type PhysicsSample = {
  x: number;
  y: number;
  time: number;
};

export type Collision = {
  normalX: number;
  normalY: number;
  penetration: number;
};

export const PHYSICS = {
  gravity: 1850,
  restitution: 0.18,
  airDrag: 0.994,
  floorFriction: 0.78,
  wallRestitution: 0.32,
  maxReleaseSpeed: 1350,
  sleepSpeed: 14,
  maxSpin: 0.9,
  solverIterations: 4,
  positionCorrection: 0.9,
  positionSlop: 0.01,
};

type Vector = {
  x: number;
  y: number;
};

const dot = (a: Vector, b: Vector) =>
  a.x * b.x + a.y * b.y;

const length = (value: Vector) =>
  Math.hypot(value.x, value.y);

const normalize = (value: Vector): Vector => {
  const magnitude = length(value);

  if (magnitude < 0.000001) {
    return { x: 1, y: 0 };
  }

  return {
    x: value.x / magnitude,
    y: value.y / magnitude,
  };
};

const getAxes = (body: SkillPhysicsBody) => {
  const cos = Math.cos(body.angle);
  const sin = Math.sin(body.angle);

  return [
    { x: cos, y: sin },
    { x: -sin, y: cos },
  ] as const;
};

const getCenter = (body: SkillPhysicsBody): Vector => ({
  x: body.x + body.width / 2,
  y: body.y + body.height / 2,
});

const getProjectionRadius = (
  body: SkillPhysicsBody,
  axis: Vector
) => {
  const [axisX, axisY] = getAxes(body);

  return (
    (body.width / 2) *
      Math.abs(dot(axisX, axis)) +
    (body.height / 2) *
      Math.abs(dot(axisY, axis))
  );
};

export function detectCollision(
  a: SkillPhysicsBody,
  b: SkillPhysicsBody
): Collision | null {
  const centerA = getCenter(a);
  const centerB = getCenter(b);

  const direction = {
    x: centerB.x - centerA.x,
    y: centerB.y - centerA.y,
  };

  const axes = [
    ...getAxes(a),
    ...getAxes(b),
  ];

  let smallestPenetration = Number.POSITIVE_INFINITY;
  let smallestAxis = axes[0];

  for (const axis of axes) {
    const normal = normalize(axis);
    const distance = Math.abs(
      dot(direction, normal)
    );

    const overlap =
      getProjectionRadius(a, normal) +
      getProjectionRadius(b, normal) -
      distance;

    if (overlap <= 0) {
      return null;
    }

    if (overlap < smallestPenetration) {
      smallestPenetration = overlap;
      smallestAxis = normal;
    }
  }

  const normal = normalize(smallestAxis);

  if (dot(direction, normal) < 0) {
    return {
      normalX: -normal.x,
      normalY: -normal.y,
      penetration: smallestPenetration,
    };
  }

  return {
    normalX: normal.x,
    normalY: normal.y,
    penetration: smallestPenetration,
  };
}

export function resolveCollision(
  a: SkillPhysicsBody,
  b: SkillPhysicsBody,
  collision: Collision
) {
  const inverseMass = 1;
  const totalInverseMass =
    inverseMass + inverseMass;

  const correction =
    Math.max(
      0,
      collision.penetration -
        PHYSICS.positionSlop
    ) *
    PHYSICS.positionCorrection /
    totalInverseMass;

  a.x -=
    collision.normalX *
    correction *
    inverseMass;

  a.y -=
    collision.normalY *
    correction *
    inverseMass;

  b.x +=
    collision.normalX *
    correction *
    inverseMass;

  b.y +=
    collision.normalY *
    correction *
    inverseMass;

  a.touching = true;
  b.touching = true;

  if (a.dragging || b.dragging) {
    if (!a.dragging) {
      a.sleeping = false;
    }

    if (!b.dragging) {
      b.sleeping = false;
    }

    return;
  }

  const relativeVelocity = {
    x: b.vx - a.vx,
    y: b.vy - a.vy,
  };

  const velocityAlongNormal =
    relativeVelocity.x *
      collision.normalX +
    relativeVelocity.y *
      collision.normalY;

  if (velocityAlongNormal >= 0) {
    return;
  }

  const impulse =
    (-(1 + PHYSICS.restitution) *
      velocityAlongNormal) /
    totalInverseMass;

  const impulseX =
    impulse * collision.normalX;

  const impulseY =
    impulse * collision.normalY;

  a.vx -= impulseX * inverseMass;
  a.vy -= impulseY * inverseMass;

  b.vx += impulseX * inverseMass;
  b.vy += impulseY * inverseMass;

  const tangent = normalize({
    x: -collision.normalY,
    y: collision.normalX,
  });

  const tangentVelocity =
    relativeVelocity.x *
      tangent.x +
    relativeVelocity.y *
      tangent.y;

  const frictionImpulse = clamp(
    -tangentVelocity / totalInverseMass,
    -Math.abs(impulse) * 0.24,
    Math.abs(impulse) * 0.24
  );

  a.vx -=
    frictionImpulse * tangent.x;
  a.vy -=
    frictionImpulse * tangent.y;

  b.vx +=
    frictionImpulse * tangent.x;
  b.vy +=
    frictionImpulse * tangent.y;

  a.sleeping = false;
  b.sleeping = false;
}

export function applyWorldBounds(
  body: SkillPhysicsBody,
  trayWidth: number,
  trayHeight: number
) {
  const maxX = Math.max(
    0,
    trayWidth - body.width
  );

  const floorY = Math.max(
    0,
    trayHeight - body.height
  );

  if (body.x < 0) {
    body.x = 0;
    body.vx =
      Math.abs(body.vx) *
      PHYSICS.wallRestitution;
  } else if (body.x > maxX) {
    body.x = maxX;
    body.vx =
      -Math.abs(body.vx) *
      PHYSICS.wallRestitution;
  }

  if (body.y < 0) {
    body.y = 0;
    body.vy =
      Math.abs(body.vy) *
      PHYSICS.wallRestitution;
  }

  if (body.y >= floorY) {
    body.y = floorY;
    body.touching = true;

    if (Math.abs(body.vy) > 36) {
      body.vy =
        -Math.abs(body.vy) *
        PHYSICS.restitution;

      body.vx *=
        PHYSICS.floorFriction;

      body.spin = clamp(
        body.spin +
          body.vx * 0.00024,
        -PHYSICS.maxSpin,
        PHYSICS.maxSpin
      );
    } else {
      body.vy = 0;
      body.vx *= 0.64;
      body.spin *= 0.52;
    }
  }
}

export function integrateBody(
  body: SkillPhysicsBody,
  dt: number
) {
  if (
    body.dragging ||
    body.sleeping
  ) {
    return;
  }

  body.vy +=
    PHYSICS.gravity * dt;

  body.vx *= Math.pow(
    PHYSICS.airDrag,
    dt * 60
  );

  body.x +=
    body.vx * dt;

  body.y +=
    body.vy * dt;

  body.angle +=
    body.spin * dt;
}

export function updateSleeping(
  body: SkillPhysicsBody
) {
  if (body.dragging) {
    return;
  }

  const speed = Math.hypot(
    body.vx,
    body.vy
  );

  if (
    body.touching &&
    speed < PHYSICS.sleepSpeed &&
    Math.abs(body.spin) < 0.03
  ) {
    body.vx = 0;
    body.vy = 0;
    body.spin = 0;
    body.sleeping = true;
  }
}

function clamp(
  value: number,
  min: number,
  max: number
) {
  return Math.max(
    min,
    Math.min(max, value)
  );
}

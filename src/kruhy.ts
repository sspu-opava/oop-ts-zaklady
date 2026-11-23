import p5 from 'p5';
import './style.css';

class Kruh {
  private dx: number;
  private dy: number;

  constructor(
    private x: number,
    private y: number,
    private readonly prumer: number,
    private readonly barva: [number, number, number] = [34, 211, 238],
    speed: [number, number] = [0, 0],
  ) {
    this.dx = speed[0];
    this.dy = speed[1];
  }

  setSpeedToward(
    targetX: number,
    targetY: number,
    canvasWidth: number,
    canvasHeight: number,
  ): void {
    const vectorX = targetX - this.x;
    const vectorY = targetY - this.y;
    const distance = Math.hypot(vectorX, vectorY);

    if (distance === 0) {
      this.dx = 0;
      this.dy = 0;
      return;
    }

    // One speed unit corresponds to one tenth of the canvas in that direction.
    const distanceInCanvasUnits = Math.hypot(
      (vectorX * 10) / canvasWidth,
      (vectorY * 10) / canvasHeight,
    );
    const scale = distanceInCanvasUnits / distance;
    this.dx = vectorX * scale;
    this.dy = vectorY * scale;
  }

  move(p: p5): void {
    const polomer = this.prumer / 2;
    [this.x, this.dx] = this.moveAxis(
      this.x,
      this.dx,
      polomer,
      p.width - polomer,
    );
    [this.y, this.dy] = this.moveAxis(
      this.y,
      this.dy,
      polomer,
      p.height - polomer,
    );
  }

  draw(p: p5): void {
    p.fill(...this.barva);
    p.circle(this.x, this.y, this.prumer);
  }

  private moveAxis(
    position: number,
    speed: number,
    minimum: number,
    maximum: number,
  ): [number, number] {
    if (maximum <= minimum) {
      return [(minimum + maximum) / 2, 0];
    }

    let nextPosition = position + speed;

    // Reflect any overshoot so a fast circle cannot get stuck past a wall.
    while (
      nextPosition < minimum ||
      nextPosition > maximum ||
      (nextPosition === minimum && speed < 0) ||
      (nextPosition === maximum && speed > 0)
    ) {
      if (nextPosition < minimum || (nextPosition === minimum && speed < 0)) {
        nextPosition = 2 * minimum - nextPosition;
        speed = Math.abs(speed);
      } else {
        nextPosition = 2 * maximum - nextPosition;
        speed = -Math.abs(speed);
      }
    }

    return [nextPosition, speed];
  }
}

const host = document.querySelector<HTMLDivElement>('#canvas-host');

if (!host) {
  throw new Error('Na stránce chybí element #canvas-host.');
}

const skica = (p: p5): void => {
  const kruh1 = new Kruh(300, 200, 110, [34, 211, 238], [5, 3]);
  const kruh2 = new Kruh(600, 200, 50, [239, 68, 68], [-1, 2]);
  const kruhy: Kruh[] = [];

  p.setup = () => {
    p.createCanvas(800, 600);
    p.noStroke();
    for (let i: number = 0; i < 10; i++) {
      let novyKruh = new Kruh(p.random(p.width), p.random(p.height), p.random(20, 50), [p.random(255), p.random(255), p.random(255)], [p.random(-3, 3), p.random(-3, 3)]);
      kruhy.push(novyKruh);
    }
  };

  p.draw = () => {
    p.background(15, 23, 42);
    kruh1.move(p);
    kruh2.move(p);
    kruh1.draw(p);
    kruh2.draw(p);
    kruhy.forEach(k => {
      k.move(p);
      k.draw(p);
    })
  };

  p.mouseMoved = () => {
    kruh1.setSpeedToward(p.mouseX, p.mouseY, p.width, p.height);
    kruh2.setSpeedToward(p.mouseX, p.mouseY, p.width, p.height);
    kruhy.forEach(k => {
      k.setSpeedToward(p.mouseX, p.mouseY, p.width, p.height);
    })
  };
};

new p5(skica, host);

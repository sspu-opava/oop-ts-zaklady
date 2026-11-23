import p5 from 'p5';

class Bublina {
  public x: number;
  public y: number;
  public prumer: number;
  public barva: string;
  private vx: number;
  private vy: number;
  // Zkrácený zápis v konstruktoru vytvoří vlastnosti x, y, prumer a barva.
  
  constructor(x: number, y: number, prumer: number, barva: string) {
    this.x = x;
    this.y = y;
    this.prumer = prumer;
    this.barva = barva;
    this.vx = 1;
    this.vy = 0;
  }

  pohyb(p: p5): void {
    this.x += this.vx;
    this.y += this.vy;
    const r = this.prumer / 2;
    if (this.x < r || this.x > p.width - r) this.vx *= -1;
    if (this.y < r || this.y > p.height - 55 - r) this.vy *= -1;
    this.x = p.constrain(this.x, r, p.width - r);
    this.y = p.constrain(this.y, r, p.height - 55 - r);
  }

  vykresli(p: p5): void {
    p.noStroke();
    p.fill(this.barva);
    p.circle(this.x, this.y, this.prumer);
    p.fill(255, 255, 255, 85);
    p.circle(this.x - this.prumer / 5, this.y - this.prumer / 5, this.prumer / 5);
  }

  obsahuje(x: number, y: number): boolean {
    return Math.hypot(this.x - x, this.y - y) < this.prumer / 2;
  }

  plocha(): number {
    return Math.PI * (this.prumer / 2) ** 2;
  }
}

export function bubliny(p: p5): void {
  const barvy: string[] = ['#1cc5c9', '#fba24c', '#a38cf5', '#f779a0'];
  let bubliny: Bublina[] = [];

  function vytvorBublinu(x: number, y: number): Bublina {
    return new Bublina(
      x, y, p.random(20, 64), p.random(barvy),
      p.random(-2.6, 2.6), p.random(-2.6, 2.6),
    );
  }

  function obnov(): void {
    bubliny = Array.from({ length: 14 }, () =>
      vytvorBublinu(p.random(55, 705), p.random(55, 350)),
    );
  }

  p.setup = () => {
    p.createCanvas(760, 470);
    obnov();
  };

  p.draw = () => {
    p.background('#102039');
    bubliny.forEach((bublina) => {
      bublina.pohyb(p);
      bublina.vykresli(p);
    });

    // reduce() počítá součet ploch všech bublin.
    const celkovaPlocha = bubliny.reduce((soucet, b) => soucet + b.plocha(), 0);
    p.noStroke();
    p.fill('#f3f7ff');
    p.textSize(15);
    p.text(`Bublin: ${bubliny.length}  |  Součet ploch: ${Math.round(celkovaPlocha)} px²`, 22, 430);
    p.text('Klik = přidej   D = smaž pod myší   S = seřaď   R = obnov', 22, 453);
  };

  p.mousePressed = () => {
    if (p.mouseX >= 0 && p.mouseX <= p.width && p.mouseY >= 0 && p.mouseY < 405) {
      bubliny.push(vytvorBublinu(p.mouseX, p.mouseY));
    }
  };

  p.keyPressed = () => {
    switch (p.key.toLowerCase()) {
      case 'd':
        bubliny = bubliny.filter((b) => !b.obsahuje(p.mouseX, p.mouseY));
        break;
      case 's':
        bubliny.sort((a, b) => a.prumer - b.prumer);
        break;
      case 'r':
        obnov();
        break;
    }
  };
}


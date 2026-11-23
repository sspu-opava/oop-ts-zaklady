
import p5 from "p5";
import './style.css';

// ==========================================
// 1. KONSTANTY A TYPY
// ==========================================

const SIRKA = 600;
const VYSKA = 320;
const PANEL = 60;

type DruhTvaru = "kruh" | "ctverec" | "trojuhelnik";


// ==========================================
// 2. SPOLEČNÁ RODIČOVSKÁ TŘÍDA
// ==========================================

abstract class GrafickyObjekt {

  constructor(
    public x: number,
    public y: number,
    public velikost: number,
    protected barva: string,
    private vx: number,
    private vy: number
  ) {}

  // Tuto metodu dědí všechny tři druhy objektů.
  pohyb(p: p5): void {
    this.x += this.vx;
    this.y += this.vy;

    const r = this.velikost / 2;

    // Odraz od levého a pravého okraje.
    if (this.x < r || this.x > SIRKA - r) {
      this.vx *= -1;
      this.x = p.constrain(this.x, r, SIRKA - r);
    }

    // Odraz od horního a dolního okraje.
    if (this.y < r || this.y > VYSKA - r) {
      this.vy *= -1;
      this.y = p.constrain(this.y, r, VYSKA - r);
    }
  }

  // Společné rozhraní všech potomků.
  abstract vykresli(p: p5): void;
  abstract plocha(): number;
  abstract obsahuje(x: number, y: number): boolean;

  // NOVINKA: Každý potomek bude reagovat jinak.
  abstract klikni(): void;
}


// ==========================================
// 3. TŘÍDA KRUH
// ==========================================

class Kruh extends GrafickyObjekt {

  override vykresli(p: p5): void {
    p.noStroke();
    p.fill(this.barva);
    p.circle(this.x, this.y, this.velikost);
  }

  override plocha(): number {
    const r = this.velikost / 2;
    return Math.PI * r ** 2;
  }

  override obsahuje(x: number, y: number): boolean {
    return Math.hypot(this.x - x, this.y - y)
      <= this.velikost / 2;
  }

  // Po kliknutí kruh změní barvu.
  override klikni(): void {
    if (this.barva === "#f779a0") {
      this.barva = "#1cc5c9";
    } else {
      this.barva = "#f779a0";
    }
  }
}


// ==========================================
// 4. TŘÍDA ČTVEREC
// ==========================================

class Ctverec extends GrafickyObjekt {

  override vykresli(p: p5): void {
    p.noStroke();
    p.fill(this.barva);

    const s = this.velikost;
    p.square(this.x - s / 2, this.y - s / 2, s);
  }

  override plocha(): number {
    return this.velikost ** 2;
  }

  override obsahuje(x: number, y: number): boolean {
    const r = this.velikost / 2;

    return (
      Math.abs(x - this.x) <= r &&
      Math.abs(y - this.y) <= r
    );
  }

  // Po kliknutí se čtverec zvětší.
  override klikni(): void {
    this.velikost = Math.min(
      this.velikost + 8,
      90
    );
  }
}


// ==========================================
// 5. TŘÍDA TROJÚHELNÍK
// ==========================================

class Trojuhelnik extends GrafickyObjekt {

  override vykresli(p: p5): void {
    p.noStroke();
    p.fill(this.barva);

    const s = this.velikost;

    p.triangle(
      this.x,       this.y - s / 2,
      this.x - s/2, this.y + s / 2,
      this.x + s/2, this.y + s / 2
    );
  }

  override plocha(): number {
    return this.velikost ** 2 / 2;
  }

  override obsahuje(x: number, y: number): boolean {
    const s = this.velikost;
    const dx = Math.abs(x - this.x);
    const dy = y - this.y;

    return (
      dy >= -s / 2 &&
      dy <= s / 2 &&
      dx <= (dy + s / 2) / 2
    );
  }

  // Po kliknutí se trojúhelník zmenší.
  override klikni(): void {
    this.velikost = Math.max(
      this.velikost - 8,
      16
    );
  }
}


// ==========================================
// 6. HLAVNÍ APLIKACE
// ==========================================

const sketch = (p: p5) => {

  const barvy = [
    "#1cc5c9",
    "#fba24c",
    "#a38cf5",
    "#f779a0"
  ];

  const druhy: DruhTvaru[] = [
    "kruh",
    "ctverec",
    "trojuhelnik"
  ];

  // Polymorfní pole objektů.
  let objekty: GrafickyObjekt[] = [];

  // Druh nově přidávaného objektu.
  let vybranyDruh: DruhTvaru = "kruh";


  // ----------------------------------------
  // VYTVOŘENÍ KONKRÉTNÍHO OBJEKTU
  // ----------------------------------------

  function vytvorObjekt(
    x: number,
    y: number,
    druh: DruhTvaru
  ): GrafickyObjekt {

    const s = p.random(25, 70);
    const r = s / 2;

    const px = p.constrain(x, r, SIRKA - r);
    const py = p.constrain(y, r, VYSKA - r);

    const barva = p.random(barvy);
    const vx = p.random(-2.5, 2.5);
    const vy = p.random(-2.5, 2.5);

    switch (druh) {
      case "kruh":
        return new Kruh(px, py, s, barva, vx, vy);

      case "ctverec":
        return new Ctverec(px, py, s, barva, vx, vy);

      case "trojuhelnik":
        return new Trojuhelnik(px, py, s, barva, vx, vy);
    }
  }


  // ----------------------------------------
  // OBNOVENÍ SCÉNY
  // ----------------------------------------

  function obnov(): void {
    objekty = Array.from({ length: 15 }, () => {
      const x = p.random(45, SIRKA - 45);
      const y = p.random(45, VYSKA - 45);

      return vytvorObjekt(x, y, p.random(druhy));
    });
  }


  // ----------------------------------------
  // KONTROLA POLOHY MYŠI
  // ----------------------------------------

  function mysVeScene(): boolean {
    return (
      p.mouseX >= 0 &&
      p.mouseX < SIRKA &&
      p.mouseY >= 0 &&
      p.mouseY < VYSKA
    );
  }


  // ----------------------------------------
  // INICIALIZACE
  // ----------------------------------------

  p.setup = () => {
    p.createCanvas(SIRKA, VYSKA + PANEL);
    obnov();
  };


  // ----------------------------------------
  // ANIMAČNÍ SMYČKA
  // ----------------------------------------

  p.draw = () => {
    p.background("#f0f0f0");

    objekty.forEach((objekt) => {
      objekt.pohyb(p);
      objekt.vykresli(p);
    });

    // Polymorfní výpočet součtu ploch.
    const celkovaPlocha = objekty.reduce(
      (soucet, objekt) => soucet + objekt.plocha(),
      0
    );

    // Informační panel.
    p.noStroke();
    p.fill("#dce4ec");
    p.rect(0, VYSKA, SIRKA, PANEL);

    p.fill("#243347");
    p.textSize(13);

    p.text(
      `Objektů: ${objekty.length} | ` +
      `Plocha: ${Math.round(celkovaPlocha)} px² | ` +
      `Nový: ${vybranyDruh}`,
      12, VYSKA + 22
    );

    p.text(
      "Klik: změň/přidej | 1–3: typ | D: smaž | S: seřaď | R: obnov",
      12, VYSKA + 45
    );
  };


  // ----------------------------------------
  // NOVINKA: KLIKNUTÍ NA OBJEKT
  // ----------------------------------------

  p.mousePressed = () => {

    if (!mysVeScene()) return;

    // Procházíme pole od konce.
    // Přednost dostane naposledy vykreslený
    // objekt, tedy ten, který je nahoře.
    for (let i = objekty.length - 1; i >= 0; i--) {

      const objekt = objekty[i];

      if (objekt.obsahuje(p.mouseX, p.mouseY)) {

        // POLYMORFISMUS:
        // Stejné volání, ale různé chování.
        objekt.klikni();

        return;
      }
    }

    // Pokud jsme neklikli na žádný objekt,
    // vytvoříme novou instanci.
    objekty.push(
      vytvorObjekt(
        p.mouseX,
        p.mouseY,
        vybranyDruh
      )
    );
  };


  // ----------------------------------------
  // OVLÁDÁNÍ KLÁVESNICÍ
  // ----------------------------------------

  p.keyPressed = () => {

    switch (p.key.toLowerCase()) {

      case "1":
        vybranyDruh = "kruh";
        break;

      case "2":
        vybranyDruh = "ctverec";
        break;

      case "3":
        vybranyDruh = "trojuhelnik";
        break;

      case "d":
        if (mysVeScene()) {
          objekty = objekty.filter(
            (objekt) =>
              !objekt.obsahuje(p.mouseX, p.mouseY)
          );
        }
        break;

      case "s":
        objekty.sort(
          (a, b) => a.velikost - b.velikost
        );
        break;

      case "r":
        obnov();
        break;
    }
  };
};

// Spuštění grafické aplikace.
new p5(sketch);

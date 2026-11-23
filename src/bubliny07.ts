
import p5 from "p5";
import './style.css';

// ==============================================
// 1. KONSTANTY A DATOVÉ TYPY
// ==============================================

const SIRKA = 600;
const VYSKA_SCENY = 320;
const VYSKA_PANELU = 60;

const POCET_OBJEKTU = 18;

// Union type určuje povolené druhy tvarů.
type DruhTvaru = "kruh" | "ctverec" | "trojuhelnik";


// ==============================================
// 2. ABSTRAKTNÍ RODIČOVSKÁ TŘÍDA
// ==============================================

abstract class GrafickyObjekt {

  // Společné vlastnosti všech grafických objektů.
  constructor(
    public x: number,
    public y: number,
    public velikost: number,
    protected barva: string,
    private vx: number,
    private vy: number
  ) {}

  // Společná implementace pohybu.
  // Potomci tuto metodu automaticky dědí.
  pohyb(p: p5): void {

    // Změna souřadnic podle rychlosti.
    this.x += this.vx;
    this.y += this.vy;

    // Polovina velikosti vymezuje hranice objektu.
    const r = this.velikost / 2;

    // Odraz od levé nebo pravé hranice.
    if (this.x < r || this.x > p.width - r) {
      this.vx *= -1;
      this.x = p.constrain(this.x, r, p.width - r);
    }

    // Odraz od horní nebo dolní hranice scény.
    if (this.y < r || this.y > VYSKA_SCENY - r) {
      this.vy *= -1;
      this.y = p.constrain(this.y, r, VYSKA_SCENY - r);
    }
  }

  // Společná metoda pro změnu barvy.
  zmenBarvu(novaBarva: string): void {
    if (novaBarva.trim() !== "") {
      this.barva = novaBarva;
    }
  }

  // Abstraktní metody nemají tělo.
  // Každý konkrétní potomek je musí implementovat.
  abstract vykresli(p: p5): void;
  abstract plocha(): number;
  abstract obsahuje(x: number, y: number): boolean;
}


// ==============================================
// 3. POTOMEK: KRUH
// ==============================================

class Kruh extends GrafickyObjekt {

  // Přepisujeme metodu vykreslení.
  override vykresli(p: p5): void {
    p.noStroke();
    p.fill(this.barva);

    // U kruhu je velikost jeho průměrem.
    p.circle(this.x, this.y, this.velikost);
  }

  // Vzorec pro plochu kruhu.
  override plocha(): number {
    const r = this.velikost / 2;
    return Math.PI * r ** 2;
  }

  // Bod leží uvnitř kruhu, pokud jeho vzdálenost
  // od středu nepřesahuje poloměr.
  override obsahuje(x: number, y: number): boolean {
    const vzdalenost = Math.hypot(
      this.x - x,
      this.y - y
    );

    return vzdalenost <= this.velikost / 2;
  }
}


// ==============================================
// 4. POTOMEK: ČTVEREC
// ==============================================

class Ctverec extends GrafickyObjekt {

  override vykresli(p: p5): void {
    p.noStroke();
    p.fill(this.barva);

    const s = this.velikost;

    // square() standardně používá levý horní roh.
    // Proto odečteme polovinu strany.
    p.square(
      this.x - s / 2,
      this.y - s / 2,
      s
    );
  }

  // Plocha čtverce: strana na druhou.
  override plocha(): number {
    return this.velikost ** 2;
  }

  // Bod musí ležet uvnitř vodorovných
  // i svislých hranic čtverce.
  override obsahuje(x: number, y: number): boolean {
    const r = this.velikost / 2;

    return (
      Math.abs(x - this.x) <= r &&
      Math.abs(y - this.y) <= r
    );
  }
}


// ==============================================
// 5. POTOMEK: TROJÚHELNÍK
// ==============================================

class Trojuhelnik extends GrafickyObjekt {

  override vykresli(p: p5): void {
    p.noStroke();
    p.fill(this.barva);

    const s = this.velikost;

    // Rovnoramenný trojúhelník:
    // jeden vrchol nahoře, dva dole.
    p.triangle(
      this.x,       this.y - s / 2,
      this.x - s/2, this.y + s / 2,
      this.x + s/2, this.y + s / 2
    );
  }

  // Plocha trojúhelníku:
  // (základna * výška) / 2.
  // Obě hodnoty jsou zde rovny s.
  override plocha(): number {
    return this.velikost ** 2 / 2;
  }

  // Test bodu v našem rovnoramenném trojúhelníku.
  override obsahuje(x: number, y: number): boolean {
    const s = this.velikost;

    // Relativní souřadnice vůči středu.
    const dx = Math.abs(x - this.x);
    const dy = y - this.y;

    // Horní a dolní hranice trojúhelníku
    // a dvě šikmé strany.
    return (
      dy >= -s / 2 &&
      dy <= s / 2 &&
      dx <= (dy + s / 2) / 2
    );
  }
}


// ==============================================
// 6. HLAVNÍ APLIKACE p5.js
// ==============================================

const sketch = (p: p5) => {

  // Paleta barev.
  const barvy: string[] = [
    "#1cc5c9",
    "#fba24c",
    "#a38cf5",
    "#f779a0"
  ];

  // Pole možných druhů tvarů.
  const druhy: DruhTvaru[] = [
    "kruh",
    "ctverec",
    "trojuhelnik"
  ];

  // POLYMORFISMUS:
  // Jedno pole může obsahovat instance všech
  // tříd odvozených od GrafickyObjekt.
  let objekty: GrafickyObjekt[] = [];

  // Druh objektu přidávaného kliknutím.
  let vybranyDruh: DruhTvaru = "kruh";


  // --------------------------------------------
  // VYTVOŘENÍ JEDNOHO OBJEKTU
  // --------------------------------------------

  function vytvorObjekt(
    x: number,
    y: number,
    druh: DruhTvaru
  ): GrafickyObjekt {

    const velikost = p.random(20, 70);
    const r = velikost / 2;

    // Zajistíme, aby celý tvar vznikl ve scéně.
    const px = p.constrain(x, r, SIRKA - r);
    const py = p.constrain(y, r, VYSKA_SCENY - r);

    const barva = p.random(barvy);
    const vx = p.random(-2.5, 2.5);
    const vy = p.random(-2.5, 2.5);

    // Podle druhu vytvoříme konkrétního potomka.
    switch (druh) {

      case "kruh":
        return new Kruh(
          px, py, velikost, barva, vx, vy
        );

      case "ctverec":
        return new Ctverec(
          px, py, velikost, barva, vx, vy
        );

      case "trojuhelnik":
        return new Trojuhelnik(
          px, py, velikost, barva, vx, vy
        );
    }
  }


  // --------------------------------------------
  // OBNOVENÍ SCÉNY
  // --------------------------------------------

  function obnov(): void {
    const okraj = 35;

    // Array.from() opakovaně vytváří nové instance.
    // Jejich konkrétní třída se vybírá náhodně.
    objekty = Array.from(
      { length: POCET_OBJEKTU },
      () => {
        const x = p.random(okraj, SIRKA - okraj);
        const y = p.random(
          okraj,
          VYSKA_SCENY - okraj
        );

        return vytvorObjekt(
          x, y, p.random(druhy)
        );
      }
    );
  }


  // --------------------------------------------
  // JE MYŠ UVNITŘ SCÉNY?
  // --------------------------------------------

  function mysVeScene(): boolean {
    return (
      p.mouseX >= 0 &&
      p.mouseX < SIRKA &&
      p.mouseY >= 0 &&
      p.mouseY < VYSKA_SCENY
    );
  }


  // --------------------------------------------
  // INICIALIZACE
  // --------------------------------------------

  p.setup = () => {
    p.createCanvas(
      SIRKA,
      VYSKA_SCENY + VYSKA_PANELU
    );

    obnov();
  };


  // --------------------------------------------
  // ANIMAČNÍ SMYČKA
  // --------------------------------------------

  p.draw = () => {

    p.background("#f0f0f0");

    // Všechny objekty zpracováváme stejně.
    // Konkrétní typ objektu zde neřešíme!
    objekty.forEach((objekt) => {
      objekt.pohyb(p);
      objekt.vykresli(p);
    });

    // Každý objekt vypočítá svou vlastní plochu.
    const soucetPloch = objekty.reduce(
      (soucet, objekt) => soucet + objekt.plocha(),
      0
    );

    // Spodní informační panel.
    p.noStroke();
    p.fill("#dce4ec");
    p.rect(0, VYSKA_SCENY, SIRKA, VYSKA_PANELU);

    p.fill("#243347");
    p.textSize(13);

    p.text(
      `Objektů: ${objekty.length} | ` +
      `Plocha: ${Math.round(soucetPloch)} px² | ` +
      `Nový: ${vybranyDruh}`,
      12, VYSKA_SCENY + 22
    );

    p.text(
      "1/2/3 = druh | Klik = přidat | D = smazat | " +
      "S = seřadit | R = obnovit",
      12, VYSKA_SCENY + 45
    );
  };


  // --------------------------------------------
  // KLIKNUTÍ MYŠÍ
  // --------------------------------------------

  p.mousePressed = () => {

    if (!mysVeScene()) return;

    // push() přidá konkrétní instanci potomka.
    objekty.push(
      vytvorObjekt(
        p.mouseX,
        p.mouseY,
        vybranyDruh
      )
    );
  };


  // --------------------------------------------
  // OVLÁDÁNÍ KLÁVESNICÍ
  // --------------------------------------------

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
        // Každý tvar má vlastní metodu obsahuje().
        if (mysVeScene()) {
          objekty = objekty.filter(
            (objekt) =>
              !objekt.obsahuje(p.mouseX, p.mouseY)
          );
        }
        break;

      case "s":
        // Seřazení podle společné vlastnosti.
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


// ==============================================
// SPUŠTĚNÍ APLIKACE
// ==============================================

new p5(sketch);

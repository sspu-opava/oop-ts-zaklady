
import p5 from "p5";
import './style.css';

// --------------------------------------------------
// TŘÍDA BUBLINA
// --------------------------------------------------

class Bublina {

  // Konstruktor vytvoří vlastnosti objektu.
  // Souřadnice a průměr jsou veřejné.
  // Barva a rychlosti jsou soukromé.
  constructor(
    public x: number,
    public y: number,
    public prumer: number,
    private barva: string,
    private vx: number,
    private vy: number
  ) {}

  // NOVÁ METODA: Pohyb bubliny
  pohyb(p: p5): void {

    // Změníme souřadnice podle rychlosti.
    this.x += this.vx;
    this.y += this.vy;

    // Poloměr potřebujeme pro kontrolu okrajů.
    const r = this.prumer / 2;

    // Odraz od levého nebo pravého okraje.
    if (this.x < r || this.x > p.width - r) {

      // Obrátíme vodorovnou rychlost.
      this.vx *= -1;

      // Zajistíme, aby bublina zůstala na plátně.
      this.x = p.constrain(this.x, r, p.width - r);
    }

    // Odraz od horního nebo dolního okraje.
    if (this.y < r || this.y > p.height - r) {

      // Obrátíme svislou rychlost.
      this.vy *= -1;

      // Omezíme svislou souřadnici.
      this.y = p.constrain(this.y, r, p.height - r);
    }
  }

  // Vykreslení bubliny na aktuální pozici.
  vykresli(p: p5): void {
    p.noStroke();
    p.fill(this.barva);
    p.circle(this.x, this.y, this.prumer);
  }

  // Výpočet plochy kruhu.
  plocha(): number {
    const r = this.prumer / 2;
    return Math.PI * r ** 2;
  }

  // Zjištění, zda bod leží uvnitř bubliny.
  obsahuje(x: number, y: number): boolean {
    const vzdalenost = Math.hypot(
      this.x - x,
      this.y - y
    );

    return vzdalenost < this.prumer / 2;
  }

  // Kontrolovaná změna barvy.
  zmenBarvu(novaBarva: string): void {
    if (novaBarva.trim() !== "") {
      this.barva = novaBarva;
    }
  }
}

// --------------------------------------------------
// HLAVNÍ APLIKACE p5.js
// --------------------------------------------------

const sketch = (p: p5) => {

  // Paleta barev.
  const barvy: string[] = [
    "#1cc5c9",
    "#fba24c",
    "#a38cf5",
    "#f779a0"
  ];

  // Pole všech instancí třídy Bublina.
  let bubliny: Bublina[] = [];

  // Počet vytvářených objektů.
  const pocetBublin = 20;

  // Funkce vytvoří jednu náhodnou bublinu.
  function vytvorBublinu(): Bublina {

    // Nejprve zvolíme náhodný průměr.
    const prumer = p.random(20, 70);
    const r = prumer / 2;

    // Souřadnice volíme tak, aby bublina
    // vznikla celá uvnitř kreslicí plochy.
    const x = p.random(r, p.width - r);
    const y = p.random(r, p.height - r);

    // Náhodná barva z připravené palety.
    const barva = p.random(barvy);

    // Náhodné rychlosti v obou směrech.
    const vx = p.random(-2.5, 2.5);
    const vy = p.random(-2.5, 2.5);

    // Vrátíme novou instanci třídy.
    return new Bublina(
      x, y, prumer, barva, vx, vy
    );
  }

  // Inicializace grafického prostředí.
  p.setup = () => {

    // Vytvoření kreslicí plochy.
    p.createCanvas(600, 320);

    // Automatické vytvoření 20 instancí.
    bubliny = Array.from(
      { length: pocetBublin },
      () => vytvorBublinu()
    );

    // noLoop() již nepoužíváme.
    // Funkce draw() se bude opakovat.
  };

  // Hlavní animační smyčka.
  p.draw = () => {

    // Smazání předchozího snímku.
    p.background(240);

    // Aktualizace a vykreslení všech objektů.
    bubliny.forEach((bublina) => {

      // Nejprve vypočítáme novou pozici.
      bublina.pohyb(p);

      // Poté vykreslíme objekt.
      bublina.vykresli(p);
    });
  };
};

// Spuštění aplikace.
new p5(sketch);

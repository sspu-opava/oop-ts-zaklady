
import p5 from "p5";
import './style.css';

// Třída představuje předpis pro vytváření bublin.
class Bublina {

  // Vlastnosti každé instance.
  x: number;
  y: number;
  prumer: number;
  barva: string;

  // Konstruktor nastaví počáteční hodnoty vlastností.
  constructor(x: number, y: number, prumer: number, barva: string) {
    this.x = x;
    this.y = y;
    this.prumer = prumer;
    this.barva = barva;
  }

  // Metoda vykreslí konkrétní bublinu.
  vykresli(p: p5): void {
    p.noStroke();
    p.fill(this.barva);
    p.circle(this.x, this.y, this.prumer);
  }
}

// Hlavní část aplikace p5.js.
const sketch = (p: p5) => {

  // Vytvoříme prázdné pole pro instance třídy Bublina.
  const bubliny: Bublina[] = [];

  // Do pole postupně přidáme tři nové objekty.
  bubliny.push(new Bublina(120, 150, 60, "red"));
  bubliny.push(new Bublina(300, 100, 90, "blue"));
  bubliny.push(new Bublina(480, 200, 45, "green"));
  bubliny.push(new Bublina(80, 200, 45, "pink"));

  // Inicializace kreslicí plochy.
  p.setup = () => {
    p.createCanvas(600, 320);
    p.noLoop(); // Statická grafika.
  };

  // Vykreslení celé scény.
  p.draw = () => {
    p.background(240);

    // Projdeme všechny objekty uložené v poli.
    bubliny.forEach((bublina) => {
      bublina.vykresli(p);
    });
  };
};

// Spuštění aplikace.
new p5(sketch);

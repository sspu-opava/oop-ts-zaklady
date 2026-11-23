import p5 from "p5";
import './style.css';

// Třída představuje předpis pro vytváření bublin.
class Bublina {

  // Vlastnosti, které bude mít každá bublina.
  x: number;
  y: number;
  prumer: number;
  barva: string;

  // Konstruktor nastaví počáteční vlastnosti objektu.
  constructor(x: number, y: number, prumer: number, barva: string) {
    this.x = x;
    this.y = y;
    this.prumer = prumer;
    this.barva = barva;
  }

  // Metoda vykreslí bublinu na plátno p5.js.
  vykresli(p: p5): void {
    p.noStroke();
    p.fill(this.barva);
    p.circle(this.x, this.y, this.prumer);
  }
}

// Hlavní část programu využívající knihovnu p5.js.
const sketch = (p: p5) => {

  // Vytvoření tří samostatných instancí třídy Bublina.
  const b1 = new Bublina(120, 150, 60, "red");
  const b2 = new Bublina(300, 100, 90, "blue");
  const b3 = new Bublina(480, 200, 45, "green");

  // Příprava grafického prostředí.
  p.setup = () => {
    p.createCanvas(600, 320);
    p.noLoop();  // Statická grafika, bez opakování draw().
  };

  // Vykreslení všech tří bublin.
  p.draw = () => {
    p.background(240);

    b1.vykresli(p);
    b2.vykresli(p);
    b3.vykresli(p);
  };
};

// Spuštění grafické aplikace.
new p5(sketch);
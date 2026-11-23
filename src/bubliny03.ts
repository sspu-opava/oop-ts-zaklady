
import p5 from "p5";
import './style.css';

// TŘÍDA BUBLINA
// Každá bublina má vlastní polohu, průměr a barvu.
class Bublina {
  x: number;
  y: number;
  prumer: number;
  barva: string;

  // Konstruktor inicializuje vlastnosti nové instance.
  constructor(x: number, y: number, prumer: number, barva: string) {
    this.x = x;
    this.y = y;
    this.prumer = prumer;
    this.barva = barva;
  }

  // Metoda vykreslí aktuální objekt.
  vykresli(p: p5): void {
    p.noStroke();
    p.fill(this.barva);
    p.circle(this.x, this.y, this.prumer);
  }
}

// HLAVNÍ APLIKACE
const sketch = (p: p5) => {

  // Paleta barev, ze které budeme náhodně vybírat.
  const barvy: string[] = [
    "#1cc5c9",
    "#fba24c",
    "#a38cf5",
    "#f779a0"
  ];

  // Pole pro uložení vytvořených instancí.
  let bubliny: Bublina[] = [];

  // Počet bublin, které chceme vygenerovat.
  const pocetBublin = 20;

  // Pomocná funkce vytvoří jednu náhodnou bublinu.
  function vytvorBublinu(): Bublina {
    const x = p.random(40, 560);
    const y = p.random(40, 280);
    const prumer = p.random(20, 70);
    const barva = p.random(barvy);

    return new Bublina(x, y, prumer, barva);
  }

  // Inicializace grafického prostředí.
  p.setup = () => {
    p.createCanvas(600, 320);

    // Vytvoříme pole obsahující 20 nových bublin.
    bubliny = Array.from(
      { length: pocetBublin },
      () => vytvorBublinu()
    );

    // Vykreslení proběhne pouze jednou.
    p.noLoop();
  };

  // Vykreslení celé scény.
  p.draw = () => {
    p.background(240);

    // Pro každou bublinu zavoláme její metodu.
    bubliny.forEach((bublina) => {
      bublina.vykresli(p);
    });
  };
};

// Spuštění aplikace.
new p5(sketch);

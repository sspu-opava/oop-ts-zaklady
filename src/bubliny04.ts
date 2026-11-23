
import p5 from "p5";
import './style.css';

// TŘÍDA BUBLINA
// Každá bublina má vlastní vlastnosti a metody.
class Bublina {

  // Zkrácený konstruktor TypeScriptu.
  // Modifikátory public a private automaticky
  // vytvoří příslušné vlastnosti objektu.
  constructor(
    public x: number,
    public y: number,
    public prumer: number,
    private barva: string
  ) {}

  // Vykreslí bublinu podle jejích vlastností.
  vykresli(p: p5): void {
    p.noStroke();
    p.fill(this.barva);
    p.circle(this.x, this.y, this.prumer);
  }

  // Vypočítá plochu kruhu.
  plocha(): number {
    const r = this.prumer / 2;
    return Math.PI * r ** 2;
  }

  // Zjistí, zda zadaný bod leží uvnitř kruhu.
  obsahuje(x: number, y: number): boolean {
    const vzdalenost = Math.hypot(
      this.x - x,
      this.y - y
    );

    return vzdalenost < this.prumer / 2;
  }

  // Bezpečný způsob změny soukromé vlastnosti.
  zmenBarvu(novaBarva: string): void {
    if (novaBarva.trim() !== "") {
      this.barva = novaBarva;
    }
  }
}

// HLAVNÍ APLIKACE
const sketch = (p: p5) => {

  // Paleta barev.
  const barvy: string[] = [
    "#1cc5c9",
    "#fba24c",
    "#a38cf5",
    "#f779a0"
  ];

  // Pole instancí.
  let bubliny: Bublina[] = [];

  // Bod, který budeme testovat.
  const bodX = 300;
  const bodY = 160;

  // Vytvoření náhodné instance.
  function vytvorBublinu(): Bublina {
    return new Bublina(
      p.random(40, 560),
      p.random(40, 280),
      p.random(20, 70),
      p.random(barvy)
    );
  }

  p.setup = () => {
    p.createCanvas(600, 320);

    // Vygenerujeme 19 náhodných bublin.
    bubliny = Array.from(
      { length: 19 },
      () => vytvorBublinu()
    );

    // Přidáme jednu bublinu na známou pozici,
    // abychom mohli spolehlivě testovat obsahuje().
    const ukazkova = new Bublina(
      bodX, bodY, 70, "#a38cf5"
    );

    bubliny.push(ukazkova);

    // Ukázka metody, která vrací číslo.
    console.log("Plocha:", ukazkova.plocha());

    // Ukázka metody, která vrací boolean.
    console.log(
      "Bod uvnitř:",
      ukazkova.obsahuje(bodX, bodY)
    );

    // Vyhledáme bubliny obsahující zadaný bod
    // a změníme jejich barvu.
    bubliny.forEach((bublina) => {
      if (bublina.obsahuje(bodX, bodY)) {
        bublina.zmenBarvu("#ffb000");
      }
    });

    // Statická scéna.
    p.noLoop();
  };

  p.draw = () => {
    p.background(240);

    // Vykreslení všech objektů.
    bubliny.forEach((bublina) => {
      bublina.vykresli(p);
    });

    // Označení testovaného bodu.
    p.stroke(20);
    p.strokeWeight(2);
    p.line(bodX - 6, bodY, bodX + 6, bodY);
    p.line(bodX, bodY - 6, bodX, bodY + 6);

    p.noStroke();
    p.fill(20);
    p.textSize(14);
    p.text("Oranžové bubliny obsahují označený bod.", 15, 305);
  };
};

// Spuštění aplikace p5.js.
new p5(sketch);

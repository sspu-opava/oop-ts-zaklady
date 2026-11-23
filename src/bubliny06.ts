
import p5 from "p5";
import './style.css';

// --------------------------------------------------
// KONSTANTY APLIKACE
// --------------------------------------------------

// Rozměry kreslicí plochy.
const SIRKA = 600;
const VYSKA_SCENY = 320;
const VYSKA_PANELU = 55;

// Výchozí počet bublin.
const POCET_BUBLIN = 20;

// Rozsah velikostí.
const MIN_PRUMER = 20;
const MAX_PRUMER = 70;


// --------------------------------------------------
// TŘÍDA BUBLINA
// --------------------------------------------------

class Bublina {

  // Konstruktor inicializuje vlastnosti instance.
  // Každá bublina má vlastní polohu, velikost,
  // barvu a dvě složky rychlosti.
  constructor(
    public x: number,
    public y: number,
    public prumer: number,
    private barva: string,
    private vx: number,
    private vy: number
  ) {}

  // Aktualizace polohy a odrazy od okrajů.
  pohyb(p: p5): void {

    // Posun podle rychlosti.
    this.x += this.vx;
    this.y += this.vy;

    const r = this.prumer / 2;

    // Odraz od levého a pravého okraje.
    if (this.x < r || this.x > p.width - r) {
      this.vx *= -1;
      this.x = p.constrain(this.x, r, p.width - r);
    }

    // Odraz od horní a dolní hranice scény.
    // Spodní informační panel není součástí
    // prostoru, v němž se bubliny pohybují.
    if (this.y < r || this.y > VYSKA_SCENY - r) {
      this.vy *= -1;
      this.y = p.constrain(this.y, r, VYSKA_SCENY - r);
    }
  }

  // Vykreslení bubliny.
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

  // Určí, zda zadaný bod leží uvnitř bubliny.
  obsahuje(x: number, y: number): boolean {
    const vzdalenost = Math.hypot(
      this.x - x,
      this.y - y
    );

    return vzdalenost < this.prumer / 2;
  }

  // Kontrolovaná změna soukromé vlastnosti.
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

  // Barvy používané při vytváření bublin.
  const barvy: string[] = [
    "#1cc5c9",
    "#fba24c",
    "#a38cf5",
    "#f779a0"
  ];

  // Pole obsahující instance třídy Bublina.
  // Používáme let, protože budeme celé pole
  // nahrazovat novým polem při filtrování a obnově.
  let bubliny: Bublina[] = [];


  // ------------------------------------------------
  // VYTVOŘENÍ JEDNÉ BUBLINY
  // ------------------------------------------------

  function vytvorBublinu(x: number, y: number): Bublina {

    // Náhodný průměr a poloměr.
    const prumer = p.random(MIN_PRUMER, MAX_PRUMER);
    const r = prumer / 2;

    // Zajistíme, že nová bublina vznikne celá
    // uvnitř povolené části canvasu.
    const bezpecneX = p.constrain(x, r, p.width - r);
    const bezpecneY = p.constrain(y, r, VYSKA_SCENY - r);

    // Vrátíme novou instanci.
    return new Bublina(
      bezpecneX,
      bezpecneY,
      prumer,
      p.random(barvy),
      p.random(-2.5, 2.5),
      p.random(-2.5, 2.5)
    );
  }


  // ------------------------------------------------
  // OBNOVENÍ CELÉHO POLE OBJEKTŮ
  // ------------------------------------------------

  function obnov(): void {

    // Maximální poloměr zajistí dostatečný odstup
    // nových bublin od hranic scény.
    const okraj = MAX_PRUMER / 2;

    // Vytvoříme nové pole s 20 instancemi.
    bubliny = Array.from(
      { length: POCET_BUBLIN },
      () => {
        const x = p.random(okraj, p.width - okraj);
        const y = p.random(okraj, VYSKA_SCENY - okraj);

        return vytvorBublinu(x, y);
      }
    );
  }


  // ------------------------------------------------
  // KONTROLA POLOHY MYŠI
  // ------------------------------------------------

  function mysVeScene(): boolean {

    // Vrátíme true pouze tehdy, pokud se myš
    // nachází uvnitř prostoru pro bubliny.
    return (
      p.mouseX >= 0 &&
      p.mouseX < p.width &&
      p.mouseY >= 0 &&
      p.mouseY < VYSKA_SCENY
    );
  }


  // ------------------------------------------------
  // INICIALIZACE
  // ------------------------------------------------

  p.setup = () => {

    // Horní scéna a spodní informační panel.
    p.createCanvas(SIRKA, VYSKA_SCENY + VYSKA_PANELU);

    // Vytvoření počátečních bublin.
    obnov();
  };


  // ------------------------------------------------
  // ANIMAČNÍ SMYČKA
  // ------------------------------------------------

  p.draw = () => {

    // Vymazání předchozího snímku.
    p.background(240);

    // Každé bublině aktualizujeme polohu
    // a následně ji vykreslíme.
    bubliny.forEach((bublina) => {
      bublina.pohyb(p);
      bublina.vykresli(p);
    });

    // NOVINKA: reduce()
    // Vypočítáme součet ploch všech bublin.
    const celkovaPlocha = bubliny.reduce(
      (soucet, bublina) => soucet + bublina.plocha(),
      0
    );

    // Vykreslení informačního panelu.
    p.noStroke();
    p.fill("#dce4ec");
    p.rect(0, VYSKA_SCENY, p.width, VYSKA_PANELU);

    // Textové informace.
    p.fill("#243347");
    p.textSize(14);

    p.text(
      `Počet bublin: ${bubliny.length} | ` +
      `Součet ploch: ${Math.round(celkovaPlocha)} px²`,
      12, 341
    );

    p.textSize(13);
    p.text(
      "Klik = přidat | D = smazat | S = seřadit | R = obnovit",
      12, 363
    );
  };


  // ------------------------------------------------
  // KLIKNUTÍ MYŠÍ
  // ------------------------------------------------

  p.mousePressed = () => {

    // Kliknutí mimo pohybovou oblast ignorujeme.
    if (!mysVeScene()) return;

    // NOVINKA: push()
    // Vytvoříme a přidáme novou instanci do pole.
    bubliny.push(
      vytvorBublinu(p.mouseX, p.mouseY)
    );
  };


  // ------------------------------------------------
  // OVLÁDÁNÍ KLÁVESNICÍ
  // ------------------------------------------------

  p.keyPressed = () => {

    // Převedeme písmeno na malé, aby fungovalo
    // například D i d.
    switch (p.key.toLowerCase()) {

      case "d":

        // NOVINKA: filter()
        // Odstraníme všechny bubliny pod myší.
        // Pokud myš není ve scéně, nic nemažeme.
        if (mysVeScene()) {
          bubliny = bubliny.filter(
            (b) => !b.obsahuje(p.mouseX, p.mouseY)
          );
        }
        break;

      case "s":

        // NOVINKA: sort()
        // Seřadíme pole podle průměru vzestupně.
        bubliny.sort(
          (a, b) => a.prumer - b.prumer
        );
        break;

      case "r":

        // Vytvoříme zcela novou sadu bublin.
        obnov();
        break;
    }
  };
};


// --------------------------------------------------
// SPUŠTĚNÍ APLIKACE
// --------------------------------------------------

new p5(sketch);

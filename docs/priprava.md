# Příprava lokálního prostředí pro TypeScript, Vite, p5.js a Tailwind CSS

Tento návod popisuje přípravu počítače pro vývoj malé webové aplikace s objektově orientovaným kódem v TypeScriptu. Vite spouští vývojový server a připravuje produkční sestavení, p5.js vykresluje interaktivní grafiku a Tailwind CSS poskytuje pomocné třídy pro vzhled stránky.

Postup lze použít pro nový projekt od nuly. Pokud chceš spustit přímo tento připravený repozitář, přeskoč na část **Spuštění tohoto projektu**.

## 1. Nainstaluj potřebné programy

### Node.js a npm

Nainstaluj aktuální verzi **Node.js LTS** z [oficiální stránky Node.js](https://nodejs.org/en/download/). Node.js umožní spouštět nástroje pro vývoj a `npm` stáhne knihovny projektu. npm se instaluje společně s Node.js.

Vite vyžaduje Node.js alespoň 20.19+ nebo 22.12+. Aktuální LTS je vhodná volba i pro nové projekty. Po instalaci otevři nový terminál PowerShell a ověř, že jsou příkazy dostupné:

```powershell
node --version
npm --version
```

Pokud se zobrazí čísla verzí, můžeš pokračovat. Jestli PowerShell příkaz nezná, zavři a znovu otevři terminál; případně ověř, že se instalace Node.js dokončila.

### Editor

Pro práci se soubory doporučuji [Visual Studio Code](https://code.visualstudio.com/). Otevři v něm kořenovou složku projektu a používej integrovaný terminál (nabídka **Terminal → New Terminal**). Další editor můžeš použít také.

## 2. Vytvoř nový projekt Vite s TypeScriptem

V terminálu přejdi do složky, ve které chceš projekt vytvořit, a spusť:

```powershell
npm create vite@latest oop-ts-lab -- --template vanilla-ts
cd oop-ts-lab
npm install
```

První příkaz založí základní projekt bez frameworku, například bez Reactu. Šablona `vanilla-ts` už obsahuje TypeScript a Vite. `npm install` stáhne knihovny a vytvoří složku `node_modules` a soubor `package-lock.json`.

## 3. Přidej p5.js a Tailwind CSS

Spusť příkazy v kořenové složce projektu, tedy tam, kde leží `package.json`:

```powershell
npm install p5
npm install tailwindcss @tailwindcss/vite
```

`p5` je knihovna pro kreslení a animaci. Použijeme její **instance mode**, ve kterém má každá skica vlastní objekt p5. Verze p5.js 2 obsahuje TypeScriptové deklarace, proto pro tuto verzi nepřidávej balíček `@types/p5`.

Tailwind CSS 4 se zapojuje do Vite pomocí balíčku `@tailwindcss/vite`. Pro tento základ není nutné vytvářet `tailwind.config.js` ani nastavovat seznam HTML souborů ručně.

## 4. Zapoj Tailwind do Vite

V kořenové složce otevři nebo vytvoř soubor `vite.config.ts` a nastav jej takto:

```ts
import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [tailwindcss()],
});
```

Tím Vite při vývoji i sestavení zpracuje Tailwind CSS.

## 5. Nastav TypeScript v `tsconfig.json`

V kořenové složce projektu uprav `tsconfig.json` na následující minimální konfiguraci:

```json
{
  "compilerOptions": {
    "target": "es2023",
    "useDefineForClassFields": true,    
    "module": "esnext",
    "lib": ["ES2023", "DOM", "DOM.Iterable"],
    "types": ["vite/client"],
    "allowArbitraryExtensions": true,
    "skipLibCheck": true,

    /* Bundler mode */
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "verbatimModuleSyntax": true,
    "moduleDetection": "force",
    "noEmit": true,
    "strict": true,
    /* Linting */
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true
  },
  "include": ["src"]
}
```

Toto nastavení je určené pro aplikaci zpracovávanou Vite:

- `target` a `lib` povolují moderní JavaScript a typy pro prohlížeč.
- `moduleResolution: "Bundler"` odpovídá způsobu, jakým Vite hledá importované moduly.
- `strict` zapíná přísnější kontrolu typů, která pomáhá zachytit chyby při psaní.
- `noEmit` říká TypeScriptu, aby nevytvářel samostatné JavaScriptové soubory. Převod a zabalení kódu zajistí Vite.
- `allowImportingTsExtensions` dovoluje importovat soubory s příponou `.ts`; při běžných importech bez přípony ji můžeš vynechat.
- `include` omezuje kontrolu na zdrojový kód v `src`.

## 6. Nastav příkaz pro kontrolu typů a sestavení

V souboru `package.json` ponech vývojové a náhledové skripty Vite a nastav `build` tak, aby nejprve zkontroloval TypeScript:

```json
"scripts": {
  "dev": "vite",
  "build": "tsc -p tsconfig.json --noEmit && vite build",
  "preview": "vite preview"
}
```

Vite převádí TypeScript při spuštění aplikace, ale samotný vývojový server standardně neprovádí úplnou kontrolu typů. Příkaz `build` proto nejdříve spustí TypeScript a až poté vytvoří produkční verzi aplikace.

## 7. Připrav CSS a HTML

Nahraď obsah `src/style.css` tímto základem:

```css
@import "tailwindcss";

body {
  margin: 0;
  min-width: 320px;
  min-height: 100vh;
}
```

V kořenovém souboru `index.html` ponech odkaz na `src/main.ts`. Jednoduchý obsah stránky může vypadat takto:

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>oop-zaklady</title>
  </head>
  <body class="min-h-screen bg-slate-800 text-slate-100">
    <main class="mx-auto flex min-h-screen max-w-5xl flex-col items-center justify-center gap-6 p-6">
      <h1 class="text-3xl font-bold">TypeScript a p5.js</h1>
      <div id="canvas-host" class="overflow-hidden border border-slate-700"></div>
    </main>
    <script type="module" src="/src/main.ts"></script>
  </body>
</html>
```

Třídy jako `min-h-screen`, `bg-slate-950` nebo `rounded-xl` jsou utility Tailwindu. V tomto projektu je CSS načtené z TypeScriptu v následujícím kroku.

## 8. Vytvoř minimální OOP skicu v `src/main.ts`

Nahraď obsah `src/main.ts` následující ukázkou:

```ts
import p5 from 'p5';
import './style.css';

class Kruh {
  constructor(
    private readonly x: number,
    private readonly y: number,
    private readonly prumer: number,
  ) {}

  vykresli(p: p5): void {
    p.circle(this.x, this.y, this.prumer);
  }
}

const host = document.querySelector<HTMLDivElement>('#canvas-host');

if (!host) {
  throw new Error('Na stránce chybí element #canvas-host.');
}

const skica = (p: p5): void => {
  const kruh = new Kruh(300, 200, 110);

  p.setup = () => {
    p.createCanvas(600, 400);
    p.noStroke();
    p.fill(34, 211, 238);
  };

  p.draw = () => {
    p.background(15, 23, 42);
    kruh.vykresli(p);
  };
};

new p5(skica, host);
```

Třída `Kruh` popisuje stav objektu (souřadnice a průměr) a jeho chování (metodu `vykresli`). `new Kruh(...)` vytvoří instanci. p5 volá `setup` při přípravě plátna a `draw` opakovaně při kreslení snímků animace.

## 9. Spusť vývojový server

V kořenové složce projektu spusť:

```powershell
npm run dev
```

V terminálu se zobrazí místní adresa, obvykle `http://localhost:5173/`. Otevři ji v prohlížeči. Po změně uloženého souboru Vite stránku automaticky obnoví. Server ukončíš klávesovou zkratkou **Ctrl+C** v terminálu.

## 10. Ověř projekt a zobraz produkční sestavení

Zastav vývojový server pomocí **Ctrl+C** a spusť:

```powershell
npm run build
npm run preview
```

První příkaz zkontroluje typy a vytvoří produkční soubory ve složce `dist`. Druhý spustí místní náhled této sestavené verze. Adresu náhledu vypíše terminál. Náhledový server ukonči pomocí **Ctrl+C**.

## Doporučené uspořádání souborů

```text
oop-ts-lab/
├─ index.html
├─ package.json
├─ package-lock.json
├─ tsconfig.json
├─ vite.config.ts
└─ src/
   ├─ main.ts
   ├─ style.css
   └─ examples/
```

Jak aplikace poroste, přesuň jednotlivé třídy do samostatných souborů, například `src/examples/Kruh.ts`. V `main.ts` pak můžeš objekty importovat. Složku `node_modules` nevkládej do verzovacího systému ani do předávaného ZIP souboru; knihovny lze znovu nainstalovat podle `package-lock.json`.

## Spuštění tohoto projektu

Tento repozitář už obsahuje TypeScript, Vite a p5.js. Pokud máš jeho soubory uložené na počítači:

1. Otevři v terminálu složku projektu, ve které leží `package.json`.
2. Nainstaluj přesné závislosti z lock souboru:

   ```powershell
   npm ci
   ```

3. Spusť aplikaci:

   ```powershell
   npm run dev
   ```

4. Otevři adresu zobrazenou v terminálu.

Aktuální repozitář používá p5.js 2.3.4 a Tailwind CSS v něm zatím není zapojený. Pokud chceš Tailwind přidat právě do tohoto repozitáře, proveď v něm kroky **3–7** výše. Ostatní výukové soubory a ukázky není potřeba znovu vytvářet.

## Oficiální návody

- [Stažení Node.js](https://nodejs.org/en/download/)
- [Průvodce Vite a požadavky na Node.js](https://vite.dev/guide/)
- [Instalace Tailwind CSS přes Vite](https://tailwindcss.com/docs/installation/using-vite)
- [p5.js na GitHubu a TypeScriptové deklarace balíčku](https://github.com/processing/p5.js)

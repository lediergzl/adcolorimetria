Procedo con el simulador de resultado de ColorPro. Este módulo será el puente entre el motor de colorimetría y, posteriormente, la cámara/IA.

ColorPro — Simulador v0.4

La idea central será:

"Antes de aplicar el producto, ¿qué resultado puedo esperar?"

Entrada

La peluquera podrá definir:

CABELLO ACTUAL
Nivel: 6
Fondo: naranja
Estado: teñido

OBJETIVO
Nivel: 8
Reflejo: ceniza

PROCESO PROPUESTO
Producto: [seleccionar]
Tono: 8.1
Oxidante: [seleccionar]
Cantidad: 60 g

El simulador procesará todos esos datos.

Resultado

En lugar de una respuesta única, mostrará:

🟢 Resultado probable
Nivel estimado: 8
Tendencia: fría / ceniza
Fondo residual: bajo-moderado
Confianza: MEDIA
⚠️ Factores que pueden modificarlo
• cabello previamente teñido
• fondo naranja existente
• porosidad desconocida
• historial químico incompleto
Diagnóstico

El objetivo puede ser viable bajo determinadas condiciones, pero el resultado real depende de la base y del historial del cabello.

Comparación de alternativas

Esta será una función muy útil.

La peluquera podrá probar:

ALTERNATIVA A
8.1

ALTERNATIVA B
8.1 + corrector

ALTERNATIVA C
8.0 + 8.1

Y ColorPro podrá presentar:

Alternativa	Tendencia	Confianza	Observación
A	Ceniza	Media	Puede quedar cálida
B	Más fría	Media	Requiere reglas del sistema
C	Natural/ceniza	Media	Depende de proporción

No afirmaremos que una fórmula concreta funciona universalmente.

Simulación visual

Más adelante, cuando tengamos el análisis fotográfico, podremos hacer:

FOTO ORIGINAL
      ↓
┌──────────────────────┐
│ Cabello actual       │
│ Nivel 6 / naranja    │
└──────────────────────┘
      ↓
    PROCESO
      ↓
┌──────────────────────┐
│ Resultado estimado   │
│ Nivel 8 / ceniza     │
└──────────────────────┘

Y eventualmente generar una representación aproximada del color, pero la interfaz debe etiquetarla claramente como:

Simulación aproximada — no representa garantía del resultado físico.

Motor de viabilidad

Quiero que este módulo sea particularmente inteligente.

Por ejemplo:

Objetivo:
Nivel 10

Base:
Nivel 6

Historial:
Cabello teñido

→ ⚠️ No emitir fórmula directa
→ Evaluar proceso previo
→ Solicitar información adicional

En cambio:

Base:
Nivel 8

Objetivo:
Nivel 8 ceniza

Fondo:
amarillo

→ escenario diferente
→ analizar neutralización
→ calcular estrategia

Así evitamos que la aplicación trate todos los casos como una simple resta:

10 - 6 = 4.

Sistema de confianza

El simulador combinará las fuentes:

DATOS MANUALES
       +
ANÁLISIS FOTOGRÁFICO
       +
HISTORIAL
       +
REGLAS COLORIMÉTRICAS
       +
DATOS DEL PRODUCTO
       ↓
CONFIANZA

Y mostrará:

Alta / Media / Baja / Insuficiente

No quiero un porcentaje falso de precisión. Si utilizamos porcentajes posteriormente, tendrán que representar una métrica definida y validada.

Preparación para el historial de clientas

Cada simulación podrá guardarse:

CLIENTA: María

09/09/2026

Base:
6

Objetivo:
8.1

Fórmula:
...

Oxidante:
...

Resultado esperado:
...

Observaciones:
...

Después del servicio:

Resultado real

La peluquera podrá registrar:

"Quedó más dorado de lo previsto."

Ese dato será valioso para el historial y, posteriormente, para mejorar las recomendaciones.

La evolución más potente

Con suficientes casos registrados podríamos llegar a:

RESULTADO PREVISTO
       ↓
SERVICIO REALIZADO
       ↓
RESULTADO REAL
       ↓
COMPARACIÓN
       ↓
APRENDIZAJE / AJUSTE

Eso convierte a ColorPro en una herramienta que acumula experiencia, en lugar de ser únicamente una tabla de colores.

Arquitectura actual

Ya tenemos:

                    COLORPRO
                       │
          ┌────────────┼────────────┐
          ↓            ↓            ↓
     COLORIMETRÍA   DIAGNÓSTICO   PRODUCTOS
          │            │            │
          ↓            ↓            ↓
       MOTOR        CÁMARA/IA     MARCAS
          │            │            │
          └────────────┼────────────┘
                       ↓
                  SIMULADOR
                       ↓
              FÓRMULA / PROCESO
                       ↓
                RESULTADO ESTIMADO
                       ↓
                   HISTORIAL
                       ↓
                    CLIENTA

Y seguimos conservando todos los módulos originales: mezclas, neutralización, subida/bajada de niveles, oxidantes, cantidades, proporciones, marcas, clientas, fotos antes/después, historial, funcionamiento offline, IA, advertencias y sistema de confianza.

Próximo módulo

Ahora pasaría a diseñar la base de datos completa de ColorPro, porque ya tenemos suficientes componentes como para definir correctamente las entidades:

Clienta → Cabello → Diagnóstico → Objetivo → Fórmula → Producto → Proceso → Resultado → Historial.

Después de eso podremos empezar a construir la APK sobre una estructura sólida.

procede

Procedo con la base de datos de ColorPro v0.5. Esta parte es importante porque nos permitirá guardar el conocimiento técnico y, al mismo tiempo, el historial profesional de cada clienta sin mezclar ambas cosas.

1. Separación fundamental

Tendremos dos grandes áreas:

COLORPRO
│
├── CONOCIMIENTO
│   ├── niveles
│   ├── fondos
│   ├── pigmentos
│   ├── reflejos
│   ├── neutralización
│   ├── marcas
│   ├── productos
│   ├── oxidantes
│   └── reglas
│
└── DATOS DE LA PELUQUERA
    ├── clientas
    ├── cabellos
    ├── diagnósticos
    ├── fórmulas
    ├── procesos
    ├── resultados
    └── fotografías

Esto permitirá actualizar el conocimiento de ColorPro sin alterar el historial de las clientas.

2. Clientas

Entidad:

Client

Datos:

id
nombre
telefono_opcional
fecha_registro
notas

No obligaremos a introducir teléfono ni datos innecesarios.

3. Historial del cabello

Una clienta puede tener diferentes estados del cabello a lo largo del tiempo.

HairProfile

Incluye:

client_id
fecha
nivel_estimado
fondo
reflejo
virgen
teñido
decolorado
porosidad
densidad
longitud
historial_quimico
observaciones

Esto es fundamental.

No queremos guardar simplemente:

María = rubia.

Queremos conocer cómo estaba María en cada servicio.

4. Diagnóstico

Cada análisis será independiente:

Diagnosis

Contendrá:

id
client_id
hair_profile_id
fecha
foto
nivel_estimado
fondo_estimado
reflejo_estimado
temperatura
uniformidad
confianza
fuente
observaciones

fuente podrá ser:

MANUAL
FOTOGRAFÍA
IA
COMBINADO
5. Objetivo
ColorTarget

Por ejemplo:

nivel = 8
familia = ceniza
reflejo = ...
temperatura = fría

Y podremos almacenar:

"La clienta quiere un rubio claro frío."

6. Fórmula
Formula

Una fórmula podrá tener múltiples componentes:

Formula
│
├── 8.1 → 30 g
├── 8.3 → 10 g
└── corrector → X g

Cada componente será:

FormulaItem

con:

producto
tono
cantidad
unidad
orden
7. Producto
Product

Aquí empieza la separación por marca:

marca
línea
nombre
tipo
tono
nivel
reflejo

Y sus propiedades:

oxidantes compatibles
relación de mezcla
instrucciones
restricciones

No asumiremos que todas las marcas funcionan igual.

8. Proceso

La fórmula y el proceso son cosas diferentes.

Process

Porque una fórmula puede ser:

8.1 + 8.3

pero el proceso puede incluir:

preaclaración
→ tonalización
→ mantenimiento

El historial debe registrar qué se hizo realmente, no solamente qué fórmula se había pensado.

9. Resultado real
Result

La peluquera podrá registrar:

nivel_final
reflejo_final
temperatura
uniformidad
observaciones
foto_final

Y tendremos:

RESULTADO ESPERADO
        vs
RESULTADO REAL

Esto es extremadamente importante para el futuro sistema de aprendizaje.

10. Fotos

No guardaremos una fotografía como simple archivo aislado.

Cada foto estará asociada a:

Photo

y podrá indicar:

BEFORE
DIAGNOSIS
PROCESS
AFTER

Así una clienta puede tener:

ANTES
 ↓
DIAGNÓSTICO
 ↓
PROCESO
 ↓
DESPUÉS
11. Base universal de color

Ahora la otra mitad.

ColorLevel
Background
Pigment
Reflection
NeutralizationRule

Ejemplo conceptual:

ColorLevel
    6

Background
    orange

Pigment
    orange

NeutralizationRule
    orange → blue family

Estas entidades no pertenecen a una clienta concreta.

Son conocimiento del sistema.

12. Marcas
Brand

y:

BrandLine
Product
Shade
Developer
MixRule
CorrectionRule

Así podremos añadir una nueva marca sin modificar el núcleo.

13. Motor de reglas

Aquí estará una de las piezas más importantes:

ColorRule

Una regla podrá especificar:

condición
acción
prioridad
marca
producto
confianza
advertencia

Esto nos permitirá representar reglas complejas sin llenar el código de if/else.

14. Auditoría de resultados

Quiero incorporar desde el principio:

Prediction

La aplicación podrá guardar:

predicción
resultado real
diferencia

Por ejemplo:

PREVISTO
Nivel 8
Ceniza

REAL
Nivel 8
Más dorado

DIFERENCIA
+ componente cálido

Esto posteriormente permitirá estudiar qué condiciones producen desviaciones.

15. Funcionamiento local

La base de datos principal será local.

APK
 │
 └── Base de datos local
       ├── conocimiento
       ├── clientas
       ├── diagnósticos
       ├── fórmulas
       ├── procesos
       ├── resultados
       └── fotografías

La aplicación no dependerá de Internet para:

consultar colorimetría;
calcular mezclas;
consultar historial;
guardar clientas;
utilizar calculadoras;
ejecutar el motor básico.

La IA avanzada podrá ser un servicio adicional posteriormente.

16. Flujo completo de una clienta

Finalmente tendremos:

NUEVA CLIENTA
      ↓
FOTOGRAFÍA
      ↓
DIAGNÓSTICO
      ↓
PREGUNTAS
      ↓
BASE + HISTORIAL
      ↓
OBJETIVO
      ↓
SIMULACIÓN
      ↓
FÓRMULA
      ↓
OXIDANTE
      ↓
CANTIDADES
      ↓
PROCESO
      ↓
RESULTADO REAL
      ↓
FOTO FINAL
      ↓
HISTORIAL

Y si vuelve seis meses después:

MARÍA
 ↓
Último trabajo
 ↓
Último diagnóstico
 ↓
Última fórmula
 ↓
Resultado obtenido

La peluquera vuelve a tener todo el contexto inmediatamente.

Estado de ColorPro

Ya tenemos definidos los cinco bloques principales:

v0.1 — niveles, fondos, pigmentos y neutralización
v0.2 — mezclas
v0.3 — oxidantes, cantidades y proporciones
v0.4 — simulador
v0.5 — base de datos e historial

Ahora el siguiente paso es v0.6: diseñar las pantallas reales de la APK, incluyendo Inicio, Analizar cabello, Color deseado, Mezclador, Simulador, Calculadoras, Clientas, Historial, Marcas y Configuración.

Después de eso ya podremos pasar de la especificación a crear el proyecto y empezar a escribir los archivos reales.

procede
Error durante el análisis
from pathlib import Path
import json, textwrap, zipfile, os, shutil

root = Path("/mnt/data/ColorPro-v0.6")
if root.exists():
    shutil.rmtree(root)

dirs = [
    "www/assets/js/core",
    "www/assets/js/data",
    "www/assets/js/storage",
    "www/assets/js/ui",
    "www/assets/css",
    "www/assets/data/universal",
    "www/assets/data/brands",
    "android",
]
for d in dirs:
    (root / d).mkdir(parents=True, exist_ok=True)

files = {}

files["README.md"] = r"""# ColorPro v0.6 — Professional Colorimetry Assistant

Starter implementation for a modular, offline-first hair colorimetry assistant.

## What is implemented

- Dashboard/navigation for:
  - Home
  - Analyze Hair
  - Desired Color
  - Mixer
  - Simulator
  - Calculators
  - Clients
  - History
  - Brands
  - Settings
- Universal level scale 1–10.
- Conceptual lightening backgrounds.
- Semantic reflection/pigment families, independent of commercial shade codes.
- Complementary neutralization relationships.
- Data-driven product/brand structure.
- Hair history and diagnosis fields.
- Formula mixing by grams and proportions.
- Quantity suggestion by length/density/coverage.
- Raise/lower-level viability analysis.
- Warnings when artificial pigment or insufficient data makes a prediction unreliable.
- IndexedDB persistence for clients, diagnoses, formulas, and settings.
- No network dependency for the core calculations.
- Camera/photo slot prepared for a future real photo-analysis module.
- Prediction vs actual result structure prepared for later deviation analysis.

## Important

This is a real modular application foundation, not a claim that a photo can determine chemical history or guarantee a color result.

Photo diagnosis is intentionally conservative:
- lighting and white balance can alter apparent tone;
- camera analysis cannot reliably establish whether hair is virgin, dyed or bleached;
- unknown history lowers confidence;
- manufacturer/product rules remain separate from universal colorimetry.

## Capacitor

The frontend is under `www/` and is suitable as a Capacitor web directory.

This package does not include downloaded npm dependencies or a verified Android build. After installing the project's dependencies in a normal development environment, `www/` can be used as the web directory for Capacitor.

## Architecture

Data → Engine → Result → UI

`core/` contains calculations and rules.
`data/` contains universal and brand data.
`storage/` contains IndexedDB persistence.
`ui/` contains application rendering/navigation.

Do not place brand-specific assumptions inside the universal engine.
"""

files["MASTER_SPEC.md"] = r"""# ColorPro — Master Requirements

This document is the source-of-truth checklist for the product.

## Diagnosis
- Photo of hair.
- Estimate current level.
- Estimate/refine reflection, temperature, visible lightening background and uniformity.
- Confidence: High / Medium / Low / Insufficient.
- Diagnosis source: MANUAL / PHOTO / AI / COMBINED.
- Photo is never treated as infallible.
- Manual chemical-history questions remain necessary.

## Hair state
- Virgin.
- Dyed.
- Bleached.
- Bleached + dyed.
- Unknown.
- Previous product/color if known.
- Porosity.
- Density.
- Length.
- Chemical history.
- Artificial pigment residue.

## Universal level scale
1 Black
2 Very dark brown
3 Dark brown
4 Medium brown
5 Light brown
6 Dark blonde
7 Medium blonde
8 Light blonde
9 Very light blonde
10 Extra light blonde

## Lightening backgrounds
1–2 deep red
3 red
4 red/orange
5 orange/red
6 orange
7 orange/yellow
8 yellow
9 light yellow
10 very light yellow

These are conceptual baselines, not absolute guarantees.

## Reflection/pigment families
Keep semantic families separate from commercial codes:
natural, ash, gold, copper, red, violet, beige, pearl, etc.

Codes such as 8.1 are NOT universal. They belong to a brand/line.

## Neutralization
yellow ↔ violet
orange ↔ blue
red ↔ green

Neutralization depends on level, intensity, target, artificial pigment, history and product system.

## Raise/lower
- Calculate levels to raise/lower.
- Virgin and previously dyed hair are different.
- Lighter dye does not automatically lift artificial dark dye.
- Viability:
  ACHIEVABLE
  CONDITIONAL
  REQUIRES_PREVIOUS_PROCESS
  INSUFFICIENT_DATA

## Formula/mixer
- Multiple tones and grams.
- Total grams.
- Percentages.
- Proportional scaling.
- Never simply average shade numbers.
- Base, target, history and product rules affect prediction.

## Oxidants
Store:
- volume
- percentage
- function
- brand/system
- mix ratio
- restrictions

Never assume universal behavior.

## Quantity calculator
Inputs:
- length
- density
- coverage
- optional manual override

## Simulator
Inputs:
- current hair
- target
- process
- product
- tone
- oxidant
- quantity

Outputs:
- expected level
- trend
- residual background
- confidence
- factors
- diagnosis
- viability
- warnings

Alternative formulas must be comparable without false certainty.

## Clients/history
Client:
id, name, optional phone, registration date, notes

HairProfile:
client_id, date, estimated level, background, reflection,
virgin/dyed/bleached flags, porosity, density, length,
chemical history, notes

Diagnosis:
id, client_id, hair_profile_id, date, photo,
estimated level/background/reflection, temperature,
uniformity, confidence, source, notes

ColorTarget:
level, family, reflection, temperature

Formula:
multiple FormulaItems:
product, shade, quantity, unit, order

Product:
brand, line, name, type, shade, level, reflection,
compatible developers, mix ratio, instructions, restrictions

Process:
separate from Formula; permits multi-step workflows.

Result:
final level, reflection, temperature, uniformity,
notes, final photo

Photos:
BEFORE / DIAGNOSIS / PROCESS / AFTER

Prediction:
expected prediction vs actual result and difference.

## Brands
Brand → BrandLine → Product → Shade/Developer → MixRule/CorrectionRule

Universal knowledge and brand data must remain separate.

## Rules engine
Data-driven ColorRule:
condition, action, priority, brand, product, confidence, warning

Avoid giant if/else blocks.

## Offline-first
Core works offline:
levels, colorimetry, calculations, mixes, neutralization,
history, clients, calculators.

Advanced AI/photo analysis may be online later.

## Safety
- No invented formula when data is insufficient.
- Manufacturer instructions prevail.
- Prediction is guidance, not guarantee.
- Flag unknown history, residual artificial pigment, porosity,
  previous processes and incompatible product rules.

## Long-term learning
Record expected vs actual result and deviations such as:
- more golden than expected
- darker than expected
- less neutral than expected
etc.

This is for later analysis, not autonomous unsafe decision-making.
"""

files["www/manifest.json"] = r"""{
  "name": "ColorPro",
  "short_name": "ColorPro",
  "start_url": "./index.html",
  "display": "standalone",
  "background_color": "#0b1220",
  "theme_color": "#0b1220",
  "description": "Asistente profesional de colorimetría capilar"
}"""

files["www/index.html"] = r"""<!doctype html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=1,user-scalable=no">
  <meta name="theme-color" content="#0b1220">
  <title>ColorPro</title>
  <link rel="manifest" href="./manifest.json">
  <link rel="stylesheet" href="./assets/css/app.css">
</head>
<body>
  <header class="topbar">
    <div>
      <div class="brand">ColorPro</div>
      <div class="subtitle">Asistente profesional de colorimetría</div>
    </div>
    <span id="onlineBadge" class="badge">Offline-first</span>
  </header>

  <main id="app"></main>

  <nav class="bottom-nav" id="bottomNav">
    <button data-route="home">Inicio</button>
    <button data-route="diagnosis">Analizar</button>
    <button data-route="mixer">Mezclador</button>
    <button data-route="simulator">Simular</button>
    <button data-route="clients">Clientes</button>
  </nav>

  <script type="module" src="./assets/js/app.js"></script>
</body>
</html>"""

files["www/assets/css/app.css"] = r"""
:root{
  --bg:#0b1220;
  --panel:#121b2d;
  --panel2:#17233a;
  --text:#eef4ff;
  --muted:#9eacc4;
  --accent:#d6a85f;
  --line:#263550;
  --danger:#ef8b8b;
  --ok:#8fd3a7;
}
*{box-sizing:border-box}
body{margin:0;background:linear-gradient(180deg,#0b1220,#0e1727);color:var(--text);font-family:Inter,system-ui,-apple-system,Segoe UI,sans-serif;padding-bottom:78px}
button,input,select,textarea{font:inherit}
button{cursor:pointer}
.topbar{position:sticky;top:0;z-index:10;padding:16px 18px;background:rgba(11,18,32,.95);backdrop-filter:blur(12px);border-bottom:1px solid var(--line);display:flex;justify-content:space-between;align-items:center}
.brand{font-size:24px;font-weight:800;letter-spacing:.2px}
.subtitle{font-size:12px;color:var(--muted);margin-top:2px}
.badge{font-size:11px;border:1px solid var(--line);padding:6px 8px;border-radius:999px;color:var(--muted)}
#app{max-width:900px;margin:auto;padding:18px}
h1,h2,h3{margin-top:0}
.grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(170px,1fr));gap:12px}
.card{background:var(--panel);border:1px solid var(--line);border-radius:16px;padding:16px}
.card.action{transition:.15s}
.card.action:hover{transform:translateY(-1px);border-color:#405477}
.kicker{font-size:11px;text-transform:uppercase;letter-spacing:.08em;color:var(--accent)}
.muted{color:var(--muted)}
.small{font-size:12px}
.row{display:flex;gap:10px;align-items:center;flex-wrap:wrap}
.spread{display:flex;justify-content:space-between;gap:10px;align-items:center}
label{display:block;font-size:12px;color:var(--muted);margin:12px 0 6px}
input,select,textarea{width:100%;background:#0d1626;color:var(--text);border:1px solid var(--line);border-radius:10px;padding:10px 11px;outline:none}
textarea{min-height:90px;resize:vertical}
.btn{border:0;border-radius:10px;padding:10px 14px;background:var(--accent);color:#15100a;font-weight:700}
.btn.secondary{background:var(--panel2);color:var(--text);border:1px solid var(--line)}
.btn.danger{background:transparent;color:var(--danger);border:1px solid #56343b}
.section{margin-bottom:16px}
.result{border-left:3px solid var(--accent);padding-left:12px}
.warning{border:1px solid #61484c;background:#251a20;color:#ffd5d5;border-radius:12px;padding:12px;margin-top:10px}
.success{border:1px solid #345a45;background:#13231b;color:#c9f1d7;border-radius:12px;padding:12px;margin-top:10px}
.table{width:100%;border-collapse:collapse;font-size:13px}
.table th,.table td{padding:8px;border-bottom:1px solid var(--line);text-align:left}
.bottom-nav{position:fixed;left:0;right:0;bottom:0;z-index:20;background:rgba(11,18,32,.97);border-top:1px solid var(--line);display:flex;justify-content:center;gap:4px;padding:8px}
.bottom-nav button{background:transparent;border:0;color:var(--muted);padding:9px 10px;border-radius:9px}
.bottom-nav button.active{background:var(--panel2);color:var(--text)}
.photo-box{min-height:180px;border:1px dashed #405477;border-radius:14px;display:flex;align-items:center;justify-content:center;text-align:center;color:var(--muted);padding:20px}
.metric{font-size:25px;font-weight:800}
@media(max-width:520px){
  #app{padding:12px}
  .grid{grid-template-columns:1fr 1fr}
  .bottom-nav button{font-size:11px;padding:8px 6px}
}
"""

files["www/assets/js/core/levels.js"] = r"""export const LEVELS = [
  {level:1,name:"Negro"},
  {level:2,name:"Castaño muy oscuro"},
  {level:3,name:"Castaño oscuro"},
  {level:4,name:"Castaño medio"},
  {level:5,name:"Castaño claro"},
  {level:6,name:"Rubio oscuro"},
  {level:7,name:"Rubio medio"},
  {level:8,name:"Rubio claro"},
  {level:9,name:"Rubio muy claro"},
  {level:10,name:"Rubio extra claro"}
];

export const BACKGROUNDS = {
  1:{primary:"rojo profundo",secondary:[],intensity:"alta"},
  2:{primary:"rojo profundo",secondary:[],intensity:"alta"},
  3:{primary:"rojo",secondary:[],intensity:"alta"},
  4:{primary:"rojo",secondary:["naranja"],intensity:"alta"},
  5:{primary:"naranja",secondary:["rojo"],intensity:"media-alta"},
  6:{primary:"naranja",secondary:[],intensity:"media"},
  7:{primary:"naranja",secondary:["amarillo"],intensity:"media"},
  8:{primary:"amarillo",secondary:[],intensity:"media"},
  9:{primary:"amarillo claro",secondary:[],intensity:"baja"},
  10:{primary:"amarillo muy claro",secondary:[],intensity:"muy baja"}
};

export function levelInfo(level){
  return LEVELS.find(x=>x.level===Number(level)) || null;
}

export function clampLevel(level){
  return Math.max(1,Math.min(10,Number(level)||1));
}
"""

files["www/assets/js/core/neutralization.js"] = r"""const COMPLEMENTS = {
  amarillo:"violeta",
  "amarillo claro":"violeta",
  "amarillo muy claro":"violeta",
  naranja:"azul",
  rojo:"verde",
  "rojo profundo":"verde"
};

export function complementary(pigment){
  return COMPLEMENTS[String(pigment).toLowerCase()] || null;
}

export function neutralizationAdvice(background, targetFamily){
  const bg = String(background || "").toLowerCase();
  const family = String(targetFamily || "").toLowerCase();
  const comp = complementary(bg);
  if(!comp) return {needed:false,message:"No se identificó un pigmento residual neutralizable con esta regla básica."};

  const targetNeedsNeutral = ["natural","ash","ceniza","beige","perla"].includes(family);
  if(!targetNeedsNeutral){
    return {needed:false,message:`El fondo ${bg} puede ser parte de la lectura del resultado; no se recomienda neutralizar automáticamente.`};
  }
  return {
    needed:true,
    complement:comp,
    message:`El fondo ${bg} tiene como complemento conceptual ${comp}. La intensidad y cantidad deben definirse según el sistema de la marca/producto.`
  };
}
"""

files["www/assets/js/core/formulas.js"] = r"""export function normalizeItems(items=[]){
  return items
    .map((x,i)=>({
      order:i+1,
      shade:String(x.shade||"").trim(),
      quantity:Number(x.quantity)||0,
      product:x.product||""
    }))
    .filter(x=>x.shade || x.quantity>0);
}

export function mixStats(items=[]){
  const normalized=normalizeItems(items);
  const total=normalized.reduce((s,x)=>s+x.quantity,0);
  return {
    items:normalized.map(x=>({...x,proportion:total?x.quantity/total:0})),
    total,
    percentages:normalized.map(x=>({
      shade:x.shade,
      grams:x.quantity,
      percent:total?Number((x.quantity/total*100).toFixed(2)):0
    }))
  };
}

export function scaleFormula(items,totalDesired){
  const stats=mixStats(items);
  if(!stats.total || !Number(totalDesired)) return [];
  const factor=Number(totalDesired)/stats.total;
  return stats.items.map(x=>({...x,quantity:Number((x.quantity*factor).toFixed(1))}));
}
"""

files["www/assets/js/core/quantities.js"] = r"""const BASE = {
  short:{low:30,medium:40,high:50},
  medium:{low:40,medium:50,high:60},
  long:{low:50,medium:65,high:80},
  veryLong:{low:65,medium:80,high:100}
};

export function suggestQuantity({length="medium",density="medium",coverage="full"}={}){
  const row=BASE[length]||BASE.medium;
  let grams=row[density]||row.medium;
  if(coverage==="partial") grams*=0.65;
  return Math.round(grams);
}
"""

files["www/assets/js/core/engine.js"] = r"""import {BACKGROUNDS,clampLevel} from "./levels.js";
import {neutralizationAdvice} from "./neutralization.js";
import {mixStats} from "./formulas.js";
import {suggestQuantity} from "./quantities.js";

export function analyze(input={}){
  const level=clampLevel(input.currentLevel);
  const target=clampLevel(input.targetLevel);
  const history=input.history||"unknown";
  const dyed=history==="dyed"||history==="bleachedDyed";
  const bleached=history==="bleached"||history==="bleachedDyed";
  const unknown=history==="unknown";
  const delta=target-level;
  const background=(input.background||BACKGROUNDS[level]?.primary||"desconocido");
  const family=input.targetFamily||"natural";
  const neutral=neutralizationAdvice(background,family);

  let viability="ACHIEVABLE";
  const warnings=[];

  if(unknown){
    viability="INSUFFICIENT_DATA";
    warnings.push("Historial químico desconocido: no se puede asumir comportamiento de pigmento artificial.");
  }
  if(dyed && delta>0){
    viability="REQUIRES_PREVIOUS_PROCESS";
    warnings.push("El cabello previamente teñido no debe considerarse levantable automáticamente con un tinte más claro.");
  }
  if(input.porosity==="high"){
    warnings.push("Porosidad alta: puede alterar absorción, uniformidad y percepción del resultado.");
  }
  if(bleached){
    warnings.push("Cabello decolorado: evaluar porosidad y fondo real antes de aplicar una nueva fórmula.");
  }

  if(!input.currentLevel || !input.targetLevel){
    viability="INSUFFICIENT_DATA";
    warnings.push("Faltan nivel actual u objetivo.");
  }

  if(delta===0 && viability==="ACHIEVABLE"){
    viability="CONDITIONAL";
    warnings.push("No hay cambio de altura; la estrategia se centra en reflejo, temperatura y depósito.");
  }

  const confidence=viability==="INSUFFICIENT_DATA"?"Insufficient":
    (unknown||dyed||input.porosity==="high"?"Low":"Medium");

  return {
    diagnostico:{
      nivelActual:level,
      nivelObjetivo:target,
      fondo:background,
      distanciaNiveles:delta
    },
    estrategia:{
      direccion:delta>0?"subir":delta<0?"bajar":"mantener",
      neutralizacion:neutral
    },
    formula:mixStats(input.formula||[]),
    cantidad:suggestQuantity(input.quantityProfile||{}),
    resultado_estimado:{
      nivelEsperado:target,
      tendencia:delta>0?"más claro":delta<0?"más oscuro":"misma altura",
      fondoResidual:BACKGROUNDS[target]?.primary||"variable"
    },
    viabilidad,
    confianza:confidence,
    advertencias:warnings
  };
}
"""

files["www/assets/js/storage/db.js"] = r"""const DB_NAME="colorpro_db";
const VERSION=1;
const STORES=["clients","profiles","diagnoses","formulas","processes","results","predictions","settings"];

function openDB(){
  return new Promise((resolve,reject)=>{
    const req=indexedDB.open(DB_NAME,VERSION);
    req.onupgradeneeded=()=>{
      const db=req.result;
      STORES.forEach(name=>{
        if(!db.objectStoreNames.contains(name)){
          db.createObjectStore(name,{keyPath:"id",autoIncrement:true});
        }
      });
    };
    req.onsuccess=()=>resolve(req.result);
    req.onerror=()=>reject(req.error);
  });
}

export async function put(store,value){
  const db=await openDB();
  return new Promise((resolve,reject)=>{
    const tx=db.transaction(store,"readwrite");
    const req=tx.objectStore(store).put(value);
    req.onsuccess=()=>resolve(req.result);
    req.onerror=()=>reject(req.error);
  });
}

export async function all(store){
  const db=await openDB();
  return new Promise((resolve,reject)=>{
    const tx=db.transaction(store,"readonly");
    const req=tx.objectStore(store).getAll();
    req.onsuccess=()=>resolve(req.result);
    req.onerror=()=>reject(req.error);
  });
}
"""

files["www/assets/js/data/universal.js"] = r"""export const REFLECTION_FAMILIES=[
  "natural","ash","gold","copper","red","violet","beige","pearl"
];

export const TEMPERATURES=["fría","neutra","cálida"];

export const HAIR_HISTORIES=[
  ["virgin","Virgen"],
  ["dyed","Teñido"],
  ["bleached","Decolorado"],
  ["bleachedDyed","Decolorado + teñido"],
  ["unknown","Desconocido"]
];

export const POROSITIES=["low","medium","high"];
export const DENSITIES=["low","medium","high"];
export const LENGTHS=[
  ["short","Corto"],["medium","Medio"],["long","Largo"],["veryLong","Muy largo"]
];

export const COVERAGES=[
  ["partial","Parcial"],["full","Completa"]
];
"""

files["www/assets/js/data/brands.js"] = r"""export const BRANDS=[
  {
    id:"demo-brand",
    name:"Marca de ejemplo",
    lines:[
      {
        id:"demo-line",
        name:"Línea de ejemplo",
        products:[
          {
            id:"demo-81",
            name:"Color 8.1 de ejemplo",
            type:"permanent",
            shade:"8.1",
            level:8,
            reflection:"ash",
            compatibleDevelopers:[],
            mixRatio:null,
            instructions:"Sustituir por datos reales del fabricante.",
            restrictions:["Dato demostrativo; no usar como instrucción de fabricante."]
          }
        ]
      }
    ]
  }
];
"""

files["www/assets/js/ui/views.js"] = r"""import {LEVELS} from "../core/levels.js";
import {REFLECTION_FAMILIES,TEMPERATURES,HAIR_HISTORIES,POROSITIES,DENSITIES,LENGTHS,COVERAGES} from "../data/universal.js";
import {mixStats,scaleFormula} from "../core/formulas.js";
import {analyze} from "../core/engine.js";
import {suggestQuantity} from "../core/quantities.js";
import {put,all} from "../storage/db.js";
import {BRANDS} from "../data/brands.js";

const options=(arr,valueKey="value",labelKey="label")=>arr.map(x=>{
  const v=Array.isArray(x)?x[0]:x[valueKey];
  const l=Array.isArray(x)?x[1]:x[labelKey];
  return `<option value="${v}">${l}</option>`;
}).join("");

export function renderHome(){
  return `<section class="section">
    <div class="card">
      <div class="kicker">ColorPro v0.6</div>
      <h1>De lo que hay a lo que se quiere</h1>
      <p class="muted">Diagnóstico → estrategia → fórmula → resultado estimado. El motor separa colorimetría universal de reglas de cada marca.</p>
    </div>
  </section>
  <section class="grid">
    <div class="card action" data-go="diagnosis"><h3>📷 Analizar cabello</h3><p class="muted small">Foto + preguntas mínimas + nivel, fondo, reflejo y confianza.</p></div>
    <div class="card action" data-go="target"><h3>🎯 Color deseado</h3><p class="muted small">Define altura, familia y temperatura objetivo.</p></div>
    <div class="card action" data-go="mixer"><h3>⚗️ Mezclador</h3><p class="muted small">Gramos, proporciones y escalado sin promediar códigos.</p></div>
    <div class="card action" data-go="simulator"><h3>🧪 Simulador</h3><p class="muted small">Evalúa viabilidad, fondo residual, confianza y advertencias.</p></div>
    <div class="card action" data-go="calculators"><h3>🧮 Calculadoras</h3><p class="muted small">Cantidad y diferencia de niveles.</p></div>
    <div class="card action" data-go="clients"><h3>👤 Clientes</h3><p class="muted small">Perfiles, diagnósticos y evolución.</p></div>
    <div class="card action" data-go="history"><h3>🗂 Historial</h3><p class="muted small">Predicción frente al resultado real.</p></div>
    <div class="card action" data-go="brands"><h3>🏷 Marcas</h3><p class="muted small">Separación estricta de datos comerciales.</p></div>
  </section>`;
}

export function renderDiagnosis(){
  return `<div class="spread"><h2>Analizar cabello</h2><button class="btn secondary" data-go="home">Inicio</button></div>
  <div class="card section">
    <div class="photo-box">📷<br>Ranura preparada para cámara/análisis fotográfico.<br><span class="small">La foto no determina por sí sola el historial químico.</span></div>
    <label>Nivel estimado actual</label><select id="dLevel">${options(LEVELS.map(x=>[x.level,`${x.level} — ${x.name}`]))}</select>
    <label>Fondo visible</label><input id="dBackground" placeholder="Ej.: naranja / amarillo">
    <label>Reflejo/familia dominante</label><select id="dReflection">${options(REFLECTION_FAMILIES.map(x=>[x,x]))}</select>
    <label>Temperatura</label><select id="dTemp">${options(TEMPERATURES.map(x=>[x,x]))}</select>
    <label>Uniformidad</label><select id="dUniform"><option>uniforme</option><option>ligeramente irregular</option><option>irregular</option></select>
    <label>Historial químico</label><select id="dHistory">${options(HAIR_HISTORIES)}</select>
    <label>Porosidad</label><select id="dPorosity">${options(POROSITIES.map(x=>[x,{low:"Baja",medium:"Media",high:"Alta"}[x]]))}</select>
    <label>Densidad</label><select id="dDensity">${options(DENSITIES.map(x=>[x,{low:"Baja",medium:"Media",high:"Alta"}[x]]))}</select>
    <label>Largo</label><select id="dLength">${options(LENGTHS)}</select>
    <label>Historial / notas</label><textarea id="dNotes" placeholder="Color anterior, decoloraciones, productos conocidos, etc."></textarea>
    <div class="row" style="margin-top:12px"><button class="btn" id="saveDiagnosis">Guardar diagnóstico</button><button class="btn secondary" data-go="target">Continuar al objetivo</button></div>
    <div id="diagResult"></div>
  </div>`;
}

export function renderTarget(){
  return `<div class="spread"><h2>Color deseado</h2><button class="btn secondary" data-go="home">Inicio</button></div>
  <div class="card">
    <label>Nivel objetivo</label><select id="tLevel">${options(LEVELS.map(x=>[x.level,`${x.level} — ${x.name}`]))}</select>
    <label>Familia/reflejo</label><select id="tFamily">${options(REFLECTION_FAMILIES.map(x=>[x,x]))}</select>
    <label>Temperatura</label><select id="tTemp">${options(TEMPERATURES.map(x=>[x,x]))}</select>
    <p class="muted small">El código comercial exacto se definirá dentro de la marca/línea seleccionada. 8.1, 8A, etc. no son códigos universales.</p>
  </div>`;
}

export function renderMixer(){
  return `<div class="spread"><h2>Mezclador</h2><button class="btn secondary" data-go="home">Inicio</button></div>
  <div class="card">
    <div id="mixItems"></div>
    <div class="row" style="margin-top:12px"><button class="btn secondary" id="addMix">+ Añadir tono</button><button class="btn" id="calcMix">Calcular</button></div>
    <div id="mixResult"></div>
  </div>`;
}

export function renderSimulator(){
  return `<div class="spread"><h2>Simulador</h2><button class="btn secondary" data-go="home">Inicio</button></div>
  <div class="card">
    <label>Nivel actual</label><select id="sCurrent">${options(LEVELS.map(x=>[x.level,`${x.level} — ${x.name}`]))}</select>
    <label>Nivel objetivo</label><select id="sTarget">${options(LEVELS.map(x=>[x.level,`${x.level} — ${x.name}`]))}</select>
    <label>Fondo actual</label><input id="sBackground" placeholder="Ej.: naranja">
    <label>Familia objetivo</label><select id="sFamily">${options(REFLECTION_FAMILIES.map(x=>[x,x]))}</select>
    <label>Historial</label><select id="sHistory">${options(HAIR_HISTORIES)}</select>
    <label>Porosidad</label><select id="sPorosity">${options(POROSITIES.map(x=>[x,{low:"Baja",medium:"Media",high:"Alta"}[x]]))}</select>
    <label>Largo</label><select id="sLength">${options(LENGTHS)}</select>
    <label>Densidad</label><select id="sDensity">${options(DENSITIES.map(x=>[x,{low:"Baja",medium:"Media",high:"Alta"}[x]]))}</select>
    <label>Cobertura</label><select id="sCoverage">${options(COVERAGES)}</select>
    <button class="btn" id="runSimulation">Simular</button>
    <div id="simResult"></div>
  </div>`;
}

export function renderCalculators(){
  return `<div class="spread"><h2>Calculadoras</h2><button class="btn secondary" data-go="home">Inicio</button></div>
  <div class="grid">
    <div class="card">
      <h3>Cantidad</h3>
      <label>Largo</label><select id="qLength">${options(LENGTHS)}</select>
      <label>Densidad</label><select id="qDensity">${options(DENSITIES.map(x=>[x,{low:"Baja",medium:"Media",high:"Alta"}[x]]))}</select>
      <label>Cobertura</label><select id="qCoverage">${options(COVERAGES)}</select>
      <button class="btn" id="calcQuantity">Calcular</button>
      <div id="qResult"></div>
    </div>
    <div class="card">
      <h3>Diferencia de niveles</h3>
      <label>Actual</label><select id="qCurrent">${options(LEVELS.map(x=>[x.level,x.level]))}</select>
      <label>Objetivo</label><select id="qTarget">${options(LEVELS.map(x=>[x.level,x.level]))}</select>
      <div id="deltaResult" class="result" style="margin-top:12px"></div>
    </div>
  </div>`;
}

export function renderClients(){
  return `<div class="spread"><h2>Clientes</h2><button class="btn secondary" data-go="home">Inicio</button></div>
  <div class="card">
    <label>Nombre</label><input id="cName">
    <label>Teléfono (opcional)</label><input id="cPhone">
    <label>Notas</label><textarea id="cNotes"></textarea>
    <button class="btn" id="saveClient">Guardar cliente</button>
  </div>
  <div id="clientList" class="section"></div>`;
}

export function renderHistory(){
  return `<div class="spread"><h2>Historial</h2><button class="btn secondary" data-go="home">Inicio</button></div>
  <div id="historyList" class="card"><p class="muted">Cargando…</p></div>`;
}

export function renderBrands(){
  return `<div class="spread"><h2>Marcas</h2><button class="btn secondary" data-go="home">Inicio</button></div>
  <div class="card"><p class="muted">Las marcas son datos independientes del motor universal.</p>
  <table class="table"><thead><tr><th>Marca</th><th>Líneas</th><th>Productos</th></tr></thead><tbody>
  ${BRANDS.map(b=>`<tr><td>${b.name}</td><td>${b.lines.length}</td><td>${b.lines.reduce((n,l)=>n+l.products.length,0)}</td></tr>`).join("")}
  </tbody></table></div>`;
}

export function renderSettings(){
  return `<div class="spread"><h2>Configuración</h2><button class="btn secondary" data-go="home">Inicio</button></div>
  <div class="card"><h3>Principios del motor</h3>
  <p class="muted">No se inventan fórmulas cuando faltan datos. La información del fabricante tiene prioridad sobre cualquier regla conceptual universal.</p>
  <p class="muted">La simulación es una estimación. La fotografía no sustituye el diagnóstico profesional ni permite inferir con certeza el historial químico.</p>
  </div>`;
}

export async function bindView(route){
  if(route==="diagnosis"){
    document.querySelector("#saveDiagnosis").onclick=async()=>{
      const record={
        client_id:null,date:new Date().toISOString(),
        estimated_level:Number(dLevel.value),
        background:dBackground.value,reflection:dReflection.value,
        temperature:dTemp.value,uniformity:dUniform.value,
        confidence:dHistory.value==="unknown"?"Low":"Medium",
        source:"MANUAL",history:dHistory.value,porosity:dPorosity.value,
        density:dDensity.value,length:dLength.value,notes:dNotes.value
      };
      await put("diagnoses",record);
      diagResult.innerHTML=`<div class="success">Diagnóstico guardado. Confianza: ${record.confidence}.</div>`;
    };
  }
  if(route==="mixer"){
    const box=document.querySelector("#mixItems");
    let count=0;
    const add=()=>{
      count++;
      box.insertAdjacentHTML("beforeend",`<div class="row mix-row" style="margin-bottom:8px">
        <input placeholder="Tono/código" class="mix-shade">
        <input type="number" min="0" step=".1" placeholder="g" class="mix-qty">
      </div>`);
    };
    add(); add();
    addMix.onclick=add;
    calcMix.onclick=()=>{
      const items=[...document.querySelectorAll(".mix-row")].map(r=>({
        shade:r.querySelector(".mix-shade").value,
        quantity:Number(r.querySelector(".mix-qty").value)||0
      }));
      const s=mixStats(items);
      mixResult.innerHTML=`<div class="result"><div class="metric">${s.total.toFixed(1)} g</div>${s.percentages.map(x=>`<p>${x.shade||"Sin código"} — ${x.grams} g — ${x.percent}%</p>`).join("")}</div>`;
    };
  }
  if(route==="simulator"){
    runSimulation.onclick=()=>{
      const r=analyze({
        currentLevel:Number(sCurrent.value),targetLevel:Number(sTarget.value),
        background:sBackground.value,targetFamily:sFamily.value,
        history:sHistory.value,porosity:sPorosity.value,
        quantityProfile:{length:sLength.value,density:sDensity.value,coverage:sCoverage.value},
        formula:[]
      });
      simResult.innerHTML=`<div class="result">
        <h3>Resultado estimado</h3>
        <p><b>Viabilidad:</b> ${r.viabilidad}</p>
        <p><b>Confianza:</b> ${r.confianza}</p>
        <p><b>Dirección:</b> ${r.estrategia.direccion}</p>
        <p><b>Nivel esperado:</b> ${r.resultado_estimado.nivelEsperado}</p>
        <p><b>Fondo residual conceptual:</b> ${r.resultado_estimado.fondoResidual}</p>
        <p><b>Cantidad sugerida:</b> ${r.cantidad} g</p>
        ${r.estrategia.neutralizacion.needed?`<div class="warning">${r.estrategia.neutralizacion.message}</div>`:""}
        ${r.advertencias.map(w=>`<div class="warning">${w}</div>`).join("")}
      </div>`;
    };
  }
  if(route==="calculators"){
    calcQuantity.onclick=()=>qResult.innerHTML=`<div class="success">${suggestQuantity({length:qLength.value,density:qDensity.value,coverage:qCoverage.value})} g sugeridos. Se puede sobrescribir manualmente.</div>`;
    const updateDelta=()=>{const d=Number(qTarget.value)-Number(qCurrent.value);deltaResult.textContent=d>0?`Subir ${d} nivel(es)`:d<0?`Bajar ${Math.abs(d)} nivel(es)`:"Mantener altura";};
    qCurrent.onchange=updateDelta;qTarget.onchange=updateDelta;updateDelta();
  }
  if(route==="clients"){
    saveClient.onclick=async()=>{
      if(!cName.value.trim()) return;
      await put("clients",{name:cName.value.trim(),phone:cPhone.value.trim(),registration_date:new Date().toISOString(),notes:cNotes.value});
      cName.value=cPhone.value=cNotes.value="";
      await loadClients();
    };
    async function loadClients(){
      const list=await all("clients");
      clientList.innerHTML=list.length?list.map(c=>`<div class="card section"><b>${c.name}</b><div class="muted small">${c.phone||"Sin teléfono"}</div><div class="small">${c.notes||""}</div></div>`).join(""):`<div class="card"><p class="muted">No hay clientes todavía.</p></div>`;
    }
    await loadClients();
  }
  if(route==="history"){
    const [d,c]=await Promise.all([all("diagnoses"),all("clients")]);
    historyList.innerHTML=`<h3>Diagnósticos registrados</h3>`+(d.length?d.map(x=>`<p>${new Date(x.date).toLocaleString()} — nivel ${x.estimated_level} — ${x.reflection} — confianza ${x.confidence}</p>`).join(""):`<p class="muted">Aún no hay diagnósticos.</p>`);
  }
}
"""

files["www/assets/js/ui/router.js"] = r"""import {renderHome,renderDiagnosis,renderTarget,renderMixer,renderSimulator,renderCalculators,renderClients,renderHistory,renderBrands,renderSettings,bindView} from "./views.js";

const routes={home:renderHome,diagnosis:renderDiagnosis,target:renderTarget,mixer:renderMixer,simulator:renderSimulator,calculators:renderCalculators,clients:renderClients,history:renderHistory,brands:renderBrands,settings:renderSettings};

export async function navigate(route){
  if(!routes[route]) route="home";
  document.querySelector("#app").innerHTML=routes[route]();
  document.querySelectorAll("[data-go]").forEach(el=>el.onclick=()=>navigate(el.dataset.go));
  document.querySelectorAll("#bottomNav button").forEach(el=>el.classList.toggle("active",el.dataset.route===route));
  await bindView(route);
}
"""

files["www/assets/js/app.js"] = r"""import {navigate} from "./ui/router.js";

document.addEventListener("click",e=>{
  const b=e.target.closest("[data-route]");
  if(b) navigate(b.dataset.route);
});

navigate("home");
"""

files["package.json"] = r"""{
  "name": "colorpro",
  "version": "0.6.0",
  "private": true,
  "description": "ColorPro - asistente profesional de colorimetría capilar",
  "scripts": {
    "web": "echo \"Frontend is in www/\"",
    "cap:sync": "npx cap sync",
    "cap:open": "npx cap open android"
  },
  "dependencies": {
    "@capacitor/core": "^7.0.0"
  },
  "devDependencies": {
    "@capacitor/cli": "^7.0.0",
    "@capacitor/android": "^7.0.0"
  }
}
"""

files["capacitor.config.ts"] = r"""import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.colorpro.app",
  appName: "ColorPro",
  webDir: "www",
  bundledWebRuntime: false
};

export default config;
"""

files["VERSION"] = "0.6.0\n"

for rel, content in files.items():
    p = root / rel
    p.parent.mkdir(parents=True, exist_ok=True)
    p.write_text(content, encoding="utf-8")

zip_path = Path("/mnt/data/ColorPro-v0.6.zip")
if zip_path.exists():
    zip_path.unlink()
with zipfile.ZipFile(zip_path, "w", zipfile.ZIP_DEFLATED) as z:
    for p in root.rglob("*"):
        if p.is_file():
            z.write(p, p.relative_to(root.parent))

print(f"Proyecto creado: {root}")
print(f"ZIP: {zip_path}")
print(f"Archivos: {sum(1 for p in root.rglob('*') if p.is_file())}")


Data analysis isn't available right now. Do you want to continue without it?

El límite de ejecución instantánea se alcanzó y el modelo Mini disponible en este momento es solo de texto, por lo que no puedo generar ahora mismo el paquete de archivos descargable de ColorPro v0.6.

No voy a fingir que el proyecto fue creado: la generación de archivos no llegó a ejecutarse.

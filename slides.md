---
theme: default
title: A Full Pipeline for the Analysis of Redacted Documents
colorSchema: light
fonts:
  provider: none
layout: cover
---

<div class="absolute top-8 left-10 flex items-center gap-6 text-left">
  <img src="/figures/logo_uc.png" class="h-24" />
  <div class="leading-snug">
    <div>Pontificia Universidad Católica de Chile</div>
    <div>Departamento de Ciencia de la Computación</div>
    <div>NuestramemorIA</div>
  </div>
</div>

# A Full Pipeline for the Analysis of Redacted Documents

Daniel Eduardo Sebastián Gaete · November 9, 2026

<div class="mt-8 text-base leading-snug opacity-80">
  <div class="font-bold">Committee</div>
  <div>Domingo Mery · Jorge Gironás · Jocelyn Dunstan · Gregory Randall</div>
</div>

---
clicks: 8
---

# Contents

<ol :class="{ focus: $clicks >= 8 }">
  <li v-click class="on">Introduction</li>
  <li v-click>Related work</li>
  <li v-click>Method</li>
  <li v-click>Experiments</li>
  <li v-click>Case study</li>
  <li v-click>Discussion</li>
  <li v-click>Conclusion</li>
</ol>

---
clicks: 6
---

# 1. Introduction

<Scene :step="$clicks" :bbox="[-6, -3, 6, 3]" :nodes="[
  { id: 'kgb', x: -4.2, y: 1.5, w: 2.5, h: 2.5, img: '/figures/logo_kgb.png', from: 1 },
  { id: 'fbi', x: 0, y: 1.5, w: 2.5, h: 2.5, img: '/figures/logo_fbi.png', from: 2 },
  { id: 'cia', x: 4.2, y: 1.5, w: 2.5, h: 2.5, img: '/figures/logo_cia.png', from: 3 },
  { id: 'state', x: -4.2, y: -1.5, w: 2.5, h: 2.5, img: '/figures/logo_state.png', from: 4 },
  { id: 'dina', x: 0, y: -1.5, w: 2.5, h: 2.5, img: '/figures/logo_dina.png', from: 5 },
  { id: 'cni', x: 4.2, y: -1.5, w: 2.5, h: 2.5, img: '/figures/logo_cni.png', from: 6 },
]" />

---

# 1. Introduction

<div class="flex justify-center gap-6 mt-6">
  <img class="example" src="/figures/intro_dutch_ex1.png" style="height: 290px" />
  <img v-click class="example" src="/figures/intro_dutch_ex2.png" style="height: 290px" />
</div>

---

# 1. Introduction

<div class="flex justify-center gap-6 mt-6">
  <img class="example" src="/figures/intro_epstein_ex1.png" style="height: 272px" />
  <img v-click class="example" src="/figures/intro_epstein_ex2.png" style="height: 272px" />
</div>

---

# 1. Introduction

<div class="flex justify-center gap-6 mt-6">
  <img class="example" src="/figures/intro_court_ex1.jpg" style="height: 320px" />
  <img v-click class="example" src="/figures/intro_court_ex2.jpg" style="height: 320px" />
</div>

---

# 1. Introduction

<img src="/figures/ley_20285.png" class="mx-auto" style="max-height: 340px" />

---

# 1. Introduction

<div class="ml-8">

<v-clicks>

- Chile Project
- 13,000+ pages

</v-clicks>

</div>

<div class="flex justify-center gap-6 mt-6">
  <img v-click class="example" src="/figures/intro_chile_ex1.jpg" style="height: 266px" />
  <img v-click class="example" src="/figures/intro_chile_ex2.jpg" style="height: 266px" />
</div>

---

# 1. Introduction - Goal

<v-clicks>

- Develop an automated support system to provide statistical information across large archives and guidance for in-depth searches

</v-clicks>

---

# 1. Introduction - Problem

<v-clicks>

- Where are the redactions?
- How does the surrounding text read?
- What kind of entity does each conceal?

</v-clicks>

---

# Contents

<ContentsList :active="2" />

---
layout: default
---

# 2. Related work

<v-clicks>

- Redaction detection
- Transcription (OCR)
- Redaction classification and de-anonymisation

</v-clicks>

---
layout: default
---

# 2. Related work - Redaction detection

<v-clicks>

- <span class="inline-block w-72">Glyph-position methods</span><span v-click="4">→ only deals with PDF-born documents</span>
- <span class="inline-block w-72">OCR + morphology</span><span v-click="6">→ only detects items darker than text</span>
- <span class="inline-block w-72">Instance-segmentation models</span><span v-click="8">→ trained on documents without degradation</span>

</v-clicks>

<div class="flex justify-center items-center gap-6 mt-6">
  <div v-click="5" class="relative" style="width: 420px">
    <img class="example block w-full" src="/figures/related_pages_ex2.jpg" />
    <div v-click.fade-in="7" class="absolute" style="left: 1%; top: 27.2%; width: 96.5%; height: 40.2%; border: 3px solid #e53935"></div>
  </div>
  <img v-click="9" class="example" src="/figures/related_pages_ex1.jpg" style="width: 420px" />
</div>

---
layout: default
---

# 2. Related work - Transcription

<v-clicks>

- Document-parsing pipelines
- HiT

</v-clicks>

<div class="flex justify-center items-center gap-6 mt-6">
  <img v-click class="example" src="/figures/related_transcription_ex1.png" style="height: 300px" />
  <img v-click class="example" src="/figures/related_transcription_ex2.png" style="height: 300px" />
</div>

---
layout: default
clicks: 5
---

# 2. Related work - Redaction classification

<ul>
  <li v-click="1">Text Anonymization Benchmark</li>
  <li v-click="4">RedactBuster</li>
</ul>

<div class="flex flex-col items-center gap-4 mt-4">
  <div v-click="2" class="example tab-sentence" style="width: 92%">The applicant, <span class="ent green">Dr Royce Darnell</span>, who was born in <span class="ent blue">1929</span>, has been unemployed since the <span class="ent lilac">Trent Regional Health Authority (“the RHA”)</span> terminated his employment as a <span class="ent salmon">consultant microbiologist</span> and <span class="ent salmon">Director</span> of the <span class="ent lilac">Public Health Laboratory</span> in <span class="ent yellow">Derby</span>. This case concerns the length of time that proceedings relating to this dismissal have taken.</div>
  <div v-click="3" class="example tab-sentence" style="width: 92%">The applicant, <span class="ent" :class="$clicks === 5 ? 'green' : 'mint'">*****</span>, who was born in <span class="ent" :class="$clicks === 5 ? 'blue' : 'mint'">*****</span>, has been unemployed since the <span class="ent" :class="$clicks === 5 ? 'lilac' : 'mint'">*****</span> terminated his employment as a <span class="ent" :class="$clicks === 5 ? 'salmon' : 'mint'">*****</span> and <span class="ent" :class="$clicks === 5 ? 'salmon' : 'mint'">*****</span> of the <span class="ent" :class="$clicks === 5 ? 'lilac' : 'mint'">*****</span> in <span class="ent" :class="$clicks === 5 ? 'yellow' : 'mint'">*****</span>. This case concerns the length of time that proceedings relating to this dismissal have taken.</div>
</div>

---

# Contents

<ContentsList :active="3" />

---
transition: zoom-in | zoom-out
clicks: 4
---

<h1 class="zoom-title">3. Method</h1>

<ZoomFigure view="full" next="s1" :step="$clicks" build />

---
transition: zoom-in | zoom-out
---

<h1 class="zoom-title">3. Method<span class="zoom-etapa"> - Stage I: Page analysis</span></h1>

<ZoomFigure view="s1" next="ld" />

---
transition: zoom-out | zoom-in
clicks: 2
---

<h1 class="zoom-title">3. Method - Stage I: Page analysis</h1>

<ZoomFigure view="ld" stage="both" :step="$clicks" />

---
transition: zoom-in | zoom-out
---

<h1 class="zoom-title">3. Method - Stage I: Page analysis</h1>

<ZoomFigure view="s1" next="ocr" prev="ld" />

---
transition: zoom-in | zoom-out
clicks: 2
---

<h1 class="zoom-title">3. Method - Stage I: Page analysis</h1>

<ZoomFigure view="ocr" next="ocrtext" stage="before" :step="$clicks" />

---
transition: zoom-out | zoom-in
clicks: 1
---

<h1 class="zoom-title">3. Method - Stage I: Page analysis</h1>

<ZoomFigure view="ocrtext" stage="after" :step="$clicks" />

---
transition: zoom-in | zoom-out
---

<h1 class="zoom-title">3. Method - Stage I: Page analysis</h1>

<ZoomFigure view="s1" next="rd" prev="ocrtext" />

---
transition: zoom-out | zoom-in
clicks: 2
---

<h1 class="zoom-title">3. Method - Stage I: Page analysis</h1>

<ZoomFigure view="rd" stage="both" :step="$clicks" />

---
transition: zoom-in | zoom-out
---

<h1 class="zoom-title">3. Method - Stage I: Page analysis</h1>

<ZoomFigure view="s1" next="lm" prev="rd" />

---
transition: zoom-out | zoom-in
clicks: 4
---

<h1 class="zoom-title">3. Method - Stage I: Page analysis</h1>

<ZoomFigure view="lm" stage="both" :step="$clicks" />

---
transition: zoom-out | zoom-in
---

<h1 class="zoom-title">3. Method<span class="zoom-etapa"> - Stage I: Page analysis</span></h1>

<ZoomFigure view="s1" prev="lm" />

---
transition: zoom-in | zoom-out
---

<h1 class="zoom-title">3. Method</h1>

<ZoomFigure view="full" next="s2" prev="s1" />

---
transition: zoom-in | zoom-out
---

<h1 class="zoom-title">3. Method<span class="zoom-etapa"> - Stage II: Entity assembly</span></h1>

<ZoomFigure view="s2" next="st1" />

---
transition: zoom-in | zoom-out
clicks: 3
---

<h1 class="zoom-title">3. Method - Stage II: Entity assembly</h1>

<ZoomFigure view="st1" next="st2" stage="before" :step="$clicks" />

---
transition: zoom-in | zoom-out
clicks: 1
---

<h1 class="zoom-title">3. Method - Stage II: Entity assembly</h1>

<ZoomFigure view="st2" next="st3" :step="$clicks + 3" />

---
transition: zoom-out | zoom-in
clicks: 3
---

<h1 class="zoom-title">3. Method - Stage II: Entity assembly</h1>

<ZoomFigure view="st3" stage="after" :step="$clicks + 4" />

---
transition: zoom-out | zoom-in
---

<h1 class="zoom-title">3. Method<span class="zoom-etapa"> - Stage II: Entity assembly</span></h1>

<ZoomFigure view="s2" prev="st3" />

---
transition: zoom-in | zoom-out
---

<h1 class="zoom-title">3. Method</h1>

<ZoomFigure view="full" next="s3" prev="s2" />

---
transition: zoom-in | zoom-out
---

<h1 class="zoom-title">3. Method<span class="zoom-etapa"> - Stage III: Entity typing</span></h1>

<ZoomFigure view="s3" next="st4" />

---
transition: zoom-in | zoom-out
clicks: 5
---

<h1 class="zoom-title">3. Method - Stage III: Entity typing</h1>

<ZoomFigure view="st4" next="st5" stage="before" :step="$clicks" />

---
transition: zoom-out | zoom-in
clicks: 3
---

<h1 class="zoom-title">3. Method - Stage III: Entity typing</h1>

<ZoomFigure view="st5" stage="after" :step="$clicks + 5" />

---

<h1 class="zoom-title">3. Method</h1>

<ZoomFigure view="full" prev="st5" />

---

# Contents

<ContentsList :active="4" />

---
layout: default
---

# 4. Experiments

<v-clicks>

- Redaction detection
- Entity-type classification

</v-clicks>

---
layout: default
transition: zoom-in | zoom-out
---

<h1 class="zoom-title">4. Experiments - Redaction detection</h1>

<ZoomFigure view="full" next="s1" />

---
layout: default
clicks: 1
---

<h1 class="zoom-title">4. Experiments - Redaction detection</h1>

<ZoomFigure view="s1" ask="rd" :step="$clicks" />

---
layout: default
---

# 4. Experiments - Redaction detection

<h2 v-click class="subtitle">Data</h2>

<div class="ml-8">

<v-clicks>

- Chile Project collection
- van Heusden collection
- Redaction Detection Benchmark

</v-clicks>

</div>

---
layout: default
---

# 4. Experiments - Redaction detection

<h2 class="subtitle">Data - Chile Project collection</h2>

<div class="mt-4 w-3/4 mx-auto">

<table>
  <thead>
    <tr>
      <th class="text-left">Statistic</th>
      <th class="text-left">Value</th>
    </tr>
  </thead>
  <tbody>
    <tr v-click><td>Source</td><td>Chile Declassification Project (U.S. Department of State, 1999–2000)</td></tr>
    <tr v-click><td>Documents</td><td>Diplomatic telegrams, internal memoranda and interviews with Chilean political figures</td></tr>
    <tr v-click><td>Languages</td><td>Spanish and English</td></tr>
    <tr v-click><td>Pages</td><td>1,500 annotated</td></tr>
    <tr v-click><td>Redactions</td><td>3,452 (~2.3 per page)</td></tr>
  </tbody>
</table>

</div>

---
layout: default
---

# 4. Experiments - Redaction detection

<h2 class="subtitle">Data - Chile Project collection</h2>

<div class="flex justify-center gap-6 mt-6">
  <img v-click class="example" src="/figures/foia_chile_ex1.jpg" style="height: 262px" />
  <img v-click class="example" src="/figures/foia_chile_ex2.jpg" style="height: 262px" />
</div>

---
layout: default
---

# 4. Experiments - Redaction detection

<h2 class="subtitle">Data - Chile Project collection</h2>

<div class="flex justify-center gap-6 mt-6">
  <img v-click class="example" src="/figures/foia_chile_ex3.jpg" style="height: 262px" />
  <img v-click class="example" src="/figures/foia_chile_ex4.jpg" style="height: 262px" />
</div>

---
layout: default
---

# 4. Experiments - Redaction detection

<h2 class="subtitle">Data - Chile Project collection</h2>

<div class="mt-4 w-1/2 mx-auto">

| Redaction type | Redactions |
|:--|--:|
| black | 2,612 |
| border | 840 |

| Split (pages) | Train | Test |
|:--|--:|--:|
| Annotated pages | 1,050 | 450 |

</div>

---
layout: default
---

# 4. Experiments - Redaction detection

<h2 class="subtitle">Data - van Heusden collection</h2>

<div class="mt-4 w-3/4 mx-auto">

<table>
  <thead>
    <tr>
      <th class="text-left">Statistic</th>
      <th class="text-left">Value</th>
    </tr>
  </thead>
  <tbody>
    <tr v-click><td>Source</td><td>Emails and presentations released by the Dutch government (Woo)</td></tr>
    <tr v-click><td>Language</td><td>Dutch</td></tr>
    <tr v-click><td>Pages</td><td>1,464</td></tr>
    <tr v-click><td>Redactions</td><td>11,351 (~7.8 per page)</td></tr>
  </tbody>
</table>

</div>

---
layout: default
---

# 4. Experiments - Redaction detection

<h2 class="subtitle">Data - van Heusden collection</h2>

<div class="flex justify-center gap-6 mt-6">
  <img v-click class="example" src="/figures/foia_dutch_ex1.png" style="height: 270px" />
  <img v-click class="example" src="/figures/foia_dutch_ex2.png" style="height: 270px" />
</div>

---
layout: default
---

# 4. Experiments - Redaction detection

<h2 class="subtitle">Data - van Heusden collection</h2>

<div class="flex justify-center gap-6 mt-6">
  <img v-click class="example" src="/figures/foia_dutch_ex3.png" style="height: 270px" />
  <img v-click class="example" src="/figures/foia_dutch_ex4.png" style="height: 270px" />
</div>

---
layout: default
---

# 4. Experiments - Redaction detection

<h2 class="subtitle">Data - van Heusden collection</h2>

<div class="mt-4 w-1/2 mx-auto">

| Redaction type | Redactions |
|:--|--:|
| black | 3,914 |
| border | 2,535 |
| colour | 1,660 |
| grey | 3,242 |

| Split (pages) | Train | Test |
|:--|--:|--:|
| `classic` (at least one redaction) | 664 | 284 |
| `extended` (all annotated pages) | 1,025 | 439 |

</div>

---
layout: default
---

# 4. Experiments - Redaction detection

<h2 class="subtitle">Data - Redaction Detection Benchmark</h2>

<div class="mt-4 w-3/4 mx-auto">

<table>
  <thead>
    <tr>
      <th class="text-left">Statistic</th>
      <th class="text-left">Value</th>
    </tr>
  </thead>
  <tbody>
    <tr v-click><td>Sources</td><td>Chile Project, van Heusden, Epstein</td></tr>
    <tr v-click><td>Pages</td><td>3,484</td></tr>
    <tr v-click><td>Redactions</td><td>19,607</td></tr>
    <tr v-click><td>Mean</td><td>7.9 redactions per page</td></tr>
    <tr v-click><td>Median</td><td>4 redactions per page</td></tr>
    <tr v-click><td>Maximum</td><td>97 redactions per page</td></tr>
    <tr v-click><td>Classes</td><td>7 source-specific, regrouped into 4 types</td></tr>
  </tbody>
</table>

</div>

---
layout: default
---

# 4. Experiments - Redaction detection

<h2 class="subtitle">Data - Redaction Detection Benchmark</h2>

<div class="flex justify-center gap-6 mt-6">
  <img v-click class="example" src="/figures/epstein_page_ex1.png" style="height: 262px" />
  <img v-click class="example" src="/figures/epstein_page_ex2.png" style="height: 262px" />
</div>

---
layout: default
---

# 4. Experiments - Redaction detection

<h2 class="subtitle">Data - Redaction Detection Benchmark</h2>

<div class="flex justify-center gap-6 mt-6">
  <img v-click class="example" src="/figures/epstein_page_ex3.png" style="height: 262px" />
  <img v-click class="example" src="/figures/epstein_page_ex4.png" style="height: 262px" />
</div>

---
layout: default
---

# 4. Experiments - Redaction detection

<h2 class="subtitle">Data - Redaction Detection Benchmark</h2>

<div class="mt-4 w-1/2 mx-auto">

| Redaction type | Redactions |
|:--|--:|
| black | 11,330 |
| border | 3,375 |
| grey | 3,242 |
| colour | 1,660 |
| Total | 19,607 |

</div>

---
layout: default
---

# 4. Experiments - Redaction detection

<h2 class="subtitle">Models</h2>

<div class="mt-4 w-3/4 mx-auto">

<table>
  <thead>
    <tr>
      <th class="text-left">Model</th>
      <th class="text-left">Backbone</th>
      <th class="text-left">Family</th>
      <th class="!text-right">Params (M)</th>
    </tr>
  </thead>
  <tbody>
    <tr v-click="1"><td>Mask R-CNN</td><td>X101-FPN</td><td>Segmentation</td><td class="text-right">107.4</td></tr>
    <tr v-click="1"><td>Mask2Former</td><td>Swin-T</td><td>Segmentation</td><td class="text-right">47.4</td></tr>
    <tr v-click="2"><td>YOLO26-Small</td><td>—</td><td>Detection</td><td class="text-right">10.0</td></tr>
    <tr v-click="2"><td>RT-DETRv2</td><td>R18</td><td>Detection</td><td class="text-right">20.1</td></tr>
    <tr v-click="2"><td>RF-DETR (Large)</td><td>DINOv2-S (windowed)</td><td>Detection</td><td class="text-right">33.6</td></tr>
    <tr v-click="2"><td>RTMDet-X</td><td>CSPNeXt</td><td>Detection</td><td class="text-right">102.3</td></tr>
    <tr v-click="3"><td>YOLO26-Small-Seg</td><td>—</td><td>Mixed</td><td class="text-right">11.4</td></tr>
  </tbody>
</table>

</div>

---
layout: default
---

# 4. Experiments - Redaction detection

<h2 class="subtitle">Training protocol</h2>

<div class="ml-8">

<v-clicks>

- One benchmark harness for all frameworks: training, prediction and evaluation run identically
- Multi-class training: each detector also predicts the redaction type (2 types on Chile, 4 on van Heusden and the RDB)

</v-clicks>

</div>

---
layout: default
---

# 4. Experiments - Redaction detection

<h2 class="subtitle">Evaluation protocol</h2>

<div class="ml-8">

<v-clicks>

- True positive: IoU with a ground-truth box above 0.5 and the correct type
- Predictions matched at a confidence threshold of 0.5
- Precision, recall and F1 pooled over all redactions on the test pages

</v-clicks>

</div>

---
layout: default
---

# 4. Experiments - Redaction detection

<h2 class="subtitle">Reproducing van Heusden et al.</h2>

<div class="mt-6 w-3/4 mx-auto">

<table>
  <thead>
    <tr>
      <th rowspan="2" class="text-left">Split</th>
      <th rowspan="2" class="text-left">Model</th>
      <th colspan="2" class="!text-center">Their protocol (localisation-only)</th>
      <th v-click="1" class="!text-center">Our protocol</th>
    </tr>
    <tr>
      <th class="!text-center">Published F1</th>
      <th class="!text-center">Reproduced F1</th>
      <th v-click="1" class="!text-center">Class-aware F1</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td rowspan="2">Classic</td>
      <td>Mask R-CNN</td>
      <td class="text-center">0.95</td>
      <td class="text-center">0.942</td>
      <td v-click="1" class="text-center">0.822</td>
    </tr>
    <tr>
      <td>Mask2Former</td>
      <td class="text-center">0.93</td>
      <td class="text-center">0.944</td>
      <td v-click="1" class="text-center">0.822</td>
    </tr>
    <tr>
      <td rowspan="2">Extended</td>
      <td>Mask R-CNN</td>
      <td class="text-center">0.91</td>
      <td class="text-center">0.931</td>
      <td v-click="1" class="text-center">0.816</td>
    </tr>
    <tr>
      <td>Mask2Former</td>
      <td class="text-center">0.89</td>
      <td class="text-center">0.947</td>
      <td v-click="1" class="text-center">0.807</td>
    </tr>
  </tbody>
</table>

</div>

---
layout: default
---

# 4. Experiments - Redaction detection

<h2 class="subtitle">Results - van Heusden collection (extended)</h2>

<div class="mt-6 w-1/2 mx-auto">

<table>
  <thead>
    <tr>
      <th rowspan="2" class="text-left">Model</th>
      <th colspan="3" class="!text-center">Extended</th>
    </tr>
    <tr>
      <th v-click="1" class="!text-center">F1</th>
      <th v-click="2" class="!text-center">Pr</th>
      <th v-click="3" class="!text-center">Re</th>
    </tr>
  </thead>
  <tbody class="text-center">
    <tr><td class="text-left">RT-DETRv2 (R18)</td><td v-click="1"><b>0.936</b></td><td v-click="2">0.953</td><td v-click="3"><b>0.921</b></td></tr>
    <tr><td class="text-left">YOLO26-Small</td><td v-click="1">0.934</td><td v-click="2"><b>0.971</b></td><td v-click="3">0.900</td></tr>
    <tr><td class="text-left">RTMDet-X</td><td v-click="1">0.924</td><td v-click="2">0.964</td><td v-click="3">0.887</td></tr>
    <tr><td class="text-left">YOLO26-Small-Seg</td><td v-click="1">0.923</td><td v-click="2">0.966</td><td v-click="3">0.883</td></tr>
    <tr><td class="text-left">RF-DETR (Large)</td><td v-click="1">0.920</td><td v-click="2">0.948</td><td v-click="3">0.893</td></tr>
    <tr><td class="text-left">Mask R-CNN (X101-FPN)</td><td v-click="1">0.816</td><td v-click="2">0.852</td><td v-click="3">0.782</td></tr>
    <tr><td class="text-left">Mask2Former (Swin-T)</td><td v-click="1">0.807</td><td v-click="2">0.816</td><td v-click="3">0.799</td></tr>
  </tbody>
</table>

</div>

---
layout: default
---

# 4. Experiments - Redaction detection

<h2 class="subtitle">Results - Chile Project collection</h2>

<div class="mt-6 w-1/2 mx-auto">

| Model | F1 | Pr | Re |
|:--|:-:|:-:|:-:|
| RTMDet-X | **0.943** | **0.990** | 0.900 |
| YOLO26-Small | 0.939 | 0.982 | 0.899 |
| RF-DETR (Large) | 0.936 | 0.983 | 0.893 |
| RT-DETRv2 (R18) | 0.929 | 0.976 | 0.886 |
| Mask2Former (Swin-T) | 0.929 | 0.969 | 0.893 |
| YOLO26-Small-Seg | 0.928 | 0.982 | 0.879 |
| Mask R-CNN (X101-FPN) | 0.925 | 0.920 | **0.931** |

</div>

---
layout: default
---

# 4. Experiments - Redaction detection

<h2 class="subtitle">Results - Redaction Detection Benchmark</h2>

<div class="mt-6 w-1/2 mx-auto">

| Model | F1 | Pr | Re |
|:--|:-:|:-:|:-:|
| RT-DETRv2 (R18) | **0.949** | 0.952 | **0.946** |
| YOLO26-Small | 0.947 | 0.970 | 0.925 |
| RF-DETR (Large) | 0.937 | 0.964 | 0.911 |
| YOLO26-Small-Seg | 0.931 | **0.972** | 0.894 |
| RTMDet-X | 0.931 | 0.967 | 0.898 |
| Mask2Former (Swin-T) | 0.871 | 0.878 | 0.864 |
| Mask R-CNN (X101-FPN) | 0.851 | 0.867 | 0.836 |

</div>

---
layout: default
transition: zoom-out | zoom-in
clicks: 1
---

<h1 class="zoom-title">4. Experiments - Redaction detection</h1>

<ZoomFigure view="s1" ask="rd" :answer="['RT-DETRv2']" :step="$clicks + 1" />

---
layout: default
transition: subsection
---

<h1 class="zoom-title"><span class="swap-prefix">4. Experiments</span><span class="swap-sub"> - Redaction detection</span></h1>

<ZoomFigure view="full" prev="s1" ask="rd" :answer="['RT-DETRv2']" :step="2" />

---
layout: default
transition: zoom-in | zoom-out
---

<h1 class="zoom-title"><span class="swap-prefix">4. Experiments</span><span class="swap-sub"> - Entity-type classification</span></h1>

<ZoomFigure view="full" next="s3" ask="rd" :answer="['RT-DETRv2']" :step="3" />

---
layout: default
clicks: 1
---

<h1 class="zoom-title">4. Experiments - Entity-type classification</h1>

<ZoomFigure view="s3" ask="cl" :step="$clicks" />

---
layout: default
---

# 4. Experiments - Entity-type classification

<h2 class="subtitle">Data - Text Anonymization Benchmark (TAB)</h2>

<div class="mt-4 w-3/4 mx-auto">

<table>
  <thead>
    <tr>
      <th class="text-left">Statistic</th>
      <th class="text-left">Value</th>
    </tr>
  </thead>
  <tbody>
    <tr v-click><td>Source</td><td>European Court of Human Rights cases, 1975–2017</td></tr>
    <tr v-click><td>Cases</td><td>1,268</td></tr>
    <tr v-click><td>Annotation</td><td>Twelve students at the University of Oslo, with multiple annotators per document</td></tr>
    <tr v-click><td>Classes</td><td>8 entity classes</td></tr>
  </tbody>
</table>

</div>

---
layout: default
---

# 4. Experiments - Entity-type classification

<h2 class="subtitle">Data - Text Anonymization Benchmark (TAB)</h2>

<div class="flex flex-col items-center gap-6 mt-8">
  <div v-click class="example tab-sentence" style="width: 92%">The applicant, <span class="ent green">Dr Royce Darnell</span>, who was born in <span class="ent blue">1929</span>, has been unemployed since the <span class="ent lilac">Trent Regional Health Authority (“the RHA”)</span> terminated his employment as a <span class="ent salmon">consultant microbiologist</span> and <span class="ent salmon">Director</span> of the <span class="ent lilac">Public Health Laboratory</span> in <span class="ent yellow">Derby</span>. This case concerns the length of time that proceedings relating to this dismissal have taken.</div>
  <div v-click class="example tab-sentence" style="width: 92%">The applicant, <span class="ent mint">*****</span>, who was born in <span class="ent mint">*****</span>, has been unemployed since the <span class="ent mint">*****</span> terminated his employment as a <span class="ent mint">*****</span> and <span class="ent mint">*****</span> of the <span class="ent mint">*****</span> in <span class="ent mint">*****</span>. This case concerns the length of time that proceedings relating to this dismissal have taken.</div>
</div>

---
layout: default
---

# 4. Experiments - Entity-type classification

<h2 class="subtitle">Data - Text Anonymization Benchmark (TAB)</h2>

<div class="mt-4 w-1/2 mx-auto">

| Entity class | Share |
|:--|--:|
| DATETIME | 34.6% |
| ORG | 26.3% |
| PERSON | 15.7% |
| LOC | 6.4% |
| DEM | 5.6% |
| MISC | 4.5% |
| CODE | 4.2% |
| QUANTITY | 2.7% |
| Total | 100.0% |

</div>

---
layout: default
---

# 4. Experiments - Entity-type classification

<h2 class="subtitle">Models</h2>

<div class="mt-4 w-11/12 mx-auto">

<table>
  <thead>
    <tr>
      <th class="text-left">Model</th>
      <th class="text-left">Family</th>
      <th class="text-left">Input</th>
    </tr>
  </thead>
  <tbody>
    <tr v-click="1"><td>Random Forest</td><td>Classical</td><td>SBERT embeddings</td></tr>
    <tr v-click="1"><td>Gradient Boosting</td><td>Classical</td><td>SBERT embeddings</td></tr>
    <tr v-click="1"><td>SVM (RBF)</td><td>Classical</td><td>SBERT embeddings</td></tr>
    <tr v-click="1"><td>SVM (polynomial)</td><td>Classical</td><td>SBERT embeddings</td></tr>
    <tr v-click="2"><td>DNN</td><td>Deep Learning</td><td>SBERT embeddings</td></tr>
    <tr v-click="2"><td>CNN</td><td>Deep Learning</td><td>SBERT embeddings</td></tr>
    <tr v-click="3"><td>GPT-OSS-120B</td><td>LLM</td><td>Zero-/few-shot prompt (MXFP4)</td></tr>
    <tr v-click="3"><td>DeepSeek-R1-Distill-Llama-70B</td><td>LLM</td><td>Zero-/few-shot prompt (Q4_K_M)</td></tr>
    <tr v-click="3"><td>GPT-OSS-20B</td><td>LLM</td><td>Zero-/few-shot prompt (MXFP4)</td></tr>
  </tbody>
</table>

</div>

---
layout: default
---

# 4. Experiments - Entity-type classification

<h2 class="subtitle">Training protocol</h2>

<div class="ml-8">

<v-clicks>

- Target marking: all entities masked as `*****`, the one to classify wrapped in `<TGT>`
- Isolated split by sentence: 65% train, 10% validation, 10% fine-tuning, 15% test
- Classifiers train on SBERT embeddings
- LLMs are prompted with the eight classes

</v-clicks>

</div>

---
layout: default
---

# 4. Experiments - Entity-type classification

<h2 class="subtitle">Training protocol</h2>

<div class="flex justify-center mt-6">
  <div class="relative" style="width: 364px; height: 310px">
    <img v-click.fade-in="1" class="absolute inset-0 h-full" src="/figures/redactbuster_split_left_1.png" />
    <img v-click.fade-in="2" class="absolute inset-0 h-full" src="/figures/redactbuster_split_left_2.png" />
    <img v-click.fade-in="3" class="absolute inset-0 h-full" src="/figures/redactbuster_split_left_3.png" />
  </div>
  <div class="relative" style="width: 497px; height: 310px">
    <img v-click.fade-in="4" class="absolute inset-0 h-full" src="/figures/redactbuster_split_right_1.png" />
    <img v-click.fade-in="5" class="absolute inset-0 h-full" src="/figures/redactbuster_split_right_2.png" />
    <img v-click.fade-in="6" class="absolute inset-0 h-full" src="/figures/redactbuster_split_right_3.png" />
    <img v-click.fade-in="7" class="absolute inset-0 h-full" src="/figures/redactbuster_split_right_4.png" />
  </div>
</div>

---
layout: default
---

# 4. Experiments - Entity-type classification

<h2 class="subtitle">Reproducing RedactBuster</h2>

<div class="mt-6 w-3/4 mx-auto">

<table>
  <thead>
    <tr>
      <th rowspan="2" class="text-left">Model</th>
      <th v-click="1" colspan="2" class="!text-center">Their protocol (controlled split)</th>
      <th v-click="4" class="!text-center">Our protocol</th>
    </tr>
    <tr>
      <th v-click="1" class="!text-center">Reported</th>
      <th v-click="2" class="!text-center">Reproduced</th>
      <th v-click="4" class="!text-center">Accuracy</th>
    </tr>
  </thead>
  <tbody class="text-center">
    <tr><td class="text-left">Random Forest</td><td v-click="1">0.823</td><td v-click="2">0.823</td><td v-click="4">0.510</td></tr>
    <tr><td class="text-left">Gradient Boosting</td><td v-click="1">0.866</td><td v-click="2">0.857</td><td v-click="4">0.505</td></tr>
    <tr><td class="text-left">SVM (RBF)</td><td v-click="1">0.840</td><td v-click="2">0.850</td><td v-click="4">0.611</td></tr>
    <tr><td class="text-left">SVM (polynomial)</td><td v-click="1">—</td><td v-click="2">0.855</td><td v-click="4">0.614</td></tr>
    <tr><td class="text-left">DNN</td><td v-click="1" :class="{ 'fr-tl': $clicks === 3 }">0.945</td><td v-click="2" :class="{ 'fr-tr': $clicks === 3 }">0.822</td><td v-click="4">0.558</td></tr>
    <tr><td class="text-left">CNN</td><td v-click="1" :class="{ 'fr-bl': $clicks === 3 }">0.985</td><td v-click="2" :class="{ 'fr-br': $clicks === 3 }">0.798</td><td v-click="4">0.464</td></tr>
  </tbody>
</table>

</div>

---
layout: default
---

# 4. Experiments - Entity-type classification

<h2 class="subtitle">Results - Classifiers on SBERT embeddings</h2>

<div class="mt-6 w-1/2 mx-auto">

| Model | Accuracy |
|:--|:-:|
| SVM (polynomial) | **0.614** |
| SVM (RBF) | 0.611 |
| DNN | 0.558 |
| Random Forest | 0.510 |
| Gradient Boosting | 0.505 |
| CNN | 0.464 |

</div>

---
layout: default
---

# 4. Experiments - Entity-type classification

<h2 class="subtitle">Results - Open LLMs</h2>

<div class="mt-6 w-3/4 mx-auto">

| Model | Zero-shot | Few-shot |
|:--|:-:|:-:|
| GPT-OSS-120B | 0.681 | **0.705** |
| DeepSeek-R1-Distill-Llama-70B | 0.648 | 0.658 |
| GPT-OSS-20B | 0.628 | 0.654 |

</div>

---
layout: default
transition: zoom-out | zoom-in
clicks: 1
---

<h1 class="zoom-title">4. Experiments - Entity-type classification</h1>

<ZoomFigure view="s3" ask="cl" :answer="['GPT-OSS', '120B']" :step="$clicks + 1" />

---
layout: default
---

<h1 class="zoom-title">4. Experiments - Entity-type classification</h1>

<ZoomFigure view="full" prev="s3" ask="cl" :answer="['GPT-OSS', '120B']" :step="2" :settled="{ rd: ['RT-DETRv2'] }" />

---

# Contents

<ContentsList :active="5" />

---
layout: default
---

# 5. Case study

<h2 class="subtitle">Data - Court record Rol 1-73</h2>

<div class="mt-4 w-5/6 mx-auto">

<table>
  <thead>
    <tr>
      <th class="text-left">Statistic</th>
      <th class="text-left">Value</th>
    </tr>
  </thead>
  <tbody>
    <tr v-click><td>Document</td><td>Judgment of a military tribunal (Consejo de Guerra), Causa Rol N° 1-73, 30 July 1974</td></tr>
    <tr v-click><td>Pages</td><td>259 scanned pages, typewritten Spanish with stamps, marginal annotations and folio numbers</td></tr>
    <tr v-click><td>Source</td><td>Archivo Histórico de la Fuerza Aérea, obtained under Ley N° 20.285 (information request of 11 March 2024)</td></tr>
    <tr v-click><td>Redactions</td><td>Black ink, from single words to a block covering almost the whole opening page</td></tr>
    <tr v-click><td>Reference</td><td>Unredacted copy from the AGHMINREL archive, incomplete: several closing pages are missing</td></tr>
  </tbody>
</table>

</div>

---
layout: default
---

# 5. Case study

<h2 class="subtitle">Data - Court record Rol 1-73</h2>

<div class="flex justify-center gap-6 mt-3">
  <div v-click class="example overflow-hidden" style="width: 420px; aspect-ratio: 900 / 720">
    <img class="block w-full" src="/figures/lawsuit_ex1.png" />
  </div>
  <div v-click class="example overflow-hidden" style="width: 420px; aspect-ratio: 900 / 720">
    <img class="block w-full" src="/figures/lawsuit_ex2.png" />
  </div>
</div>

---
layout: default
---

# 5. Case study

<h2 class="subtitle">Data - Court record Rol 1-73</h2>

<div class="flex justify-center gap-6 mt-3">
  <div v-click class="example overflow-hidden" style="width: 420px; aspect-ratio: 900 / 720">
    <img class="block w-full" src="/figures/lawsuit_ex4.png" />
  </div>
  <div v-click class="example overflow-hidden" style="width: 420px; aspect-ratio: 900 / 720">
    <img class="block w-full" src="/figures/lawsuit_ex3.png" />
  </div>
</div>

---
layout: default
clicks: 5
---

# 5. Case study - Pipeline configuration

<ZoomFigure view="full" :settled="{ ld: ['MinerU'], ocr: ['HiT'], rd: ['RT-DETRv2'], cl: ['GPT-OSS', '120B'] }" :frames="['ld', 'ocr', 'rd', 'cl']" :step="$clicks" />

<div class="ml-8 mt-0">

<v-click at="5">

- The evaluation protocol carries over unchanged from the experiments

</v-click>

</div>

---
layout: default
---

# 5. Case study

<h2 class="subtitle">Results - Document level</h2>

<div class="mt-4 w-5/6 mx-auto">

<table>
  <thead>
    <tr>
      <th class="text-left">Statistic</th>
      <th class="text-left">Value</th>
    </tr>
  </thead>
  <tbody>
    <tr v-click><td>Pages with detections</td><td>180 of 259 (69.5%)</td></tr>
    <tr v-click><td>Redaction boxes</td><td>888</td></tr>
    <tr v-click><td>Entities after grouping</td><td>645</td></tr>
    <tr v-click><td>Entity types predicted</td><td>488</td></tr>
  </tbody>
</table>

</div>

---
layout: default
---

# 5. Case study

<h2 class="subtitle">Results - Redactions per page</h2>

<img src="/figures/case_density.png" class="mx-auto mt-6" style="width: 90%" />

---
layout: default
---

# 5. Case study

<h2 class="subtitle">Results - Predicted classes</h2>

<div class="mt-4 w-1/2 mx-auto">

| Predicted class | Count | Share |
|:--|:-:|:-:|
| CODE | 149 | 30.5% |
| MISC | 139 | 28.5% |
| DEM | 68 | 13.9% |
| PERSON | 56 | 11.5% |
| ORG | 47 | 9.6% |
| QUANTITY | 22 | 4.5% |
| LOC | 5 | 1.0% |
| DATETIME | 2 | 0.4% |

</div>

---
layout: default
---

# 5. Case study

<h2 class="subtitle">Results - End-to-end</h2>

<div class="mt-6 w-11/12 mx-auto">

<table>
  <thead>
    <tr>
      <th class="text-left">Module</th>
      <th class="text-left">Metric</th>
      <th class="!text-center">Result</th>
      <th class="text-left">Detail</th>
    </tr>
  </thead>
  <tbody>
    <tr v-click><td>Redaction detection</td><td>Precision / recall / F1</td><td class="text-center whitespace-nowrap">0.985</td><td>267 of 271 boxes matched, mean IoU 0.788</td></tr>
    <tr v-click><td>Transcription</td><td>CER / WER</td><td class="text-center whitespace-nowrap">0.034 / 0.146</td><td>Median page CER 0.022</td></tr>
    <tr v-click><td>Entity-type classification</td><td>Accuracy</td><td class="text-center whitespace-nowrap">0.512</td><td>83 of 162 matched entities</td></tr>
  </tbody>
</table>

</div>

---
layout: default
---

# 5. Case study

<h2 class="subtitle">Results - Transcription</h2>

<div class="mt-4 w-1/2 mx-auto">

<table>
  <thead>
    <tr>
      <th class="text-left">Metric</th>
      <th v-click="1" class="!text-center">PaddleOCR</th>
      <th v-click="2" class="!text-center">HiT</th>
    </tr>
  </thead>
  <tbody class="text-center">
    <tr><td class="text-left">Simple similarity ↑</td><td v-click="1">0.697</td><td v-click="2" class="font-bold">0.891</td></tr>
    <tr><td class="text-left">ROUGE-1 ↑</td><td v-click="1">0.774</td><td v-click="2" class="font-bold">0.899</td></tr>
    <tr><td class="text-left">ROUGE-2 ↑</td><td v-click="1">0.628</td><td v-click="2" class="font-bold">0.833</td></tr>
    <tr><td class="text-left">ROUGE-L ↑</td><td v-click="1">0.772</td><td v-click="2" class="font-bold">0.897</td></tr>
    <tr><td class="text-left">BLEU ↑</td><td v-click="1">0.558</td><td v-click="2" class="font-bold">0.792</td></tr>
    <tr><td class="text-left">WER ↓</td><td v-click="1">0.303</td><td v-click="2" class="font-bold">0.146</td></tr>
    <tr><td class="text-left">CER ↓</td><td v-click="1">0.064</td><td v-click="2" class="font-bold">0.034</td></tr>
  </tbody>
</table>

</div>

---
layout: default
clicks: 5
---

# 5. Case study

<h2 class="subtitle">Results - Classification per class</h2>

<div class="mt-4 w-2/3 mx-auto">

<table>
  <thead>
    <tr>
      <th class="text-left">Class</th>
      <th v-click="1" class="!text-center">Reference</th>
      <th v-click="2" class="!text-center">Correct</th>
      <th v-click="3" class="!text-center">Recall</th>
    </tr>
  </thead>
  <tbody class="text-center">
    <tr><td class="text-left">DEM</td><td v-click="1">61</td><td v-click="2">30</td><td v-click="3">0.492</td></tr>
    <tr><td class="text-left">ORG</td><td v-click="1">49</td><td v-click="2">20</td><td v-click="3">0.408</td></tr>
    <tr :class="{ hl: $clicks === 5 }"><td class="text-left">MISC</td><td v-click="1">21</td><td v-click="2">7</td><td v-click="3">0.333</td></tr>
    <tr><td class="text-left">PERSON</td><td v-click="1">12</td><td v-click="2">7</td><td v-click="3">0.583</td></tr>
    <tr :class="{ hl: $clicks === 4 }"><td class="text-left">CODE</td><td v-click="1">10</td><td v-click="2">10</td><td v-click="3">1.000</td></tr>
    <tr :class="{ hl: $clicks === 4 }"><td class="text-left">PARAGRAPH</td><td v-click="1">9</td><td v-click="2">9</td><td v-click="3">1.000</td></tr>
    <tr><td class="text-left">Total</td><td v-click="1">162</td><td v-click="2">83</td><td v-click="3">0.512</td></tr>
  </tbody>
</table>

</div>

---

# Contents

<ContentsList :active="6" />

---
layout: default
---

# 6. Discussion

<h2 class="subtitle">Limitations</h2>

<div class="ml-8">

<v-clicks>

- Sentence segmentation degrades
- Transcription errors reach the classifier
- Not every black region is ink

</v-clicks>

</div>

<div class="flex justify-center mt-4">
  <div class="relative">
    <img v-click="3" class="example block" src="/figures/limitations_detection_bottom.jpg" style="height: 270px" />
    <div v-click="4" class="absolute flex items-center" style="left: 100%; top: 85%; width: 90px; margin-left: 8px; transform: translateY(-50%)">
      <div style="border-right: 22px solid #e53935; border-top: 11px solid transparent; border-bottom: 11px solid transparent"></div>
      <div style="flex: 1; height: 5px; background: #e53935"></div>
    </div>
  </div>
</div>

---
layout: default
---

# 6. Discussion

<h2 class="subtitle">Limitations</h2>

<div class="ml-8">

<v-clicks>

- The entity type is the weakest layer
- Redaction is an act of judgement, and it is not uniform
- The eight classes do not cut real redactions at their joints: a descriptive phrase concealed mid-sentence can answer to more than one label, while the score admits only one

</v-clicks>

</div>

---
layout: default
---

# 6. Discussion

<h2 class="subtitle">Limitations</h2>

<div class="flex justify-center mt-4">
  <img class="example" src="/figures/intro_court_ex2.jpg" style="height: 340px" />
</div>

---
layout: default
---

# 6. Discussion

<h2 class="subtitle">Future work</h2>

<div class="ml-8">

<v-clicks>

- Creating a more general class system, better suited to FOIA documents
- Studying the compounded error of the three stages

</v-clicks>

</div>

---
layout: default
---

# 6. Discussion

<h2 class="subtitle">Future work</h2>

<ZoomFigure view="full" />

---
layout: default
---

# 6. Discussion

<h2 class="subtitle">Future work</h2>

<div class="ml-8">

<ul>
  <li>Creating a more general class system, better suited to FOIA documents</li>
  <li>Studying the compounded error of the three stages</li>
  <li v-click>Developing a method of achieving the classification results with lighter models</li>
</ul>

</div>

---

# Contents

<ContentsList :active="7" />

---
layout: default
---

# 7. Conclusion

<h2 class="subtitle">The three answers</h2>

<div class="mt-6 w-11/12 mx-auto">

<table>
  <thead>
    <tr>
      <th class="text-left">Question about a redacted page</th>
      <th class="!text-center">Module</th>
      <th class="!text-center">On the case-study record</th>
    </tr>
  </thead>
  <tbody class="text-center">
    <tr v-click><td class="text-left">Where are the redactions?</td><td>Detection</td><td>162 of 163 annotated entities recovered</td></tr>
    <tr v-click><td class="text-left">How does the surrounding text read?</td><td>Transcription</td><td>Character error rate 0.034</td></tr>
    <tr v-click><td class="text-left">What kind of entity does each conceal?</td><td>Entity-type classification</td><td>Accuracy 0.512</td></tr>
  </tbody>
</table>

</div>

---
layout: default
---

# 7. Conclusion

<h2 class="subtitle">Contributions</h2>

<div class="ml-8">

<v-clicks>

1. The Redaction Detection Benchmark dataset
2. A comparison of seven detection architectures with a class-aware metric
3. A single pipeline that answers the three questions together
4. The assembled pipeline run end to end on a court record

</v-clicks>

</div>

---
layout: cover
---

<div class="absolute top-8 left-10 flex items-center gap-6 text-left">
  <img src="/figures/logo_uc.png" class="h-24" />
  <div class="leading-snug">
    <div>Pontificia Universidad Católica de Chile</div>
    <div>Departamento de Ciencia de la Computación</div>
    <div>NuestramemorIA</div>
  </div>
</div>

# A Full Pipeline for the Analysis of Redacted Documents

Daniel Eduardo Sebastián Gaete · November 9, 2026

<div class="mt-8 text-base leading-snug opacity-80">
  <div class="font-bold">Committee</div>
  <div>Domingo Mery · Jorge Gironás · Jocelyn Dunstan · Gregory Randall</div>
</div>

---

# References

<div class="text-sm leading-snug">

Beltrame, M., Conti, M., Guglielmin, P., Marchiori, F., & Orazi, G. (2024). RedactBuster: Entity type recognition from redacted documents. *European Symposium on Research in Computer Security*, 451–470.

Bland, M., Iyer, A., & Levchenko, K. (2022). Story beyond the eye: Glyph positions break PDF text redaction. *arXiv preprint arXiv:2206.02285*.

Cheng, B., Misra, I., Schwing, A. G., Kirillov, A., & Girdhar, R. (2022). Masked-attention mask transformer for universal image segmentation. https://arxiv.org/abs/2112.01527

Cheng, B., Schwing, A., & Kirillov, A. (2021). Per-pixel classification is not all you need for semantic segmentation. *Advances in neural information processing systems*, *34*, 17864–17875.

</div>

---

# References

<div class="text-sm leading-snug">

He, K., Gkioxari, G., Dollár, P., & Girshick, R. (2017). Mask R-CNN. *Proceedings of the IEEE international conference on computer vision*, 2961–2969.

Jocher, G., & Qiu, J. (2026). *Ultralytics YOLO26* (Version 26.0.0). https://github.com/ultralytics/ultralytics

Jocher, G., Qiu, J., & Chaurasia, A. (2023). *Ultralytics YOLOv8* (Version 8.0.0). https://github.com/ultralytics/ultralytics

Lyu, C., Zhang, W., Huang, H., Zhou, Y., Wang, Y., Liu, Y., Zhang, S., & Chen, K. (2022). RTMDet: An empirical study of designing real-time object detectors. *arXiv preprint arXiv:2212.07784*.

</div>

---

# References

<div class="text-sm leading-snug">

Pilán, I., Lison, P., Øvrelid, L., Papadopoulou, A., Sánchez, D., & Batet, M. (2022). The text anonymization benchmark (TAB): A dedicated corpus and evaluation framework for text anonymization. *Computational Linguistics*, *48*(4), 1053–1101.

Redmon, J., Divvala, S., Girshick, R., & Farhadi, A. (2016). You only look once: Unified, real-time object detection. *Proceedings of the IEEE conference on computer vision and pattern recognition*, 779–788.

Robinson, I., Robicheaux, P., Popov, M., Ramanan, D., & Peri, N. (2025). RF-DETR: Neural architecture search for real-time detection transformers [Accepted to ICLR 2026]. *arXiv preprint arXiv:2511.09554*.

</div>

---

# References

<div class="text-sm leading-snug">

Tan, M., Pang, R., & Le, Q. V. (2020). EfficientDet: Scalable and efficient object detection. *Proceedings of the IEEE/CVF Conference on Computer Vision and Pattern Recognition (CVPR)*, 10781–10790.

van Heusden, R., de Ruijter, A., Majoor, R., & Marx, M. (2023). Detection of redacted text in legal documents. *International Conference on Theory and Practice of Digital Libraries*, 310–316.

van Heusden, R., Meijer, K., & Marx, M. (2025). Redacted text detection using neural image segmentation methods. *International Journal on Document Analysis and Recognition (IJDAR)*, 1–11.

Vásquez Rosel, C. S. (2025). *HiT: A hybrid OCR methodology for document analysis for historical documents* [Unpublished master's thesis]. Pontificia Universidad Católica de Chile.

Wang, B., et al. (2024). MinerU: An open-source solution for precise document content extraction. *arXiv preprint arXiv:2409.18839*.

</div>

---

# References

<div class="text-sm leading-snug">

Xiao, B., et al. (2024). Florence-2: Advancing a unified representation for a variety of vision tasks. *Proceedings of the IEEE/CVF Conference on Computer Vision and Pattern Recognition (CVPR)*, 4818–4829.

Zhao, Y., Lv, W., Xu, S., Wei, J., Wang, G., Dang, Q., Liu, Y., & Chen, J. (2024). DETRs beat YOLOs on real-time object detection. *Proceedings of the IEEE/CVF Conference on Computer Vision and Pattern Recognition (CVPR)*, 16965–16974.

Zhou, X., Wang, D., & Krähenbühl, P. (2019). Objects as points. *arXiv preprint arXiv:1904.07850*.

</div>

---
layout: section
---

# Complementary Material

---

# Complementary Material - Precision

**Definition**

$$ P = \frac{TP}{TP + FP} $$

- Of the model's positive predictions, the fraction that is actually correct.
- TP: true positives (detected and actually present).
- FP: false positives (detected but not present).
- High precision $\Rightarrow$ few false alarms.

---

# Complementary Material - Recall (coverage)

**Definition**

$$ R = \frac{TP}{TP + FN} $$

- Of the actual positives, the fraction the model detected.
- FN: false negatives (present but not detected).
- High recall $\Rightarrow$ few redactions missed.

---

# Complementary Material - F1

**Definition**

$$ F_1 = 2 \cdot \frac{P \cdot R}{P + R} $$

- Harmonic mean of precision and recall.
- Heavily penalises either one being low.
- Balanced metric for comparing models when both matter.

---

# Complementary Material - IoU (Intersection over Union)

**Definition**

$$ \mathrm{IoU}(A, B) = \frac{|A \cap B|}{|A \cup B|} $$

- Measures the overlap between two regions (boxes or masks).
- Range: 0 (no overlap) to 1 (identical).
- Used as a threshold to decide whether a detection counts as a TP (e.g., IoU $\geq 0.5$).

---
layout: default
---

# Case study

<h2 class="subtitle">Data - Annotated pages</h2>

<div class="mt-4 w-5/6 mx-auto">

<table>
  <thead>
    <tr>
      <th class="text-left">Statistic</th>
      <th class="text-left">Value</th>
    </tr>
  </thead>
  <tbody>
    <tr><td>Pages</td><td>First 53 after the cover, 43 of them with redactions</td></tr>
    <tr><td>Transcription</td><td>Literal transcription of the surviving text, by hand</td></tr>
    <tr><td>Spans</td><td>194 concealed spans, each tagged with an entity type (the eight TAB classes)</td></tr>
    <tr><td>Boxes</td><td>271 regions of ink with a bounding box and no redaction type</td></tr>
    <tr><td>Pseudo-class</td><td>10 spans tagged PARAGRAPH</td></tr>
  </tbody>
</table>

</div>

---
layout: default
---

# Complementary Material - Mask R-CNN (X101-FPN)

<div class="flex items-center gap-8 mt-4">

<div class="w-7/12">

- Extends Faster R-CNN with a parallel branch that predicts a segmentation mask for each RoI.
- **Two-stage** detector: an RPN generates proposals, then a head classifies them, refines the bounding boxes and predicts masks.
- Introduces **RoI Align**, which removes the quantisation of RoI Pooling for better spatial alignment.
- Backbone: **ResNeXt-101 (32x8d) + FPN** for multi-scale detection.

</div>

<img class="w-5/12" src="/figures/models/maskrcnn.png" />

</div>

<p class="absolute bottom-10 left-14 text-xs opacity-60">Source: He et al. (2017)</p>

---
layout: default
---

# Complementary Material - Mask2Former (Swin-T)

<div class="flex items-center gap-8 mt-4">

<div class="w-7/12">

- **Universal** segmentation architecture: panoptic, instance and semantic segmentation with a single model.
- Three components: backbone (Swin-T), pixel decoder, and a Transformer decoder that predicts binary masks and classes.
- Introduces **masked attention**: each query attends only to the region delimited by its predicted mask, improving convergence.
- State of the art on COCO (57.8 PQ, 50.1 AP) and ADE20K (57.7 mIoU).

</div>

<img class="w-5/12" src="/figures/models/mask2former.png" />

</div>

<p class="absolute bottom-10 left-14 text-xs opacity-60">Source: Cheng et al. (2022)</p>

---
layout: default
---

# Complementary Material - RTMDet-X

<div class="flex items-center gap-8 mt-4">

<div class="w-7/12">

- Real-time **one-stage, anchor-free** detector from OpenMMLab. RTMDet-X reaches 52.8% AP on COCO.
- **CSPNeXt** backbone with **large-kernel depth-wise convolutions** (5×5) to widen the receptive field.
- **Dynamic label assignment** (SimOTA), which adapts the ground-truth assignment during training.
- Design based on a systematic empirical study of macro-architecture, blocks and training strategies.

</div>

<img class="w-5/12" src="/figures/models/rtmdet.jpg" />

</div>

<p class="absolute bottom-10 left-14 text-xs opacity-60">Source: Lyu et al. (2022)</p>

---
layout: default
---

# Complementary Material - RF-DETR

<div class="flex items-center gap-8 mt-4">

<div class="w-7/12">

- Real-time transformer-based detector developed by **Roboflow** (2025).
- **DINOv2** backbone (pre-trained ViT) with a decoder based on Deformable DETR. No NMS and no anchor boxes.
- Uses **Neural Architecture Search (NAS)** with weight sharing to find optimal accuracy/latency Pareto curves.
- First real-time model to exceed **60 AP on COCO**.

</div>

<img class="w-5/12" src="/figures/models/rfdetr.png" />

</div>

<p class="absolute bottom-10 left-14 text-xs opacity-60">Source: Robinson et al. (2025)</p>

---
layout: default
---

# Complementary Material - RT-DETRv2

<div class="mt-4">

- Refines RT-DETR with a set of training and architecture improvements.
- RT-DETR: first end-to-end transformer-based detector that runs in **real time** (Baidu).
- **Hybrid encoder**: intra-scale interaction (AIFI, self-attention) plus cross-scale fusion (CCFM, CNN).
- **IoU-aware query selection**, which gives the decoder high-quality initial queries.
- **No NMS** in post-processing. RT-DETR-R50: 53.1% AP at 108 FPS (T4).

</div>

<img class="mx-auto mt-3" src="/figures/models/rtdetr.jpg" style="width: 68%" />

<p class="absolute bottom-10 left-14 text-xs opacity-60">Source: Zhao et al. (2024); Lv et al. (2024)</p>

---
layout: default
---

# Complementary Material - YOLO26-Small

<div class="flex items-center gap-8 mt-4">

<div class="w-7/12">

- Latest YOLO generation from Ultralytics (2026), designed for edge devices.
- **End-to-end inference without NMS**: one-to-one head with direct predictions. The DFL module is removed.
- New techniques: **ProgLoss** (stabilisation), **STAL** (small objects) and the **MuSGD** optimiser.
- YOLO26s: 9.5M parameters, 20.7B FLOPs, 48.6 mAP@50-95 on COCO.

</div>

<img class="w-5/12" src="/figures/models/yolo26s.png" />

</div>

<p class="absolute bottom-10 left-14 text-xs opacity-60">Source: Jocher &amp; Qiu (2026)</p>

---
layout: default
---

# Complementary Material - YOLO26-Small-Seg

<div class="mt-4 w-5/6">

- Shares the **backbone and neck** with YOLO26-Small: the same base architecture, unified across several tasks.
- Adds the **Segment26** head with the **Proto26** module, which uses multi-scale information to generate instance masks.
- Parameters rise from 9.5M to **10.4M** (+0.9M) and FLOPs from 20.7B to **34.2B** (+13.5B), attributable to the mask head.
- Includes an additional semantic-segmentation loss to improve convergence.

</div>

<p class="absolute bottom-10 left-14 text-xs opacity-60">Source: Jocher &amp; Qiu (2026)</p>

---
layout: default
---

# Complementary Material - Random Forest

- An **ensemble of decision trees**. A tree classifies by asking a sequence of threshold questions about the features until it reaches a leaf that carries a class.
- **Bagging**: each tree is trained on a different bootstrap sample of the training rows (drawn with replacement).
- **Random feature subsets**: at each split a tree considers only a random subset of the features, which makes the trees less correlated with one another.
- The forest **combines the votes** of its trees. Averaging many uncorrelated trees reduces the variance of a single, deep tree.

<div class="flex items-center justify-center gap-2 mt-3 text-sm">
  <div class="flex flex-col gap-1">
    <div class="border-2 border-gray-400 rounded px-4 py-1 text-center bg-gray-50">Tree 1</div>
    <div class="border-2 border-gray-400 rounded px-4 py-1 text-center bg-gray-50">Tree 2</div>
    <div class="border-2 border-gray-400 rounded px-4 py-1 text-center bg-gray-50">…</div>
    <div class="border-2 border-gray-400 rounded px-4 py-1 text-center bg-gray-50">Tree N</div>
  </div>
  <span>→</span>
  <div class="border-2 border-gray-400 rounded px-4 py-2 text-center bg-gray-50">Vote</div>
  <span>→</span>
  <div class="border-2 border-gray-400 rounded px-4 py-2 text-center bg-gray-50">Class</div>
</div>

---
layout: default
---

# Complementary Material - Gradient Boosting

- An **additive model** of decision trees, built one tree at a time.
- Each new tree is fitted to the **errors** of the ensemble so far (the negative gradient of the loss), so it corrects what the previous trees get wrong.
- The prediction is the **sum of the trees' outputs**, each scaled by a learning rate that limits how much any single tree contributes.

$$ F(x) = F_0 + \eta\,T_1(x) + \eta\,T_2(x) + \dots + \eta\,T_M(x) $$

---
layout: default
---

# Complementary Material - SVM (RBF)

- A **support vector machine** looks for the boundary between two classes with the **largest margin**. Only the points closest to the boundary, the **support vectors**, define it.
- A **soft margin** lets some points fall on the wrong side, trading margin width against training errors.
- The **kernel trick** replaces dot products by a kernel function, which amounts to separating the classes linearly in a higher-dimensional space. The boundary is then non-linear in the original space.
- The **RBF kernel** measures similarity by distance: it decays smoothly as two embeddings move apart, so each support vector acts as a local bump and the boundary can be very flexible.
- Binary by nature; several classes are handled by combining binary classifiers.

$$ K(x, z) = \exp\!\left(-\gamma\,\lVert x - z \rVert^2\right) $$

---
layout: default
---

# Complementary Material - SVM (polynomial)

- The same **maximum-margin classifier**, with a different kernel.
- The **polynomial kernel** works with the dot product between two embeddings, raised to a power $d$ (the degree).
- It implicitly considers **all interactions between features up to degree $d$**, so the decision boundary is a polynomial function of the embedding.
- The degree sets the flexibility: the higher it is, the more complex the boundaries that can be drawn.
- Unlike the RBF kernel, similarity is not tied to the distance between points but to their dot product.

$$ K(x, z) = \left(\gamma\, x^{\top} z + r\right)^{d} $$

---
layout: default
---

# Complementary Material - DNN

- A **fully connected network** (multi-layer perceptron): every unit of a layer is connected to every unit of the next one.
- Each layer applies a **linear transformation followed by a non-linear activation function**, so the network can learn non-linear combinations of the input dimensions.
- The hidden layers learn **intermediate representations** of the input.
- The last layer gives one **score per class**; a softmax turns the scores into probabilities.
- It is trained end to end by **backpropagation**, minimising a cross-entropy loss with a gradient-based optimiser.

<div class="flex items-center justify-center gap-2 mt-8 text-sm">
  <div class="border-2 border-gray-400 rounded px-3 py-2 text-center bg-gray-50">Input</div>
  <span>→</span>
  <div class="border-2 border-gray-400 rounded px-3 py-2 text-center bg-gray-50">Linear<br>+ activation</div>
  <span>→</span>
  <div class="border-2 border-gray-400 rounded px-3 py-2 text-center bg-gray-50">Linear<br>+ activation</div>
  <span>→</span>
  <div class="border-2 border-gray-400 rounded px-3 py-2 text-center bg-gray-50">…</div>
  <span>→</span>
  <div class="border-2 border-gray-400 rounded px-3 py-2 text-center bg-gray-50">Linear</div>
  <span>→</span>
  <div class="border-2 border-gray-400 rounded px-3 py-2 text-center bg-gray-50">Softmax</div>
</div>

---
layout: default
---

# Complementary Material - CNN

- A **convolutional network**, here one-dimensional: the input is treated as a one-dimensional signal.
- **Convolutional filters** slide along the signal. The same small set of weights is applied at every position (weight sharing), so each filter detects a local pattern.
- **Pooling** layers downsample the resulting feature maps, keeping the strongest responses and reducing their size.
- The extracted features are flattened and passed to **fully connected layers**, which give one score per class.
- It is trained end to end by **backpropagation**, like the DNN.

<div class="flex items-center justify-center gap-2 mt-8 text-sm">
  <div class="border-2 border-gray-400 rounded px-3 py-2 text-center bg-gray-50">Input</div>
  <span>→</span>
  <div class="border-2 border-gray-400 rounded px-3 py-2 text-center bg-gray-50">Convolution<br>+ activation</div>
  <span>→</span>
  <div class="border-2 border-gray-400 rounded px-3 py-2 text-center bg-gray-50">Pooling</div>
  <span>→</span>
  <div class="border-2 border-gray-400 rounded px-3 py-2 text-center bg-gray-50">…</div>
  <span>→</span>
  <div class="border-2 border-gray-400 rounded px-3 py-2 text-center bg-gray-50">Flatten</div>
  <span>→</span>
  <div class="border-2 border-gray-400 rounded px-3 py-2 text-center bg-gray-50">Fully<br>connected</div>
  <span>→</span>
  <div class="border-2 border-gray-400 rounded px-3 py-2 text-center bg-gray-50">Softmax</div>
</div>

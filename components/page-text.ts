// Hand-made transcription (ground truth) of the example page: page 53 of the
// case file, `redacted_lawsuit_p53` in the predictions and `redacted_lawsuit_p54`
// in the ground-truth folder (that one is numbered counting the cover). The
// redaction markers are removed and words split by a line-end hyphen are joined.
// The page number "3713" printed at the top right is not in the transcription;
// it is added in front. Only the text that the cropped page image shows is
// kept: up to the end of the line "ANTONIO RIVERA RAMIREZ, y NESTOR EXEQUIEL
// ROSALES GARCIA a".
/** A text kept line by line, as one paragraph: the lines joined, words split by a line-end hyphen put back together. */
export const flow = (lines: string) => lines.replace(/-\n/g, '').replace(/\n/g, ' ')

export const PAGE_TEXT
  = "3713 como autor del delito que sanciona el del Código de Justicia Militar y que sanciona el en relación con la parte final del del mismo cuerpo legal; al inculpado LUIS GUSTAVO FERRADA ZAPATA a la como autor del delito sancionado en el del Código de Justicia Militar y de como autor del delito que sanciona el en relación con del mismo Código; al inculpado ALBERTO BUSTAMANTE ROJAS como autor del delito que sanciona el del Código de Justicia Militar; a los inculpados MANUEL ANTONIO RIVERA RAMIREZ, y NESTOR EXEQUIEL ROSALES GARCIA a"

// The same transcription with the redaction markers kept ("*****"), laid out
// line by line as on the page, up to the last line the cropped page image shows.
// It has one marker per box the detector drew on the page (the red boxes of the
// layout merge output), so a span that the ground truth marks once appears once
// per box it was split into, on the line that box is on. The page number is not
// part of it.
export const PAGE_TEXT_MARKED = [
  "***** como autor del delito",
  "que sanciona el ***** del Código de Justicia",
  "Militar y *****",
  "***** que sanciona el ***** en rela-",
  "ción con la parte final del ***** del",
  "mismo cuerpo legal; al inculpado LUIS GUSTAVO FERRADA ZAPATA",
  "a la *****",
  "***** como autor del delito sancionado en el *****",
  "***** del Código de Justicia Militar y de ***** ***** *****",
  "***** ***** como autor del delito que",
  "sanciona el ***** en relación con *****",
  "***** del mismo Código; al inculpado ALBERTO BUSTA-",
  "MANTE ROJAS *****",
  "***** como autor del delito que sanciona el *****",
  "***** del Código de Justicia Militar; a los inculpados MANUEL",
  "ANTONIO RIVERA RAMIREZ, y NESTOR EXEQUIEL ROSALES GARCIA a",
].join('\n')

// What entity grouping hands on: the same lines, with the markers of one entity
// merged into one. A run of markers on a line becomes a single marker, and a
// fragment that continues the previous one on the line below disappears into it,
// so the entity is marked where it begins.
export const PAGE_TEXT_GROUPED = [
  '***** como autor del delito',
  'que sanciona el ***** del Código de Justicia',
  'Militar y *****',
  'que sanciona el ***** en rela-',
  'ción con la parte final del ***** del',
  'mismo cuerpo legal; al inculpado LUIS GUSTAVO FERRADA ZAPATA',
  'a la *****',
  'como autor del delito sancionado en el *****',
  'del Código de Justicia Militar y de *****',
  'como autor del delito que',
  'sanciona el ***** en relación con *****',
  'del mismo Código; al inculpado ALBERTO BUSTA-',
  'MANTE ROJAS *****',
  'como autor del delito que sanciona el *****',
  'del Código de Justicia Militar; a los inculpados MANUEL',
  'ANTONIO RIVERA RAMIREZ, y NESTOR EXEQUIEL ROSALES GARCIA a',
].join('\n')

// The whole page, from the same ground truth: `PAGE_TEXT_GROUPED` and the lines the cropped image does
// not show, up to the end of the page, again with one marker per entity. A word split at the end of a
// line without its hyphen ("incul" / "pado") has it put back, and a marker stuck to the word after it
// ("*****del") is given its space.
export const PAGE_TEXT_FULL = [
  PAGE_TEXT_GROUPED,
  'la pena de *****',
  'autores del delito sancionado en el artículo ***** del Có-',
  'digo de Justicia Militar; a los inculpados HERNAN VALVERDE',
  'BENITEZ, DENIS JONES MOLINA y LUIS ALARCON ARREDONDO a la',
  '*****',
  'como autores del delito sancionado en el ***** del',
  'Código de Justicia Militar; al inculpado FRANCISCO VALENZUELA',
  'GUEVARA a la pena de *****',
  'como autor de tentativa del delito sancionado en',
  'el ***** del Código de Justicia Militar; al incul-',
  'pado José Contreras Galleguillos a la pena *****',
  'en su grado mínimo como autor del',
  'delito que sanciona el artículo ***** del Código de Justicia',
  'Militar; al inculpado JOSE JARA FABIA a la pena de *****',
].join('\n')

// An arbitrary division into sentences, for the walkthrough of the sentence
// segmentation step: the page has none (its clauses are chained with
// semicolons), so it is cut after each semicolon. Words split by a line-end
// hyphen are joined.
export const PAGE_SENTENCES = flow(PAGE_TEXT_GROUPED).split(/(?<=;) /)

// What target marking builds from them: for each sentence, one input per marker,
// with that marker as the target and the others left in place. A sentence with no
// marker gives none. `TARGET_SENTENCES` says which sentence each input comes from.
const targets = PAGE_SENTENCES.flatMap((sentence, from) => {
  const parts = sentence.split('*****')
  return parts.slice(0, -1).map((_, i) => ({
    from,
    text: parts.reduce((out, part, j) => out + part + (j < parts.length - 1 ? (j === i ? '<TGT>*****</TGT>' : '*****') : ''), ''),
  }))
})
export const TARGET_INPUTS = targets.map(t => t.text)
export const TARGET_SENTENCES = targets.map(t => t.from)

// The sentence the walkthrough ends on (the first one) and the inputs built from it.
export const FOCUS_SENTENCE = 0
export const FOCUSED_SENTENCE = PAGE_SENTENCES[FOCUS_SENTENCE]
export const FOCUSED_INPUTS = TARGET_INPUTS.filter((_, i) => TARGET_SENTENCES[i] === FOCUS_SENTENCE)

// How many markers of `PAGE_TEXT_MARKED` each marker of `PAGE_TEXT_GROUPED` stands
// for, in order: the ones above 1 are the entities that grouping merged.
export const MERGED_MARKERS = [1, 1, 2, 1, 1, 2, 2, 5, 1, 2, 2, 2]

// What entity-type classification answers for each entity (each marker of `PAGE_TEXT_GROUPED`, then
// each of the rest of `PAGE_TEXT_FULL`), in order. They come from the run of the pipeline on this page
// (classifier_outputs.json of `redacted_lawsuit_p53`, GPT OSS 120B few-shot), which classified each of
// the 32 boxes of the page on its own, before entity grouping existed: its records 1 to 32, in the order
// of the markers (the first 22 are those of `PAGE_TEXT_MARKED`). An entity that grouping merged takes
// the answer given to its first box (it is marked where it begins). Four of them were given different
// classes box by box: the entities of boxes 7-8, 9-10, 11-15 and 19-20.
const BOX_CLASSES = [
  'PERSON', 'CODE', 'CODE', 'CODE', 'CODE', 'CODE', 'MISC', 'PERSON', 'CODE', 'DEM', 'CODE',
  'CODE', 'CODE', 'CODE', 'PERSON', 'CODE', 'CODE', 'CODE', 'DEM', 'ORG', 'CODE', 'CODE',
  'QUANTITY', 'CODE', 'CODE', 'CODE', 'QUANTITY', 'CODE', 'QUANTITY', 'QUANTITY', 'CODE', 'QUANTITY',
]
// How many boxes each entity of the whole page has: those of the cropped part, then the rest (the
// 29th and 30th box are one entity).
const BOXES_PER_ENTITY = [...MERGED_MARKERS, 1, 1, 1, 1, 1, 1, 2, 1, 1]
export const FULL_CLASSES = BOXES_PER_ENTITY.map((_, i) => BOX_CLASSES[BOXES_PER_ENTITY.slice(0, i).reduce((n, count) => n + count, 0)])
export const PAGE_CLASSES = FULL_CLASSES.slice(0, MERGED_MARKERS.length)
// The ones of the focused sentence.
const markersIn = (sentence: string) => sentence.split('*****').length - 1
const firstMarker = PAGE_SENTENCES.slice(0, FOCUS_SENTENCE).reduce((n, s) => n + markersIn(s), 0)
export const FOCUSED_CLASSES = PAGE_CLASSES.slice(firstMarker, firstMarker + markersIn(FOCUSED_SENTENCE))
// One colour per entity type (the eight of the Text Anonymization Benchmark).
export const CLASS_COLORS: Record<string, string> = {
  PERSON: '#e8590c',
  CODE: '#1c7ed6',
  DATETIME: '#9c36b5',
  DEM: '#2f9e44',
  LOC: '#d6336c',
  MISC: '#0c8599',
  ORG: '#a56a00',
  QUANTITY: '#495057',
}
/** Classes as the words a text panel draws in place of its markers (see `words` and `swap` of TextPanel). */
export const asWords = (names: string[]) => names.map(name => ({ text: name, color: CLASS_COLORS[name] }))

// The beginning of the per-redaction records the pipeline wrote for the page (`*.classifications.json`):
// the first two of its 32, with their boxes in the page image. The class of each is a marker, which
// the panel draws as the class (`RECORDS_CLASSES`). The text of the sentences that each record also
// carries is left out.
const RECORD_BOXES = [[354, 229, 1087, 288], [707, 299, 1090, 360]]
export const RECORDS_TEXT = [
  `{ "n_redactions": ${BOX_CLASSES.length},`,
  '  "redactions": [',
  ...RECORD_BOXES.flatMap((box, i) => [
    `    { "id": "redacted_lawsuit_p53_p0_r${i + 1}", "bbox": [${box.join(', ')}],`,
    `      "kind": "inline", "classification": "*****" },`,
  ]),
  '    …',
].join('\n')
export const RECORDS_CLASSES = BOX_CLASSES.slice(0, RECORD_BOXES.length)

// One colour per sentence: the background of its cell once target marking is about to
// start, and of every input built from it. `TARGET_COLORS` is that of each input.
export const SENTENCE_COLORS = ['#ffe9a8', '#c6ecc6', '#ffc9d6', '#c4e6f5']
export const TARGET_COLORS = TARGET_SENTENCES.map(i => SENTENCE_COLORS[i])

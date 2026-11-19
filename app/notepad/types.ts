export type FontStyle = "Regular" | "Italic" | "Bold" | "Bold Italic"

export type FontChoice = {
  family: string
  style: FontStyle
  size: number
}

export type PageSetup = {
  paper: "Letter" | "A4" | "Legal"
  orientation: "Portrait" | "Landscape"
  margins: {
    left: number
    right: number
    top: number
    bottom: number
  }
  header: string
  footer: string
}

export type MenuCommand =
  | "new"
  | "open"
  | "save"
  | "save-as"
  | "page-setup"
  | "print"
  | "exit"
  | "undo"
  | "cut"
  | "copy"
  | "paste"
  | "delete"
  | "find"
  | "find-next"
  | "replace"
  | "go-to"
  | "select-all"
  | "time-date"
  | "word-wrap"
  | "font"
  | "status-bar"
  | "about"

export const FONT_FAMILIES = [
  "Lucida Console",
  "Courier New",
  "Fixedsys",
  "Terminal",
  "Arial",
  "Arial Black",
  "Comic Sans MS",
  "Courier",
  "Georgia",
  "Impact",
  "MS Sans Serif",
  "Palatino Linotype",
  "Tahoma",
  "Times New Roman",
  "Trebuchet MS",
  "Verdana",
  "Wingdings",
] as const

export const FONT_SIZES = [
  8, 9, 10, 11, 12, 14, 16, 18, 20, 22, 24, 26, 28, 36, 48, 72,
] as const

export const FONT_STYLES: FontStyle[] = [
  "Regular",
  "Italic",
  "Bold",
  "Bold Italic",
]

export const DEFAULT_FONT: FontChoice = {
  family: "Lucida Console",
  style: "Regular",
  size: 10,
}

export const DEFAULT_PAGE_SETUP: PageSetup = {
  paper: "Letter",
  orientation: "Portrait",
  margins: { left: 0.75, right: 0.75, top: 1, bottom: 1 },
  header: "",
  footer: "Page &p",
}

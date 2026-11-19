"use client"

import * as React from "react"
import Image from "next/image"
import { Button } from "@ui-sdk/react/button"
import { useShortcut } from "@ui-sdk/react/shortcuts"
import { Textarea } from "@ui-sdk/react/textarea"
import { connectAgent } from "./agent"
import {
  AboutDialog,
  FindDialog,
  FontDialog,
  GoToDialog,
  PageSetupDialog,
  ReplaceDialog,
  UnsavedDialog,
  type SaveDecision,
} from "./dialogs"
import { openLocalFile, saveLocalFile, type TextFileHandle } from "./file-system"
import {
  CloseIcon,
  ComputerIcon,
  FolderIcon,
  MaximizeIcon,
  MinimizeIcon,
  NotepadIcon,
  RecycleBinIcon,
  RestoreIcon,
  SpeakerIcon,
} from "./icons"
import { NotepadMenuBar, StartMenu } from "./menus"
import {
  DEFAULT_FONT,
  DEFAULT_PAGE_SETUP,
  type FontChoice,
  type MenuCommand,
  type PageSetup,
} from "./types"

type WindowRect = { x: number; y: number; w: number; h: number }
type Range = { start: number; end: number }

const TASKBAR_HEIGHT = 30
const MIN_WIDTH = 360
const MIN_HEIGHT = 260

function findIn(
  source: string,
  query: string,
  matchCase: boolean,
  from: number,
  direction: "up" | "down" = "down"
): Range | null {
  if (!query) return null
  const haystack = matchCase ? source : source.toLowerCase()
  const needle = matchCase ? query : query.toLowerCase()
  if (direction === "up") {
    let index = from > 0 ? haystack.lastIndexOf(needle, from - 1) : -1
    if (index === -1) index = haystack.lastIndexOf(needle)
    if (index === -1) return null
    return { start: index, end: index + query.length }
  }
  let index = haystack.indexOf(needle, Math.min(from, haystack.length))
  if (index === -1) index = haystack.indexOf(needle, 0)
  if (index === -1) return null
  return { start: index, end: index + query.length }
}

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
}

function printAlign(value: string): React.CSSProperties["textAlign"] {
  if (/^&c/i.test(value)) return "center"
  if (/^&r/i.test(value)) return "right"
  return "left"
}

/**
 * Expands the header/footer codes Notepad accepts: &f file name, &d date,
 * &t time, &p page number, and &l/&c/&r alignment prefixes.
 */
function expandPrintTokens(value: string, fileName: string) {
  const now = new Date()
  return value
    .replace(/&[lcr]/gi, "")
    .replace(/&f/gi, fileName)
    .replace(/&d/gi, now.toLocaleDateString("en-US"))
    .replace(
      /&t/gi,
      now.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })
    )
    .replace(/&p/gi, "1")
}

const DESKTOP_ICONS = [
  { id: "notepad", label: "Notepad", Icon: NotepadIcon },
  { id: "my-computer", label: "My Computer", Icon: ComputerIcon },
  { id: "my-documents", label: "My Documents", Icon: FolderIcon },
  { id: "recycle-bin", label: "Recycle Bin", Icon: RecycleBinIcon },
] as const

export function Notepad() {
  const [text, setText] = React.useState("")
  const [savedText, setSavedText] = React.useState("")
  const [fileName, setFileName] = React.useState<string | null>(null)
  const [font, setFont] = React.useState<FontChoice>(DEFAULT_FONT)
  const [pageSetup, setPageSetup] =
    React.useState<PageSetup>(DEFAULT_PAGE_SETUP)
  const [wordWrap, setWordWrap] = React.useState(false)
  const [statusBar, setStatusBar] = React.useState(true)
  const [selection, setSelection] = React.useState<Range>({
    start: 0,
    end: 0,
  })
  const [historyLength, setHistoryLength] = React.useState(0)

  const [windowOpen, setWindowOpen] = React.useState(true)
  const [minimized, setMinimized] = React.useState(false)
  const [maximized, setMaximized] = React.useState(false)
  const [rect, setRect] = React.useState<WindowRect | null>(null)

  const [aboutOpen, setAboutOpen] = React.useState(false)
  const [fontOpen, setFontOpen] = React.useState(false)
  const [pageSetupOpen, setPageSetupOpen] = React.useState(false)
  const [findOpen, setFindOpen] = React.useState(false)
  const [replaceOpen, setReplaceOpen] = React.useState(false)
  const [goToOpen, setGoToOpen] = React.useState(false)
  const [unsavedOpen, setUnsavedOpen] = React.useState(false)

  const [findQuery, setFindQuery] = React.useState("")
  const [findReplacement, setFindReplacement] = React.useState("")
  const [findMatchCase, setFindMatchCase] = React.useState(false)
  const [findDirection, setFindDirection] = React.useState<"up" | "down">(
    "down"
  )

  const [selectedIcon, setSelectedIcon] = React.useState<string | null>(null)
  const [balloon, setBalloon] = React.useState<string | null>(null)
  const [clock, setClock] = React.useState("")

  // The print page stamps the current date and time, which only exists in the
  // browser. Rendering it after hydration keeps the static shell stable.
  const isClient = React.useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  )

  const editorWrapRef = React.useRef<HTMLDivElement>(null)
  const windowRef = React.useRef<HTMLElement>(null)
  const fileHandleRef = React.useRef<TextFileHandle | null>(null)
  const historyRef = React.useRef<string[]>([])
  const lastEditAtRef = React.useRef(0)
  const pendingActionRef = React.useRef<null | (() => void | Promise<void>)>(
    null
  )
  const balloonTimerRef = React.useRef<number | null>(null)
  const dragRef = React.useRef<{
    pointerId: number
    startX: number
    startY: number
    rect: WindowRect
  } | null>(null)
  const resizeRef = React.useRef<{
    pointerId: number
    startX: number
    startY: number
    rect: WindowRect
  } | null>(null)

  const displayName = fileName ?? "Untitled"
  const dirty = text !== savedText
  const windowTitle = `${displayName} - Notepad`
  const hasSelection = selection.end > selection.start
  const active = windowOpen && !minimized

  const getEditor = React.useCallback(
    () => editorWrapRef.current?.querySelector("textarea") ?? null,
    []
  )

  const syncSelection = React.useCallback(() => {
    const editor = getEditor()
    if (!editor) return
    setSelection({
      start: editor.selectionStart,
      end: editor.selectionEnd,
    })
  }, [getEditor])

  const remember = React.useCallback(
    (previous: string, coalesce = false) => {
      const now = Date.now()
      if (coalesce && now - lastEditAtRef.current < 700) {
        lastEditAtRef.current = now
        return
      }
      historyRef.current.push(previous)
      if (historyRef.current.length > 200) historyRef.current.shift()
      lastEditAtRef.current = coalesce ? now : 0
      setHistoryLength(historyRef.current.length)
    },
    []
  )

  React.useEffect(() => connectAgent(), [])

  React.useEffect(() => {
    const editor = getEditor()
    if (!editor) return
    const update = () => syncSelection()
    editor.addEventListener("select", update)
    editor.addEventListener("mouseup", update)
    return () => {
      editor.removeEventListener("select", update)
      editor.removeEventListener("mouseup", update)
    }
  }, [getEditor, syncSelection, windowOpen])

  React.useEffect(() => {
    const tick = () => {
      setClock(
        new Intl.DateTimeFormat("en-US", {
          hour: "numeric",
          minute: "2-digit",
        }).format(new Date())
      )
    }
    tick()
    const timer = window.setInterval(tick, 15_000)
    return () => window.clearInterval(timer)
  }, [])

  React.useEffect(() => {
    document.title = windowTitle
  }, [windowTitle])

  // Dialogs are rendered in the top layer, so they can't inherit the window's
  // position from the DOM. Publish the window frame as CSS variables instead of
  // threading a position prop through every dialog.
  React.useEffect(() => {
    const root = document.documentElement
    const element = windowRef.current
    const bounds = element?.getBoundingClientRect()
    const frame = maximized
      ? {
          x: 0,
          y: 0,
          w: window.innerWidth,
          h: window.innerHeight - TASKBAR_HEIGHT,
        }
      : rect ??
        (bounds
          ? { x: bounds.left, y: bounds.top, w: bounds.width, h: bounds.height }
          : null)
    if (!frame || !frame.w || !frame.h) {
      root.style.removeProperty("--np-anchor-x")
      root.style.removeProperty("--np-anchor-y")
      root.style.removeProperty("--np-anchor-right")
      root.style.removeProperty("--np-anchor-top")
      return
    }
    root.style.setProperty("--np-anchor-x", `${frame.x + frame.w / 2}px`)
    root.style.setProperty("--np-anchor-y", `${frame.y + frame.h / 2}px`)
    root.style.setProperty(
      "--np-anchor-right",
      `${Math.max(0, window.innerWidth - (frame.x + frame.w))}px`
    )
    root.style.setProperty("--np-anchor-top", `${frame.y}px`)
    return () => {
      root.style.removeProperty("--np-anchor-x")
      root.style.removeProperty("--np-anchor-y")
      root.style.removeProperty("--np-anchor-right")
      root.style.removeProperty("--np-anchor-top")
    }
  }, [rect, maximized, windowOpen])

  React.useEffect(() => {
    return () => {
      if (balloonTimerRef.current) {
        window.clearTimeout(balloonTimerRef.current)
      }
    }
  }, [])

  function showBalloon(message: string) {
    setBalloon(message)
    if (balloonTimerRef.current) {
      window.clearTimeout(balloonTimerRef.current)
    }
    balloonTimerRef.current = window.setTimeout(() => {
      setBalloon(null)
      balloonTimerRef.current = null
    }, 3500)
  }

  function resetHistory() {
    historyRef.current = []
    lastEditAtRef.current = 0
    setHistoryLength(0)
  }

  function loadDocument(
    name: string | null,
    content: string,
    handle: TextFileHandle | null
  ) {
    setText(content)
    setSavedText(content)
    setFileName(name)
    fileHandleRef.current = handle
    resetHistory()
    setSelection({ start: 0, end: 0 })
    window.setTimeout(() => {
      const editor = getEditor()
      if (!editor) return
      editor.focus()
      editor.setSelectionRange(0, 0)
      editor.scrollTop = 0
      editor.scrollLeft = 0
    }, 0)
  }

  function resetDocument() {
    loadDocument(null, "", null)
  }

  function applyText(next: string, caret: number) {
    remember(text)
    setText(next)
    setSelection({ start: caret, end: caret })
    window.setTimeout(() => {
      const editor = getEditor()
      if (!editor) return
      editor.focus()
      editor.setSelectionRange(caret, caret)
    }, 0)
  }

  function selectRange(range: Range, focus = false) {
    setSelection(range)
    const editor = getEditor()
    if (!editor) return
    editor.setSelectionRange(range.start, range.end)
    if (focus) editor.focus()
    const before = editor.value.slice(0, range.start)
    const line = before.split("\n").length
    const styles = window.getComputedStyle(editor)
    const lineHeight =
      Number.parseFloat(styles.lineHeight) || font.size * 1.5
    editor.scrollTop = Math.max(0, (line - 3) * lineHeight)
    editor.scrollLeft = 0
  }

  function undo() {
    const previous = historyRef.current.pop()
    if (previous === undefined) return
    setText(previous)
    setSelection({ start: previous.length, end: previous.length })
    setHistoryLength(historyRef.current.length)
    lastEditAtRef.current = 0
    window.setTimeout(() => {
      const editor = getEditor()
      if (!editor) return
      editor.focus()
      editor.setSelectionRange(previous.length, previous.length)
    }, 0)
  }

  function editSelection(insert: string) {
    const editor = getEditor()
    if (!editor) return
    const start = editor.selectionStart
    const end = editor.selectionEnd
    const current = editor.value
    const next = current.slice(0, start) + insert + current.slice(end)
    applyText(next, start + insert.length)
  }

  async function copySelection(): Promise<boolean> {
    const editor = getEditor()
    if (!editor) return false
    const { selectionStart: start, selectionEnd: end } = editor
    if (start === end) return false
    const selected = editor.value.slice(start, end)
    try {
      await navigator.clipboard.writeText(selected)
      return true
    } catch {
      editor.focus()
      editor.setSelectionRange(start, end)
      return document.execCommand("copy")
    }
  }

  async function cutSelection() {
    if (await copySelection()) deleteSelection()
  }

  async function pasteSelection() {
    const editor = getEditor()
    if (!editor) return
    try {
      const value = await navigator.clipboard.readText()
      editSelection(value)
    } catch {
      const start = editor.selectionStart
      const end = editor.selectionEnd
      editor.focus()
      editor.setSelectionRange(start, end)
      if (document.execCommand("paste")) {
        window.setTimeout(syncSelection, 0)
      }
    }
  }

  function deleteSelection() {
    const editor = getEditor()
    if (!editor) return
    const start = editor.selectionStart
    const end = editor.selectionEnd
    const current = editor.value
    if (start === end) {
      if (start >= current.length) return
      applyText(current.slice(0, start) + current.slice(start + 1), start)
      return
    }
    applyText(current.slice(0, start) + current.slice(end), start)
  }

  function selectAll() {
    const editor = getEditor()
    if (!editor) return
    editor.focus()
    editor.select()
    syncSelection()
  }

  function insertTimeDate() {
    const now = new Date()
    const time = now.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
    })
    const date = now.toLocaleDateString("en-US")
    editSelection(`${time} ${date}`)
  }

  function findNext(
    query = findQuery,
    matchCase = findMatchCase,
    direction: "up" | "down" = findDirection
  ) {
    if (!query) {
      setReplaceOpen(false)
      setFindOpen(true)
      return
    }
    const editor = getEditor()
    const source = editor?.value ?? text
    const from = editor
      ? direction === "up"
        ? editor.selectionStart
        : editor.selectionEnd
      : direction === "up"
        ? selection.start
        : selection.end
    const found = findIn(source, query, matchCase, from, direction)
    if (!found) {
      showBalloon("Cannot find the text.")
      return
    }
    selectRange(found)
  }

  function replaceCurrent() {
    if (!findQuery) return
    const editor = getEditor()
    const current = editor?.value ?? text
    const start = editor ? editor.selectionStart : selection.start
    const end = editor ? editor.selectionEnd : selection.end
    const selected = current.slice(start, end)
    const matches = findMatchCase
      ? selected === findQuery
      : selected.toLowerCase() === findQuery.toLowerCase()

    if (!matches) {
      findNext(findQuery, findMatchCase, "down")
      return
    }

    remember(current)
    const next =
      current.slice(0, start) + findReplacement + current.slice(end)
    setText(next)
    const nextFrom = start + findReplacement.length
    const found = findIn(next, findQuery, findMatchCase, nextFrom, "down")
    const range = found ?? { start: nextFrom, end: nextFrom }
    setSelection(range)
    const live = getEditor()
    if (live) {
      live.setSelectionRange(range.start, range.end)
      const before = next.slice(0, range.start)
      const styles = window.getComputedStyle(live)
      const lineHeight =
        Number.parseFloat(styles.lineHeight) || font.size * 1.5
      live.scrollTop = Math.max(
        0,
        (before.split("\n").length - 3) * lineHeight
      )
    }
  }

  function replaceAll() {
    if (!findQuery) return
    const editor = getEditor()
    const current = editor?.value ?? text
    const pattern = new RegExp(
      escapeRegExp(findQuery),
      findMatchCase ? "g" : "gi"
    )
    const matches = current.match(pattern)
    if (!matches || matches.length === 0) {
      showBalloon("Cannot find the text.")
      return
    }
    remember(current)
    const next = current.replace(pattern, () => findReplacement)
    setText(next)
    setSelection({ start: 0, end: 0 })
    showBalloon(`Replaced ${matches.length} occurrence${matches.length === 1 ? "" : "s"}.`)
  }

  function goToLine(line: number) {
    const editor = getEditor()
    const current = editor?.value ?? text
    const lines = current.split("\n")
    const target = Math.max(1, Math.min(lines.length, line))
    let index = 0
    for (let i = 0; i < target - 1; i += 1) {
      index += lines[i].length + 1
    }
    setGoToOpen(false)
    window.setTimeout(() => selectRange({ start: index, end: index }, true), 0)
  }

  async function save(asNew = false): Promise<boolean> {
    const editor = getEditor()
    const current = editor?.value ?? text
    try {
      const result = await saveLocalFile(
        current,
        fileName,
        asNew ? null : fileHandleRef.current
      )
      if (!result) return false
      fileHandleRef.current = result.handle
      setFileName(result.name)
      setSavedText(current)
      return true
    } catch (error) {
      console.error(error)
      showBalloon("The file could not be saved.")
      return false
    }
  }

  async function openFile() {
    try {
      const file = await openLocalFile()
      if (!file) return
      loadDocument(file.name, file.text, file.handle)
    } catch (error) {
      console.error(error)
      showBalloon("The file could not be opened.")
    }
  }

  function withSaveGuard(action: () => void | Promise<void>) {
    if (text !== savedText) {
      pendingActionRef.current = action
      setUnsavedOpen(true)
      return
    }
    void action()
  }

  function handleSaveDecision(decision: SaveDecision) {
    const action = pendingActionRef.current
    pendingActionRef.current = null
    setUnsavedOpen(false)
    if (!action || decision === "cancel") return
    if (decision === "no") {
      void action()
      return
    }
    void save().then((ok) => {
      if (ok) void action()
    })
  }

  function closeWindow() {
    withSaveGuard(() => {
      setWindowOpen(false)
      setMinimized(false)
      setMaximized(false)
      resetDocument()
    })
  }

  function launchNotepad() {
    if (windowOpen) {
      setMinimized(false)
      setMaximized(false)
      return
    }
    setWindowOpen(true)
    setMinimized(false)
  }

  function runCommand(command: MenuCommand) {
    if (!active) return
    switch (command) {
      case "new":
        withSaveGuard(resetDocument)
        return
      case "open":
        withSaveGuard(openFile)
        return
      case "save":
        void save(false)
        return
      case "save-as":
        void save(true)
        return
      case "page-setup":
        setFindOpen(false)
        setReplaceOpen(false)
        setPageSetupOpen(true)
        return
      case "print":
        window.print()
        return
      case "exit":
        closeWindow()
        return
      case "undo":
        undo()
        return
      case "cut":
        void cutSelection()
        return
      case "copy":
        void copySelection()
        return
      case "paste":
        void pasteSelection()
        return
      case "delete":
        deleteSelection()
        return
      case "find":
        if (!findQuery) {
          const editor = getEditor()
          if (editor && editor.selectionEnd > editor.selectionStart) {
            setFindQuery(editor.value.slice(editor.selectionStart, editor.selectionEnd))
          }
        }
        setReplaceOpen(false)
        setFindOpen(true)
        return
      case "find-next":
        findNext()
        return
      case "replace":
        setFindOpen(false)
        setReplaceOpen(true)
        return
      case "go-to":
        setFindOpen(false)
        setReplaceOpen(false)
        setGoToOpen(true)
        return
      case "select-all":
        selectAll()
        return
      case "time-date":
        insertTimeDate()
        return
      case "word-wrap":
        setWordWrap((value) => !value)
        return
      case "font":
        setFindOpen(false)
        setReplaceOpen(false)
        setFontOpen(true)
        return
      case "status-bar":
        setStatusBar((value) => !value)
        return
      case "about":
        setFindOpen(false)
        setReplaceOpen(false)
        setAboutOpen(true)
        return
    }
  }

  useShortcut("ctrl+n", () => runCommand("new"), {
    when: () => active,
    description: "New document",
  })
  useShortcut("ctrl+o", () => runCommand("open"), {
    when: () => active,
    description: "Open a document",
  })
  useShortcut("ctrl+s", () => runCommand("save"), {
    when: () => active,
    description: "Save",
  })
  useShortcut("ctrl+p", () => runCommand("print"), {
    when: () => active,
    description: "Print",
  })
  useShortcut("ctrl+z", () => runCommand("undo"), {
    when: () => active,
    description: "Undo",
  })
  useShortcut("ctrl+f", () => runCommand("find"), {
    when: () => active,
    description: "Find",
  })
  useShortcut("f3", () => runCommand("find-next"), {
    when: () => active,
    allowInInput: true,
    description: "Find next",
  })
  useShortcut("ctrl+h", () => runCommand("replace"), {
    when: () => active,
    description: "Replace",
  })
  useShortcut("ctrl+g", () => runCommand("go-to"), {
    when: () => active,
    description: "Go to line",
  })
  useShortcut("f5", () => runCommand("time-date"), {
    when: () => active,
    allowInInput: true,
    description: "Insert time and date",
  })

  function handleValueChange(
    value: string,
    details: { reason?: string }
  ) {
    if (details.reason === "input-change") remember(text, true)
    setText(value)
    window.setTimeout(syncSelection, 0)
  }

  const style = {
    fontFamily: `"${font.family}", Menlo, Consolas, "Lucida Console", monospace`,
    fontSize: `${font.size}pt`,
    fontWeight:
      font.style === "Bold" || font.style === "Bold Italic" ? 700 : 400,
    fontStyle:
      font.style === "Italic" || font.style === "Bold Italic"
        ? "italic"
        : "normal",
  } satisfies React.CSSProperties

  const caret = Math.min(selection.start, text.length)
  const beforeCaret = text.slice(0, caret)
  const line = beforeCaret.split("\n").length
  const column = caret - beforeCaret.lastIndexOf("\n")

  function onTitlePointerDown(event: React.PointerEvent<HTMLDivElement>) {
    if (maximized) return
    if ((event.target as HTMLElement).closest("[data-window-control]")) return
    const element = windowRef.current
    if (!element) return
    const bounds = element.getBoundingClientRect()
    const base = rect ?? {
      x: bounds.left,
      y: bounds.top,
      w: bounds.width,
      h: bounds.height,
    }
    if (!base.w || !base.h) return
    dragRef.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      rect: base,
    }
    setRect(base)
    event.currentTarget.setPointerCapture(event.pointerId)
  }

  function onTitlePointerMove(event: React.PointerEvent<HTMLDivElement>) {
    const drag = dragRef.current
    if (!drag || drag.pointerId !== event.pointerId) return
    const x = Math.min(
      Math.max(-drag.rect.w + 120, drag.rect.x + event.clientX - drag.startX),
      window.innerWidth - 120
    )
    const y = Math.min(
      Math.max(0, drag.rect.y + event.clientY - drag.startY),
      window.innerHeight - TASKBAR_HEIGHT - 24
    )
    setRect({ ...drag.rect, x, y })
  }

  function onTitlePointerUp(event: React.PointerEvent<HTMLDivElement>) {
    if (dragRef.current?.pointerId === event.pointerId) {
      dragRef.current = null
      if (event.currentTarget.hasPointerCapture(event.pointerId)) {
        event.currentTarget.releasePointerCapture(event.pointerId)
      }
    }
  }

  function onResizePointerDown(event: React.PointerEvent<HTMLDivElement>) {
    if (maximized) return
    const element = windowRef.current
    if (!element) return
    const bounds = element.getBoundingClientRect()
    const base = rect ?? {
      x: bounds.left,
      y: bounds.top,
      w: bounds.width,
      h: bounds.height,
    }
    if (!base.w || !base.h) return
    event.preventDefault()
    setRect(base)
    resizeRef.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      rect: base,
    }
    event.currentTarget.setPointerCapture(event.pointerId)
  }

  function onResizePointerMove(event: React.PointerEvent<HTMLDivElement>) {
    const resize = resizeRef.current
    if (!resize || resize.pointerId !== event.pointerId) return
    const width = Math.max(
      MIN_WIDTH,
      Math.min(
        window.innerWidth - resize.rect.x,
        resize.rect.w + event.clientX - resize.startX
      )
    )
    const height = Math.max(
      MIN_HEIGHT,
      Math.min(
        window.innerHeight - TASKBAR_HEIGHT - resize.rect.y,
        resize.rect.h + event.clientY - resize.startY
      )
    )
    setRect({ ...resize.rect, w: width, h: height })
  }

  function onResizePointerUp(event: React.PointerEvent<HTMLDivElement>) {
    if (resizeRef.current?.pointerId === event.pointerId) {
      resizeRef.current = null
      if (event.currentTarget.hasPointerCapture(event.pointerId)) {
        event.currentTarget.releasePointerCapture(event.pointerId)
      }
    }
  }

  function openDesktopIcon(id: string) {
    if (id === "notepad") {
      launchNotepad()
      return
    }
    const icon = DESKTOP_ICONS.find((entry) => entry.id === id)
    showBalloon(`${icon?.label ?? "This item"} is not available in this demo.`)
  }

  const windowStyle: React.CSSProperties = maximized
    ? {}
    : rect
      ? { left: rect.x, top: rect.y, width: rect.w, height: rect.h }
      : {
          left: "50%",
          top: "45%",
          width: "min(880px, 90vw)",
          height: "min(620px, 72vh)",
          transform: "translate(-50%, -50%)",
        }

  return (
    <>
      <div className="np-desktop">
        <Image
          className="np-wallpaper"
          src="/img-wallpaper.jpeg"
          alt=""
          fill
          priority
          sizes="100vw"
        />

        <div className="np-icons">
          {DESKTOP_ICONS.map(({ id, label, Icon }) => (
            <Button
              key={id}
              className="np-icon"
              data-selected={selectedIcon === id ? "" : undefined}
              onClick={() => setSelectedIcon(id)}
              onDoubleClick={() => openDesktopIcon(id)}
            >
              <Icon className="np-icon-art" />
              <span className="np-icon-label">{label}</span>
            </Button>
          ))}
        </div>

        {windowOpen && (
          <section
            ref={windowRef}
            className={[
              "np-window",
              maximized ? "np-window--max" : "",
              minimized ? "np-window--min" : "",
            ]
              .filter(Boolean)
              .join(" ")}
            style={windowStyle}
            aria-label={windowTitle}
          >
            <div
              className="np-titlebar"
              onPointerDown={onTitlePointerDown}
              onPointerMove={onTitlePointerMove}
              onPointerUp={onTitlePointerUp}
              onPointerCancel={onTitlePointerUp}
              onDoubleClick={() => {
                if (!maximized) setMaximized(true)
                else setMaximized(false)
              }}
            >
              <span className="np-titlebar-icon" aria-hidden="true">
                <NotepadIcon />
              </span>
              <span className="np-titlebar-text">{windowTitle}</span>
              <span className="np-titlebar-controls">
                <Button
                  className="np-title-button"
                  aria-label="Minimize"
                  data-window-control
                  onClick={() => setMinimized(true)}
                >
                  <MinimizeIcon />
                </Button>
                <Button
                  className="np-title-button"
                  aria-label={maximized ? "Restore" : "Maximize"}
                  data-window-control
                  onClick={() => setMaximized((value) => !value)}
                >
                  {maximized ? <RestoreIcon /> : <MaximizeIcon />}
                </Button>
                <Button
                  className="np-title-button np-title-button--close"
                  aria-label="Close"
                  data-window-control
                  onClick={closeWindow}
                >
                  <CloseIcon />
                </Button>
              </span>
            </div>

            <NotepadMenuBar
              canUndo={historyLength > 0}
              hasSelection={hasSelection}
              hasText={text.length > 0}
              wordWrap={wordWrap}
              statusBar={statusBar}
              dirty={dirty}
              onCommand={runCommand}
            />

            <div className="np-editor" ref={editorWrapRef}>
              <Textarea
                aria-label="Text editor"
                className="np-textarea"
                value={text}
                onValueChange={handleValueChange}
                onClick={syncSelection}
                onKeyUp={syncSelection}
                wrap={wordWrap ? "soft" : "off"}
                spellCheck={false}
                autoComplete="off"
                autoCorrect="off"
                style={style}
              />
            </div>

            {statusBar && (
              <div className="np-statusbar">
                <span className="np-status-cell">
                  Ln {line}, Col {column}
                </span>
                <span className="np-status-fill" />
              </div>
            )}

            {!maximized && (
              <div
                className="np-resize-grip"
                aria-hidden="true"
                onPointerDown={onResizePointerDown}
                onPointerMove={onResizePointerMove}
                onPointerUp={onResizePointerUp}
                onPointerCancel={onResizePointerUp}
              />
            )}
          </section>
        )}

        <div className="np-taskbar">
          <StartMenu
            onOpenNotepad={launchNotepad}
            onUnavailable={(name) =>
              showBalloon(`${name} is not available in this demo.`)
            }
          />
          <span className="np-taskbar-divider" aria-hidden="true" />
          <div className="np-task-list">
            {windowOpen && (
              <Button
                className="np-task-button"
                data-active={!minimized ? "" : undefined}
                onClick={() => {
                  if (minimized) setMinimized(false)
                  else setMinimized(true)
                }}
              >
                <span className="np-task-icon" aria-hidden="true">
                  <NotepadIcon />
                </span>
                <span className="np-task-label">{windowTitle}</span>
              </Button>
            )}
          </div>
          <div className="np-tray">
            <span className="np-tray-speaker" aria-hidden="true">
              <SpeakerIcon />
            </span>
            <span className="np-clock">{clock}</span>
          </div>
        </div>

        {balloon && (
          <div className="np-balloon" role="status">
            {balloon}
          </div>
        )}
      </div>

      <AboutDialog open={aboutOpen} onOpenChange={setAboutOpen} />
      <FontDialog
        key={fontOpen ? "font-open" : "font-closed"}
        open={fontOpen}
        onOpenChange={setFontOpen}
        font={font}
        onApply={setFont}
      />
      <PageSetupDialog
        key={pageSetupOpen ? "setup-open" : "setup-closed"}
        open={pageSetupOpen}
        onOpenChange={setPageSetupOpen}
        setup={pageSetup}
        onApply={setPageSetup}
        onPrint={() => window.print()}
      />
      <FindDialog
        open={findOpen}
        onOpenChange={setFindOpen}
        query={findQuery}
        onQueryChange={setFindQuery}
        matchCase={findMatchCase}
        onMatchCaseChange={setFindMatchCase}
        direction={findDirection}
        onDirectionChange={setFindDirection}
        onFindNext={() => findNext()}
      />
      <ReplaceDialog
        open={replaceOpen}
        onOpenChange={setReplaceOpen}
        query={findQuery}
        onQueryChange={setFindQuery}
        replacement={findReplacement}
        onReplacementChange={setFindReplacement}
        matchCase={findMatchCase}
        onMatchCaseChange={setFindMatchCase}
        onFindNext={() => findNext()}
        onReplace={replaceCurrent}
        onReplaceAll={replaceAll}
      />
      <GoToDialog
        key={goToOpen ? "goto-open" : "goto-closed"}
        open={goToOpen}
        onOpenChange={setGoToOpen}
        onGoTo={goToLine}
      />
      <UnsavedDialog
        open={unsavedOpen}
        name={displayName}
        onDecision={handleSaveDecision}
      />

      {isClient && (
        <div className="np-print" aria-hidden="true">
          <div
            className="np-print-page"
            style={{
              padding: `${pageSetup.margins.top}in ${pageSetup.margins.right}in ${pageSetup.margins.bottom}in ${pageSetup.margins.left}in`,
            }}
          >
            {pageSetup.header && (
              <div
                className="np-print-header"
                style={{ textAlign: printAlign(pageSetup.header) }}
              >
                {expandPrintTokens(pageSetup.header, displayName)}
              </div>
            )}
            <pre className="np-print-text" style={style}>
              {text}
            </pre>
            {pageSetup.footer && (
              <div
                className="np-print-footer"
                style={{ textAlign: printAlign(pageSetup.footer) }}
              >
                {expandPrintTokens(pageSetup.footer, displayName)}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  )
}
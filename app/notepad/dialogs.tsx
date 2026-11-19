"use client"

import * as React from "react"
import {
  AlertDialog,
  AlertDialogClose,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
} from "@ui-sdk/react/alert-dialog"
import { Button } from "@ui-sdk/react/button"
import { Checkbox, CheckboxIndicator } from "@ui-sdk/react/checkbox"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@ui-sdk/react/dialog"
import { Field, FieldLabel } from "@ui-sdk/react/field"
import { Input } from "@ui-sdk/react/input"
import { Radio, RadioGroup, RadioIndicator } from "@ui-sdk/react/radio"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@ui-sdk/react/select"
import {
  CheckIcon,
  ChevronDownIcon,
  CloseIcon,
  NotepadIcon,
  WarningIcon,
} from "./icons"
import {
  FONT_FAMILIES,
  FONT_SIZES,
  FONT_STYLES,
  type FontChoice,
  type PageSetup,
} from "./types"

type OpenChange = (open: boolean) => void

function DialogFrame({
  title,
  open,
  onOpenChange,
  closeLabel,
  className,
  modal,
  closeOnOutsidePress,
  children,
}: {
  title: string
  open: boolean
  onOpenChange: OpenChange
  closeLabel: string
  className?: string
  modal?: boolean | "trap-focus"
  closeOnOutsidePress?: boolean
  children: React.ReactNode
}) {
  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
      modal={modal}
      closeOnOutsidePress={closeOnOutsidePress}
    >
      <DialogContent className={`np-dialog ${className ?? ""}`}>
        <div className="np-dialog-caption">
          <DialogTitle className="np-dialog-title">{title}</DialogTitle>
          <DialogClose className="np-caption-close" aria-label={closeLabel}>
            <CloseIcon />
          </DialogClose>
        </div>
        {children}
      </DialogContent>
    </Dialog>
  )
}

function DialogButtons({ children }: { children: React.ReactNode }) {
  return <div className="np-dialog-buttons">{children}</div>
}

function MatchCase({
  checked,
  onCheckedChange,
}: {
  checked: boolean
  onCheckedChange: (checked: boolean) => void
}) {
  return (
    <label className="np-check">
      <Checkbox
        checked={checked}
        onCheckedChange={(value) => onCheckedChange(value === true)}
      >
        <CheckboxIndicator>
          <CheckIcon />
        </CheckboxIndicator>
      </Checkbox>
      Match case
    </label>
  )
}

export function AboutDialog({
  open,
  onOpenChange,
}: {
  open: boolean
  onOpenChange: OpenChange
}) {
  return (
    <DialogFrame
      title="About Notepad"
      open={open}
      onOpenChange={onOpenChange}
      closeLabel="Close About Notepad"
      className="np-dialog--about"
    >
      <DialogDescription className="np-sr-only">
        About Notepad and Windows XP.
      </DialogDescription>
      <div className="np-dialog-body np-about">
        <div className="np-about-mark">
          <NotepadIcon className="np-about-icon" />
        </div>
        <div className="np-about-copy">
          <h3>Notepad</h3>
          <p>Microsoft Windows XP</p>
          <p>Version 5.1 (Build 2600.xpsp_sp3_qfe.130704-0421)</p>
          <p>Copyright &copy; 1981-2001 Microsoft Corporation</p>
          <p className="np-about-small">
            This recreation is a work of nostalgia. All trademarks belong to
            their owners.
          </p>
        </div>
      </div>
      <DialogButtons>
        <DialogClose className="np-button np-button--default">OK</DialogClose>
      </DialogButtons>
    </DialogFrame>
  )
}

export function FontDialog({
  open,
  onOpenChange,
  font,
  onApply,
}: {
  open: boolean
  onOpenChange: OpenChange
  font: FontChoice
  onApply: (font: FontChoice) => void
}) {
  const [draft, setDraft] = React.useState(font)

  const sampleStyle: React.CSSProperties = {
    fontFamily: `"${draft.family}", Menlo, Consolas, "Lucida Console", monospace`,
    fontSize: `${Math.min(draft.size, 24)}pt`,
    fontStyle:
      draft.style === "Italic" || draft.style === "Bold Italic"
        ? "italic"
        : "normal",
    fontWeight:
      draft.style === "Bold" || draft.style === "Bold Italic" ? 700 : 400,
  }

  return (
    <DialogFrame
      title="Font"
      open={open}
      onOpenChange={onOpenChange}
      closeLabel="Close Font"
      className="np-dialog--font"
    >
      <DialogDescription className="np-sr-only">
        Choose the font, style and size for the document.
      </DialogDescription>
      <div className="np-dialog-body">
        <div className="np-font-grid">
          <div className="np-field">
            <Select
              value={draft.family}
              onValueChange={(value) =>
                setDraft((current) => ({
                  ...current,
                  family: value ?? current.family,
                }))
              }
            >
              <SelectLabel className="np-label">Font</SelectLabel>
              <SelectTrigger className="np-select">
                <SelectValue />
                <span className="np-select-button" aria-hidden="true">
                  <ChevronDownIcon />
                </span>
              </SelectTrigger>
              <SelectContent className="np-select-menu np-font-families">
                {FONT_FAMILIES.map((family) => (
                  <SelectItem key={family} value={family}>
                    {family}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="np-field">
            <Select
              value={draft.style}
              onValueChange={(value) =>
                setDraft((current) => ({
                  ...current,
                  style: value ? (value as FontChoice["style"]) : "Regular",
                }))
              }
            >
              <SelectLabel className="np-label">Font style</SelectLabel>
              <SelectTrigger className="np-select">
                <SelectValue />
                <span className="np-select-button" aria-hidden="true">
                  <ChevronDownIcon />
                </span>
              </SelectTrigger>
              <SelectContent className="np-select-menu">
                {FONT_STYLES.map((style) => (
                  <SelectItem key={style} value={style}>
                    {style}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="np-field">
            <Select
              value={String(draft.size)}
              onValueChange={(value) =>
                setDraft((current) => ({ ...current, size: Number(value) }))
              }
            >
              <SelectLabel className="np-label">Size</SelectLabel>
              <SelectTrigger className="np-select">
                <SelectValue />
                <span className="np-select-button" aria-hidden="true">
                  <ChevronDownIcon />
                </span>
              </SelectTrigger>
              <SelectContent className="np-select-menu np-font-sizes">
                {FONT_SIZES.map((size) => (
                  <SelectItem key={size} value={String(size)}>
                    {size}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="np-font-bottom">
          <div className="np-sample">
            <div className="np-sample-text" style={sampleStyle}>
              AaBbYyZz
            </div>
          </div>
          <div className="np-field">
            <Select value="Western" onValueChange={() => {}}>
              <SelectLabel className="np-label">Script</SelectLabel>
              <SelectTrigger className="np-select">
                <SelectValue />
                <span className="np-select-button" aria-hidden="true">
                  <ChevronDownIcon />
                </span>
              </SelectTrigger>
              <SelectContent className="np-select-menu">
                <SelectItem value="Western">Western</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
      <DialogButtons>
        <DialogClose
          className="np-button np-button--default"
          action={() => onApply(draft)}
        >
          OK
        </DialogClose>
        <DialogClose className="np-button">Cancel</DialogClose>
        <Button
          className="np-button"
          disabled={
            draft.family === font.family &&
            draft.style === font.style &&
            draft.size === font.size
          }
          onClick={() => onApply(draft)}
        >
          Apply
        </Button>
      </DialogButtons>
    </DialogFrame>
  )
}

export function FindDialog({
  open,
  onOpenChange,
  query,
  onQueryChange,
  matchCase,
  onMatchCaseChange,
  direction,
  onDirectionChange,
  onFindNext,
}: {
  open: boolean
  onOpenChange: OpenChange
  query: string
  onQueryChange: (value: string) => void
  matchCase: boolean
  onMatchCaseChange: (value: boolean) => void
  direction: "up" | "down"
  onDirectionChange: (value: "up" | "down") => void
  onFindNext: () => void
}) {
  return (
    <DialogFrame
      title="Find"
      open={open}
      onOpenChange={onOpenChange}
      closeLabel="Close Find"
      className="np-dialog--find"
      modal={false}
      closeOnOutsidePress={false}
    >
      <DialogDescription className="np-sr-only">
        Find text in the document.
      </DialogDescription>
      <div className="np-dialog-body">
        <Field className="np-field">
          <FieldLabel className="np-label">Find what</FieldLabel>
          <Input
            className="np-input"
            value={query}
            onValueChange={onQueryChange}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                event.preventDefault()
                onFindNext()
              }
            }}
          />
        </Field>
        <MatchCase checked={matchCase} onCheckedChange={onMatchCaseChange} />
        <fieldset className="np-direction">
          <legend>Direction</legend>
          <RadioGroup
            className="np-radio-group"
            aria-label="Direction"
            value={direction}
            onValueChange={(value) => {
              if (value === "up" || value === "down") onDirectionChange(value)
            }}
          >
            <label className="np-radio">
              <Radio value="up">
                <RadioIndicator />
              </Radio>
              Up
            </label>
            <label className="np-radio">
              <Radio value="down">
                <RadioIndicator />
              </Radio>
              Down
            </label>
          </RadioGroup>
        </fieldset>
      </div>
      <DialogButtons>
        <Button className="np-button np-button--default" onClick={onFindNext}>
          Find Next
        </Button>
        <DialogClose className="np-button">Cancel</DialogClose>
      </DialogButtons>
    </DialogFrame>
  )
}

export function ReplaceDialog({
  open,
  onOpenChange,
  query,
  onQueryChange,
  replacement,
  onReplacementChange,
  matchCase,
  onMatchCaseChange,
  onFindNext,
  onReplace,
  onReplaceAll,
}: {
  open: boolean
  onOpenChange: OpenChange
  query: string
  onQueryChange: (value: string) => void
  replacement: string
  onReplacementChange: (value: string) => void
  matchCase: boolean
  onMatchCaseChange: (value: boolean) => void
  onFindNext: () => void
  onReplace: () => void
  onReplaceAll: () => void
}) {
  return (
    <DialogFrame
      title="Replace"
      open={open}
      onOpenChange={onOpenChange}
      closeLabel="Close Replace"
      className="np-dialog--replace"
      modal={false}
      closeOnOutsidePress={false}
    >
      <DialogDescription className="np-sr-only">
        Find text and replace it in the document.
      </DialogDescription>
      <div className="np-dialog-body">
        <Field className="np-field">
          <FieldLabel className="np-label">Find what</FieldLabel>
          <Input
            className="np-input"
            value={query}
            onValueChange={onQueryChange}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                event.preventDefault()
                onFindNext()
              }
            }}
          />
        </Field>
        <Field className="np-field">
          <FieldLabel className="np-label">Replace with</FieldLabel>
          <Input
            className="np-input"
            value={replacement}
            onValueChange={onReplacementChange}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                event.preventDefault()
                onReplace()
              }
            }}
          />
        </Field>
        <MatchCase checked={matchCase} onCheckedChange={onMatchCaseChange} />
      </div>
      <DialogButtons>
        <Button className="np-button np-button--default" onClick={onFindNext}>
          Find Next
        </Button>
        <Button className="np-button" onClick={onReplace}>
          Replace
        </Button>
        <Button className="np-button" onClick={onReplaceAll}>
          Replace All
        </Button>
        <DialogClose className="np-button">Cancel</DialogClose>
      </DialogButtons>
    </DialogFrame>
  )
}

export function GoToDialog({
  open,
  onOpenChange,
  onGoTo,
}: {
  open: boolean
  onOpenChange: OpenChange
  onGoTo: (line: number) => void
}) {
  const [line, setLine] = React.useState("1")

  const go = () => {
    const value = Number.parseInt(line, 10)
    onGoTo(Number.isFinite(value) ? value : 1)
    onOpenChange(false)
  }

  return (
    <DialogFrame
      title="Go To Line"
      open={open}
      onOpenChange={onOpenChange}
      closeLabel="Close Go To"
      className="np-dialog--goto"
    >
      <DialogDescription className="np-sr-only">
        Move the caret to a line in the document.
      </DialogDescription>
      <div className="np-dialog-body">
        <Field className="np-field">
          <FieldLabel className="np-label">Line number</FieldLabel>
          <Input
            className="np-input np-input--number"
            type="number"
            min={1}
            value={line}
            onValueChange={setLine}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                event.preventDefault()
                go()
              }
            }}
          />
        </Field>
      </div>
      <DialogButtons>
        <Button className="np-button np-button--default" onClick={go}>
          Go To
        </Button>
        <DialogClose className="np-button">Cancel</DialogClose>
      </DialogButtons>
    </DialogFrame>
  )
}

export function PageSetupDialog({
  open,
  onOpenChange,
  setup,
  onApply,
  onPrint,
}: {
  open: boolean
  onOpenChange: OpenChange
  setup: PageSetup
  onApply: (setup: PageSetup) => void
  onPrint: () => void
}) {
  const [draft, setDraft] = React.useState(setup)

  const setMargin = (key: keyof PageSetup["margins"], value: string) => {
    const number = Number.parseFloat(value)
    setDraft((current) => ({
      ...current,
      margins: {
        ...current.margins,
        [key]: Number.isFinite(number) ? number : 0,
      },
    }))
  }

  return (
    <DialogFrame
      title="Page Setup"
      open={open}
      onOpenChange={onOpenChange}
      closeLabel="Close Page Setup"
      className="np-dialog--setup"
    >
      <DialogDescription className="np-sr-only">
        Choose the paper, orientation and margins for printing.
      </DialogDescription>
      <div className="np-dialog-body">
        <div className="np-setup-top">
          <div className="np-field">
            <Select
              value={draft.paper}
              onValueChange={(value) =>
                setDraft((current) => ({
                  ...current,
                  paper: value as PageSetup["paper"],
                }))
              }
            >
              <SelectLabel className="np-label">Paper size</SelectLabel>
              <SelectTrigger className="np-select">
                <SelectValue />
                <span className="np-select-button" aria-hidden="true">
                  <ChevronDownIcon />
                </span>
              </SelectTrigger>
              <SelectContent className="np-select-menu">
                <SelectItem value="Letter">Letter (8 1/2 x 11 in)</SelectItem>
                <SelectItem value="A4">A4 (210 x 297 mm)</SelectItem>
                <SelectItem value="Legal">Legal (8 1/2 x 14 in)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="np-field">
            <Select
              value={draft.orientation}
              onValueChange={(value) =>
                setDraft((current) => ({
                  ...current,
                  orientation: value as PageSetup["orientation"],
                }))
              }
            >
              <SelectLabel className="np-label">Orientation</SelectLabel>
              <SelectTrigger className="np-select">
                <SelectValue />
                <span className="np-select-button" aria-hidden="true">
                  <ChevronDownIcon />
                </span>
              </SelectTrigger>
              <SelectContent className="np-select-menu">
                <SelectItem value="Portrait">Portrait</SelectItem>
                <SelectItem value="Landscape">Landscape</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <fieldset className="np-group">
          <legend>Margins (inches)</legend>
          <div className="np-margins">
            <Field className="np-field">
              <FieldLabel className="np-label">Left</FieldLabel>
              <Input
                className="np-input np-input--number"
                type="number"
                step="0.05"
                min="0"
                value={String(draft.margins.left)}
                onValueChange={(value) => setMargin("left", value)}
              />
            </Field>
            <Field className="np-field">
              <FieldLabel className="np-label">Right</FieldLabel>
              <Input
                className="np-input np-input--number"
                type="number"
                step="0.05"
                min="0"
                value={String(draft.margins.right)}
                onValueChange={(value) => setMargin("right", value)}
              />
            </Field>
            <Field className="np-field">
              <FieldLabel className="np-label">Top</FieldLabel>
              <Input
                className="np-input np-input--number"
                type="number"
                step="0.05"
                min="0"
                value={String(draft.margins.top)}
                onValueChange={(value) => setMargin("top", value)}
              />
            </Field>
            <Field className="np-field">
              <FieldLabel className="np-label">Bottom</FieldLabel>
              <Input
                className="np-input np-input--number"
                type="number"
                step="0.05"
                min="0"
                value={String(draft.margins.bottom)}
                onValueChange={(value) => setMargin("bottom", value)}
              />
            </Field>
          </div>
        </fieldset>

        <fieldset className="np-group">
          <legend>Header/Footer</legend>
          <Field className="np-field">
            <FieldLabel className="np-label">Header</FieldLabel>
            <Input
              className="np-input"
              value={draft.header}
              onValueChange={(value) =>
                setDraft((current) => ({ ...current, header: value }))
              }
            />
          </Field>
          <Field className="np-field">
            <FieldLabel className="np-label">Footer</FieldLabel>
            <Input
              className="np-input"
              value={draft.footer}
              onValueChange={(value) =>
                setDraft((current) => ({ ...current, footer: value }))
              }
            />
          </Field>
        </fieldset>
      </div>
      <DialogButtons>
        <DialogClose
          className="np-button np-button--default"
          action={() => onApply(draft)}
        >
          OK
        </DialogClose>
        <DialogClose className="np-button">Cancel</DialogClose>
        <Button
          className="np-button"
          onClick={() => {
            onApply(draft)
            onOpenChange(false)
            setTimeout(onPrint, 0)
          }}
        >
          Print...
        </Button>
      </DialogButtons>
    </DialogFrame>
  )
}

export type SaveDecision = "yes" | "no" | "cancel"

export function UnsavedDialog({
  open,
  name,
  onDecision,
}: {
  open: boolean
  name: string
  onDecision: (decision: SaveDecision) => void
}) {
  return (
    <AlertDialog
      open={open}
      onOpenChange={(next, details) => {
        if (next) return
        const value = details.returnValue
        onDecision(
          value === "yes" ? "yes" : value === "no" ? "no" : "cancel"
        )
      }}
    >
      <AlertDialogContent className="np-dialog np-dialog--message">
        <div className="np-dialog-caption">
          <AlertDialogTitle className="np-dialog-title">
            Notepad
          </AlertDialogTitle>
          <AlertDialogClose
            className="np-caption-close"
            aria-label="Close Notepad message"
          >
            <CloseIcon />
          </AlertDialogClose>
        </div>
        <div className="np-dialog-body np-message-body">
          <div className="np-message-icon" aria-hidden="true">
            <WarningIcon />
          </div>
          <AlertDialogDescription className="np-message-text">
            The text in the {name} file has changed.
            <br />
            <br />
            Do you want to save the changes?
          </AlertDialogDescription>
        </div>
        <div className="np-dialog-buttons">
          <AlertDialogClose
            value="yes"
            className="np-button np-button--default"
          >
            Yes
          </AlertDialogClose>
          <AlertDialogClose value="no" className="np-button">
            No
          </AlertDialogClose>
          <AlertDialogClose value="cancel" className="np-button">
            Cancel
          </AlertDialogClose>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  )
}

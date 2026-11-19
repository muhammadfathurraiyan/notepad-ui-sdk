"use client"

import {
  Menu,
  MenuCheckboxItem,
  MenuContent,
  MenuItem,
  MenuItemIndicator,
  MenuSeparator,
  MenuShortcut,
  MenuTrigger,
} from "@ui-sdk/react/menu"
import { Menubar } from "@ui-sdk/react/menubar"
import {
  CheckIcon,
  ComputerIcon,
  FolderIcon,
  HelpIcon,
  LogOffIcon,
  NotepadIcon,
  PowerIcon,
  ProgramsIcon,
  RunIcon,
  SearchIcon,
  SettingsIcon,
  StartFlag,
  UserIcon,
} from "./icons"
import type { MenuCommand } from "./types"

type MenuBarProps = {
  canUndo: boolean
  hasSelection: boolean
  hasText: boolean
  wordWrap: boolean
  statusBar: boolean
  dirty: boolean
  onCommand: (command: MenuCommand) => void
}

/**
 * The underlined access key inside a label. Splitting the label into several
 * nodes would make screen readers read it as "F ile", so the visual text is
 * hidden from assistive technology and the full label is exposed with
 * aria-label on the surrounding item.
 */
function Mnemonic({ children }: { children: string }) {
  return <span className="np-mnemonic">{children}</span>
}

/**
 * Notepad always shows Windows accelerator text ("Ctrl+N", not "⌘N"), so the
 * shortcut is written out instead of using the menu item's shortcut prop,
 * which formats for the current platform.
 */
function Keys({ children }: { children: string }) {
  return <MenuShortcut>{children}</MenuShortcut>
}

export function NotepadMenuBar({
  canUndo,
  hasSelection,
  hasText,
  wordWrap,
  statusBar,
  dirty,
  onCommand,
}: MenuBarProps) {
  const run = (value: string) => onCommand(value as MenuCommand)

  return (
    <Menubar className="np-menubar" aria-label="Application menu">
      <Menu onAction={run}>
        <MenuTrigger className="np-menu-trigger" aria-label="File">
          <Mnemonic>F</Mnemonic>ile
        </MenuTrigger>
        <MenuContent className="np-menu" sideOffset={1}>
          <MenuItem value="new" label="New" aria-label="New">
            <Mnemonic>N</Mnemonic>ew
            <Keys>Ctrl+N</Keys>
          </MenuItem>
          <MenuItem value="open" label="Open" aria-label="Open">
            <Mnemonic>O</Mnemonic>pen...
            <Keys>Ctrl+O</Keys>
          </MenuItem>
          <MenuItem value="save" label="Save" aria-label="Save">
            <Mnemonic>S</Mnemonic>ave
            <Keys>Ctrl+S</Keys>
          </MenuItem>
          <MenuItem value="save-as" label="Save As" aria-label="Save As">
            Save <Mnemonic>A</Mnemonic>s...
          </MenuItem>
          <MenuSeparator />
          <MenuItem value="page-setup" label="Page Setup" aria-label="Page Setup">
            Page Set<Mnemonic>u</Mnemonic>p...
          </MenuItem>
          <MenuItem value="print" label="Print" aria-label="Print">
            <Mnemonic>P</Mnemonic>rint...
            <Keys>Ctrl+P</Keys>
          </MenuItem>
          <MenuSeparator />
          <MenuItem
            value="exit"
            label="Exit"
            aria-label="Exit"
            data-agent-confirm={
              dirty
                ? "Closes Notepad and may discard the unsaved text"
                : undefined
            }
          >
            E<Mnemonic>x</Mnemonic>it
          </MenuItem>
        </MenuContent>
      </Menu>

      <Menu onAction={run}>
        <MenuTrigger className="np-menu-trigger" aria-label="Edit">
          <Mnemonic>E</Mnemonic>dit
        </MenuTrigger>
        <MenuContent className="np-menu" sideOffset={1}>
          <MenuItem
            value="undo"
            label="Undo"
            aria-label="Undo"
            disabled={!canUndo}
          >
            <Mnemonic>U</Mnemonic>ndo
            <Keys>Ctrl+Z</Keys>
          </MenuItem>
          <MenuSeparator />
          <MenuItem
            value="cut"
            label="Cut"
            aria-label="Cut"
            disabled={!hasSelection}
          >
            Cu<Mnemonic>t</Mnemonic>
            <Keys>Ctrl+X</Keys>
          </MenuItem>
          <MenuItem
            value="copy"
            label="Copy"
            aria-label="Copy"
            disabled={!hasSelection}
          >
            <Mnemonic>C</Mnemonic>opy
            <Keys>Ctrl+C</Keys>
          </MenuItem>
          <MenuItem value="paste" label="Paste" aria-label="Paste">
            <Mnemonic>P</Mnemonic>aste
            <Keys>Ctrl+V</Keys>
          </MenuItem>
          <MenuItem
            value="delete"
            label="Delete"
            aria-label="Delete"
            disabled={!hasSelection}
          >
            <Mnemonic>D</Mnemonic>elete
            <Keys>Del</Keys>
          </MenuItem>
          <MenuSeparator />
          <MenuItem value="find" label="Find" aria-label="Find">
            <Mnemonic>F</Mnemonic>ind...
            <Keys>Ctrl+F</Keys>
          </MenuItem>
          <MenuItem value="find-next" label="Find Next" aria-label="Find Next">
            Find <Mnemonic>N</Mnemonic>ext
            <Keys>F3</Keys>
          </MenuItem>
          <MenuItem value="replace" label="Replace" aria-label="Replace">
            <Mnemonic>R</Mnemonic>eplace...
            <Keys>Ctrl+H</Keys>
          </MenuItem>
          <MenuItem value="go-to" label="Go To" aria-label="Go To">
            <Mnemonic>G</Mnemonic>o To...
            <Keys>Ctrl+G</Keys>
          </MenuItem>
          <MenuSeparator />
          <MenuItem
            value="select-all"
            label="Select All"
            aria-label="Select All"
            disabled={!hasText}
          >
            Select <Mnemonic>A</Mnemonic>ll
            <Keys>Ctrl+A</Keys>
          </MenuItem>
          <MenuItem value="time-date" label="Time/Date" aria-label="Time/Date">
            Time/<Mnemonic>D</Mnemonic>ate
            <Keys>F5</Keys>
          </MenuItem>
        </MenuContent>
      </Menu>

      <Menu onAction={run}>
        <MenuTrigger className="np-menu-trigger" aria-label="Format">
          <Mnemonic>F</Mnemonic>ormat
        </MenuTrigger>
        <MenuContent className="np-menu" sideOffset={1}>
          <MenuCheckboxItem
            value="word-wrap"
            label="Word Wrap"
            aria-label="Word Wrap"
            checked={wordWrap}
            closeOnSelect
            onCheckedChange={() => onCommand("word-wrap")}
          >
            <MenuItemIndicator keepMounted>
              <CheckIcon />
            </MenuItemIndicator>
            <Mnemonic>W</Mnemonic>ord Wrap
          </MenuCheckboxItem>
          <MenuItem value="font" label="Font" aria-label="Font">
            <Mnemonic>F</Mnemonic>ont...
          </MenuItem>
        </MenuContent>
      </Menu>

      <Menu onAction={run}>
        <MenuTrigger className="np-menu-trigger" aria-label="View">
          <Mnemonic>V</Mnemonic>iew
        </MenuTrigger>
        <MenuContent className="np-menu" sideOffset={1}>
          <MenuCheckboxItem
            value="status-bar"
            label="Status Bar"
            aria-label="Status Bar"
            checked={statusBar}
            closeOnSelect
            onCheckedChange={() => onCommand("status-bar")}
          >
            <MenuItemIndicator keepMounted>
              <CheckIcon />
            </MenuItemIndicator>
            <Mnemonic>S</Mnemonic>tatus Bar
          </MenuCheckboxItem>
        </MenuContent>
      </Menu>

      <Menu onAction={run}>
        <MenuTrigger className="np-menu-trigger" aria-label="Help">
          <Mnemonic>H</Mnemonic>elp
        </MenuTrigger>
        <MenuContent className="np-menu" sideOffset={1}>
          <MenuItem value="about" label="About Notepad" aria-label="About Notepad">
            <Mnemonic>A</Mnemonic>bout Notepad
          </MenuItem>
        </MenuContent>
      </Menu>
    </Menubar>
  )
}

type StartMenuProps = {
  onOpenNotepad: () => void
  onUnavailable: (name: string) => void
}

export function StartMenu({ onOpenNotepad, onUnavailable }: StartMenuProps) {
  const run = (value: string) => {
    if (value === "notepad") onOpenNotepad()
    else onUnavailable(value)
  }

  return (
    <Menu onAction={run}>
      <MenuTrigger className="np-start" aria-label="Start">
        <StartFlag />
        <span className="np-start-word">start</span>
      </MenuTrigger>
      <MenuContent
        className="np-start-menu"
        side="top"
        align="start"
        sideOffset={0}
        alignOffset={0}
        collisionPadding={0}
      >
        <div className="np-start-header">
          <div className="np-start-avatar" aria-hidden="true">
            <UserIcon />
          </div>
          <span className="np-start-user">Owner</span>
        </div>
        <div className="np-start-columns">
          <div className="np-start-col np-start-col--main">
            <MenuItem value="notepad" label="Notepad" className="np-start-item">
              <span className="np-start-item-icon" aria-hidden="true">
                <NotepadIcon />
              </span>
              Notepad
            </MenuItem>
            <MenuSeparator />
            <MenuItem
              value="programs"
              label="All Programs"
              className="np-start-item"
            >
              <span className="np-start-item-icon" aria-hidden="true">
                <ProgramsIcon />
              </span>
              All Programs
              <span className="np-start-arrow" aria-hidden="true">
                ▸
              </span>
            </MenuItem>
          </div>
          <div className="np-start-col np-start-col--places">
            <MenuItem
              value="my-documents"
              label="My Documents"
              className="np-start-item"
            >
              <span className="np-start-item-icon" aria-hidden="true">
                <FolderIcon />
              </span>
              My Documents
            </MenuItem>
            <MenuItem
              value="my-computer"
              label="My Computer"
              className="np-start-item"
            >
              <span className="np-start-item-icon" aria-hidden="true">
                <ComputerIcon />
              </span>
              My Computer
            </MenuItem>
            <MenuItem
              value="control-panel"
              label="Control Panel"
              className="np-start-item"
            >
              <span className="np-start-item-icon" aria-hidden="true">
                <SettingsIcon />
              </span>
              Control Panel
            </MenuItem>
            <MenuSeparator />
            <MenuItem value="help" label="Help and Support" className="np-start-item">
              <span className="np-start-item-icon" aria-hidden="true">
                <HelpIcon />
              </span>
              Help and Support
            </MenuItem>
            <MenuItem value="search" label="Search" className="np-start-item">
              <span className="np-start-item-icon" aria-hidden="true">
                <SearchIcon />
              </span>
              Search
            </MenuItem>
            <MenuItem value="run" label="Run" className="np-start-item">
              <span className="np-start-item-icon" aria-hidden="true">
                <RunIcon />
              </span>
              Run...
            </MenuItem>
          </div>
        </div>
        <div className="np-start-footer">
          <MenuItem
            value="log-off"
            label="Log Off"
            className="np-start-item np-start-item--footer"
          >
            <span className="np-start-item-icon" aria-hidden="true">
              <LogOffIcon />
            </span>
            Log Off
          </MenuItem>
          <MenuItem
            value="turn-off"
            label="Turn Off Computer"
            className="np-start-item np-start-item--footer"
          >
            <span className="np-start-item-icon" aria-hidden="true">
              <PowerIcon />
            </span>
            Turn Off Computer
          </MenuItem>
        </div>
      </MenuContent>
    </Menu>
  )
}

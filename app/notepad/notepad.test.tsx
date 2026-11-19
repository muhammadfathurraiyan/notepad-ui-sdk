import { render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { createAgent } from "@ui-sdk/react/agent"
import { expect, test } from "vitest"
import { Notepad } from "./notepad"

let approve = false
const agent = createAgent({ allow: (step) => !step.confirm || approve })

function editor() {
  return screen.getByLabelText<HTMLTextAreaElement>("Text editor")
}

test("an agent can find and change every control", async () => {
  render(<Notepad />)

  const components = agent
    .snapshot()
    .filter((entry) => !entry.offPage && entry.component !== "more")
  for (const entry of components) {
    expect(
      entry.label,
      `${entry.component} ${entry.ref} has no name`
    ).toBeTruthy()
  }

  const labels = components.map((entry) => entry.label)
  for (const label of [
    "Application menu",
    "Text editor",
    "File",
    "Edit",
    "Format",
    "View",
    "Help",
    "Minimize",
    "Maximize",
    "Close",
    "Start",
    "Untitled - Notepad",
  ]) {
    expect(labels, `${label} is missing from the snapshot`).toContain(label)
  }

  const result = await agent.act({
    steps: [
      {
        ref: "Text editor",
        action: "setValue",
        args: ["Hello, Windows XP!"],
      },
    ],
  })
  expect(result.ok, result.error?.message).toBe(true)
  expect(editor().value).toBe("Hello, Windows XP!")
})

test("Format toggles word wrap", async () => {
  const user = userEvent.setup()
  render(<Notepad />)

  expect(editor()).toHaveAttribute("wrap", "off")

  await user.click(screen.getByRole("menuitem", { name: "Format" }))
  await user.click(
    await screen.findByRole("menuitemcheckbox", { name: "Word Wrap" })
  )

  expect(editor()).toHaveAttribute("wrap", "soft")
})

test("the status bar follows the caret", async () => {
  const user = userEvent.setup()
  render(<Notepad />)

  await user.click(editor())
  await user.type(editor(), "first{Enter}second")

  await waitFor(() => {
    expect(screen.getByText("Ln 2, Col 7")).toBeInTheDocument()
  })
})

test("File > New asks about unsaved text and No discards it", async () => {
  const user = userEvent.setup()
  render(<Notepad />)

  await user.type(editor(), "draft text")
  await user.click(screen.getByRole("menuitem", { name: "File" }))
  await user.click(await screen.findByRole("menuitem", { name: "New" }))

  const dialog = await screen.findByRole("alertdialog", { name: "Notepad" })
  expect(dialog).toBeInTheDocument()
  expect(
    screen.getByText(/The text in the Untitled file has changed/)
  ).toBeInTheDocument()

  await user.click(screen.getByRole("button", { name: "No" }))
  await waitFor(() => expect(editor()).toHaveValue(""))
})

test("Find searches up and respects Match case", async () => {
  const user = userEvent.setup()
  render(<Notepad />)

  const text = editor()
  await user.click(text)
  await user.type(text, "beta BETA beta")

  await user.click(screen.getByRole("menuitem", { name: "Edit" }))
  await user.click(await screen.findByRole("menuitem", { name: "Find" }))
  await screen.findByRole("dialog", { name: "Find" })

  await user.type(
    screen.getByRole("textbox", { name: "Find what" }),
    "BETA"
  )
  await user.click(screen.getByRole("checkbox", { name: "Match case" }))
  await user.click(screen.getByRole("radio", { name: "Up" }))
  await user.click(screen.getByRole("button", { name: "Find Next" }))

  await waitFor(() => expect(text.selectionStart).toBe(5))
  expect(text.selectionEnd).toBe(9)
})

test("Font applies a size and Cancel leaves the old one", async () => {
  const user = userEvent.setup()
  render(<Notepad />)

  await user.click(screen.getByRole("menuitem", { name: "Format" }))
  await user.click(screen.getByRole("menuitem", { name: /^Font/ }))
  await screen.findByRole("dialog", { name: "Font" })

  await user.click(screen.getByRole("combobox", { name: "Size" }))
  await user.click(await screen.findByRole("option", { name: "16" }))
  await user.click(screen.getByRole("button", { name: "Cancel" }))

  await waitFor(() =>
    expect(screen.queryByRole("dialog", { name: "Font" })).not.toBeInTheDocument()
  )
  expect(editor().style.fontSize).not.toBe("16pt")

  await user.click(screen.getByRole("menuitem", { name: "Format" }))
  await user.click(screen.getByRole("menuitem", { name: /^Font/ }))
  await screen.findByRole("dialog", { name: "Font" })
  await user.click(screen.getByRole("combobox", { name: "Size" }))
  await user.click(await screen.findByRole("option", { name: "16" }))
  await user.click(screen.getByRole("button", { name: "OK" }))

  await waitFor(() => expect(editor().style.fontSize).toBe("16pt"))
})

test("an agent must be allowed to exit with unsaved text", async () => {
  approve = false
  render(<Notepad />)

  const changed = await agent.act({
    steps: [
      {
        ref: "Text editor",
        action: "setValue",
        args: ["unsaved work"],
      },
    ],
  })
  expect(changed.ok, changed.error?.message).toBe(true)

  const exit = {
    steps: [{ ref: "File", action: "press", args: ["Exit"] }],
  }
  const refused = await agent.act(exit)
  expect(refused.ok).toBe(false)

  approve = true
  const allowed = await agent.act(exit)
  expect(allowed.ok, allowed.error?.message).toBe(true)
  approve = false

  expect(
    await screen.findByRole("alertdialog", { name: "Notepad" })
  ).toBeInTheDocument()
})

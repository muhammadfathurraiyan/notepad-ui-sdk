export type TextFileHandle = {
  name: string
  getFile: () => Promise<File>
  createWritable: () => Promise<{
    write: (data: string) => Promise<void>
    close: () => Promise<void>
  }>
}

export type OpenedFile = {
  name: string
  text: string
  handle: TextFileHandle | null
}

type PickerWindow = Window & {
  showOpenFilePicker?: (options: unknown) => Promise<TextFileHandle[]>
  showSaveFilePicker?: (options: unknown) => Promise<TextFileHandle>
}

const TEXT_TYPES = [
  {
    description: "Text Documents",
    accept: { "text/plain": [".txt", ".text", ".log", ".ini", ".csv", ".md"] },
  },
]

function openWithInput(): Promise<OpenedFile | null> {
  return new Promise((resolve, reject) => {
    const input = document.createElement("input")
    input.type = "file"
    input.accept = ".txt,.text,.log,.ini,.csv,.md,text/plain"
    input.style.position = "fixed"
    input.style.left = "-9999px"
    document.body.append(input)

    let settled = false
    const finish = (value: OpenedFile | null) => {
      if (settled) return
      settled = true
      input.remove()
      resolve(value)
    }

    input.addEventListener("change", () => {
      const file = input.files?.[0]
      if (!file) {
        finish(null)
        return
      }
      file
        .text()
        .then((text) => finish({ name: file.name, text, handle: null }))
        .catch((error) => {
          input.remove()
          reject(error)
        })
    })

    input.addEventListener("cancel", () => finish(null))
    input.click()
  })
}

export async function openLocalFile(): Promise<OpenedFile | null> {
  const picker = window as PickerWindow
  if (typeof picker.showOpenFilePicker !== "function") return openWithInput()

  try {
    const [handle] = await picker.showOpenFilePicker({
      types: TEXT_TYPES,
      multiple: false,
    })
    if (!handle) return null
    const file = await handle.getFile()
    return { name: file.name, text: await file.text(), handle }
  } catch (error) {
    if ((error as DOMException)?.name === "AbortError") return null
    throw error
  }
}

export async function saveLocalFile(
  text: string,
  suggestedName: string | null,
  handle: TextFileHandle | null
): Promise<{ name: string; handle: TextFileHandle | null } | null> {
  if (handle) {
    const writable = await handle.createWritable()
    await writable.write(text)
    await writable.close()
    return { name: handle.name, handle }
  }

  const name =
    suggestedName && suggestedName !== "Untitled"
      ? suggestedName
      : "Untitled.txt"
  const picker = window as PickerWindow

  if (typeof picker.showSaveFilePicker === "function") {
    try {
      const nextHandle = await picker.showSaveFilePicker({
        suggestedName: name,
        types: [
          {
            description: "Text Documents",
            accept: { "text/plain": [".txt"] },
          },
        ],
      })
      const writable = await nextHandle.createWritable()
      await writable.write(text)
      await writable.close()
      return { name: nextHandle.name, handle: nextHandle }
    } catch (error) {
      if ((error as DOMException)?.name === "AbortError") return null
      throw error
    }
  }

  const blob = new Blob([text], { type: "text/plain;charset=utf-8" })
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement("a")
  anchor.href = url
  anchor.download = name
  document.body.append(anchor)
  anchor.click()
  anchor.remove()
  setTimeout(() => URL.revokeObjectURL(url), 1000)
  return { name, handle: null }
}

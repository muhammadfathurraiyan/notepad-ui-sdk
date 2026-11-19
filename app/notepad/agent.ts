"use client"

import { createAgent, registerTools } from "@ui-sdk/react/agent"

type Agent = ReturnType<typeof createAgent>

let bridge: Agent | undefined

function ask(step: { confirm?: string }) {
  return step.confirm ? window.confirm(step.confirm) : true
}

function getBridge() {
  if (!bridge) {
    bridge = createAgent({ allow: ask })
    ;(window as Window & { notepadAgent?: Agent }).notepadAgent = bridge
  }
  return bridge
}

export function connectAgent() {
  return registerTools(getBridge(), { allow: ask })
}

import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'
import {
  coreActionContracts,
  intentionallyUnavailableActions,
  primaryNavigation,
} from './actionContracts'

const appSource = readFileSync(new URL('./App.tsx', import.meta.url), 'utf8')
const authSource = readFileSync(new URL('./components/OAuthSignIn.tsx', import.meta.url), 'utf8')
const interactiveSource = `${appSource}\n${authSource}`

describe('primary navigation contract', () => {
  it('keeps exactly five unique, user-facing destinations', () => {
    expect(primaryNavigation.map((item) => item.screen)).toEqual([
      'home',
      'rides',
      'crew',
      'safety',
      'profile',
    ])
    expect(new Set(primaryNavigation.map((item) => item.label)).size).toBe(5)
  })
})

describe('core action contract', () => {
  it.each(coreActionContracts)('$id is represented by a wired control', ({ id }) => {
    expect(interactiveSource).toContain(`data-action="${id}"`)
  })

  it.each(intentionallyUnavailableActions)('$0 stays explicitly disabled', (id) => {
    const markerIndex = appSource.indexOf(`data-unavailable-action="${id}"`)
    expect(markerIndex).toBeGreaterThan(-1)
    expect(appSource.slice(markerIndex, markerIndex + 180)).toContain('disabled')
    expect(appSource.slice(markerIndex, markerIndex + 220).toLowerCase()).toContain('unavailable')
  })
})

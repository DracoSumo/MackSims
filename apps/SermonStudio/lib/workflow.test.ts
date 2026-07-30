import { describe, expect, it } from 'vitest'
import { selectWorkflowStep, WORKFLOW_STEPS, workflowPosition } from './workflow'

describe('sermon workflow controls', () => {
  it('keeps the approved workflow in order', () => {
    expect(WORKFLOW_STEPS.map(step => step.id)).toEqual([
      'Draft',
      'Research',
      'Preach',
      'Library',
    ])
  })

  it.each(WORKFLOW_STEPS)('routes the $label control to its state', step => {
    expect(selectWorkflowStep(step.id).workMode).toBe(step.id)
  })

  it('opens the library section when Library is selected', () => {
    expect(selectWorkflowStep('Library')).toEqual({
      workMode: 'Library',
      activeTab: 'Library',
    })
  })

  it('reports progress for every workflow checkpoint', () => {
    expect(workflowPosition('Draft')).toEqual({ current: 1, total: 4 })
    expect(workflowPosition('Research')).toEqual({ current: 2, total: 4 })
    expect(workflowPosition('Preach')).toEqual({ current: 3, total: 4 })
    expect(workflowPosition('Library')).toEqual({ current: 4, total: 4 })
  })
})

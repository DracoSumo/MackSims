export const WORKFLOW_STEPS = [
  { id: 'Draft', label: 'Draft', detail: 'Write' },
  { id: 'Research', label: 'Research', detail: 'Gather' },
  { id: 'Preach', label: 'Preach', detail: 'Deliver' },
  { id: 'Library', label: 'Library', detail: 'Return' },
] as const

export type WorkMode = typeof WORKFLOW_STEPS[number]['id']

export function selectWorkflowStep(mode: WorkMode) {
  return {
    workMode: mode,
    activeTab: mode === 'Library' ? 'Library' as const : undefined,
  }
}

export function workflowPosition(mode: WorkMode) {
  const index = WORKFLOW_STEPS.findIndex(step => step.id === mode)
  return { current: index + 1, total: WORKFLOW_STEPS.length }
}

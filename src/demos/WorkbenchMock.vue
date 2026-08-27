<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { Send, MessageSquare, GitBranch, ListChecks, ShieldAlert } from '@lucide/vue'
import { UiButton, UiInput, UiBadge } from '@tinadec/ui'

const { t } = useI18n()

type TaskStatus = 'pending' | 'running' | 'completed'
type ApprovalStatus = 'pending' | 'approved' | 'rejected'
type Msg = { id: number; role: 'user' | 'assistant'; text: string }
type Turn = { id: number; text: string; approval: ApprovalStatus; tasks: { key: string; status: TaskStatus }[] }

const sessions = [
  { icon: MessageSquare, label: 'login-page-refactor', active: true },
  { icon: GitBranch, label: 'fix/flaky-e2e', active: false },
  { icon: ShieldAlert, label: 'deps-audit', active: false },
]

const turn = ref<Turn>({
  id: 0,
  text: '',
  approval: 'pending',
  tasks: [
    { key: 'workbench.task1', status: 'pending' },
    { key: 'workbench.task2', status: 'pending' },
    { key: 'workbench.task3', status: 'pending' },
  ],
})
const messages = ref<Msg[]>([])
const thinking = ref(false)
const draft = ref('')
let seq = 1
const timers: ReturnType<typeof setTimeout>[] = []

function later(fn: () => void, ms: number) {
  timers.push(setTimeout(fn, ms))
}

function send() {
  const text = draft.value.trim()
  if (!text || thinking.value) return
  draft.value = ''
  messages.value.push({ id: seq++, role: 'user', text })
  startTurn()
}

function seed() {
  messages.value = [
    { id: seq++, role: 'user', text: t('workbench.userMsg') },
  ]
  startTurn()
}

function startTurn() {
  thinking.value = true
  later(() => {
    thinking.value = false
    messages.value.push({ id: seq++, role: 'assistant', text: t('workbench.assistantMsg') })
    turn.value.tasks[0].status = 'running'
  }, 1400)
}

function decide(kind: 'approved' | 'rejected') {
  if (turn.value.approval !== 'pending') return
  turn.value.approval = kind
  if (kind === 'rejected') {
    messages.value.push({
      id: seq++,
      role: 'assistant',
      text: t('workbench.rejected') + ' · ' + t('workbench.waitingApproval') + ' → ' + t('workbench.completed'),
    })
    turn.value.tasks.forEach((task) => (task.status = 'pending'))
    return
  }
  turn.value.tasks[0].status = 'completed'
  turn.value.tasks[1].status = 'running'
  later(() => {
    turn.value.tasks[1].status = 'completed'
    turn.value.tasks[2].status = 'running'
  }, 1200)
  later(() => {
    turn.value.tasks[2].status = 'completed'
  }, 2400)
}

onBeforeUnmount(() => timers.forEach(clearTimeout))
onMounted(() => seed())
</script>

<template>
  <div class="overflow-hidden rounded-xl border border-[var(--border-default)] bg-[var(--bg-secondary)]" style="box-shadow: var(--shadow-panel)">
    <!-- window chrome -->
    <div class="flex h-9 items-center gap-2 border-b border-[var(--border-muted)] bg-[var(--bg-tertiary)] px-4">
      <span class="h-2.5 w-2.5 rounded-full" style="background: #f85149" />
      <span class="h-2.5 w-2.5 rounded-full" style="background: #d29922" />
      <span class="h-2.5 w-2.5 rounded-full" style="background: #2ec4b6" />
      <span class="ml-3 text-xs text-[var(--text-muted)]">Tinadec Workbench</span>
    </div>

    <div class="grid min-h-[420px] grid-cols-1 md:grid-cols-[180px_1fr_220px]">
      <!-- sessions -->
      <aside class="hidden border-r border-[var(--border-muted)] p-3 md:block">
        <div class="mb-2 flex items-center justify-between">
          <span class="text-xs font-semibold text-[var(--text-muted)] uppercase">{{ t('workbench.sessions') }}</span>
        </div>
        <div
          v-for="s in sessions"
          :key="s.label"
          class="mb-1 flex items-center gap-2 rounded-md px-2 py-1.5 text-xs"
          :class="s.active ? 'bg-[var(--bg-selected)] text-[var(--text-primary)]' : 'text-[var(--text-secondary)] hover:bg-[var(--surface-hover)]'"
        >
          <component :is="s.icon" class="h-3.5 w-3.5" :class="s.active ? 'text-[var(--text-brand)]' : ''" />
          <span class="truncate font-mono">{{ s.label }}</span>
        </div>
      </aside>

      <!-- chat -->
      <div class="flex flex-col border-r border-[var(--border-muted)]">
        <div class="flex-1 space-y-3 overflow-y-auto p-4" style="max-height: 420px">
          <div v-if="!messages.length" class="flex h-full items-center justify-center text-sm text-[var(--text-muted)]">
            {{ t('workbench.chatPlaceholder') }}
          </div>
          <template v-for="m in messages" :key="m.id">
            <div v-if="m.role === 'user'" class="flex justify-end">
              <div class="chat-status-rise max-w-[80%] rounded-xl px-3.5 py-2 text-sm" style="background: var(--bg-user-msg); box-shadow: var(--shadow-user-msg)">
                {{ m.text }}
              </div>
            </div>
            <div v-else class="chat-status-rise max-w-[85%] rounded-xl border px-3.5 py-2 text-sm" style="background: var(--bg-assistant-msg); border-color: var(--bg-assistant-msg-border)">
              {{ m.text }}
            </div>
          </template>
          <div v-if="thinking" class="text-sm">
            <span class="chat-shimmer">{{ t('workbench.thinking') }} …</span>
          </div>

          <!-- approval card -->
          <div
            v-if="turn.tasks[0].status !== 'pending' && !thinking"
            class="rounded-lg border p-3"
            :class="turn.approval === 'pending' ? 'border-[var(--border-input-focus)]' : 'border-[var(--border-default)] opacity-80'"
          >
            <div class="mb-2 flex items-center gap-2 text-xs">
              <ShieldAlert class="h-4 w-4" :class="turn.approval === 'rejected' ? 'text-[var(--accent-danger)]' : 'text-[var(--accent-warning)]'" />
              <span class="font-semibold">{{ t('workbench.toolCall') }}</span>
              <UiBadge variant="destructive" class="ml-auto">{{ t('workbench.highRisk') }}</UiBadge>
            </div>
            <div class="mb-3 font-mono text-xs text-[var(--text-secondary)]">{{ t('workbench.approvalReq') }}</div>
            <div v-if="turn.approval === 'pending'" class="flex gap-2">
              <UiButton size="xs" @click="decide('approved')">{{ t('workbench.approve') }}</UiButton>
              <UiButton size="xs" variant="outline" @click="decide('rejected')">{{ t('workbench.reject') }}</UiButton>
            </div>
            <UiBadge v-else :variant="turn.approval === 'approved' ? 'default' : 'destructive'">
              {{ turn.approval === 'approved' ? t('workbench.approved') : t('workbench.rejected') }}
            </UiBadge>
          </div>
        </div>

        <!-- composer -->
        <div class="border-t border-[var(--border-muted)] p-3">
          <div class="flex items-center gap-2">
            <UiInput
              v-model="draft"
              class="flex-1"
              :placeholder="t('workbench.chatPlaceholder')"
              @keydown.enter="send"
            />
            <UiButton size="icon" :aria-label="t('workbench.send')" @click="send">
              <Send class="h-4 w-4" />
            </UiButton>
          </div>
        </div>
      </div>

      <!-- task graph -->
      <aside class="hidden p-3 md:block">
        <div class="mb-2 flex items-center gap-1.5 text-xs font-semibold text-[var(--text-muted)] uppercase">
          <ListChecks class="h-3.5 w-3.5" />
          {{ t('workbench.tasks') }}
        </div>
        <div class="space-y-2">
          <div
            v-for="(task, i) in turn.tasks"
            :key="task.key"
            class="rounded-md border px-2.5 py-2 text-xs"
            :class="task.status === 'running' ? 'border-[var(--border-input-focus)]' : 'border-[var(--border-default)]'"
          >
            <div class="flex items-center justify-between gap-2">
              <span class="truncate">{{ i + 1 }}. {{ t(task.key) }}</span>
              <span
                class="h-2 w-2 shrink-0 rounded-full"
                :class="{
                  'bg-[var(--text-muted)]': task.status === 'pending',
                  'bg-[var(--accent-info)] activity-glow-icon': task.status === 'running',
                  'bg-[var(--accent-success)]': task.status === 'completed',
                }"
              />
            </div>
            <div class="mt-1 text-[10px] text-[var(--text-muted)]">
              {{ t('workbench.' + (task.status === 'pending' ? 'planned' : task.status === 'running' ? 'running' : 'completed')) }}
            </div>
          </div>
        </div>
      </aside>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, type Component } from 'vue'
import { useI18n } from 'vue-i18n'
import {
  Send,
  MessageSquare,
  GitBranch,
  ShieldAlert,
  Activity,
  AlertCircle,
  Brain,
  CheckCircle2,
  XCircle,
  Loader2,
  Clock,
  ListChecks,
  Network,
  Package,
  UserCheck,
  ShieldCheck,
} from '@lucide/vue'
import { UiButton, UiInput } from '@tinadec/ui'

const { t, tm } = useI18n()

type Msg = { id: number; role: 'user' | 'assistant'; text: string }
type ToolStatus = 'pending' | 'running' | 'completed' | 'failed' | 'waiting_approval'
type ToolItem = {
  name: string
  status: ToolStatus
  args: string
  result: string | null
  duration: string | null
  risk?: 'high'
}
type ApprovalStatus = 'pending' | 'approved' | 'rejected'
type BannerPhase = 'thinking' | 'working' | 'waiting' | 'completed' | 'error'
type Step = { icon: Component; kind: string; title: string; desc: string; severity: string | null }

const sessions = [
  { icon: MessageSquare, label: 'login-page-refactor', active: true },
  { icon: GitBranch, label: 'fix/flaky-e2e', active: false },
  { icon: ShieldAlert, label: 'deps-audit', active: false },
]

/* Tool-call stream — mirrors the real TinadecOffice mockData flow. */
const tools = computed<ToolItem[]>(() => (tm('workbench.tools') as unknown[]).map((x) => x as ToolItem))

const messages = ref<Msg[]>([])
const thinking = ref(false)
const draft = ref('')
const approval = ref<ApprovalStatus>('pending')
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
  messages.value = [{ id: seq++, role: 'user', text: t('workbench.userMsg') }]
  startTurn()
}

function startTurn() {
  thinking.value = true
  approval.value = 'pending'
  later(() => {
    thinking.value = false
    messages.value.push({ id: seq++, role: 'assistant', text: t('workbench.assistantMsg') })
  }, 1400)
}

function decide(kind: 'approved' | 'rejected') {
  if (approval.value !== 'pending') return
  approval.value = kind
  if (kind === 'rejected') {
    messages.value.push({
      id: seq++,
      role: 'assistant',
      text: `${t('workbench.rejected')} · ${t('workbench.waitingApproval')} → ${t('workbench.completed')}`,
    })
  }
}

/* --- State mapping (real TinadecOffice AgentActivity semantics) --- */

/** The approval-gated Write File card resolves once the user decides. */
function toolStatus(tool: ToolItem): ToolStatus {
  if (tool.status === 'waiting_approval') {
    if (approval.value === 'approved') return 'completed'
    if (approval.value === 'rejected') return 'failed'
    return 'waiting_approval'
  }
  return tool.status
}

function toolGlyph(status: ToolStatus) {
  switch (status) {
    case 'running':
      return Loader2
    case 'completed':
      return CheckCircle2
    case 'failed':
      return XCircle
    case 'waiting_approval':
      return ShieldAlert
    default:
      return Clock
  }
}

function toolStatusLabel(status: ToolStatus) {
  return t(`workbench.toolStatus.${status === 'waiting_approval' ? 'waiting' : status}`)
}

const bannerPhase = computed<BannerPhase>(() => {
  if (thinking.value) return 'thinking'
  if (approval.value === 'pending') return 'working'
  if (approval.value === 'rejected') return 'error'
  return 'completed'
})

const bannerIcon = computed(() => {
  switch (bannerPhase.value) {
    case 'thinking':
      return Brain
    case 'working':
      return Activity
    case 'waiting':
      return ShieldAlert
    case 'error':
      return AlertCircle
    default:
      return CheckCircle2
  }
})

const bannerLabel = computed(() => {
  switch (bannerPhase.value) {
    case 'thinking':
      return t('workbench.thinking')
    case 'working':
      return t('workbench.working')
    case 'waiting':
      return t('workbench.awaitingTag')
    case 'error':
      return t('workbench.rejected')
    default:
      return t('workbench.completed')
  }
})

const progress = computed(() => {
  if (thinking.value) return 40
  if (approval.value === 'approved') return 100
  return 60
})

/* Agent activity timeline (real TinadecOffice ThinkingProcess style). */
const steps = computed<Step[]>(() => [
  { icon: Brain, kind: 'run', title: t('workbench.stepRun'), desc: t('workbench.stepRunDesc'), severity: null },
  { icon: Network, kind: 'graph', title: t('workbench.stepGraph'), desc: t('workbench.stepGraphDesc'), severity: null },
  { icon: Package, kind: 'context', title: t('workbench.stepContext'), desc: t('workbench.stepContextDesc'), severity: null },
  { icon: UserCheck, kind: 'assign', title: t('workbench.stepAssign'), desc: t('workbench.stepAssignDesc'), severity: null },
  { icon: ShieldCheck, kind: 'supervision', title: t('workbench.stepSupervision'), desc: t('workbench.stepSupervisionDesc'), severity: 'warning' },
])

onBeforeUnmount(() => timers.forEach(clearTimeout))
onMounted(() => seed())
</script>

<template>
  <div class="overflow-hidden rounded-xl border border-[var(--border-default)] bg-[var(--bg-secondary)]" style="box-shadow: var(--shadow-panel)">
    <!-- VS Code-style window chrome (mirrors TinadecOffice panels) -->
    <div class="flex h-9 items-center border-b border-[var(--border-muted)] bg-[var(--bg-tertiary)] pl-3 pr-2">
      <span class="flex h-full items-center gap-1.5 border-b-2 border-[var(--accent-primary)] px-2 text-xs text-[var(--text-secondary)]">
        <ListChecks class="h-3.5 w-3.5" style="color: var(--accent-primary)" />
        Tinadec Workbench
      </span>
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
          <component :is="s.icon" class="h-3.5 w-3.5 shrink-0" />
          <span class="truncate">{{ s.label }}</span>
        </div>
      </aside>

      <!-- chat -->
      <div class="flex min-w-0 flex-col">
        <div class="flex-1 space-y-3 overflow-y-auto p-3">
          <template v-for="m in messages" :key="m.id">
            <div v-if="m.role === 'user'" class="flex justify-end">
              <div class="max-w-[85%] rounded-xl px-3.5 py-2 text-sm" style="background: var(--bg-user-msg); box-shadow: var(--shadow-user-msg)">
                {{ m.text }}
              </div>
            </div>
            <div
              v-else
              class="chat-status-rise max-w-[85%] rounded-xl border px-3.5 py-2 text-sm"
              style="background: var(--bg-assistant-msg); border-color: var(--bg-assistant-msg-border)"
            >
              {{ m.text }}
            </div>
          </template>

          <!-- Agent activity banner (real TinadecOffice AgentActivityBanner style) -->
          <div class="wb-banner" :class="`wb-${bannerPhase}`">
            <div class="flex items-start gap-2.5">
              <span class="wb-banner-icon">
                <component
                  :is="bannerIcon"
                  class="h-4 w-4"
                  :class="bannerPhase === 'thinking' || bannerPhase === 'working' ? 'activity-glow-icon' : ''"
                />
              </span>
              <div class="min-w-0 flex-1">
                <div class="flex flex-wrap items-center gap-x-2 gap-y-1">
                  <strong class="text-xs">{{ t('workbench.agentName') }}</strong>
                  <span class="wb-role">{{ t('workbench.agentRole') }}</span>
                  <span class="wb-tag" :class="`wb-tag-${bannerPhase}`">{{ bannerLabel }}</span>
                </div>
                <div class="mt-1.5 flex items-center gap-2">
                  <div class="wb-progress">
                    <div class="wb-progress-fill" :style="{ width: `${progress}%` }" />
                  </div>
                  <span class="whitespace-nowrap text-[10px] text-[var(--text-muted)]">
                    {{ t('workbench.progressLabel') }} · {{ t('workbench.elapsed') }}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <!-- Tool-call stream (real TinadecOffice ToolCallCard style) -->
          <div v-for="(tool, i) in tools" :key="i" class="tool-card" :class="`tool-${toolStatus(tool)}`">
            <div class="flex items-start gap-2.5">
              <span class="tool-glyph mt-0.5">
                <component
                  :is="toolGlyph(toolStatus(tool))"
                  class="h-3.5 w-3.5"
                  :class="{ 'activity-glow-icon': toolStatus(tool) === 'running' || toolStatus(tool) === 'waiting_approval', 'tool-icon-spin': toolStatus(tool) === 'running' }"
                />
              </span>
              <div class="min-w-0 flex-1">
                <div class="flex items-center gap-2">
                  <strong class="truncate text-xs">{{ tool.name }}</strong>
                  <span v-if="tool.risk === 'high'" class="tool-risk">{{ t('workbench.highRisk') }}</span>
                  <span class="ml-auto shrink-0 text-[10px] font-medium" :class="`tool-status-${toolStatus(tool)}`">
                    {{ toolStatusLabel(toolStatus(tool)) }}
                  </span>
                </div>
                <p class="mt-0.5 truncate font-mono text-[11px] text-[var(--text-secondary)]" :class="{ 'chat-shimmer': toolStatus(tool) === 'running' }">
                  {{ tool.args }}
                </p>
                <p
                  v-if="toolStatus(tool) === 'completed' && tool.result"
                  class="chat-status-rise mt-0.5 text-[11px]"
                  style="color: var(--accent-success)"
                >
                  {{ tool.result }}
                </p>
                <p
                  v-else-if="toolStatus(tool) === 'failed' && tool.result"
                  class="chat-status-rise mt-0.5 text-[11px]"
                  style="color: var(--accent-danger)"
                >
                  {{ tool.result }}
                </p>
                <div v-if="tool.status === 'waiting_approval' && approval === 'pending'" class="mt-2 flex items-center gap-2">
                  <span class="text-[11px]" style="color: var(--accent-warning)">{{ t('workbench.waitingApproval') }}</span>
                  <div class="ml-auto flex gap-1.5">
                    <UiButton size="xs" @click="decide('approved')">
                      <CheckCircle2 class="h-3.5 w-3.5" />
                      {{ t('workbench.approve') }}
                    </UiButton>
                    <UiButton size="xs" variant="outline" @click="decide('rejected')">
                      <XCircle class="h-3.5 w-3.5" />
                      {{ t('workbench.reject') }}
                    </UiButton>
                  </div>
                </div>
              </div>
              <span v-if="tool.duration" class="shrink-0 pt-0.5 text-[10px] text-[var(--text-muted)]">{{ tool.duration }}</span>
            </div>
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

      <!-- agent activity timeline (real TinadecOffice ThinkingProcess style) -->
      <aside class="hidden border-l border-[var(--border-muted)] p-3 md:block">
        <div class="mb-2 flex items-center gap-1.5 text-xs font-semibold text-[var(--text-muted)] uppercase">
          <ListChecks class="h-3.5 w-3.5" />
          {{ t('workbench.activity') }}
        </div>
        <div class="mb-3 flex items-center gap-2">
          <div class="h-1.5 flex-1 overflow-hidden rounded-full bg-[var(--bg-tertiary)]">
            <div
              class="h-full rounded-full transition-all"
              style="width: 60%; background: linear-gradient(90deg, var(--accent-brand), var(--accent-primary))"
            />
          </div>
          <span class="text-[10px] text-[var(--text-muted)]">{{ t('workbench.progressLabel') }}</span>
        </div>
        <ol class="mb-3">
          <li v-for="(step, i) in steps" :key="i" class="relative flex gap-2.5 pb-3 last:pb-0">
            <span v-if="i < steps.length - 1" class="wb-timeline-line" />
            <span class="wb-step-icon" :class="`step-${step.kind}`">
              <component :is="step.icon" class="h-3.5 w-3.5" />
            </span>
            <div class="min-w-0 pt-0.5">
              <div class="flex items-center gap-1.5">
                <span class="text-[11px] font-medium">{{ step.title }}</span>
                <span v-if="step.severity" class="wb-severity">{{ step.severity }}</span>
              </div>
              <p class="mt-0.5 text-[10px] text-[var(--text-muted)]">{{ step.desc }}</p>
            </div>
          </li>
        </ol>
        <div class="rounded-md border border-[var(--border-muted)] bg-[var(--bg-tertiary)] px-2.5 py-2">
          <div class="flex items-center gap-2">
            <span class="h-2 w-2 shrink-0 rounded-full activity-glow-icon" style="background: var(--accent-primary)" />
            <span class="truncate text-[11px] font-medium">{{ t('workbench.agentName') }}</span>
            <span class="ml-auto shrink-0 text-[10px] text-[var(--text-muted)]">{{ t('workbench.working') }}</span>
          </div>
        </div>
      </aside>
    </div>
  </div>
</template>


<style scoped>
/* Agent activity banner — state-tinted gradients mirroring the real
   TinadecOffice AgentActivityBanner (thinking=violet, working=blue,
   waiting=amber, error=red, completed=green). Status hues use dedicated
   --status-* vars (defined in styles.css) so they stay violet/blue even
   when the site brand accent is green/teal. */
.wb-banner {
  border: 1px solid var(--border-muted);
  border-radius: 8px;
  padding: 10px 12px;
  background: var(--bg-tertiary);
  transition: border-color 0.2s ease, background 0.2s ease;
}
.wb-banner.wb-thinking {
  border-color: color-mix(in srgb, var(--status-thinking) 40%, transparent);
  background: linear-gradient(135deg, color-mix(in srgb, var(--status-thinking) 10%, transparent), var(--bg-tertiary));
}
.wb-banner.wb-working {
  border-color: color-mix(in srgb, var(--status-working) 40%, transparent);
  background: linear-gradient(135deg, color-mix(in srgb, var(--status-working) 12%, transparent), var(--bg-tertiary));
}
.wb-banner.wb-waiting {
  border-color: rgba(210, 153, 34, 0.4);
  background: linear-gradient(135deg, rgba(210, 153, 34, 0.08), var(--bg-tertiary));
}
.wb-banner.wb-error {
  border-color: rgba(248, 81, 73, 0.4);
  background: linear-gradient(135deg, rgba(248, 81, 73, 0.06), var(--bg-tertiary));
}
.wb-banner.wb-completed {
  border-color: rgba(63, 185, 80, 0.3);
  background: linear-gradient(135deg, rgba(63, 185, 80, 0.07), var(--bg-tertiary));
}
.wb-banner-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border-radius: 6px;
  flex-shrink: 0;
  background: color-mix(in srgb, var(--status-working) 12%, transparent);
  color: var(--status-working);
}
.wb-banner.wb-thinking .wb-banner-icon {
  background: color-mix(in srgb, var(--status-thinking) 14%, transparent);
  color: var(--status-thinking);
}
.wb-banner.wb-waiting .wb-banner-icon {
  background: rgba(210, 153, 34, 0.12);
  color: var(--accent-warning);
}
.wb-banner.wb-error .wb-banner-icon {
  background: rgba(248, 81, 73, 0.12);
  color: var(--accent-danger);
}
.wb-banner.wb-completed .wb-banner-icon {
  background: rgba(63, 185, 80, 0.12);
  color: var(--accent-success);
}
.wb-role {
  font-size: 10px;
  color: var(--text-muted);
}
.wb-tag {
  font-size: 10px;
  font-weight: 600;
  border-radius: 999px;
  padding: 1px 7px;
}
.wb-tag-thinking {
  color: var(--status-thinking);
  background: color-mix(in srgb, var(--status-thinking) 14%, transparent);
}
.wb-tag-working {
  color: var(--status-working);
  background: color-mix(in srgb, var(--status-working) 14%, transparent);
}
.wb-tag-waiting {
  color: var(--accent-warning);
  background: rgba(210, 153, 34, 0.14);
}
.wb-tag-error {
  color: var(--accent-danger);
  background: rgba(248, 81, 73, 0.12);
}
.wb-tag-completed {
  color: var(--accent-success);
  background: rgba(63, 185, 80, 0.12);
}
.wb-progress {
  height: 4px;
  flex: 1;
  max-width: 180px;
  border-radius: 999px;
  background: var(--bg-tertiary);
  overflow: hidden;
}
.wb-progress-fill {
  height: 100%;
  border-radius: 999px;
  background: linear-gradient(90deg, var(--status-working), var(--status-working));
  transition: width 0.3s ease;
}
.wb-banner.wb-thinking .wb-progress-fill {
  background: linear-gradient(90deg, color-mix(in srgb, var(--status-thinking) 55%, transparent), var(--status-thinking));
}
.wb-banner.wb-working .wb-progress-fill {
  background: linear-gradient(90deg, color-mix(in srgb, var(--status-working) 55%, transparent), var(--status-working));
}
.wb-banner.wb-waiting .wb-progress-fill {
  background: linear-gradient(90deg, rgba(210, 153, 34, 0.55), var(--accent-warning));
}
.wb-banner.wb-error .wb-progress-fill {
  background: linear-gradient(90deg, rgba(248, 81, 73, 0.55), var(--accent-danger));
}
.wb-banner.wb-completed .wb-progress-fill {
  background: linear-gradient(90deg, rgba(63, 185, 80, 0.55), var(--accent-success));
}

/* Tool-call cards — real TinadecOffice ToolCallCard status tints. */
.tool-card {
  border-radius: 8px;
  border: 1px solid var(--border-muted);
  background: var(--bg-tertiary);
  padding: 8px 10px;
}
.tool-card.tool-waiting_approval {
  background: rgba(210, 153, 34, 0.06);
  border-color: rgba(210, 153, 34, 0.3);
}
.tool-card.tool-failed {
  border-color: rgba(248, 81, 73, 0.35);
}
.tool-card.tool-running {
  border-color: color-mix(in srgb, var(--status-working) 40%, transparent);
}
.tool-card.tool-completed {
  border-color: rgba(63, 185, 80, 0.3);
}
.tool-glyph {
  display: flex;
  color: var(--text-muted);
  flex-shrink: 0;
}
.tool-running .tool-glyph {
  color: var(--status-working);
}
.tool-completed .tool-glyph {
  color: var(--accent-success);
}
.tool-failed .tool-glyph {
  color: var(--accent-danger);
}
.tool-waiting_approval .tool-glyph {
  color: var(--accent-warning);
}
.tool-risk {
  font-size: 9px;
  font-weight: 600;
  color: var(--accent-warning);
  background: rgba(210, 153, 34, 0.12);
  padding: 1px 6px;
  border-radius: 999px;
}
.tool-status-pending {
  color: var(--text-muted);
}
.tool-status-running {
  color: var(--status-working);
}
.tool-status-completed {
  color: var(--accent-success);
}
.tool-status-failed {
  color: var(--accent-danger);
}
.tool-status-waiting_approval {
  color: var(--accent-warning);
}
.tool-icon-spin {
  animation: wb-spin 1s linear infinite;
}
@keyframes wb-spin {
  to {
    transform: rotate(360deg);
  }
}

/* Activity timeline — real TinadecOffice ThinkingProcess step icons. */
.wb-timeline-line {
  position: absolute;
  left: 7px;
  top: 18px;
  bottom: -2px;
  width: 1px;
  background: var(--border-muted);
}
.wb-step-icon {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 16px;
  height: 16px;
  border-radius: 4px;
  flex-shrink: 0;
}
.step-run,
.step-graph,
.step-context,
.step-assign {
  background: color-mix(in srgb, var(--accent-primary) 12%, transparent);
  color: var(--accent-primary);
}
.step-supervision {
  background: rgba(210, 153, 34, 0.14);
  color: var(--accent-warning);
}
.wb-severity {
  font-size: 9px;
  font-weight: 600;
  text-transform: uppercase;
  color: var(--accent-warning);
  background: rgba(210, 153, 34, 0.12);
  padding: 0 6px;
  border-radius: 999px;
}

@media (prefers-reduced-motion: reduce) {
  .tool-icon-spin,
  .wb-progress-fill {
    animation: none;
    transition: none;
  }
}
</style>

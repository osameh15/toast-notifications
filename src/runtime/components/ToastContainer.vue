<template>
  <Teleport
    to="body"
    :disabled="!teleport"
  >
    <div :class="['toast-container', `toast-position-${position}`]">
      <button
        v-if="showHideAll"
        type="button"
        class="hide-all-btn"
        @click="hideAll"
      >
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          aria-hidden="true"
        >
          <line
            x1="18"
            y1="6"
            x2="6"
            y2="18"
          />
          <line
            x1="6"
            y1="6"
            x2="18"
            y2="18"
          />
        </svg>
        <span>{{ hideAllLabel }}</span>
      </button>

      <ToastNotification
        v-for="toast in toasts"
        :key="toast.id"
        :model-value="toast.visible"
        :type="toast.type"
        :title="toast.title"
        :message="toast.message"
        :timeout="toast.timeout"
        @update:model-value="(v: boolean) => handleClose(toast.id, v)"
      />
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import ToastNotification from './ToastNotification.vue'
import { useToast } from '../composables/useToast'

type Position
  = | 'top-right'
    | 'top-left'
    | 'bottom-right'
    | 'bottom-left'
    | 'top-center'
    | 'bottom-center'

const props = withDefaults(
  defineProps<{
    position?: Position
    /**
     * Render the container into `document.body` via Vue's `<Teleport>` so
     * `position: fixed` always references the viewport, even when the
     * container is mounted inside an ancestor that creates its own
     * containing block (e.g. an element with `backdrop-filter`,
     * `transform`, `filter`, or `will-change`). Defaults to `true`.
     */
    teleport?: boolean
    /**
     * Label for the "Hide all" button shown above the toast stack when 2 or
     * more toasts are visible. Defaults to `'Hide all'`. Pass an empty
     * string or set `showHideAllButton: false` to hide it.
     */
    hideAllLabel?: string
    /**
     * Whether to render the "Hide all" button when the stack has 2+ toasts.
     * Defaults to `true`.
     */
    showHideAllButton?: boolean
  }>(),
  {
    position: 'bottom-right',
    teleport: true,
    hideAllLabel: 'Hide all',
    showHideAllButton: true,
  },
)

const { toasts, remove, clear } = useToast()

const showHideAll = computed(
  () => props.showHideAllButton && toasts.value.length >= 2,
)

const handleClose = (id: number, visible: boolean): void => {
  if (!visible) remove(id)
}

const hideAll = (): void => {
  clear()
}
</script>

<style scoped>
.toast-container {
  position: fixed;
  z-index: 10000;
  display: flex;
  gap: 12px;
  pointer-events: none;
}

.toast-position-bottom-right {
  bottom: 8px;
  right: 8px;
  flex-direction: column-reverse;
}
.toast-position-bottom-left {
  bottom: 8px;
  left: 8px;
  flex-direction: column-reverse;
}
.toast-position-top-right {
  top: 8px;
  right: 8px;
  flex-direction: column;
}
.toast-position-top-left {
  top: 8px;
  left: 8px;
  flex-direction: column;
}
.toast-position-top-center {
  top: 8px;
  left: 50%;
  transform: translateX(-50%);
  flex-direction: column;
  align-items: center;
}
.toast-position-bottom-center {
  bottom: 8px;
  left: 50%;
  transform: translateX(-50%);
  flex-direction: column-reverse;
  align-items: center;
}

.toast-container :deep(.toast-card),
.toast-container :deep(.toast-close-btn),
.toast-container .hide-all-btn {
  pointer-events: auto;
}

/* ----- Hide all button ----- */
.hide-all-btn {
  /* Match toast card width exactly */
  min-width: 350px;
  max-width: 450px;
  width: 100%;

  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 10px 16px;

  background: rgba(25, 29, 35, 0.92);
  -webkit-backdrop-filter: blur(12.5px);
  backdrop-filter: blur(12.5px);
  border: 1px solid rgba(255, 255, 255, 0.18);
  border-radius: 8px;
  color: rgba(255, 255, 255, 0.85);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);

  font-family:
    'Inter',
    'Shabnam',
    system-ui,
    -apple-system,
    BlinkMacSystemFont,
    'Segoe UI Variable Text',
    'Segoe UI',
    Roboto,
    'Helvetica Neue',
    Arial,
    sans-serif;
  font-size: 13px;
  font-weight: 500;
  line-height: 1;
  letter-spacing: 0.01em;
  cursor: pointer;
  transition: all 0.2s ease;
  -webkit-font-smoothing: antialiased;
}

.hide-all-btn svg {
  width: 14px;
  height: 14px;
  opacity: 0.75;
  transition: opacity 0.2s ease;
}

.hide-all-btn:hover {
  background: rgba(220, 20, 60, 0.18);
  border-color: rgba(220, 20, 60, 0.55);
  color: white;
}
.hide-all-btn:hover svg { opacity: 1; }

.hide-all-btn:focus-visible {
  outline: 2px solid rgba(0, 255, 255, 0.6);
  outline-offset: 2px;
}

/*
 * Position the "Hide all" button at the visual TOP of the stack regardless
 * of flex-direction:
 *   - column          (top-* positions): order: -1 → first laid out → top
 *   - column-reverse  (bottom-* positions): higher order → laid out last →
 *     placed at the top of the reversed axis
 */
.toast-position-top-right .hide-all-btn,
.toast-position-top-left .hide-all-btn,
.toast-position-top-center .hide-all-btn {
  order: -1;
}

.toast-position-bottom-right .hide-all-btn,
.toast-position-bottom-left .hide-all-btn,
.toast-position-bottom-center .hide-all-btn {
  order: 999;
}
</style>

<template>
  <div :class="['toast-container', `toast-position-${position}`]">
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
</template>

<script setup lang="ts">
import ToastNotification from './ToastNotification.vue'
import { useToast } from '../composables/useToast'

type Position =
  | 'top-right'
  | 'top-left'
  | 'bottom-right'
  | 'bottom-left'
  | 'top-center'
  | 'bottom-center'

withDefaults(defineProps<{ position?: Position }>(), {
  position: 'bottom-right',
})

const { toasts, remove } = useToast()

const handleClose = (id: number, visible: boolean): void => {
  if (!visible) remove(id)
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
.toast-container :deep(.toast-close-btn) {
  pointer-events: auto;
}
</style>

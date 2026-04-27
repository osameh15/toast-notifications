<template>
  <!-- Basic Toast Types -->
  <section class="test-card">
    <h2>
      <span class="section-icon">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        ><path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 0 1-3.46 0" /></svg>
      </span>
      Basic Toast Types
    </h2>
    <div class="grid cols-4">
      <button
        class="btn btn-success"
        @click="showSuccessToast"
      >
        Success
      </button>
      <button
        class="btn btn-warning"
        @click="showWarningToast"
      >
        Warning
      </button>
      <button
        class="btn btn-error"
        @click="showErrorToast"
      >
        Error
      </button>
      <button
        class="btn btn-info"
        @click="showInfoToast"
      >
        Info
      </button>
    </div>
  </section>

  <!-- Custom Timeout -->
  <section class="test-card">
    <h2>
      <span class="section-icon">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        ><circle
          cx="12"
          cy="12"
          r="10"
        /><polyline points="12 6 12 12 16 14" /></svg>
      </span>
      Custom Timeout
    </h2>
    <div class="grid cols-3">
      <button
        class="btn btn-outline"
        @click="showShortToast"
      >
        Short (2s)
      </button>
      <button
        class="btn btn-outline"
        @click="showLongToast"
      >
        Long (10s)
      </button>
      <button
        class="btn btn-outline"
        @click="showPersistentToast"
      >
        Persistent
      </button>
    </div>
  </section>

  <!-- Multiple Toasts -->
  <section class="test-card">
    <h2>
      <span class="section-icon">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        ><rect
          x="3"
          y="3"
          width="7"
          height="7"
        /><rect
          x="14"
          y="3"
          width="7"
          height="7"
        /><rect
          x="14"
          y="14"
          width="7"
          height="7"
        /><rect
          x="3"
          y="14"
          width="7"
          height="7"
        /></svg>
      </span>
      Multiple Toasts
    </h2>
    <div class="grid cols-2">
      <button
        class="btn btn-tonal"
        @click="showMultipleToasts"
      >
        Show 3 Toasts
      </button>
      <button
        class="btn btn-tonal-danger"
        @click="clearAllToasts"
      >
        Clear All
      </button>
    </div>
  </section>

  <!-- Test Max 3 Limit -->
  <section class="test-card">
    <h2>
      <span class="section-icon">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        ><polygon points="12 2 2 7 12 12 22 7 12 2" /><polyline points="2 17 12 22 22 17" /><polyline points="2 12 12 17 22 12" /></svg>
      </span>
      Test Max 3 Toasts Limit
    </h2>
    <p class="hint">
      When you show more than 3 toasts, the oldest one is automatically
      removed. Click below to see it in action.
    </p>
    <button
      class="btn btn-tonal-primary"
      @click="showRapidToasts"
    >
      Show 5 Toasts Rapidly (Test Max 3)
    </button>
  </section>

  <!-- Custom Messages -->
  <section class="test-card">
    <h2>
      <span class="section-icon">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        ><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>
      </span>
      Custom Messages
    </h2>
    <div class="grid cols-2">
      <label class="field">
        <span class="field-label">Custom Title</span>
        <input
          v-model="customTitle"
          type="text"
          class="field-input"
          placeholder="Title…"
        >
      </label>
      <label class="field">
        <span class="field-label">Custom Message</span>
        <input
          v-model="customMessage"
          type="text"
          class="field-input"
          placeholder="Message…"
        >
      </label>
    </div>
    <div class="grid cols-4 mt-12">
      <button
        class="btn btn-outline"
        @click="showCustomToast('healthy')"
      >
        Success
      </button>
      <button
        class="btn btn-outline"
        @click="showCustomToast('warning')"
      >
        Warning
      </button>
      <button
        class="btn btn-outline"
        @click="showCustomToast('error')"
      >
        Error
      </button>
      <button
        class="btn btn-outline"
        @click="showCustomToast('info')"
      >
        Info
      </button>
    </div>
  </section>

  <!-- Real-world Examples -->
  <section class="test-card">
    <h2>
      <span class="section-icon">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        ><rect
          x="3"
          y="3"
          width="18"
          height="18"
          rx="2"
        /><line
          x1="9"
          y1="9"
          x2="15"
          y2="9"
        /><line
          x1="9"
          y1="13"
          x2="15"
          y2="13"
        /><line
          x1="9"
          y1="17"
          x2="13"
          y2="17"
        /></svg>
      </span>
      Real-world Examples
    </h2>
    <div class="grid cols-3">
      <button
        class="btn btn-outline"
        @click="simulateFormSave"
      >
        Form Saved
      </button>
      <button
        class="btn btn-outline"
        @click="simulateValidationError"
      >
        Validation Error
      </button>
      <button
        class="btn btn-outline"
        @click="simulateNetworkError"
      >
        Network Error
      </button>
      <button
        class="btn btn-outline"
        @click="simulateFileUpload"
      >
        File Uploaded
      </button>
      <button
        class="btn btn-outline"
        @click="simulatePermissionDenied"
      >
        Permission Denied
      </button>
      <button
        class="btn btn-outline"
        @click="simulateDataSync"
      >
        Data Synced
      </button>
    </div>
  </section>

  <!-- Persian / RTL test -->
  <section class="test-card">
    <h2>
      <span class="section-icon">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        ><circle
          cx="12"
          cy="12"
          r="10"
        /><line
          x1="2"
          y1="12"
          x2="22"
          y2="12"
        /><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" /></svg>
      </span>
      Persian / RTL test (Shabnam font)
    </h2>
    <p class="hint">
      Toasts auto-detect Arabic / Persian script and switch to
      <code>dir="rtl"</code> — close button moves to the left, icon spacing
      flips, and Shabnam renders the text.
    </p>
    <div class="grid cols-2">
      <button
        class="btn btn-success"
        @click="showPersianSuccess"
      >
        موفقیت‌آمیز
      </button>
      <button
        class="btn btn-error"
        @click="showPersianError"
      >
        خطا
      </button>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue'

type ToastType = 'success' | 'healthy' | 'warning' | 'error' | 'info'

const toast = useToast()

const customTitle = ref('Custom Title')
const customMessage = ref('This is a custom message')

const showSuccessToast = () => {
  toast.success('Success!', 'Your operation completed successfully')
}
const showWarningToast = () => {
  toast.warning('Warning', 'Please review your input before proceeding')
}
const showErrorToast = () => {
  toast.error('Error', 'Something went wrong. Please try again')
}
const showInfoToast = () => {
  toast.info('Information', 'This is an informational message')
}

const showShortToast = () => {
  toast.info('Quick Message', 'This will disappear in 2 seconds', 2000)
}
const showLongToast = () => {
  toast.info('Long Message', 'This will stay for 10 seconds', 10000)
}
const showPersistentToast = () => {
  toast.warning('Persistent Toast', 'This will stay until you close it manually', 0)
}

const showMultipleToasts = () => {
  setTimeout(() => toast.success('First', 'First toast notification'), 0)
  setTimeout(() => toast.warning('Second', 'Second toast notification'), 500)
  setTimeout(() => toast.info('Third', 'Third toast notification'), 1000)
}

const clearAllToasts = () => {
  toast.clear()
  toast.info('Cleared', 'All toasts have been cleared')
}

const showRapidToasts = () => {
  toast.success('Toast 1', 'First toast — will be dropped when 4th appears')
  setTimeout(() => toast.warning('Toast 2', 'Second toast — will be dropped when 5th appears'), 500)
  setTimeout(() => toast.info('Toast 3', 'Third toast — stays'), 1000)
  setTimeout(() => toast.error('Toast 4', 'Fourth toast — drops Toast 1 (oldest)'), 1500)
  setTimeout(() => toast.success('Toast 5', 'Fifth toast — drops Toast 2 (oldest)'), 2000)
}

const showCustomToast = (type: ToastType) => {
  toast.show({
    type,
    title: customTitle.value,
    message: customMessage.value,
    timeout: 5000,
  })
}

const simulateFormSave = () => {
  toast.success('Form Saved', 'Your form has been saved successfully!')
}
const simulateValidationError = () => {
  toast.warning('Validation Error', 'Please fill in all required fields before submitting')
}
const simulateNetworkError = () => {
  toast.error('Network Error', 'Unable to connect to server. Please check your connection')
}
const simulateFileUpload = () => {
  toast.success('Upload Complete', 'File "document.pdf" uploaded successfully')
}
const simulatePermissionDenied = () => {
  toast.error('Permission Denied', 'You don\'t have permission to perform this action')
}
const simulateDataSync = () => {
  toast.info('Sync Complete', 'Your data has been synchronized with the server')
}

const showPersianSuccess = () => {
  toast.success('عملیات موفق', 'تغییرات شما با موفقیت ذخیره شد.')
}
const showPersianError = () => {
  toast.error('خطا در عملیات', 'ارتباط با سرور برقرار نشد. لطفاً دوباره تلاش کنید.')
}
</script>

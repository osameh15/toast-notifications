<template>
  <div class="page-dark">
    <div class="container">
      <header class="test-card header-card">
        <h1>Toast Notification Test</h1>
        <p class="subtitle">
          Test all toast notification types with different configurations.
        </p>
        <nav class="page-nav">
          <NuxtLink to="/">Quick demo</NuxtLink>
          <NuxtLink to="/test">Test page</NuxtLink>
          <NuxtLink to="/positions">Positions</NuxtLink>
          <NuxtLink to="/manual">Manual mount</NuxtLink>
        </nav>
      </header>

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
          Verifies the bundled Shabnam font renders Persian script correctly.
        </p>
        <div class="grid cols-2">
          <button
            class="btn btn-outline"
            @click="showPersianSuccess"
          >
            موفقیت‌آمیز
          </button>
          <button
            class="btn btn-outline"
            @click="showPersianError"
          >
            خطا
          </button>
        </div>
      </section>
    </div>
  </div>
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

<style scoped>
.page-dark {
  min-height: 100vh;
  background-color: #191d23;
  padding: 32px 16px;
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
}

.container {
  max-width: 1080px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.test-card {
  background: radial-gradient(
    120% 104.06% at 50.07% -4%,
    rgba(51, 78, 104, 0.15) 1.9%,
    rgba(25, 29, 35, 0.95) 100%
  );
  border: 1px solid #7f9dbb;
  -webkit-backdrop-filter: blur(12.5px);
  backdrop-filter: blur(12.5px);
  border-radius: 10px;
  color: white;
  padding: 24px;
}

.header-card h1 {
  font-size: 28px;
  font-weight: 700;
  margin: 0 0 8px;
}
.header-card .subtitle {
  margin: 0 0 16px;
  color: rgba(255, 255, 255, 0.75);
}

.page-nav {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  padding-top: 12px;
  border-top: 1px solid rgba(255, 255, 255, 0.12);
}
.page-nav a {
  color: #00ffff;
  text-decoration: none;
  font-size: 14px;
  font-weight: 500;
}
.page-nav a:hover { text-decoration: underline; }
.page-nav a.router-link-exact-active {
  color: white;
  font-weight: 600;
}

.test-card h2 {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 18px;
  font-weight: 600;
  margin: 0 0 16px;
}
.section-icon {
  display: inline-flex;
  width: 22px;
  height: 22px;
  color: #00ffff;
}
.section-icon svg {
  width: 100%;
  height: 100%;
}

.hint {
  margin: 0 0 16px;
  color: rgba(255, 255, 255, 0.75);
  font-size: 14px;
  line-height: 1.5;
}

.grid {
  display: grid;
  gap: 12px;
}
.grid.cols-2 { grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); }
.grid.cols-3 { grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); }
.grid.cols-4 { grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); }
.mt-12 { margin-top: 12px; }

.btn {
  padding: 12px 16px;
  border-radius: 8px;
  border: 1px solid transparent;
  background: transparent;
  color: white;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  font-family: inherit;
  text-align: center;
}
.btn:focus-visible {
  outline: 2px solid rgba(0, 255, 255, 0.6);
  outline-offset: 2px;
}

.btn-success {
  background: rgba(48, 224, 161, 0.1);
  border-color: #30e0a1;
  color: #30e0a1;
}
.btn-success:hover { background: rgba(48, 224, 161, 0.2); }

.btn-warning {
  background: rgba(255, 215, 0, 0.1);
  border-color: #ffd700;
  color: #ffd700;
}
.btn-warning:hover { background: rgba(255, 215, 0, 0.2); }

.btn-error {
  background: rgba(220, 20, 60, 0.1);
  border-color: #dc143c;
  color: #dc143c;
}
.btn-error:hover { background: rgba(220, 20, 60, 0.2); }

.btn-info {
  background: rgba(0, 255, 255, 0.1);
  border-color: #00ffff;
  color: #00ffff;
}
.btn-info:hover { background: rgba(0, 255, 255, 0.2); }

.btn-outline {
  border-color: rgba(255, 255, 255, 0.3);
}
.btn-outline:hover {
  border-color: #00ffff;
  background: rgba(0, 255, 255, 0.06);
}

.btn-tonal {
  background: rgba(255, 255, 255, 0.08);
  border-color: rgba(255, 255, 255, 0.12);
}
.btn-tonal:hover { background: rgba(255, 255, 255, 0.14); }

.btn-tonal-danger {
  background: rgba(220, 20, 60, 0.12);
  border-color: rgba(220, 20, 60, 0.3);
  color: #ff7c95;
}
.btn-tonal-danger:hover { background: rgba(220, 20, 60, 0.2); }

.btn-tonal-primary {
  background: rgba(0, 255, 255, 0.12);
  border-color: rgba(0, 255, 255, 0.3);
  color: #00ffff;
  width: 100%;
}
.btn-tonal-primary:hover { background: rgba(0, 255, 255, 0.2); }

.field {
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.field-label {
  font-size: 13px;
  color: rgba(255, 255, 255, 0.7);
}
.field-input {
  padding: 10px 12px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 6px;
  color: white;
  font-size: 14px;
  font-family: inherit;
  transition: all 0.2s ease;
}
.field-input::placeholder {
  color: rgba(255, 255, 255, 0.4);
}
.field-input:hover {
  background: rgba(255, 255, 255, 0.08);
}
.field-input:focus {
  outline: none;
  background: rgba(255, 255, 255, 0.1);
  border-color: #00ffff;
}
</style>

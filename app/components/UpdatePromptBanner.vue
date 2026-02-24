<template>
  <Transition name="slide-up">
    <div
      v-if="showBanner"
      class="update-banner"
      role="dialog"
      aria-label="Update available"
    >
      <div class="update-banner-content">
        <span class="update-banner-icon">🔄</span>
        <div class="update-banner-text">
          <strong>Update available</strong>
          <span>Tap to get the latest version</span>
        </div>
      </div>
      <div class="update-banner-actions">
        <button class="update-banner-btn primary" @click="applyUpdate">
          Update now
        </button>
        <button class="update-banner-btn secondary" @click="dismiss">
          Later
        </button>
      </div>
      <button
        class="update-banner-close"
        aria-label="Dismiss"
        @click="dismiss"
      >
        ×
      </button>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

const showBanner = ref(false)
let registration: ServiceWorkerRegistration | null = null

function isMobile(): boolean {
  if (typeof window === 'undefined') return false
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  )
}

function isStandalone(): boolean {
  if (typeof window === 'undefined') return false
  return (
    (navigator as any).standalone === true ||
    window.matchMedia('(display-mode: standalone)').matches ||
    (window as any).matchMedia('(display-mode: fullscreen)').matches
  )
}

function promptUpdate(reg: ServiceWorkerRegistration) {
  if (!isMobile() || !isStandalone()) return
  registration = reg
  showBanner.value = true
}

function dismiss() {
  showBanner.value = false
}

function applyUpdate() {
  if (registration?.waiting) {
    registration.waiting.postMessage({ type: 'SKIP_WAITING' })
    showBanner.value = false
  }
}

onMounted(() => {
  if (!('serviceWorker' in navigator)) return

  navigator.serviceWorker.ready.then((reg) => {
    // Check if there's already a waiting SW
    if (reg.waiting) {
      promptUpdate(reg)
    }

    // Listen for new SW installing
    reg.addEventListener('updatefound', () => {
      const newWorker = reg.installing
      if (!newWorker) return

      newWorker.addEventListener('statechange', () => {
        if (newWorker.state === 'installed' && reg.waiting) {
          promptUpdate(reg)
        }
      })
    })
  })

  // When SW takes control (after skipWaiting), reload to get fresh app
  navigator.serviceWorker.addEventListener('controllerchange', () => {
    window.location.reload()
  })
})

</script>

<style scoped>
.update-banner {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(135deg, #059669 0%, #047857 100%);
  color: white;
  padding: 16px 48px 16px 16px;
  padding-bottom: calc(16px + env(safe-area-inset-bottom));
  box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.2);
  z-index: 999;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  flex-wrap: wrap;
}

.update-banner-content {
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1;
  min-width: 0;
}

.update-banner-icon {
  font-size: 28px;
  flex-shrink: 0;
}

.update-banner-text {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.update-banner-text strong {
  font-size: 15px;
}

.update-banner-text span {
  font-size: 13px;
  opacity: 0.95;
}

.update-banner-actions {
  display: flex;
  gap: 8px;
  flex-shrink: 0;
}

.update-banner-btn {
  padding: 10px 18px;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  transition: transform 0.15s ease;
}

.update-banner-btn.primary {
  background: white;
  color: #059669;
}

.update-banner-btn.secondary {
  background: rgba(255, 255, 255, 0.3);
  color: white;
}

.update-banner-btn:active {
  transform: scale(0.98);
}

.update-banner-close {
  position: absolute;
  top: 12px;
  right: 12px;
  width: 32px;
  height: 32px;
  border: none;
  background: rgba(255, 255, 255, 0.2);
  color: white;
  font-size: 24px;
  line-height: 1;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  transition: background 0.2s ease;
}

.update-banner-close:hover {
  background: rgba(255, 255, 255, 0.3);
}

.slide-up-enter-active,
.slide-up-leave-active {
  transition: transform 0.3s ease, opacity 0.3s ease;
}

.slide-up-enter-from,
.slide-up-leave-to {
  transform: translateY(100%);
  opacity: 0;
}
</style>

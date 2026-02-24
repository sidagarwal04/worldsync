<template>
  <Transition name="slide-up">
    <div
      v-if="showBanner"
      class="install-banner"
      role="dialog"
      aria-label="Install SyncHorizon app"
    >
      <div class="install-banner-content">
        <span class="install-banner-icon">📱</span>
        <div class="install-banner-text">
          <strong>Install SyncHorizon</strong>
          <span>{{ bannerMessage }}</span>
        </div>
      </div>
      <div class="install-banner-actions">
        <button
          v-if="isIOS"
          class="install-banner-btn primary"
          @click="dismiss"
        >
          Got it
        </button>
        <template v-else>
          <button class="install-banner-btn primary" @click="installApp">
            Install
          </button>
          <button class="install-banner-btn secondary" @click="dismiss">
            Not now
          </button>
        </template>
      </div>
      <button
        class="install-banner-close"
        aria-label="Dismiss"
        @click="dismiss"
      >
        ×
      </button>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'

const showBanner = ref(false)
const deferredPrompt = ref<any>(null)
const isIOS = ref(false)

const bannerMessage = computed(() =>
  isIOS.value
    ? 'Tap the Share button, then "Add to Home Screen"'
    : 'Add to your home screen for quick access'
)

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

function shouldShowBanner(): boolean {
  if (typeof window === 'undefined') return false
  if (!isMobile()) return false
  if (isStandalone()) return false
  return true
}

onMounted(() => {
  if (!shouldShowBanner()) return

  isIOS.value =
    /iPad|iPhone|iPod/.test(navigator.userAgent) ||
    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)

  // Android/Chrome: wait for beforeinstallprompt
  if (!isIOS.value) {
    const handler = (e: Event) => {
      e.preventDefault()
      deferredPrompt.value = e
      showBanner.value = true
    }
    window.addEventListener('beforeinstallprompt', handler)
    // Cleanup on unmount would need onBeforeUnmount - for app.vue root, we're fine
  } else {
    // iOS: show immediately (no native prompt)
    showBanner.value = true
  }

  window.addEventListener('appinstalled', () => {
    showBanner.value = false
  })
})

function dismiss() {
  showBanner.value = false
}

async function installApp() {
  if (deferredPrompt.value) {
    ;(deferredPrompt.value as any).prompt()
    const { outcome } = await (deferredPrompt.value as any).userChoice
    if (outcome === 'accepted') {
      showBanner.value = false
    }
    deferredPrompt.value = null
  }
}
</script>

<style scoped>
.install-banner {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 16px 48px 16px 16px;
  padding-bottom: calc(16px + env(safe-area-inset-bottom));
  box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.2);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  flex-wrap: wrap;
}

.install-banner-content {
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1;
  min-width: 0;
}

.install-banner-icon {
  font-size: 28px;
  flex-shrink: 0;
}

.install-banner-text {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.install-banner-text strong {
  font-size: 15px;
}

.install-banner-text span {
  font-size: 13px;
  opacity: 0.95;
}

.install-banner-actions {
  display: flex;
  gap: 8px;
  flex-shrink: 0;
}

.install-banner-btn {
  padding: 10px 18px;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  transition: transform 0.15s ease;
}

.install-banner-btn.primary {
  background: white;
  color: #667eea;
}

.install-banner-btn.secondary {
  background: rgba(255, 255, 255, 0.3);
  color: white;
}

.install-banner-btn:active {
  transform: scale(0.98);
}

.install-banner-close {
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

.install-banner-close:hover {
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

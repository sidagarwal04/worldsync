<template>
  <div class="app-container">
    <header class="app-header">
      <div class="header-content">
        <h1 class="app-title">
          <span class="logo">🌍</span> WorldSync
        </h1>
        <p class="app-subtitle">Global timezone converter</p>
      </div>
    </header>

    <main class="app-main">
      <div class="converter-wrapper">
        <TimezoneConverter />
      </div>
    </main>

    <footer class="app-footer">
      <p>&copy; 2026 WorldSync. Built with Nuxt.js | PWA Enabled</p>
      <button v-if="installPromptReady" @click="installApp" class="install-button">
        📥 Install App
      </button>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import TimezoneConverter from '~/components/TimezoneConverter.vue'

const installPromptReady = ref(false)
let deferredPrompt: any = null

onMounted(() => {
  // Listen for install prompt
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault()
    deferredPrompt = e
    installPromptReady.value = true
  })

  // Register service worker for PWA
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker
      .register('/sw.js')
      .then((registration) => {
        console.log('Service Worker registered:', registration)
      })
      .catch((error) => {
        console.log('Service Worker registration failed:', error)
      })
  }

  // Add to home screen prompt
  window.addEventListener('appinstalled', () => {
    console.log('App installed successfully')
    installPromptReady.value = false
  })
})

const installApp = async () => {
  if (deferredPrompt) {
    deferredPrompt.prompt()
    const { outcome } = await deferredPrompt.userChoice
    console.log(`User response to the install prompt: ${outcome}`)
    deferredPrompt = null
    installPromptReady.value = false
  }
}
</script>

<style scoped>
.app-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background: linear-gradient(135deg, #1e3c72 0%, #2a5298 50%, #7e22ce 100%);
  background-attachment: fixed;
  color: white;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial,
    sans-serif;
}

.app-header {
  background: rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  padding: 32px 20px;
  text-align: center;
  width: 100%;
}

.header-content {
  max-width: 1200px;
  width: 100%;
  margin: 0 auto;
  text-align: center;
}

.app-title {
  font-size: 42px;
  font-weight: 700;
  margin: 0 0 8px 0;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
}

.logo {
  font-size: 48px;
  display: block;
}

.app-subtitle {
  font-size: 16px;
  margin: 0;
  opacity: 0.8;
}

.app-main {
  flex: 1;
  padding: 48px 20px;
  max-width: 1200px;
  width: 100%;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.converter-wrapper {
  width: 100%;
  max-width: 1000px;
  margin-bottom: 48px;
  animation: slideUp 0.6s ease-out;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.app-footer {
  background: rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(10px);
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  padding: 24px 20px;
  text-align: center;
  font-size: 14px;
  opacity: 0.8;
  width: 100%;
}

.app-footer p {
  margin: 0 0 12px 0;
}

.install-button {
  padding: 10px 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  border-radius: 8px;
  color: white;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 14px;
}

.install-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
}

.install-button:active {
  transform: translateY(0);
}

@media (max-width: 768px) {
  .app-header {
    padding: 24px 16px;
  }

  .app-title {
    font-size: 32px;
    gap: 8px;
  }

  .logo {
    font-size: 36px;
  }

  .app-subtitle {
    font-size: 14px;
  }

  .app-main {
    padding: 32px 16px;
  }

  .converter-wrapper {
    margin-bottom: 32px;
  }

  .app-footer {
    padding: 16px;
    font-size: 12px;
  }
}

@media (max-width: 480px) {
  .app-container {
    min-height: 100vh;
  }

  .app-header {
    padding: 20px 12px;
  }

  .app-title {
    font-size: 26px;
    gap: 6px;
  }

  .logo {
    font-size: 28px;
  }

  .app-main {
    padding: 24px 12px;
  }

  .converter-wrapper {
    margin-bottom: 24px;
  }
}
</style>


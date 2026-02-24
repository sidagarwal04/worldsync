<template>
  <div class="app-container">
    <header class="app-header">
      <div class="header-content">
        <h1 class="app-title">
          <img src="/icon-192.png" alt="" class="logo" width="48" height="48" /> SyncHorizon
        </h1>
        <p class="app-subtitle">Global timezone converter with daylight savings support</p>
      </div>
    </header>

    <main class="app-main">
      <div class="converter-wrapper">
        <TimezoneConverter />
      </div>
    </main>

    <footer class="app-footer">
      <p class="footer-tagline">Powered by GenAI • Built with ❤️ for the world</p>
      <p class="footer-credits">© 2026 SyncHorizon • <a href="https://meetsid.dev" target="_blank" rel="noopener noreferrer" class="footer-link">meetsid.dev</a> • Powered by Netlify</p>
    </footer>

    <!-- Install prompt: shows on first load or refresh, mobile only -->
    <InstallPromptBanner />
    <!-- Update prompt: shows when new version is available, installed app only -->
    <UpdatePromptBanner />
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import TimezoneConverter from '~/components/TimezoneConverter.vue'
import InstallPromptBanner from '~/components/InstallPromptBanner.vue'
import UpdatePromptBanner from '~/components/UpdatePromptBanner.vue'

onMounted(() => {
  // Register service worker for PWA (updateViaCache: 'none' = always check for SW updates)
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker
      .register('/sw.js', { updateViaCache: 'none' })
      .then((registration) => {
        console.log('Service Worker registered:', registration)
        // Check for updates when app gains focus (e.g. user returns to tab)
        document.addEventListener('visibilitychange', () => {
          if (document.visibilityState === 'visible') {
            registration.update()
          }
        })
      })
      .catch((error) => {
        console.log('Service Worker registration failed:', error)
      })
  }
})
</script>

<style scoped>
.app-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  min-height: 100dvh; /* Dynamic viewport for mobile browsers */
  background: linear-gradient(135deg, #1e3c72 0%, #2a5298 50%, #7e22ce 100%);
  background-attachment: fixed;
  color: white;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial,
    sans-serif;
  padding: env(safe-area-inset-top) env(safe-area-inset-right) env(safe-area-inset-bottom) env(safe-area-inset-left);
}

.app-header {
  background: rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  padding: 20px 16px;
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
  width: 48px;
  height: 48px;
  display: block;
  border-radius: 12px;
  flex-shrink: 0;
}

.app-subtitle {
  font-size: 16px;
  margin: 0;
  opacity: 0.8;
}

.app-main {
  flex: 1;
  padding: 20px 16px;
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
  margin-bottom: 16px;
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
  padding: 20px;
  text-align: center;
  font-size: 14px;
  opacity: 0.9;
  width: 100%;
}

.app-footer p {
  margin: 0 0 8px 0;
}

.app-footer p:last-of-type {
  margin-bottom: 12px;
}

.footer-link {
  color: white;
  text-decoration: none;
  border-bottom: 1px solid rgba(255, 255, 255, 0.5);
  transition: opacity 0.2s ease;
}

.footer-link:hover {
  opacity: 0.9;
  border-bottom-color: white;
}

@media (max-width: 768px) {
  .app-header {
    padding: 16px 12px;
  }

  .app-title {
    font-size: 32px;
    gap: 8px;
  }

  .logo {
    width: 36px;
    height: 36px;
  }

  .app-subtitle {
    font-size: 14px;
  }

  .app-main {
    padding: 16px 12px;
  }

  .converter-wrapper {
    margin-bottom: 12px;
    width: 100%;
  }

  .app-footer {
    padding: 12px 16px;
    font-size: 12px;
  }
}

@media (max-width: 480px) {
  .app-container {
    min-height: 100vh;
    min-height: 100dvh;
  }

  .app-header {
    padding: 14px 12px;
  }

  .app-title {
    font-size: 26px;
    gap: 6px;
  }

  .logo {
    width: 28px;
    height: 28px;
  }

  .app-subtitle {
    font-size: 13px;
  }

  .app-main {
    padding: 12px 10px;
  }

  .converter-wrapper {
    margin-bottom: 10px;
  }

  .app-footer {
    padding: 12px 10px;
    font-size: 11px;
  }
}
</style>


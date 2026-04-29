const API_URL = 'https://functions.yandexcloud.net/d4evrag730e6sqoil00l'
window.API_URL = API_URL
const IS_DEMO_MODE = new URLSearchParams(window.location.search).get('demo') === '1'
window.IS_DEMO_MODE = IS_DEMO_MODE
if (IS_DEMO_MODE) document.documentElement.classList.add('demo-mode')

async function callOracle(instrument, tier, data) {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ instrument, tier, data, user: window.currentUser || null }),
  })

  const result = await response.json().catch(() => ({}))

  if (!response.ok || !result.success) {
    throw new Error(result.error || 'Ошибка сервера')
  }

  try {
    if (window.analytics && typeof window.analytics.trackReadingComplete === 'function') {
      window.analytics.trackReadingComplete(instrument, tier)
    }
  } catch (_e) {
    // ignore analytics errors
  }

  return result.text
}

window.callOracle = callOracle

function showError(container, message) {
  const div = document.createElement('div')
  div.className = 'error-msg'
  div.textContent = message
  container.innerHTML = ''
  container.appendChild(div)
}

window.showError = showError

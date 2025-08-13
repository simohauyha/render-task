// index.js (для Render.com)
const puppeteer = require('puppeteer');

// --- НАСТРОЙКИ ---
const url = 'https://tarazbackery.vercel.app/';
const pageOpenDurationSeconds = 10;
// -----------------

async function runTask() {
  console.log(`[${new Date().toISOString()}] Запускаю задачу...`);
  let browser = null;
  try {
    console.log('  - Запускаю Puppeteer в headless режиме...');
    browser = await puppeteer.launch({
      // На сервере ВСЕГДА должно быть true, так как нет экрана
      headless: false, 
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const page = await browser.newPage();

    // "Маскируемся" под обычного пользователя
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36');
    await page.setViewport({ width: 1920, height: 1080 });

    console.log(`  - Перехожу по URL: ${url}`);
    
    // Используем увеличенный таймаут и ждем загрузки основного контента
    await page.goto(url, {
      waitUntil: 'domcontentloaded',
      timeout: 60000 // Таймаут 60 секунд
    });
    
    console.log(`  - Страница открыта. Жду ${pageOpenDurationSeconds} секунд.`);
    
    await new Promise(resolve => setTimeout(resolve, pageOpenDurationSeconds * 1000));
    
    console.log(`  - Ожидание завершено.`);

  } catch (error) {
    console.error('!!! Произошла ошибка во время выполнения задачи:', error);
  } finally {
    if (browser) {
      await browser.close();
      console.log('  - Браузер закрыт. Задача завершена.');
    }
  }
}

// Просто запускаем нашу функцию ОДИН РАЗ.
// Render позаботится о повторных запусках по расписанию.
runTask();
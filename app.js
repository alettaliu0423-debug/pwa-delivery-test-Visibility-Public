'use strict';
const VERSION = 'PWA-TEST-0.1.1';
const DB_NAME = 'pwa-delivery-test-v1';
const $ = id => document.getElementById(id);
let db, registration;
const report = (message, error = false) => { $('message').textContent = message; $('message').className = error ? 'error' : ''; };
$('launch').textContent = new Date().toISOString() + ' / ' + Array.from(crypto.getRandomValues(new Uint8Array(4)), x => x.toString(16).padStart(2, '0')).join('');
$('mode').textContent = matchMedia('(display-mode: standalone)').matches ? 'standalone（独立窗口）' : matchMedia('(display-mode: fullscreen)').matches ? 'fullscreen' : 'browser / 其他容器';
const network = () => { $('network').textContent = navigator.onLine ? 'Online（浏览器报告）' : 'Offline（浏览器报告）'; };
network();
addEventListener('offline', network);
addEventListener('online', () => { network(); if (registration) checkUpdate(); });
function display(record) {
  $('count').textContent = record ? record.count : 0;
  $('saved').textContent = record ? '已从 IndexedDB 读取；最后保存：' + record.savedAt : '测试库无记录。点击“增加 1 并保存”创建第一条记录。';
}
function readRecord() {
  return new Promise((resolve, reject) => {
    const tx = db.transaction('records', 'readonly');
    let record;
    const request = tx.objectStore('records').get('delivery');
    request.onsuccess = () => { record = request.result; };
    tx.oncomplete = () => { display(record); resolve(); };
    tx.onabort = () => reject(tx.error || new Error('读取事务中止'));
    tx.onerror = () => {};
  });
}
function increment() {
  return new Promise((resolve, reject) => {
    const tx = db.transaction('records', 'readwrite');
    const store = tx.objectStore('records');
    let record;
    const request = store.get('delivery');
    request.onsuccess = () => {
      record = { id: 'delivery', count: (request.result?.count || 0) + 1, savedAt: new Date().toISOString() };
      store.put(record);
    };
    tx.oncomplete = () => { display(record); resolve(); };
    tx.onabort = () => reject(tx.error || new Error('保存事务中止'));
    tx.onerror = () => {};
  });
}
async function initDB() {
  db = await new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1);
    request.onupgradeneeded = () => { request.result.createObjectStore('records', { keyPath: 'id' }); };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
    request.onblocked = () => report('测试数据库被其他测试页面占用，请关闭其他测试标签。', true);
  });
  db.onversionchange = () => { db.close(); $('increment').disabled = true; $('read').disabled = true; report('数据库连接已关闭，请重新载入。', true); };
  await readRecord();
  $('increment').disabled = false;
  $('read').disabled = false;
}
$('increment').onclick = async () => {
  $('increment').disabled = true;
  try { await increment(); report('IndexedDB 保存事务已完成。请记录计数，再测试关闭与恢复。'); }
  catch (error) { report('保存失败：' + error.message, true); }
  finally { $('increment').disabled = false; }
};
$('read').onclick = async () => {
  try { await readRecord(); report('已重新读取 IndexedDB。'); }
  catch (error) { report('读取失败：' + error.message, true); }
};
function workerInfo(worker) {
  return new Promise((resolve, reject) => {
    const channel = new MessageChannel();
    const timer = setTimeout(() => { channel.port1.close(); reject(new Error('Worker 状态查询超时')); }, 5000);
    channel.port1.onmessage = event => { clearTimeout(timer); channel.port1.close(); resolve(event.data); };
    worker.postMessage({ type: 'INFO' }, [channel.port2]);
  });
}
async function showWaiting() {
  if (!registration.waiting) return;
  try {
    const info = await workerInfo(registration.waiting);
    $('update-state').textContent = '已下载并等待启用：' + info.version;
    $('apply-update').hidden = false;
  } catch (error) { report(error.message, true); }
}
async function showActive() {
  const worker = navigator.serviceWorker.controller;
  if (!worker) { $('worker').textContent = '当前页面尚未受控；首次安装完成后请重新载入'; return; }
  const info = await workerInfo(worker);
  $('worker').textContent = '当前控制版本：' + info.version;
  $('cache').textContent = info.cacheReady ? '当前版本全部启动资源已缓存（仍需断网实测）' : '缓存不完整，不可判定离线就绪';
  if (info.version !== VERSION) report('页面与 Worker 版本不一致，请关闭其他测试窗口后重新载入。', true);
}
let applying = false;
navigator.serviceWorker?.addEventListener('controllerchange', () => {
  if (applying) { location.reload(); return; }
  showActive().catch(error => report(error.message, true));
});
async function checkUpdate() {
  if (!registration) return;
  $('check-update').disabled = true;
  $('update-state').textContent = '正在请求更新检查';
  try {
    await registration.update();
    if (registration.waiting) await showWaiting();
    else if (registration.installing) $('update-state').textContent = '新 Worker 正在下载资源；等待完成';
    else $('update-state').textContent = '检查完成；未发现等待启用的更新';
  } catch (error) { $('update-state').textContent = '检查失败：' + error.message; }
  finally { $('check-update').disabled = false; }
}
$('check-update').onclick = checkUpdate;
$('apply-update').onclick = () => {
  if (!registration?.waiting) { report('当前没有等待启用的新版本。', true); return; }
  applying = true;
  $('apply-update').disabled = true;
  report('正在启用新版本；IndexedDB 不会清空。');
  registration.waiting.postMessage({ type: 'ACTIVATE' });
};
async function initWorker() {
  if (!isSecureContext || !('serviceWorker' in navigator)) throw new Error('需要支持 Service Worker 的 HTTPS 浏览器环境。');
  registration = await navigator.serviceWorker.register('./sw.js', { scope: './', updateViaCache: 'none' });
  $('check-update').disabled = false;
  function observe(worker) {
    if (!worker) return;
    worker.addEventListener('statechange', () => {
      if (worker.state === 'installed') {
        if (registration.waiting) showWaiting();
        else navigator.serviceWorker.ready.then(showActive).catch(error => report(error.message, true));
      }
      if (worker.state === 'redundant') report('Worker 安装或更新未完成，请联网检查资源与 HTTPS。', true);
    });
  }
  registration.addEventListener('updatefound', () => { $('update-state').textContent = '正在安装 Worker 并缓存资源'; observe(registration.installing); });
  observe(registration.installing);
  await showWaiting();
  await navigator.serviceWorker.ready;
  await showActive();
}
initDB().then(() => report('测试数据库已打开。请检查 Worker 状态后开始实测。')).catch(error => report('IndexedDB 初始化失败：' + error.message, true));
initWorker().catch(error => { $('worker').textContent = '不可用：' + error.message; report(error.message, true); });

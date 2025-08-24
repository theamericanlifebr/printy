const defaultColor = 'linear-gradient(135deg, #000000, #4F4F4F)';

const bagsInfo = [
  {title: 'Barras de Ferro 1', boxColor: 'linear-gradient(135deg,#000000,#4F4F4F)', items: ['barra1_palco.png','barra2_palco.png','barra3_palco.png','barra4_palco.png']},
  {title: 'Barras de Ferro 2', boxColor: 'linear-gradient(135deg,#000000,#00008B)', items: ['barra5_palco.png','barra6_palco.png','barra7_palco.png','barra8_palco.png']},
  {title: 'Barras de Ferro 3', boxColor: 'linear-gradient(135deg,#000000,#4B0082)', items: ['barra9_palco.png','barra10_palco.png','barra11_palco.png','barra12_palco.png']},
  {title: 'Barras de Ferro 4', boxColor: 'linear-gradient(135deg,#000000,#FF8C00)', items: ['barra13_palco.png','barra14_palco.png','barra15_palco.png','barra16_palco.png']},
  {title: 'Stella', boxColor: 'linear-gradient(135deg,#000000,#4F4F4F)', modalColor: 'linear-gradient(135deg,#ff1493,#ff69b4)', items: ['blusa_stella.png','jaleco_stella.png','maquiagem_stella.png','meia1_stella.png','meia2_stella.png','peruca_stella.png','saia_stella.png','sapato1_stella.png','sapato2_stella.png']},
  {title: 'WJ Barras de Ferro 2', boxColor: 'linear-gradient(135deg,#000000,#00008B)', modalColor: 'linear-gradient(135deg,#ff0000,#ffd700)', items: ['calça wj.png','colete_wj.png','luva_wj.png','mascara wj.png','sapatos_wj.png']},
  {title: 'Professor Xuxu', boxColor: 'linear-gradient(135deg,#000000,#4B0082)', modalColor: 'linear-gradient(135deg,#ffd700,#add8e6)', items: ['boina_professor.png','oculos_professor.png','calça_professor.png','camisa_professor.png','jaleco_professor.png','luva1_professor.png','luva2_professor.png','sapato1_professor.png','sapato2_professor.png']},
  {title: 'Iluminação', boxColor: 'linear-gradient(135deg,#000000,#FF8C00)', modalColor: 'linear-gradient(135deg,#000000,#32CD32,#800080)', items: ['extensao_palco.png','laser1_palco.png','laser2_palco.png','laser3_palco.png','laser4_palco.png','laser_palco.png','setlight1_palco.png','setlight2_palco.png','setlight3_palco.png']},
  {title: 'Box Bit', boxColor: defaultColor, items: ['luva1_bit.png','luva2_bit.png','mascara bit.png','roupa_bit.png','sapato1_bit.png','sapato2_bit.png']},
  {title: 'Bag Byte', boxColor: defaultColor, items: ['luva1_byte.png','luva2_byte.png','mascara_byte.png','roupa_byte.png','sapato1_byte.png','sapato2_byte.png']},
  {title: 'Bag Gerente', boxColor: defaultColor, items: ['boina_gerente.png','luva1_gerente.png','luva2_gerente.png','oculos_gerente.png','terno_gerente.png']},
  {title: 'Bag Duque', boxColor: defaultColor, items: ['avental_duque.png','calca_duque.png','cartola_duque.png','oculos_duque.png']}
];

const musicList = [
  'Mundo colorido',
  'Casinha do coração',
  'Você é especial',
  'Fábrica de Heróis',
  'Você não é todo mundo',
  'Eu vim aqui para adorar',
  'Louvarei',
  'Romanos 8-38',
  'Tudo Doido por Jesus',
  'Corta',
  'Vencendo vem Jesus',
  'Louvarei'
];

function songUrl(title) {
  return 'Songs/' + encodeURIComponent(title + '.mp3');
}
let checkedItemsPerBag = [];
let currentBagIndex = null;
let currentPage = 0;
let toggleTracker = {};
let currentAudio = null;
const songsPerPage = 6;
let currentMusicPage = 0;
const songTapCounts = {};
const songTapTimers = {};
let musicTouchStartX = 0;
let musicTouchStartY = 0;
const toggleSequence = [0, 1, 2, 3, 5];
let toggleIndex = 0;
const pauseSequence = [0, 1, 2, 1, 0];
let pauseIndex = 0;
let moveSongUpEnabled = true;

let bagItems = [];
let currentItemPage = 0;
let currentBagItems = [];

document.addEventListener('copy', e => e.preventDefault());
document.addEventListener('cut', e => e.preventDefault());
document.addEventListener('paste', e => e.preventDefault());
document.addEventListener('contextmenu', e => e.preventDefault());

function renderPage() {
  const container = document.getElementById('bags-page');
  container.innerHTML = '';
  const start = currentPage * 4;
  const end = start + 4;
  bagsInfo.slice(start, end).forEach((bag, idx) => {
    const globalIndex = start + idx;
    const wrapper = document.createElement('div');
    wrapper.className = 'bag-wrapper';

    const bagDiv = document.createElement('div');
    bagDiv.className = 'bag';
    bagDiv.style.background = bag.boxColor || defaultColor;
    bagDiv.style.color = '#fff';
    bagDiv.innerText = bag.title;
    bagDiv.onclick = () => openBag(bag.title, globalIndex);
    wrapper.appendChild(bagDiv);

    const progress = document.createElement('div');
    progress.className = 'bag-progress';
    const percent = (checkedItemsPerBag[globalIndex].size / bagItems[globalIndex].length) * 100;
    progress.innerHTML = `<div class="bag-progress-bar" id="bag-progress-${globalIndex}" style="width:${percent}%"></div>`;
    wrapper.appendChild(progress);

    container.appendChild(wrapper);
  });
  updateGlobalProgress();
}

function prevPage() {
  if (currentPage > 0) {
    currentPage--;
    renderPage();
  }
}

function nextPage() {
  if ((currentPage + 1) * 4 < bagsInfo.length) {
    currentPage++;
    renderPage();
  }
}

// Swipe detection for mobile
let touchStartX = 0;
document.addEventListener('touchstart', e => {
  touchStartX = e.changedTouches[0].screenX;
});
document.addEventListener('touchend', e => {
  const touchEndX = e.changedTouches[0].screenX;
  if (touchEndX < touchStartX - 50) nextPage();
  if (touchEndX > touchStartX + 50) prevPage();
});

let modalTouchStartX = 0;
let modalTouchStartY = 0;
const modal = document.getElementById('modal');
modal.addEventListener('touchstart', e => {
  modalTouchStartX = e.changedTouches[0].screenX;
  modalTouchStartY = e.changedTouches[0].screenY;
});
modal.addEventListener('touchend', e => {
  const endX = e.changedTouches[0].screenX;
  const endY = e.changedTouches[0].screenY;
  const dx = endX - modalTouchStartX;
  const dy = endY - modalTouchStartY;
  if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy)) {
    if (dx < 0) nextItemPage();
    else prevItemPage();
  } else if (dy < -50 && Math.abs(dy) > Math.abs(dx)) {
    document.getElementById('modal').style.display = 'none';
  }
});

function openBag(title, bagIndex) {
  document.getElementById('modal').style.display = 'flex';
  document.getElementById('modal-content').style.background = 'linear-gradient(#ffffff, #cccccc)';
  document.getElementById('bag-title').innerText = title;
  currentBagIndex = bagIndex;
  currentItemPage = 0;
  currentBagItems = bagItems[bagIndex];
  renderItems();
  updateProgress();
}

function renderItems() {
  const start = currentItemPage * 12;
  const end = Math.min(start + 12, currentBagItems.length);
  const folder = encodeURIComponent(bagsInfo[currentBagIndex].title);
  const list = document.getElementById('items-list');
  list.innerHTML = '';
  for (let i = start; i < end; i++) {
    const item = currentBagItems[i];
    const checked = checkedItemsPerBag[currentBagIndex].has(i);
    const src = `Imagens/${folder}/${encodeURIComponent(item)}`;
    const img = document.createElement('img');
    img.id = `item-${i}`;
    img.src = src;
    img.alt = 'item';
    img.className = `item-img ${checked ? 'checked' : ''}`;

    img.addEventListener('click', () => handleItemTap(i));
    img.addEventListener('touchend', e => { e.preventDefault(); handleItemTap(i); });

    list.appendChild(img);
  }
}

function nextItemPage() {
  if ((currentItemPage + 1) * 12 < currentBagItems.length) {
    currentItemPage++;
    renderItems();
  }
}

function prevItemPage() {
  if (currentItemPage > 0) {
    currentItemPage--;
    renderItems();
  }
}

function closeBag(event) {
  if (event.target.id === 'modal') {
    document.getElementById('modal').style.display = 'none';
  }
}

function toggleItem(index) {
  const key = currentBagIndex + '-' + index;
  const now = Date.now();
  if (toggleTracker[key] && now - toggleTracker[key].start < 5000) {
    toggleTracker[key].count++;
  } else {
    toggleTracker[key] = { count: 1, start: now };
  }
  if (toggleTracker[key] && toggleTracker[key].count >= 6) {
    toggleTracker[key] = null;
    showMusicOverlay();
  }

  const itemElement = document.getElementById(`item-${index}`);
  if (checkedItemsPerBag[currentBagIndex].has(index)) {
    checkedItemsPerBag[currentBagIndex].delete(index);
    itemElement.classList.remove('checked');
  } else {
    checkedItemsPerBag[currentBagIndex].add(index);
    itemElement.classList.add('checked');
    new Audio('Songs/Sucesso.mp3').play();
  }
  saveProgress();
  updateProgress();
}

function handleItemTap(idx) {
  toggleItem(idx);
}

function updateProgress() {
  const items = currentBagItems;
  const checkedCount = checkedItemsPerBag[currentBagIndex].size;
  const percent = (checkedCount / items.length) * 100;
  document.getElementById('progress-bar').style.width = percent + '%';
  document.getElementById(`bag-progress-${currentBagIndex}`).style.width = percent + '%';
  updateGlobalProgress();
}

function updateGlobalProgress() {
  let totalItems = 0;
  let totalChecked = 0;
  bagsInfo.forEach((_, idx) => {
    totalItems += bagItems[idx].length;
    totalChecked += checkedItemsPerBag[idx].size;
  });
  const globalPercent = (totalChecked / totalItems) * 100;
  document.getElementById('global-progress-bar').style.width = globalPercent + '%';
}

function loadProgress() {
  const saved = localStorage.getItem('checkedItemsPerBag');
  if (saved) {
    const parsed = JSON.parse(saved);
    checkedItemsPerBag = bagItems.map((items, idx) => new Set((parsed[idx] || []).filter(i => i < items.length)));
  } else {
    checkedItemsPerBag = bagItems.map(() => new Set());
  }
}

function saveProgress() {
  const data = checkedItemsPerBag.map(set => Array.from(set));
  localStorage.setItem('checkedItemsPerBag', JSON.stringify(data));
}

async function loadBagItems() {
  const tasks = bagsInfo.map(async (bag, idx) => {
    const folder = encodeURIComponent(bag.title);
    try {
      const res = await fetch(`Imagens/${folder}/`);
      if (res.ok) {
        const text = await res.text();
        const matches = Array.from(text.matchAll(/href="([^"]+\.png)"/g)).map(m => decodeURIComponent(m[1]));
        bagItems[idx] = matches.length ? matches : bag.items;
      } else {
        bagItems[idx] = bag.items;
      }
    } catch (e) {
      bagItems[idx] = bag.items;
    }
  });
  await Promise.all(tasks);
}

async function preloadContent() {
  const promises = [];
  bagItems.forEach((items, idx) => {
    const folder = encodeURIComponent(bagsInfo[idx].title);
    items.forEach(item => {
      const img = new Image();
      img.src = `Imagens/${folder}/${encodeURIComponent(item)}`;
      promises.push(new Promise(res => { img.onload = img.onerror = res; }));
    });
  });
  await Promise.all(promises);
}

async function cacheAssets() {
  const assets = [];
  bagsInfo.forEach(bag => {
    const folder = encodeURIComponent(bag.title);
    bag.items.forEach(item => {
      assets.push(`Imagens/${folder}/${encodeURIComponent(item)}`);
    });
  });

  let total = 0;
  for (const url of assets) {
    try {
      const head = await fetch(url, { method: 'HEAD' });
      const len = head.headers.get('content-length');
      total += len ? parseInt(len) : 0;
    } catch (e) {}
  }

  let loaded = 0;
  for (const url of assets) {
    try {
      const res = await fetch(url);
      const blob = await res.blob();
      loaded += blob.size;
      const reader = new FileReader();
      const dataUrl = await new Promise(resolve => {
        reader.onload = () => resolve(reader.result);
        reader.readAsDataURL(blob);
      });
      localStorage.setItem('asset:' + url, dataUrl);
    } catch (e) {}
    updateLoader(loaded, total);
  }
  document.getElementById('loader-overlay').style.display = 'none';
}

function updateLoader(loaded, total) {
  const pct = total ? Math.round((loaded / total) * 100) : 0;
  const circle = document.querySelector('.loader-circle circle');
  const dash = 345 - (345 * pct) / 100;
  circle.style.strokeDashoffset = dash;
  document.getElementById('loader-text').innerText = pct + '%';
  document.getElementById('loader-mb').innerText = `${(loaded / 1048576).toFixed(2)} MB / ${(total / 1048576).toFixed(2)} MB`;
}

function setupMenu() {
  document.getElementById('menu-bags').addEventListener('click', () => {
    document.getElementById('bags-page').style.display = 'flex';
    hideMusicOverlay();
  });
  document.getElementById('menu-music').addEventListener('click', showMusicOverlay);
  document.getElementById('menu-more').addEventListener('click', () => {});
}

async function init() {
  await loadBagItems();
  if (!localStorage.getItem('assetsCached')) {
    await cacheAssets();
    localStorage.setItem('assetsCached', 'true');
  } else {
    document.getElementById('loader-overlay').style.display = 'none';
  }
  await preloadContent();
  loadProgress();
  renderPage();
  setupMenu();
}

function disableAllButtons(disable) {
  document.querySelectorAll('button').forEach(btn => btn.disabled = disable);
}

function fadeOutAndPause(cb) {
  if (!currentAudio) {
    if (cb) cb();
    return;
  }
  const audio = currentAudio;
  const initial = audio.volume;
  const step = initial / 30;
  const interval = setInterval(() => {
    if (audio.volume > step) {
      audio.volume -= step;
    } else {
      clearInterval(interval);
      audio.pause();
      audio.volume = initial;
      disableAllButtons(false);
      document.querySelectorAll('.boxmusic').forEach(box => box.classList.remove('playing'));
      currentAudio = null;
      if (cb) cb();
    }
  }, 100);
}

function flashMusicBoxes() {
  document.querySelectorAll('.boxmusic').forEach(box => {
    const original = box.style.background;
    box.style.background = 'orange';
    setTimeout(() => {
      box.style.background = original;
    }, 500);
  });
}

let downloadPromises = {};
const startGradient = ['#808080', '#d3d3d3'];
const endGradient = ['#155fe8', '#4a90ff'];

function hexToRgb(hex) {
  const num = parseInt(hex.slice(1), 16);
  return [(num >> 16) & 255, (num >> 8) & 255, num & 255];
}

function rgbToHex(r, g, b) {
  return '#' + [r, g, b].map(x => x.toString(16).padStart(2, '0')).join('');
}

function mixColors(c1, c2, p) {
  const [r1, g1, b1] = hexToRgb(c1);
  const [r2, g2, b2] = hexToRgb(c2);
  const r = Math.round(r1 + (r2 - r1) * p);
  const g = Math.round(g1 + (g2 - g1) * p);
  const b = Math.round(b1 + (b2 - b1) * p);
  return rgbToHex(r, g, b);
}

function updateDownloadProgress(idx, p) {
  const box = document.getElementById(`music-box-${idx}`);
  if (!box) return;
  const c1 = mixColors(startGradient[0], endGradient[0], p);
  const c2 = mixColors(startGradient[1], endGradient[1], p);
  box.style.background = `linear-gradient(${c1}, ${c2})`;
  if (p >= 1) box.classList.remove('not-downloaded');
}

function ensureSongDownloaded(idx) {
  const title = musicList[idx];
  const stored = localStorage.getItem('song:' + title);
  if (stored) return Promise.resolve(stored);
  if (!downloadPromises[title]) {
    downloadPromises[title] = downloadSong(title, idx).finally(() => {
      delete downloadPromises[title];
    });
  }
  return downloadPromises[title];
}

async function downloadSong(title, idx) {
  const url = songUrl(title);
  const res = await fetch(url);
  const total = +res.headers.get('Content-Length') || 0;
  const reader = res.body.getReader();
  let received = 0;
  const chunks = [];
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    chunks.push(value);
    received += value.length;
    if (total) updateDownloadProgress(idx, received / total);
  }
  const blob = new Blob(chunks);
  const dataUrl = await new Promise(resolve => {
    const fr = new FileReader();
    fr.onload = () => resolve(fr.result);
    fr.readAsDataURL(blob);
  });
  localStorage.setItem('song:' + title, dataUrl);
  updateDownloadProgress(idx, 1);
  return dataUrl;
}

function updateOverlayBackground() {
  const overlay = document.getElementById('music-overlay');
  if (!overlay) return;
  overlay.style.background = moveSongUpEnabled
    ? 'linear-gradient(#ffffff, #cccccc)'
    : 'linear-gradient(#add8e6, #b0e0e6)';
}

function renderMusicOverlay() {
  const overlay = document.getElementById('music-overlay');
  overlay.innerHTML = '';
  const start = currentMusicPage * songsPerPage;
  const end = start + songsPerPage;
  musicList.slice(start, end).forEach((title, i) => {
    const idx = start + i;
    const box = document.createElement('div');
    const downloaded = localStorage.getItem('song:' + title);
    box.className = downloaded ? 'boxmusic' : 'boxmusic not-downloaded';
    box.id = `music-box-${idx}`;
    box.innerText = title;

    let pressTimer;
    let longPress = false;
    const startPress = () => {
      if (currentAudio) return;
      longPress = false;
      pressTimer = setTimeout(() => {
        longPress = true;
        box.classList.add('flash');
        setTimeout(() => box.classList.remove('flash'), 500);
        playMusic(idx);
      }, 1000);
    };
    const cancelPress = () => {
      clearTimeout(pressTimer);
    };

    box.addEventListener('touchstart', startPress);
    box.addEventListener('touchend', cancelPress);
    box.addEventListener('touchmove', cancelPress);
    box.addEventListener('mousedown', startPress);
    box.addEventListener('mouseup', cancelPress);
    box.addEventListener('mouseleave', cancelPress);

    box.addEventListener('click', () => {
      if (longPress) {
        longPress = false;
        return;
      }
      handleMusicTap(idx);
    });

    const progress = document.createElement('div');
    progress.className = 'music-progress';
    progress.innerHTML = `<div class="music-progress-bar" id="music-progress-${idx}"></div>`;
    box.appendChild(progress);
    overlay.appendChild(box);
  });
}

function showMusicOverlay() {
  const overlay = document.getElementById('music-overlay');
  if (!overlay.dataset.init) {
    overlay.addEventListener('touchstart', e => {
      musicTouchStartX = e.changedTouches[0].screenX;
      musicTouchStartY = e.changedTouches[0].screenY;
    });
    overlay.addEventListener('touchend', e => {
      const endX = e.changedTouches[0].screenX;
      const endY = e.changedTouches[0].screenY;
      const dx = endX - musicTouchStartX;
      const dy = endY - musicTouchStartY;
      if (currentAudio && (Math.abs(dx) > 50 || Math.abs(dy) > 50)) {
        flashMusicBoxes();
      }
      // deslize para a esquerda para acessar a próxima página de músicas
      if (Math.abs(dx) > Math.abs(dy)) {
        if (dx < 0) nextMusicPage();
        if (dx > 0) prevMusicPage();
      }
    });
    overlay.dataset.init = 'true';
  }
  currentMusicPage = 0;
  renderMusicOverlay();
  updateOverlayBackground();
  overlay.style.display = 'flex';
  requestAnimationFrame(() => (overlay.style.opacity = 1));
}

function hideMusicOverlay() {
  const overlay = document.getElementById('music-overlay');
  overlay.style.opacity = 0;
  setTimeout(() => (overlay.style.display = 'none'), 300);
}

function nextMusicPage() {
  if ((currentMusicPage + 1) * songsPerPage < musicList.length) {
    currentMusicPage++;
    renderMusicOverlay();
  }
}

function prevMusicPage() {
  if (currentMusicPage > 0) {
    currentMusicPage--;
    renderMusicOverlay();
  }
}

async function playMusic(idx) {
  const title = musicList[idx];
  const src = await ensureSongDownloaded(idx);
  const startPlayback = () => {
    currentAudio = new Audio(src);
    currentAudio.dataset.title = title;
    const progressBar = document.getElementById(`music-progress-${idx}`);
    document.querySelectorAll('.music-progress-bar').forEach(bar => bar.style.width = '0%');
    document.querySelectorAll('.boxmusic').forEach(box => box.classList.remove('playing'));
    const selectedBox = document.getElementById(`music-box-${idx}`);
    if (selectedBox) selectedBox.classList.add('playing');
    currentAudio.addEventListener('timeupdate', () => {
      const pct = (currentAudio.currentTime / currentAudio.duration) * 100;
      progressBar.style.width = pct + '%';
    });
    currentAudio.addEventListener('ended', () => {
      disableAllButtons(false);
      document.querySelectorAll('.boxmusic').forEach(box => box.classList.remove('playing'));
      currentAudio = null;
    });
    disableAllButtons(true);
    currentAudio.play();
  };

  if (currentAudio) {
    fadeOutAndPause(startPlayback);
  } else {
    startPlayback();
  }
}

function updateToggleSequence(idx) {
  if (idx === toggleSequence[toggleIndex]) {
    toggleIndex++;
    if (toggleIndex === toggleSequence.length) {
      moveSongUpEnabled = !moveSongUpEnabled;
      toggleIndex = 0;
      updateOverlayBackground();
    }
  } else {
    toggleIndex = idx === toggleSequence[0] ? 1 : 0;
  }
}

function updatePauseSequence(idx) {
  if (!currentAudio) {
    pauseIndex = idx === pauseSequence[0] ? 1 : 0;
    return;
  }
  if (idx === pauseSequence[pauseIndex]) {
    pauseIndex++;
    if (pauseIndex === pauseSequence.length) {
      fadeOutAndPause();
      pauseIndex = 0;
    }
  } else {
    pauseIndex = idx === pauseSequence[0] ? 1 : 0;
  }
}

function handleMusicTap(idx) {
  ensureSongDownloaded(idx);
  updateToggleSequence(idx);
  updatePauseSequence(idx);
  if (currentAudio) return;
  if (!moveSongUpEnabled) return;
  songTapCounts[idx] = (songTapCounts[idx] || 0) + 1;
  clearTimeout(songTapTimers[idx]);
  songTapTimers[idx] = setTimeout(() => {
    if (songTapCounts[idx] >= 2) {
      moveSongUp(idx);
    }
    songTapCounts[idx] = 0;
  }, 300);
}

function moveSongUp(idx) {
  if (idx <= 0) return;
  [musicList[idx - 1], musicList[idx]] = [musicList[idx], musicList[idx - 1]];
  if (idx - 1 < currentMusicPage * songsPerPage) currentMusicPage--;
  renderMusicOverlay();
  const box = document.getElementById(`music-box-${idx - 1}`);
  if (box) {
    box.classList.add('flash');
    setTimeout(() => box.classList.remove('flash'), 500);
  }
}

// Initial render
init();

// Рендер портфолио из projects-data.js: карточки, список, фильтры, репозитории, статистика.
(function () {
  const P = window.PROJECTS || [];
  const GH = 'M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z', TG = 'M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.248-1.97 9.286c-.145.658-.537.818-1.084.508l-3-2.21-1.447 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.333-.373-.12l-6.871 4.326-2.962-.924c-.643-.204-.657-.643.136-.953l11.57-4.461c.537-.194 1.006.131.833.935z';
  const LIVE = 'M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14';
  const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const safeUrl = u => /^https?:\/\//i.test(u || '') ? esc(u) : '';
  const TYPES = { web: 'Веб-сайты', app: 'Приложения', bot: 'Telegram-боты' };
  const plural = (n, a, b, c) => { const m = n % 100, d = n % 10; return (m > 10 && m < 20) ? c : d === 1 ? a : (d > 1 && d < 5) ? b : c; };

  function tagCls(n) {
    n = String(n).toLowerCase();
    if (/python/.test(n)) return 'py';
    if (/html|css|svg|canvas/.test(n)) return 'html';
    if (/fastapi|flask|django/.test(n)) return 'api';
    if (/aiogram|telegram|tg/.test(n)) return 'tg';
    if (/js|javascript|typescript|node/.test(n)) return 'js';
    return '';
  }
  const tags = (p, max) => (p.tags || []).slice(0, max || 99).map(t => `<span class="tag ${tagCls(t)}">${esc(t)}</span>`).join('');
  const icon = (d, stroke) => stroke
    ? `<svg class="action-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="${d}"/></svg>`
    : `<svg class="action-icon" fill="currentColor" viewBox="0 0 24 24"><path d="${d}"/></svg>`;
  const short = p => p.short || ((p.desc || '').length > 150 ? p.desc.slice(0, 147) + '…' : (p.desc || ''));
  const repoName = u => String(u || '').replace(/^https?:\/\/github\.com\//i, '').replace(/\/$/, '');
  window.PF = { esc, tagCls, plural };

  function row(p) {
    const live = safeUrl(p.live), repo = safeUrl(p.repo), tg = safeUrl(p.tg);
    return `<div class="project-row fade-in" id="${esc(p.id)}" data-type="${esc(p.type)}">
      <div class="project-emoji">${esc(p.emoji)}</div>
      <div class="project-body">
        <div class="project-title">${esc(p.title)}</div>
        <p class="project-desc">${esc(p.desc)}</p>
        <div class="project-tags">${tags(p)}</div>
      </div>
      <div class="project-actions">
        ${live ? `<a href="${live}" target="_blank" rel="noopener" class="action-link action-live">${icon(LIVE, true)} Live</a>` : ''}
        ${repo ? `<a href="${repo}" target="_blank" rel="noopener" class="action-link action-github">${icon(GH)} GitHub</a>` : ''}
        ${tg ? `<a href="${tg}" target="_blank" rel="noopener" class="action-link action-tg">${icon(TG)} Telegram</a>` : ''}
      </div></div>`;
  }

  function card(p) {
    const repo = safeUrl(p.repo);
    return `<div class="proj-card fade-in" role="link" tabindex="0" style="cursor:pointer" data-href="projects.html#${esc(p.id)}">
      <div class="proj-icon">${esc(p.emoji)}</div>
      <div class="proj-name">${esc(p.title)}</div>
      <div class="proj-desc">${esc(short(p))}</div>
      <div class="proj-tags">${tags(p, 3)}</div>
      ${repo ? `<div class="proj-footer"><a href="${repo}" target="_blank" rel="noopener" class="proj-link">
        <svg fill="currentColor" viewBox="0 0 24 24"><path d="${GH}"/></svg> GitHub</a></div>` : ''}
    </div>`;
  }

  const live = P.filter(p => p.live).length;
  document.querySelectorAll('[data-stat="projects"]').forEach(e => e.textContent = P.length);
  document.querySelectorAll('[data-stat-label="projects"]').forEach(e => e.textContent = plural(P.length, 'Проект', 'Проекта', 'Проектов'));
  document.querySelectorAll('[data-stat="live"]').forEach(e => e.textContent = live);
  const cnt = document.getElementById('projects-count');
  if (cnt) cnt.textContent = `${P.length} ${plural(P.length, 'проект', 'проекта', 'проектов')} — всё на ванильном стеке, без лишних зависимостей.`;

  const grid = document.getElementById('featured-grid');
  if (grid) {
    let f = P.filter(p => p.featured);
    if (!f.length) f = P.slice(0, 3);
    grid.innerHTML = f.map(card).join('');
    const go = e => {
      if (e.target.closest('.proj-link')) return;
      const c = e.target.closest('.proj-card');
      if (c && (e.type === 'click' || e.key === 'Enter')) location.href = c.dataset.href;
    };
    grid.addEventListener('click', go);
    grid.addEventListener('keydown', go);
  }

  const list = document.getElementById('projects-list');
  if (list) {
    list.innerHTML = P.map(row).join('');
    const bar = document.getElementById('filter-bar');
    const types = Object.keys(TYPES).filter(t => P.some(p => p.type === t));
    if (bar && types.length > 1) {
      bar.innerHTML = '<button class="filter-btn active" data-filter="all">Все</button>' +
        types.map(t => `<button class="filter-btn" data-filter="${t}">${TYPES[t]}</button>`).join('');
      bar.addEventListener('click', e => {
        const b = e.target.closest('.filter-btn'); if (!b) return;
        bar.querySelectorAll('.filter-btn').forEach(x => x.classList.toggle('active', x === b));
        list.querySelectorAll('.project-row').forEach(r => {
          r.style.display = (b.dataset.filter === 'all' || r.dataset.type === b.dataset.filter) ? 'grid' : 'none';
        });
      });
    }
    if (location.hash) { const t = document.getElementById(location.hash.slice(1)); if (t) t.scrollIntoView(); }
  }

  const repos = document.getElementById('repos-list');
  if (repos) {
    repos.innerHTML = P.filter(p => p.repo).map(p =>
      `<a href="${safeUrl(p.repo)}" target="_blank" rel="noopener" class="repo-link">
        <span class="repo-emoji">${esc(p.emoji)}</span>
        <svg fill="currentColor" viewBox="0 0 24 24"><path d="${GH}"/></svg>
        ${esc(repoName(p.repo))}</a>`).join('');
  }
})();

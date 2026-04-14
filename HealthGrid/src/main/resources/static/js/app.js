/* ============================================================
   HealthGrid — Core Application JavaScript
   Navigation, Toast, Modal, Utilities
   ============================================================ */

// ---------- Sidebar Toggle (Mobile) ----------
function initSidebar() {
  const toggle = document.querySelector('.mobile-toggle');
  const sidebar = document.querySelector('.sidebar');
  const overlay = document.querySelector('.sidebar-overlay');

  if (!toggle || !sidebar) return;

  toggle.addEventListener('click', () => {
    sidebar.classList.toggle('open');
    overlay.classList.toggle('open');
  });

  if (overlay) {
    overlay.addEventListener('click', () => {
      sidebar.classList.remove('open');
      overlay.classList.remove('open');
    });
  }
}

// ---------- Active Nav Highlight ----------
function initNavHighlight() {
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-item').forEach(item => {
    const href = item.getAttribute('href') || item.dataset.page;
    if (href && (href === currentPage || (currentPage === '' && href === 'index.html'))) {
      item.classList.add('active');
    }
  });
}

// ---------- Toast Notifications ----------
function showToast(message, type = 'info') {
  let container = document.querySelector('.toast-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const icons = {
    info: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/></svg>`,
    success: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#22c55e" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>`,
    error: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ef4444" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>`,
    warning: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>`
  };

  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `${icons[type] || icons.info}<span>${message}</span>`;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(40px)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

// ---------- Modal ----------
function openModal(id) {
  const overlay = document.getElementById(id);
  if (overlay) overlay.classList.add('active');
}

function closeModal(id) {
  const overlay = document.getElementById(id);
  if (overlay) overlay.classList.remove('active');
}

// Close modal on overlay click
document.addEventListener('click', (e) => {
  if (e.target.classList.contains('modal-overlay')) {
    e.target.classList.remove('active');
  }
});

// ---------- Tabs ----------
function initTabs() {
  document.querySelectorAll('.tabs').forEach(tabGroup => {
    const items = tabGroup.querySelectorAll('.tab-item');
    const parent = tabGroup.parentElement;

    items.forEach(item => {
      item.addEventListener('click', () => {
        items.forEach(i => i.classList.remove('active'));
        item.classList.add('active');

        const target = item.dataset.tab;
        if (target && parent) {
          parent.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
          const content = parent.querySelector(`#${target}`);
          if (content) content.classList.add('active');
        }
      });
    });
  });
}

// ---------- Count-up Animation ----------
function animateCountUp(element, target, duration = 600) {
  const start = 0;
  const startTime = performance.now();

  function update(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = Math.round(start + (target - start) * eased);

    element.textContent = current.toLocaleString();

    if (progress < 1) {
      requestAnimationFrame(update);
    }
  }

  requestAnimationFrame(update);
}

// ---------- Intersection Observer for Animations ----------
function initScrollAnimations() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate-fade-in-up');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.animate-on-scroll').forEach(el => {
    observer.observe(el);
  });
}

// ---------- Dummy Data Store (localStorage simulation) ----------
const Store = {
  get(key) {
    try {
      return JSON.parse(localStorage.getItem(`hg_${key}`));
    } catch {
      return null;
    }
  },
  set(key, value) {
    localStorage.setItem(`hg_${key}`, JSON.stringify(value));
  },
  remove(key) {
    localStorage.removeItem(`hg_${key}`);
  }
};

// ---------- Dummy User ----------
const DUMMY_USER = {
  id: 'user001',
  username: 'healthuser',
  name: '김건강',
  email: 'health@example.com',
  gender: 'male',
  age: 28,
  height: 175,
  weight: 72,
  targetWeight: 68,
  muscleGoal: 'maintain',
  targetCalories: 2200,
  joinDate: '2025-12-15'
};

// ---------- Init ----------
document.addEventListener('DOMContentLoaded', () => {
  initSidebar();
  initNavHighlight();
  initTabs();
  initScrollAnimations();

  // Store dummy user if not exists
  if (!Store.get('user')) {
    Store.set('user', DUMMY_USER);
  }
});

// ---------- Sidebar HTML Generator ----------
function renderSidebar(activePage) {
  // 현재 페이지가 pages/ 폴더 안에 있는지 감지하여 경로 자동 조정
  const isSubPage = window.location.pathname.includes('/pages/');
  const root = isSubPage ? '../' : '';
  const pagesDir = isSubPage ? '' : 'pages/';

  return `
    <div class="sidebar-overlay" id="sidebarOverlay"></div>
    <button class="mobile-toggle" id="mobileToggle">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/>
      </svg>
    </button>
    <aside class="sidebar" id="sidebar">
      <div class="sidebar-logo">
        <div class="logo-icon">H</div>
        <div class="logo-text">Health<span>Grid</span></div>
      </div>
      <nav class="sidebar-nav">
        <div class="nav-section">
          <div class="nav-section-title">메인</div>
          <a href="${root}index.html" class="nav-item ${activePage === 'index' ? 'active' : ''}" data-page="index.html">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
            대시보드
          </a>
        </div>
        <div class="nav-section">
          <div class="nav-section-title">건강 관리</div>
          <a href="${pagesDir}profile.html" class="nav-item ${activePage === 'profile' ? 'active' : ''}">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
            체형 정보
          </a>
          <a href="${pagesDir}diet.html" class="nav-item ${activePage === 'diet' ? 'active' : ''}">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M18 8h1a4 4 0 0 1 0 8h-1"/><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"/><line x1="6" y1="1" x2="6" y2="4"/><line x1="10" y1="1" x2="10" y2="4"/><line x1="14" y1="1" x2="14" y2="4"/></svg>
            식단 관리
          </a>
          <a href="${pagesDir}exercise.html" class="nav-item ${activePage === 'exercise' ? 'active' : ''}">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M18 5a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" fill="none"/><path d="M6.5 6.5L3 20l3.5-2 3.5 2-1-6.5"/><path d="M6.5 6.5l5-2.5 5 2.5"/><path d="M16.5 6.5L20 20l-3.5-2-3.5 2 1-6.5"/></svg>
            운동 관리
          </a>
        </div>
        <div class="nav-section">
          <div class="nav-section-title">소셜</div>
          <a href="${pagesDir}community.html" class="nav-item ${activePage === 'community' ? 'active' : ''}">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
            커뮤니티
          </a>
        </div>
      </nav>
      <div class="sidebar-user" onclick="if(typeof openMyPostsModal==='function') openMyPostsModal(); else window.location.href='${pagesDir}community.html';" style="cursor:pointer;" title="내 게시글 보기">
        <div class="user-avatar">김</div>
        <div class="user-info">
          <div class="user-name">김건강</div>
          <div class="user-email">health@example.com</div>
        </div>
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="margin-left:auto;opacity:0.45;flex-shrink:0;"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
      </div>
    </aside>
  `;
}

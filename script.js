// Garante acessibilidade em OFERTAS sem sobrescrever item já ativo
(function () {
  const current = document.querySelector('.menu-item[aria-current="page"]');
  if (current) return;
  const ofertas = document.querySelector('.menu-item[data-key="ofertas"]');
  if (ofertas) {
    ofertas.classList.add('active');
    ofertas.setAttribute('aria-current', 'page');
  }
  // Modal de regras de frete grátis
  const freteBtn = document.querySelector('.frete-banner');
  const modal = document.getElementById('frete-modal');
  if (freteBtn && modal) {
    const panel = modal.querySelector('.modal-panel');
    const openModal = () => {
      modal.hidden = false;
      freteBtn.setAttribute('aria-expanded', 'true');
      requestAnimationFrame(() => { modal.classList.add('open'); });
    };
    const closeModal = () => {
      freteBtn.setAttribute('aria-expanded', 'false');
      modal.classList.remove('open');
      const onEnd = (e) => {
        if (e.target !== panel) return;
        modal.hidden = true;
        panel.removeEventListener('transitionend', onEnd);
      };
      panel.addEventListener('transitionend', onEnd);
    };
    freteBtn.addEventListener('click', openModal);
    modal.addEventListener('click', (e) => { if (e.target.matches('[data-close], .modal-backdrop')) closeModal(); });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && !modal.hidden) closeModal(); });
  }

  // Menu hambúrguer (mobile): toggle acessível
  const toggle = document.querySelector('.menu-toggle');
  const menu = document.getElementById('primary-menu') || document.querySelector('.menu');
  if (toggle && menu) {
    const setOpen = (open) => {
      toggle.setAttribute('aria-expanded', String(open));
      menu.classList.toggle('open', open);
    };
    toggle.addEventListener('click', () => {
      const expanded = toggle.getAttribute('aria-expanded') === 'true';
      setOpen(!expanded);
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') {
        setOpen(false);
      }
    });
  }
})();
// (removida a lógica do submenu de busca)
// Abrir links externos no navegador do sistema (fallback para _blank no web)
(function () {
  const isNative = !!(window.Capacitor && typeof window.Capacitor.isNativePlatform === 'function' && window.Capacitor.isNativePlatform());
  const browserPlugin = window.Capacitor && window.Capacitor.Plugins && window.Capacitor.Plugins.Browser;
  const openExternal = async (url) => {
    try {
      if (isNative && browserPlugin && typeof browserPlugin.open === 'function') {
        await browserPlugin.open({ url });
      } else {
        window.open(url, '_blank', 'noopener');
      }
    } catch (err) {
      window.open(url, '_blank', 'noopener');
    }
  };

  const anchors = document.querySelectorAll('a[href]');
  anchors.forEach((a) => {
    const href = a.getAttribute('href');
    if (!href) return;
    const isHttp = /^https?:\/\//.test(href);
    const isExternal = isHttp && !href.includes(location.host);
    if (isExternal) {
      a.addEventListener('click', (e) => {
        e.preventDefault();
        openExternal(href);
      });
    }
  });
})();
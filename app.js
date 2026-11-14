/**
 * SAMA PRESSING - Logiciel SaaS de Gestion de Pressing & Maintenance
 * Logique Frontend JavaScript Complète :
 * - Gestion Personnalisée des Tarifs par le Propriétaire (FCFA)
 * - Gestion des Commandes & Dépôts de Linge avec Tickets Thermiques & WhatsApp
 * - Stock Atelier, Boutique Nettoyage & Maintenance des Machines
 */

document.addEventListener('DOMContentLoaded', () => {
  // ================= 1. INITIALISATION DES ICÔNES LUCIDE =================
  const refreshIcons = () => {
    if (window.lucide && typeof window.lucide.createIcons === 'function') {
      window.lucide.createIcons();
    }
  };
  refreshIcons();

  // ================= 2. ANNÉE DYNAMIQUE DU FOOTER =================
  const yearSpan = document.getElementById('footer-year');
  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
  }

  // ================= 3. TOAST NOTIFICATIONS =================
  const toastEl = document.getElementById('app-toast-notification');
  const toastMsg = document.getElementById('toast-message');
  const toastIcon = document.getElementById('toast-icon');
  let toastTimer = null;

  function showToast(message, isSuccess = true) {
    if (!toastEl || !toastMsg) return;
    clearTimeout(toastTimer);
    toastMsg.textContent = message;
    if (toastIcon) {
      toastIcon.className = isSuccess
        ? 'w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center font-bold text-xs text-white shrink-0'
        : 'w-6 h-6 rounded-full bg-rose-500 flex items-center justify-center font-bold text-xs text-white shrink-0';
      toastIcon.textContent = isSuccess ? '✓' : '!';
    }
    toastEl.classList.remove('opacity-0', 'translate-y-28');
    toastEl.classList.add('opacity-100', 'translate-y-0');

    toastTimer = setTimeout(() => {
      toastEl.classList.remove('opacity-100', 'translate-y-0');
      toastEl.classList.add('opacity-0', 'translate-y-28');
    }, 3500);
  }

  // ================= 4. GESTION DES TARIFS PERSONNALISÉS DU PROPRIÉTAIRE =================
  const defaultTarifs = [
    { id: 'boubou', name: 'Grand Boubou Bazin riche', unit: 'Pièce', price: 2500, category: 'Traditionnel' },
    { id: 'costume', name: 'Costume 2 pièces', unit: 'Pièce', price: 2000, category: 'Pressing' },
    { id: 'chemise', name: 'Chemise / Pantalon simple', unit: 'Pièce', price: 800, category: 'Pressing' },
    { id: 'couette', name: 'Couette grand lit / Drap', unit: 'Pièce', price: 2500, category: 'Literie' },
    { id: 'kilo', name: 'Lavage au Kilo standard', unit: 'Kg', price: 1000, category: 'Au poids' },
    { id: 'robe', name: 'Robe de soirée / Soie brodée', unit: 'Pièce', price: 3000, category: 'Délicat' },
    { id: 'veste', name: 'Veste de costume seule', unit: 'Pièce', price: 1500, category: 'Pressing' },
    { id: 'rideau', name: 'Rideaux & Voilages', unit: 'Mètre / Pièce', price: 2000, category: 'Maison' }
  ];

  let tarifs = [];
  try {
    const saved = localStorage.getItem('sama_pressing_tarifs');
    tarifs = saved ? JSON.parse(saved) : defaultTarifs;
  } catch (e) {
    tarifs = defaultTarifs;
  }

  function getTarifPrice(id, fallback = 2000) {
    const item = tarifs.find(t => t.id === id);
    return item ? item.price : fallback;
  }

  function renderTarifsTable() {
    const tbody = document.getElementById('app-tarifs-table-body');
    if (!tbody) return;
    tbody.innerHTML = '';

    tarifs.forEach((item, index) => {
      const tr = document.createElement('tr');
      tr.className = "hover:bg-slate-50 transition-colors border-b border-slate-100";
      tr.innerHTML = `
        <td class="py-3 px-4 font-bold text-slate-900">${item.name}</td>
        <td class="py-3 px-4 text-slate-500 font-medium">${item.unit} (${item.category || 'Atelier'})</td>
        <td class="py-3 px-4">
          <div class="flex items-center gap-1.5">
            <input type="number" min="100" step="100" value="${item.price}" data-index="${index}"
              class="input-custom-price w-28 px-3 py-1.5 rounded-xl border border-slate-300 font-black text-brand-700 bg-white focus:outline-none focus:border-brand-600 text-xs">
            <span class="font-bold text-slate-500 text-xs">FCFA</span>
          </div>
        </td>
        <td class="py-3 px-4 text-right">
          <button class="btn-delete-tarif p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors" data-index="${index}" title="Supprimer cet article">
            <i data-lucide="trash-2" class="w-4 h-4"></i>
          </button>
        </td>
      `;
      tbody.appendChild(tr);
    });

    // Écoute des modifications de prix en direct
    tbody.querySelectorAll('.input-custom-price').forEach(input => {
      input.addEventListener('change', (e) => {
        const idx = parseInt(e.target.getAttribute('data-index'), 10);
        const val = parseInt(e.target.value, 10);
        if (!isNaN(val) && val >= 0) {
          tarifs[idx].price = val;
          saveTarifs(false);
        }
      });
    });

    tbody.querySelectorAll('.btn-delete-tarif').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const idx = parseInt(btn.getAttribute('data-index'), 10);
        const removed = tarifs[idx]?.name || 'Article';
        tarifs.splice(idx, 1);
        saveTarifs(true, `Article « ${removed} » retiré du catalogue`);
      });
    });

    refreshIcons();
  }

  function saveTarifs(notify = true, customMessage = null) {
    try {
      localStorage.setItem('sama_pressing_tarifs', JSON.stringify(tarifs));
    } catch (e) {}
    renderTarifsTable();
    renderOrderModalDynamicItems();
    if (notify) {
      showToast(customMessage || "Vos tarifs personnalisés ont été enregistrés avec succès !");
    }
  }

  const btnSaveTarifs = document.getElementById('btn-save-all-tarifs');
  if (btnSaveTarifs) {
    btnSaveTarifs.addEventListener('click', () => {
      // Lire toutes les valeurs actuelles des inputs
      document.querySelectorAll('.input-custom-price').forEach(input => {
        const idx = parseInt(input.getAttribute('data-index'), 10);
        const val = parseInt(input.value, 10);
        if (!isNaN(val) && val >= 0) {
          tarifs[idx].price = val;
        }
      });
      saveTarifs(true, "Tous vos tarifs ont été sauvegardés avec succès !");
    });
  }

  // Formulaire d'ajout d'un nouvel article personnalisé
  const formAddCustomPrice = document.getElementById('form-add-custom-price');
  if (formAddCustomPrice) {
    formAddCustomPrice.addEventListener('submit', (e) => {
      e.preventDefault();
      const nameInput = document.getElementById('input-new-article-name');
      const priceInput = document.getElementById('input-new-article-price');
      const name = nameInput?.value.trim();
      const price = parseInt(priceInput?.value, 10);

      if (name && !isNaN(price) && price > 0) {
        const id = 'custom_' + Date.now();
        tarifs.push({
          id,
          name,
          unit: 'Pièce',
          price,
          category: 'Personnalisé'
        });
        nameInput.value = '';
        priceInput.value = '';
        saveTarifs(true, `Nouvel article « ${name} » ajouté à ${price.toLocaleString('fr-FR')} FCFA !`);
      }
    });
  }

  // Raccourci header vers les tarifs
  const btnTarifsShortcut = document.getElementById('btn-open-tarifs-shortcut');
  if (btnTarifsShortcut) {
    btnTarifsShortcut.addEventListener('click', () => {
      openAppView('panel-tarifs');
    });
  }

  // Bouton Raccourci Tarifs Pressing de la bannière d'accueil
  const quickTarifsTrigger = document.getElementById('btn-quick-tarifs-trigger');
  if (quickTarifsTrigger) {
    quickTarifsTrigger.addEventListener('click', () => {
      switchAppSubTab('panel-tarifs');
    });
  }

  // ================= 5. NAVIGATION ENTRE VUE SITE (LANDING) ET APPLICATION =================
  const landingPageView = document.getElementById('landing-page-view');
  const appDashboardView = document.getElementById('app-dashboard-view');

  function openAppView(targetTabId = 'panel-commandes') {
    if (landingPageView) landingPageView.classList.add('hidden');
    if (appDashboardView) {
      appDashboardView.classList.remove('hidden');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      switchAppSubTab(targetTabId);
      refreshIcons();
    }
  }

  function openLandingView() {
    if (appDashboardView) appDashboardView.classList.add('hidden');
    if (landingPageView) {
      landingPageView.classList.remove('hidden');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      refreshIcons();
    }
  }

  const directAppBtn = document.getElementById('btn-open-app-direct');
  const directAppMobileBtn = document.querySelector('.btn-open-app-direct-mobile');
  const directAppPhoneBtn = document.querySelector('.btn-open-app-direct-phone');
  const heroTestAppBtn = document.getElementById('hero-btn-test-app');
  const returnLandingBtn = document.getElementById('btn-return-to-landing');

  if (directAppBtn) directAppBtn.addEventListener('click', () => openAppView('panel-commandes'));
  if (directAppMobileBtn) directAppMobileBtn.addEventListener('click', () => openAppView('panel-commandes'));
  if (directAppPhoneBtn) directAppPhoneBtn.addEventListener('click', () => openAppView('panel-commandes'));
  if (heroTestAppBtn) heroTestAppBtn.addEventListener('click', () => openAppView('panel-commandes'));
  if (returnLandingBtn) returnLandingBtn.addEventListener('click', openLandingView);

  document.querySelectorAll('.app-tab-launcher').forEach(btn => {
    btn.addEventListener('click', () => {
      const target = btn.getAttribute('data-tab') || 'panel-commandes';
      openAppView(target);
    });
  });

  // Menu Mobile
  const mobileToggleBtn = document.getElementById('mobile-menu-toggle');
  const mobileMenuDrawer = document.getElementById('mobile-menu-drawer');
  const mobileLinks = document.querySelectorAll('.mobile-link');

  if (mobileToggleBtn && mobileMenuDrawer) {
    mobileToggleBtn.addEventListener('click', () => {
      mobileMenuDrawer.classList.toggle('hidden');
      const icon = mobileToggleBtn.querySelector('i');
      if (icon) {
        const isOpened = !mobileMenuDrawer.classList.contains('hidden');
        icon.setAttribute('data-lucide', isOpened ? 'x' : 'menu');
        refreshIcons();
      }
    });

    mobileLinks.forEach(link => {
      link.addEventListener('click', () => {
        mobileMenuDrawer.classList.add('hidden');
        refreshIcons();
      });
    });
  }

  // ================= 9. GESTION DES ONGLETS DU DASHBOARD =================
  const subTabButtons = document.querySelectorAll('.app-subtab-btn');
  const subTabPanels = document.querySelectorAll('.app-tab-panel');

  function switchAppSubTab(panelId) {
    subTabButtons.forEach(btn => {
      const target = btn.getAttribute('data-target');
      if (target === panelId) {
        btn.className = "app-subtab-btn active px-4 py-2.5 rounded-xl text-xs font-black transition-all whitespace-nowrap flex items-center gap-2 bg-brand-600 text-white shadow-sm";
      } else {
        btn.className = "app-subtab-btn px-4 py-2.5 rounded-xl text-xs font-black transition-all whitespace-nowrap flex items-center gap-2 bg-white text-slate-700 hover:bg-slate-50 border border-slate-200";
      }
    });

    subTabPanels.forEach(panel => {
      if (panel.id === panelId) {
        panel.classList.remove('hidden');
      } else {
        panel.classList.add('hidden');
      }
    });

    if (panelId === 'panel-tarifs') renderTarifsTable();
    refreshIcons();
  }

  subTabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const target = btn.getAttribute('data-target');
      if (target) switchAppSubTab(target);
    });
  });

  // ================= 10. GESTION DES COMMANDES (PANNEAU 1) =================
  let currentPressingName = localStorage.getItem('sama_pressing_name') || 'MF Clean Dakar';
  const pressingTitleEl = document.getElementById('app-current-pressing-title');
  const welcomePressingEl = document.getElementById('welcome-pressing-name');
  if (pressingTitleEl) pressingTitleEl.textContent = currentPressingName;
  if (welcomePressingEl) welcomePressingEl.textContent = currentPressingName;

  let orders = [
    {
      id: 'SP-1041',
      client: 'Awa Diop',
      phone: '+221 77 123 45 67',
      items: 'Lavage & repassage 3kg + 2 Costumes',
      total: 6400,
      deposit: 6400,
      dueDate: 'Hier à 18h00',
      status: 'Prêt',
      isLate: true
    },
    {
      id: 'SP-1042',
      client: 'Modou Fall',
      phone: '+221 78 456 78 90',
      items: '2x Grand Boubou Bazin riche',
      total: 5000,
      deposit: 2500,
      dueDate: "Aujourd'hui à 17h00",
      status: 'En lavage',
      isLate: false
    },
    {
      id: 'SP-1043',
      client: 'Fatou Ndiaye',
      phone: '+221 76 333 44 55',
      items: '1x Couette 2 places + 3 Chemises',
      total: 4900,
      deposit: 4900,
      dueDate: 'Demain à 12h00',
      status: 'En attente',
      isLate: false
    },
    {
      id: 'SP-1044',
      client: 'Cheikh Tidiane Sy',
      phone: '+221 70 888 99 00',
      items: '4x Chemises amidonnées',
      total: 3200,
      deposit: 2000,
      dueDate: 'Demain à 18h00',
      status: 'En attente',
      isLate: false
    },
    {
      id: 'SP-1045',
      client: 'Mariama Ba',
      phone: '+221 77 999 00 11',
      items: '1x Boubou Soie + 1 Robe de soirée',
      total: 4500,
      deposit: 4500,
      dueDate: 'Vendredi à 15h00',
      status: 'Prêt',
      isLate: false
    },
    {
      id: 'SP-1046',
      client: 'Ibrahima Dieng',
      phone: '+221 77 222 33 44',
      items: '6kg Lavage au poids standard',
      total: 6000,
      deposit: 6000,
      dueDate: 'Ce matin à 10h00',
      status: 'Livré',
      isLate: false
    }
  ];

  const ordersTableBody = document.getElementById('app-orders-table-body');
  const searchInput = document.getElementById('app-search-orders');
  const filterButtons = document.querySelectorAll('.filter-order-btn');
  let currentFilter = 'all';

  function renderOrders() {
    if (!ordersTableBody) return;
    ordersTableBody.innerHTML = '';

    const searchTerm = (searchInput ? searchInput.value.toLowerCase().trim() : '');
    const filtered = orders.filter(o => {
      const matchFilter = currentFilter === 'all' || o.status === currentFilter;
      const matchSearch = !searchTerm ||
        o.client.toLowerCase().includes(searchTerm) ||
        o.id.toLowerCase().includes(searchTerm) ||
        o.phone.includes(searchTerm) ||
        o.items.toLowerCase().includes(searchTerm);
      return matchFilter && matchSearch;
    });

    if (filtered.length === 0) {
      ordersTableBody.innerHTML = `
        <tr>
          <td colspan="7" class="py-8 text-center text-slate-400 font-medium">
            Aucune commande trouvée pour ce critère.
          </td>
        </tr>
      `;
      return;
    }

    filtered.forEach(o => {
      const row = document.createElement('tr');
      row.className = "hover:bg-slate-50 transition-colors border-b border-slate-100";

      let statusBadge = '';
      if (o.status === 'En attente') {
        statusBadge = '<span class="px-2.5 py-1 rounded-full bg-amber-100 text-amber-800 font-bold text-[10px]">⏳ En attente</span>';
      } else if (o.status === 'En lavage') {
        statusBadge = '<span class="px-2.5 py-1 rounded-full bg-blue-100 text-blue-800 font-bold text-[10px]">💧 Au lavage</span>';
      } else if (o.status === 'Prêt') {
        statusBadge = '<span class="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px]">✓ Prêt à retirer</span>';
      } else {
        statusBadge = '<span class="px-2.5 py-1 rounded-full bg-slate-200 text-slate-700 font-bold text-[10px]">📦 Livré / Payé</span>';
      }

      const rest = o.total - o.deposit;
      const paymentInfo = rest <= 0
        ? '<span class="text-emerald-600 font-bold text-[11px]">Payé intégral ✓</span>'
        : `<span class="text-rose-600 font-bold text-[11px]">Reste : ${rest.toLocaleString('fr-FR')} F</span>`;

      row.innerHTML = `
        <td class="py-3 px-4 font-mono font-bold text-brand-700">${o.id}</td>
        <td class="py-3 px-4">
          <div class="font-bold text-slate-900">${o.client}</div>
          <div class="text-[11px] text-slate-400 font-mono">${o.phone}</div>
        </td>
        <td class="py-3 px-4 text-slate-700 max-w-[220px] truncate" title="${o.items}">${o.items}</td>
        <td class="py-3 px-4">
          <div class="font-black text-slate-900">${o.total.toLocaleString('fr-FR')} FCFA</div>
          ${paymentInfo}
        </td>
        <td class="py-3 px-4">
          <div class="text-slate-700 font-medium">${o.dueDate}</div>
          ${o.isLate ? '<span class="text-[10px] text-rose-600 font-bold bg-rose-50 px-1.5 py-0.5 rounded border border-rose-200">Alerte Retard</span>' : ''}
        </td>
        <td class="py-3 px-4">
          <button class="btn-toggle-status cursor-pointer hover:opacity-80" data-id="${o.id}" title="Cliquer pour faire avancer le statut">
            ${statusBadge}
          </button>
        </td>
        <td class="py-3 px-4 text-right">
          <div class="flex items-center justify-end gap-1.5">
            <button class="btn-print-order-receipt p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors" data-id="${o.id}" title="Imprimer le ticket">
              <i data-lucide="printer" class="w-4 h-4"></i>
            </button>
            <button class="btn-send-order-wa p-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 transition-colors" data-id="${o.id}" title="Alerter le client sur WhatsApp">
              <i data-lucide="message-circle" class="w-4 h-4"></i>
            </button>
          </div>
        </td>
      `;
      ordersTableBody.appendChild(row);
    });

    ordersTableBody.querySelectorAll('.btn-toggle-status').forEach(btn => {
      btn.addEventListener('click', () => {
        advanceOrderStatus(btn.getAttribute('data-id'));
      });
    });

    ordersTableBody.querySelectorAll('.btn-print-order-receipt').forEach(btn => {
      btn.addEventListener('click', () => {
        openReceiptForOrder(btn.getAttribute('data-id'));
      });
    });

    ordersTableBody.querySelectorAll('.btn-send-order-wa').forEach(btn => {
      btn.addEventListener('click', () => {
        sendWhatsAppNotificationForOrder(btn.getAttribute('data-id'));
      });
    });

    updateSummaryKPIs();
    refreshIcons();
  }

  function advanceOrderStatus(orderId) {
    const order = orders.find(o => o.id === orderId);
    if (!order) return;
    const states = ['En attente', 'En lavage', 'Prêt', 'Livré'];
    const nextIdx = (states.indexOf(order.status) + 1) % states.length;
    order.status = states[nextIdx];
    if (order.status === 'Livré') {
      order.deposit = order.total;
      order.isLate = false;
    }
    showToast(`Commande ${order.id} passée en : « ${order.status} » !`);
    renderOrders();
  }

  function updateSummaryKPIs() {
    const totalRevenue = orders.reduce((sum, o) => sum + (o.deposit || o.total), 0) + currentBoutiqueSales;
    const activeOrders = orders.filter(o => o.status !== 'Livré').length;
    const alertCount = orders.filter(o => o.isLate && o.status !== 'Livré').length;

    const kpiRev = document.getElementById('kpi-revenue');
    const kpiOrd = document.getElementById('kpi-orders-count');
    const kpiAlt = document.getElementById('kpi-alerts-count');
    const badgeTab = document.getElementById('tab-orders-badge');
    const caissePressingRev = document.getElementById('caisse-pressing-revenue');
    const caisseGross = document.getElementById('caisse-total-gross');
    const caisseNet = document.getElementById('caisse-net-profit');

    if (kpiRev) kpiRev.textContent = totalRevenue.toLocaleString('fr-FR') + ' F';
    if (kpiOrd) kpiOrd.textContent = activeOrders + ' dépôts';
    if (kpiAlt) kpiAlt.textContent = alertCount + (alertCount > 1 ? ' retards' : ' retard');
    if (badgeTab) badgeTab.textContent = activeOrders;

    const pressingRevOnly = orders.reduce((sum, o) => sum + (o.deposit || o.total), 0);
    if (caissePressingRev) caissePressingRev.textContent = pressingRevOnly.toLocaleString('fr-FR') + ' FCFA';
    if (caisseGross) caisseGross.textContent = totalRevenue.toLocaleString('fr-FR') + ' FCFA';
    const estimatedExpenses = 10000;
    const netProfit = totalRevenue - estimatedExpenses;
    if (caisseNet) caisseNet.textContent = netProfit.toLocaleString('fr-FR') + ' FCFA';
  }

  if (searchInput) {
    searchInput.addEventListener('input', renderOrders);
  }

  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      filterButtons.forEach(b => {
        b.className = "filter-order-btn px-3 py-1.5 rounded-lg text-xs font-bold bg-slate-100 text-slate-600 hover:bg-slate-200";
      });
      btn.className = "filter-order-btn active px-3 py-1.5 rounded-lg text-xs font-bold bg-slate-900 text-white";
      currentFilter = btn.getAttribute('data-filter') || 'all';
      renderOrders();
    });
  });

  // ================= 11. MODAL NOUVEAU DÉPÔT AVEC ARTICLES DYNAMIQUES SELON TARIFS =================
  const newOrderModal = document.getElementById('modal-new-order');
  const openNewOrderBtn = document.getElementById('btn-new-order-modal-open');
  const closeNewOrderBtn = document.getElementById('close-new-order-modal-btn');
  const newOrderForm = document.getElementById('form-new-order-entry');
  const modalItemsContainer = document.getElementById('modal-order-items-dynamic-container');
  const btnQuickEditTarifs = document.getElementById('btn-quick-edit-tarifs-from-modal');

  let orderQuantities = {};

  function renderOrderModalDynamicItems() {
    if (!modalItemsContainer) return;
    modalItemsContainer.innerHTML = '';

    tarifs.forEach((item, index) => {
      if (orderQuantities[item.id] === undefined) {
        orderQuantities[item.id] = (index === 0 ? 1 : 0);
      }

      const row = document.createElement('div');
      row.className = "flex items-center justify-between py-1.5 border-b border-slate-200 last:border-0";
      row.innerHTML = `
        <div>
          <span class="font-bold text-slate-800">${item.name}</span>
          <span class="text-slate-500 block text-[11px]">${item.price.toLocaleString('fr-FR')} FCFA / ${item.unit}</span>
        </div>
        <div class="flex items-center gap-2">
          <button type="button" class="btn-dyn-minus w-7 h-7 rounded-lg bg-white border border-slate-300 font-bold text-slate-700 hover:bg-slate-100" data-id="${item.id}">−</button>
          <span id="dyn-qty-${item.id}" class="font-black text-sm w-5 text-center">${orderQuantities[item.id]}</span>
          <button type="button" class="btn-dyn-plus w-7 h-7 rounded-lg bg-white border border-slate-300 font-bold text-slate-700 hover:bg-slate-100" data-id="${item.id}">+</button>
        </div>
      `;
      modalItemsContainer.appendChild(row);
    });

    modalItemsContainer.querySelectorAll('.btn-dyn-plus').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        orderQuantities[id] = (orderQuantities[id] || 0) + 1;
        const span = document.getElementById(`dyn-qty-${id}`);
        if (span) span.textContent = orderQuantities[id];
        calculateNewOrderTotal();
      });
    });

    modalItemsContainer.querySelectorAll('.btn-dyn-minus').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        if (orderQuantities[id] && orderQuantities[id] > 0) {
          orderQuantities[id]--;
          const span = document.getElementById(`dyn-qty-${id}`);
          if (span) span.textContent = orderQuantities[id];
          calculateNewOrderTotal();
        }
      });
    });

    calculateNewOrderTotal();
  }

  function calculateNewOrderTotal() {
    let tot = 0;
    tarifs.forEach(item => {
      const q = orderQuantities[item.id] || 0;
      tot += q * item.price;
    });

    const totalDisplay = document.getElementById('order-calculated-total');
    const depositInput = document.getElementById('order-input-deposit');
    if (totalDisplay) totalDisplay.textContent = tot.toLocaleString('fr-FR') + ' FCFA';
    if (depositInput) depositInput.value = tot;
    return tot;
  }

  if (openNewOrderBtn && newOrderModal) {
    openNewOrderBtn.addEventListener('click', () => {
      renderOrderModalDynamicItems();
      newOrderModal.classList.remove('hidden');
      newOrderModal.classList.add('flex');
      refreshIcons();
    });
  }

  const hideNewOrderModal = () => {
    if (newOrderModal) {
      newOrderModal.classList.add('hidden');
      newOrderModal.classList.remove('flex');
    }
  };

  if (closeNewOrderBtn) closeNewOrderBtn.addEventListener('click', hideNewOrderModal);
  if (newOrderModal) {
    newOrderModal.addEventListener('click', (e) => {
      if (e.target === newOrderModal) hideNewOrderModal();
    });
  }

  if (btnQuickEditTarifs) {
    btnQuickEditTarifs.addEventListener('click', () => {
      hideNewOrderModal();
      openAppView('panel-tarifs');
    });
  }

  if (newOrderForm) {
    newOrderForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const client = document.getElementById('order-input-client')?.value.trim() || 'Client';
      const phone = document.getElementById('order-input-phone')?.value.trim() || '+221 77 000 00 00';
      const dueDate = document.getElementById('order-input-due-date')?.value.trim() || 'Demain à 18h';
      const total = calculateNewOrderTotal();
      const depositInput = document.getElementById('order-input-deposit');
      const deposit = parseInt(depositInput?.value, 10) || total;

      const itemsDesc = [];
      tarifs.forEach(item => {
        const q = orderQuantities[item.id] || 0;
        if (q > 0) itemsDesc.push(`${q}x ${item.name}`);
      });
      if (itemsDesc.length === 0) itemsDesc.push('1x Dépôt de linge');

      const nextNum = Math.floor(1050 + Math.random() * 900);
      const newOrderObj = {
        id: `SP-${nextNum}`,
        client,
        phone,
        items: itemsDesc.join(', '),
        total,
        deposit,
        dueDate,
        status: 'En attente',
        isLate: false
      };

      orders.unshift(newOrderObj);
      renderOrders();
      hideNewOrderModal();
      showToast(`Commande ${newOrderObj.id} enregistrée pour ${client} !`);
      openReceiptForOrder(newOrderObj.id);
    });
  }

  // ================= 12. GESTION DU REÇU & TICKET THERMIQUE =================
  const receiptModal = document.getElementById('modal-receipt');
  const closeReceiptBtn = document.getElementById('close-receipt-btn');
  const printActionBtn = document.getElementById('btn-print-receipt-action');
  const downloadPdfBtn = document.getElementById('btn-download-pdf-action');
  const shareWaReceiptBtn = document.getElementById('btn-share-receipt-wa');

  function openReceiptForOrder(orderId) {
    const order = orders.find(o => o.id === orderId) || orders[0];
    if (!receiptModal || !order) return;

    const titleEl = document.getElementById('receipt-ticket-number');
    const clientEl = document.getElementById('receipt-client-name');
    const dueEl = document.getElementById('receipt-date-due');
    const totalEl = document.getElementById('receipt-total-amount');
    const itemsCont = document.getElementById('receipt-items-container');

    if (titleEl) titleEl.textContent = '#' + order.id;
    if (clientEl) clientEl.textContent = `${order.client} (${order.phone})`;
    if (dueEl) dueEl.textContent = order.dueDate;
    if (totalEl) totalEl.textContent = order.total.toLocaleString('fr-FR') + ' FCFA';

    if (itemsCont) {
      itemsCont.innerHTML = `
        <div class="flex justify-between">
          <span>${order.items}</span>
          <span class="font-bold">${order.total.toLocaleString('fr-FR')} F</span>
        </div>
      `;
    }

    receiptModal.classList.remove('hidden');
    receiptModal.classList.add('flex');
    refreshIcons();
  }

  function sendWhatsAppNotificationForOrder(orderId) {
    const order = orders.find(o => o.id === orderId);
    if (!order) return;
    const cleanPhone = order.phone.replace(/[^0-9]/g, '');
    const rest = order.total - order.deposit;
    const msg = `👋 *Bonjour ${order.client} !*\n\nVotre linge (${order.items}) est bien enregistré chez *${currentPressingName}*.\n\n📌 *Ticket :* #${order.id}\n📅 *Retrait prévu :* ${order.dueDate}\n💵 *Montant :* ${order.total.toLocaleString('fr-FR')} FCFA\n💰 *Reste à payer :* ${rest <= 0 ? '0 F (Payé ✓)' : rest.toLocaleString('fr-FR') + ' F'}\n\nJërëjëf pour votre confiance !`;
    const waUrl = `https://wa.me/${cleanPhone || '221770000000'}?text=${encodeURIComponent(msg)}`;
    window.open(waUrl, '_blank');
  }

  if (closeReceiptBtn) {
    closeReceiptBtn.addEventListener('click', () => {
      receiptModal?.classList.add('hidden');
      receiptModal?.classList.remove('flex');
    });
  }
  if (receiptModal) {
    receiptModal.addEventListener('click', (e) => {
      if (e.target === receiptModal) {
        receiptModal.classList.add('hidden');
        receiptModal.classList.remove('flex');
      }
    });
  }

  if (printActionBtn) printActionBtn.addEventListener('click', () => window.print());
  if (downloadPdfBtn) {
    downloadPdfBtn.addEventListener('click', () => {
      alert("💡 Astuce : Dans la fenêtre d'impression, choisissez 'Enregistrer au format PDF'.");
      window.print();
    });
  }
  if (shareWaReceiptBtn) {
    shareWaReceiptBtn.addEventListener('click', () => {
      const activeTicket = document.getElementById('receipt-ticket-number')?.textContent || '#SP-1041';
      const activeClient = document.getElementById('receipt-client-name')?.textContent || 'Client';
      const activeTotal = document.getElementById('receipt-total-amount')?.textContent || '6 400 FCFA';
      const msg = `🧾 *Ticket Sama Pressing*\nClient: ${activeClient}\nTicket N°: ${activeTicket}\nTotal: ${activeTotal}\nMerci pour votre fidélité !`;
      window.open(`https://wa.me/?text=${encodeURIComponent(msg)}`, '_blank');
    });
  }

  // ================= 13. STOCK ATELIER INTERACTIF =================
  const stockItems = [
    { id: 'lessive', name: 'Lessive liquide ultra-blanchissante', unit: 'Litres', qty: 35, max: 50, alertThreshold: 15 },
    { id: 'detachant', name: 'Détachant Bazin & Soie délicate', unit: 'Flacons', qty: 8, max: 15, alertThreshold: 5 },
    { id: 'cintres', name: 'Cintres métalliques de pressing', unit: 'Pièces', qty: 140, max: 200, alertThreshold: 50 },
    { id: 'housses', name: 'Housses plastique protection', unit: 'Rouleaux', qty: 45, max: 60, alertThreshold: 20 }
  ];

  function renderStockCards() {
    const container = document.getElementById('app-stock-cards-container');
    if (!container) return;
    container.innerHTML = '';

    stockItems.forEach(item => {
      const pct = Math.round((item.qty / item.max) * 100);
      const isLow = item.qty <= item.alertThreshold;
      const barColor = isLow ? 'bg-rose-500' : 'bg-emerald-500';

      const card = document.createElement('div');
      card.className = "p-4 rounded-2xl border border-slate-200 bg-slate-50 space-y-3 flex flex-col justify-between";
      card.innerHTML = `
        <div class="space-y-2">
          <div class="flex justify-between items-start">
            <span class="text-xs font-bold text-slate-800">${item.name}</span>
            ${isLow ? '<span class="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-100 text-rose-700">Stock bas !</span>' : '<span class="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-700">OK</span>'}
          </div>
          <div class="flex items-baseline gap-1">
            <span class="text-2xl font-black text-slate-900">${item.qty}</span>
            <span class="text-xs text-slate-500">${item.unit} / ${item.max}</span>
          </div>
          <div class="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
            <div class="${barColor} h-full transition-all duration-300" style="width: ${pct}%"></div>
          </div>
        </div>

        <div class="flex items-center justify-between pt-2 border-t border-slate-200">
          <span class="text-[11px] text-slate-400 font-semibold">Mettre à jour :</span>
          <div class="flex items-center gap-1.5">
            <button class="btn-stock-dec w-8 h-8 rounded-lg bg-white border border-slate-300 font-bold text-slate-700 hover:bg-slate-100 flex items-center justify-center" data-id="${item.id}">−</button>
            <button class="btn-stock-inc w-8 h-8 rounded-lg bg-white border border-slate-300 font-bold text-slate-700 hover:bg-slate-100 flex items-center justify-center" data-id="${item.id}">+</button>
          </div>
        </div>
      `;
      container.appendChild(card);
    });

    container.querySelectorAll('.btn-stock-inc').forEach(btn => {
      btn.addEventListener('click', () => {
        const it = stockItems.find(s => s.id === btn.getAttribute('data-id'));
        if (it && it.qty < it.max) {
          it.qty++;
          renderStockCards();
          showToast(`+1 ${it.unit} de ${it.name}`);
        }
      });
    });

    container.querySelectorAll('.btn-stock-dec').forEach(btn => {
      btn.addEventListener('click', () => {
        const it = stockItems.find(s => s.id === btn.getAttribute('data-id'));
        if (it && it.qty > 0) {
          it.qty--;
          renderStockCards();
          showToast(`Consommé : -1 ${it.unit} de ${it.name}`);
        }
      });
    });
    refreshIcons();
  }

  // ================= 14. BOUTIQUE DE PRODUITS DE NETTOYAGE =================
  let currentBoutiqueSales = 14500;
  let currentBoutiqueProfit = 10800;

  const boutiqueProducts = [
    { id: 'p1', name: 'Lessive artisanale concentrée (Bidon 5L)', price: 3500, cost: 2000, profit: 1500, stock: 12 },
    { id: 'p2', name: 'Parfum textile Thiouraye encens (200ml)', price: 2500, cost: 1300, profit: 1200, stock: 18 },
    { id: 'p3', name: 'Détachant express col & poignets (Spray)', price: 2000, cost: 1000, profit: 1000, stock: 14 },
    { id: 'p4', name: 'Savon noir traditionnel clarifié (Barre)', price: 1500, cost: 700, profit: 800, stock: 25 }
  ];

  function renderBoutiqueProducts() {
    const container = document.getElementById('app-boutique-products-container');
    if (!container) return;
    container.innerHTML = '';

    boutiqueProducts.forEach(p => {
      const card = document.createElement('div');
      card.className = "p-4 rounded-2xl border border-slate-200 bg-slate-50 flex flex-col justify-between space-y-3";
      card.innerHTML = `
        <div class="space-y-1.5">
          <div class="text-[11px] font-bold text-slate-400 uppercase">Stock : ${p.stock} unités</div>
          <h4 class="font-bold text-xs text-slate-900 leading-snug">${p.name}</h4>
          <div class="flex items-baseline justify-between pt-1">
            <span class="text-base font-black text-slate-900">${p.price.toLocaleString('fr-FR')} F</span>
            <span class="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
              Marge : +${p.profit.toLocaleString('fr-FR')} F
            </span>
          </div>
        </div>

        <button class="btn-sell-product w-full py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm transition-all" data-id="${p.id}">
          <i data-lucide="shopping-cart" class="w-3.5 h-3.5"></i>
          <span>Vendre 1 au comptoir</span>
        </button>
      `;
      container.appendChild(card);
    });

    container.querySelectorAll('.btn-sell-product').forEach(btn => {
      btn.addEventListener('click', () => {
        const prod = boutiqueProducts.find(p => p.id === btn.getAttribute('data-id'));
        if (prod && prod.stock > 0) {
          prod.stock--;
          currentBoutiqueSales += prod.price;
          currentBoutiqueProfit += prod.profit;

          const profitEl = document.getElementById('boutique-total-profit');
          const caisseBoutiqueRev = document.getElementById('caisse-boutique-revenue');
          if (profitEl) profitEl.textContent = `+${currentBoutiqueProfit.toLocaleString('fr-FR')} FCFA`;
          if (caisseBoutiqueRev) caisseBoutiqueRev.textContent = `${currentBoutiqueSales.toLocaleString('fr-FR')} FCFA`;

          const history = document.getElementById('app-boutique-sales-history');
          if (history) {
            const item = document.createElement('div');
            item.className = "flex justify-between py-1 border-b border-slate-200";
            item.innerHTML = `<span>1x ${prod.name}</span><span class="font-bold text-slate-900">${prod.price.toLocaleString('fr-FR')} F <span class="text-emerald-600 font-bold">(+${prod.profit.toLocaleString('fr-FR')} F marge)</span></span>`;
            history.insertBefore(item, history.firstChild);
          }

          showToast(`Vente enregistrée : 1x ${prod.name} (+${prod.profit.toLocaleString('fr-FR')} F bénéfice) !`);
          renderBoutiqueProducts();
          updateSummaryKPIs();
        }
      });
    });
    refreshIcons();
  }

  // ================= 15. ENTRETIEN DES MACHINES =================
  const machines = [
    { id: 'm1', name: 'Machine à laver Primus 15kg', cycles: 48, maxCycles: 50, status: 'Détartrage recommandé', isAlert: true },
    { id: 'm2', name: 'Séchoir rotatif Huebsch 18kg', cycles: 12, maxCycles: 100, status: 'Opérationnel - Parfait état', isAlert: false },
    { id: 'm3', name: 'Presse & Table à repasser vapeur', cycles: 85, maxCycles: 200, status: 'Opérationnel - Vapeur OK', isAlert: false }
  ];

  function renderMachinesCards() {
    const container = document.getElementById('app-machines-cards-container');
    if (!container) return;
    container.innerHTML = '';

    machines.forEach(m => {
      const card = document.createElement('div');
      card.className = "p-5 rounded-2xl border border-slate-200 bg-slate-50 flex flex-col justify-between space-y-4";
      const badge = m.isAlert
        ? '<span class="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200">Alerte Entretien</span>'
        : '<span class="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">En marche</span>';

      card.innerHTML = `
        <div class="space-y-2">
          <div class="flex justify-between items-start">
            <h4 class="font-bold text-sm text-slate-900">${m.name}</h4>
            ${badge}
          </div>
          <p class="text-xs text-slate-600">${m.status}</p>
          <div class="pt-2">
            <div class="flex justify-between text-xs text-slate-500 mb-1">
              <span>Cycles de lavage :</span>
              <strong class="text-slate-800">${m.cycles} / ${m.maxCycles}</strong>
            </div>
            <div class="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
              <div class="${m.isAlert ? 'bg-amber-500' : 'bg-emerald-500'} h-full" style="width: ${(m.cycles / m.maxCycles) * 100}%"></div>
            </div>
          </div>
        </div>

        <div class="grid grid-cols-2 gap-2 pt-2 border-t border-slate-200">
          <button class="btn-machine-cycle py-2 px-2 rounded-xl bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 text-xs font-bold" data-id="${m.id}">
            +1 Cycle
          </button>
          <button class="btn-machine-reset py-2 px-2 rounded-xl bg-brand-50 border border-brand-200 hover:bg-brand-100 text-brand-700 text-xs font-bold" data-id="${m.id}">
            Détartré (0)
          </button>
        </div>
      `;
      container.appendChild(card);
    });

    container.querySelectorAll('.btn-machine-cycle').forEach(btn => {
      btn.addEventListener('click', () => {
        const m = machines.find(x => x.id === btn.getAttribute('data-id'));
        if (m) {
          m.cycles++;
          if (m.cycles >= m.maxCycles) {
            m.isAlert = true;
            m.status = 'Détartrage obligatoire !';
          }
          renderMachinesCards();
          showToast(`+1 Cycle sur ${m.name}`);
        }
      });
    });

    container.querySelectorAll('.btn-machine-reset').forEach(btn => {
      btn.addEventListener('click', () => {
        const m = machines.find(x => x.id === btn.getAttribute('data-id'));
        if (m) {
          m.cycles = 0;
          m.isAlert = false;
          m.status = 'Opérationnel - Récemment entretenu ✓';
          renderMachinesCards();
          showToast(`Entretien validé sur ${m.name} !`);
        }
      });
    });
    refreshIcons();
  }

  // ================= 16. FORMULAIRES D'INSCRIPTION & ESSAI 14 JOURS =================
  const trialModal = document.getElementById('modal-trial');
  const trialOpenButtons = document.querySelectorAll('.trigger-trial-modal');
  const trialCloseButton = document.getElementById('close-trial-btn');
  const trialForm = document.getElementById('form-trial-activation');
  const trialSuccess = document.getElementById('trial-activation-success');
  const selectedPlanInput = document.getElementById('input-selected-plan');
  const btnEnterAppTrial = document.getElementById('btn-enter-dashboard-from-trial');

  if (trialModal) {
    trialOpenButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const planName = btn.getAttribute('data-plan') || 'Essai Gratuit 14 Jours';
        if (selectedPlanInput) selectedPlanInput.value = planName;
        trialModal.classList.remove('hidden');
        trialModal.classList.add('flex');
        document.body.style.overflow = 'hidden';
        refreshIcons();
      });
    });

    const hideTrialModal = () => {
      trialModal.classList.add('hidden');
      trialModal.classList.remove('flex');
      document.body.style.overflow = '';
      if (trialSuccess) trialSuccess.classList.add('hidden');
      if (trialForm) {
        trialForm.reset();
        trialForm.classList.remove('hidden');
      }
    };

    if (trialCloseButton) trialCloseButton.addEventListener('click', hideTrialModal);
    trialModal.addEventListener('click', (e) => {
      if (e.target === trialModal) hideTrialModal();
    });

    if (btnEnterAppTrial) {
      btnEnterAppTrial.addEventListener('click', () => {
        hideTrialModal();
        openAppView('panel-commandes');
      });
    }

    if (trialForm) {
      trialForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const btn = trialForm.querySelector('button[type="submit"]');
        const prevText = btn.innerHTML;
        btn.innerHTML = '<span class="inline-block animate-spin mr-2">⏳</span> Activation de votre pressing...';
        btn.disabled = true;

        const inputPressing = document.getElementById('trial-input-pressing');
        const inputPhone = document.getElementById('trial-input-phone');
        const inputCity = document.getElementById('trial-input-city');

        const pressingName = inputPressing?.value.trim() || 'Mon Pressing';
        const phone = inputPhone?.value.trim() || '+221 77 000 00 00';
        const city = inputCity?.value.trim() || 'Dakar';
        const plan = selectedPlanInput ? selectedPlanInput.value : 'Essai Gratuit 14 Jours';

        const randomNum = Math.floor(1000 + Math.random() * 9000);
        const generatedId = 'SP-' + randomNum;
        const generatedPass = 'sama' + randomNum;

        currentPressingName = pressingName;
        localStorage.setItem('sama_pressing_name', pressingName);
        if (pressingTitleEl) pressingTitleEl.textContent = pressingName;
        if (welcomePressingEl) welcomePressingEl.textContent = pressingName;

        setTimeout(() => {
          btn.innerHTML = prevText;
          btn.disabled = false;
          trialForm.classList.add('hidden');

          const displayPressing = document.getElementById('display-pressing-name');
          const displayId = document.getElementById('display-generated-id');
          const displayPass = document.getElementById('display-generated-pass');
          const whatsappBtn = document.getElementById('btn-send-whatsapp-creds');

          if (displayPressing) displayPressing.textContent = pressingName;
          if (displayId) displayId.textContent = generatedId;
          if (displayPass) displayPass.textContent = generatedPass;

          const waMessage = `👋 *Bonjour Sama Pressing !*\n\nJe viens d'activer mes 14 jours gratuits :\n\n🏢 *Pressing :* ${pressingName}\n📍 *Ville / Quartier :* ${city}\n📱 *Téléphone :* ${phone}\n🔑 *Identifiant :* ${generatedId}\n🔒 *Mot de passe :* ${generatedPass}\n⭐ *Formule :* ${plan}\n\nMerci de m'envoyer mes accès !`;
          const whatsappUrl = `https://wa.me/221770000000?text=${encodeURIComponent(waMessage)}`;
          if (whatsappBtn) whatsappBtn.setAttribute('href', whatsappUrl);

          if (trialSuccess) trialSuccess.classList.remove('hidden');
          refreshIcons();

          setTimeout(() => {
            hideTrialModal();
            openAppView('panel-commandes');
            showToast(`Bienvenue sur ${pressingName} ! Votre espace pressing est prêt.`);
          }, 1800);
        }, 800);
      });
    }
  }

  // Formulaire de bas de page (Landing Page)
  const contactForm = document.getElementById('main-lead-form');
  const contactSuccess = document.getElementById('contact-feedback-success');
  const btnEnterAppBottom = document.getElementById('btn-enter-dashboard-from-bottom');

  if (btnEnterAppBottom) {
    btnEnterAppBottom.addEventListener('click', () => {
      openAppView('panel-commandes');
    });
  }

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.innerHTML;
      submitBtn.innerHTML = 'Création de vos accès...';
      submitBtn.disabled = true;

      const inputs = contactForm.querySelectorAll('input, select');
      const pressingName = inputs[0]?.value.trim() || 'Mon Pressing';
      const ownerName = inputs[1]?.value.trim() || 'Propriétaire';
      const phone = inputs[2]?.value.trim() || '+221 77 000 00 00';
      const city = inputs[3]?.value.trim() || 'Dakar';
      const planSelect = inputs[4]?.options[inputs[4].selectedIndex]?.text || 'Essai Gratuit';

      const randomNum = Math.floor(1000 + Math.random() * 9000);
      const generatedId = 'SP-' + randomNum;
      const generatedPass = 'sama' + randomNum;

      currentPressingName = pressingName;
      localStorage.setItem('sama_pressing_name', pressingName);
      if (pressingTitleEl) pressingTitleEl.textContent = pressingName;
      if (welcomePressingEl) welcomePressingEl.textContent = pressingName;

      setTimeout(() => {
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;

        const bottomId = document.getElementById('bottom-generated-id');
        const bottomPass = document.getElementById('bottom-generated-pass');
        const bottomBtn = document.getElementById('bottom-whatsapp-btn');

        if (bottomId) bottomId.textContent = generatedId;
        if (bottomPass) bottomPass.textContent = generatedPass;

        const waMessage = `👋 *Bonjour Sama Pressing !*\n\nJe viens de m'inscrire sur le site :\n\n🏢 *Pressing :* ${pressingName}\n👤 *Responsable :* ${ownerName}\n📍 *Ville / Quartier :* ${city}\n📱 *Téléphone :* ${phone}\n🔑 *Mon ID :* ${generatedId}\n🔒 *Mot de passe :* ${generatedPass}\n⭐ *Formule :* ${planSelect}\n\nMerci de valider mon compte !`;
        const whatsappUrl = `https://wa.me/221770000000?text=${encodeURIComponent(waMessage)}`;
        if (bottomBtn) bottomBtn.setAttribute('href', whatsappUrl);

        if (contactSuccess) contactSuccess.classList.remove('hidden');
        refreshIcons();

        setTimeout(() => {
          openAppView('panel-commandes');
          showToast(`Bienvenue sur ${pressingName} ! Votre espace pressing est prêt.`);
        }, 1800);
      }, 750);
    });
  }

  // ================= 17. ACCORDÉON FAQ =================
  const faqButtons = document.querySelectorAll('.faq-toggle-btn');
  faqButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const content = btn.nextElementSibling;
      const icon = btn.querySelector('[data-lucide="chevron-down"]');
      const isHidden = content.classList.contains('hidden');

      document.querySelectorAll('.faq-content').forEach(c => c.classList.add('hidden'));
      document.querySelectorAll('.faq-toggle-btn [data-lucide="chevron-down"]').forEach(i => i.style.transform = 'rotate(0deg)');

      if (isHidden) {
        content.classList.remove('hidden');
        if (icon) icon.style.transform = 'rotate(180deg)';
      }
    });
  });

  const cardReceiptTriggerBtn = document.getElementById('card-receipt-trigger-btn');
  if (cardReceiptTriggerBtn) {
    cardReceiptTriggerBtn.addEventListener('click', () => openReceiptForOrder('SP-1041'));
  }

  // ================= 18. INITIALISATION DU SYSTÈME =================
  renderOrders();
  renderTarifsTable();
  renderOrderModalDynamicItems();
  renderStockCards();
  renderBoutiqueProducts();
  renderMachinesCards();
});

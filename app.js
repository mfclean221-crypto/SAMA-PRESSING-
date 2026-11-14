/**
 * SAMA PRESSING - Logiciel SaaS de Gestion de Pressing & Maintenance
 * Logique Frontend JavaScript Complète (Landing Page & Application Interactive)
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

  // ================= 3. SYSTÈME DE TOAST NOTIFICATION FLOTTANT =================
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

  // ================= 4. BASULEMENT VUE SITE (LANDING) <-> APPLICATION (DASHBOARD) =================
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

  // Boutons de déclenchement vers l'Application
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

  // Déclencheurs depuis les cartes Fonctionnalités
  document.querySelectorAll('.app-tab-launcher').forEach(btn => {
    btn.addEventListener('click', () => {
      const target = btn.getAttribute('data-tab') || 'panel-commandes';
      openAppView(target);
    });
  });

  // ================= 5. MENU MOBILE =================
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
        const icon = mobileToggleBtn.querySelector('i');
        if (icon) {
          icon.setAttribute('data-lucide', 'menu');
          refreshIcons();
        }
      });
    });
  }

  // ================= 6. GESTION DES ONGLETS DE L'APPLICATION =================
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

    refreshIcons();
  }

  subTabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const target = btn.getAttribute('data-target');
      if (target) switchAppSubTab(target);
    });
  });

  // ================= 7. DONNÉES & GESTION DES COMMANDES (PANNEAU 1) =================
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

      // Status badge style
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

    // Listeners sur les boutons de chaque ligne
    ordersTableBody.querySelectorAll('.btn-toggle-status').forEach(btn => {
      btn.addEventListener('click', () => {
        const orderId = btn.getAttribute('data-id');
        advanceOrderStatus(orderId);
      });
    });

    ordersTableBody.querySelectorAll('.btn-print-order-receipt').forEach(btn => {
      btn.addEventListener('click', () => {
        const orderId = btn.getAttribute('data-id');
        openReceiptForOrder(orderId);
      });
    });

    ordersTableBody.querySelectorAll('.btn-send-order-wa').forEach(btn => {
      btn.addEventListener('click', () => {
        const orderId = btn.getAttribute('data-id');
        sendWhatsAppNotificationForOrder(orderId);
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
      order.deposit = order.total; // Encaissé totalité
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

  // ================= 8. NOUVELLE COMMANDE MODALE =================
  const newOrderModal = document.getElementById('modal-new-order');
  const openNewOrderBtn = document.getElementById('btn-new-order-modal-open');
  const closeNewOrderBtn = document.getElementById('close-new-order-modal-btn');
  const newOrderForm = document.getElementById('form-new-order-entry');

  if (openNewOrderBtn && newOrderModal) {
    openNewOrderBtn.addEventListener('click', () => {
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

  // Calcul dynamique des articles dans le formulaire de dépôt
  const prices = { boubou: 2500, costume: 2000, chemise: 800, couette: 2500 };
  const quantities = { boubou: 1, costume: 0, chemise: 0, couette: 0 };
  const totalDisplay = document.getElementById('order-calculated-total');
  const depositInput = document.getElementById('order-input-deposit');

  function calculateNewOrderTotal() {
    let tot = 0;
    for (const [key, qty] of Object.entries(quantities)) {
      tot += qty * (prices[key] || 0);
    }
    if (totalDisplay) totalDisplay.textContent = tot.toLocaleString('fr-FR') + ' FCFA';
    if (depositInput) depositInput.value = tot;
    return tot;
  }

  document.querySelectorAll('.btn-qty-plus').forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.getAttribute('data-item');
      if (quantities[item] !== undefined) {
        quantities[item]++;
        const span = document.getElementById(`qty-${item}`);
        if (span) span.textContent = quantities[item];
        calculateNewOrderTotal();
      }
    });
  });

  document.querySelectorAll('.btn-qty-minus').forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.getAttribute('data-item');
      if (quantities[item] && quantities[item] > 0) {
        quantities[item]--;
        const span = document.getElementById(`qty-${item}`);
        if (span) span.textContent = quantities[item];
        calculateNewOrderTotal();
      }
    });
  });

  if (newOrderForm) {
    newOrderForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const client = document.getElementById('order-input-client')?.value.trim() || 'Client';
      const phone = document.getElementById('order-input-phone')?.value.trim() || '+221 77 000 00 00';
      const dueDate = document.getElementById('order-input-due-date')?.value.trim() || 'Demain à 18h';
      const total = calculateNewOrderTotal();
      const deposit = parseInt(depositInput?.value, 10) || total;

      const itemsDesc = [];
      if (quantities.boubou > 0) itemsDesc.push(`${quantities.boubou}x Grand Boubou`);
      if (quantities.costume > 0) itemsDesc.push(`${quantities.costume}x Costume`);
      if (quantities.chemise > 0) itemsDesc.push(`${quantities.chemise}x Chemise/Pantalon`);
      if (quantities.couette > 0) itemsDesc.push(`${quantities.couette}x Couette`);
      if (itemsDesc.length === 0) itemsDesc.push('1x Lavage standard');

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

      // Ouvrir immédiatement le reçu thermique pour cette nouvelle commande
      openReceiptForOrder(newOrderObj.id);
    });
  }

  // ================= 9. GESTION DU REÇU & TICKET THERMIQUE (#modal-receipt) =================
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

  if (printActionBtn) {
    printActionBtn.addEventListener('click', () => window.print());
  }
  if (downloadPdfBtn) {
    downloadPdfBtn.addEventListener('click', () => {
      alert("💡 Astuce : Dans la fenêtre d'impression, sélectionnez 'Enregistrer au format PDF' dans Destination.");
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

  // ================= 10. COMMANDE VOCALE DANS LE DASHBOARD (PANNEAU 2) =================
  const appVoiceBtnFR = document.getElementById('app-btn-voice-fr');
  const appVoiceBtnWO = document.getElementById('app-btn-voice-wo');
  const appVoiceWave = document.getElementById('app-voice-soundwave');
  const appVoiceStatus = document.getElementById('app-voice-status-indicator');
  const appVoiceClient = document.getElementById('app-voice-client-name');
  const appVoiceItems = document.getElementById('app-voice-items-container');
  const appVoiceTotal = document.getElementById('app-voice-total-amount');
  const btnInsertVoiceOrder = document.getElementById('btn-insert-voice-order');

  let currentVoiceOrder = {
    client: 'Awa Diop',
    phone: '+221 77 123 45 67',
    items: 'Lavage & repassage 3kg + 2 Costumes',
    total: 6400
  };

  function simulateVoiceApp(lang) {
    if (appVoiceWave) appVoiceWave.classList.remove('opacity-0');
    if (appVoiceStatus) {
      appVoiceStatus.textContent = lang === 'fr'
        ? '🎙️ Écoute vocale en cours : « 3 kilos de lavage et 2 costumes pour Awa Diop »...'
        : '🎙️ Degglu wolof ci micro bi : « ñaari grands boubous ak benn couette pour Modou Fall »...';
    }

    setTimeout(() => {
      if (appVoiceWave) appVoiceWave.classList.add('opacity-0');
      if (lang === 'fr') {
        currentVoiceOrder = {
          client: 'Awa Diop',
          phone: '+221 77 123 45 67',
          items: 'Lavage & repassage (3kg) + Costume (2 pcs)',
          total: 6400
        };
        if (appVoiceClient) appVoiceClient.textContent = 'Awa Diop';
        if (appVoiceItems) {
          appVoiceItems.innerHTML = `
            <div class="flex justify-between"><span>Lavage & repassage (3 kg)</span><span class="font-bold">2 400 F</span></div>
            <div class="flex justify-between"><span>Costume 2 pièces (2 pcs)</span><span class="font-bold">4 000 F</span></div>
          `;
        }
        if (appVoiceTotal) appVoiceTotal.textContent = '6 400 FCFA';
        if (appVoiceStatus) appVoiceStatus.textContent = '✓ Commande transcrite en Français avec succès !';
      } else {
        currentVoiceOrder = {
          client: 'Modou Fall',
          phone: '+221 78 456 78 90',
          items: '2x Grand Boubou Bazin + 1x Couette Grand Lit',
          total: 7000
        };
        if (appVoiceClient) appVoiceClient.textContent = 'Modou Fall';
        if (appVoiceItems) {
          appVoiceItems.innerHTML = `
            <div class="flex justify-between"><span>Grand Boubou Bazin (2 pcs)</span><span class="font-bold">5 000 F</span></div>
            <div class="flex justify-between"><span>Couette grand lit (1 pc)</span><span class="font-bold">2 000 F</span></div>
          `;
        }
        if (appVoiceTotal) appVoiceTotal.textContent = '7 000 FCFA';
        if (appVoiceStatus) appVoiceStatus.textContent = '✓ Wax ji jub na ci Wolof ! (Commande transcrite avec succès)';
      }
    }, 900);
  }

  if (appVoiceBtnFR) appVoiceBtnFR.addEventListener('click', () => simulateVoiceApp('fr'));
  if (appVoiceBtnWO) appVoiceBtnWO.addEventListener('click', () => simulateVoiceApp('wo'));

  if (btnInsertVoiceOrder) {
    btnInsertVoiceOrder.addEventListener('click', () => {
      const nextNum = Math.floor(1060 + Math.random() * 800);
      const newObj = {
        id: `SP-${nextNum}`,
        client: currentVoiceOrder.client,
        phone: currentVoiceOrder.phone,
        items: currentVoiceOrder.items,
        total: currentVoiceOrder.total,
        deposit: currentVoiceOrder.total,
        dueDate: 'Demain à 18h00',
        status: 'En attente',
        isLate: false
      };
      orders.unshift(newObj);
      renderOrders();
      showToast(`Commande vocale ${newObj.id} (${newObj.client}) ajoutée aux commandes !`);
      switchAppSubTab('panel-commandes');
    });
  }

  // ================= 11. STOCK ATELIER INTERACTIF (PANNEAU 3) =================
  const stockItems = [
    { id: 'lessive', name: 'Lessive liquide ultra-blanchissante', unit: 'Litres', qty: 35, max: 50, alertThreshold: 15, icon: 'package' },
    { id: 'detachant', name: 'Détachant Bazin & Soie délicate', unit: 'Flacons', qty: 8, max: 15, alertThreshold: 5, icon: 'sparkles' },
    { id: 'cintres', name: 'Cintres métalliques de pressing', unit: 'Pièces', qty: 140, max: 200, alertThreshold: 50, icon: 'tag' },
    { id: 'housses', name: 'Housses plastique protection', unit: 'Rouleaux', qty: 45, max: 60, alertThreshold: 20, icon: 'layers' }
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
          <!-- Jauge -->
          <div class="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
            <div class="${barColor} h-full transition-all duration-300" style="width: ${pct}%"></div>
          </div>
        </div>

        <!-- Boutons + et - -->
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
        const id = btn.getAttribute('data-id');
        const it = stockItems.find(s => s.id === id);
        if (it && it.qty < it.max) {
          it.qty++;
          renderStockCards();
          showToast(`+1 ${it.unit} de ${it.name}`);
        }
      });
    });

    container.querySelectorAll('.btn-stock-dec').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        const it = stockItems.find(s => s.id === id);
        if (it && it.qty > 0) {
          it.qty--;
          renderStockCards();
          showToast(`Consommé : -1 ${it.unit} de ${it.name}`);
        }
      });
    });
    refreshIcons();
  }

  // ================= 12. BOUTIQUE DE PRODUITS DE NETTOYAGE (PANNEAU 4) =================
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
        const id = btn.getAttribute('data-id');
        const prod = boutiqueProducts.find(p => p.id === id);
        if (prod && prod.stock > 0) {
          prod.stock--;
          currentBoutiqueSales += prod.price;
          currentBoutiqueProfit += prod.profit;

          const profitEl = document.getElementById('boutique-total-profit');
          const caisseBoutiqueRev = document.getElementById('caisse-boutique-revenue');
          if (profitEl) profitEl.textContent = `+${currentBoutiqueProfit.toLocaleString('fr-FR')} FCFA`;
          if (caisseBoutiqueRev) caisseBoutiqueRev.textContent = `${currentBoutiqueSales.toLocaleString('fr-FR')} FCFA`;

          // Ajout à l'historique des ventes
          const history = document.getElementById('app-boutique-sales-history');
          if (history) {
            const item = document.createElement('div');
            item.className = "flex justify-between py-1 border-b border-slate-200";
            item.innerHTML = `<span>1x ${prod.name}</span><span class="font-bold text-slate-900">${prod.price.toLocaleString('fr-FR')} F <span class="text-emerald-600 font-bold">(+${prod.profit.toLocaleString('fr-FR')} F marge)</span></span>`;
            history.insertBefore(item, history.firstChild);
          }

          showToast(`Vente enregistrée : 1x ${prod.name} (+${prod.profit.toLocaleString('fr-FR')} F bénéfice net) !`);
          renderBoutiqueProducts();
          updateSummaryKPIs();
        }
      });
    });
    refreshIcons();
  }

  // ================= 13. ENTRETIEN & MAINTENANCE MACHINES (PANNEAU 5) =================
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
        const id = btn.getAttribute('data-id');
        const m = machines.find(x => x.id === id);
        if (m) {
          m.cycles++;
          if (m.cycles >= m.maxCycles) {
            m.isAlert = true;
            m.status = 'Détartrage obligatoire !';
          }
          renderMachinesCards();
          showToast(`+1 Cycle enregistré sur ${m.name}`);
        }
      });
    });

    container.querySelectorAll('.btn-machine-reset').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        const m = machines.find(x => x.id === id);
        if (m) {
          m.cycles = 0;
          m.isAlert = false;
          m.status = 'Opérationnel - Récemment entretenu ✓';
          renderMachinesCards();
          showToast(`Entretien validé sur ${m.name} ! Compteur remis à 0.`);
        }
      });
    });
    refreshIcons();
  }

  // ================= 14. FORMULAIRES D'INSCRIPTION & ESSAI 14 JOURS =================
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

        // Mise à jour de l'état
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

          // Lancement automatique du dashboard après 1.8s
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

        // Lancement automatique du dashboard après 1.8s
        setTimeout(() => {
          openAppView('panel-commandes');
          showToast(`Bienvenue sur ${pressingName} ! Votre espace pressing est prêt.`);
        }, 1800);
      }, 750);
    });
  }

  // ================= 15. ASSISTANT VOCAL DE LA LANDING PAGE =================
  const btnVoiceFR = document.getElementById('trigger-voice-fr');
  const btnVoiceWO = document.getElementById('trigger-voice-wo');
  const soundWaveLanding = document.getElementById('voice-soundwave-bars');
  const voiceStatusMsg = document.getElementById('voice-status-indicator');
  const voiceRecognizedQuote = document.getElementById('voice-quote-display');
  const invoiceClient = document.getElementById('invoice-client-name');
  const invoiceRows = document.getElementById('invoice-items-container');
  const invoiceTotalAmount = document.getElementById('invoice-total-amount');
  const invoiceDueDate = document.getElementById('invoice-due-date');

  function runLandingVoice(lang) {
    if (btnVoiceFR && btnVoiceWO) {
      if (lang === 'fr') {
        btnVoiceFR.className = "py-3 px-4 rounded-xl font-bold text-xs sm:text-sm bg-blue-600 text-white shadow-md transition-all flex items-center justify-center gap-2";
        btnVoiceWO.className = "py-3 px-4 rounded-xl font-bold text-xs sm:text-sm bg-white text-slate-700 border border-slate-300 hover:bg-slate-100 transition-all flex items-center justify-center gap-2";
      } else {
        btnVoiceWO.className = "py-3 px-4 rounded-xl font-bold text-xs sm:text-sm bg-blue-600 text-white shadow-md transition-all flex items-center justify-center gap-2";
        btnVoiceFR.className = "py-3 px-4 rounded-xl font-bold text-xs sm:text-sm bg-white text-slate-700 border border-slate-300 hover:bg-slate-100 transition-all flex items-center justify-center gap-2";
      }
    }

    if (soundWaveLanding) soundWaveLanding.classList.remove('opacity-0');
    if (voiceStatusMsg) voiceStatusMsg.textContent = lang === 'fr' ? 'Écoute vocale en cours...' : 'Degglu wolof ci micro bi...';

    setTimeout(() => {
      if (soundWaveLanding) soundWaveLanding.classList.add('opacity-0');
      if (lang === 'fr') {
        if (voiceStatusMsg) voiceStatusMsg.textContent = 'Commande reconnue en Français ✓';
        if (voiceRecognizedQuote) voiceRecognizedQuote.textContent = "« Facture pour Awa Diop : 3 kilos de lavage et repassage et 2 costumes »";
        if (invoiceClient) invoiceClient.textContent = 'Awa Diop';
        if (invoiceTotalAmount) invoiceTotalAmount.textContent = '6 400 FCFA';
        if (invoiceDueDate) invoiceDueDate.textContent = 'À rendre : dans 2 jours (Standard)';
        if (invoiceRows) {
          invoiceRows.innerHTML = `
            <div class="flex justify-between items-center text-xs py-1.5 border-b border-slate-100"><span class="text-slate-600">Lavage & repassage (3 kg × 800 F)</span><span class="font-bold text-slate-900">2 400 F</span></div>
            <div class="flex justify-between items-center text-xs py-1.5"><span class="text-slate-600">Costume 2 pièces (2 × 2 000 F)</span><span class="font-bold text-slate-900">4 000 F</span></div>
          `;
        }
      } else {
        if (voiceStatusMsg) voiceStatusMsg.textContent = 'Commande reconnue en Wolof (Degglu) ✓';
        if (voiceRecognizedQuote) voiceRecognizedQuote.textContent = "« Facture Modou Fall : ñaari grands boubous ak benn couette express »";
        if (invoiceClient) invoiceClient.textContent = 'Modou Fall';
        if (invoiceTotalAmount) invoiceTotalAmount.textContent = '8 400 FCFA';
        if (invoiceDueDate) invoiceDueDate.textContent = 'À rendre : Aujourd\'hui (Express)';
        if (invoiceRows) {
          invoiceRows.innerHTML = `
            <div class="flex justify-between items-center text-xs py-1.5 border-b border-slate-100"><span class="text-slate-600">Grand boubou (2 × 2 500 F)</span><span class="font-bold text-slate-900">5 000 F</span></div>
            <div class="flex justify-between items-center text-xs py-1.5 border-b border-slate-100"><span class="text-slate-600">Couette grand lit (1 × 2 000 F)</span><span class="font-bold text-slate-900">2 000 F</span></div>
            <div class="flex justify-between items-center text-xs py-1.5"><span class="text-slate-600">Supplément Express +20%</span><span class="font-bold text-slate-900">1 400 F</span></div>
          `;
        }
      }
    }, 700);
  }

  if (btnVoiceFR) btnVoiceFR.addEventListener('click', () => runLandingVoice('fr'));
  if (btnVoiceWO) btnVoiceWO.addEventListener('click', () => runLandingVoice('wo'));

  const shareLandingWaBtn = document.getElementById('share-invoice-whatsapp-btn');
  if (shareLandingWaBtn) {
    shareLandingWaBtn.addEventListener('click', () => {
      const client = invoiceClient ? invoiceClient.textContent : 'Client';
      const total = invoiceTotalAmount ? invoiceTotalAmount.textContent : '0 FCFA';
      const text = encodeURIComponent(`Bonjour ${client},\nVotre facture Sama Pressing (${total}) est bien enregistrée.\nNous prenons soin de votre linge avec excellence.`);
      window.open(`https://wa.me/?text=${text}`, '_blank');
    });
  }

  // ================= 16. ACCORDÉON FAQ =================
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

  // Déclencheur Reçu de Caisse depuis la section Fonctionnalités
  const cardReceiptTriggerBtn = document.getElementById('card-receipt-trigger-btn');
  if (cardReceiptTriggerBtn) {
    cardReceiptTriggerBtn.addEventListener('click', () => openReceiptForOrder('SP-1041'));
  }

  // Bouton d'accès rapide vocal dans la bannière de bienvenue de l'application
  const quickVoiceTrigger = document.getElementById('btn-quick-voice-trigger');
  if (quickVoiceTrigger) {
    quickVoiceTrigger.addEventListener('click', () => {
      switchAppSubTab('panel-vocal');
    });
  }

  // ================= 17. INITIALISATION DU RENDU DE L'APPLICATION =================
  renderOrders();
  renderStockCards();
  renderBoutiqueProducts();
  renderMachinesCards();
});

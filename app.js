/**
 * SAMA PRESSING - Logiciel SaaS de Gestion de Pressing & Maintenance
 * Logique Frontend JavaScript
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Initialisation des icônes Lucide
  if (window.lucide) {
    window.lucide.createIcons();
  }

  // 2. Année dynamique du footer
  const yearSpan = document.getElementById('footer-year');
  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
  }

  // 3. Menu Mobile
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
        window.lucide.createIcons();
      }
    });

    mobileLinks.forEach(link => {
      link.addEventListener('click', () => {
        mobileMenuDrawer.classList.add('hidden');
        const icon = mobileToggleBtn.querySelector('i');
        if (icon) {
          icon.setAttribute('data-lucide', 'menu');
          window.lucide.createIcons();
        }
      });
    });
  }

  // 4. Modal Essai Gratuit 14 Jours
  const trialModal = document.getElementById('modal-trial');
  const trialOpenButtons = document.querySelectorAll('.trigger-trial-modal');
  const trialCloseButton = document.getElementById('close-trial-btn');
  const trialForm = document.getElementById('form-trial-activation');
  const trialSuccess = document.getElementById('trial-activation-success');
  const selectedPlanInput = document.getElementById('input-selected-plan');

  if (trialModal) {
    trialOpenButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const planName = btn.getAttribute('data-plan') || 'Essai Gratuit 14 Jours';
        if (selectedPlanInput) {
          selectedPlanInput.value = planName;
        }
        trialModal.classList.remove('hidden');
        trialModal.classList.add('flex');
        document.body.style.overflow = 'hidden';
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

    const closeAndTestBtn = document.getElementById('btn-close-and-test');
    if (closeAndTestBtn) {
      closeAndTestBtn.addEventListener('click', () => {
        hideTrialModal();
      });
    }

    if (trialCloseButton) {
      trialCloseButton.addEventListener('click', hideTrialModal);
    }

    trialModal.addEventListener('click', (e) => {
      if (e.target === trialModal) {
        hideTrialModal();
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && !trialModal.classList.contains('hidden')) {
        hideTrialModal();
      }
    });

    if (trialForm) {
      trialForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const btn = trialForm.querySelector('button[type="submit"]');
        const prevText = btn.innerHTML;
        btn.innerHTML = '<span class="inline-block animate-spin mr-2">⏳</span> Génération de vos identifiants...';
        btn.disabled = true;

        // Récupération des données saisies
        const inputPressing = document.getElementById('trial-input-pressing');
        const inputPhone = document.getElementById('trial-input-phone');
        const inputCity = document.getElementById('trial-input-city');

        const pressingName = inputPressing ? inputPressing.value.trim() : 'Mon Pressing';
        const phone = inputPhone ? inputPhone.value.trim() : '+221 77 000 00 00';
        const city = inputCity ? inputCity.value.trim() : 'Dakar';
        const plan = selectedPlanInput ? selectedPlanInput.value : 'Essai Gratuit 14 Jours';

        // Génération d'identifiants uniques et mémorisables
        const randomNum = Math.floor(1000 + Math.random() * 9000);
        const generatedId = 'SP-' + randomNum;
        const generatedPass = 'sama' + randomNum;

        setTimeout(() => {
          btn.innerHTML = prevText;
          btn.disabled = false;
          trialForm.classList.add('hidden');

          // Mise à jour de l'affichage dans la carte de succès
          const displayPressing = document.getElementById('display-pressing-name');
          const displayId = document.getElementById('display-generated-id');
          const displayPass = document.getElementById('display-generated-pass');
          const whatsappBtn = document.getElementById('btn-send-whatsapp-creds');

          if (displayPressing) displayPressing.textContent = pressingName;
          if (displayId) displayId.textContent = generatedId;
          if (displayPass) displayPass.textContent = generatedPass;

          // Message WhatsApp préformaté
          const waMessage = `👋 *Bonjour Sama Pressing !*\n\nJe viens de créer mon compte pour le test gratuit de 14 jours :\n\n🏢 *Pressing :* ${pressingName}\n📍 *Ville / Quartier :* ${city}\n📱 *Mon Numéro :* ${phone}\n🔑 *Mon Identifiant :* ${generatedId}\n🔒 *Mot de passe :* ${generatedPass}\n⭐ *Formule :* ${plan}\n\nMerci de m'envoyer la confirmation et mes accès !`;
          
          // Numéro officiel WhatsApp Sama Pressing (ou lien WhatsApp avec texte)
          const cleanPhone = phone.replace(/[^0-9]/g, '');
          const whatsappUrl = `https://wa.me/221770000000?text=${encodeURIComponent(waMessage)}`;

          if (whatsappBtn) {
            whatsappBtn.setAttribute('href', whatsappUrl);
          }

          if (trialSuccess) {
            trialSuccess.classList.remove('hidden');
          }

          // Réinitialiser les icônes Lucide dans la zone injectée
          if (window.lucide) {
            window.lucide.createIcons();
          }

          // Ouvrir automatiquement WhatsApp pour l'utilisateur
          window.open(whatsappUrl, '_blank');
        }, 1000);
      });
    }
  }

  // 5. Assistant Vocal Interactif (Français & Wolof)
  const voiceDemoData = {
    fr: {
      phrase: "« Facture pour Awa Diop : 3 kilos de lavage et repassage et 2 costumes »",
      client: "Awa Diop",
      articles: [
        { name: "Lavage & repassage (3 kg × 800 F)", subtotal: 2400 },
        { name: "Costume 2 pièces (2 × 2 000 F)", subtotal: 4000 }
      ],
      total: 6400,
      badgeDelai: "À rendre : dans 2 jours (Standard)",
      statusLabel: "Commande reconnue en Français"
    },
    wo: {
      phrase: "« Facture Modou Fall : ñaari grands boubous ak benn couette express »",
      client: "Modou Fall",
      articles: [
        { name: "Grand boubou (2 × 2 500 F)", subtotal: 5000 },
        { name: "Couette grand lit (1 × 2 000 F)", subtotal: 2000 },
        { name: "Supplément Express +20%", subtotal: 1400 }
      ],
      total: 8400,
      badgeDelai: "À rendre : Aujourd'hui (Express)",
      statusLabel: "Commande reconnue en Wolof (Degglu)"
    }
  };

  const btnVoiceFR = document.getElementById('trigger-voice-fr');
  const btnVoiceWO = document.getElementById('trigger-voice-wo');
  const voiceStatusMsg = document.getElementById('voice-status-indicator');
  const voiceRecognizedQuote = document.getElementById('voice-quote-display');
  const invoiceClient = document.getElementById('invoice-client-name');
  const invoiceRows = document.getElementById('invoice-items-container');
  const invoiceTotalAmount = document.getElementById('invoice-total-amount');
  const invoiceDueDate = document.getElementById('invoice-due-date');
  const soundWaveAnimation = document.getElementById('voice-soundwave-bars');
  let currentActiveData = voiceDemoData.fr;

  function runVoiceRecognition(lang) {
    const data = voiceDemoData[lang];
    if (!data) return;

    if (btnVoiceFR && btnVoiceWO) {
      if (lang === 'fr') {
        btnVoiceFR.className = "py-3 px-4 rounded-xl font-bold text-xs sm:text-sm bg-blue-600 text-white shadow-md transition-all flex items-center justify-center gap-2";
        btnVoiceWO.className = "py-3 px-4 rounded-xl font-bold text-xs sm:text-sm bg-white text-slate-700 border border-slate-300 hover:bg-slate-100 transition-all flex items-center justify-center gap-2";
      } else {
        btnVoiceWO.className = "py-3 px-4 rounded-xl font-bold text-xs sm:text-sm bg-blue-600 text-white shadow-md transition-all flex items-center justify-center gap-2";
        btnVoiceFR.className = "py-3 px-4 rounded-xl font-bold text-xs sm:text-sm bg-white text-slate-700 border border-slate-300 hover:bg-slate-100 transition-all flex items-center justify-center gap-2";
      }
    }

    if (soundWaveAnimation) soundWaveAnimation.classList.remove('opacity-0');
    if (voiceStatusMsg) voiceStatusMsg.textContent = lang === 'fr' ? 'Écoute vocale en cours...' : 'Degglu wolof ci micro bi...';

    setTimeout(() => {
      currentActiveData = data;
      if (soundWaveAnimation) soundWaveAnimation.classList.add('opacity-0');
      if (voiceStatusMsg) voiceStatusMsg.textContent = data.statusLabel + ' ✓';
      if (voiceRecognizedQuote) voiceRecognizedQuote.textContent = data.phrase;
      if (invoiceClient) invoiceClient.textContent = data.client;
      if (invoiceTotalAmount) invoiceTotalAmount.textContent = data.total.toLocaleString('fr-FR') + ' FCFA';
      if (invoiceDueDate) invoiceDueDate.textContent = data.badgeDelai;

      if (invoiceRows) {
        invoiceRows.innerHTML = '';
        data.articles.forEach(item => {
          const row = document.createElement('div');
          row.className = "flex justify-between items-center text-xs py-1.5 border-b border-slate-100 last:border-0";
          row.innerHTML = `
            <span class="text-slate-600">${item.name}</span>
            <span class="font-bold text-slate-900">${item.subtotal.toLocaleString('fr-FR')} F</span>
          `;
          invoiceRows.appendChild(row);
        });
      }
    }, 850);
  }

  if (btnVoiceFR) btnVoiceFR.addEventListener('click', () => runVoiceRecognition('fr'));
  if (btnVoiceWO) btnVoiceWO.addEventListener('click', () => runVoiceRecognition('wo'));

  // 6. Envoi WhatsApp Facture
  const shareWhatsappBtn = document.getElementById('share-invoice-whatsapp-btn');
  if (shareWhatsappBtn) {
    shareWhatsappBtn.addEventListener('click', () => {
      const client = invoiceClient ? invoiceClient.textContent : 'Client';
      const total = invoiceTotalAmount ? invoiceTotalAmount.textContent : '0 FCFA';
      const text = encodeURIComponent(`Bonjour ${client},\nVotre facture Sama Pressing d'un montant de ${total} a bien été enregistrée.\nNous prenons soin de votre linge avec excellence.`);
      window.open(`https://wa.me/?text=${text}`, '_blank');
    });
  }

  // 6b. Gestion du Reçu & Ticket de Caisse Imprimable / PDF (Fonctionnalité 5)
  const receiptModal = document.getElementById('modal-receipt');
  const openReceiptBtn = document.getElementById('open-receipt-btn');
  const cardReceiptTriggerBtn = document.getElementById('card-receipt-trigger-btn');
  const closeReceiptBtn = document.getElementById('close-receipt-btn');
  const btnPrintReceipt = document.getElementById('btn-print-receipt-action');
  const btnDownloadPdf = document.getElementById('btn-download-pdf-action');
  const btnShareReceiptWa = document.getElementById('btn-share-receipt-wa');

  function openReceiptModal() {
    if (!receiptModal) return;

    const clientName = invoiceClient ? invoiceClient.textContent : (currentActiveData ? currentActiveData.client : 'Awa Diop');
    const totalAmount = invoiceTotalAmount ? invoiceTotalAmount.textContent : (currentActiveData ? currentActiveData.total.toLocaleString('fr-FR') + ' FCFA' : '6 400 FCFA');
    const dueDate = invoiceDueDate ? invoiceDueDate.textContent.replace('À rendre : ', '') : (currentActiveData ? currentActiveData.badgeDelai : 'dans 2 jours');

    const receiptClient = document.getElementById('receipt-client-name');
    const receiptTotal = document.getElementById('receipt-total-amount');
    const receiptDue = document.getElementById('receipt-date-due');
    const receiptItems = document.getElementById('receipt-items-container');
    const receiptDateDeposit = document.getElementById('receipt-date-deposit');

    if (receiptClient) receiptClient.textContent = clientName + ' (+221 77 123 45 67)';
    if (receiptTotal) receiptTotal.textContent = totalAmount;
    if (receiptDue) receiptDue.textContent = dueDate;

    const now = new Date();
    const dateStr = now.toLocaleDateString('fr-FR') + ' - ' + String(now.getHours()).padStart(2, '0') + 'h' + String(now.getMinutes()).padStart(2, '0');
    if (receiptDateDeposit) receiptDateDeposit.textContent = dateStr;

    if (receiptItems && currentActiveData && currentActiveData.articles) {
      receiptItems.innerHTML = '';
      currentActiveData.articles.forEach(art => {
        const row = document.createElement('div');
        row.className = 'flex justify-between';
        row.innerHTML = `<span>${art.name}</span><span class="font-bold">${art.subtotal.toLocaleString('fr-FR')} F</span>`;
        receiptItems.appendChild(row);
      });
    }

    receiptModal.classList.remove('hidden');
    receiptModal.classList.add('flex');
    document.body.style.overflow = 'hidden';
    if (window.lucide) window.lucide.createIcons();
  }

  function closeReceiptModal() {
    if (!receiptModal) return;
    receiptModal.classList.add('hidden');
    receiptModal.classList.remove('flex');
    document.body.style.overflow = '';
  }

  if (openReceiptBtn) openReceiptBtn.addEventListener('click', openReceiptModal);
  if (cardReceiptTriggerBtn) cardReceiptTriggerBtn.addEventListener('click', openReceiptModal);
  if (closeReceiptBtn) closeReceiptBtn.addEventListener('click', closeReceiptModal);

  receiptModal?.addEventListener('click', (e) => {
    if (e.target === receiptModal) closeReceiptModal();
  });

  if (btnPrintReceipt) {
    btnPrintReceipt.addEventListener('click', () => {
      window.print();
    });
  }

  if (btnDownloadPdf) {
    btnDownloadPdf.addEventListener('click', () => {
      alert("💡 Astuce : Dans la fenêtre d'impression qui va s'ouvrir, choisissez 'Enregistrer au format PDF' dans Destination.");
      window.print();
    });
  }

  if (btnShareReceiptWa) {
    btnShareReceiptWa.addEventListener('click', () => {
      const client = invoiceClient ? invoiceClient.textContent : 'Client';
      const total = invoiceTotalAmount ? invoiceTotalAmount.textContent : '6 400 FCFA';
      const msg = encodeURIComponent(`🧾 *SAMA PRESSING - REÇU DE DÉPÔT TICKET #SP-2026-0842*\n\nBonjour ${client},\nVotre linge a bien été déposé chez Sama Pressing (Atelier MF Clean Dakar) !\n\n💰 *Total :* ${total}\n✅ *Paiement :* Payé (Wave Mobile Money)\n📦 *Statut :* En cours de traitement\n\nMerci de présenter ce message lors du retrait.`);
      window.open(`https://wa.me/?text=${msg}`, '_blank');
    });
  }

  // 7. Filtres Annuaire Techniciens
  const techCards = document.querySelectorAll('.tech-card-item');
  const techButtons = document.querySelectorAll('.filter-tech-btn');

  techButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      techButtons.forEach(b => {
        b.classList.remove('bg-blue-600', 'text-white');
        b.classList.add('bg-slate-100', 'text-slate-700');
      });
      btn.classList.add('bg-blue-600', 'text-white');
      btn.classList.remove('bg-slate-100', 'text-slate-700');

      const brandFilter = btn.getAttribute('data-brand');
      techCards.forEach(card => {
        const brands = card.getAttribute('data-brands') || '';
        if (brandFilter === 'all' || brands.includes(brandFilter)) {
          card.style.display = 'block';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  // 8. FAQ Accordéon
  const faqItems = document.querySelectorAll('.faq-toggle-btn');
  faqItems.forEach(button => {
    button.addEventListener('click', () => {
      const parent = button.closest('.faq-box');
      const body = parent.querySelector('.faq-content');
      const icon = button.querySelector('[data-lucide="chevron-down"]');
      const isVisible = !body.classList.contains('hidden');

      document.querySelectorAll('.faq-content').forEach(c => c.classList.add('hidden'));
      document.querySelectorAll('.faq-toggle-btn [data-lucide="chevron-down"]').forEach(i => i.style.transform = 'rotate(0deg)');

      if (!isVisible) {
        body.classList.remove('hidden');
        if (icon) icon.style.transform = 'rotate(180deg)';
      }
    });
  });

  // 9. Formulaire de contact principal (Bas de page)
  const contactForm = document.getElementById('main-lead-form');
  const contactSuccess = document.getElementById('contact-feedback-success');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.innerHTML;
      submitBtn.innerHTML = 'Création de vos accès...';
      submitBtn.disabled = true;

      // Récupération des données du formulaire
      const inputs = contactForm.querySelectorAll('input, select');
      const pressingName = inputs[0] ? inputs[0].value.trim() : 'Mon Pressing';
      const ownerName = inputs[1] ? inputs[1].value.trim() : 'Propriétaire';
      const phone = inputs[2] ? inputs[2].value.trim() : '+221 77 000 00 00';
      const city = inputs[3] ? inputs[3].value.trim() : 'Dakar';
      const planSelect = inputs[4] ? inputs[4].options[inputs[4].selectedIndex].text : 'Essai Gratuit';

      const randomNum = Math.floor(1000 + Math.random() * 9000);
      const generatedId = 'SP-' + randomNum;
      const generatedPass = 'sama' + randomNum;

      setTimeout(() => {
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;

        const bottomId = document.getElementById('bottom-generated-id');
        const bottomPass = document.getElementById('bottom-generated-pass');
        const bottomBtn = document.getElementById('bottom-whatsapp-btn');

        if (bottomId) bottomId.textContent = generatedId;
        if (bottomPass) bottomPass.textContent = generatedPass;

        const waMessage = `👋 *Bonjour Sama Pressing !*\n\nJe viens de créer mon compte sur le site :\n\n🏢 *Pressing :* ${pressingName}\n👤 *Responsable :* ${ownerName}\n📍 *Ville / Quartier :* ${city}\n📱 *Téléphone :* ${phone}\n🔑 *Mon ID :* ${generatedId}\n🔒 *Mot de passe :* ${generatedPass}\n⭐ *Formule :* ${planSelect}\n\nMerci de m'envoyer mes accès !`;
        const whatsappUrl = `https://wa.me/221770000000?text=${encodeURIComponent(waMessage)}`;

        if (bottomBtn) {
          bottomBtn.setAttribute('href', whatsappUrl);
        }

        if (contactSuccess) {
          contactSuccess.classList.remove('hidden');
        }

        if (window.lucide) {
          window.lucide.createIcons();
        }

        // Ouverture automatique de WhatsApp avec le message
        window.open(whatsappUrl, '_blank');
      }, 900);
    });
  }
});


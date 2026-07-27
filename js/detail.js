document.addEventListener('DOMContentLoaded', () => {
  const detailContainer = document.getElementById('event-detail-container');
  const regForm = document.getElementById('registration-form');
  const regMessage = document.getElementById('registration-message');
  const submitRegBtn = document.getElementById('submit-reg-btn');
  const btnCopyLink = document.getElementById('btn-copy-link');
  const emailErrorMsg = document.getElementById('reg-email-error-msg');
  const inputEmail = document.getElementById('reg-email');

  const urlParams = new URLSearchParams(window.location.search);
  const eventId = parseInt(urlParams.get('id'));

  let currentEvent = null;

  // 1. CHARGEMENT DE L'ÉVÉNEMENT
  async function loadEventDetail() {
    if (!eventId) {
      detailContainer.innerHTML = `<p class="form-message error">Aucun événement sélectionné.</p>`;
      return;
    }

    try {
      const response = await fetch('data/evenements.json');
      const events = await response.json();
      
      const localState = JSON.parse(localStorage.getItem('allEventsState'));
      const eventFromData = events.find(item => item.id === eventId);
      
      if (localState) {
        const localEvent = localState.find(item => item.id === eventId);
        currentEvent = localEvent || eventFromData;
      } else {
        currentEvent = eventFromData;
      }

      if (!currentEvent) {
        detailContainer.innerHTML = `<p class="form-message error">Événement introuvable.</p>`;
        return;
      }

      renderDetail(currentEvent);
    } catch (error) {
      console.error(error);
      detailContainer.innerHTML = `<p class="form-message error">Erreur lors du chargement des détails.</p>`;
    }
  }

  // 2. AFFICHAGE DES INFOS
  function renderDetail(event) {
    const isComplet = event.placesRestantes <= 0;
    const imageUrl = `images/events/${event.imageName}`;

    detailContainer.innerHTML = `
      <article class="detail-card">
        <div class="detail-banner-container" style="width: 100%; height: 350px; overflow: hidden; position: relative; border-radius: var(--border-radius-md); margin-bottom: 25px;">
          <img src="${imageUrl}" alt="${event.titre}" style="width: 100%; height: 100%; object-fit: cover;" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
          <div style="display: none; width: 100%; height: 100%; background: #e2e8f0; align-items: center; justify-content: center;">
             <span style="color: #64748b;">Image non disponible</span>
          </div>
          <span class="card-badge ${event.badgeClass || 'badge-culture'}" style="position: absolute; top: 20px; left: 20px; font-size: 1rem;">${event.categorie}</span>
        </div>
        <div class="detail-header">
          <h1>${event.titre}</h1>
          <span style="font-size: 1.2rem; font-weight: 800; padding: 10px 18px; border-radius: 30px; background-color: ${!isComplet ? '#d1fae5' : '#fee2e2'}; color: ${!isComplet ? '#047857' : '#dc2626'};">
            <span id="seats-counter">${isComplet ? 'Complet' : event.placesRestantes}</span> ${!isComplet ? `/ ${event.placesTotales} places libres` : ''}
          </span>
        </div>
        <div class="detail-meta-grid">
           <div class="meta-item"><strong>📅 Date & Horaire</strong><span>${event.date} à ${event.heure}</span></div>
           <div class="meta-item"><strong>📍 Lieu</strong><span>${event.lieu}</span></div>
           <div class="meta-item"><strong>🏛️ Organisateur</strong><span>${event.organisateur}</span></div>
        </div>
        <div class="detail-description">
          <h3>À propos de cet événement</h3>
          <p style="margin-top: 10px; font-size: 1.05rem; line-height: 1.8;">${event.description}</p>
        </div>
      </article>
    `;
    if (isComplet) disableRegistration();
  }

  // 3. FONCTIONS UTILITAIRES
  function disableRegistration() {
    if (submitRegBtn) {
      submitRegBtn.disabled = true;
      submitRegBtn.textContent = "Événement Complet";
      submitRegBtn.style.opacity = "0.6";
      submitRegBtn.style.cursor = "not-allowed";
    }
    if (regForm) regForm.querySelectorAll('input, select').forEach(f => f.disabled = true);
  }

  // 4. TRAITEMENT DU FORMULAIRE
  if (regForm) {
    regForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('reg-name').value.trim();
      const email = inputEmail.value.trim().toLowerCase();
      
      if (!email.endsWith('@student.ueh.edu.ht')) {
        if (emailErrorMsg) emailErrorMsg.style.display = 'block';
        if (inputEmail) inputEmail.style.borderColor = '#dc3545';
        regMessage.textContent = "";
        inputEmail.focus();
        return;
      } else {
        if (emailErrorMsg) emailErrorMsg.style.display = 'none';
        if (inputEmail) inputEmail.style.borderColor = 'var(--border-color)';
      }

      const myEvents = JSON.parse(localStorage.getItem('myEduEvents')) || [];
      myEvents.push({ 
        eventTitle: currentEvent.titre, 
        eventDate: currentEvent.date, 
        eventLocation: currentEvent.lieu, 
        registrationDate: new Date().toLocaleDateString(), 
        studentName: name 
      });
      localStorage.setItem('myEduEvents', JSON.stringify(myEvents));

      currentEvent.placesRestantes -= 1;
      let allEventsState = JSON.parse(localStorage.getItem('allEventsState')) || [];
      
      const index = allEventsState.findIndex(e => e.id === currentEvent.id);
      if (index > -1) {
          allEventsState[index] = currentEvent;
      } else {
          allEventsState.push(currentEvent);
      }
      localStorage.setItem('allEventsState', JSON.stringify(allEventsState));

      document.getElementById('seats-counter').textContent = currentEvent.placesRestantes;
      regMessage.textContent = `Félicitations ${name} ! Votre inscription est confirmée.`;
      regMessage.className = "form-message success";
      regForm.reset();
      
      if (emailErrorMsg) emailErrorMsg.style.display = 'none';
      if (inputEmail) inputEmail.style.borderColor = 'var(--border-color)';

      if (currentEvent.placesRestantes <= 0) disableRegistration();
    });
  }

  // 5. COPIER LIEN
  if (btnCopyLink) {
    btnCopyLink.addEventListener('click', (e) => {
      e.preventDefault();
      navigator.clipboard.writeText(window.location.href);
      btnCopyLink.textContent = "✔️ Lien copié !";
    });
  }

  loadEventDetail();
});

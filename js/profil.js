document.addEventListener('DOMContentLoaded', () => {
  const ticketsContainer = document.getElementById('my-tickets-container');
  const ticketCountSpan = document.getElementById('ticket-count');
  
  const viewMode = document.getElementById('profile-view-mode');
  const editForm = document.getElementById('profile-edit-form');
  const editBtn = document.getElementById('edit-profile-btn');
  const cancelBtn = document.getElementById('cancel-edit-btn');

  const avatarImg = document.getElementById('profile-avatar-img');
  const nameEl = document.getElementById('profile-name');
  const facultyEl = document.getElementById('profile-faculty');
  const statusEl = document.getElementById('profile-status');
  const emailEl = document.getElementById('profile-email');

  const inputName = document.getElementById('input-name');
  const inputFaculty = document.getElementById('input-faculty');
  const inputStatus = document.getElementById('input-status');
  const inputEmail = document.getElementById('input-email');
  const inputFile = document.getElementById('input-avatar-file');
  const emailErrorMsg = document.getElementById('email-error-msg');

  // 1. CHARGEMENT ET RENDU DES ÉVÉNEMENTS INSCRITS
  function loadMyTickets() {
    const myEvents = JSON.parse(localStorage.getItem('myEduEvents')) || [];
    
    if (ticketCountSpan) {
      ticketCountSpan.textContent = myEvents.length;
    }

    if (!ticketsContainer) return;

    if (myEvents.length === 0) {
      ticketsContainer.innerHTML = `
        <div style="background-color: var(--card-bg); padding: 30px; text-align: center; border-radius: var(--border-radius-md); border: 1px solid var(--border-color); grid-column: 1 / -1;">
          <p style="color: var(--text-muted);">Vous n'avez réservé aucun événement pour le moment.</p>
          <a href="evenements.html" class="btn btn-primary btn-sm" style="margin-top: 15px;">Parcourir le catalogue</a>
        </div>
      `;
      return;
    }

    ticketsContainer.innerHTML = myEvents.map((item, index) => `
      <div class="ticket-card fade-in">
        <div class="ticket-info">
          <h3>🎟️ ${item.eventTitle}</h3>
          <p class="ticket-meta">📅 Date : <strong>${item.eventDate}</strong> | 📍 Lieu : <strong>${item.eventLocation}</strong></p>
          <p class="ticket-meta" style="margin-top: 5px;">Inscrit le : ${item.registrationDate || 'Récemment'} au nom de <em>${item.studentName}</em></p>
        </div>
        <div>
          <button class="btn-cancel" onclick="cancelRegistration(${index})">Annuler mon billet</button>
        </div>
      </div>
    `).join('');
  }

  // 2. ANNULATION D'UNE INSCRIPTION ET RÉINTÉGRATION DES PLACES
  window.cancelRegistration = function(index) {
    let myEvents = JSON.parse(localStorage.getItem('myEduEvents')) || [];
    const eventToCancel = myEvents[index];
    
    if (!eventToCancel) return;

    if (confirm(`Voulez-vous vraiment annuler votre inscription à "${eventToCancel.eventTitle}" ?`)) {
      let allEventsState = JSON.parse(localStorage.getItem('allEventsState')) || [];
    
      const eventIndex = allEventsState.findIndex(e => e.titre === eventToCancel.eventTitle);
      
      if (eventIndex > -1) {
        allEventsState[eventIndex].placesRestantes += 1;
        localStorage.setItem('allEventsState', JSON.stringify(allEventsState));
      }

      myEvents.splice(index, 1);
      localStorage.setItem('myEduEvents', JSON.stringify(myEvents));
      
      loadMyTickets();
      alert("Votre inscription a été annulée et la place a été libérée.");
    }
  };

  // 3. FONCTION DE PERSISTANCE ET MISE À JOUR VISUELLE DU BADGE DE RÔLE
  function updateRoleBadgeStyle(role) {
    const badge = document.getElementById('profile-role-badge');
    if (!badge) return;

    badge.textContent = role;
    const lowerRole = role.toLowerCase();

    if (lowerRole.includes('prof') || lowerRole.includes('enseignant')) {
      badge.style.backgroundColor = '#28a745';
    } else if (lowerRole.includes('admin') || lowerRole.includes('dir')) {
      badge.style.backgroundColor = '#dc3545'; 
    } else {
      badge.style.backgroundColor = 'var(--primary-color)';
    }
  }

  // 4. CHARGEMENT DES DONNÉES DU PROFIL DEPUIS LE LOCALSTORAGE
  function loadUserProfile() {
    const savedProfile = localStorage.getItem('userProfileData');
    if (savedProfile) {
      const data = JSON.parse(savedProfile);
      
      if (nameEl) nameEl.textContent = data.name;
      if (facultyEl) facultyEl.textContent = data.faculty;
      if (statusEl) statusEl.textContent = data.status;
      if (emailEl) emailEl.textContent = data.email;
      if (avatarImg && data.avatar) avatarImg.src = data.avatar;
      
      updateRoleBadgeStyle(data.role || 'Étudiant');
    } else {
      
      const defaultProfile = {
        name: "PIERRE Fritznel",
        role: "Étudiant",
        faculty: "Sciences et Génie",
        status: "Licence 3 Informatique",
        email: "fritznel.pierre_@student.ueh.edu.ht",
        avatar: "images/logo.png"
      };
      localStorage.setItem('userProfileData', JSON.stringify(defaultProfile));
      loadUserProfile();
    }
  }

  // 5. GESTION DE L'OUVERTURE DU FORMULAIRE D'ÉDITION
  if (editBtn) {
    editBtn.addEventListener('click', () => {
      if (inputName) inputName.value = nameEl ? nameEl.textContent : '';
      if (inputFaculty) inputFaculty.value = facultyEl ? facultyEl.textContent : '';
      if (inputStatus) inputStatus.value = statusEl ? statusEl.textContent : '';
      if (inputEmail) inputEmail.value = emailEl ? emailEl.textContent : '';

      if (emailErrorMsg) emailErrorMsg.style.display = 'none';
      if (inputEmail) inputEmail.style.borderColor = 'var(--border-color)';

      if (viewMode) viewMode.style.display = 'none';
      if (editForm) editForm.style.display = 'flex';
    });
  }

  // 6. ANNULATION DE L'ÉDITION
  if (cancelBtn) {
    cancelBtn.addEventListener('click', () => {
      if (emailErrorMsg) emailErrorMsg.style.display = 'none';
      if (inputEmail) inputEmail.style.borderColor = 'var(--border-color)';
      if (editForm) editForm.style.display = 'none';
      if (viewMode) viewMode.style.display = 'block';
    });
  }

  // 7. SOUMISSION DU FORMULAIRE DE MODIFICATION ET VALIDATION DE L'EMAIL UNIVERSITAIRE
  if (editForm) {
    editForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const emailValue = inputEmail.value.trim().toLowerCase();

      if (!emailValue.endsWith('@student.ueh.edu.ht')) {
        if (emailErrorMsg) emailErrorMsg.style.display = 'block';
        if (inputEmail) inputEmail.style.borderColor = '#dc3545';
        inputEmail.focus();
        return; 
      } else {
        if (emailErrorMsg) emailErrorMsg.style.display = 'none';
        if (inputEmail) inputEmail.style.borderColor = 'var(--border-color)';
      }

      const saveProfileData = (newAvatarSrc) => {
        const currentData = JSON.parse(localStorage.getItem('userProfileData')) || {};
        
        const updatedData = {
          name: inputName.value.trim(),
          role: currentData.role || 'Étudiant', 
          faculty: inputFaculty.value.trim(),
          status: inputStatus.value.trim(),
          email: emailValue,
          avatar: newAvatarSrc || (currentData.avatar || 'images/logo.png')
        };

        localStorage.setItem('userProfileData', JSON.stringify(updatedData));
        loadUserProfile();

        editForm.style.display = 'none';
        viewMode.style.display = 'block';
      };

      const file = inputFile.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = function(event) {
          saveProfileData(event.target.result); 
        };
        reader.readAsDataURL(file);
      } else {
        saveProfileData(null);
      }
    });
  }

  loadUserProfile();
  loadMyTickets();
});

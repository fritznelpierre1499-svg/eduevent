document.addEventListener('DOMContentLoaded', () => {

  // 0. GESTION DE L'AFFICHAGE DU PROFIL DANS LE HEADER (INITIALES OU AVATAR)
  const headerProfileBtn = document.getElementById('header-profile-btn');
  if (headerProfileBtn) {
    const savedProfile = localStorage.getItem('userProfileData');
    if (savedProfile) {
      try {
        const currentUser = JSON.parse(savedProfile);
        if (currentUser && currentUser.name) {
          const nameParts = currentUser.name.trim().split(' ');
          let initials = '';
          
          if (nameParts.length >= 2) {
            initials = (nameParts[0][0] + nameParts[nameParts.length - 1][0]).toUpperCase();
          } else if (nameParts.length === 1) {
            initials = nameParts[0].substring(0, 2).toUpperCase();
          }

          if (currentUser.avatar) {
            headerProfileBtn.innerHTML = `<img src="${currentUser.avatar}" alt="Profil" style="width: 24px; height: 24px; border-radius: 50%; object-fit: cover; vertical-align: middle; margin-right: 5px;"> ${initials || currentUser.name}`;
          } else if (initials) {
            headerProfileBtn.textContent = initials;
            headerProfileBtn.title = currentUser.name; 
          }
        }
      } catch (e) {
        console.error("Erreur lors de la lecture du profil utilisateur", e);
      }
    }
  }

  // 1. ANIMATION DES COMPTEURS DE STATISTIQUES
  const statNumbers = document.querySelectorAll('.stat-number');
  
  if (statNumbers.length > 0) {
    const animateCounters = () => {
      statNumbers.forEach(counter => {
        const target = +counter.getAttribute('data-target');
        const duration = 1500;
        const stepTime = 20;
        const totalSteps = duration / stepTime;
        const increment = target / totalSteps;
        let current = 0;

        const timer = setInterval(() => {
          current += increment;
          if (current >= target) {
            counter.textContent = target;
            clearInterval(timer);
          } else {
            counter.textContent = Math.ceil(current);
          }
        }, stepTime);
      });
    };

    const statsSection = document.querySelector('.stats');
    if (statsSection) {
      let animated = false;
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting && !animated) {
            animateCounters();
            animated = true;
          }
        });
      }, { threshold: 0.3 });

      observer.observe(statsSection);
    }
  }

  // 2. GESTION DU FORMULAIRE DE NEWSLETTER (AVEC EMAIL UNIVERSITAIRE ET MESSAGE DE VALIDATION)
  const newsletterForm = document.getElementById('newsletter-form');
  const newsletterEmail = document.getElementById('newsletter-email');
  const newsletterMessage = document.getElementById('newsletter-message');
  const newsletterHintMsg = document.getElementById('newsletter-hint-msg');

  if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const emailValue = newsletterEmail.value.trim().toLowerCase();

      if (!emailValue.endsWith('@student.ueh.edu.ht')) {
        if (newsletterHintMsg) {
          newsletterHintMsg.textContent = "❌ Veuillez utiliser votre adresse email universitaire valide (@student.ueh.edu.ht).";
          newsletterHintMsg.style.color = "#dc3545";
        } else {
          newsletterMessage.textContent = "Veuillez utiliser votre adresse email universitaire valide (@student.ueh.edu.ht).";
          newsletterMessage.className = "form-message error";
        }
        newsletterEmail.style.borderColor = "#dc3545";
        newsletterEmail.focus();
        return;
      }

      if (newsletterHintMsg) {
        newsletterHintMsg.textContent = "Format requis : votre.nom@student.ueh.edu.ht";
        newsletterHintMsg.style.color = "var(--text-muted)";
      }
      newsletterEmail.style.borderColor = "var(--border-color)";
      
      newsletterMessage.textContent = "Merci ! Votre inscription à la newsletter universitaire est confirmée.";
      newsletterMessage.className = "form-message success";
      newsletterEmail.value = '';

      setTimeout(() => {
        newsletterMessage.textContent = '';
        newsletterMessage.className = 'form-message';
      }, 5000);
    });
  }

  // 3. GESTION DE L'ACCORDÉON FAQ
  const accordionHeaders = document.querySelectorAll('.accordion-header');

  accordionHeaders.forEach(header => {
    header.addEventListener('click', () => {
      const accordionItem = header.parentElement;
      const isActive = accordionItem.classList.contains('active');

      document.querySelectorAll('.accordion-item').forEach(item => {
        item.classList.remove('active');
      });

      if (!isActive) {
        accordionItem.classList.add('active');
      }
    });
  });

  // 4. FORMULAIRE DE CONTACT
  const contactForm = document.getElementById('contact-form');
  const contactResponse = document.getElementById('contact-response');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('contact-name').value;

      contactResponse.textContent = `Merci ${name}, votre message a bien été envoyé ! Notre équipe vous répondra sous 24h.`;
      contactResponse.className = "form-message success";
      contactForm.reset();
    });
  }

});

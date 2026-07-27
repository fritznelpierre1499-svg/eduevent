document.addEventListener('DOMContentLoaded', () => {
  const eventsContainer = document.getElementById('events-container');
  const searchInput = document.getElementById('search-input');
  const categoryFilter = document.getElementById('category-filter');
  const dateFilter = document.getElementById('date-filter');
  const btnGrid = document.getElementById('view-grid');
  const btnList = document.getElementById('view-list');
  const loadMoreBtn = document.getElementById('load-more-btn');

  let allEvents = [];
  let filteredEvents = [];
  
  const ITEMS_PER_PAGE = 4;
  let currentPageLimit = ITEMS_PER_PAGE;

  // 1. CHARGEMENT ET FUSION DES DONNÉES (JSON + LOCALSTORAGE)
  async function fetchEvents() {
    try {
      const response = await fetch('data/evenements.json');
      if (!response.ok) throw new Error('Erreur de chargement');
      let baseEvents = await response.json();
      
      const localState = JSON.parse(localStorage.getItem('allEventsState'));
      
      if (localState) {
        allEvents = baseEvents.map(event => {
          const updatedEvent = localState.find(e => e.id === event.id);
          return updatedEvent ? { ...event, placesRestantes: updatedEvent.placesRestantes } : event;
        });
      } else {
        allEvents = baseEvents;
      }
      
      applyFilters();
    } catch (error) {
      console.error(error);
      eventsContainer.innerHTML = `<p class="form-message error">Impossible de charger les événements.</p>`;
    }
  }

  // 2. RENDU VISUEL
  function renderEvents() {
    const eventsToDisplay = filteredEvents.slice(0, currentPageLimit);

    if (filteredEvents.length === 0) {
      eventsContainer.innerHTML = `<p style="grid-column: 1/-1; text-align: center; padding: 40px;">Aucun événement trouvé.</p>`;
      if (loadMoreBtn) loadMoreBtn.style.display = 'none';
      return;
    }

    eventsContainer.innerHTML = eventsToDisplay.map(event => {
      const badgeClass = event.badgeClass || (event.categorie === 'Sport' ? 'badge-sport' : event.categorie === 'Soutenance' ? 'badge-soutenance' : 'badge-culture');
      const imageUrl = event.imageName ? `images/events/${event.imageName}` : 'images/events/default.png';

      return `
        <article class="event-card fade-in">
          <div class="card-image-wrap" style="min-height: 180px; position: relative;">
            <img src="${imageUrl}" alt="${event.titre}" class="card-img" 
                onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
            <div class="fallback-vector" style="display: none; align-items: center; justify-content: center; height: 100%;">
              <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#4f46e5" stroke-width="1.5"><path d="M12 2v20M2 12h20" /></svg>
            </div>
            <span class="card-badge ${badgeClass}">${event.categorie}</span>
          </div>
          <div class="card-content">
            <span class="card-date">📅 ${event.date} à ${event.heure}</span>
            <h3 class="card-title">${event.titre}</h3>
            <p class="card-location">📍 ${event.lieu}</p>
            <p style="font-weight: 700; color: ${event.placesRestantes > 0 ? 'var(--accent-color)' : 'var(--danger-color)'};">
              ${event.placesRestantes > 0 ? `${event.placesRestantes} places restantes` : 'Complet'}
            </p>
            <a href="detail.html?id=${event.id}" class="btn btn-outline btn-sm">Voir le détail</a>
          </div>
        </article>
      `;
    }).join('');

    if (loadMoreBtn) loadMoreBtn.style.display = (currentPageLimit >= filteredEvents.length) ? 'none' : 'inline-block';
  }

  // 3. LOGIQUE DE FILTRAGE
  function applyFilters() {
    const searchTerm = searchInput.value.toLowerCase().trim();
    const selectedCategory = categoryFilter.value;
    const selectedDateRange = dateFilter ? dateFilter.value : 'all';

    filteredEvents = allEvents.filter(event => {
      const matchesSearch = event.titre.toLowerCase().includes(searchTerm) || event.lieu.toLowerCase().includes(searchTerm);
      const matchesCategory = selectedCategory === 'all' || event.categorie === selectedCategory;
      const matchesDate = matchesDateRange(event.date, selectedDateRange);
      return matchesSearch && matchesCategory && matchesDate;
    });

    currentPageLimit = ITEMS_PER_PAGE;
    renderEvents();
  }

  function matchesDateRange(dateStr, range) {
    if (range === 'all') return true;
    const eventDate = new Date(dateStr);
    const today = new Date();
    if (range === 'today') return eventDate.toDateString() === today.toDateString();
    if (range === 'week') return (eventDate - today) <= 7 * 86400000 && eventDate >= today;
    if (range === 'month') return eventDate.getMonth() === today.getMonth();
    return true;
  }

  // 4. ÉCOUTEURS ET INITIALISATION
  if (loadMoreBtn) loadMoreBtn.addEventListener('click', () => { currentPageLimit += ITEMS_PER_PAGE; renderEvents(); });
  if (searchInput) searchInput.addEventListener('input', applyFilters);
  if (categoryFilter) categoryFilter.addEventListener('change', applyFilters);
  if (dateFilter) dateFilter.addEventListener('change', applyFilters);

  if (btnGrid && btnList) {
    btnGrid.addEventListener('click', () => { btnGrid.classList.add('active'); btnList.classList.remove('active'); eventsContainer.className = 'events-grid'; });
    btnList.addEventListener('click', () => { btnList.classList.add('active'); btnGrid.classList.remove('active'); eventsContainer.className = 'events-list'; });
  }

  fetchEvents();
});

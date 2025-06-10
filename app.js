// Elements
const todayMovieDiv = document.getElementById("today-movie");
const randomMovieDiv = document.getElementById("random-movie");
const newRandomBtn = document.getElementById("new-random-btn");

const categoryFilter = document.getElementById("category-filter");
const countryFilter = document.getElementById("country-filter");
const filterBtn = document.getElementById("filter-btn");

const favoritesList = document.getElementById("favorites-list");
const clearFavoritesBtn = document.getElementById("clear-favorites");

const watchedList = document.getElementById("watched-list");
const clearWatchedBtn = document.getElementById("clear-watched");

// LocalStorage keys
const LS_FAVORITES = "favoriteMovies";
const LS_WATCHED = "watchedMovies";

// State
let filteredMovies = [...movies];
let favorites = JSON.parse(localStorage.getItem(LS_FAVORITES)) || [];
let watched = JSON.parse(localStorage.getItem(LS_WATCHED)) || [];

// Utility Functions

function saveFavorites() {
  localStorage.setItem(LS_FAVORITES, JSON.stringify(favorites));
}

function saveWatched() {
  localStorage.setItem(LS_WATCHED, JSON.stringify(watched));
}

function renderMovieCard(movie, options = {}) {
  // options: showAddFavBtn, showAddWatchedBtn, showRemoveFavBtn, showRemoveWatchedBtn
  const card = document.createElement("div");
  card.className = "movie-card";

  const poster = document.createElement("img");
  poster.src = movie.poster;
  poster.alt = movie.title;

  const info = document.createElement("div");
  info.className = "movie-info";

  const title = document.createElement("h3");
  title.textContent = movie.title;

  const details = document.createElement("p");
  details.innerHTML = `<strong>Kategori:</strong> ${movie.category} <br />
                       <strong>Ülke:</strong> ${movie.country} <br />
                       <strong>IMDb:</strong> <span class="imdb">${movie.imdb}</span>`;

  const summary = document.createElement("p");
  summary.textContent = movie.summary;

  const actions = document.createElement("div");
  actions.className = "movie-actions";

  if (options.showAddFavBtn) {
    const favBtn = document.createElement("button");
    favBtn.textContent = "Favorilere Ekle";
    favBtn.onclick = () => {
      if (!favorites.find((m) => m.id === movie.id)) {
        favorites.push(movie);
        saveFavorites();
        renderFavorites();
      
      }
    };
    actions.appendChild(favBtn);
  }

  if (options.showAddWatchedBtn) {
    const watchedBtn = document.createElement("button");
    watchedBtn.textContent = "İzlenenlere Ekle";
    watchedBtn.onclick = () => {
      if (!watched.find((m) => m.id === movie.id)) {
        watched.push(movie);
        saveWatched();
        renderWatched();
        
      }
    };
    actions.appendChild(watchedBtn);
  }

  if (options.showRemoveFavBtn) {
    const removeFavBtn = document.createElement("button");
    removeFavBtn.textContent = "Favorilerden Kaldır";
    removeFavBtn.onclick = () => {
      favorites = favorites.filter((m) => m.id !== movie.id);
      saveFavorites();
      renderFavorites();
    };
    actions.appendChild(removeFavBtn);
  }

  if (options.showRemoveWatchedBtn) {
    const removeWatchedBtn = document.createElement("button");
    removeWatchedBtn.textContent = "İzlenenlerden Kaldır";
    removeWatchedBtn.onclick = () => {
      watched = watched.filter((m) => m.id !== movie.id);
      saveWatched();
      renderWatched();
    };
    actions.appendChild(removeWatchedBtn);
  }

  info.appendChild(title);
  info.appendChild(details);
  info.appendChild(summary);
  info.appendChild(actions);

  card.appendChild(poster);
  card.appendChild(info);

  return card;
}

// Fill filters dynamically
function fillFilters() {
  const categories = Array.from(new Set(movies.map((m) => m.category))).sort();
  categories.forEach((cat) => {
    const option = document.createElement("option");
    option.value = cat;
    option.textContent = cat;
    categoryFilter.appendChild(option);
  });

  const countries = Array.from(new Set(movies.map((m) => m.country))).sort();
  countries.forEach((c) => {
    const option = document.createElement("option");
    option.value = c;
    option.textContent = c;
    countryFilter.appendChild(option);
  });
}

// Filter movies by selected filters
function applyFilters() {
  const catVal = categoryFilter.value;
  const countryVal = countryFilter.value;

  filteredMovies = movies.filter((m) => {
    const catMatch = catVal === "all" ? true : m.category === catVal;
    const countryMatch = countryVal === "all" ? true : m.country === countryVal;
    return catMatch && countryMatch;
  });
}

// Render favorites list
function renderFavorites() {
  favoritesList.innerHTML = "";
  if (favorites.length === 0) {
    favoritesList.textContent = "Favoriler boş.";
    return;
  }
  favorites.forEach((movie) => {
    const card = renderMovieCard(movie, { showRemoveFavBtn: true });
    favoritesList.appendChild(card);
  });
}

// Render watched list
function renderWatched() {
  watchedList.innerHTML = "";
  if (watched.length === 0) {
    watchedList.textContent = "İzlenenler boş.";
    return;
  }
  watched.forEach((movie) => {
    const card = renderMovieCard(movie, { showRemoveWatchedBtn: true });
    watchedList.appendChild(card);
  });
}

// Günün filmini tarihe bağlı seç
function getTodaysMovie() {
  const dayIndex = new Date().getDate(); // 1-31
  // Döngü için mod al
  return movies[dayIndex % movies.length];
}

// Rastgele film getir
function getRandomMovie() {
  if (filteredMovies.length === 0) return null;
  const idx = Math.floor(Math.random() * filteredMovies.length);
  return filteredMovies[idx];
}

// Render günün filmi
function renderTodayMovie() {
  todayMovieDiv.innerHTML = "";
  const movie = getTodaysMovie();
  const card = renderMovieCard(movie, {
    showAddFavBtn: !favorites.find((m) => m.id === movie.id),
    showAddWatchedBtn: !watched.find((m) => m.id === movie.id),
  });
  todayMovieDiv.appendChild(card);
}

// Render rastgele filmi
function renderRandomMovie() {
  randomMovieDiv.innerHTML = "";
  const movie = getRandomMovie();
  if (!movie) {
    randomMovieDiv.textContent = "Filtrelere uygun film bulunamadı.";
    newRandomBtn.disabled = true;
    return;
  }
  newRandomBtn.disabled = false;
  const card = renderMovieCard(movie, {
    showAddFavBtn: !favorites.find((m) => m.id === movie.id),
    showAddWatchedBtn: !watched.find((m) => m.id === movie.id),
  });
  randomMovieDiv.appendChild(card);
}

// Temizleme butonları
clearFavoritesBtn.onclick = () => {
  if (confirm("Favorileri silmek istediğine emin misin?")) {
    favorites = [];
    saveFavorites();
    renderFavorites();
  }
};

clearWatchedBtn.onclick = () => {
  if (confirm("İzlenenleri silmek istediğine emin misin?")) {
    watched = [];
    saveWatched();
    renderWatched();
  }
};

// Filtrele butonu
filterBtn.onclick = () => {
  applyFilters();
  renderRandomMovie();
};

// Yeni rastgele film butonu
newRandomBtn.onclick = () => {
  renderRandomMovie();
};

// Başlangıçta
fillFilters();
applyFilters();
renderTodayMovie();
renderRandomMovie();
renderFavorites();
renderWatched();

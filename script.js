const STORAGE_KEYS = {
  users: "neear_users_v3",
  currentUserId: "neear_current_user_id_v3"
};

const defaultUsers = [
  {
    id: "u1",
    name: "Matthieu Hoogeboom",
    role: "Brand & Web Designer",
    email: "matthieu@neear.com",
    password: "1234",
    visible: true,
    points: 95,
    bio: "J’aide les projets à se concrétiser visuellement et je participe au rayonnement de la communauté.",
    photo: "",
    twoFactorEnabled: false
  },
  {
    id: "u2",
    name: "Cécile Panzani",
    role: "Freelance en SEO",
    email: "cecile@neear.com",
    password: "1234",
    visible: true,
    points: 125,
    bio: "J’accompagne les projets dans leur visibilité et je contribue au développement de la communauté.",
    photo: "",
    twoFactorEnabled: false
  },
  {
    id: "u3",
    name: "Enzo Fadda",
    role: "Local Guide",
    email: "enzo@neear.com",
    password: "1234",
    visible: true,
    points: 82,
    bio: "Je mets en avant les initiatives locales et les expériences utiles pour la communauté.",
    photo: "",
    twoFactorEnabled: false
  },
  {
    id: "u4",
    name: "Nina Costa",
    role: "Freelance Designer",
    email: "nina@neear.com",
    password: "1234",
    visible: true,
    points: 54,
    bio: "Je partage mes retours d’expérience et mes actions au sein de Neear.",
    photo: "",
    twoFactorEnabled: false
  },
  {
    id: "u5",
    name: "Louis Mercier",
    role: "Founder Community",
    email: "louis@neear.com",
    password: "1234",
    visible: true,
    points: 170,
    bio: "J’anime la communauté et valorise les membres les plus actifs.",
    photo: "",
    twoFactorEnabled: false
  },
  {
    id: "u6",
    name: "Sarah Klein",
    role: "Product Advocate",
    email: "sarah@neear.com",
    password: "1234",
    visible: false,
    points: 64,
    bio: "Je contribue à la qualité produit avec des feedbacks réguliers.",
    photo: "",
    twoFactorEnabled: false
  }
];

const reviews = [
  {
    title: "Produit simple et efficace",
    text: "On sent que le produit a été pensé par des gens qui connaissent le terrain.",
    source: "Google"
  },
  {
    title: "Très pratique au quotidien",
    text: "La carte simplifie vraiment la prise de contact et l’interface est intuitive.",
    source: "Trustpilot"
  },
  {
    title: "Super expérience",
    text: "Le design est propre, la logique est claire et le parcours utilisateur est fluide.",
    source: "Google"
  },
  {
    title: "Je recommande",
    text: "L’outil permet de valoriser les profils et de créer une vraie dynamique de communauté.",
    source: "Trustpilot"
  }
];

const posts = [
  {
    tag: "LinkedIn",
    title: "Partager son expérience avec Neear",
    text: "Un retour concret sur l’usage du produit et les échanges créés.",
    left: "8%",
    duration: "10s",
    delay: "0s"
  },
  {
    tag: "Community",
    title: "Mettre en avant un pionnier",
    text: "Un post pour valoriser un profil actif de la communauté.",
    left: "28%",
    duration: "12s",
    delay: "2s"
  },
  {
    tag: "Feedback",
    title: "Donner son avis produit",
    text: "Des retours utiles pour faire évoluer l’expérience utilisateur.",
    left: "48%",
    duration: "11s",
    delay: "3.5s"
  },
  {
    tag: "Brand",
    title: "Parler de la carte Neear",
    text: "Un contenu court pour faire connaître le concept plus largement.",
    left: "68%",
    duration: "13s",
    delay: "1s"
  },
  {
    tag: "Referral",
    title: "Inviter un nouveau membre",
    text: "Un post orienté recommandation et développement de la communauté.",
    left: "18%",
    duration: "14s",
    delay: "5s"
  },
  {
    tag: "Social",
    title: "Flux de posts en continu",
    text: "Un mouvement permanent pour montrer une communauté vivante.",
    left: "58%",
    duration: "10.5s",
    delay: "6s"
  }
];

function loadUsers() {
  const raw = localStorage.getItem(STORAGE_KEYS.users);

  if (!raw) {
    localStorage.setItem(STORAGE_KEYS.users, JSON.stringify(defaultUsers));
    return [...defaultUsers];
  }

  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [...defaultUsers];
  } catch {
    return [...defaultUsers];
  }
}

function saveUsers(users) {
  localStorage.setItem(STORAGE_KEYS.users, JSON.stringify(users));
}

function getCurrentUserId() {
  return localStorage.getItem(STORAGE_KEYS.currentUserId);
}

function setCurrentUserId(id) {
  if (id) {
    localStorage.setItem(STORAGE_KEYS.currentUserId, id);
  } else {
    localStorage.removeItem(STORAGE_KEYS.currentUserId);
  }
}

function getCurrentUser() {
  const users = loadUsers();
  const id = getCurrentUserId();
  return users.find(user => user.id === id) || null;
}

function initialsFromName(name) {
  return name
    .split(" ")
    .slice(0, 2)
    .map(word => word[0]?.toUpperCase() || "")
    .join("");
}

function getLevel(points) {
  if (points >= 100) return "Ambassadeur";
  if (points >= 40) return "Pionnier";
  return "Curieux";
}

function getAvatarMarkup(user, sizeClass = "") {
  if (user.photo && user.photo.trim() !== "") {
    return `<img src="${user.photo}" alt="${user.name}" class="avatar avatar-image ${sizeClass}" />`;
  }

  return `<div class="avatar ${sizeClass}">${initialsFromName(user.name)}</div>`;
}

function getFeaturedUser() {
  const users = loadUsers();
  const currentUser = getCurrentUser();

  if (currentUser && currentUser.visible) {
    return currentUser;
  }

  const visibleUsers = users.filter(user => user.visible);
  if (!visibleUsers.length) return users[0] || null;

  return visibleUsers.sort((a, b) => b.points - a.points)[0];
}

function renderFeaturedUser() {
  const container = document.getElementById("featuredProfile");
  const user = getFeaturedUser();

  if (!user) {
    container.innerHTML = "";
    return;
  }

  container.innerHTML = `
    <div class="featured-card">
      <div class="featured-top">
        ${getAvatarMarkup(user)}
        <div>
          <p class="featured-name">${user.name}</p>
          <p class="featured-role">${user.role}</p>
        </div>
      </div>

      <div class="badge-row">
        <span class="badge badge-level">${getLevel(user.points)}</span>
        <span class="badge badge-score">${user.points} points</span>
      </div>

      <div class="featured-box-grid">
        <div class="featured-box">
          <h3>À propos</h3>
          <p>${user.bio}</p>
        </div>
        <div class="featured-side">
          <h3>Profil</h3>
          <p>${user.visible ? "Visible sur le site" : "Privé"}</p>
        </div>
      </div>

      <div class="featured-actions">
        <div class="featured-mini">Commentaire</div>
        <div class="featured-mini">Contact</div>
        <div class="featured-mini">Action</div>
      </div>
    </div>
  `;
}

function createProfileCard(user) {
  return `
    <article class="profile-card">
      ${getAvatarMarkup(user, "avatar-small")}
      <h3>${user.name}</h3>
      <p>${user.role}</p>
      <div class="profile-meta">
        <span class="level">${getLevel(user.points)}</span>
        <span class="score">${user.points} pts</span>
      </div>
    </article>
  `;
}

function renderProfiles() {
  const users = loadUsers().filter(user => user.visible);
  const top = document.getElementById("profilesRowTop");
  const bottom = document.getElementById("profilesRowBottom");

  function fillToCount(list, count) {
    if (list.length === 0) return [];
    const result = [];
    let i = 0;

    while (result.length < count) {
      result.push(list[i % list.length]);
      i++;
    }

    return result;
  }

  const topBase = fillToCount(users.slice(0, 4), 4);
  const bottomSource = users.slice(4, 8).length ? users.slice(4, 8) : users.slice(0, 4);
  const bottomBase = fillToCount(bottomSource, 4);

  const topLoop = [...topBase, ...topBase];
  const bottomLoop = [...bottomBase, ...bottomBase];

  top.innerHTML = topLoop.map(createProfileCard).join("");
  bottom.innerHTML = bottomLoop.map(createProfileCard).join("");
}

function renderReviews() {
  const track = document.getElementById("reviewsTrack");
  track.innerHTML = [...reviews, ...reviews].map(review => `
    <article class="review-card">
      <div class="review-stars">★★★★★</div>
      <h3>${review.title}</h3>
      <p>${review.text}</p>
      <span class="review-source">${review.source}</span>
    </article>
  `).join("");
}

function renderPosts() {
  const zone = document.getElementById("postsFallZone");
  zone.innerHTML = posts.map(post => `
    <article
      class="post-fall-card"
      style="left:${post.left}; animation-duration:${post.duration}; animation-delay:${post.delay};"
    >
      <span class="post-tag">${post.tag}</span>
      <h3>${post.title}</h3>
      <p>${post.text}</p>
    </article>
  `).join("");
}

function openModal(id) {
  document.getElementById("overlay").classList.remove("hidden");
  document.getElementById(id).classList.remove("hidden");
}

function closeModal(id) {
  document.getElementById("overlay").classList.add("hidden");
  document.getElementById(id).classList.add("hidden");
}

function closeAllModals() {
  document.getElementById("overlay").classList.add("hidden");
  document.querySelectorAll(".modal").forEach(modal => modal.classList.add("hidden"));
}

function updateJoinButton() {
  const joinBtn = document.getElementById("joinBtn");
  const currentUser = getCurrentUser();
  joinBtn.textContent = currentUser ? "Mon compte" : "Rejoindre";
}

function renderAccountModal() {
  const content = document.getElementById("accountContent");
  const user = getCurrentUser();

  if (!user) {
    content.innerHTML = `
      <div class="account-box">
        <h3>Aucun compte connecté</h3>
        <p>Connectez-vous pour accéder à votre profil.</p>
      </div>
    `;
    return;
  }

  content.innerHTML = `
    <div class="account-box">
      <div class="account-profile-header">
        ${getAvatarMarkup(user, "account-avatar")}
        <div>
          <h3>${user.name}</h3>
          <p class="account-subtitle">${user.role}</p>
        </div>
      </div>

      <div class="account-stat"><strong>Email :</strong> ${user.email}</div>
      <div class="account-stat"><strong>Points :</strong> ${user.points}</div>
      <div class="account-stat"><strong>Niveau :</strong> ${getLevel(user.points)}</div>
      <div class="account-stat"><strong>Visibilité :</strong> ${user.visible ? "Visible sur le site" : "Masqué sur le site"}</div>
      <div class="account-stat"><strong>A2F :</strong> ${user.twoFactorEnabled ? "Activée" : "Désactivée"}</div>

      <form id="profileEditForm" class="account-form">
        <h4>Modifier mon profil</h4>

        <label>Photo de profil</label>
        <input id="profilePhotoInput" type="file" accept="image/*" />

        <label>Nom</label>
        <input id="editName" type="text" value="${user.name}" />

        <label>Métier / rôle</label>
        <input id="editRole" type="text" value="${user.role}" />

        <label>À propos</label>
        <textarea id="editBio" rows="4">${user.bio || ""}</textarea>

        <button class="modal-submit" type="submit">Enregistrer le profil</button>
        <p id="profileEditMessage" class="form-message"></p>
      </form>

      <form id="passwordForm" class="account-form">
        <h4>Sécurité du compte</h4>

        <label>Nouveau mot de passe</label>
        <input id="newPassword" type="password" placeholder="Nouveau mot de passe" />

        <label>Confirmer le mot de passe</label>
        <input id="confirmPassword" type="password" placeholder="Confirmer le mot de passe" />

        <button class="modal-submit" type="submit">Modifier le mot de passe</button>
        <p id="passwordMessage" class="form-message"></p>
      </form>

      <div class="account-actions">
        <button id="toggleVisibilityBtn" class="account-secondary" type="button">
          ${user.visible ? "Masquer mon profil" : "Rendre mon profil visible"}
        </button>

        <button id="toggle2FABtn" class="account-secondary" type="button">
          ${user.twoFactorEnabled ? "Désactiver l’A2F" : "Activer l’A2F"}
        </button>

        <button id="logoutBtn" class="account-danger" type="button">Déconnexion</button>
      </div>
    </div>
  `;

  document.getElementById("toggleVisibilityBtn").addEventListener("click", toggleCurrentUserVisibility);
  document.getElementById("toggle2FABtn").addEventListener("click", toggleCurrentUser2FA);
  document.getElementById("logoutBtn").addEventListener("click", logout);
  document.getElementById("profileEditForm").addEventListener("submit", saveProfileChanges);
  document.getElementById("passwordForm").addEventListener("submit", changePassword);
  document.getElementById("profilePhotoInput").addEventListener("change", handleProfilePhotoUpload);
}

function toggleCurrentUserVisibility() {
  const users = loadUsers();
  const currentUser = getCurrentUser();

  if (!currentUser) return;

  const updatedUsers = users.map(user =>
    user.id === currentUser.id ? { ...user, visible: !user.visible } : user
  );

  saveUsers(updatedUsers);
  renderEverything();
  renderAccountModal();
}

function saveProfileChanges(event) {
  event.preventDefault();

  const currentUser = getCurrentUser();
  if (!currentUser) return;

  const users = loadUsers();
  const name = document.getElementById("editName").value.trim();
  const role = document.getElementById("editRole").value.trim();
  const bio = document.getElementById("editBio").value.trim();
  const message = document.getElementById("profileEditMessage");

  const updatedUsers = users.map(user => {
    if (user.id !== currentUser.id) return user;

    return {
      ...user,
      name: name || user.name,
      role: role || user.role,
      bio: bio || user.bio,
      photo: user.photo || "",
      twoFactorEnabled: user.twoFactorEnabled,
      visible: user.visible,
      points: user.points,
      email: user.email,
      password: user.password
    };
  });

  saveUsers(updatedUsers);
  message.textContent = "Profil mis à jour.";

  renderEverything();
  renderAccountModal();
}

function changePassword(event) {
  event.preventDefault();

  const currentUser = getCurrentUser();
  if (!currentUser) return;

  const newPassword = document.getElementById("newPassword").value.trim();
  const confirmPassword = document.getElementById("confirmPassword").value.trim();
  const message = document.getElementById("passwordMessage");

  if (!newPassword || !confirmPassword) {
    message.textContent = "Remplissez les deux champs.";
    return;
  }

  if (newPassword.length < 4) {
    message.textContent = "Le mot de passe doit contenir au moins 4 caractères.";
    return;
  }

  if (newPassword !== confirmPassword) {
    message.textContent = "Les mots de passe ne correspondent pas.";
    return;
  }

  const users = loadUsers();
  const updatedUsers = users.map(user =>
    user.id === currentUser.id
      ? { ...user, password: newPassword }
      : user
  );

  saveUsers(updatedUsers);
  message.textContent = "Mot de passe modifié.";
  document.getElementById("passwordForm").reset();
}

function toggleCurrentUser2FA() {
  const currentUser = getCurrentUser();
  if (!currentUser) return;

  const users = loadUsers();
  const updatedUsers = users.map(user =>
    user.id === currentUser.id
      ? { ...user, twoFactorEnabled: !user.twoFactorEnabled }
      : user
  );

  saveUsers(updatedUsers);
  renderEverything();
  renderAccountModal();
}

function handleProfilePhotoUpload(event) {
  const file = event.target.files[0];
  const currentUser = getCurrentUser();

  if (!file || !currentUser) return;

  // Évite de saturer localStorage avec des images énormes
  if (file.size > 1024 * 1024 * 2) {
    const message = document.getElementById("profileEditMessage");
    if (message) {
      message.textContent = "Image trop lourde. Choisis une image de moins de 2 Mo.";
    }
    return;
  }

  const reader = new FileReader();

  reader.onload = function(loadEvent) {
    const photoData = loadEvent.target.result;
    const users = loadUsers();

    const updatedUsers = users.map(user => {
      if (user.id !== currentUser.id) return user;

      return {
        ...user,
        photo: photoData
      };
    });

    try {
      saveUsers(updatedUsers);

      const refreshedCurrentUser = updatedUsers.find(user => user.id === currentUser.id);
      if (refreshedCurrentUser) {
        setCurrentUserId(refreshedCurrentUser.id);
      }

      renderEverything();
      renderAccountModal();

      const message = document.getElementById("profileEditMessage");
      if (message) {
        message.textContent = "Photo de profil mise à jour.";
      }
    } catch (error) {
      const message = document.getElementById("profileEditMessage");
      if (message) {
        message.textContent = "Impossible d’enregistrer cette image. Essaie une image plus légère.";
      }
      console.error(error);
    }
  };

  reader.readAsDataURL(file);
}

function logout() {
  setCurrentUserId(null);
  closeModal("accountModal");
  renderEverything();
}

function showSearchResult(query) {
  const users = loadUsers();
  const result = users.find(user =>
    user.name.toLowerCase().includes(query.toLowerCase())
  );

  const container = document.getElementById("searchResultContent");

  if (!result) {
    container.innerHTML = `
      <div>
        <h3>Utilisateur introuvable</h3>
        <p>Aucun profil ne correspond à votre recherche.</p>
      </div>
    `;
  } else {
    container.innerHTML = `
      <div class="account-box">
        ${getAvatarMarkup(result)}
        <h3>${result.name}</h3>
        <div class="account-stat"><strong>Rôle :</strong> ${result.role}</div>
        <div class="account-stat"><strong>Points :</strong> ${result.points}</div>
        <div class="account-stat"><strong>Niveau :</strong> ${getLevel(result.points)}</div>
        <div class="account-stat"><strong>Visibilité :</strong> ${result.visible ? "Visible" : "Privé"}</div>
        <div class="account-stat"><strong>À propos :</strong> ${result.bio || "Aucune description."}</div>
      </div>
    `;
  }

  openModal("searchModal");
}

function registerUser(event) {
  event.preventDefault();

  const name = document.getElementById("registerName").value.trim();
  const role = document.getElementById("registerRole").value.trim();
  const email = document.getElementById("registerEmail").value.trim().toLowerCase();
  const password = document.getElementById("registerPassword").value.trim();
  const visible = document.getElementById("registerVisible").checked;
  const message = document.getElementById("registerMessage");

  const users = loadUsers();

  if (users.some(user => user.email === email)) {
    message.textContent = "Un compte existe déjà avec cet email.";
    return;
  }

  const newUser = {
    id: `u_${Date.now()}`,
    name,
    role,
    email,
    password,
    visible,
    points: 10,
    bio: "Nouveau membre de la communauté Neear.",
    photo: "",
    twoFactorEnabled: false
  };

  users.push(newUser);
  saveUsers(users);
  setCurrentUserId(newUser.id);

  message.textContent = "Compte créé avec succès.";
  renderEverything();

  setTimeout(() => {
    closeModal("authModal");
    document.getElementById("registerForm").reset();
    message.textContent = "";
  }, 600);
}

function loginUser(event) {
  event.preventDefault();

  const email = document.getElementById("loginEmail").value.trim().toLowerCase();
  const password = document.getElementById("loginPassword").value.trim();
  const message = document.getElementById("loginMessage");

  const users = loadUsers();
  const user = users.find(u => u.email === email && u.password === password);

  if (!user) {
    message.textContent = "Identifiants incorrects.";
    return;
  }

  setCurrentUserId(user.id);
  message.textContent = "Connexion réussie.";
  renderEverything();

  setTimeout(() => {
    closeModal("authModal");
    document.getElementById("loginForm").reset();
    message.textContent = "";
  }, 500);
}

function addPoints(points, label) {
  const currentUser = getCurrentUser();
  const message = document.getElementById("scoreMessage");

  if (!currentUser) {
    message.textContent = "Connectez-vous pour gagner des points.";
    return;
  }

  const users = loadUsers();
  const updatedUsers = users.map(user =>
    user.id === currentUser.id
      ? { ...user, points: user.points + points }
      : user
  );

  saveUsers(updatedUsers);
  message.textContent = `${label} ajouté : +${points} points.`;
  renderEverything();
  renderAccountModal();
}

function setupTabs() {
  const tabLogin = document.getElementById("tabLogin");
  const tabRegister = document.getElementById("tabRegister");
  const loginForm = document.getElementById("loginForm");
  const registerForm = document.getElementById("registerForm");

  tabLogin.addEventListener("click", () => {
    tabLogin.classList.add("active");
    tabRegister.classList.remove("active");
    loginForm.classList.remove("hidden");
    registerForm.classList.add("hidden");
  });

  tabRegister.addEventListener("click", () => {
    tabRegister.classList.add("active");
    tabLogin.classList.remove("active");
    registerForm.classList.remove("hidden");
    loginForm.classList.add("hidden");
  });
}

function setupEvents() {
  document.getElementById("joinBtn").addEventListener("click", () => {
    if (getCurrentUser()) {
      renderAccountModal();
      openModal("accountModal");
    } else {
      openModal("authModal");
    }
  });

  document.getElementById("scoreBtn").addEventListener("click", () => {
    document.getElementById("scoreMessage").textContent = "";
    openModal("scoreModal");
  });

  document.querySelectorAll(".modal-close").forEach(btn => {
    btn.addEventListener("click", () => closeModal(btn.dataset.close));
  });

  document.getElementById("overlay").addEventListener("click", closeAllModals);

  document.getElementById("loginForm").addEventListener("submit", loginUser);
  document.getElementById("registerForm").addEventListener("submit", registerUser);

  document.querySelectorAll(".score-action").forEach(btn => {
    btn.addEventListener("click", () => {
      addPoints(Number(btn.dataset.points), btn.dataset.label);
    });
  });

  document.getElementById("searchForm").addEventListener("submit", event => {
    event.preventDefault();
    const query = document.getElementById("searchInput").value.trim();
    if (!query) return;
    showSearchResult(query);
  });

  document.getElementById("closeTopbar").addEventListener("click", () => {
    document.querySelector(".topbar").style.display = "none";
  });

  const footerLogin = document.getElementById("footerLoginLink");
  const footerRegister = document.getElementById("footerRegisterLink");

  footerLogin.addEventListener("click", (event) => {
    event.preventDefault();
    openModal("authModal");
    document.getElementById("tabLogin").click();
  });

  footerRegister.addEventListener("click", (event) => {
    event.preventDefault();
    openModal("authModal");
    document.getElementById("tabRegister").click();
  });
}

function renderLeaderboard() {
  const users = loadUsers()
    .filter(u => u.visible)
    .sort((a, b) => b.points - a.points)
    .slice(0, 3);

  const container = document.getElementById("leaderboard");
  if (!container) return;

  container.innerHTML = `
    <div class="top3-wrapper">
      ${users.map((user, index) => `
        <div class="top-card ${index === 0 ? "first" : ""}">
          <span class="rank">#${index + 1}</span>

          ${getAvatarMarkup(user, "top-avatar")}

          <h3>${user.name}</h3>
          <p>${user.points} pts</p>
        </div>
      `).join("")}
    </div>
  `;
}

function renderEverything() {
  updateJoinButton();
  renderFeaturedUser();
  renderProfiles();
  renderReviews();
  renderPosts();
  renderLeaderboard();
}

setupTabs();
setupEvents();
renderEverything();
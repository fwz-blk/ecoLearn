// community.js — Static version for hackathon
// ----------------------------------------------------
// ✅ No Firebase — all data local
// ✅ Keeps same modal, UI, and event flow
// ✅ 3 static eco-themed posts (appear on every reload)
// ✅ Likes/comments update locally (reset on refresh)
// ----------------------------------------------------

// -------------------------
// DOM Elements
// -------------------------
const feedGrid = document.getElementById("feedGrid");
const overlay = document.getElementById("overlay");
const postModal = document.getElementById("postModal");
const postModalClose = document.getElementById("postModalClose");
const modalImage = document.getElementById("modalImage");
const modalCaption = document.getElementById("modalCaption");
const modalLikeBtn = document.getElementById("modalLikeBtn");
const modalLikeCount = document.getElementById("modalLikeCount");
const modalCommentCount = document.getElementById("modalCommentCount");
const modalComments = document.getElementById("modalComments");
const modalCommentInput = document.getElementById("modalCommentInput");
const modalCommentPost = document.getElementById("modalCommentPost");

const composerText = document.getElementById("composerText");
const composerPhoto = document.getElementById("composerPhoto");
const composerLocation = document.getElementById("composerLocation");
const composerPostBtn = document.getElementById("composerPostBtn");
const composerPreview = document.getElementById("composerPreview");

// -------------------------
// Local Static Posts
// -------------------------
let posts = [
  {
    id: "p1",
    username: "greenwarrior",
    avatar: "images/user1.jpg",
    caption: "Community cleanup day 🌿 Everyone joined hands to make our park cleaner and greener!",
    imageurl: "images/static1.jpg",
    likes: 12,
    comments: ["Amazing!", "Wish I was there!", "So inspiring!"],
    share: 3,
    _liked: false
  },
  {
    id: "p2",
    username: "eco_friend",
    avatar: "images/user2.jpg",
    caption: "🌻 New saplings planted near the lake — let’s keep them watered and safe!",
    imageurl: "images/static2.jpg",
    likes: 9,
    comments: ["Nice work team!", "Nature loves you ❤️"],
    share: 2,
    _liked: false
  },
  {
    id: "p3",
    username: "earthlover",
    avatar: "images/user3.jpg",
    caption: "♻️ Workshop on recycling plastic waste into eco-bricks. Great turnout today!",
    imageurl: "images/static3.jpg",
    likes: 5,
    comments: ["Good job guys!", "Keep it up!"],
    share: 1,
    _liked: false
  }
];


let currentOpenPostId = null;

// -------------------------
// Render Feed
// -------------------------
function renderFeed() {
  feedGrid.innerHTML = "";
  posts.forEach(post => {
    const card = document.createElement("article");
    card.className = "post-card";
    card.dataset.id = post.id;

    const imgSrc = post.imageurl || "https://via.placeholder.com/800x600?text=Eco+Post";
    const avatarSrc = post.avatar || "https://via.placeholder.com/80?text=U";

    card.innerHTML = `
      <div class="post-header">
        <img src="${escapeHtml(avatarSrc)}" alt="User avatar" />
        <div class="username">@${escapeHtml(post.username || "unknown")}</div>
      </div>
      <img src="${escapeHtml(imgSrc)}" alt="post image" />
      <div class="post-content">
        <p class="caption">${escapeHtml(post.caption || "")}</p>
        <div class="card-meta">
          <div class="left">
            <div class="icon-btn-small like-display"><i class="fa-regular fa-heart"></i> ${post.likes || 0}</div>
            <div class="icon-btn-small"><i class="fa-regular fa-comment"></i> ${post.comments?.length || 0}</div>
          </div>
          <div class="right">${post.share || 0} ⤴</div>
        </div>
      </div>
    `;
    card.addEventListener("click", () => openPostModal(post.id));
    feedGrid.appendChild(card);
  });
}


function escapeHtml(s) {
  if (!s) return "";
  return String(s)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

// -------------------------
// Post Composer (local only)
// -------------------------
composerPhoto.addEventListener("change", (e) => {
  const f = e.target.files[0];
  if (!f) {
    composerPreview.classList.add("hidden");
    composerPreview.innerHTML = "";
    return;
  }
  const reader = new FileReader();
  reader.onload = (ev) => {
    composerPreview.classList.remove("hidden");
    composerPreview.innerHTML = `<img src="${ev.target.result}" style="width:100%;height:200px;object-fit:cover;display:block;">`;
  };
  reader.readAsDataURL(f);
});

composerPostBtn.addEventListener("click", async () => {
  const text = (composerText.value || "").trim();
  const file = composerPhoto.files[0];
  const location = (composerLocation.value || "").trim();

  if (!text && !file) {
    return alert("Write a caption or add a photo to post.");
  }

  let imageurl = "";
  if (file) {
    const reader = new FileReader();
    reader.onload = (ev) => {
      imageurl = ev.target.result;
      addLocalPost(text, imageurl, location);
    };
    reader.readAsDataURL(file);
  } else {
    addLocalPost(text, "", location);
  }
});

function addLocalPost(text, imageurl, location) {
  const newPost = {
    id: "p" + Date.now(),
    caption: text,
    imageurl: imageurl || "",
    likes: 0,
    comments: [],
    share: 0,
    _liked: false
  };
  posts.unshift(newPost);
  renderFeed();
  resetComposer();
}

function resetComposer() {
  composerText.value = "";
  composerPhoto.value = "";
  composerLocation.value = "";
  composerPreview.classList.add("hidden");
  composerPreview.innerHTML = "";
}

// -------------------------
// Modal (View Post)
// -------------------------
function openPostModal(postId) {
  const post = posts.find(p => p.id === postId);
  if (!post) return;
  currentOpenPostId = postId;

  modalImage.src = post.imageurl || "https://via.placeholder.com/800x600?text=Eco+Post";
  modalCaption.textContent = post.caption || "";
  modalLikeCount.textContent = post.likes || 0;
  modalCommentCount.textContent = post.comments?.length || 0;
  renderModalComments(post.comments || []);

  modalLikeBtn.innerHTML = post._liked
    ? `<i class="fa-solid fa-heart" style="color:#e84a5f"></i> <span>${post.likes || 0}</span>`
    : `<i class="fa-regular fa-heart"></i> <span>${post.likes || 0}</span>`;

  overlay.style.display = "block";
  postModal.style.display = "block";
  document.body.style.overflow = "hidden";
}

function closePostModal() {
  overlay.style.display = "none";
  postModal.style.display = "none";
  document.body.style.overflow = "";
  currentOpenPostId = null;
}

postModalClose?.addEventListener("click", closePostModal);
overlay.addEventListener("click", closePostModal);
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && postModal.style.display === "block") closePostModal();
});

// -------------------------
// Likes / Comments
// -------------------------
modalLikeBtn.addEventListener("click", () => {
  if (!currentOpenPostId) return;
  const post = posts.find(p => p.id === currentOpenPostId);
  if (!post) return;

  if (post._liked) {
    post._liked = false;
    post.likes = Math.max(0, post.likes - 1);
  } else {
    post._liked = true;
    post.likes++;
  }
  modalLikeCount.textContent = post.likes;
  renderFeed();
});

modalCommentPost.addEventListener("click", () => {
  const text = (modalCommentInput.value || "").trim();
  if (!text || !currentOpenPostId) return;
  const post = posts.find(p => p.id === currentOpenPostId);
  if (!post) return;

  post.comments.push(text);
  modalCommentInput.value = "";
  modalCommentCount.textContent = post.comments.length;
  renderModalComments(post.comments);
  renderFeed();
});

function renderModalComments(comments) {
  modalComments.innerHTML = "";
  if (!comments || comments.length === 0) {
    modalComments.innerHTML = `<div style="color:#666">No comments yet. Be the first to comment!</div>`;
    return;
  }
  comments.forEach(c => {
    const el = document.createElement("div");
    el.className = "comment-item";
    el.textContent = c;
    modalComments.appendChild(el);
  });
}

// -------------------------
// Init
// -------------------------
renderFeed();

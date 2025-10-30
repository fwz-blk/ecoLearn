import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const SUPABASE_URL = "https://chgyxbkgzigjtgqaknzz.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNoZ3l4YmtnemlnanRncWFrbnp6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE3MjU2OTgsImV4cCI6MjA3NzMwMTY5OH0.zFkl9TtPpt92tdtXE0MfZPtvUmlLSphWiuBZSSAHd7k";

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// ------------------
// Sample Data (same as before)
// ------------------
let discussions = [
  {
    id: 1,
    title: "Climate Change Adaptation Strategies",
    description:
      "Let's discuss innovative ways communities can adapt to changing climate patterns. Share examples from your local area.",
    instructor: "Dr. Lisa Wong",
    institution: "Environmental Sciences Institute",
    replies: 23,
    participants: 45,
    timeAgo: "30 minutes ago",
    essays: [
      {
        author: "Sarah Johnson",
        userId: "STU2024001",
        content:
          "Climate change adaptation requires a multi-faceted approach that combines traditional knowledge with modern technology. In my community, we've implemented rainwater harvesting systems that have proven invaluable during drought periods. Additionally, urban green spaces are being redesigned to serve as both recreational areas and flood management systems. The key is to engage local stakeholders early in the planning process to ensure solutions are culturally appropriate and sustainable.",
        timeAgo: "15 minutes ago",
      },
      {
        author: "Michael Chen",
        userId: "STU2024012",
        content:
          "I've been researching climate-resilient agriculture practices, and the results are promising. Farmers in coastal regions are adopting salt-tolerant crop varieties and modifying planting schedules to account for changing precipitation patterns. Community-supported agriculture (CSA) programs are also helping to build local food security while reducing transportation emissions. Education plays a crucial role - when communities understand the science behind climate change, they're more motivated to take action.",
        timeAgo: "1 hour ago",
      },
    ],
  },
  {
    id: 2,
    title: "Renewable Energy in Developing Countries",
    description:
      "How can renewable energy solutions be implemented effectively in developing regions? What are the main challenges and opportunities?",
    instructor: "Prof. James Miller",
    institution: "Sustainability Academy",
    replies: 18,
    participants: 32,
    timeAgo: "2 hours ago",
    essays: [
      {
        author: "Priya Sharma",
        userId: "STU2024023",
        content:
          "Renewable energy adoption in developing countries faces unique challenges including infrastructure limitations, initial capital costs, and technical expertise gaps. However, the opportunities are immense. Solar micro-grids have transformed rural communities by providing reliable electricity for the first time. In my region, solar-powered water pumps have revolutionized agriculture, allowing farmers to irrigate crops efficiently. The key is to develop financing models that make renewable energy accessible, such as pay-as-you-go systems that align with local income patterns.",
        timeAgo: "30 minutes ago",
      },
    ],
  },
  {
    id: 3,
    title: "Biodiversity Conservation Projects",
    description:
      "Share your local biodiversity conservation projects and discuss effective strategies for wildlife protection.",
    instructor: "Ms. Elena Rodriguez",
    institution: "Green Tech High",
    replies: 15,
    participants: 28,
    timeAgo: "5 hours ago",
    essays: [
      {
        author: "David Martinez",
        userId: "STU2024034",
        content:
          "Our school partnered with local conservation groups to establish a butterfly garden that serves as both an educational resource and a habitat for native pollinators. We've documented over 30 species of butterflies and observed significant increases in bee populations. The project has taught us that even small-scale efforts can have meaningful impacts. Creating wildlife corridors between urban green spaces is another strategy we're exploring to help species adapt to habitat fragmentation.",
        timeAgo: "2 hours ago",
      },
      {
        author: "Emma Thompson",
        userId: "STU2024045",
        content:
          "I'm involved in a wetland restoration project that has shown remarkable results. By removing invasive species and replanting native vegetation, we've seen the return of several bird species that hadn't been observed in the area for decades. Community involvement is essential - we organize monthly volunteer days where people of all ages participate in planting and monitoring activities. This hands-on experience creates environmental stewards who continue advocating for conservation long after the project ends.",
        timeAgo: "3 hours ago",
      },
    ],
  },
];

// ------------------
// DOM Elements
// ------------------
const discussionsContainer = document.getElementById("discussionsContainer");
const forumListView = document.getElementById("forum-list-view");
const threadView = document.getElementById("thread-view");
const threadHeader = document.getElementById("threadHeader");
const essaysContainer = document.getElementById("essaysContainer");
const backBtn = document.getElementById("backBtn");
const writeEssayBtn = document.getElementById("writeEssayBtn");
const overlay = document.getElementById("overlay");
const essayModal = document.getElementById("essayModal");
const closeModalBtn = document.getElementById("closeModalBtn");
const essayForm = document.getElementById("essayForm");
const essayContent = document.getElementById("essayContent");
const wordCount = document.getElementById("wordCount");
const authorInput = document.getElementById("authorName");
const userIdInput = document.getElementById("userId");

let currentDiscussionId = null;

// ------------------
// Init
// ------------------
function initForum() {
  renderDiscussions();
  attachEventListeners();
}

// ------------------
// Render / UI helpers
// ------------------
function renderDiscussions() {
  discussionsContainer.innerHTML = "";
  discussions.forEach((d) =>
    discussionsContainer.appendChild(createDiscussionCard(d))
  );
}

function createDiscussionCard(discussion) {
  const card = document.createElement("div");
  card.className = "discussion-card";
  card.innerHTML = `
    <h3>${discussion.title}</h3>
    <p class="description">${discussion.description}</p>
    <div class="discussion-meta">
      <span class="instructor-name">${discussion.instructor}</span>
      <span class="institution">• ${discussion.institution}</span>
    </div>
    <div class="discussion-stats">
      <div class="stat-item"><i class="fas fa-comment"></i><span>${discussion.replies} replies</span></div>
      <div class="stat-item"><i class="fas fa-users"></i><span>${discussion.participants} participants</span></div>
      <div class="stat-item"><i class="fas fa-clock"></i><span>${discussion.timeAgo}</span></div>
    </div>
    <button class="join-discussion-btn">Join Discussion</button>
  `;
  card
    .querySelector(".join-discussion-btn")
    .addEventListener("click", () => openDiscussion(discussion.id));
  return card;
}

function openDiscussion(discussionId) {
  currentDiscussionId = discussionId;
  const d = discussions.find((x) => x.id === discussionId);
  if (!d) return;
  threadHeader.innerHTML = `
    <h2>${d.title}</h2>
    <p class="description">${d.description}</p>
    <div class="discussion-meta">
      <span class="instructor-name">${d.instructor}</span>
      <span class="institution">• ${d.institution}</span>
    </div>
    <div class="discussion-stats">
      <div class="stat-item"><i class="fas fa-comment"></i><span>${d.replies} replies</span></div>
      <div class="stat-item"><i class="fas fa-users"></i><span>${d.participants} participants</span></div>
    </div>
  `;
  renderEssays(d.essays);
  forumListView.style.display = "none";
  threadView.style.display = "block";
  window.scrollTo(0, 0);
}

function renderEssays(essays) {
  essaysContainer.innerHTML = essays.length
    ? essays.map((e) => createEssayCard(e).outerHTML).join("")
    : '<p style="text-align:center;color:#666;padding:40px;font-size:1.1rem;">No essays yet. Be the first to share your thoughts!</p>';
}

function createEssayCard(e) {
  // avatar is a default Font Awesome icon inside a circle (replaceable by real image later)
  const card = document.createElement("div");
  card.className = "essay-card";
  card.innerHTML = `
    <div class="essay-header">
      <div class="essay-author-info">
        <div class="essay-avatar" title="${e.author}">
          <i class="fas fa-user"></i>
        </div>
        <div>
          <span class="essay-author">${e.author}</span><br/>
          <span class="essay-userid">ID: ${e.userId}</span>
        </div>
      </div>
      <span class="essay-time">${e.timeAgo}</span>
    </div>
    <p class="essay-content">${escapeHtml(e.content)}</p>
  `;
  return card;
}

// Prevent raw HTML injection in essays
function escapeHtml(unsafe) {
  return unsafe
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function backToForum() {
  forumListView.style.display = "block";
  threadView.style.display = "none";
  currentDiscussionId = null;
  window.scrollTo(0, 0);
}

// ------------------
// Modal logic (smooth open/close + scroll lock)
// ------------------
function openEssayModal() {
  if (!currentDiscussionId) {
    alert("Open a discussion first to write an essay.");
    return;
  }
  overlay.classList.add("active");
  essayModal.classList.add("active");
  essayModal.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden"; // lock background scroll
  // focus first field for convenience
  setTimeout(() => authorInput.focus(), 220);
}

function closeEssayModal() {
  // add a small delay to allow CSS transition if needed
  essayModal.classList.remove("active");
  overlay.classList.remove("active");
  essayModal.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "auto";
  // reset form after short delay (so UI doesn't jump while closing animation runs)
  setTimeout(() => {
    essayForm.reset();
    updateWordCount();
  }, 260);
}

// overlay and close button
overlay.addEventListener("click", closeEssayModal);
closeModalBtn.addEventListener("click", closeEssayModal);

// close when clicking outside modal-content (also works if modal has padding)
essayModal.addEventListener("click", (e) => {
  if (e.target === essayModal) closeEssayModal();
});

// handle ESC key to close modal
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && essayModal.classList.contains("active")) {
    closeEssayModal();
  }
});

// ------------------
// Word count + submit
// ------------------
function updateWordCount() {
  const text = essayContent.value.trim();
  const words = text === "" ? 0 : text.split(/\s+/).length;
  wordCount.textContent = `${words} words`;
}

function submitEssay(e) {
  e.preventDefault();
  const authorName = authorInput.value.trim();
  const userId = userIdInput.value.trim();
  const content = essayContent.value.trim();
  if (!authorName || !userId || !content) {
    alert("Please fill in all fields");
    return;
  }
  const d = discussions.find((x) => x.id === currentDiscussionId);
  if (!d) {
    alert("No discussion open. Please open a discussion first.");
    return;
  }
  // Add essay at top
  d.essays.unshift({
    author: authorName,
    userId,
    content,
    timeAgo: "Just now",
  });
  d.replies++;
  renderEssays(d.essays);
  closeEssayModal();
  alert("Essay submitted successfully! 🌱");
}

// ------------------
// Event listeners
// ------------------
function attachEventListeners() {
  backBtn.addEventListener("click", backToForum);
  writeEssayBtn.addEventListener("click", openEssayModal);
  essayForm.addEventListener("submit", submitEssay);
  essayContent.addEventListener("input", updateWordCount);

  document.querySelectorAll(".tab-btn").forEach((btn) => {
    btn.addEventListener("click", function () {
      if (this.dataset.tab === "student-posts") {
        alert("Student Posts feature coming soon! 📸");
      }
    });
  });
}

document.addEventListener("DOMContentLoaded", initForum);

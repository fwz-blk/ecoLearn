    import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

    // ---------------------------------
    // 1️⃣ SUPABASE INITIALIZATION
    // ---------------------------------
    const SUPABASE_URL = "https://chgyxbkgzigjtgqaknzz.supabase.co";
    const SUPABASE_ANON_KEY =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNoZ3l4YmtnemlnanRncWFrbnp6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE3MjU2OTgsImV4cCI6MjA3NzMwMTY5OH0.zFkl9TtPpt92tdtXE0MfZPtvUmlLSphWiuBZSSAHd7k";

    const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
        
    // ---------------------------------
    // 2️⃣ DOM ELEMENTS
    // ---------------------------------
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
    let discussions = []; // now fetched dynamically

    // ---------------------------------
    // 3️⃣ INIT
    // ---------------------------------
    document.addEventListener("DOMContentLoaded", initForum);

    async function initForum() {
    attachEventListeners();
    await loadDiscussions();
    }

    // ---------------------------------
    // 4️⃣ LOAD DISCUSSIONS (threads)
    // ---------------------------------
    async function loadDiscussions() {
    discussionsContainer.innerHTML = `<p class="loading">Loading discussions...</p>`;
    const { data, error } = await supabase
        .from("discussion_threads")
        .select("*")
        .order("created_at", { ascending: false });

    if (error) {
        console.error("Error loading discussions:", error);
        discussionsContainer.innerHTML =
        "<p style='color:red;text-align:center;'>Error loading discussions</p>";
        return;
    }

    discussions = data;
    if (discussions.length === 0) {
        discussionsContainer.innerHTML =
        "<p style='text-align:center;color:#666;'>No discussions yet. Start one!</p>";
    } else {
        discussionsContainer.innerHTML = "";
        discussions.forEach((d) => {
        discussionsContainer.appendChild(createDiscussionCard(d));
        });
    }
    }

    // ---------------------------------
    // 5️⃣ CREATE DISCUSSION CARD
    // ---------------------------------
    function createDiscussionCard(discussion) {
    const card = document.createElement("div");
    card.className = "discussion-card";
    card.innerHTML = `
        <h3>${discussion.title}</h3>
        <p class="description">${discussion.description || ""}</p>
        <div class="discussion-meta">
        <span class="instructor-name">${discussion.created_by || "Anonymous"}</span>
        </div>
        <div class="discussion-stats">
        <div class="stat-item"><i class="fas fa-clock"></i><span>${timeAgo(
            discussion.created_at
        )}</span></div>
        </div>
        <button class="join-discussion-btn">Join Discussion</button>
    `;
    card
        .querySelector(".join-discussion-btn")
        .addEventListener("click", () => openDiscussion(discussion));
    return card;
    }

    // ---------------------------------
    // 6️⃣ OPEN DISCUSSION + LOAD ESSAYS
    // ---------------------------------
    async function openDiscussion(discussion) {
    currentDiscussionId = discussion.id;

    threadHeader.innerHTML = `
        <h2>${discussion.title}</h2>
        <p class="description">${discussion.description || ""}</p>
        <div class="discussion-meta">
        <span class="instructor-name">${discussion.created_by || "Anonymous"}</span>
        </div>
        <div class="discussion-stats">
        <div class="stat-item"><i class="fas fa-clock"></i><span>${timeAgo(
            discussion.created_at
        )}</span></div>
        </div>
    `;

    await loadEssays(discussion.id);

    forumListView.style.display = "none";
    threadView.style.display = "block";
    window.scrollTo(0, 0);
    }

    async function loadEssays(threadId) {
    essaysContainer.innerHTML = `<p class="loading">Loading essays...</p>`;
    const { data, error } = await supabase
        .from("discussion_essays")
        .select("*")
        .eq("thread_id", threadId)
        .order("created_at", { ascending: true });

    if (error) {
        console.error("Error loading essays:", error);
        essaysContainer.innerHTML =
        "<p style='color:red;text-align:center;'>Error loading essays</p>";
        return;
    }

    if (data.length === 0) {
        essaysContainer.innerHTML =
        '<p style="text-align:center;color:#666;padding:40px;font-size:1.1rem;">No essays yet. Be the first to share your thoughts!</p>';
    } else {
        essaysContainer.innerHTML = data
        .map((e) => createEssayCard(e).outerHTML)
        .join("");
    }
    }

    // ---------------------------------
    // 7️⃣ CREATE ESSAY CARD
    // ---------------------------------
    function createEssayCard(e) {
    const card = document.createElement("div");
    card.className = "essay-card";
    card.innerHTML = `
        <div class="essay-header">
        <div class="essay-author-info">
            <div class="essay-avatar">
            <img src="${
                e.avatar_url ||
                "https://cdn-icons-png.flaticon.com/512/149/149071.png"
            }" alt="pfp" />
            </div>
            <div>
            <span class="essay-author">${e.author_name}</span><br/>
            <span class="essay-userid">ID: ${e.user_id}</span>
            </div>
        </div>
        <span class="essay-time">${timeAgo(e.created_at)}</span>
        </div>
        <p class="essay-content">${escapeHtml(e.content)}</p>
    `;
    return card;
    }

    // ---------------------------------
    // 8️⃣ SUBMIT ESSAY
    // ---------------------------------
    async function submitEssay(e) {
    e.preventDefault();
    const authorName = authorInput.value.trim();
    const userId = userIdInput.value.trim();
    const content = essayContent.value.trim();

    if (!authorName || !userId || !content) {
        alert("Please fill in all fields");
        return;
    }

    const { error } = await supabase.from("discussion_essays").insert([
        {
        thread_id: currentDiscussionId,
        author_name: authorName,
        user_id: userId,
        content,
        },
    ]);

    if (error) {
        console.error(error);
        alert("Error submitting essay.");
        return;
    }

    closeEssayModal();
    await loadEssays(currentDiscussionId);
    alert("Essay submitted successfully! 🌱");
    }

    // ---------------------------------
    // 9️⃣ UTILITIES + HELPERS
    // ---------------------------------
    function timeAgo(dateString) {
    const seconds = Math.floor((new Date() - new Date(dateString)) / 1000);
    const intervals = [
        { label: "year", seconds: 31536000 },
        { label: "month", seconds: 2592000 },
        { label: "day", seconds: 86400 },
        { label: "hour", seconds: 3600 },
        { label: "minute", seconds: 60 },
    ];
    for (const interval of intervals) {
        const count = Math.floor(seconds / interval.seconds);
        if (count >= 1) return `${count} ${interval.label}${count > 1 ? "s" : ""} ago`;
    }
    return "Just now";
    }

    function escapeHtml(unsafe) {
    return unsafe
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
    }

    // ---------------------------------
    // 🔟 MODAL + EVENTS
    // ---------------------------------
    function openEssayModal() {
    if (!currentDiscussionId) {
        alert("Open a discussion first to write an essay.");
        return;
    }
    overlay.classList.add("active");
    essayModal.classList.add("active");
    essayModal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    setTimeout(() => authorInput.focus(), 200);
    }

    function closeEssayModal() {
    essayModal.classList.remove("active");
    overlay.classList.remove("active");
    essayModal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "auto";
    setTimeout(() => {
        essayForm.reset();
        updateWordCount();
    }, 200);
    }

    function backToForum() {
    forumListView.style.display = "block";
    threadView.style.display = "none";
    currentDiscussionId = null;
    window.scrollTo(0, 0);
    }

    function updateWordCount() {
    const text = essayContent.value.trim();
    const words = text === "" ? 0 : text.split(/\s+/).length;
    wordCount.textContent = `${words} words`;
    }

    function attachEventListeners() {
    backBtn.addEventListener("click", backToForum);
    writeEssayBtn.addEventListener("click", openEssayModal);
    essayForm.addEventListener("submit", submitEssay);
    essayContent.addEventListener("input", updateWordCount);
    overlay.addEventListener("click", closeEssayModal);
    closeModalBtn.addEventListener("click", closeEssayModal);
    essayModal.addEventListener("click", (e) => {
        if (e.target === essayModal) closeEssayModal();
    });
    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && essayModal.classList.contains("active"))
        closeEssayModal();
    });
    }

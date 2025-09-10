const API = "/api/notes";
const list = document.getElementById("list");
const form = document.getElementById("note-form");
const titleInput = document.getElementById("title");
const contentInput = document.getElementById("content");
const userId = "demo"; // まずは固定。認証導入後にトークンから取得へ

async function fetchNotes() {
  const res = await fetch(`${API}?userId=${encodeURIComponent(userId)}`);
  const notes = await res.json();
  render(notes);
}

function render(notes) {
  list.innerHTML = "";
  notes.forEach(n => {
    const li = document.createElement("li");
    li.className = "note";
    li.innerHTML = `
      <h3>${escapeHtml(n.title || "(無題)")}</h3>
      <div>${escapeHtml(n.content || "")}</div>
      <small>${new Date(n.updatedAt || n.createdAt).toLocaleString()}</small>
      <div class="note-actions">
        <button data-act="edit" data-id="${n.id}">編集</button>
        <button data-act="delete" data-id="${n.id}">削除</button>
      </div>
    `;
    list.appendChild(li);
  });
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const body = {
    title: titleInput.value.trim(),
    content: contentInput.value.trim(),
    userId
  };
  await fetch(API, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body)
  });
  titleInput.value = "";
  contentInput.value = "";
  fetchNotes();
});

list.addEventListener("click", async (e) => {
  const btn = e.target.closest("button");
  if (!btn) return;
  const id = btn.dataset.id;
  const act = btn.dataset.act;

  if (act === "delete") {
    await fetch(`${API}/${id}?userId=${encodeURIComponent(userId)}`, { method: "DELETE" });
    fetchNotes();
  } else if (act === "edit") {
    const newTitle = prompt("新しいタイトル");
    const newContent = prompt("新しい内容");
    if (newTitle !== null || newContent !== null) {
      await fetch(`${API}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: newTitle, content: newContent, userId })
      });
      fetchNotes();
    }
  }
});

function escapeHtml(s) {
  return (s ?? "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" }[c]));
}

fetchNotes();

// 変数宣言&初期化
let todos = []; // タスクを管理する配列
let currentFilter = "all"; // 現在のフィルター状態
let editingId = null; // 編集中のタスクID

// HTML要素
let todoInput, addBtn, todoList, filterBtns, clearCompletedBtn, clearAllBtn;
let totalTasksEl, completedTasksEl, activeTasksEl;

// HTMLの解析が終了したときに実行される処理
document.addEventListener("DOMContentLoaded", () => {
  // HTML要素を取得して、変数に保存する
  todoInput = document.getElementById("todoInput");
  addBtn = document.getElementById("addBtn");
  todoList = document.getElementById("todoList");
  filterBtns = document.querySelectorAll(".filter-btn");
  clearCompletedBtn = document.getElementById("clearCompleted");
  clearAllBtn = document.getElementById("clearAll");
  totalTasksEl = document.getElementById("totalTasks");
  completedTasksEl = document.getElementById("completedTasks");
  activeTasksEl = document.getElementById("activeTasks");
  addBtn.addEventListener("click", addTodo); // 「+」ボタンがクリックされたらaddTodoメソッドを呼び出す
  todoInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") addTodo();
    todos = loadTodos();
    renderTodos();
});


  
});
// タスク追加
function addTodo() {
  const text = todoInput.value.trim(); // 入力されたテキストを取得し、前後の空白を削除
  if (!text) return; // テキストが空なら何もしない

  // 新しいタスクのデータを作成
  const todo = {
    id: Date.now(), // ユニークなIDとして現在時刻のタイムスタンプを使用
    text: text,
    completed: false, // 最初は未完了
  };

  todos.push(todo); // 配列にタスクを追加
  saveTodos();
  renderTodos(); // タスクを再描画
  todoInput.value = ""; // 入力欄を空にする
}

// タスク完了切替
function renderTodos() {
  todoList.innerHTML = todos
    .map(
      (todo) => `
        <div class="todo-item ${
          todo.completed ? "completed" : ""
        }" data-todo-id="${todo.id}">
            <input type="checkbox"
                   class="todo-checkbox"
                   ${todo.completed ? "checked" : ""}
                   onchange="toggleTodo(${todo.id})">

            <span class="todo-text">${todo.text}</span>

            <div class="todo-actions">
                <button class="delete-btn" onclick="deleteTodo(${todo.id})">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        </div>
    `
    )
    .join("");
}

// LocalStorageへの保存
function saveTodos() {
  localStorage.setItem("todos", JSON.stringify(todos)); // todos配列をJSON形式の文字列に変換してlocalStorageに保存
}

// LocalStorageからの読み込み
function loadTodos() {
  const todos = localStorage.getItem("todos"); // localStorageからデータを読み込む
  return todos ? JSON.parse(todos) : []; // JSONオブジェクトに変換して返す
}
// タスク完了切替
function toggleTodo(id) {
  const todo = todos.find((t) => t.id === id); // IDでタスクを検索
  if (todo) {
    todo.completed = !todo.completed; // completedプロパティを反転させる
    saveTodos();
    renderTodos();
  }
}

// タスク削除
function deleteTodo(id) {
  // 確認ダイアログを表示
  if (confirm("このタスクを削除しますか？")) {
    todos = todos.filter((t) => t.id !== id); // IDが一致しないタスクだけを残す
    saveTodos();
    renderTodos();
  }
}
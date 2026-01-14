let todos = [];
let editingId = null;

function loadTodos() {
    const stored = JSON.parse(localStorage.getItem('todos') || '[]');
    todos = stored;
    renderTodos();
}

function saveTodos() {
    localStorage.setItem('todos', JSON.stringify(todos));
}

function renderTodos() {
    const list = document.getElementById('todoList');
    const deleteAllBtn = document.getElementById('deleteAllBtn');

    if (todos.length === 0) {
        list.innerHTML = `
                    <div class="empty-state">
                        <svg viewBox="0 0 24 24" fill="currentColor">
                            <path d="M9 2C8.44772 2 8 2.44772 8 3V4H6C4.89543 4 4 4.89543 4 6V20C4 21.1046 4.89543 22 6 22H18C19.1046 22 20 21.1046 20 20V6C20 4.89543 19.1046 4 18 4H16V3C16 2.44772 15.5523 2 15 2H9ZM10 4H14V5H10V4ZM6 6H18V20H6V6ZM8 9C8 8.44772 8.44772 8 9 8H15C15.5523 8 16 8.44772 16 9C16 9.55228 15.5523 10 15 10H9C8.44772 10 8 9.55228 8 9ZM8 13C8 12.4477 8.44772 12 9 12H15C15.5523 12 16 12.4477 16 13C16 13.5523 15.5523 14 15 14H9C8.44772 14 8 13.5523 8 13Z"/>
                        </svg>
                        <p>No todos yet. Add one to get started!</p>
                    </div>
                `;
        deleteAllBtn.disabled = true;
    } else {
        list.innerHTML = '';
        todos.forEach(todo => {
            const li = document.createElement('li');
            li.className = 'todo-item';

            const span = document.createElement('span');
            span.className = 'todo-text';
            span.textContent = todo.text;

            const actionsDiv = document.createElement('div');
            actionsDiv.className = 'todo-actions';

            const editBtn = document.createElement('button');
            editBtn.className = 'btn btn-edit';
            editBtn.textContent = 'Edit';
            editBtn.onclick = () => editTodo(todo.id);

            const deleteBtn = document.createElement('button');
            deleteBtn.className = 'btn btn-delete';
            deleteBtn.textContent = 'Delete';
            deleteBtn.onclick = () => deleteTodo(todo.id);

            actionsDiv.appendChild(editBtn);
            actionsDiv.appendChild(deleteBtn);
            li.appendChild(span);
            li.appendChild(actionsDiv);
            list.appendChild(li);
        });
        deleteAllBtn.disabled = false;
    }
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function addTodo() {
    const input = document.getElementById('todoInput');
    const text = input.value.trim();

    if (!text) {
        alert('Please enter a todo item!');
        return;
    }

    if (editingId !== null) {
        const todo = todos.find(t => t.id === editingId);
        if (todo) {
            todo.text = text;
        }
        editingId = null;
        document.querySelector('.btn-add').textContent = 'Add';
    } else {
        const newTodo = {
            id: Date.now(),
            text: text
        };
        todos.push(newTodo);
    }

    input.value = '';
    saveTodos();
    renderTodos();
}

function editTodo(id) {
    const todo = todos.find(t => t.id === id);
    if (todo) {
        document.getElementById('todoInput').value = todo.text;
        document.getElementById('todoInput').focus();
        editingId = id;
        document.querySelector('.btn-add').textContent = 'Update';
    }
}

function deleteTodo(id) {
    if (confirm('Are you sure you want to delete this todo?')) {
        todos = todos.filter(t => t.id !== id);
        if (editingId === id) {
            editingId = null;
            document.getElementById('todoInput').value = '';
            document.querySelector('.btn-add').textContent = 'Add';
        }
        saveTodos();
        renderTodos();
    }
}

function deleteAll() {
    if (confirm('Are you sure you want to delete all todos?')) {
        todos = [];
        editingId = null;
        document.getElementById('todoInput').value = '';
        document.querySelector('.btn-add').textContent = 'Add';
        saveTodos();
        renderTodos();
    }
}

document.getElementById('todoInput').addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        addTodo();
    }
});

loadTodos();

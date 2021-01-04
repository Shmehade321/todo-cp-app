// Todo Class: Represent individual todo item
class Todo {
  constructor(id, title) {
    this.id = id;
    this.title = title;
  }
}

// UI class: Handle UI Tasks
class UI {
  static displayTodoItems() {
    document.querySelector("#todo").focus();
    // Get todos from store
    const todos = Store.getTodos();

    todos.forEach((todo) => UI.addTodoToList(todo));
  }

  static addTodoToList(todo) {
    const list = document.querySelector(".todo-list");
    const row = document.createElement("ul");
    // Add CSS classes
    row.classList.add("list-group");
    row.innerHTML = `
            <li
            class="d-flex justify-content-between align-items-center list-group-item"
            onmouseover="ShowButtons(this);"
            onmouseout="HideButtons(this);"
            >
            <div class="d-flex justify-content-between align-items-center key-${
              todo.id
            }">
            <h5 class="mb-1">${todo.title}</h5>
            <small class="ml-2">${moment(todo.id)
              .startOf("second")
              .fromNow()}</small>
            </div>
            <span>
            <button
                class="btn btn-outline-success btn-sm btn-circle fade edit-button"
                onclick="EditTodo(${todo.id}, this);"
            >
                <i class="fas fa-pencil-alt"></i></button
            ><button
                class="btn btn-outline-danger btn-sm ml-1 btn-circle fade delete-button"
                onclick="DeleteTodo(${todo.id});"
            >
                <i class="fas fa-trash"></i>
            </button>
            </span>
        `;
    list.appendChild(row);
  }

  static editTodo(id, title) {
    document.querySelector("#todo").value = title;
    document.querySelector("#todo-id").value = id;
    document.querySelector(".save-icon").classList.remove("fa-save");
    document.querySelector(".save-icon").classList.add("fa-edit");
    document.querySelector("#todo").focus();
  }

  static updateTodo(id, modifiedTitle, modifiedId) {
    const liEle = document.querySelector(`.key-${id}`).children;
    const title = liEle[0].innerHTML;
    const timestamp = liEle[1].innerHTML;
    title.innerHTML = modifiedTitle;
    timestamp.innerHTML = moment(modifiedId).startOf("second").fromNow();
  }

  static deleteTodo(id) {}

  static showAlert(message, className) {
    const div = document.createElement("div");
    div.className = `alert alert-${className}`;
    div.appendChild(document.createTextNode(message));
    const container = document.querySelector(".col-md-12");
    const form = document.querySelector(".todo-form");
    container.insertBefore(div, form);
    // Disappear in 3 seconds
    setTimeout(() => document.querySelector(".alert").remove(), 3000);
  }

  static validate() {
    if (
      !document.querySelector(".todo-form").classList.contains("was-validated")
    ) {
      document.querySelector(".todo-form").classList.add("was-validated");
    }

    if (
      !document.querySelector(".input-group").classList.contains("is-invalid")
    ) {
      document.querySelector(".input-group").classList.add("is-invalid");
    }
  }

  static resetForm() {
    document.querySelector("#todo").value = "";
    document.querySelector("#todo").focus();
    if (
      document.querySelector(".todo-form").classList.contains("was-validated")
    ) {
      document.querySelector(".todo-form").classList.remove("was-validated");
    }

    if (
      document.querySelector(".input-group").classList.contains("is-invalid")
    ) {
      document.querySelector(".input-group").classList.remove("is-invalid");
    }
  }
}

// Store Class: Handle Storage
class Store {
  static getTodos() {
    let todos;
    if (localStorage.getItem("todos") === null) {
      todos = [];
    } else {
      todos = JSON.parse(localStorage.getItem("todos"));
    }

    return todos;
  }

  static addTodo(todo) {
    const todos = Store.getTodos();
    todos.push(todo);
    localStorage.setItem("todos", JSON.stringify(todos));
  }

  static editTodo(id) {
    const todos = Store.getTodos();
    todos.forEach((todo) => {
      if (todo.id === id) {
        UI.editTodo(todo.id, todo.title);
      }
    });
  }

  static updateTodo(id, title, updatedId) {
    const todos = Store.getTodos();
    todos.forEach((todo, index) => {
      if (todo.id === id) {
        todos.splice(index, 1);
      }
    });
    todos.push({ id: updatedId, title });
    localStorage.setItem("todos", JSON.stringify(todos));
  }

  static deleteTodo(id) {
    const todos = Store.getTodos();
    todos.forEach((todo, index) => {
      if (todo.id === id) {
        todos.splice(index, 1);
      }
    });
    localStorage.setItem("todos", JSON.stringify(todos));
  }
}

// Event: Display Todos
document.addEventListener("DOMContentLoaded", UI.displayTodoItems);

// Event: Cleanup validation
const handleChange = (e) => {
  let title = document.querySelector("#todo").value;
  if (title.length > 0) {
    document.querySelector(".invalid-feedback").classList.add("invisible");
  } else {
    document.querySelector(".invalid-feedback").classList.remove("invisible");
    document.querySelector(".invalid-feedback").classList.add("visible");
  }
};

// Event: Add a Todo
document.querySelector(".todo-form").addEventListener("submit", (e) => {
  // Prevent actual submit
  e.preventDefault();

  const id = Date.now();
  const title = document.querySelector("#todo").value;

  // Form Validation
  if (title === "") {
    UI.validate();
  } else {
    const updateId = document.querySelector("#todo-id").value;
    if (updateId > 0) {
      //Update Todo

      //Update to store
      Store.updateTodo(updateId, title, id);

      //Update to UI
      UI.updateTodo(updateId, title, id);

      // Reset Form
      UI.resetForm();

      UI.showAlert("Successfully Updated", "success");
    } else {
      // Insert Todo
      // Instatiate Todo
      const todo = new Todo(id, title);

      //Add todo to UI
      UI.addTodoToList(todo);

      // Add todo to Store
      Store.addTodo(todo);

      // Reset Form
      UI.resetForm();

      UI.showAlert(`${title} Added`, "success");
    }
  }
});

// Event: Edit a Todo
EditTodo = (id, e) => {
  Store.editTodo(id);
};

// Show/Hide buttons on mouse hover
const ShowButtons = (e) => {
  let buttons = e.querySelectorAll("button");
  for (let i = 0; i < buttons.length; i++) {
    buttons[i].classList.add("show");
  }
};

const HideButtons = (e) => {
  let buttons = e.querySelectorAll("button");
  for (let i = 0; i < buttons.length; i++) {
    buttons[i].classList.remove("show");
  }
};

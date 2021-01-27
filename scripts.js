// Todo Class: Represent individual todo item
class Todo {
  constructor(id, title, completed) {
    this.id = id;
    this.title = title;
    this.completed = completed;
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

  static addTodoToList(todo, activeFadeClass) {
    const list = document.querySelector(".todo-list");
    const row = document.createElement("ul");
    // Add CSS classes
    row.classList.add("list-group");
    //  <span class='datetime-span text-secondary'><small>Added ${moment(
    //   todo.id
    //   ).fromNow()}</small></span>
    row.innerHTML = `
            <li
            class="d-flex justify-content-between align-items-center ${
              activeFadeClass ? "todo-fade-in active" : false
            } list-group-item todo-list-items"
            onmouseover="ShowButtons(this);"
            onmouseout="HideButtons(this);"
            data-aos="fade-left"
            data-aos-duration="400"
            >
            <div class="d-flex justify-content-between align-items-center w-100 key-${
              todo.id
            }">
            <div class="form-check">
              <input class="form-check-input completed-checkbox-${
                todo.id
              }" type="checkbox" ${
      todo.completed === 1 && "disabled checked"
    } value="${todo.completed ? todo.completed : 0}" onchange="TodoCompleted('${
      todo.id
    }', '${todo.title}');">
              <label class="form-check-label-${todo.id} ${
      todo.completed === 1 && "todo-completed"
    }" for="completed">
                ${todo.title}
              </label>
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
            </div>
            </li>
        `;
    list.prepend(row);
  }

  static editTodo(id, title, completed) {
    document.querySelector("#todo").value = title;
    document.querySelector("#todo-id").value = id;
    document.querySelector("#todo-completed").value = completed;
    document.querySelector(".save-icon").classList.remove("fa-save");
    document.querySelector(".save-icon").classList.add("fa-edit");
    document.querySelector(".save-btn-text").innerHTML = "Edit Todo";
    document.querySelector("#todo").focus();
  }

  static updateTodo(id, title, completed) {
    const liEle = document.querySelector(`.key-${id}`).children;
    liEle[0].children[0].value = completed; // Update checkbox value
    liEle[0].children[1].innerHTML = title; // Update text of todo item
  }

  static deleteTodo(id) {
    if (confirm("Do you want to delete todo?")) {
      document.querySelector(`.key-${id}`).parentElement.remove();

      //Remove from Store
      Store.deleteTodo(id);

      //Show alert
      UI.showAlert("Successfully Deleted", "success");
    }
  }

  static completeTodo(id) {
    document
      .querySelector(`.form-check-label-${id}`)
      .classList.add("todo-completed");
    document
      .querySelector(`.key-${id}`)
      .querySelector(".edit-button")
      .classList.remove("show");
    $(`.completed-checkbox-${id}`).attr("disabled", true);
    $(`.completed-checkbox-${id}`).attr("checked", "checked");
    $(`.completed-checkbox-${id}`).attr("value", 1);
  }

  static showAlert(message, className) {
    const div = document.createElement("div");
    div.className = `alert alert-${className}`;
    div.appendChild(document.createTextNode(message));
    const container = document.querySelector(".col-md-12");
    const form = document.querySelector(".todo-form");
    container.insertBefore(div, form);
    // Disappear in 3 seconds
    setTimeout(() => {
      document.querySelector(".alert").remove();
      if (
        document.querySelector(".todo-list-items").classList.contains("active")
      ) {
        document.querySelector(".todo-list-items").classList.remove("active");
        document
          .querySelector(".todo-list-items")
          .classList.remove("todo-fade-in");
      }
    }, 3000);
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
        UI.editTodo(todo.id, todo.title, todo.completed);
      }
    });
  }

  static updateTodo(id, title, completed) {
    const todos = Store.getTodos();
    todos.forEach((todo, index) => {
      if (todo.id === id) {
        const updatedTodo = {
          id,
          title,
          completed,
        };
        todos.splice(index, 1, updatedTodo);
      }
    });
    localStorage.removeItem("todos");
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

  static completeTodo(id, title) {
    const todos = Store.getTodos();
    todos.forEach((todo, index) => {
      if (todo.id === id) {
        const completedTodo = {
          id,
          title,
          completed: 1,
        };
        todos.splice(index, 1, completedTodo);
      }
    });
    localStorage.removeItem("todos");
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
  const completed = 0;

  // Form Validation
  if (title === "") {
    UI.validate();
  } else {
    const updateId = parseInt(document.querySelector("#todo-id").value);

    if (updateId > 0) {
      //Update Todo
      const updateCompleted = parseInt(
        document.querySelector(`.completed-checkbox-${updateId}`).value
      );

      //Update to store
      Store.updateTodo(updateId, title, updateCompleted);

      //Update to UI
      UI.updateTodo(updateId, title, updateCompleted);

      // Reset Form
      UI.resetForm();

      UI.showAlert("Successfully Updated", "success");
    } else {
      // Insert Todo
      // Instatiate Todo
      const todo = new Todo(id, title, completed);

      //Add todo to UI
      UI.addTodoToList(todo, (activeFadeClass = true));

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

//Event: Delete a Todo
DeleteTodo = (id) => {
  //Remove from UI
  UI.deleteTodo(id);
};

//Event: Complete a Todo
TodoCompleted = (id, title) => {
  let parsedId = parseInt(id);
  //Update Store
  Store.completeTodo(parsedId, title);

  //Update UI
  UI.completeTodo(parsedId);
};

// Show/Hide buttons on mouse hover
const ShowButtons = (e) => {
  let buttons = e.querySelectorAll("button");
  for (let i = 0; i < buttons.length; i++) {
    const checkboxInput = buttons[0].parentElement.parentElement.querySelector(
      "input[type='checkbox']"
    ).value;

    if (parseInt(checkboxInput) === 1) {
      buttons[i].parentElement
        .querySelector(".edit-button")
        .classList.remove("show");
      buttons[i].parentElement
        .querySelector(".delete-button")
        .classList.add("show");
    } else {
      buttons[i].classList.add("show");
    }
  }
};

const HideButtons = (e) => {
  let buttons = e.querySelectorAll("button");
  for (let i = 0; i < buttons.length; i++) {
    buttons[i].classList.remove("show");
  }
};

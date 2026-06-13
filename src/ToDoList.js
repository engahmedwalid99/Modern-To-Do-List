import { useState, useEffect } from "react";
import "./List.css";
import Swal from "sweetalert2";
import { FaEdit, FaTrash, FaCheck } from "react-icons/fa";
export default function Todolist() {
  var TasksArr = [];
  const [task, setTask] = useState("");
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("theme") || "dark";
  });

  useEffect(() => {
    document.body.className = theme;
    localStorage.setItem("theme", theme);
  }, [theme]);

  const [completeTask, setCompleteTask] = useState(() => {
    const savedCompleted = localStorage.getItem("completedTasks");

    return savedCompleted ? JSON.parse(savedCompleted) : [];
  });

  useEffect(() => {
    localStorage.setItem("completedTasks", JSON.stringify(completeTask));
  }, [completeTask]);

  const [tasks, setTasks] = useState(() => {
    const savedTasks = localStorage.getItem("tasks");
    return savedTasks ? JSON.parse(savedTasks) : TasksArr;
  });

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  //   Alert
  function emptyUserInput() {
    Swal.fire({
      title: "Enter Your Next Task!",
      icon: "error",
      text: "You Can't Add Empty Task",
      confirmButtonText: "Ok",
      background: "#000",
      color: "#fff",
    });
  }

  function minUserInput() {
    Swal.fire({
      title: "Task Name Is Small",
      icon: "error",
      text: "Must Be More Than 5 Characters",
      confirmButtonText: "Ok",
      background: "#000",
      color: "#fff",
    });
  }

  function maxUserInput() {
    Swal.fire({
      title: "Task Name Is Large",
      icon: "error",
      text: "Must Be Less Than 25 Characters",
      confirmButtonText: "Ok",
      background: "#000",
      color: "#fff",
    });
  }

  function exitUserInput() {
    Swal.fire({
      title: "Task Added Before",
      icon: "error",
      text: "Enter Another Task",
      confirmButtonText: "Ok",
      background: "#000",
      color: "#fff",
    });
  }

  //  functions Of Program
  function handleInputChange(event) {
    setTask(event.target.value);
  }

  function addNewTask() {
    if (task.trim() === "") {
      emptyUserInput();
      return;
    }

    if (task.length < 5) {
      minUserInput();
      return;
    }

    if (task.length > 25) {
      maxUserInput();
      return;
    }

    if (
      tasks.some((e) => e?.name && e.name.toLowerCase() === task.toLowerCase())
    ) {
      exitUserInput();
      return;
    }

    setTasks([
      ...tasks,
      {
        name: task.trim(),
        id: Date.now(),
      },
    ]);

    setTask("");
  }

  function addToCompleteTask(e) {
    setCompleteTask([...completeTask, { id: e.id, name: e.name }]);
    setTasks(tasks.filter((y) => y.id !== e.id));
  }

  function deleteTask(id) {
    Swal.fire({
      title: "Delete Task?",
      text: "This action cannot be undone",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      confirmButtonText: "Delete",
    }).then((result) => {
      if (result.isConfirmed) {
        setTasks(tasks.filter((e) => e.id !== id));
      }
    });
  }

  function deleteAllCompleteTasks() {
    localStorage.removeItem("completedTasks");
    setCompleteTask([]);
  }

  function editTask(task) {
    Swal.fire({
      title: "Edit Task",
      input: "text",
      inputValue: task.name,
      showCancelButton: true,
      confirmButtonText: "Save",
    }).then((result) => {
      if (!result.value) return;

      if (result.value.length > 23) {
        maxUserInput();
        return;
      }

      if (
        tasks.some(
          (e) =>
            e.id !== task.id &&
            e.name.toLowerCase() === result.value.toLowerCase(),
        )
      ) {
        exitUserInput();
        return;
      }

      if (result.isConfirmed) {
        setTasks((prevTasks) =>
          prevTasks.map((e) =>
            e.id === task.id ? { ...e, name: result.value } : e,
          ),
        );
      }
    });
  }

  function toggleTheme() {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  }

  const currentTask = tasks.map((e) => (
    <div className="task-card" key={e.id}>
      <span className="task-name">{e.name}</span>

      <div className="actions">
        <button className="edit-btn" onClick={() => editTask(e)}>
          <FaEdit />
        </button>

        <button className="delete-btn" onClick={() => deleteTask(e.id)}>
          <FaTrash />
        </button>

        <button
          className="complete-btn"
          onClick={() => {
            addToCompleteTask(e);
          }}
        >
          <FaCheck />
        </button>
      </div>
    </div>
  ));

  const completedTasksUI = completeTask.map((e) => (
    <div className="completed-card" key={e.id}>
      <div className="completed-left">
        <div className="check-circle">
          <FaCheck />
        </div>

        <div className="completed-info">
          <h3>{e.name}</h3>
          <span>Completed Successfully</span>
        </div>
      </div>

      <div className="completed-badge">Completed</div>
    </div>
  ));

  return (
    <div className="todo-container">
      <div className="todo-container-header">
        <h2 className="title">My Tasks</h2>

        <div className="input-box">
          <input
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                addNewTask();
              }
            }}
            value={task}
            onChange={handleInputChange}
            placeholder="Add your next challenge..."
            className="task-input"
          />

          <button onClick={addNewTask} className="add-btn">
            Add Task
          </button>
        </div>
      </div>
      <div className="tasks-list">{currentTask}</div>
      <div className="completed-section">
        <div className="completed-sectio-header">
          <h2 className="completed-title">Completed Tasks</h2>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span className="stat-badge done">✅ {completeTask.length}</span>
            <span className="stat-badge pending">⏳ {tasks.length}</span>
            <button
              className="delete-btn-all"
              onClick={deleteAllCompleteTasks}
              title="Clear All Completed"
            >
              <FaTrash />
            </button>
          </div>
        </div>

        {completedTasksUI}
      </div>

      <div className="footer-link-container">
          <button className="theme-btn" onClick={toggleTheme}>
            {theme === "light" ? "🌙" : "☀️"}
          </button>
      </div>
    </div>
  );
}

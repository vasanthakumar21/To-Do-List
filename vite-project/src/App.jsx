import React, { useState, useEffect } from "react";
import "./App.css";

const App = () => {
  const [input, setInput] = useState("");
  const [remainder, setRemainder] = useState("");
  const [view, setView] = useState([]);

  const handleChange = (e) => {
    setInput(e.target.value);
  };

  const handleTimeChange = (e) => {
    setRemainder(e.target.value);
  };

  const add = () => {
    if (!input) return alert("Please enter a task");
    if (!remainder) return alert("Please enter a date and time");

    const task = {
      text: input,
      time: remainder ? new Date(remainder).getTime() : null,
    };

    setView((prev) => [...prev, task]);
    setInput("");
    setRemainder("");
  };

  const remove = (index) => {
    const updateView = view.filter((_, i) => i !== index);
    setView(updateView);
  };

  useEffect(() => {
    const storedTodos = localStorage.getItem("todos");
    if (storedTodos) {
      setView(JSON.parse(storedTodos));
    }
  }, []);

  useEffect(() => {
    if (view.length > 0) {
      localStorage.setItem("todos", JSON.stringify(view));
    }
  }, [view]);

  useEffect(() => {
    view.forEach((task) => {
      if (task.time) {
        const now = Date.now();
        const timeDiff = task.time - now;

        if (timeDiff > 0) {
          setTimeout(() => {
            if (Notification.permission === "granted") {
              new Notification("Reminder", { body: task.text });
            } else if (Notification.permission !== "denied") {
              Notification.requestPermission().then((permission) => {
                if (permission === "granted") {
                  new Notification("Reminder", { body: task.text });
                }
              });
            }
          }, timeDiff);
        }
      }
    });
  }, [view]);

  return (
    <div className="container">
      <h1>Vasanth's</h1>
      <div className="heading">To-Do-List</div>
      <div className="search-box">
        <input
          className="search"
          type="text"
          placeholder="Enter task"
          value={input}
          onChange={handleChange}
        />
        <input
          className="search"
          type="datetime-local"
          value={remainder}
          onChange={handleTimeChange}
        />
        <button className="but" onClick={add}>
          Add
        </button>
        <div className="to-do-list">
          {view.map((task, index) => (
            <table key={index} className="to-do-item">
              <thead>
                <tr>
                  <th>
                    {task.text}{" "}
                    <em>
                      {task.time
                        ? new Date(task.time).toLocaleString()
                        : "No Reminder Set"}
                    </em>
                    {
                      <button className="butt" onClick={() => remove(index)}>
                        Done
                      </button>
                    }
                  </th>
                </tr>
              </thead>
            </table>
          ))}
        </div>
      </div>
    </div>
  );
};

export default App;

import { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";

import "../styles/AddTaskModal.css";

import { ReactComponent as Add } from "../assets/add.svg";
import { ReactComponent as Down } from "../assets/down.svg";
import { ReactComponent as Close } from "../assets/close.svg";
import { useSelector, useDispatch } from "react-redux";
import { addTask, saveTask } from "../state/board.js";
import { toggleAddNewTaskModal, toggleTaskModal, taskEdit } from "../state/ui";

const AddTaskModal = () => {
  const dispatch = useDispatch();
  const board = useSelector((state) => state.board);
  const ui = useSelector((state) => state.ui);

  const [isOpen, setOpen] = useState(false);
  const [error, setError] = useState({
    title: "",
    subtasks: [""],
  });

  const [userInput, setUserInput] = useState({
    id: uuidv4(),
    title: "",
    description: "",
    subtasks: [
      {
        id: "797b135a-93c6-4585-8da7-b4d161155c21",
        title: "",
        done: false,
      },
    ],
    status: board.data[board.selected].columns[0].title,
  });

  useEffect(() => {
    if (ui.taskModal.taskId) {
      setUserInput(
        board.data[board.selected].columns
          .find((column) =>
            column.tasks.some((task) => task.id === ui.taskModal.taskId)
          )
          .tasks.find((task) => task.id === ui.taskModal.taskId)
      );
    }
  }, []);

  const handleInputChange = (type, e) => {
    setError((prev) => ({
      title: "",
      subtasks: prev.subtasks.map(() => {
        return "";
      }),
    }));
    switch (type) {
      case "title":
        setUserInput({ ...userInput, title: e.target.value });
        break;
      case "description":
        setUserInput({ ...userInput, description: e.target.value });
        break;
      default:
        throw new Error("Invalid Input Type");
    }
  };

  const handleSubtaskChange = (subtaskTitle, index) => {
    setError((prev) => ({
      title: "",
      subtasks: prev.subtasks.map(() => {
        return "";
      }),
    }));
    const newSubtasks = JSON.parse(JSON.stringify(userInput));
    newSubtasks.subtasks[index].title = subtaskTitle;
    setUserInput({
      ...userInput,
      subtasks: newSubtasks.subtasks,
    });
  };

  const createNewSubtask = () => {
    if (userInput.subtasks.length === 5) return;
    const newSubtasks = [...userInput.subtasks];
    newSubtasks.push({
      id: uuidv4(),
      title: "",
      done: false,
    });
    setUserInput({
      ...userInput,
      subtasks: newSubtasks,
    });
    setError({ ...error, subtasks: [...error.subtasks, ""] });
  };

  const deleteSubtask = (index) => {
    setUserInput({
      ...userInput,
      subtasks: userInput.subtasks.filter((subtask, i) => i !== index),
    });
    setError((prev) => ({
      ...prev.error,
      subtasks: error.subtasks.filter((subtask, i) => i !== index),
    }));
  };

  const handleDropDown = () => {
    setOpen(!isOpen);
  };

  const handleStatusChange = (title) => {
    setUserInput({ ...userInput, status: title });
    setOpen(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    //check if empty
    if (
      userInput.title.trim() === "" &&
      userInput.subtasks.some((subtask) => subtask.title.trim() === "")
    ) {
      setError((prev) => ({ ...prev, title: "Required" }));
      userInput.subtasks.forEach((subtask, index) => {
        if (subtask.title.trim() === "") {
          setError((prev) => {
            const newError = [...prev.subtasks];
            newError[index] = "Required";
            return { ...prev, subtasks: newError };
          });
        }
      });
    } else if (
      //check if title exists and subtask is empty
      board.data[board.selected].columns.some((column) =>
        column.tasks.some((card) => card.title === userInput.title)
      ) &&
      userInput.subtasks.some((subtask) => subtask.title.trim() === "")
    ) {
      setError((prev) => ({ ...prev, title: "Used" }));
      userInput.subtasks.forEach((subtask, index) => {
        if (subtask.title.trim() === "") {
          setError((prev) => {
            const newError = [...prev.subtasks];
            newError[index] = "Required";
            return { ...prev, subtasks: newError };
          });
        }
      });
    } else if (
      board.data[board.selected].columns.some((column) =>
        column.tasks.some((card) => card.title === userInput.title)
      )
    ) {
      setError((prev) => ({ ...prev, title: "Used" }));
    } else if (userInput.title.trim() === "") {
      setError((prev) => ({ ...prev, title: "Required" }));
    } else if (
      userInput.subtasks.some((subtask) => subtask.title.trim() === "")
    ) {
      setError((prev) => ({ ...prev, title: "" }));
      userInput.subtasks.forEach((subtask, index) => {
        if (subtask.title.trim() === "") {
          setError((prev) => {
            const newError = [...prev.subtasks];
            newError[index] = "Required";
            return { ...prev, subtasks: newError };
          });
        }
      });
    } else {
      dispatch(addTask(userInput));
      dispatch(toggleAddNewTaskModal());
    }
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (
      userInput.title.trim() === "" &&
      userInput.subtasks.some((subtask) => subtask.title.trim() === "")
    ) {
      setError((prev) => ({ ...prev, title: "Required" }));
      userInput.subtasks.forEach((subtask, index) => {
        if (subtask.title.trim() === "") {
          setError((prev) => {
            const newError = [...prev.subtasks];
            newError[index] = "Required";
            return { ...prev, subtasks: newError };
          });
        }
      });
    } else if (userInput.title.trim() === "") {
      setError((prev) => ({ ...prev, title: "Required" }));
    } else if (
      userInput.subtasks.some((subtask) => subtask.title.trim() === "")
    ) {
      setError((prev) => ({ ...prev, title: "" }));
      userInput.subtasks.forEach((subtask, index) => {
        if (subtask.title.trim() === "") {
          setError((prev) => {
            const newError = [...prev.subtasks];
            newError[index] = "Required";
            return { ...prev, subtasks: newError };
          });
        }
      });
    } else {
      dispatch(saveTask(userInput));
      dispatch(taskEdit(null));
    }
  };

  return (
    <div
      className="add_task_modal_container"
      onClick={() => {
        ui.taskModal.taskId
          ? dispatch(taskEdit(null))
          : dispatch(toggleAddNewTaskModal());
      }}
    >
      <form className="add_task_modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal_top">
          <h3 className="modal_title">
            {ui.taskModal.taskId ? "Edit Task" : "Add New Task"}
          </h3>
          <button
            type="button"
            className="modal_close"
            onClick={() => {
              ui.taskModal.taskId
                ? dispatch(taskEdit(null))
                : dispatch(toggleAddNewTaskModal());
            }}
          >
            <Close />
          </button>
        </div>
        <div className="modal_section_container">
          <p className="section_title">Title</p>
          <input
            className={
              "modal_input" + (error.title ? " modal_input_warning" : "")
            }
            type="text"
            name="title"
            value={userInput.title}
            onChange={(e) => handleInputChange("title", e)}
            maxLength={150}
          />
          {error.title && <span className="modal_warning">{error.title}</span>}
        </div>
        <div className="modal_section_container">
          <p className="section_title">Description</p>
          <textarea
            id="description"
            className="modal_input"
            type="text"
            name="description"
            value={userInput.description}
            onChange={(e) => handleInputChange("description", e)}
            maxLength={300}
          />
        </div>
        <div className="modal_section_container subtasks_wrapper">
          <p className="section_title">Subtasks</p>
          {userInput.subtasks.map((subtask, index) => (
            <div key={subtask.id} className="subtasks_container">
              <input
                className={
                  "modal_input" +
                  (error.subtasks[index] ? " modal_input_warning" : "")
                }
                type="text"
                name="subtasks"
                value={subtask.title}
                onChange={(e) => {
                  handleSubtaskChange(e.target.value, index);
                }}
                maxLength={100}
              />

              <button
                type="button"
                className="delete_subtask"
                onClick={() => deleteSubtask(index)}
              >
                <Close />
              </button>
              {error.subtasks[index] && (
                <span className="modal_warning subtask_warning">
                  {error.subtasks[index]}
                </span>
              )}
            </div>
          ))}
        </div>
        <button
          type="button"
          className="add_new_subtask"
          onClick={() => createNewSubtask()}
        >
          <Add style={{ width: "20px", height: "20px" }} />
          Add New Subtask
        </button>
        <div className="modal_section_container">
          <p className="section_title">Status</p>
          <button
            type="button"
            id="status_dropdown"
            className="modal_input"
            onClick={() => handleDropDown()}
          >
            {userInput.status}
            <Down style={{ width: "20px", height: "20px" }} />
          </button>
          {isOpen && (
            <div className="status_dropdown_container">
              {board.data[board.selected].columns.map((column) => (
                <button
                  key={column.id}
                  type="button"
                  className="status_dropdown_container_button"
                  onClick={() => handleStatusChange(column.title)}
                >
                  {column.title}
                </button>
              ))}
            </div>
          )}
        </div>
        <button
          type="submit"
          className="create_task_button"
          onClick={(e) => {
            ui.taskModal.taskId ? handleSave(e) : handleSubmit(e);
          }}
        >
          {ui.taskModal.taskId ? "Save Changes" : "Create Task"}
        </button>
      </form>
    </div>
  );
};

export default AddTaskModal;

import { useState, type SubmitEvent } from "react";
import { useAppDispatch, useAppSelector } from "../../store";
import { selectTasks, taskAdded, taskDeleted } from "./tasksSlice";

const TaskList = () => {
   const tasks = useAppSelector(selectTasks);
   const dispatch = useAppDispatch();
   const [title, setTitle] = useState("");

   const handleSubmit = (event: SubmitEvent<HTMLFormElement>) => {
      event.preventDefault();
      const trimmedTitle = title.trim();

      if (!trimmedTitle) {
         return;
      }

      dispatch(taskAdded(trimmedTitle));
      setTitle("");
   };

   return (
      <section aria-labelledby="tasks-heading">
         <h2 id="tasks-heading">My tasks</h2>

         <form onSubmit={handleSubmit}>
            <label htmlFor="new-task-title">New task</label>
            <input
               id="new-task-title"
               value={title}
               onChange={(event) => setTitle(event.target.value)}
            />
            <button type="submit">Add task</button>
         </form>

         <ul>
            {tasks.map((task) => (
               <li key={task.id}>
                  {task.title}
                  <button
                     type="button"
                     aria-label={`Delete ${task.title}`}
                     onClick={() => dispatch(taskDeleted(task.id))}
                  >
                     Delete
                  </button>
               </li>
            ))}
         </ul>
      </section>
   );
};

export default TaskList;

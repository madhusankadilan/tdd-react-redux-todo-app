import "./styles.css";

const SideBar = () => {
   // const [, setTodo] = useState({
   //     title: "",
   //     description: "",
   // });

   // const handleTitleChange = (ev: ChangeEvent<HTMLInputElement>) => {
   //     setTodo((prevState) => ({
   //         ...prevState,
   //         title: ev.target.value,
   //     }));
   // };

   // const handleDescriptionChange = (ev: ChangeEvent<HTMLTextAreaElement>) => {
   //     setTodo((prevState) => ({
   //         ...prevState,
   //         description: ev.target.value,
   //     }));
   // };

   // const handleAddTodo = () => {};

   // const isDisabled = () => {
   //     if (todo.title && todo.description) {
   //         return false;
   //     }

   //     return true;
   // };

   return (
      <aside className="sidebar">
         Side Bar
         {/*<div className="sidebar-header">*/}
         {/*    <p className="sidebar-title">Add Todo</p>*/}
         {/*</div>*/}
         {/*<div className="sidebar-content">*/}
         {/*    <div className="form-group-title">*/}
         {/*        <input*/}
         {/*            className="title"*/}
         {/*            type="text"*/}
         {/*            placeholder="Title"*/}
         {/*            value={todo.title}*/}
         {/*            onChange={handleTitleChange}*/}
         {/*        />*/}
         {/*    </div>*/}
         {/*    <div className="form-group-description">*/}
         {/*        <textarea*/}
         {/*            className="description"*/}
         {/*            placeholder="Description"*/}
         {/*            value={todo.description}*/}
         {/*            onChange={handleDescriptionChange}*/}
         {/*        ></textarea>*/}
         {/*    </div>*/}
         {/*    <div className="form-group-add-btn">*/}
         {/*        <button*/}
         {/*            className={`add-btn ${isDisabled() ? "disabled" : ""}`}*/}
         {/*            onClick={handleAddTodo}*/}
         {/*            disabled={isDisabled()}*/}
         {/*        >*/}
         {/*            ADD*/}
         {/*        </button>*/}
         {/*    </div>*/}
         {/*</div>*/}
      </aside>
   );
};

export default SideBar;

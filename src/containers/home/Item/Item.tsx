import { ITask } from "../../../data.ts";

type Props = {
   item: ITask;
   statusName: string;
};

const Item = ({ item, statusName }: Props) => {
   return (
      <div className="status-card" key={item.id}>
         <div className="card-header">
            <p className="card-title">{item.title}</p>
         </div>
         <div className="card-body">
            <span className="created-date">{item.createdDate}</span>
            <span className="ellipse"></span>
            <span className="created-by">{item.createdBy}</span>
         </div>
         <div className="card-footer">
            <span className="status-badge">{statusName.toUpperCase()}</span>
         </div>
      </div>
   );
};

export default Item;

import { IStatus } from "../../../data.ts";
import Item from "../Item/index.ts";

type Props = {
   status: IStatus;
};

const Status = ({ status }: Props) => {
   return (
      <div className="status-section" key={status.id}>
         <div className="status-title-wrapper">
            <p className="status-title">{status.name}</p>
         </div>
         <div className="status-body">
            {status.items.length > 0
               ? status.items.map((item) => {
                    return <Item item={item} statusName={status.name} />;
                 })
               : null}
         </div>
      </div>
   );
};

export default Status;

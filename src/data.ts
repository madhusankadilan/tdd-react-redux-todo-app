export type ITask = {
   id: string;
   title: string;
   description: string;
   createdDate: string;
   createdBy: string;
};

export type IStatus = {
   id: string;
   name: string;
   items: ITask[];
};

export type StatusList = IStatus[];

export const status: StatusList = [];

import { useState } from "react";
import { IStatus, StatusList } from "../../../data.ts";
import Status from "../Status/index.ts";
import "./styles.css";

type Props = {
	status: StatusList;
};

const Content = ({ status }: Props) => {
	const [statusList] = useState<StatusList>(status);

	if (statusList.length > 0) {
		return (
			<main className="content">
					{statusList.map((status: IStatus) => {
						return <Status status={status} />;
					})}
			</main>
		);
	}

	return (
		<main className="content flex-center">
			<div className="basic-title">ADD TODO</div>
		</main>
	);
};

export default Content;

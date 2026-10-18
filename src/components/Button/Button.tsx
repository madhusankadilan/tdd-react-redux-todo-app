import { ReactNode } from "react";
import { getClassNames } from "../../utils";
import "./styles.css";

type Props = {
   color?: "primary" | "secondary" | "success" | "info" | "warning" | "error";
   variant?: "contained" | "outlined" | "text";
   size?: "small" | "medium" | "large";
   className?: string;
   children: ReactNode;
};

const Button = (props: Props) => {
   const {
      color = "primary",
      variant = "contained",
      size = "medium",
      className = "",
      children,
   } = props;
   const classNames = getClassNames(
      "button",
      [`${variant}-${color}`, size],
      className,
   );

   return <button className={classNames}>{children}</button>;
};

export default Button;

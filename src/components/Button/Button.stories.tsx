import type { Meta } from "@storybook/react-vite";
import ButtonComponent from "./Button";
import { ReactNode } from "react";

type Props = {
   color?: "primary" | "secondary" | "success" | "info" | "warning" | "error";
   variant?: "contained" | "outlined" | "text";
   size?: "small" | "medium" | "large";
   className?: string;
   children: ReactNode;
};

const meta = {
   title: "Example/Button",
   component: ButtonComponent,
   parameters: {
      layout: "centered",
   },
   tags: ["autodocs"],
   argTypes: {
      color: {
         control: "select",
         options: [
            "primary",
            "secondary",
            "success",
            "info",
            "warning",
            "error",
         ],
      },
   },
} satisfies Meta<typeof ButtonComponent>;

export default meta;

export const Button = (props: Props) => (
   <ButtonComponent {...props}>Button</ButtonComponent>
);

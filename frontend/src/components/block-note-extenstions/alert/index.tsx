import "./alert-styles.css";

import { defaultProps } from "@blocknote/core";
import { createReactBlockSpec } from "@blocknote/react";
import { MdCancel, MdCheckCircle, MdError, MdInfo } from "react-icons/md";

export const alertTypes = [
  {
    title: "Warning",
    value: "warning",
    icon: MdError,
    color: "#e69819",
    backgroundColor: {
      light: "#fff6e6",
      dark: "#805d20",
    },
  },
  {
    title: "Error",
    value: "error",
    icon: MdCancel,
    color: "#d80d0d",
    backgroundColor: {
      light: "#ffe6e6",
      dark: "#802020",
    },
  },
  {
    title: "Info",
    value: "info",
    icon: MdInfo,
    color: "#507aff",
    backgroundColor: {
      light: "#e6ebff",
      dark: "#203380",
    },
  },
  {
    title: "Success",
    value: "success",
    icon: MdCheckCircle,
    color: "#0bc10b",
    backgroundColor: {
      light: "#e6ffe6",
      dark: "#208020",
    },
  },
] as const;

export const Alert = createReactBlockSpec(
  {
    type: "alert",
    propSchema: {
      textAlignment: defaultProps.textAlignment,
      textColor: defaultProps.textColor,
      type: {
        default: "warning",
        values: ["warning", "error", "info", "success"],
      },
    },
    content: "inline",
  },
  {
    render: (props) => {
      const alertType = alertTypes.find(
        (a) => a.value === props.block.props.type
      )!;
      const Icon = alertType.icon;
      return (
        <div className={`alert gap-6
        dark:data-[alert-type=info]:bg-indigo-500/20 dark:data-[alert-type=info]:text-indigo-400
        dark:data-[alert-type=error]:bg-rose-500/20 dark:data-[alert-type=error]:text-rose-400
        dark:data-[alert-type=success]:bg-emerald-500/20 dark:data-[alert-type=success]:text-emerald-400`} data-alert-type={props.block.props.type}>
          <div className="flex">
            <div className="flex relative group/alert" contentEditable={false}>
              <Icon
                className="alert-icon"
                data-alert-icon-type={props.block.props.type}
                size={25}
              />

              <div className="absolute top-[100%] bg-zinc-800 text-white p-3 text-sm rounded-md hidden group-hover/alert:flex">
                {alertTypes.map((type) => {
                  return (
                    <div
                      key={type.value}
                      className="hover:bg-zinc-700 cursor-pointer p-1 px-2"
                      onClick={() =>
                        props.editor.updateBlock(props.block, {
                          type: "alert",
                          props: { type: type.value },
                        })
                      }
                    >
                      {type.title}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
          <div
            className={"flex-wrap flex-1 font-semibold w-full"}
            ref={props.contentRef}
          />
        </div>
      );
    },
  }
);

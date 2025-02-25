import { motion } from "framer-motion";
import React, { useState } from "react";
import { FaMoon } from "react-icons/fa";
import { PiSunFill } from "react-icons/pi";

type Props = {
  value: string | null | undefined;
  onChange: (value: string) => void;
};

const InputTime = React.forwardRef<HTMLInputElement, Props>((props, _) => {
  const { value, onChange } = props;
  const [showTime, setShowTime] = useState(false);

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  const handleFocus = () => {
    setShowTime(true);
  };

  const handleBlur = () => {
    setShowTime(false);
  };

  return (
    <div className="relative">
      <input
        type="text"
        value={value || ""}
        onChange={handleTimeChange}
        onFocus={handleFocus}
        className="w-full px-4 py-2 border bg-white dark:bg-zinc-800 dark:border-zinc-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      {showTime && (
        <motion.div
          initial={{ opacity: 0, scale: 0.6 }}
          animate={{ opacity: 1, scale: 1 }}
          className="absolute top-full h-[10rem] dark:bg-neutral-900 overflow-auto scroll-default left-0 z-10 w-full bg-white shadow-lg rounded-md"
        >
          <ul className="p-2">
            {Array.from({ length: 24 }, (_, i) => {
              const hour = i.toString().padStart(2, "0");
              return (
                <li
                  key={hour}
                  onClick={() => {
                    onChange(`${hour}:00`);
                    handleBlur();
                  }}
                  className="cursor-pointer py-1 px-2 hover:bg-gray-100 rounded dark:hover:bg-zinc-800 text-zinc-500 flex gap-2 items-center"
                >
                  {Number(hour) >= 5 && Number(hour) <= 17 ? (
                    <PiSunFill />
                  ) : (
                    <FaMoon />
                  )}
                  {hour}:00
                </li>
              );
            })}
          </ul>
        </motion.div>
      )}
    </div>
  );
});

InputTime.displayName = "InputTime";

export default InputTime;

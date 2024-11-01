import { Modal } from "@/components/modal-template";

import { FormTask } from "@/components/form-task";
import Link from "next/link";
import { IoClose } from "react-icons/io5";
import { useAddTask } from "./hooks";

export default function AddTaskModal() {
  const { addTask } = useAddTask();
  
  return (
    <Modal.Container className="max-w-[40rem] mt-[5rem] mb-[5rem] bg-gray-100">
      <FormTask.Container handleSubmit={addTask}>
        <FormTask.Header>
          <Link
            href={"?"}
            className="w-8 h-8 bg-white shadow grid place-items-center rounded opacity-90 hover:opacity-100 dark:bg-zinc-800"
          >
            <IoClose />
          </Link>
        </FormTask.Header>
        <FormTask.Section />
        <FormTask.Footer>
          <button
            type="submit"
            className="bg-indigo-600 text-white opacity-90 hover:opacity-100 p-2 text-base px-3 rounded shadow-md"
          >
            Go
          </button>
        </FormTask.Footer>
      </FormTask.Container>
    </Modal.Container>
  );
}

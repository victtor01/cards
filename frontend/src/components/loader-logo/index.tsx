import { fontSaira } from "@/fonts";
import { Loader } from "../loader";

export function LoaderLogo() {
  return (
    <div className="w-full h-screen fixed top-0 left-0 grid place-items-center">
      <div className="flex flex-col items-center justify-center gap-10">
        <div className="p-2 bg-indigo-600 text-white px-4 font-semibold rounded">
          <span className={fontSaira}>Organizze</span>
        </div>

        <Loader />
      </div>
    </div>
  );
}

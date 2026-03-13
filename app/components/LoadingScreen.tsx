import { ClipLoader } from "react-spinners";

export default function LoadingScreen({ size = 20 }: { size?: number }) {
  return (
    <div className="flex justify-center items-center h-full">
      <ClipLoader color="lightblue" size={size} />
    </div>
  );
}

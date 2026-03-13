import { ClipLoader } from "react-spinners";

export default function LoadingScreen({ size = 45 }: { size?: number }) {
  return (
    <div className="flex justify-center items-center h-full">
      <ClipLoader color="#4A90E2" size={size} />{" "}
    </div>
  );
}

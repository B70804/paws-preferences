import Spinner from "./Spinner";

export default function LoadingCard() {
  return (
    <div className="w-80 h-[420px] rounded-2xl bg-gray-800 flex items-center justify-center">
      <Spinner />
    </div>
  );
}

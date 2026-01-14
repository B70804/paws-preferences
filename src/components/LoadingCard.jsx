import Spinner from "./Spinner";

export default function LoadingCard() {
  return (
    <div className="w-full max-w-[420px] h-[420px] rounded-xl border border-neutral-200 bg-neutral-50 flex items-center justify-center">
      <Spinner />
    </div>
  );
}

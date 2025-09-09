export default function Loader() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white bg-opacity-90">
      <div className="relative flex h-32 w-32 items-center justify-center">
        <div className="absolute h-full w-full animate-ping rounded-full border-2 border-orange-600 delay-0"></div>
        <div className="absolute h-3/4 w-3/4 animate-ping rounded-full border-2 border-orange-500 delay-300"></div>
        <div className="absolute h-1/2 w-1/2 animate-ping rounded-full border-2 border-orange-400 delay-700"></div>
        <div className="relative z-10 text-lg font-bold text-orange-600">
          Loading
        </div>
      </div>
    </div>
  );
}

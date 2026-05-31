export default function Loading() {
  return (
    <div className="mx-4 sm:mx-10 md:mx-20 my-12 animate-pulse" aria-label="Cargando contenido">
      {/* Hero skeleton */}
      <div className="flex flex-col lg:flex-row items-center gap-10 pb-16">
        <div className="w-full max-w-xs lg:max-w-md h-80 bg-gray-200 rounded-2xl" />
        <div className="flex-1 space-y-4 w-full">
          <div className="h-10 bg-gray-200 rounded w-3/4" />
          <div className="h-6 bg-gray-200 rounded w-1/2" />
          <div className="h-4 bg-gray-200 rounded w-2/3" />
          <div className="h-10 bg-gray-200 rounded w-32 mt-4" />
        </div>
      </div>
      {/* Cards skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {[...Array(2)].map((_, i) => (
          <div key={i} className="bg-white rounded-2xl shadow p-8 space-y-3">
            <div className="h-6 bg-gray-200 rounded w-1/3" />
            <div className="h-4 bg-gray-200 rounded w-full" />
            <div className="h-4 bg-gray-200 rounded w-5/6" />
            <div className="h-4 bg-gray-200 rounded w-4/6" />
          </div>
        ))}
      </div>
    </div>
  );
}

export default function ProcesosLoading() {
  return (
    <div className="animate-pulse" aria-label="Cargando procesos">
      {/* Hero skeleton */}
      <div className="flex flex-col lg:flex-row items-center gap-10 py-12 mx-4 sm:mx-10 md:mx-20">
        <div className="flex-1 space-y-4">
          <div className="h-12 bg-gray-200 rounded w-2/3" />
          <div className="h-6 bg-gray-200 rounded w-1/3" />
        </div>
        <div className="w-full sm:w-2/4 h-64 bg-gray-200 rounded-2xl" />
      </div>
      {/* Grid skeleton */}
      <div className="mx-4 sm:mx-10 md:mx-20 my-12 grid md:grid-cols-2 gap-8">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="flex bg-white rounded-2xl shadow overflow-hidden">
            <div className="w-56 flex-shrink-0 bg-gray-200 h-48" />
            <div className="flex-1 p-6 space-y-3">
              <div className="h-5 bg-gray-200 rounded w-2/3" />
              <div className="h-4 bg-gray-200 rounded w-full" />
              <div className="h-4 bg-gray-200 rounded w-5/6" />
              <div className="h-8 bg-gray-200 rounded w-20 mt-4" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

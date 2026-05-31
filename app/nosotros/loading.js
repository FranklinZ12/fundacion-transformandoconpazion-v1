// Skeleton reutilizable para páginas con WaveHeader
function WaveSkeleton() {
  return (
    <div className="animate-pulse" aria-label="Cargando">
      <div className="w-full h-44 bg-[#872075]/20 rounded-b-[50%]" />
      <div className="mx-4 sm:mx-10 md:mx-28 mt-10 space-y-6">
        <div className="h-8 bg-gray-200 rounded w-1/2 mx-auto" />
        <div className="h-4 bg-gray-200 rounded w-1/3 mx-auto" />
        <div className="space-y-3 mt-8">
          <div className="h-4 bg-gray-200 rounded w-full" />
          <div className="h-4 bg-gray-200 rounded w-5/6" />
          <div className="h-4 bg-gray-200 rounded w-4/6" />
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white rounded-2xl shadow p-6 space-y-3">
              <div className="h-10 w-10 bg-gray-200 rounded-full mx-auto" />
              <div className="h-4 bg-gray-200 rounded w-2/3 mx-auto" />
              <div className="h-3 bg-gray-200 rounded w-full" />
              <div className="h-3 bg-gray-200 rounded w-5/6" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default WaveSkeleton;

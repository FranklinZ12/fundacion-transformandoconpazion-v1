export default function ProcessHero({ titulo, titulo2, subtitulo }) {
  return (
    <section
      className="relative flex items-center justify-center overflow-hidden bg-gradient-to-br from-[#872075] via-[#6d1960] to-[#4a1040]"
      style={{ minHeight: '420px' }}
      aria-label={`${titulo} ${titulo2}`}
    >
      {/* Decorative blobs */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute -right-20 -top-20 h-80 w-80 rounded-full bg-white/5 blur-3xl" />
        <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-[#c3171c]/15 blur-3xl" />
      </div>

      {/* Content */}
      <div className="relative z-10 px-6 pb-16 pt-12 text-center">
        <h1 className="text-4xl font-extrabold leading-tight text-white sm:text-5xl lg:text-7xl">
          {titulo}{" "}
          <span className="text-[#f9a8d4]">{titulo2}</span>
        </h1>
        {subtitulo && (
          <p className="mt-4 text-lg font-medium uppercase tracking-wider text-white/70">
            {subtitulo}
          </p>
        )}
      </div>

      {/* Wave */}
      <div aria-hidden="true" className="absolute bottom-0 left-0 w-full overflow-hidden">
        <svg viewBox="0 0 1200 80" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" style={{ height: '60px', display: 'block', width: '100%' }}>
          <path d="M985.66,92.83C906.67,72,823.78,31,743.84,14.19c-82.26-17.34-168.06-16.33-250.45.39-57.84,11.73-114,31.07-172,41.86A600.21,600.21,0,0,1,0,27.35V120H1200V95.8C1132.19,118.92,1055.71,111.31,985.66,92.83Z" fill="#f9fafb" />
        </svg>
      </div>
    </section>
  );
}

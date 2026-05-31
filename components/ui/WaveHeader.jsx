export default function WaveHeader({ title, subtitle }) {
  return (
    <div
      className="relative w-full bg-gradient-to-br from-[#872075] to-[#5a1050] overflow-hidden flex items-center justify-center"
      style={{ minHeight: title ? '280px' : '180px', maxWidth: '100%' }}
      aria-hidden={!title ? true : undefined}
    >
      <div aria-hidden="true" className="absolute top-0 right-0 w-64 h-64 rounded-full bg-white/5 -translate-y-1/3" />
      <div aria-hidden="true" className="absolute bottom-16 left-8 w-32 h-32 rounded-full bg-white/5" />

      {title && (
        <div className="relative z-10 text-center px-6 pb-16">
          <h1 className="text-3xl md:text-5xl font-extrabold text-white uppercase tracking-tight">
            {title}
          </h1>
          {subtitle && (
            <p className="text-white/70 mt-3 text-lg">{subtitle}</p>
          )}
        </div>
      )}

      <svg
        className="absolute bottom-0 left-0 w-full"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 1200 120"
        preserveAspectRatio="none"
        style={{ height: '80px', display: 'block' }}
        aria-hidden="true"
      >
        <path
          d="M985.66,92.83C906.67,72,823.78,31,743.84,14.19c-82.26-17.34-168.06-16.33-250.45.39-57.84,11.73-114,31.07-172,41.86A600.21,600.21,0,0,1,0,27.35V120H1200V95.8C1132.19,118.92,1055.71,111.31,985.66,92.83Z"
          fill="#f9fafb"
        />
      </svg>
    </div>
  );
}

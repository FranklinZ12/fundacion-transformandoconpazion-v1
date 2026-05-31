export default function CurvedHeader({ title, subtitle }) {
  return (
    <div
      className="relative w-full bg-gradient-to-br from-[#872075] to-[#5a1050] overflow-hidden flex items-center justify-center"
      style={{ minHeight: title ? '240px' : '160px' }}
      aria-hidden={!title ? true : undefined}
    >
      <div aria-hidden="true" className="absolute top-0 right-0 w-48 h-48 rounded-full bg-white/5 -translate-y-1/3 translate-x-1/4" />
      <div aria-hidden="true" className="absolute bottom-8 left-8 w-24 h-24 rounded-full bg-white/5" />

      {title && (
        <div className="relative z-10 text-center px-6 pb-10">
          <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
            {title}
          </h1>
          {subtitle && (
            <p className="text-white/70 mt-2 text-base">{subtitle}</p>
          )}
        </div>
      )}

      <svg
        className="absolute bottom-0 left-0 w-full"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 1440 80"
        preserveAspectRatio="none"
        style={{ height: '60px', display: 'block' }}
        aria-hidden="true"
      >
        <path
          d="M0,40 C360,80 1080,0 1440,40 L1440,80 L0,80 Z"
          fill="#f9fafb"
        />
      </svg>
    </div>
  );
}

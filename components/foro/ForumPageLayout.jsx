import Link from "next/link";

export function getRelFirst(rel) {
  return Array.isArray(rel) ? rel[0] : rel;
}

export function ForumPageLayout({ children, backHref, backLabel }) {
  return (
    <section className="bg-[#f9fafb] px-4 sm:px-6 lg:px-8 py-12 min-h-[60vh]">
      <div className="max-w-7xl mx-auto">
        {backHref && (
          <div className="mb-8">
            <Link
              href={backHref}
              className="inline-flex items-center gap-2 text-sm font-semibold text-[#872075] bg-white border border-gray-100 hover:border-[#872075]/30 transition-colors px-4 py-2 rounded-full shadow-sm"
            >
              <i className="fa-solid fa-arrow-left text-xs" aria-hidden="true" />
              {backLabel}
            </Link>
          </div>
        )}
        {children}
      </div>
    </section>
  );
}

export function ForumSectionTitle({ title, subtitle }) {
  return (
    <div className="mb-6">
      <div className="flex items-center gap-3 mb-2">
        <div className="h-6 w-1 rounded-full bg-[#872075]" aria-hidden="true" />
        <h2 className="text-xl font-extrabold text-gray-900 uppercase tracking-wide">{title}</h2>
      </div>
      {subtitle && <p className="text-sm text-gray-500 ml-4">{subtitle}</p>}
    </div>
  );
}

export function ForumCard({ children, className = "" }) {
  return (
    <div className={`rounded-2xl bg-white border border-gray-100 shadow-sm ${className}`}>
      {children}
    </div>
  );
}

export const TYPE_LABELS = {
  anuncio: "Anuncio",
  debate: "Debate",
  general: "General",
};

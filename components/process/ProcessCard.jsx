import Image from "next/image";
import Link from "next/link";

export default function ProcessCard({ image, nombre, descripcion, link, priority = false }) {
  return (
    <article className="card lg:card-side bg-white shadow-lg rounded-2xl overflow-hidden hover:shadow-xl transition-shadow animate__animated animate__fadeIn">
      <figure className="relative h-48 lg:h-auto lg:w-56 flex-shrink-0">
        <Image
          src={`/images/procesos/${image}.webp`}
          alt={nombre}
          fill
          sizes="(max-width: 1024px) 100vw, 224px"
          className="object-cover"
          loading={priority ? 'eager' : 'lazy'}
          priority={priority}
        />
      </figure>
      <div className="card-body p-6">
        <h2 className="card-title text-gray-900 text-xl">{nombre}</h2>
        <p className="text-gray-600 text-sm leading-relaxed flex-1">{descripcion}</p>
        {link ? (
          <div className="card-actions justify-end mt-4">
            <Link
              href={`/procesos/${link}`}
              className="btn btn-outline border-[#872075] text-[#872075] hover:bg-[#872075] hover:text-white btn-sm"
            >
              Ver más
            </Link>
          </div>
        ) : (
          <div className="mt-4">
            <span className="inline-block text-xs font-semibold bg-gray-100 text-gray-500 px-3 py-1 rounded-full">
              Próximamente
            </span>
          </div>
        )}
      </div>
    </article>
  );
}

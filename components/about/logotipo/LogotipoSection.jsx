import Image from "next/image";

const logoInfo = [
  {
    icon: "fa-solid fa-heart",
    title: "Características",
    items: [
      { label: "Corazón", desc: "Amor por la comunidad." },
      { label: "Paloma", desc: "La paz como valor central." },
      { label: "Balón", desc: "Deporte, educación y cultura." },
    ],
  },
  {
    icon: "fa-solid fa-palette",
    title: "Colores",
    items: [
      { label: "Rojo", desc: "Pasión y energía." },
      { label: "Violeta", desc: "Transformación y confianza." },
    ],
  },
  {
    icon: "fa-solid fa-quote-left",
    title: "Eslogan",
    items: [
      { label: "Transformando", desc: "Cambiar para bien la cultura ciudadana." },
      { label: "Pazión", desc: "Las palabras entrelazadas de paz y pasión." },
    ],
  },
];

export default function LogotipoSection() {
  return (
    <section aria-labelledby="logo-heading" className="pt-4 pb-12">
      {/* Header */}
      <div className="text-center mb-10">
        <h2
          id="logo-heading"
          className="text-4xl font-extrabold text-gray-900 tracking-tight"
        >
          Nuestro <span className="text-[#872075]">Logotipo</span>
        </h2>
        <p className="text-gray-500 mt-2">La identidad visual que nos representa</p>
      </div>

      {/* Logo + grid */}
      <div className="flex flex-col items-center gap-10">
        {/* Central logo */}
        <div className="flex flex-col items-center gap-3">
          <div className="rounded-3xl bg-white p-6 shadow-md ring-1 ring-gray-100">
            <Image
              src="/images/ClubDeportivoTCP.png"
              alt="Logotipo Fundación Transformando Con Pazión"
              width={160}
              height={160}
              className="h-36 w-36 object-contain"
            />
          </div>
          <p className="text-sm font-semibold text-[#872075] uppercase tracking-widest">
            Fundación TCP
          </p>
        </div>

        {/* 3 info cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 w-full">
          {logoInfo.map((col) => (
            <div
              key={col.title}
              className="flex flex-col gap-4 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-[#872075]/10">
                  <i className={`${col.icon} text-[#872075] text-sm`} aria-hidden="true" />
                </div>
                <h3 className="text-base font-bold text-gray-900">{col.title}</h3>
              </div>
              <ul className="space-y-2">
                {col.items.map((item) => (
                  <li key={item.label} className="text-sm text-gray-600">
                    <span className="font-semibold text-gray-800">{item.label}: </span>
                    {item.desc}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}


import Image from "next/image";

export default function Logo() {
  return (
    <Image
      src="/images/pajaroTCP.png"
      alt="Logo Fundación Transformando Con Pazión"
      width={44}
      height={44}
      priority
      className="h-10 w-10 object-contain"
    />
  );
}

import DescripcionItem from "@/components/ui/DescripcionItem";

export default function DonacionesList() {
  return (
    <div className="animate__animated animate__fadeInUp mt-6">
      <DescripcionItem
        subtitulo="Donación Materiales"
        descripcion="Nuestra necesidad puntual es tener equipos, implementos y herramientas para continuar nuestros proyectos para los jóvenes y aficionados al deporte."
        valor="10.000$"
      />
      <DescripcionItem
        subtitulo="Donación Económica"
        descripcion="Nuestra Población Juvenil se siente agradecida por cada aporte al apoyo de un bien social."
        valor="10.000$"
      />
      <DescripcionItem
        subtitulo="Donación Libre"
        descripcion="Aportes en conocimiento, estructura, espacio entre otras ayudas que podríamos tener en nuestra fundación."
        valor="Libre"
      />
    </div>
  );
}

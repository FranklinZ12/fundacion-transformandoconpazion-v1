/** Returns the public URL for an image in /public/images/procesos/ */
export const getProcessImg = (filename) =>
  `/images/procesos/${filename}.webp`;

/** Returns the public URL for an image in a specific process subfolder */
export const getProcessSubImg = (folder, filename) =>
  `/images/procesos/${folder}/${filename}.webp`;

/** Returns the public URL for a team member image */
export const getTeamImg = (filename) =>
  `/images/teamImages/${filename}.webp`;

/** Process cards data for the main processes page */
export const procesosData = [
  {
    image: 'medellinB',
    nombre: 'Medellín Barrista',
    animacion: 'animate__fadeInTopLeft',
    descripcion:
      'Organización de Hinchas de los diferentes equipos o clubes colombianos para trabajar el barrismo desde un enfoque social y comunitario.',
    link: 'medellin-barrista',
  },
  {
    image: 'ClubDeportivoTCP',
    nombre: 'Club Deportivo TCP',
    animacion: 'animate__fadeInTopRight',
    descripcion:
      'Nuestro Club Deportivo TCP es un proceso deportivo en formación de la disciplina de Fútbol de Salón el cual contiene la categoría Sub 12, Sub 15, Femenina y Juvenil.',
    link: 'club-deportivo-tcp',
  },
  {
    image: 'esysu',
    nombre: 'ES&SU',
    animacion: 'animate__fadeInTopLeft',
    descripcion:
      'Microempresa de Estampados y Sublimación de Mugs, Camisas y Gorras basado en diseños personalizados y enfocado en el gusto y personalidad.',
    link: 'es-y-su',
  },
  {
    image: 'Jovemp',
    nombre: 'Jovemp',
    animacion: 'animate__fadeInTopRight',
    descripcion:
      'Organización de Jóvenes Emprendedores que trabajan para que los emprendimientos y unidades productivas potencien su economía y genere un impacto positivo en el sector donde se encuentra.',
    link: 'jovemp',
  },
  {
    image: 'liga-guayabal',
    nombre: 'Liga Guayabal',
    animacion: 'animate__fadeInTopLeft',
    descripcion:
      'Nuestra Liga es una de las mas grandes en la comuna 15 en la disciplina de Fútbol de Salón el cual se juega en la cancha Respin con mas de 16 equipos compitiendo por quedarse con el máximo titulo en Guayabal en la categoría Masculino Libre.',
    link: null,
    comingSoon: true,
  },
  {
    image: 'TorneoBarrial',
    nombre: 'Torneo Barrial',
    animacion: 'animate__fadeInTopRight',
    descripcion:
      'Nuestro Torneo lleva 3 ediciones creadas en el barrio la Colinita con el fin de integrar la comunidad y a los deportistas en un ambiente de paz y convivencia.',
    link: null,
  },
  {
    image: 'AGA',
    nombre: 'Grupo Ambiental Juvenil TCP',
    animacion: 'animate__fadeInTopLeft',
    descripcion:
      'Somos una organización de líderes ambientales que trabaja en pro del medio ambiente y sus buenas prácticas ambientales.',
    link: 'a-g-a',
  },
  {
    image: 'NaturalWoman',
    nombre: 'Natural Woman',
    animacion: 'animate__fadeInTopRight',
    descripcion:
      'Somos una organización de mujeres empoderadas de su imagen y cuerpo natural, el cual busca que cada mujer se sienta segura de su cuerpo y aumente su autoestima.',
    link: 'natural-woman',
  },
  {
    image: 'CyP_Deportiva',
    nombre: 'Crónicas y Pasión Deportiva',
    animacion: 'animate__fadeInTopLeft',
    descripcion:
      'Programa deportivo donde se habla y debate temas del deporte a nivel nacional e internacional. Analizando detalladamente deportistas, equipos y disciplinas.',
    link: 'cronicas-y-pasion-deportiva',
  },
  {
    image: 'TCPlay',
    nombre: 'TC Play',
    animacion: 'animate__fadeInTopRight',
    descripcion: 'Este es el espacio para pronosticar y acertar resultados del deporte.',
    link: 'tcplay',
  },
];

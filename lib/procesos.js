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
    categoria: 'Social',
    descripcion:
      'Organización de Hinchas de los diferentes equipos o clubes colombianos para trabajar el barrismo desde un enfoque social y comunitario.',
    link: 'medellin-barrista',
  },
  {
    image: 'ClubDeportivoTCP',
    nombre: 'Club Deportivo TCP',
    categoria: 'Deporte',
    descripcion:
      'Nuestro Club Deportivo TCP es un proceso deportivo en formación de la disciplina de Fútbol de Salón el cual contiene la categoría Sub 12, Sub 15, Femenina y Juvenil.',
    link: 'club-deportivo-tcp',
  },
  {
    image: 'esysu',
    nombre: 'ES&SU',
    categoria: 'Emprendimiento',
    descripcion:
      'Microempresa de Estampados y Sublimación de Mugs, Camisas y Gorras basado en diseños personalizados y enfocado en el gusto y personalidad.',
    link: 'es-y-su',
  },
  {
    image: 'Jovemp',
    nombre: 'Jovemp',
    categoria: 'Emprendimiento',
    descripcion:
      'Organización de Jóvenes Emprendedores que trabajan para que los emprendimientos y unidades productivas potencien su economía y genere un impacto positivo en el sector donde se encuentra.',
    link: 'jovemp',
  },
  {
    image: 'liga-guayabal',
    nombre: 'Liga Guayabal',
    categoria: 'Deporte',
    descripcion:
      'Nuestra Liga es una de las más grandes en la comuna 15 en la disciplina de Fútbol de Salón, con más de 16 equipos compitiendo por el máximo título en Guayabal, categoría Masculino Libre.',
    link: 'liga-guayabal',
  },
  {
    image: 'TorneoBarrial',
    nombre: 'Torneo Barrial',
    categoria: 'Deporte',
    descripcion:
      'Nuestro Torneo lleva 4 años trabajando por la sana convivencia en Guayabal La Colinita, integrando a la comunidad y deportistas en la cancha la Colinita #2.',
    link: 'torneo-barrial',
  },
  {
    image: 'grupoAmbiental',
    nombre: 'Grupo Ambiental Juvenil TCP',
    categoria: 'Ambiente',
    descripcion:
      'Somos una organización de líderes ambientales que trabaja en pro del medio ambiente y sus buenas prácticas ambientales.',
    link: 'grupo-ambiental',
  },
  {
    image: 'AGA',
    nombre: 'A.G.A. Productions',
    categoria: 'Cultura',
    descripcion:
      'Organización de Artistas del género urbano y electrónico cuyo enfoque está basado en la producción de música y generación de eventos y shows para la comunidad.',
    link: 'aga-productions',
  },
  {
    image: 'NaturalWoman',
    nombre: 'Natural Woman',
    categoria: 'Social',
    descripcion:
      'Somos una organización de mujeres empoderadas de su imagen y cuerpo natural, el cual busca que cada mujer se sienta segura de su cuerpo y aumente su autoestima.',
    link: 'natural-woman',
  },
  {
    image: 'CyP_Deportiva',
    nombre: 'Crónicas y Pasión Deportiva',
    categoria: 'Cultura',
    descripcion:
      'Programa deportivo donde se habla y debate temas del deporte a nivel nacional e internacional. Analizando detalladamente deportistas, equipos y disciplinas.',
    link: 'cronicas-y-pasion-deportiva',
  },
  {
    image: 'TCPlay',
    nombre: 'TC Play',
    categoria: 'Cultura',
    descripcion: 'Este es el espacio para pronosticar y acertar resultados del deporte.',
    link: 'tcplay',
  },
];

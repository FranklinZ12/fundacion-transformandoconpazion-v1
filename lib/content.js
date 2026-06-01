import { createClient } from "@/lib/supabase/server";
import { unstable_noStore as noStore } from "next/cache";

// ─────────────────────────────────────────────────────────────────────────────
// Defaults — son el fallback si la fila no existe en BD todavía.
// Al editar por primera vez se hace un upsert y los defaults dejan de usarse.
// ─────────────────────────────────────────────────────────────────────────────
export const CONTENT_DEFAULTS = {
  inicio: {
    hero: {
      badge: "Fundación · Colombia",
      title_line1: "Transformando",
      title_line2: "Con Pazión",
      subtitle:
        "Construimos paz, convivencia y oportunidades reales para la juventud y comunidades vulnerables de Colombia.",
      image: "/images/ClubDeportivoTCP.png",
    },
    stats: [
      { number: "5+",     label: "Años de impacto" },
      { number: "10",     label: "Procesos activos" },
      { number: "15+",    label: "Comunidades" },
      { number: "1.000+", label: "Jóvenes impactados" },
    ],
    mision:
      "Somos una fundación sin ánimo de lucro, reconocida a nivel nacional e internacional por nuestro impacto positivo en la educación, el ambiente, el deporte y la cultura de miles de personas que han mejorado su calidad de vida y su participación ciudadana, gracias a nuestra gestión eficiente, transparente y solidaria.",
    vision:
      "En los próximos tres años, nuestra fundación se propone brindar oportunidades de educación, ambiente, deporte y cultura a las personas en situación de vulnerabilidad en todo el país, mediante proyectos innovadores, sostenibles y participativos que contribuyan a la paz y la convivencia social.",
    objectives: [
      {
        icon:  "fa-solid fa-magnifying-glass",
        title: "Diagnóstico Social",
        text:  "Realizamos diagnósticos en el territorio para identificar y atender las necesidades reales de cada comunidad.",
      },
      {
        icon:  "fa-solid fa-handshake-angle",
        title: "Proyectos Comunitarios",
        text:  "Elaboramos proyectos, capacitaciones y eventos que vinculen a las comunidades y contribuyan a su bienestar.",
      },
    ],
  },

  contacto: {
    address:      "Guayabal la Colinita — Medellín\nCra. 53BB #10B Sur - 51",
    schedule:     "Lunes - Viernes\n06:00 pm – 10:00 pm",
    whatsapp:     "(+57) 314 8229310",
    whatsapp_url: "https://wa.me/573148229310",
    email:        "transformandoconpazion@gmail.com",
    socials: {
      youtube:   "https://www.youtube.com/@transformandoconpazion",
      twitter:   "https://twitter.com/TransforconPazi",
      instagram: "https://www.instagram.com/fundacion_tcp/",
      facebook:  "https://www.facebook.com/transformando.con.pazionn/",
    },
  },

  organizacion: {
    quienes_somos:
      "Somos una fundación que trabaja con jóvenes, hinchas y comunidad en pro de la sana convivencia, formulando proyectos que lleven el significado de la paz y convivencia. Aportamos por medio de eventos a la integración de los demás grupos u organizaciones sociales con el fin de unir la ciudad y generar el gran aporte del trabajo en equipo y la paz por medio del deporte, educación y cultura.",
    resena: [
      "La Fundación Transformando Con Pazión se crea el 17 de diciembre del año 2017 en Medellín y está ubicada en la comuna 15 Guayabal La Colinita.",
      "Con más de dos años de experiencia, se inicia con un objetivo específico que es disminuir las problemáticas que existen entre aficionados al deporte o hinchas, así como crear oportunidades para la población juvenil donde su rango de edad es entre los 14 a los 28 años, estrategias del aprovechamiento del tiempo libre y aumento del desarrollo integral de las comunidades.",
      "Por medio de diferentes actividades y acciones sociales, actualmente se realizan varios talleres de formación: entrenamiento deportivo en Futsala y Fútbol de Salón, talleres de formación en herramientas en Office y liderazgo empresarial. Entre los proyectos sociales y económicos de gran impacto se encuentra la Liga Guayabal 2020 y el Club Deportivo TCP.",
      "La Fundación TCP lleva un trabajo articulado con la alcaldía de Medellín, comunidad y líderes sociales con el fin de aumentar la participación, generar un ambiente de convivencia y paz y crear nuevas economías que impulsen el desarrollo y auto sostenimiento de la comuna 15.",
    ],
    stats: [
      { icon: "fa-solid fa-calendar-days", value: "2017",       label: "Año de fundación" },
      { icon: "fa-solid fa-users",          value: "14–28",      label: "Rango de edad" },
      { icon: "fa-solid fa-location-dot",   value: "Comuna 15", label: "Guayabal, Medellín" },
      { icon: "fa-solid fa-handshake-angle",value: "100%",      label: "Sin ánimo de lucro" },
    ],
    pilares: [
      { icon: "fa-solid fa-peace",     label: "Paz y convivencia" },
      { icon: "fa-solid fa-futbol",    label: "Deporte" },
      { icon: "fa-solid fa-book-open", label: "Educación" },
      { icon: "fa-solid fa-music",     label: "Cultura" },
    ],
    timeline: [
      { year: "2017", icon: "fa-solid fa-flag",   title: "Fundación TCP nace",             desc: "Creada el 17 de diciembre en la comuna 15 Guayabal La Colinita, Medellín." },
      { year: "2018", icon: "fa-solid fa-futbol", title: "Primeros talleres deportivos",   desc: "Inicio de entrenamientos en Futsala y Fútbol de Salón para la población juvenil." },
      { year: "2019", icon: "fa-solid fa-laptop", title: "Formación empresarial",          desc: "Talleres de Office y liderazgo empresarial para potenciar el desarrollo integral." },
      { year: "2020", icon: "fa-solid fa-trophy", title: "Liga Guayabal & Club Deportivo TCP", desc: "Proyectos sociales y económicos de gran impacto en la comunidad." },
    ],
    principios: [
      { icon: "fa-solid fa-dove",              title: "Garantía de derechos",        text: "Por medio del comportamiento de los jóvenes y grupos sociales, como fundación se les respetara sus derechos, custodiando día a día que estos sean cumplidos." },
      { icon: "fa-solid fa-scale-balanced",    title: "Igualdad de oportunidades",   text: "Tanto para la fundación como para los jóvenes y demás participes de la comunidad se les dará igualdad en cada uno de los procesos que se lleven a cabo." },
      { icon: "fa-solid fa-magnifying-glass",  title: "Transparencia",               text: "Todos nuestros procesos serán llevados con total transparencia para lograr la confianza de los demás jóvenes y toda la comunidad." },
      { icon: "fa-solid fa-handshake-simple",  title: "Cooperación",                 text: "Como fundación pese a las adversidades que se presenten en el transcurso del tiempo, entra a jugar el trabajo en equipo y la cooperación como grupo de trabajo para que las metas propuestas sean cumplidas." },
    ],
    valores: [
      { icon: "fa-solid fa-scale-balanced",    title: "Igualdad",         text: "Todos merecemos ser tratados de la misma forma, inculcaremos este valor en los jóvenes, grupos sociales y en nuestro grupo de trabajo, imponiendo así el buen trato y la mejora de las oportunidades en el sector social." },
      { icon: "fa-solid fa-people-line",       title: "Ciudadanía plena", text: "Aspiramos a que los jóvenes y cada uno de los grupos sociales ejerzan cada uno de los derechos de la manera más plena, reflejando un cambio general entre toda la comunidad." },
      { icon: "fa-solid fa-hand-holding-heart",title: "Voluntad",         text: "Todos los proyectos como eventos serán elaborados con la mejor actitud, iniciativa y voluntad por parte de los jóvenes, grupos sociales y nosotros como fundación." },
      { icon: "fa-solid fa-thumbs-up",         title: "Respeto",          text: "Para obtener grandes logros se debe de respetar al otro, incluir el respeto en nuestra fundación es la base fundamental para avanzar con cada uno de los jóvenes y demás grupos sociales que hacen parte de la comunidad." },
    ],
  },

  equipo: {
    members: [
      {
        image:       "/images/teamImages/jeison.webp",
        nombre:      "Jeison Cifuentes",
        puesto:      "Presidente",
        bio:         "Joven apasionado del sector social y de los negocios queriendo transformar territorios por medio de nuevos proyectos sociales que impacten a las comunidades.",
        bioExtended: "Uno de nuestros fundadores y representante legal de la fundación. Vela por el cumplimiento de las metas y objetivos dentro de ella, dirigiendo el equipo administrativo.",
        instagram:   "https://instagram.com/jeison_cifuentes_?igshid=YmMyMTA2M2Y=",
        facebook:    "https://www.facebook.com/jeison.cifuentess",
        twitter:     "https://twitter.com/JeisonCifuentez",
      },
      {
        image:       "/images/teamImages/kevin.webp",
        nombre:      "Kevin Ramirez",
        puesto:      "Vicepresidente",
        bio:         "Llega con su experiencia administrativa a la fundación en el 2020 para aportar, sumar y generar más experiencia en el sector social y comunitario.",
        bioExtended: "Es el encargado de coordinar que todos los procesos y proyectos estén activos y funcionando adecuadamente para el cumplimiento de metas y objetivos propuestos por la fundación.",
        instagram:   "",
        facebook:    "",
        twitter:     "",
      },
      {
        image:       "/images/teamImages/andi.webp",
        nombre:      "Andrés Palacio",
        puesto:      "Director Ejecutivo",
        bio:         "Llega a la fundación en el 2018 con muchas ganas de aprender y potenciar su conocimiento con la mejor actitud y disciplina.",
        bioExtended: "Uno de nuestros líderes cuyo aporte es controlar que todos los procesos tanto legales como administrativos estén en óptimas condiciones.",
        instagram:   "",
        facebook:    "",
        twitter:     "",
      },
      {
        image:       "/images/teamImages/camila.webp",
        nombre:      "Camila Valencia",
        puesto:      "Secretaria",
        bio:         "La caracteriza su sencillez y su humildad ante la comunidad. Es nuestro apoyo administrativo en la gestión de todos los procesos y proyectos.",
        bioExtended: "Apoyo administrativo en la gestión de todos los procesos y proyectos de la fundación, lo cual la hace parte importante y ficha clave en sus funciones.",
        instagram:   "https://instagram.com/m.camila.valencia?igshid=YmMyMTA2M2Y=",
        facebook:    "https://www.facebook.com/mcamilavv",
        twitter:     "https://twitter.com/luna971130",
      },
      {
        image:       "/images/teamImages/velasquez.webp",
        nombre:      "Camila Velasquez",
        puesto:      "Tesorera",
        bio:         "Joven con muy buena actitud, confiable y honesta. Su trabajo la lleva a ser una persona con muchas capacidades en temas contables.",
        bioExtended: "Vela porque los recursos de la fundación lleven un orden y una buena distribución, que los dineros sean bien administrados y la legalidad de sus movimientos tengan un registro para potenciar la confianza.",
        instagram:   "https://instagram.com/camilavelasquezg_?igshid=YmMyMTA2M2Y=",
        facebook:    "https://www.facebook.com/mariacamila.velasquezgraciano",
        twitter:     "",
      },
      {
        image:       "/images/teamImages/milena.webp",
        nombre:      "Milena Díaz",
        puesto:      "Abogada",
        bio:         "Mujer eficiente, capaz y sencilla. Siempre disponible a cualquier inquietud o problema que tenga algún miembro de la fundación.",
        bioExtended: "Ficha clave dentro de la fundación ya que es quien presta toda la asesoría legal ante las diferentes entidades gubernamentales y administrativas.",
        instagram:   "https://instagram.com/s_mile.d?igshid=YmMyMTA2M2Y=",
        facebook:    "https://www.facebook.com/milena.diazhenao",
        twitter:     "",
      },
    ],
  },

  voluntario: {
    voluntariado_titulo:   "¿Quieres ser parte del cambio?",
    voluntariado_subtitulo: "Buscamos jóvenes comprometidos con el desarrollo social de la comunidad. Aquí hay un lugar para ti sin importar cuál sea tu talento.",
    roles: [
      { image: "/images/voluntario/left.webp",  icon: "fa-solid fa-person-running", badge: "Deporte",        title: "Líder Deportivo",    desc: "Buscamos jóvenes apasionados por el deporte que quieran apoyar nuestros entrenamientos, torneos y actividades físicas en la comunidad." },
      { image: "/images/voluntario/mid.webp",   icon: "fa-solid fa-lightbulb",      badge: "Emprendimiento", title: "Líder Emprendedor",  desc: "Formamos líderes con visión empresarial para generar ingresos, empleo e innovación social en el territorio de la comuna 15." },
      { image: "/images/voluntario/right.webp", icon: "fa-solid fa-users",          badge: "Comunidad",      title: "Miembro Activo",     desc: "Jóvenes con ganas de pertenecer a nuestra fundación, liderar proyectos y construir un mejor futuro para la comunidad." },
    ],
    donaciones_titulo:   "Tu aporte transforma vidas",
    donaciones_subtitulo: "Con tu donación financiamos proyectos deportivos, culturales y educativos que impactan directamente a los jóvenes de la comunidad.",
    tiers: [
      { icon: "fa-solid fa-box-open",            title: "Donación en Materiales", value: "Desde $10.000", desc: "Equipos, implementos deportivos y herramientas para continuar nuestros proyectos con los jóvenes." },
      { icon: "fa-solid fa-hand-holding-dollar", title: "Donación Económica",     value: "Desde $10.000", desc: "Cada peso aporta directamente al bienestar y desarrollo de nuestra población juvenil en Medellín." },
      { icon: "fa-solid fa-gift",                title: "Donación Libre",         value: "A tu medida",   desc: "Conocimiento, espacio, estructura u otro tipo de apoyo. Todo aporte suma a la transformación social." },
    ],
    impacto_titulo:    "Cada donación cuenta",
    impacto_subtitulo: "Mira lo que hemos construido juntos desde 2017 en la comuna 15.",
    impact_stats: [
      { icon: "fa-solid fa-child-reaching",  value: "100+", label: "Jóvenes beneficiados" },
      { icon: "fa-solid fa-diagram-project", value: "7",    label: "Proyectos activos" },
      { icon: "fa-solid fa-calendar-check",  value: "7",    label: "Años de impacto" },
      { icon: "fa-solid fa-location-dot",    value: "C15",  label: "Guayabal, Medellín" },
    ],
    cta_titulo:    "¿Listo para transformar?",
    cta_subtitulo: "Únete a nosotros como voluntario o apoya la causa con una donación. Juntos construimos un mejor futuro para los jóvenes de la comuna 15.",
  },

  procesos: {
    processes: [
      {
        slug:             "medellin-barrista",
        nombre:           "Medellín Barrista",
        categoria:        "Social",
        card_image:       "/images/procesos/medellinB.webp",
        card_descripcion: "Organización de Hinchas de los diferentes equipos o clubes colombianos para trabajar el barrismo desde un enfoque social y comunitario.",
        header_title:    "Medellín Barrista",
        header_subtitle: "Hinchas y Aficionados al Deporte",
        hero_layout:     "photo",
        hero_image:      "https://7b43b669ac.cbaul-cdnwnd.com/abf8e19acfe234e91b6cc22d0e299ea6/200000136-ad3efae383/received_689831647860118~2.jpeg",
        hero_descripcion: "Medellín Barrista apoya proyectos sociales de hinchas y barristas, promoviendo el deporte en paz, la convivencia y el aprovechamiento del tiempo libre en dinámicas deportivas y culturales en los barrios de Medellín.",
        pills: [
          { icon: "fa-users",        label: "Barrismo social" },
          { icon: "fa-futbol",       label: "Hinchas" },
          { icon: "fa-dove",         label: "Convivencia" },
          { icon: "fa-location-dot", label: "Medellín" },
        ],
        items: [
          { icon: "fa-users",        titulo: "Barrismo Social",   descripcion: "Trabajamos el barrismo desde un enfoque social, promoviendo la convivencia entre hinchas de diferentes equipos.", image: null },
          { icon: "fa-dove",         titulo: "Paz en las Tribunas", descripcion: "Impulsamos una cultura de paz y respeto en los escenarios deportivos, transformando la manera de alentar.", image: null },
          { icon: "fa-people-group", titulo: "Red Comunitaria",   descripcion: "Articulamos hinchas y comunidad en actividades de integración que fortalecen el tejido social.", image: null },
        ],
      },
      {
        slug:             "club-deportivo-tcp",
        nombre:           "Club Deportivo TCP",
        categoria:        "Deporte",
        card_image:       "/images/procesos/ClubDeportivoTCP.webp",
        card_descripcion: "Nuestro Club Deportivo TCP es un proceso deportivo en formación de la disciplina de Fútbol de Salón el cual contiene la categoría Sub 12, Sub 15, Femenina y Juvenil.",
        header_title:    "Club Deportivo TCP",
        header_subtitle: "Fútbol de Salón",
        hero_layout:     "photo",
        hero_image:      "/images/procesos/deportivoTCP/ClubDeportivoTCP.webp",
        hero_descripcion: "El Club Deportivo TCP desarrolla procesos deportivos en Fútbol de Salón con 5 categorías activas. Más que un club, somos una escuela de vida donde el deporte construye carácter, disciplina y comunidad en la Cancha La Colinita.",
        pills: [
          { icon: "fa-futbol",        label: "Fútbol de Salón" },
          { icon: "fa-layer-group",   label: "5 Categorías" },
          { icon: "fa-location-dot",  label: "Colinita" },
          { icon: "fa-trophy",        label: "Competencias" },
        ],
        items: [
          { icon: "fa-star",          titulo: "Formación Integral",  descripcion: "Más que fútbol: formamos en valores, disciplina y trabajo en equipo desde las primeras edades.", image: "/images/procesos/deportivoTCP/catSub12.webp" },
          { icon: "fa-futbol",        titulo: "Competencia",         descripcion: "Participamos en torneos locales y de ciudad con nuestras 5 categorías, representando a la fundación.", image: "/images/procesos/deportivoTCP/catJuv.webp" },
          { icon: "fa-heart",         titulo: "Comunidad",           descripcion: "Somos una familia que crece junta, unida por el amor al deporte y el orgullo de representar el barrio.", image: "/images/procesos/deportivoTCP/catFem.webp" },
        ],
      },
      {
        slug:             "es-y-su",
        nombre:           "ES&SU",
        categoria:        "Emprendimiento",
        card_image:       "/images/procesos/esysu.webp",
        card_descripcion: "Microempresa de Estampados y Sublimación de Mugs, Camisas y Gorras basado en diseños personalizados y enfocado en el gusto y personalidad.",
        header_title:    "ES&SU",
        header_subtitle: "Estampación y Sublimación",
        hero_layout:     "photo",
        hero_image:      "/images/procesos/esysu/esysu1.webp",
        hero_descripcion: "ES&SU es una microempresa de estampados y sublimación especializada en diseños personalizados que resaltan el amor por el deporte, la cultura urbana y la identidad de cada persona.",
        pills: [
          { icon: "fa-shirt",         label: "Estampación" },
          { icon: "fa-mug-hot",       label: "Sublimación" },
          { icon: "fa-palette",       label: "Diseño a medida" },
          { icon: "fa-store",         label: "Microempresa" },
        ],
        items: [
          { icon: "fa-spray-can-sparkles", titulo: "Estampación",  descripcion: "Aplicamos tu diseño sobre camisas, gorras y más usando técnicas de alta calidad y durabilidad.", image: "/images/procesos/esysu/esysu1.webp" },
          { icon: "fa-fire",               titulo: "Sublimación",  descripcion: "Impresión permanente en mugs, telas y superficies especiales con colores vivos que no se borran.", image: "/images/procesos/esysu/esysu2.webp" },
          { icon: "fa-chalkboard-user",    titulo: "Capacitación", descripcion: "Talleres de formación en técnicas de estampación y sublimación para emprendedores y comunidad.", image: "/images/procesos/esysu/esysu3.webp" },
        ],
      },
      {
        slug:             "jovemp",
        nombre:           "Jovemp",
        categoria:        "Emprendimiento",
        card_image:       "/images/procesos/Jovemp.webp",
        card_descripcion: "Organización de Jóvenes Emprendedores que trabajan para que los emprendimientos y unidades productivas potencien su economía.",
        header_title:    "Jovemp",
        header_subtitle: "Jóvenes Emprendedores",
        hero_layout:     "logo",
        hero_image:      "/images/procesos/Jovemp.webp",
        hero_descripcion: "Jovemp es una organización de jóvenes emprendedores que trabajan para que los emprendimientos y unidades productivas potencien su economía y generen un impacto positivo en el sector donde se encuentran.",
        pills: [
          { icon: "fa-rocket",          label: "Emprendimiento" },
          { icon: "fa-handshake",       label: "Red empresarial" },
          { icon: "fa-store",           label: "Ferias y eventos" },
          { icon: "fa-chalkboard-user", label: "Capacitaciones" },
          { icon: "fa-lightbulb",       label: "Economía comunitaria" },
        ],
        items: [
          { icon: "fa-chalkboard-user", titulo: "Charlas y Capacitaciones", descripcion: "Periódicamente se hacen capacitaciones y charlas enfocadas en la gestión de recursos, administración y emprendimientos.", image: "/images/procesos/jovemp/jov1.webp" },
          { icon: "fa-handshake",       titulo: "Red de Empresarios",       descripcion: "Articulamos todos los negocios nuevos y emprendimientos que quieren promocionar sus productos y posicionarlos en el mercado.", image: "/images/procesos/jovemp/jov2.webp" },
          { icon: "fa-store",           titulo: "Ferias y Eventos",         descripcion: "Las ferias de emprendimiento y los eventos de empresarios nos ayudan a mostrar productos y servicios, aumentar ventas y posicionar marca.", image: "/images/procesos/jovemp/jov3.webp" },
        ],
      },
      {
        slug:             "liga-guayabal",
        nombre:           "Liga Guayabal",
        categoria:        "Deporte",
        card_image:       "/images/procesos/liga-guayabal.webp",
        card_descripcion: "Nuestra Liga es una de las más grandes en la comuna 15 en la disciplina de Fútbol de Salón, con más de 16 equipos compitiendo.",
        header_title:    "Liga Guayabal",
        header_subtitle: "Fuerza, Talento y Pasión",
        hero_layout:     "photo",
        hero_image:      "https://9f1e8b6678.cbaul-cdnwnd.com/f45d6ad1dd7b6dc007f12dd1e1390429/200000295-8075780758/440358189_970906848373047_8544846746088642923_n.jpeg",
        hero_descripcion: "La Liga Guayabal reúne a más de 16 equipos de la zona en la disciplina de Fútbol de Salón. Se disputa en la Cancha La Colinita #2 y es uno de los torneos más importantes de la comuna 15, promoviendo la sana convivencia, el deporte y la integración comunitaria.",
        pills: [
          { icon: "fa-futbol",       label: "Fútbol de Salón" },
          { icon: "fa-shield-halved",label: "16+ Equipos" },
          { icon: "fa-trophy",       label: "Liga #1 de la zona" },
          { icon: "fa-location-dot", label: "Guayabal" },
        ],
        items: [
          { icon: "fa-futbol",       titulo: "Competencia Deportiva",  descripcion: "Más de 16 equipos participan en emocionantes jornadas de Fútbol de Salón en la Cancha La Colinita.", image: null },
          { icon: "fa-handshake",    titulo: "Convivencia",            descripcion: "Fomentamos la sana convivencia y el respeto entre equipos y comunidades durante toda la temporada.", image: null },
          { icon: "fa-trophy",       titulo: "Liga #1 de la Zona",     descripcion: "Reconocida como la liga más grande de la commune 15, con crecimiento año tras año.", image: null },
        ],
      },
      {
        slug:             "torneo-barrial",
        nombre:           "Torneo Barrial",
        categoria:        "Deporte",
        card_image:       "/images/procesos/TorneoBarrial.webp",
        card_descripcion: "Nuestro Torneo lleva 4 años trabajando por la sana convivencia en Guayabal La Colinita, integrando a la comunidad y deportistas.",
        header_title:    "Torneo Barrial",
        header_subtitle: "Vamos pa' la cancha",
        hero_layout:     "photo",
        hero_image:      "https://9f1e8b6678.cbaul-cdnwnd.com/f45d6ad1dd7b6dc007f12dd1e1390429/200000283-1d1211d124/IMG-20231220-WA0010.jpeg",
        hero_descripcion: "Nuestro Torneo lleva 4 años trabajando por la sana convivencia en Guayabal La Colinita como acción social en el territorio. En la disciplina de Fútbol de Salón, muchos buenos deportistas han pasado por el escenario deportivo de la Cancha La Colinita #2.",
        pills: [
          { icon: "fa-futbol",           label: "Fútbol de Salón" },
          { icon: "fa-calendar-check",   label: "4 Ediciones" },
          { icon: "fa-people-group",     label: "Comunidad" },
          { icon: "fa-location-dot",     label: "Colinita" },
        ],
        items: [
          { icon: "fa-futbol",           titulo: "Torneo Comunitario",   descripcion: "4 años integrando la comunidad de Guayabal La Colinita a través del deporte en equipo.", image: null },
          { icon: "fa-people-group",     titulo: "Integración Social",   descripcion: "Un espacio para deportistas y comunidad, promoviendo la sana convivencia en la cancha.", image: null },
          { icon: "fa-handshake",        titulo: "Acción Social",        descripcion: "Más que un torneo, es una acción social que transforma el territorio desde el deporte.", image: null },
        ],
      },
      {
        slug:             "grupo-ambiental",
        nombre:           "Grupo Ambiental Juvenil TCP",
        categoria:        "Ambiente",
        card_image:       "/images/procesos/grupoAmbiental.webp",
        card_descripcion: "Somos una organización de líderes ambientales que trabaja en pro del medio ambiente y sus buenas prácticas ambientales.",
        header_title:    "Grupo Ambiental Juvenil",
        header_subtitle: "TCP",
        hero_layout:     "logo",
        hero_image:      "/images/procesos/grupoAmbiental.webp",
        hero_descripcion: "Somos una organización de líderes ambientales que trabaja en pro del medio ambiente y sus buenas prácticas ambientales. Desde la fundación, promovemos la conciencia ecológica y el cuidado del entorno en nuestras comunidades.",
        pills: [
          { icon: "fa-leaf",           label: "Medio ambiente" },
          { icon: "fa-recycle",        label: "Reciclaje" },
          { icon: "fa-seedling",       label: "Sostenibilidad" },
          { icon: "fa-users",          label: "Liderazgo juvenil" },
          { icon: "fa-earth-americas", label: "Conciencia ecológica" },
        ],
        items: [
          { icon: "fa-chalkboard-user", titulo: "Educación Ambiental",  descripcion: "Talleres y jornadas formativas para jóvenes y comunidades sobre el cuidado del medio ambiente.", image: null },
          { icon: "fa-recycle",         titulo: "Buenas Prácticas",     descripcion: "Promovemos el reciclaje, la reducción de residuos y el uso responsable de los recursos naturales.", image: null },
          { icon: "fa-star",            titulo: "Liderazgo Juvenil",    descripcion: "Formamos líderes ambientales comprometidos con la transformación de su entorno comunitario.", image: null },
        ],
      },
      {
        slug:             "aga-productions",
        nombre:           "A.G.A. Productions",
        categoria:        "Cultura",
        card_image:       "/images/procesos/AGA.webp",
        card_descripcion: "Organización de Artistas del género urbano y electrónico cuyo enfoque está basado en la producción de música y generación de eventos y shows para la comunidad.",
        header_title:    "A.G.A. Productions",
        header_subtitle: "Música · Eventos · Comunidad",
        hero_layout:     "logo",
        hero_image:      "/images/procesos/AGA.webp",
        hero_descripcion: "Organización de Artistas del género urbano y electrónico cuyo enfoque está basado en la producción de música y generación de eventos y shows para nuestra comunidad.",
        pills: [
          { icon: "fa-music",       label: "Música urbana" },
          { icon: "fa-bolt",        label: "Electrónica" },
          { icon: "fa-calendar-days",label: "Eventos y shows" },
          { icon: "fa-microphone",  label: "Producción" },
          { icon: "fa-users",       label: "Comunidad" },
        ],
        items: [
          { icon: "fa-sliders",       titulo: "Producción Musical",    descripcion: "Producción y mezcla de audio profesional para artistas del género urbano y electrónico.", image: "/images/procesos/aga/aga3.webp" },
          { icon: "fa-star",          titulo: "Eventos y Shows",       descripcion: "Organizamos y producimos eventos y shows para la comunidad, generando espacios de entretenimiento.", image: "/images/procesos/aga/aga1.webp" },
          { icon: "fa-compact-disc",  titulo: "Artistas y Proyectos",  descripcion: "Impulsamos artistas y proyectos musicales de la comunidad, brindando apoyo en producción y difusión.", image: "/images/procesos/aga/aga2.webp" },
        ],
      },
      {
        slug:             "natural-woman",
        nombre:           "Natural Woman",
        categoria:        "Social",
        card_image:       "/images/procesos/NaturalWoman.webp",
        card_descripcion: "Somos una organización de mujeres empoderadas de su imagen y cuerpo natural, que busca que cada mujer se sienta segura de su cuerpo y aumente su autoestima.",
        header_title:    "Natural Woman",
        header_subtitle: "Mujeres Empoderadas",
        hero_layout:     "photo",
        hero_image:      "/images/procesos/naturalWoman/woman3.webp",
        hero_descripcion: "Somos un proyecto de modelos con enfoque social que busca aumentar la autoestima y la seguridad sobre el cuerpo femenino, generando confianza y mitigando los tabús que tiene la sociedad sobre la mujer.",
        pills: [
          { icon: "fa-heart",  label: "Autoestima" },
          { icon: "fa-camera", label: "Modelaje" },
          { icon: "fa-users",  label: "Proyecto social" },
          { icon: "fa-star",   label: "Empoderamiento" },
        ],
        items: [
          { icon: "fa-chalkboard-user", titulo: "Charlas y Capacitaciones", descripcion: "Encuentros, charlas y capacitaciones enfocadas en el modelaje, la autoestima y el impacto social del cuerpo femenino.", image: "/images/procesos/naturalWoman/woman1.webp" },
          { icon: "fa-calendar-days",   titulo: "Eventos de Modelaje",      descripcion: "Eventos que buscan mostrar la naturaleza del cuerpo femenino, rompiendo tabús y paradigmas sociales.", image: "/images/procesos/naturalWoman/woman2.webp" },
          { icon: "fa-camera",          titulo: "Estudio Audiovisual",      descripcion: "Sesiones fotográficas, producción de video y presentaciones para visibilizar a las participantes.", image: null },
        ],
      },
      {
        slug:             "cronicas-y-pasion-deportiva",
        nombre:           "Crónicas y Pasión Deportiva",
        categoria:        "Cultura",
        card_image:       "/images/procesos/CyP_Deportiva.webp",
        card_descripcion: "Programa deportivo donde se habla y debate temas del deporte a nivel nacional e internacional. Analizando detalladamente deportistas, equipos y disciplinas.",
        header_title:    "Crónicas y Pasión Deportiva",
        header_subtitle: "Programa deportivo",
        hero_layout:     "logo",
        hero_image:      "/images/procesos/CyP_Deportiva.webp",
        hero_descripcion: "Programa donde se habla y debate sobre temas del deporte a nivel nacional e internacional, analizando detalladamente deportistas, equipos y disciplinas.",
        pills: [
          { icon: "fa-comments",   label: "Debate" },
          { icon: "fa-trophy",     label: "Pronósticos" },
          { icon: "fa-newspaper",  label: "Noticias deportivas" },
          { icon: "fa-futbol",     label: "Fútbol" },
          { icon: "fa-globe",      label: "Nacional e internacional" },
        ],
        items: [
          { icon: "fa-comments",   titulo: "Debate Deportivo",      descripcion: "Se habla sobre el deporte y se discute con argumentos las decisiones deportivas. Un espacio para la opinión informada.", image: "/images/procesos/cronicas/cronicas1.webp" },
          { icon: "fa-trophy",     titulo: "TC Play — Pronósticos", descripcion: "Generamos las probabilidades que puedan suceder en los resultados deportivos. Analiza, pronostica y demuestra cuánto sabes.", image: "/images/procesos/cronicas/cronicas2.webp" },
          { icon: "fa-newspaper",  titulo: "Información Deportiva", descripcion: "Noticias y sucesos importantes para informar a la comunidad deportiva sobre el deporte nacional e internacional.", image: "/images/procesos/cronicas/cronicas3.webp" },
        ],
      },
      {
        slug:             "tcplay",
        nombre:           "TC Play",
        categoria:        "Cultura",
        card_image:       "/images/procesos/TCPlay.webp",
        card_descripcion: "Este es el espacio para pronosticar y acertar resultados del deporte.",
        header_title:    "TC Play",
        header_subtitle: "¡Sé el más Tezo!",
        hero_layout:     "logo",
        hero_image:      "/images/procesos/TCPlay.webp",
        hero_descripcion: "TC Play es el espacio para pronosticar y acertar resultados del deporte. La página se actualiza constantemente con nuevos paquetes para que demuestres cuánto sabes de fútbol.",
        pills: [
          { icon: "fa-futbol",      label: "Pronósticos" },
          { icon: "fa-trophy",      label: "Acumulado" },
          { icon: "fa-bolt",        label: "¡Sé el más Tezo!" },
          { icon: "fa-chart-line",  label: "Resultados deportivos" },
        ],
        items: [
          { icon: "fa-futbol",     titulo: "Pronósticos Deportivos", descripcion: "Pronostica y acierta resultados del deporte. Participa en cada paquete para ganar el acumulado.", image: null },
          { icon: "fa-trophy",     titulo: "Paquetes y Acumulado",   descripcion: "Classic, Premium y Platinum: elige tu paquete y demuestra cuánto sabes de fútbol.", image: null },
          { icon: "fa-users",      titulo: "Comunidad",              descripcion: "Juega con la comunidad, compite y llévate el reconocimiento de ser el más Tezo.", image: null },
        ],
      },
    ],
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// getContent — para Server Components del sitio público.
// Hace shallow merge con los defaults para que siempre existan todas las claves.
// ─────────────────────────────────────────────────────────────────────────────
export async function getContent(section) {
  noStore(); // always fetch fresh — never serve stale cached content
  const supabase = await createClient();
  const { data } = await supabase
    .from("site_content")
    .select("data")
    .eq("id", section)
    .single();

  const defaults = CONTENT_DEFAULTS[section] ?? {};
  const dbData   = data?.data ?? {};

  // Deep merge for procesos: merge each process by slug so defaults are never lost
  if (section === "procesos" && Array.isArray(defaults.processes)) {
    const defaultMap = Object.fromEntries(defaults.processes.map((p) => [p.slug, p]));
    const dbProcesses = Array.isArray(dbData.processes) ? dbData.processes : [];
    const dbMap = Object.fromEntries(dbProcesses.map((p) => [p.slug, p]));

    const merged = defaults.processes.map((def) => {
      const db = dbMap[def.slug] ?? {};
      return {
        ...def,
        ...db,
        // Preserve default image paths when DB has empty strings
        card_image:  db.card_image  || def.card_image,
        hero_image:  db.hero_image  || def.hero_image,
        hero_layout: db.hero_layout || def.hero_layout,
        pills: Array.isArray(db.pills) && db.pills.length  ? db.pills  : def.pills,
        items: Array.isArray(db.items) && db.items.length  ? db.items  : def.items,
      };
    });

    return { ...defaults, ...dbData, processes: merged };
  }

  return mergeWithArrayFallback(defaults, dbData);
}

// Merge helper: for each key where the default is a non-empty array,
// keep the default if the DB value is missing, empty, or all items have no content.
function mergeWithArrayFallback(defaults, dbData) {
  const result = { ...defaults, ...dbData };
  for (const [key, defVal] of Object.entries(defaults)) {
    if (Array.isArray(defVal) && defVal.length > 0) {
      const dbVal = dbData[key];
      const dbIsEmpty =
        !Array.isArray(dbVal) ||
        dbVal.length === 0 ||
        dbVal.every((item) =>
          typeof item === "object" && item !== null
            ? Object.values(item).every((v) => !v)
            : !item
        );
      if (dbIsEmpty) {
        result[key] = defVal;
      }
    }
  }
  return result;
}

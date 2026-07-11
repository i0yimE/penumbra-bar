/* =============================================================
   PENUMBRA — datos editables de la web
   Abre este archivo con el Bloc de notas para cambiar textos,
   teléfono, cócteles, sesiones o fotos. Guarda y ya está.
   No toques las comillas ni las comas — si rompes una, la web
   puede dejar de leer los datos.
   ============================================================= */
(function () {
  "use strict";

  window.__PENUMBRA__ = {

    brand: {
      name: "Penumbra",
      slogan: "Donde la noche baja la voz.",
      kicker: "Bar de copas · Coctelería de autor",
      area: "Malasaña · Madrid",
      address: "Calle del Pez 18, Malasaña, Madrid",
      metro: "Metro Noviciado / Tribunal",
      phone: "910 22 33 44",
      phoneHref: "tel:+34910223344",
      whatsapp: "34910223344",
      instagram: "@penumbra.madrid",
      instagramUrl: "https://instagram.com/penumbra.madrid",
      schedule: "Miércoles a domingo · 19:00 → 02:30",
      scheduleShort: "MIÉ → DOM · 19:00 → 02:30",
      capacity: 60,
      established: "EST. 2024 · MAD",
      mapsEmbed: "https://www.google.com/maps?q=Calle+del+Pez+18,+Madrid&output=embed"
    },

    cocktails: [
      {
        id: "penumbra",
        name: "Penumbra",
        series: "Casa",
        glass: "coupe",
        subtitle: "La copa de la casa",
        ingredients: ["Mezcal ahumado", "Vermut oscuro", "Toque de café"],
        description: "Ahumado, amargo y largo. Un sorbo lento para empezar la noche en su tono justo. Copa coupe sobre hielo de mano.",
        liquid: "#7a2a1c",
        accent: "#FF3D8B"
      },
      {
        id: "neon",
        name: "Neón",
        series: "Casa",
        glass: "highball",
        subtitle: "Gin tonic de autor",
        ingredients: ["Ginebra cítrica", "Tónica seca", "Piel de pomelo"],
        description: "Burbuja viva, cítrico afilado y un brillo que recuerda al letrero de la entrada. Highball alto, hielo limpio.",
        liquid: "#3DE2FF",
        accent: "#3DE2FF"
      },
      {
        id: "medianoche",
        name: "Medianoche",
        series: "Casa",
        glass: "martini",
        subtitle: "Espresso martini",
        ingredients: ["Espresso reciente", "Vodka", "Licor de café"],
        description: "Café recién hecho y vodka helado, batido hasta dejar la espuma del color del cobre. Para la hora en que la pista calienta.",
        liquid: "#1c0e08",
        accent: "#C9A35B"
      },
      {
        id: "brasa",
        name: "Brasa",
        series: "Casa",
        glass: "old_fashioned",
        subtitle: "Negroni con tequila",
        ingredients: ["Tequila reposado", "Campari", "Vermut rojo"],
        description: "Negroni reescrito con el ahumado del tequila reposado. Old fashioned, hielo macizo, piel de naranja quemada al pase.",
        liquid: "#b73422",
        accent: "#FF3D8B"
      },
      {
        id: "vermut-negro",
        name: "Vermut Negro",
        series: "Temporada",
        glass: "rocks",
        subtitle: "Vermut largo de la casa",
        ingredients: ["Vermut casa", "Naranja confitada", "Hielo macizo"],
        description: "Vermut servido sobre hielo de mano, con una naranja confitada en la propia barra. Pensado para los que entran y aún no piden.",
        liquid: "#3a1a0e",
        accent: "#C9A35B"
      },
      {
        id: "sereno",
        name: "Sereno",
        series: "Temporada",
        glass: "wine",
        subtitle: "Spritz oscuro",
        ingredients: ["Aperol", "Cava seco", "Soda"],
        description: "Spritz reescrito en clave nocturna. Aperol, cava seco y soda fría. Para empezar sin pesar.",
        liquid: "#cc4a26",
        accent: "#FF3D8B"
      },
      {
        id: "aurora",
        name: "Aurora",
        series: "Temporada",
        glass: "flute",
        subtitle: "French 75 con vermut",
        ingredients: ["Cava brut", "Ginebra", "Limón"],
        description: "Cava, ginebra y un toque de vermut blanco. Sube rápido, baja despacio.",
        liquid: "#e8c780",
        accent: "#C9A35B"
      },
      {
        id: "ultima-hora",
        name: "Última Hora",
        series: "Temporada",
        glass: "mug",
        subtitle: "Café final de noche",
        ingredients: ["Espresso", "Ron añejo", "Crema"],
        description: "Para los que se quedan al cierre. Espresso, ron añejo y una nube de crema. Servido en taza pequeña.",
        liquid: "#1a0d05",
        accent: "#C9A35B"
      },
      {
        id: "veneno",
        name: "Veneno",
        series: "Temporada",
        glass: "snifter",
        subtitle: "Pisco sour de la casa",
        ingredients: ["Pisco", "Limón", "Cardamomo"],
        description: "Pisco peruano, limón y un golpe de cardamomo verde. Suave en boca, largo en cabeza.",
        liquid: "#d8c272",
        accent: "#3DE2FF"
      },
      {
        id: "vertigo",
        name: "Vértigo",
        series: "Temporada",
        glass: "hurricane",
        subtitle: "Mai tai oscuro",
        ingredients: ["Ron añejo", "Curaçao seco", "Lima"],
        description: "Mai tai reescrito con ron añejo y curaçao seco. La copa que se pide cuando ya hay confianza.",
        liquid: "#a8341a",
        accent: "#FF3D8B"
      }
    ],

    sessions: [
      {
        day: "Jueves",
        genre: "Soul & Funk",
        line: "Vinilo entero, sin prisa.",
        icon: "vinyl",
        accent: "#C9A35B"
      },
      {
        day: "Viernes",
        genre: "House",
        line: "Selección de la casa.",
        icon: "house",
        accent: "#FF3D8B"
      },
      {
        day: "Sábado",
        genre: "Disco & Nu-Disco",
        line: "Pista llena, pies sueltos.",
        icon: "disco",
        accent: "#3DE2FF"
      },
      {
        day: "Domingo",
        genre: "Jazz & Electrónica suave",
        line: "Sesión lenta para cerrar la semana.",
        icon: "wave",
        accent: "#C9A35B"
      }
    ],

    gallery: [
      { id: "gallery-01", alt: "Cóctel entre humo en Penumbra" },
      { id: "gallery-02", alt: "Luz de neón rosa en la barra" },
      { id: "gallery-03", alt: "Copa de whisky con hielo macizo" },
      { id: "gallery-04", alt: "Sirviendo un cóctel de autor" },
      { id: "gallery-05", alt: "Burbujas de cava en primer plano" },
      { id: "gallery-06", alt: "Neón cian iluminando la sala" },
      { id: "gallery-07", alt: "Ambiente de la barra en penumbra" },
      { id: "gallery-08", alt: "Hielo macizo en macro" },
      { id: "gallery-09", alt: "Copa martini sobre fondo oscuro" },
      { id: "gallery-10", alt: "Gin tonic con burbujas" },
      { id: "gallery-11", alt: "Humo y ambiente nocturno" },
      { id: "gallery-12", alt: "Espresso martini recién servido" },
      { id: "gallery-13", alt: "Letrero de neón en la noche" },
      { id: "gallery-14", alt: "Botellas en la barra de Penumbra" },
      { id: "gallery-15", alt: "Sirviendo whisky en macro" },
      { id: "gallery-16", alt: "Vela y mesa en penumbra" }
    ]
  };
})();

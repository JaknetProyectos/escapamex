export type Tarifa = {
  cantidadLabel: string; // "1 - 3", "7+"
  min: number;
  max: number | null; // null = sin límite (ej: 7+)
  precioPorPersona: number;
  moneda: string;
};

export interface Experience {
  id: string;
  slug: string;
  title: string;
  category: string;
  description: string;
  shortDescription: string;
  tafiras?: Tarifa[];
  price: number;
  priceMax?: number;
  currency: string;
  image: string;
  images: string[];
  included: string[];
  duration: string;
  location: string;
  rating: number;
  reviews: number;
  featured: boolean;
}

export const experiences: Experience[] = [
  {
    id: "1",
    slug: "chichen-itza-historia-espectaculo-nocturno",
    title: "Experiencia Chichén Itzá: Historia & Espectáculo Nocturno",
    category: "Tours Yucatán & Caribe",
    description: "Vive una experiencia única en Chichén Itzá, una de las Nuevas 7 Maravillas del Mundo. Disfruta de un recorrido histórico durante el día y un espectáculo de luces nocturno que te transportará a la época de los mayas.",
    shortDescription: "Recorrido histórico y espectáculo de luces en Chichén Itzá",
    price: 2120,
    currency: "MXN",
    image: "https://images.unsplash.com/photo-1518638150340-f706e86654de?w=600&h=400&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1518638150340-f706e86654de?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1570737209810-87a8e7245f88?w=800&h=600&fit=crop"
    ],
    included: ["Transporte", "Guía certificado", "Entrada al sitio", "Cena buffet", "Espectáculo nocturno"],
    duration: "12 horas",
    location: "Yucatán",
    rating: 4.9,
    reviews: 156,
    featured: true
  },
  {
    id: "2",
    slug: "cozumel-reef-adventure",
    title: "Experiencia Cozumel Reef Adventure",
    category: "Tours Yucatán & Caribe",
    description: "Explora los arrecifes más hermosos del Caribe Mexicano. Snorkel en aguas cristalinas, observa la vida marina y disfruta de las playas paradisíacas de Cozumel.",
    shortDescription: "Snorkel en los arrecifes de Cozumel",
    price: 5120,
    currency: "MXN",
    image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=600&h=400&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1559825481-12a05cc00344?w=800&h=600&fit=crop"
    ],
    included: ["Ferry ida y vuelta", "Equipo de snorkel", "Guía marino", "Almuerzo", "Bebidas"],
    duration: "8 horas",
    location: "Cozumel, Quintana Roo",
    rating: 4.8,
    reviews: 98,
    featured: true
  },
  {
    id: "3",
    slug: "desierto-camellos",
    title: "Experiencia Desierto & Camellos",
    category: "Los Cabos",
    description: "Una aventura única en el desierto de Los Cabos. Pasea en camello por paisajes desérticos espectaculares y disfruta de vistas increíbles del Mar de Cortés.",
    shortDescription: "Paseo en camello por el desierto de Los Cabos",
    price: 2200,
    currency: "MXN",
    image: "https://images.unsplash.com/photo-1452421822248-d4c2b47f0c81?w=600&h=400&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1452421822248-d4c2b47f0c81?w=800&h=600&fit=crop"
    ],
    included: ["Paseo en camello", "Guía experto", "Snacks y bebidas", "Fotografías"],
    duration: "3 horas",
    location: "Los Cabos, BCS",
    rating: 4.7,
    reviews: 67,
    featured: false
  },
  {
    id: "4",
    slug: "encuentro-marino-tortugas-arrecifes",
    title: "Experiencia Encuentro Marino: Tortugas & Arrecifes",
    category: "Tours Yucatán & Caribe",
    description: "Nada junto a las majestuosas tortugas marinas en su hábitat natural. Una experiencia inolvidable de conexión con la naturaleza en las aguas del Caribe Mexicano.",
    shortDescription: "Nado con tortugas marinas en el Caribe",
    price: 1750,
    currency: "MXN",
    image: "https://images.unsplash.com/photo-1591025207163-942350e47db2?w=600&h=400&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1591025207163-942350e47db2?w=800&h=600&fit=crop"
    ],
    included: ["Equipo de snorkel", "Guía certificado", "Transporte marítimo", "Seguro"],
    duration: "4 horas",
    location: "Akumal, Quintana Roo",
    rating: 4.9,
    reviews: 203,
    featured: true
  },
  {
    id: "5",
    slug: "globo-teotihuacan-basilica",
    title: "Experiencia Globo Teotihuacán & Basílica",
    category: "Experiencias Destacadas",
    description: "Vuela en globo aerostático sobre las pirámides de Teotihuacán al amanecer. Una experiencia mágica que incluye visita a la Basílica de Guadalupe.",
    shortDescription: "Vuelo en globo sobre Teotihuacán y visita a la Basílica",
    price: 5600,
    currency: "MXN",
    image: "https://images.unsplash.com/photo-1507608616759-54f48f0af0ee?w=600&h=400&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1507608616759-54f48f0af0ee?w=800&h=600&fit=crop"
    ],
    included: ["Vuelo en globo", "Brindis con champagne", "Desayuno", "Transporte", "Visita guiada"],
    duration: "8 horas",
    location: "Estado de México",
    rating: 5.0,
    reviews: 312,
    featured: true
  },
  {
    id: "6",
    slug: "hierve-el-agua-naturaleza-unica",
    title: "Experiencia Hierve el Agua: Naturaleza Única",
    category: "Oaxaca",
    description: "Visita las cascadas petrificadas de Hierve el Agua, un fenómeno natural único en el mundo. Disfruta de pozas naturales con vistas espectaculares.",
    shortDescription: "Cascadas petrificadas y pozas naturales en Oaxaca",
    price: 1150,
    currency: "MXN",
    image: "https://images.unsplash.com/photo-1682687220742-aba13b6e50ba?w=600&h=400&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1682687220742-aba13b6e50ba?w=800&h=600&fit=crop"
    ],
    included: ["Transporte", "Guía local", "Entrada", "Snacks"],
    duration: "6 horas",
    location: "Oaxaca",
    rating: 4.6,
    reviews: 89,
    featured: false
  },
  {
    id: "7",
    slug: "holbox-escape-paraiso-natural",
    title: "Experiencia Holbox Escape: Paraíso Natural",
    category: "Tours Yucatán & Caribe",
    description: "Escapa a la isla de Holbox, un paraíso de playas vírgenes, aguas turquesas y naturaleza salvaje. Observa flamencos y disfruta de la tranquilidad.",
    shortDescription: "Escape a la isla paradisíaca de Holbox",
    price: 2780,
    currency: "MXN",
    image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&h=400&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&h=600&fit=crop"
    ],
    included: ["Transporte terrestre y marítimo", "Tour en carrito de golf", "Almuerzo", "Observación de flamencos"],
    duration: "12 horas",
    location: "Holbox, Quintana Roo",
    rating: 4.8,
    reviews: 145,
    featured: true
  },
  {
    id: "8",
    slug: "isla-mujeres-premium-sailing",
    title: "Experiencia Isla Mujeres Premium Sailing",
    category: "Tours Yucatán & Caribe",
    description: "Navega en un catamarán de lujo hacia Isla Mujeres. Incluye snorkel, barra libre, música y tiempo libre en la isla.",
    shortDescription: "Navegación premium en catamarán a Isla Mujeres",
    price: 3020,
    currency: "MXN",
    image: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=600&h=400&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=800&h=600&fit=crop"
    ],
    included: ["Navegación en catamarán", "Barra libre", "Snorkel", "Almuerzo buffet", "Tiempo libre"],
    duration: "8 horas",
    location: "Cancún - Isla Mujeres",
    rating: 4.7,
    reviews: 178,
    featured: false
  },
  {
    id: "9",
    slug: "lucha-libre-vip",
    title: "Experiencia Lucha Libre VIP",
    category: "Experiencias Destacadas",
    description: "Vive la auténtica lucha libre mexicana desde asientos VIP. Incluye máscara de luchador, bebidas y la mejor vista del espectáculo.",
    shortDescription: "Lucha libre mexicana con acceso VIP",
    price: 1750,
    currency: "MXN",
    image: "https://images.unsplash.com/photo-1552053831-71594a27632d?w=600&h=400&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1552053831-71594a27632d?w=800&h=600&fit=crop"
    ],
    included: ["Boleto VIP", "Máscara de luchador", "Transporte", "Bebidas", "Snacks"],
    duration: "4 horas",
    location: "Ciudad de México",
    rating: 4.9,
    reviews: 234,
    featured: true
  },
  {
    id: "10",
    slug: "xcaret-total-experience",
    title: "Experiencia Xcaret Total Experience",
    category: "Tours Yucatán & Caribe",
    description: "El parque eco-arqueológico más famoso de México. Ríos subterráneos, snorkel, cultura maya, show nocturno y mucho más.",
    shortDescription: "Día completo en el parque Xcaret",
    price: 6090,
    currency: "MXN",
    image: "https://images.unsplash.com/photo-1682687220742-aba13b6e50ba?w=600&h=400&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1682687220742-aba13b6e50ba?w=800&h=600&fit=crop"
    ],
    included: ["Entrada al parque", "Todas las actividades", "Buffet", "Show nocturno", "Transporte"],
    duration: "12 horas",
    location: "Riviera Maya",
    rating: 4.9,
    reviews: 456,
    featured: true
  },
  {
    id: "11",
    slug: "playas-escondidas-snorkel",
    title: "Experiencia Playas Escondidas & Snorkel",
    category: "Puerto Vallarta",
    description: "Descubre las playas secretas de Puerto Vallarta solo accesibles por mar. Snorkel en aguas cristalinas y relajación en paradisíacas playas.",
    shortDescription: "Playas secretas y snorkel en Puerto Vallarta",
    price: 1800,
    currency: "MXN",
    image: "https://images.unsplash.com/photo-1519046904884-53103b34b206?w=600&h=400&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1519046904884-53103b34b206?w=800&h=600&fit=crop"
    ],
    included: ["Transporte marítimo", "Equipo snorkel", "Almuerzo", "Bebidas", "Guía"],
    duration: "6 horas",
    location: "Puerto Vallarta",
    rating: 4.6,
    reviews: 112,
    featured: false
  },
  {
    id: "12",
    slug: "taller-alebrijes-arte-oaxaqueno",
    title: "Experiencia Taller de Alebrijes: Arte Oaxaqueño",
    category: "Oaxaca",
    description: "Aprende el arte tradicional de crear alebrijes con artesanos locales. Pinta tu propia figura y llévala como recuerdo único.",
    shortDescription: "Taller de alebrijes con artesanos oaxaqueños",
    price: 1200,
    currency: "MXN",
    image: "https://images.unsplash.com/photo-1582555172866-f73bb12a2ab3?w=600&h=400&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1582555172866-f73bb12a2ab3?w=800&h=600&fit=crop"
    ],
    included: ["Materiales", "Instrucción", "Tu alebrije terminado", "Snacks", "Bebida tradicional"],
    duration: "4 horas",
    location: "Oaxaca",
    rating: 4.8,
    reviews: 76,
    featured: false
  }
];

// Simulate API delay
export const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

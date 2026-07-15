// src/client/config/site.config.ts
// Configuração visual e institucional — MARIBELA

export const siteConfig = {
  nome: "Maribela",

  // ───────────────── LOGO ─────────────────
  logoHorizontal: "/logo-maribela-horizontal.png",
  logoVertical: "/logo-maribela-vertical.png",
  logoAlt: "Logo Maribela Art & Crochê",

  // ───────────────── WHATSAPP ─────────────────
  whatsapp: "5521965907833",
  whatsappDisplay: "(21) 96590-7833",
  whatsappMensagem:
    "Olá! Vim pelo site da Maribela e gostaria de mais informações sobre as peças em crochê.",

  // ───────────────── HEADER ─────────────────
  headerCta: "Fazer encomenda",

  // Redes sociais
  instagram: "@soumaribela",
  facebook: "",
  tiktok: "",

  cidade: "Rio de Janeiro, RJ",

  // ───────────────── NAVEGAÇÃO DESKTOP ─────────────────
  navLinks: [
    { label: "Início", href: "/" },
    { label: "Coleção", href: "/loja" },
    { label: "Sobre", href: "/sobre" },
    { label: "Blog", href: "/blog" },
    { label: "Contato", href: "https://wa.me/5521965907833" },
  ],

  // ───────────────── NAVEGAÇÃO MOBILE ─────────────────
  mobileNavLinks: [
    { label: "Início", href: "/" },
    { label: "Coleção", href: "/loja" },
    { label: "Sobre", href: "/sobre" },
    { label: "Blog", href: "/blog" },
    { label: "Carrinho", href: "/loja/carrinho" },
    { label: "Contato", href: "https://wa.me/5521965907833" },
  ],

  // ───────────────── BENEFÍCIOS ─────────────────
  benefits: [
    {
      title: "Feito à mão",
      description:
        "Cada peça é produzida artesanalmente com cuidado, autenticidade e acabamento delicado.",
    },
    {
      title: "Estilo atemporal",
      description:
        "Crochê moderno e elegante para compor looks leves, femininos e sofisticados.",
    },
    {
      title: "Conforto & exclusividade",
      description:
        "Peças únicas com toque macio, design contemporâneo e personalidade própria.",
    },
  ],

  // ───────────────── FOOTER LINKS ─────────────────
  footerNavLinks: [
    { label: "Início", href: "/" },
    { label: "Coleção", href: "/loja" },
    { label: "Sobre", href: "/sobre" },
    { label: "Blog", href: "/blog" },
    { label: "Contato", href: "https://wa.me/5521965907833" },
  ],

  // ───────────────── FOOTER ─────────────────
  footerDescription:
    "A Maribela transforma o crochê artesanal em peças modernas, elegantes e acolhedoras para mulheres que valorizam autenticidade e estilo.",

  copyrightTagline:
    "Maribela • Amor e dedicação em cada laçada",

  // ───────────────── SEO ─────────────────
  seo: {
    titulo: "Crochê feminino artesanal | Bolsas, tops e vestidos | Maribela",
    descricao:
      "Compre crochê feminino artesanal online: bolsas, tops, vestidos e acessórios feitos à mão com design autoral e entrega para todo o Brasil.",

    url: "https://www.maribela.com.br",

    ogImage: "/og-image.png",

    keywords: [
      "crochê moderno",
      "crochê feminino",
      "moda artesanal",
      "crochê elegante",
      "looks com crochê",
      "crochê contemporâneo",
      "peças artesanais",
      "crochê fashion",
      "moda handmade",
      "crochê feminino artesanal",
    "bolsa de crochê",
    "top de crochê",
    "vestido de crochê",
    "crochê feito à mão",
    "crochê online",
    "moda artesanal feminina",
    "acessórios de crochê",
    "crochê sob encomenda",
    "comprar crochê online",
      "Maribela",
    ],
  },

   // ─── Instalação Off-Line do site no tablet ────────────────────────────────────────
  pwa: {
  enabled: true,

  shortName: "Maribela",

  orientation: "any" as const,

  icon192: "/pwa/icon-192.png",
  icon512: "/pwa/icon-512.png",
  maskableIcon512: "/pwa/icon-maskable-512.png",
  appleTouchIcon: "/pwa/apple-touch-icon.png",

  offlineRoutes: [
    "/",
    "/sobre",
    "/loja",
    "/blog",
  ],
},

  // ─── TEMA VISUAL ────────────────────────────────────────
  theme: {
    bgPrimary: "#F2F0EF",
    bgSecondary: "#FAF9F6",
    bgTertiary: "#FFFFFF",
    bgCard: "#FFFFFF",
    bgHover: "#EAE5E1",
    overlay: "#4D3828",

    textPrimary: "#4D3828",
    textSecondary: "#6B5A4C",
    textTertiary: "#8C7B6D",
    textMuted: "#9CA3AF",
    textLight: "#FFFFFF",
    textHeroMuted: "#EFE7E2",

  // 🎯 CORES PRINCIPAIS DO CLIENTE
    accent: "#9FB7B5",
    accentHover: "#FF8CA6",
    accentLight: "#FFD1DB",

    error: "#DC2626",
    success: "#16A34A",
    info: "#9FB7B5",

    border: "#DDD6D1",
    borderLight: "#EEE7E2",

    adminBg: "#FFFFFF",
    adminText: "#4D3828",
    adminBorder: "#DDD6D1",
  },
}

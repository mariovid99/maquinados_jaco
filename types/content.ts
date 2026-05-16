export interface SiteContent {
  _version: number;
  _updated: string;

  hero: HeroContent;
  stats: StatItem[];
  nosotros: NosotrosContent;
  historia: HistoriaContent;
  rd: ResearchContent;
  precision: PrecisionContent;
  soldadura: SoldaduraContent;
  procesoSoluciones: ProcesoContent;
  tecnologia: TecnologiaContent;
  servicios: ServiciosContent;
  comercializacion: ComercializacionContent;
  clientes: ClienteItem[];
  testimonios: TestimonioItem[];
  faq: FaqItem[];
  ctaBanner: CtaBannerContent;
  contacto: ContactoContent;
  footer: FooterContent;
}

export interface HeroContent {
  badge: string;
  headline_line1: string;
  headline_accent: string;
  headline_line3: string;
  subheading: string;
  cta_primary_text: string;
  cta_primary_href: string;
  cta_secondary_text: string;
  cta_secondary_href: string;
  inline_stats: string;
  bg_image_url: string;
  bg_video_url?: string;
}

export interface StatItem {
  value: number;
  suffix: string;
  label: string;
}

export interface NosotrosContent {
  label: string;
  headline: string;
  desc1: string;
  desc2: string;
  pilares: PilarItem[];
}

export interface PilarItem {
  icon: string;
  title: string;
  description: string;
}

export interface HistoriaContent {
  label: string;
  headline: string;
  subtitle: string;
  hitos: HitoItem[];
}

export interface HitoItem {
  id: string;
  year: string;
  title: string;
  description: string;
  image_url?: string;
}

export interface ResearchContent {
  label: string;
  headline: string;
  desc1: string;
  desc2: string;
  enfoque_title: string;
  enfoque_desc: string;
  image_url: string;
}

export interface PrecisionContent {
  label: string;
  headline_line1: string;
  headline_line2: string;
  desc1: string;
  desc2: string;
  galeria: GaleriaItem[];
}

export interface GaleriaItem {
  id: string;
  caption: string;
  image_url: string;
  alt: string;
}

export interface SoldaduraContent {
  label: string;
  headline: string;
  display_lateral: string;
  desc1: string;
  desc2: string;
  tecnicas: TecnicaItem[];
  aplicaciones: string[];
  galeria: GaleriaItem[];
}

export interface TecnicaItem {
  id: string;
  acronimo: string;
  nombre_completo: string;
  descripcion: string;
}

export interface ProcesoContent {
  label: string;
  headline: string;
  desc1: string;
  desc2: string;
  subtitle_pasos: string;
  pasos: PasoItem[];
}

export interface PasoItem {
  id: string;
  number: string;
  title: string;
  description: string;
}

export interface TecnologiaContent {
  label: string;
  headline_line1: string;
  headline_line2: string;
  headline_line3: string;
  description: string;
  software: SoftwareItem[];
}

export interface SoftwareItem {
  id: string;
  name: string;
  logo_url: string;
  link?: string;
}

export interface ServiciosContent {
  label: string;
  headline: string;
  columnas: ColumnaServicio[];
}

export interface ColumnaServicio {
  id: string;
  titulo: string;
  icon: string;
  servicios: string[];
  equipos: string[];
  equipo_label?: string;
}

export interface ComercializacionContent {
  label: string;
  headline: string;
  descripcion: string;
  categorias: string[];
  marcas: MarcaItem[];
}

export interface MarcaItem {
  id: string;
  nombre: string;
  logo_url: string;
}

export interface ClienteItem {
  id: string;
  nombre: string;
  logo_url: string;
  link?: string;
}

export interface TestimonioItem {
  id: string;
  nombre: string;
  cargo: string;
  empresa: string;
  texto: string;
  foto_url?: string;
}

export interface FaqItem {
  id: string;
  pregunta: string;
  respuesta: string;
}

export interface CtaBannerContent {
  headline: string;
  description: string;
  cta_primary_text: string;
  cta_primary_href: string;
  cta_secondary_text: string;
  cta_secondary_href: string;
}

export interface ContactoContent {
  label: string;
  headline: string;
  subtitle: string;
  phone_display: string;
  phone_href: string;
  email: string;
  email_secondary?: string;
  address_line1: string;
  address_line2: string;
  hours_weekday: string;
  hours_saturday: string;
  whatsapp_href: string;
  whatsapp_message_default: string;
  maps_embed_src: string;
  facebook_page_name?: string;
  facebook_page_href?: string;
}

export interface FooterContent {
  tagline: string;
  nav_links: FooterLinkGroup;
  services_links: FooterLinkGroup;
  copyright: string;
  designer_text: string;
  social_facebook: string;
  social_instagram: string;
  social_linkedin: string;
}

export interface FooterLinkGroup {
  title: string;
  items: { label: string; href: string }[];
}

export type ContactFormData = {
  nombre: string;
  empresa?: string;
  email: string;
  telefono: string;
  servicio: string;
  mensaje: string;
  privacidad: boolean;
};

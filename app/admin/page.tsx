"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Save, LogOut, ExternalLink, Plus, Trash2, Upload } from "lucide-react";
import { SiteContent, HitoItem, GaleriaItem, PasoItem, TecnicaItem, PilarItem, SoftwareItem, ColumnaServicio, MarcaItem, ClienteItem, FaqItem } from "@/types/content";
import { migrateContent } from "@/lib/content-migration";

const sections = [
  { id: "hero", label: "Hero" },
  { id: "stats", label: "Stats" },
  { id: "nosotros", label: "Quiénes somos" },
  { id: "historia", label: "Historia" },
  { id: "rd", label: "I+D" },
  { id: "precision", label: "Precisión" },
  { id: "soldadura", label: "Soldadura" },
  { id: "proceso", label: "Proceso" },
  { id: "tecnologia", label: "Tecnología" },
  { id: "servicios", label: "Servicios" },
  { id: "comercializacion", label: "Comercialización" },
  { id: "clientes", label: "Clientes" },
  { id: "faq", label: "FAQ" },
  { id: "ctaBanner", label: "CTA Banner" },
  { id: "contacto", label: "Contacto" },
  { id: "footer", label: "Footer" },
];

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider">{label}</label>
      {children}
    </div>
  );
}

function Input({ value, onChange, placeholder, type = "text" }: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
}) {
  return (
    <input
      type={type}
      value={value || ""}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full px-3 py-2 border border-gray-200 text-sm rounded focus:border-blue-500 outline-none"
    />
  );
}

function Textarea({ value, onChange, rows = 3 }: {
  value: string;
  onChange: (v: string) => void;
  rows?: number;
}) {
  return (
    <textarea
      value={value || ""}
      onChange={(e) => onChange(e.target.value)}
      rows={rows}
      className="w-full px-3 py-2 border border-gray-200 text-sm rounded focus:border-blue-500 outline-none resize-y"
    />
  );
}

function ImageUpload({ value, onChange, label, token }: {
  value: string;
  onChange: (url: string) => void;
  label: string;
  token: string;
}) {
  const [uploading, setUploading] = useState(false);

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/upload", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: fd,
      });
      const data = await res.json();
      if (data.url) onChange(data.url);
    } catch {
      alert("Error al subir imagen");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <input
          type="text"
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          placeholder="URL de imagen"
          className="flex-1 px-3 py-2 border border-gray-200 text-sm rounded focus:border-blue-500 outline-none"
        />
        <label className="flex items-center gap-1.5 px-3 py-2 bg-blue-50 border border-blue-200 text-blue-700 text-sm rounded cursor-pointer hover:bg-blue-100 whitespace-nowrap">
          <Upload className="w-3.5 h-3.5" />
          {uploading ? "Subiendo..." : "Subir"}
          <input type="file" accept="image/*" onChange={handleFile} className="hidden" disabled={uploading} />
        </label>
      </div>
      {value && (
        <div className="relative h-24 w-40 border border-gray-200 rounded overflow-hidden">
          <Image src={value} alt={label} fill className="object-cover" sizes="160px" />
        </div>
      )}
    </div>
  );
}

function StringListEditor({ items, onChange }: { items: string[]; onChange: (v: string[]) => void }) {
  return (
    <div className="space-y-2">
      {items.map((item, i) => (
        <div key={i} className="flex gap-2">
          <input
            value={item}
            onChange={(e) => {
              const updated = [...items];
              updated[i] = e.target.value;
              onChange(updated);
            }}
            className="flex-1 px-3 py-2 border border-gray-200 text-sm rounded focus:border-blue-500 outline-none"
          />
          <button onClick={() => onChange(items.filter((_, j) => j !== i))} className="p-2 text-red-400 hover:text-red-600">
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ))}
      <button
        onClick={() => onChange([...items, ""])}
        className="flex items-center gap-1.5 text-sm text-blue-600 hover:text-blue-800"
      >
        <Plus className="w-3.5 h-3.5" /> Agregar
      </button>
    </div>
  );
}

export default function AdminPage() {
  const router = useRouter();
  const [token, setToken] = useState<string | null>(null);
  const [content, setContent] = useState<SiteContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [activeSection, setActiveSection] = useState("hero");
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const setField = useCallback(<K extends keyof SiteContent>(section: K, update: Partial<SiteContent[K]> | ((prev: SiteContent[K]) => SiteContent[K])) => {
    setContent((prev) => {
      if (!prev) return prev;
      const current = prev[section];
      const next = typeof update === "function" ? (update as (p: SiteContent[K]) => SiteContent[K])(current) : { ...(current as object), ...update };
      return { ...prev, [section]: next };
    });
    setDirty(true);
  }, []);

  useEffect(() => {
    const t = localStorage.getItem("jaco-admin-token");
    if (!t) { router.replace("/admin/login"); return; }
    setToken(t);

    fetch(`/api/content?t=${Date.now()}`)
      .then((r) => r.json())
      .then((data) => {
        setContent(migrateContent(data));
        setLoading(false);
      })
      .catch(() => { router.replace("/admin/login"); });
  }, [router]);

  useEffect(() => {
    if (!dirty) return;
    const handler = (e: BeforeUnloadEvent) => { e.preventDefault(); };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [dirty]);

  const handleSave = async () => {
    if (!content || !token) return;
    setSaving(true);
    try {
      const res = await fetch("/api/save", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(content),
      });
      const data = await res.json();
      if (res.ok) {
        setDirty(false);
        alert(`✅ Cambios guardados (versión ${data.version})`);
      } else {
        alert("❌ Error: " + (data.error || "desconocido"));
      }
    } catch {
      alert("❌ Error de conexión");
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    if (dirty && !confirm("¿Salir sin guardar cambios?")) return;
    localStorage.removeItem("jaco-admin-token");
    router.push("/admin/login");
  };

  if (loading || !content) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#0A1342" }}>
        <p className="text-white font-mono tracking-widest">CARGANDO...</p>
      </div>
    );
  }

  const renderSection = () => {
    switch (activeSection) {
      case "hero":
        return (
          <div className="space-y-5">
            <Field label="Badge"><Input value={content.hero.badge} onChange={(v) => setField("hero", { badge: v })} /></Field>
            <Field label="Línea 1 (Headline)"><Input value={content.hero.headline_line1} onChange={(v) => setField("hero", { headline_line1: v })} /></Field>
            <Field label="Acento (en rojo)"><Input value={content.hero.headline_accent} onChange={(v) => setField("hero", { headline_accent: v })} /></Field>
            <Field label="Línea 3"><Input value={content.hero.headline_line3} onChange={(v) => setField("hero", { headline_line3: v })} /></Field>
            <Field label="Subheading"><Textarea value={content.hero.subheading} onChange={(v) => setField("hero", { subheading: v })} /></Field>
            <Field label="CTA Primario (texto)"><Input value={content.hero.cta_primary_text} onChange={(v) => setField("hero", { cta_primary_text: v })} /></Field>
            <Field label="CTA Primario (href)"><Input value={content.hero.cta_primary_href} onChange={(v) => setField("hero", { cta_primary_href: v })} /></Field>
            <Field label="CTA Secundario (texto)"><Input value={content.hero.cta_secondary_text} onChange={(v) => setField("hero", { cta_secondary_text: v })} /></Field>
            <Field label="Stats inline"><Input value={content.hero.inline_stats} onChange={(v) => setField("hero", { inline_stats: v })} /></Field>
            <Field label="Imagen de fondo">
              <ImageUpload value={content.hero.bg_image_url} onChange={(v) => setField("hero", { bg_image_url: v })} label="Hero background" token={token!} />
            </Field>
          </div>
        );

      case "stats":
        return (
          <div className="space-y-4">
            {content.stats.map((stat, i) => (
              <div key={i} className="border border-gray-200 p-4 rounded space-y-3">
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-sm text-gray-700">Stat {i + 1}</span>
                  <button onClick={() => { const s = [...content.stats]; s.splice(i, 1); setField("stats", () => s as typeof content.stats); setDirty(true); }} className="text-red-400 hover:text-red-600"><Trash2 className="w-4 h-4" /></button>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <Field label="Valor"><input type="number" value={stat.value} onChange={(e) => { const s = [...content.stats]; s[i] = { ...s[i], value: +e.target.value }; setField("stats", () => s as typeof content.stats); setDirty(true); }} className="w-full px-3 py-2 border border-gray-200 text-sm rounded" /></Field>
                  <Field label="Sufijo"><Input value={stat.suffix} onChange={(v) => { const s = [...content.stats]; s[i] = { ...s[i], suffix: v }; setField("stats", () => s as typeof content.stats); setDirty(true); }} /></Field>
                  <Field label="Label"><Input value={stat.label} onChange={(v) => { const s = [...content.stats]; s[i] = { ...s[i], label: v }; setField("stats", () => s as typeof content.stats); setDirty(true); }} /></Field>
                </div>
              </div>
            ))}
            <button onClick={() => { setField("stats", () => [...content.stats, { value: 0, suffix: "+", label: "Nueva estadística" }] as typeof content.stats); setDirty(true); }} className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800"><Plus className="w-4 h-4" />Agregar stat</button>
          </div>
        );

      case "nosotros":
        return (
          <div className="space-y-5">
            <Field label="Label (ej. 01 / QUIÉNES SOMOS)"><Input value={content.nosotros.label} onChange={(v) => setField("nosotros", { label: v })} /></Field>
            <Field label="Headline"><Textarea value={content.nosotros.headline} onChange={(v) => setField("nosotros", { headline: v })} rows={2} /></Field>
            <Field label="Descripción 1"><Textarea value={content.nosotros.desc1} onChange={(v) => setField("nosotros", { desc1: v })} /></Field>
            <Field label="Descripción 2"><Textarea value={content.nosotros.desc2} onChange={(v) => setField("nosotros", { desc2: v })} /></Field>
            <h3 className="font-semibold text-gray-700 pt-2 border-t">Pilares (4)</h3>
            {content.nosotros.pilares.map((p, i) => (
              <div key={i} className="border border-gray-200 p-4 rounded space-y-3">
                <p className="text-xs font-semibold text-gray-500 uppercase">Pilar {i + 1}</p>
                <Field label="Icono (nombre Lucide, ej: Award)"><Input value={p.icon} onChange={(v) => { const pp = [...content.nosotros.pilares] as PilarItem[]; pp[i] = { ...pp[i], icon: v }; setField("nosotros", { pilares: pp }); setDirty(true); }} /></Field>
                <Field label="Título"><Input value={p.title} onChange={(v) => { const pp = [...content.nosotros.pilares] as PilarItem[]; pp[i] = { ...pp[i], title: v }; setField("nosotros", { pilares: pp }); setDirty(true); }} /></Field>
                <Field label="Descripción"><Textarea value={p.description} onChange={(v) => { const pp = [...content.nosotros.pilares] as PilarItem[]; pp[i] = { ...pp[i], description: v }; setField("nosotros", { pilares: pp }); setDirty(true); }} /></Field>
              </div>
            ))}
          </div>
        );

      case "historia":
        return (
          <div className="space-y-5">
            <Field label="Label"><Input value={content.historia.label} onChange={(v) => setField("historia", { label: v })} /></Field>
            <Field label="Headline"><Input value={content.historia.headline} onChange={(v) => setField("historia", { headline: v })} /></Field>
            <Field label="Subtítulo"><Input value={content.historia.subtitle} onChange={(v) => setField("historia", { subtitle: v })} /></Field>
            <h3 className="font-semibold text-gray-700 pt-2 border-t">Hitos</h3>
            {content.historia.hitos.map((h, i) => (
              <div key={h.id} className="border border-gray-200 p-4 rounded space-y-3">
                <div className="flex justify-between">
                  <p className="text-xs font-semibold text-gray-500 uppercase">Hito {i + 1}</p>
                  <button onClick={() => { const hh = content.historia.hitos.filter((_, j) => j !== i) as HitoItem[]; setField("historia", { hitos: hh }); setDirty(true); }} className="text-red-400"><Trash2 className="w-4 h-4" /></button>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <Field label="Año"><Input value={h.year} onChange={(v) => { const hh = [...content.historia.hitos] as HitoItem[]; hh[i] = { ...hh[i], year: v }; setField("historia", { hitos: hh }); setDirty(true); }} /></Field>
                  <Field label="Título"><Input value={h.title} onChange={(v) => { const hh = [...content.historia.hitos] as HitoItem[]; hh[i] = { ...hh[i], title: v }; setField("historia", { hitos: hh }); setDirty(true); }} /></Field>
                </div>
                <Field label="Descripción"><Textarea value={h.description} onChange={(v) => { const hh = [...content.historia.hitos] as HitoItem[]; hh[i] = { ...hh[i], description: v }; setField("historia", { hitos: hh }); setDirty(true); }} /></Field>
              </div>
            ))}
            <button onClick={() => { const newHito: HitoItem = { id: crypto.randomUUID(), year: "2025", title: "NUEVO HITO", description: "Descripción del hito." }; setField("historia", { hitos: [...content.historia.hitos, newHito] as HitoItem[] }); setDirty(true); }} className="flex items-center gap-2 text-sm text-blue-600"><Plus className="w-4 h-4" />Agregar hito</button>
          </div>
        );

      case "rd":
        return (
          <div className="space-y-5">
            <Field label="Label"><Input value={content.rd.label} onChange={(v) => setField("rd", { label: v })} /></Field>
            <Field label="Headline"><Textarea value={content.rd.headline} onChange={(v) => setField("rd", { headline: v })} rows={2} /></Field>
            <Field label="Descripción 1"><Textarea value={content.rd.desc1} onChange={(v) => setField("rd", { desc1: v })} /></Field>
            <Field label="Descripción 2"><Textarea value={content.rd.desc2} onChange={(v) => setField("rd", { desc2: v })} /></Field>
            <Field label="Título Enfoque"><Input value={content.rd.enfoque_title} onChange={(v) => setField("rd", { enfoque_title: v })} /></Field>
            <Field label="Desc Enfoque"><Textarea value={content.rd.enfoque_desc} onChange={(v) => setField("rd", { enfoque_desc: v })} /></Field>
            <Field label="Imagen">
              <ImageUpload value={content.rd.image_url} onChange={(v) => setField("rd", { image_url: v })} label="I+D imagen" token={token!} />
            </Field>
          </div>
        );

      case "precision":
        return (
          <div className="space-y-5">
            <Field label="Label"><Input value={content.precision.label} onChange={(v) => setField("precision", { label: v })} /></Field>
            <Field label="Headline línea 1"><Input value={content.precision.headline_line1} onChange={(v) => setField("precision", { headline_line1: v })} /></Field>
            <Field label="Headline línea 2"><Input value={content.precision.headline_line2} onChange={(v) => setField("precision", { headline_line2: v })} /></Field>
            <Field label="Descripción 1"><Textarea value={content.precision.desc1} onChange={(v) => setField("precision", { desc1: v })} /></Field>
            <Field label="Descripción 2"><Textarea value={content.precision.desc2} onChange={(v) => setField("precision", { desc2: v })} /></Field>
            <h3 className="font-semibold text-gray-700 pt-2 border-t">Galería</h3>
            {content.precision.galeria.map((g, i) => (
              <div key={g.id} className="border border-gray-200 p-4 rounded space-y-3">
                <div className="flex justify-between">
                  <p className="text-xs font-semibold text-gray-500 uppercase">Imagen {i + 1}</p>
                  <button onClick={() => { const gg = content.precision.galeria.filter((_, j) => j !== i) as GaleriaItem[]; setField("precision", { galeria: gg }); setDirty(true); }} className="text-red-400"><Trash2 className="w-4 h-4" /></button>
                </div>
                <Field label="Caption"><Input value={g.caption} onChange={(v) => { const gg = [...content.precision.galeria] as GaleriaItem[]; gg[i] = { ...gg[i], caption: v }; setField("precision", { galeria: gg }); setDirty(true); }} /></Field>
                <Field label="Alt"><Input value={g.alt} onChange={(v) => { const gg = [...content.precision.galeria] as GaleriaItem[]; gg[i] = { ...gg[i], alt: v }; setField("precision", { galeria: gg }); setDirty(true); }} /></Field>
                <Field label="Imagen">
                  <ImageUpload value={g.image_url} onChange={(v) => { const gg = [...content.precision.galeria] as GaleriaItem[]; gg[i] = { ...gg[i], image_url: v }; setField("precision", { galeria: gg }); setDirty(true); }} label="Galería" token={token!} />
                </Field>
              </div>
            ))}
            <button onClick={() => { const ng: GaleriaItem = { id: crypto.randomUUID(), caption: "Nueva imagen", image_url: "", alt: "" }; setField("precision", { galeria: [...content.precision.galeria, ng] as GaleriaItem[] }); setDirty(true); }} className="flex items-center gap-2 text-sm text-blue-600"><Plus className="w-4 h-4" />Agregar imagen</button>
          </div>
        );

      case "proceso":
        return (
          <div className="space-y-5">
            <Field label="Label"><Input value={content.procesoSoluciones.label} onChange={(v) => setField("procesoSoluciones", { label: v })} /></Field>
            <Field label="Headline"><Input value={content.procesoSoluciones.headline} onChange={(v) => setField("procesoSoluciones", { headline: v })} /></Field>
            <Field label="Desc 1"><Textarea value={content.procesoSoluciones.desc1} onChange={(v) => setField("procesoSoluciones", { desc1: v })} /></Field>
            <Field label="Desc 2"><Textarea value={content.procesoSoluciones.desc2} onChange={(v) => setField("procesoSoluciones", { desc2: v })} /></Field>
            <Field label="Subtítulo pasos"><Input value={content.procesoSoluciones.subtitle_pasos} onChange={(v) => setField("procesoSoluciones", { subtitle_pasos: v })} /></Field>
            <h3 className="font-semibold text-gray-700 pt-2 border-t">Pasos</h3>
            {content.procesoSoluciones.pasos.map((p, i) => (
              <div key={p.id} className="border border-gray-200 p-4 rounded space-y-3">
                <div className="flex justify-between">
                  <p className="text-xs font-semibold text-gray-500 uppercase">Paso {p.number}</p>
                  <button onClick={() => { const pp = content.procesoSoluciones.pasos.filter((_, j) => j !== i) as PasoItem[]; setField("procesoSoluciones", { pasos: pp }); setDirty(true); }} className="text-red-400"><Trash2 className="w-4 h-4" /></button>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <Field label="Número (ej: 01)"><Input value={p.number} onChange={(v) => { const pp = [...content.procesoSoluciones.pasos] as PasoItem[]; pp[i] = { ...pp[i], number: v }; setField("procesoSoluciones", { pasos: pp }); setDirty(true); }} /></Field>
                  <Field label="Título"><Input value={p.title} onChange={(v) => { const pp = [...content.procesoSoluciones.pasos] as PasoItem[]; pp[i] = { ...pp[i], title: v }; setField("procesoSoluciones", { pasos: pp }); setDirty(true); }} /></Field>
                </div>
                <Field label="Descripción"><Textarea value={p.description} onChange={(v) => { const pp = [...content.procesoSoluciones.pasos] as PasoItem[]; pp[i] = { ...pp[i], description: v }; setField("procesoSoluciones", { pasos: pp }); setDirty(true); }} /></Field>
              </div>
            ))}
            <button onClick={() => { const np: PasoItem = { id: crypto.randomUUID(), number: `0${content.procesoSoluciones.pasos.length + 1}`, title: "NUEVO PASO", description: "" }; setField("procesoSoluciones", { pasos: [...content.procesoSoluciones.pasos, np] as PasoItem[] }); setDirty(true); }} className="flex items-center gap-2 text-sm text-blue-600"><Plus className="w-4 h-4" />Agregar paso</button>
          </div>
        );

      case "contacto":
        return (
          <div className="space-y-5">
            <Field label="Label"><Input value={content.contacto.label} onChange={(v) => setField("contacto", { label: v })} /></Field>
            <Field label="Headline"><Input value={content.contacto.headline} onChange={(v) => setField("contacto", { headline: v })} /></Field>
            <Field label="Subtítulo"><Textarea value={content.contacto.subtitle} onChange={(v) => setField("contacto", { subtitle: v })} rows={2} /></Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Teléfono display"><Input value={content.contacto.phone_display} onChange={(v) => setField("contacto", { phone_display: v })} /></Field>
              <Field label="Teléfono href"><Input value={content.contacto.phone_href} onChange={(v) => setField("contacto", { phone_href: v })} /></Field>
            </div>
            <Field label="Email"><Input value={content.contacto.email} onChange={(v) => setField("contacto", { email: v })} type="email" /></Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Dirección línea 1"><Input value={content.contacto.address_line1} onChange={(v) => setField("contacto", { address_line1: v })} /></Field>
              <Field label="Dirección línea 2"><Input value={content.contacto.address_line2} onChange={(v) => setField("contacto", { address_line2: v })} /></Field>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Horario lun-vie"><Input value={content.contacto.hours_weekday} onChange={(v) => setField("contacto", { hours_weekday: v })} /></Field>
              <Field label="Horario sábado"><Input value={content.contacto.hours_saturday} onChange={(v) => setField("contacto", { hours_saturday: v })} /></Field>
            </div>
            <Field label="WhatsApp href"><Input value={content.contacto.whatsapp_href} onChange={(v) => setField("contacto", { whatsapp_href: v })} /></Field>
            <Field label="Maps embed src"><Textarea value={content.contacto.maps_embed_src} onChange={(v) => setField("contacto", { maps_embed_src: v })} rows={3} /></Field>
          </div>
        );

      case "footer":
        return (
          <div className="space-y-5">
            <Field label="Tagline"><Textarea value={content.footer.tagline} onChange={(v) => setField("footer", { tagline: v })} /></Field>
            <Field label="Copyright"><Input value={content.footer.copyright} onChange={(v) => setField("footer", { copyright: v })} /></Field>
            <Field label="Diseñador"><Input value={content.footer.designer_text} onChange={(v) => setField("footer", { designer_text: v })} /></Field>
            <div className="grid grid-cols-3 gap-3">
              <Field label="Facebook URL"><Input value={content.footer.social_facebook} onChange={(v) => setField("footer", { social_facebook: v })} /></Field>
              <Field label="Instagram URL"><Input value={content.footer.social_instagram} onChange={(v) => setField("footer", { social_instagram: v })} /></Field>
              <Field label="LinkedIn URL"><Input value={content.footer.social_linkedin} onChange={(v) => setField("footer", { social_linkedin: v })} /></Field>
            </div>
          </div>
        );

      case "ctaBanner":
        return (
          <div className="space-y-5">
            <Field label="Headline"><Input value={content.ctaBanner.headline} onChange={(v) => setField("ctaBanner", { headline: v })} /></Field>
            <Field label="Descripción"><Textarea value={content.ctaBanner.description} onChange={(v) => setField("ctaBanner", { description: v })} /></Field>
            <Field label="CTA Primario texto"><Input value={content.ctaBanner.cta_primary_text} onChange={(v) => setField("ctaBanner", { cta_primary_text: v })} /></Field>
            <Field label="CTA Primario href"><Input value={content.ctaBanner.cta_primary_href} onChange={(v) => setField("ctaBanner", { cta_primary_href: v })} /></Field>
            <Field label="CTA Secundario texto"><Input value={content.ctaBanner.cta_secondary_text} onChange={(v) => setField("ctaBanner", { cta_secondary_text: v })} /></Field>
            <Field label="CTA Secundario href"><Input value={content.ctaBanner.cta_secondary_href} onChange={(v) => setField("ctaBanner", { cta_secondary_href: v })} /></Field>
          </div>
        );

      case "faq":
        return (
          <div className="space-y-4">
            {content.faq.map((item, i) => (
              <div key={item.id} className="border border-gray-200 p-4 rounded space-y-3">
                <div className="flex justify-between">
                  <p className="text-xs font-semibold text-gray-500 uppercase">Pregunta {i + 1}</p>
                  <button onClick={() => { const ff = content.faq.filter((_, j) => j !== i) as FaqItem[]; setField("faq", () => ff); setDirty(true); }} className="text-red-400"><Trash2 className="w-4 h-4" /></button>
                </div>
                <Field label="Pregunta"><Input value={item.pregunta} onChange={(v) => { const ff = [...content.faq] as FaqItem[]; ff[i] = { ...ff[i], pregunta: v }; setField("faq", () => ff); setDirty(true); }} /></Field>
                <Field label="Respuesta"><Textarea value={item.respuesta} onChange={(v) => { const ff = [...content.faq] as FaqItem[]; ff[i] = { ...ff[i], respuesta: v }; setField("faq", () => ff); setDirty(true); }} /></Field>
              </div>
            ))}
            <button onClick={() => { const nf: FaqItem = { id: crypto.randomUUID(), pregunta: "Nueva pregunta", respuesta: "" }; setField("faq", () => [...content.faq, nf] as FaqItem[]); setDirty(true); }} className="flex items-center gap-2 text-sm text-blue-600"><Plus className="w-4 h-4" />Agregar FAQ</button>
          </div>
        );

      case "clientes":
        return (
          <div className="space-y-4">
            {content.clientes.map((c, i) => (
              <div key={c.id} className="border border-gray-200 p-4 rounded space-y-3">
                <div className="flex justify-between">
                  <p className="text-xs font-semibold text-gray-500 uppercase">Cliente {i + 1}</p>
                  <button onClick={() => { const cc = content.clientes.filter((_, j) => j !== i) as ClienteItem[]; setField("clientes", () => cc); setDirty(true); }} className="text-red-400"><Trash2 className="w-4 h-4" /></button>
                </div>
                <Field label="Nombre"><Input value={c.nombre} onChange={(v) => { const cc = [...content.clientes] as ClienteItem[]; cc[i] = { ...cc[i], nombre: v }; setField("clientes", () => cc); setDirty(true); }} /></Field>
                <Field label="Logo">
                  <ImageUpload value={c.logo_url} onChange={(v) => { const cc = [...content.clientes] as ClienteItem[]; cc[i] = { ...cc[i], logo_url: v }; setField("clientes", () => cc); setDirty(true); }} label="Logo cliente" token={token!} />
                </Field>
              </div>
            ))}
            <button onClick={() => { const nc: ClienteItem = { id: crypto.randomUUID(), nombre: "Nuevo cliente", logo_url: "" }; setField("clientes", () => [...content.clientes, nc] as ClienteItem[]); setDirty(true); }} className="flex items-center gap-2 text-sm text-blue-600"><Plus className="w-4 h-4" />Agregar cliente</button>
          </div>
        );

      case "soldadura":
        return (
          <div className="space-y-5">
            <Field label="Label"><Input value={content.soldadura.label} onChange={(v) => setField("soldadura", { label: v })} /></Field>
            <Field label="Headline"><Input value={content.soldadura.headline} onChange={(v) => setField("soldadura", { headline: v })} /></Field>
            <Field label="Display lateral (texto girado)"><Input value={content.soldadura.display_lateral} onChange={(v) => setField("soldadura", { display_lateral: v })} /></Field>
            <Field label="Descripción 1"><Textarea value={content.soldadura.desc1} onChange={(v) => setField("soldadura", { desc1: v })} /></Field>
            <Field label="Descripción 2"><Textarea value={content.soldadura.desc2} onChange={(v) => setField("soldadura", { desc2: v })} /></Field>
            <h3 className="font-semibold text-gray-700 pt-2 border-t">Técnicas de soldadura</h3>
            {content.soldadura.tecnicas.map((t, i) => (
              <div key={t.id} className="border border-gray-200 p-4 rounded space-y-3">
                <div className="flex justify-between">
                  <p className="text-xs font-semibold text-gray-500 uppercase">Técnica {i + 1}</p>
                  <button onClick={() => { const tt = content.soldadura.tecnicas.filter((_, j) => j !== i) as TecnicaItem[]; setField("soldadura", { tecnicas: tt }); setDirty(true); }} className="text-red-400"><Trash2 className="w-4 h-4" /></button>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <Field label="Acrónimo (ej: MIG)"><Input value={t.acronimo} onChange={(v) => { const tt = [...content.soldadura.tecnicas] as TecnicaItem[]; tt[i] = { ...tt[i], acronimo: v }; setField("soldadura", { tecnicas: tt }); setDirty(true); }} /></Field>
                  <Field label="Nombre completo"><Input value={t.nombre_completo} onChange={(v) => { const tt = [...content.soldadura.tecnicas] as TecnicaItem[]; tt[i] = { ...tt[i], nombre_completo: v }; setField("soldadura", { tecnicas: tt }); setDirty(true); }} /></Field>
                </div>
                <Field label="Descripción"><Textarea value={t.descripcion} onChange={(v) => { const tt = [...content.soldadura.tecnicas] as TecnicaItem[]; tt[i] = { ...tt[i], descripcion: v }; setField("soldadura", { tecnicas: tt }); setDirty(true); }} /></Field>
              </div>
            ))}
            <button onClick={() => { const nt: TecnicaItem = { id: crypto.randomUUID(), acronimo: "XX", nombre_completo: "Nombre completo", descripcion: "" }; setField("soldadura", { tecnicas: [...content.soldadura.tecnicas, nt] as TecnicaItem[] }); setDirty(true); }} className="flex items-center gap-2 text-sm text-blue-600"><Plus className="w-4 h-4" />Agregar técnica</button>
            <h3 className="font-semibold text-gray-700 pt-2 border-t">Aplicaciones</h3>
            <StringListEditor items={content.soldadura.aplicaciones} onChange={(v) => { setField("soldadura", { aplicaciones: v }); setDirty(true); }} />
            <h3 className="font-semibold text-gray-700 pt-2 border-t">Galería</h3>
            {content.soldadura.galeria.map((g, i) => (
              <div key={g.id} className="border border-gray-200 p-4 rounded space-y-3">
                <div className="flex justify-between">
                  <p className="text-xs font-semibold text-gray-500 uppercase">Imagen {i + 1}</p>
                  <button onClick={() => { const gg = content.soldadura.galeria.filter((_, j) => j !== i) as GaleriaItem[]; setField("soldadura", { galeria: gg }); setDirty(true); }} className="text-red-400"><Trash2 className="w-4 h-4" /></button>
                </div>
                <Field label="Caption"><Input value={g.caption} onChange={(v) => { const gg = [...content.soldadura.galeria] as GaleriaItem[]; gg[i] = { ...gg[i], caption: v }; setField("soldadura", { galeria: gg }); setDirty(true); }} /></Field>
                <Field label="Alt"><Input value={g.alt} onChange={(v) => { const gg = [...content.soldadura.galeria] as GaleriaItem[]; gg[i] = { ...gg[i], alt: v }; setField("soldadura", { galeria: gg }); setDirty(true); }} /></Field>
                <Field label="Imagen">
                  <ImageUpload value={g.image_url} onChange={(v) => { const gg = [...content.soldadura.galeria] as GaleriaItem[]; gg[i] = { ...gg[i], image_url: v }; setField("soldadura", { galeria: gg }); setDirty(true); }} label="Soldadura galería" token={token!} />
                </Field>
              </div>
            ))}
            <button onClick={() => { const ng: GaleriaItem = { id: crypto.randomUUID(), caption: "Nueva imagen", image_url: "", alt: "" }; setField("soldadura", { galeria: [...content.soldadura.galeria, ng] as GaleriaItem[] }); setDirty(true); }} className="flex items-center gap-2 text-sm text-blue-600"><Plus className="w-4 h-4" />Agregar imagen</button>
          </div>
        );

      case "tecnologia":
        return (
          <div className="space-y-5">
            <Field label="Label"><Input value={content.tecnologia.label} onChange={(v) => setField("tecnologia", { label: v })} /></Field>
            <Field label="Headline línea 1"><Input value={content.tecnologia.headline_line1} onChange={(v) => setField("tecnologia", { headline_line1: v })} /></Field>
            <Field label="Headline línea 2"><Input value={content.tecnologia.headline_line2} onChange={(v) => setField("tecnologia", { headline_line2: v })} /></Field>
            <Field label="Headline línea 3"><Input value={content.tecnologia.headline_line3} onChange={(v) => setField("tecnologia", { headline_line3: v })} /></Field>
            <Field label="Descripción"><Textarea value={content.tecnologia.description} onChange={(v) => setField("tecnologia", { description: v })} /></Field>
            <h3 className="font-semibold text-gray-700 pt-2 border-t">Software CAD/CAM</h3>
            {content.tecnologia.software.map((s, i) => (
              <div key={s.id} className="border border-gray-200 p-4 rounded space-y-3">
                <div className="flex justify-between">
                  <p className="text-xs font-semibold text-gray-500 uppercase">Software {i + 1}</p>
                  <button onClick={() => { const ss = content.tecnologia.software.filter((_, j) => j !== i) as SoftwareItem[]; setField("tecnologia", { software: ss }); setDirty(true); }} className="text-red-400"><Trash2 className="w-4 h-4" /></button>
                </div>
                <Field label="Nombre"><Input value={s.name} onChange={(v) => { const ss = [...content.tecnologia.software] as SoftwareItem[]; ss[i] = { ...ss[i], name: v }; setField("tecnologia", { software: ss }); setDirty(true); }} /></Field>
                <Field label="Link (opcional)"><Input value={s.link || ""} onChange={(v) => { const ss = [...content.tecnologia.software] as SoftwareItem[]; ss[i] = { ...ss[i], link: v }; setField("tecnologia", { software: ss }); setDirty(true); }} placeholder="https://..." /></Field>
                <Field label="Logo">
                  <ImageUpload value={s.logo_url} onChange={(v) => { const ss = [...content.tecnologia.software] as SoftwareItem[]; ss[i] = { ...ss[i], logo_url: v }; setField("tecnologia", { software: ss }); setDirty(true); }} label="Software logo" token={token!} />
                </Field>
              </div>
            ))}
            <button onClick={() => { const ns: SoftwareItem = { id: crypto.randomUUID(), name: "Nuevo software", logo_url: "", link: "" }; setField("tecnologia", { software: [...content.tecnologia.software, ns] as SoftwareItem[] }); setDirty(true); }} className="flex items-center gap-2 text-sm text-blue-600"><Plus className="w-4 h-4" />Agregar software</button>
          </div>
        );

      case "servicios":
        return (
          <div className="space-y-5">
            <Field label="Label"><Input value={content.servicios.label} onChange={(v) => setField("servicios", { label: v })} /></Field>
            <Field label="Headline"><Input value={content.servicios.headline} onChange={(v) => setField("servicios", { headline: v })} /></Field>
            <h3 className="font-semibold text-gray-700 pt-2 border-t">Columnas de servicios</h3>
            {content.servicios.columnas.map((col, i) => (
              <div key={col.id} className="border border-gray-200 p-4 rounded space-y-4">
                <div className="flex justify-between items-center">
                  <p className="text-xs font-semibold text-gray-500 uppercase">Columna {i + 1}</p>
                  <button onClick={() => { const cc = content.servicios.columnas.filter((_, j) => j !== i) as ColumnaServicio[]; setField("servicios", { columnas: cc }); setDirty(true); }} className="text-red-400"><Trash2 className="w-4 h-4" /></button>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <Field label="Título"><Input value={col.titulo} onChange={(v) => { const cc = [...content.servicios.columnas] as ColumnaServicio[]; cc[i] = { ...cc[i], titulo: v }; setField("servicios", { columnas: cc }); setDirty(true); }} /></Field>
                  <Field label="Icono (Lucide)"><Input value={col.icon} onChange={(v) => { const cc = [...content.servicios.columnas] as ColumnaServicio[]; cc[i] = { ...cc[i], icon: v }; setField("servicios", { columnas: cc }); setDirty(true); }} /></Field>
                </div>
                <Field label="Label equipos (ej: MÁQUINAS)">
                  <Input value={col.equipo_label || ""} onChange={(v) => { const cc = [...content.servicios.columnas] as ColumnaServicio[]; cc[i] = { ...cc[i], equipo_label: v }; setField("servicios", { columnas: cc }); setDirty(true); }} />
                </Field>
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider">Servicios</label>
                  <StringListEditor items={col.servicios} onChange={(v) => { const cc = [...content.servicios.columnas] as ColumnaServicio[]; cc[i] = { ...cc[i], servicios: v }; setField("servicios", { columnas: cc }); setDirty(true); }} />
                </div>
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider">Equipos</label>
                  <StringListEditor items={col.equipos} onChange={(v) => { const cc = [...content.servicios.columnas] as ColumnaServicio[]; cc[i] = { ...cc[i], equipos: v }; setField("servicios", { columnas: cc }); setDirty(true); }} />
                </div>
              </div>
            ))}
            <button onClick={() => { const nc: ColumnaServicio = { id: crypto.randomUUID(), titulo: "NUEVA COLUMNA", icon: "Wrench", servicios: [], equipos: [], equipo_label: "EQUIPOS" }; setField("servicios", { columnas: [...content.servicios.columnas, nc] as ColumnaServicio[] }); setDirty(true); }} className="flex items-center gap-2 text-sm text-blue-600"><Plus className="w-4 h-4" />Agregar columna</button>
          </div>
        );

      case "comercializacion":
        return (
          <div className="space-y-5">
            <Field label="Label"><Input value={content.comercializacion.label} onChange={(v) => setField("comercializacion", { label: v })} /></Field>
            <Field label="Headline"><Input value={content.comercializacion.headline} onChange={(v) => setField("comercializacion", { headline: v })} /></Field>
            <Field label="Descripción"><Textarea value={content.comercializacion.descripcion} onChange={(v) => setField("comercializacion", { descripcion: v })} /></Field>
            <h3 className="font-semibold text-gray-700 pt-2 border-t">Categorías de producto</h3>
            <StringListEditor items={content.comercializacion.categorias} onChange={(v) => { setField("comercializacion", { categorias: v }); setDirty(true); }} />
            <h3 className="font-semibold text-gray-700 pt-2 border-t">Marcas</h3>
            {content.comercializacion.marcas.map((m, i) => (
              <div key={m.id} className="border border-gray-200 p-4 rounded space-y-3">
                <div className="flex justify-between">
                  <p className="text-xs font-semibold text-gray-500 uppercase">Marca {i + 1}</p>
                  <button onClick={() => { const mm = content.comercializacion.marcas.filter((_, j) => j !== i) as MarcaItem[]; setField("comercializacion", { marcas: mm }); setDirty(true); }} className="text-red-400"><Trash2 className="w-4 h-4" /></button>
                </div>
                <Field label="Nombre"><Input value={m.nombre} onChange={(v) => { const mm = [...content.comercializacion.marcas] as MarcaItem[]; mm[i] = { ...mm[i], nombre: v }; setField("comercializacion", { marcas: mm }); setDirty(true); }} /></Field>
                <Field label="Logo">
                  <ImageUpload value={m.logo_url} onChange={(v) => { const mm = [...content.comercializacion.marcas] as MarcaItem[]; mm[i] = { ...mm[i], logo_url: v }; setField("comercializacion", { marcas: mm }); setDirty(true); }} label="Logo marca" token={token!} />
                </Field>
              </div>
            ))}
            <button onClick={() => { const nm: MarcaItem = { id: crypto.randomUUID(), nombre: "Nueva marca", logo_url: "" }; setField("comercializacion", { marcas: [...content.comercializacion.marcas, nm] as MarcaItem[] }); setDirty(true); }} className="flex items-center gap-2 text-sm text-blue-600"><Plus className="w-4 h-4" />Agregar marca</button>
          </div>
        );

      default:
        return (
          <div className="py-12 text-center text-gray-400">
            <p className="font-mono text-sm">Sección no encontrada: <strong>{activeSection}</strong></p>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "#F8F9FA" }}>
      {/* Top bar */}
      <div className="h-14 flex items-center justify-between px-6 border-b border-gray-200 bg-white sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="relative h-8 w-28">
            <Image src="/logos/jaco-full.png" alt="JACO Admin" fill className="object-contain object-left" sizes="112px" />
          </div>
          <span className="text-xs font-mono text-gray-400 border-l border-gray-200 pl-3">ADMIN</span>
          {dirty && <span className="px-2 py-0.5 text-xs bg-amber-100 text-amber-700 rounded">Sin guardar</span>}
        </div>
        <div className="flex items-center gap-2">
          <a href="/" target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900 border border-gray-200 rounded hover:border-gray-400 transition-colors">
            <ExternalLink className="w-3.5 h-3.5" /> Ver sitio
          </a>
          <button onClick={handleSave} disabled={saving || !dirty}
            className="flex items-center gap-1.5 px-4 py-1.5 text-sm font-semibold text-white rounded transition-colors disabled:opacity-50"
            style={{ background: dirty ? "#001A8B" : "#6B6B70" }}>
            <Save className="w-3.5 h-3.5" /> {saving ? "Guardando..." : "Guardar"}
          </button>
          <button onClick={handleLogout} className="p-1.5 text-gray-400 hover:text-red-500 transition-colors" aria-label="Cerrar sesión">
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside className="w-56 bg-white border-r border-gray-200 overflow-y-auto shrink-0">
          <nav className="py-4">
            {sections.map((s) => (
              <button
                key={s.id}
                onClick={() => setActiveSection(s.id)}
                className={`w-full text-left px-5 py-2.5 text-sm transition-colors ${
                  activeSection === s.id
                    ? "bg-blue-50 text-blue-700 font-semibold border-r-2 border-blue-600"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                {s.label}
              </button>
            ))}
          </nav>
        </aside>

        {/* Editor */}
        <main className="flex-1 overflow-y-auto p-8">
          <div className="max-w-2xl mx-auto">
            <h1 className="text-lg font-bold text-gray-900 mb-6 capitalize">
              {sections.find((s) => s.id === activeSection)?.label || activeSection}
            </h1>
            {renderSection()}
          </div>
        </main>
      </div>
    </div>
  );
}

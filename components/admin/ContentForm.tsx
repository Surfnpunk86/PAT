"use client";

import { useFormState, useFormStatus } from "react-dom";
import { createContentAction, updateContentAction } from "@/lib/cms/actions";
import { CONTENT_TYPE_LABEL, type ContentItem } from "@/lib/cms/types";

function SubmitBtn({ label }: { label: string }) {
  const { pending } = useFormStatus();
  return (
    <button className="btn btn-primary" type="submit" disabled={pending}>
      {pending ? "Guardando…" : label}
    </button>
  );
}

export default function ContentForm({
  mode,
  item,
  sections,
  cities,
  disabled = false,
}: {
  mode: "create" | "edit";
  item?: ContentItem;
  sections: string[];
  cities: string[];
  disabled?: boolean;
}) {
  const action = mode === "create" ? createContentAction : updateContentAction.bind(null, item!.id);
  const [state, formAction] = useFormState<{ error?: string } | undefined, FormData>(
    action as any,
    undefined
  );

  return (
    <form action={formAction} className="adm-form-grid">
      <div className="adm-field">
        <label htmlFor="type">Tipo de contenido</label>
        <select id="type" name="type" defaultValue={item?.type || "noticia"} disabled={disabled}>
          {Object.entries(CONTENT_TYPE_LABEL).map(([k, v]) => (
            <option key={k} value={k}>
              {v}
            </option>
          ))}
        </select>
      </div>
      <div className="adm-field">
        <label htmlFor="section">Sección</label>
        <select id="section" name="section" defaultValue={item?.section || sections[0]} disabled={disabled}>
          {sections.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>

      <div className="adm-field full">
        <label htmlFor="title">Título</label>
        <input id="title" name="title" defaultValue={item?.title} required disabled={disabled} />
      </div>

      <div className="adm-field">
        <label htmlFor="city">
          Ciudad de origen <span className="hint">(del corresponsal, opcional)</span>
        </label>
        <select id="city" name="city" defaultValue={item?.city || ""} disabled={disabled}>
          <option value="">—</option>
          {cities.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>
      <div className="adm-field">
        <label htmlFor="tags">
          Tags <span className="hint">(separados por coma)</span>
        </label>
        <input id="tags" name="tags" defaultValue={item?.tags.join(", ")} disabled={disabled} />
      </div>

      <div className="adm-field full">
        <label htmlFor="summary">Resumen / bajada</label>
        <textarea id="summary" name="summary" rows={2} defaultValue={item?.summary} required disabled={disabled} />
      </div>
      <div className="adm-field full">
        <label htmlFor="body">Cuerpo</label>
        <textarea id="body" name="body" rows={10} defaultValue={item?.body} required disabled={disabled} />
      </div>

      <div className="adm-field">
        <label htmlFor="featuredImageVariant">
          Imagen destacada <span className="hint">(placeholder duotono, ver README fotografía)</span>
        </label>
        <select id="featuredImageVariant" name="featuredImageVariant" defaultValue={item?.featuredImageVariant || 1} disabled={disabled}>
          <option value={1}>Variante 1</option>
          <option value={2}>Variante 2</option>
          <option value={3}>Variante 3</option>
          <option value={4}>Variante 4</option>
        </select>
      </div>
      <div className="adm-field">
        <label htmlFor="readMinutes">Minutos de lectura</label>
        <input id="readMinutes" name="readMinutes" type="number" min={1} max={30} defaultValue={item?.readMinutes || 4} disabled={disabled} />
      </div>

      {(item?.type === "creador" || mode === "create") && (
        <>
          <div className="adm-field full" style={{ borderTop: "1px dashed var(--line)", paddingTop: 14 }}>
            <label>Solo si el tipo es "Creador nuevo" — ficha de talento</label>
          </div>
          <div className="adm-field">
            <label htmlFor="creatorHandle">Handle</label>
            <input id="creatorHandle" name="creatorHandle" defaultValue={item?.creatorHandle} placeholder="@usuario" disabled={disabled} />
          </div>
          <div className="adm-field">
            <label htmlFor="creatorReach">Audiencia</label>
            <input id="creatorReach" name="creatorReach" defaultValue={item?.creatorReach} placeholder="420K" disabled={disabled} />
          </div>
          <div className="adm-field full">
            <label htmlFor="creatorPlatforms">Plataformas</label>
            <input id="creatorPlatforms" name="creatorPlatforms" defaultValue={item?.creatorPlatforms} placeholder="IG · TikTok" disabled={disabled} />
          </div>
        </>
      )}

      {state?.error && (
        <p className="full" style={{ color: "var(--red)", fontSize: 13 }}>
          {state.error}
        </p>
      )}
      {!disabled && (
        <div className="full adm-btn-row">
          <SubmitBtn label={mode === "create" ? "Crear borrador" : "Guardar cambios"} />
        </div>
      )}
    </form>
  );
}

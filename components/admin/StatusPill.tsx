import { STATUS_LABEL, type ContentStatus } from "@/lib/cms/types";

const CLASS: Record<ContentStatus, string> = {
  borrador: "adm-pill-borrador",
  en_revision: "adm-pill-revision",
  aprobado: "adm-pill-aprobado",
  rechazado: "adm-pill-rechazado",
  programado: "adm-pill-programado",
  publicado: "adm-pill-publicado",
  archivado: "adm-pill-archivado",
};

export default function StatusPill({ status }: { status: ContentStatus }) {
  return <span className={`adm-pill ${CLASS[status]}`}>{STATUS_LABEL[status]}</span>;
}

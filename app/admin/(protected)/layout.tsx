import { redirect } from "next/navigation";
import { currentUser } from "@/lib/cms/auth";
import "../admin.css";

export default function ProtectedAdminLayout({ children }: { children: React.ReactNode }) {
  const user = currentUser();
  if (!user) redirect("/admin/login");
  // AdminShell necesita "title" por página; cada page.tsx envuelve
  // su contenido con <AdminShell user={user} title="..."> — este
  // layout solo garantiza que no se llegue aquí sin sesión.
  return <>{children}</>;
}

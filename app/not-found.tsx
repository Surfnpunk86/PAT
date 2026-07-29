import Link from "next/link";
import Footer from "@/components/Footer";

export default function NotFound() {
  return (
    <>
      <section className="stub dark">
        <div className="stub-in">
          <h1 className="display">404</h1>
          <p className="lede">Esta página no existe (todavía).</p>
          <Link href="/" className="btn btn-y btn-sm">
            Volver al inicio
          </Link>
        </div>
      </section>
      <Footer />
    </>
  );
}

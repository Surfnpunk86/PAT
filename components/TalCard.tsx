import Link from "next/link";
import Placeholder from "./Placeholder";
import type { Talent } from "@/lib/data";

export default function TalCard({ t }: { t: Talent }) {
  return (
    <Link href={`/talento/${t.id}`} className="tal">
      <Placeholder v={t.v} tag="Retrato editorial" />
      <div className="tal-b">
        <h4>{t.n}</h4>
        <div className="h">{t.h}</div>
        <div className="tal-tags">
          {t.c.map((c) => (
            <span className="tag" key={c}>
              {c}
            </span>
          ))}
        </div>
        <div className="tal-reach">
          <b>{t.r}</b> · {t.p}
        </div>
      </div>
    </Link>
  );
}

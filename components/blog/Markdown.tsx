import React from "react";

// Formatação inline: **negrito** e [texto](url)
function renderInline(text: string, kp: string): React.ReactNode[] {
  const nodes: React.ReactNode[] = [];
  const regex = /(\*\*([^*]+)\*\*)|(\[([^\]]+)\]\(([^)]+)\))/g;
  let last = 0;
  let m: RegExpExecArray | null;
  let i = 0;
  while ((m = regex.exec(text)) !== null) {
    if (m.index > last) nodes.push(text.slice(last, m.index));
    if (m[1]) nodes.push(<strong key={`${kp}-${i}`}>{m[2]}</strong>);
    else if (m[3]) nodes.push(
      <a key={`${kp}-${i}`} href={m[5]} className="text-brand-blue font-medium hover:underline">{m[4]}</a>
    );
    last = m.index + m[0].length;
    i++;
  }
  if (last < text.length) nodes.push(text.slice(last));
  return nodes;
}

/** Renderiza um subconjunto de Markdown (títulos, parágrafos, listas, negrito, links). */
export function Markdown({ content }: { content: string }) {
  const lines = (content || "").replace(/\r\n/g, "\n").split("\n");
  const blocks: React.ReactNode[] = [];
  let i = 0;
  let key = 0;

  while (i < lines.length) {
    const line = lines[i];
    if (!line.trim()) { i++; continue; }

    if (line.startsWith("### ")) {
      blocks.push(<h3 key={key} className="font-heading text-lg font-bold text-navy mt-6 mb-1">{renderInline(line.slice(4), `h${key}`)}</h3>);
      key++; i++; continue;
    }
    if (line.startsWith("## ") || line.startsWith("# ")) {
      const txt = line.replace(/^#+\s+/, "");
      blocks.push(<h2 key={key} className="font-heading text-xl sm:text-2xl font-bold text-navy mt-8 mb-2">{renderInline(txt, `h${key}`)}</h2>);
      key++; i++; continue;
    }
    if (/^\s*[-*]\s+/.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^\s*[-*]\s+/.test(lines[i])) {
        items.push(lines[i].replace(/^\s*[-*]\s+/, ""));
        i++;
      }
      blocks.push(
        <ul key={key} className="list-disc pl-6 space-y-2 text-gray-700 leading-relaxed">
          {items.map((it, idx) => <li key={idx}>{renderInline(it, `li${key}-${idx}`)}</li>)}
        </ul>
      );
      key++; continue;
    }

    blocks.push(<p key={key} className="text-gray-700 leading-relaxed">{renderInline(line, `p${key}`)}</p>);
    key++; i++;
  }

  return <div className="space-y-5">{blocks}</div>;
}

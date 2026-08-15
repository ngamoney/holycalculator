import Link from "next/link";

export default function Breadcrumbs({ items }) {
  const schemaData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.label,
      "item": item.href ? `https://holycalculator.com${item.href}` : undefined
    }))
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
      />
      <nav aria-label="Breadcrumb" className="breadcrumbs-nav">
        <ol className="breadcrumbs-list">
          {items.map((item, idx) => {
            const isLast = idx === items.length - 1;
            return (
              <li key={idx} className={`breadcrumbs-item ${isLast ? "active" : ""}`}>
                {!isLast && item.href ? (
                  <Link href={item.href} className="breadcrumbs-link">
                    {item.label}
                  </Link>
                ) : (
                  <span className="breadcrumbs-current" aria-current="page">
                    {item.label}
                  </span>
                )}
                {!isLast && <span className="breadcrumbs-sep" aria-hidden="true">/</span>}
              </li>
            );
          })}
        </ol>
      </nav>
    </>
  );
}

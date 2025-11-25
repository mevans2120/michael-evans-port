/**
 * JSON-LD Structured Data Component
 *
 * Renders schema.org structured data as a script tag for SEO.
 * Supports single objects or arrays of structured data.
 */

interface JsonLdProps {
  data: object | object[];
}

export function JsonLd({ data }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data),
      }}
    />
  );
}

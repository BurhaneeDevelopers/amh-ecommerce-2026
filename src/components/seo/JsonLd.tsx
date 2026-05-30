import React from 'react';

interface JsonLdProps {
  data: Record<string, any> | Record<string, any>[];
}

/**
 * Server-side component that renders structured data as JSON-LD
 * Accepts either a single schema object or an array of schema objects
 */
export default function JsonLd({ data }: JsonLdProps) {
  const schemas = Array.isArray(data) ? data : [data];

  return (
    <>
      {schemas.map((schema, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(schema, null, 0),
          }}
        />
      ))}
    </>
  );
}

import { Helmet } from 'react-helmet-async'

type SeoProps = {
  title: string
  description?: string
  keywords?: string
  image?: string
  url?: string
  type?: string
  schema?: string // JSON string for structured data
}

export function Seo({
  title,
  description,
  keywords,
  image = '/HurghadaFunTime.png', // Default image (assumes it's in public or base path)
  url = 'https://hurghadafuntime.com',
  type = 'website',
  schema
}: SeoProps) {
  const fullTitle = `${title} | Hurghada Fun Time`
  const defaultDesc = 'Every journey is an opportunity to explore, relax, and create unforgettable memories crafted with care, comfort, and local expertise.'
  const activeDesc = description || defaultDesc

  return (
    <Helmet>
      {/* Standard Metadata */}
      <title>{fullTitle}</title>
      <meta name="description" content={activeDesc} />
      {keywords && <meta name="keywords" content={keywords} />}

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={activeDesc} />
      {image && <meta property="og:image" content={image} />}

      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={url} />
      <meta property="twitter:title" content={fullTitle} />
      <meta property="twitter:description" content={activeDesc} />
      {image && <meta property="twitter:image" content={image} />}

      {/* Structured Data (JSON-LD) */}
      {schema && (
        <script type="application/ld+json">
          {schema}
        </script>
      )}
    </Helmet>
  )
}

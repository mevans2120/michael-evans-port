export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Simple passthrough with no navigation; the embedded Sanity Studio lives under /studio.
  return (
    <div className="min-h-screen bg-neutral-950">
      {children}
    </div>
  );
}

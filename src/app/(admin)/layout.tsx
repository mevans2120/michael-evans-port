export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Simple passthrough - no navigation
  // Admin pages that need auth (like chat-logs) will use nested layouts
  return (
    <div className="min-h-screen bg-neutral-950">
      {children}
    </div>
  );
}

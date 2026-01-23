export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="min-h-screen flex items-center justify-center bg-neutral-950 relative overflow-hidden">
      {/* Glow / Gradiente de fundo */}
      <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 via-transparent to-purple-500/10" />

      {/* Conteúdo */}
      <div className="relative z-10 w-full flex justify-center px-4">
        {children}
      </div>
    </main>
  );
}

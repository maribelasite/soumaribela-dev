export const dynamic = 'force-dynamic'
import CategoriasMenu from "@/core/components/CategoriasMenu";

export default async function LojaLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { prisma } = await import('@/core/lib/prisma')
  const categorias = await prisma.category.findMany({ select: { id: true, name: true, slug: true }, orderBy: { name: 'asc' } }).catch(() => [])
  return (
    <div>
      <CategoriasMenu categorias={categorias} />
      {children}
    </div>
  );
}

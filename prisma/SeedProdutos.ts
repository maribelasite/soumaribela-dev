// prisma/seedProdutosArtesanato.ts

import 'dotenv/config'
import { PrismaClient } from '../src/generated/client'
import { PrismaPg } from '@prisma/adapter-pg'
import { Pool } from 'pg'

const pool = new Pool({ connectionString: process.env.DATABASE_URL! })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

async function main() {
  console.log('🧹 Resetando produtos...')

  await prisma.productImage.deleteMany()
  await prisma.productColor.deleteMany()
  await prisma.size.deleteMany()
  await prisma.product.deleteMany()
  await prisma.category.deleteMany()

  console.log('✅ Produtos limpos!')

  const [tops, blusas, acessorios, vestidos, decoracao, presentes] =
    await Promise.all([
      prisma.category.create({ data: { name: 'Tops', slug: 'tops' } }),
      prisma.category.create({ data: { name: 'Blusas', slug: 'blusas' } }),
      prisma.category.create({ data: { name: 'Acessórios', slug: 'acessorios' } }),
      prisma.category.create({ data: { name: 'Vestidos', slug: 'vestidos' } }),
      prisma.category.create({ data: { name: 'Decoração', slug: 'decoracao' } }),
      prisma.category.create({ data: { name: 'Presentes Artesanais', slug: 'presentes-artesanais' } }),
    ])

  const produtos = [
    // Tops
    {
      name: 'Top de Crochê Azul Artesanal',
      slug: 'top-croche-azul-artesanal',
      image: '/colecao-top.jpg',
      categoryId: tops.id,
    },
    {
      name: 'Blusa de Crochê Off White Delicada',
      slug: 'blusa-croche-off-white-delicada',
      image: '/colecao-blusa.jpg',
      categoryId: blusas.id,
    },

    // Acessórios
    {
      name: 'Bolsa Bucket de Crochê Rosa',
      slug: 'bolsa-bucket-croche-rosa',
      image: '/colecao-acessorio.jpg',
      categoryId: acessorios.id,
    },
    {
      name: 'Vestido de Crochê Vazado Off White',
      slug: 'vestido-croche-vazado-off-white',
      image: '/colecao-vestido.jpg',
      categoryId: vestidos.id,
    },

    // Decoração / Blog-style products from available public images
    {
      name: 'Xícara Floral com Base em Crochê',
      slug: 'xicara-floral-base-croche',
      image: '/blog-1.jpg',
      categoryId: decoracao.id,
    },
    {
      name: 'Almofada Decorativa Bordada com Crochê',
      slug: 'almofada-decorativa-bordada-croche',
      image: '/blog-2.jpg',
      categoryId: decoracao.id,
    },
    {
      name: 'Bolsa Bicolor de Crochê Azul e Cru',
      slug: 'bolsa-bicolor-croche-azul-cru',
      image: '/blog-3.jpg',
      categoryId: acessorios.id,
    },

    // Presentes artesanais com fotos do Instagram
    {
      name: 'Sousplat Floral em Crochê Artesanal',
      slug: 'sousplat-floral-croche-artesanal',
      image: '/insta-1.jpg',
      categoryId: decoracao.id,
    },
    {
      name: 'Jogo Americano com Acabamento em Crochê',
      slug: 'jogo-americano-acabamento-croche',
      image: '/insta-2.jpg',
      categoryId: decoracao.id,
    },
    {
      name: 'Quadro Bordado Pequeno Príncipe Artesanal',
      slug: 'quadro-bordado-pequeno-principe-artesanal',
      image: '/insta-3.jpg',
      categoryId: presentes.id,
    },
    {
      name: 'Caneca Personalizada com Kit Afetivo',
      slug: 'caneca-personalizada-kit-afetivo',
      image: '/insta-4.jpg',
      categoryId: presentes.id,
    },
    {
      name: 'Mini Cavalete Decorativo Artesanal',
      slug: 'mini-cavalete-decorativo-artesanal',
      image: '/insta-5.jpg',
      categoryId: decoracao.id,
    },
    {
      name: 'Lembrancinhas em Crochê Coloridas',
      slug: 'lembrancinhas-croche-coloridas',
      image: '/insta-6.jpg',
      categoryId: presentes.id,
    },
  ]

  for (const p of produtos) {
    await prisma.product.create({
      data: {
        name: p.name,
        slug: p.slug,
        description: `${p.name} feita à mão com materiais de qualidade. Produto artesanal exclusivo da Maribela, ideal para presentear ou compor looks e ambientes com delicadeza.`,
        price: 25.00,
        stock: 50,
        handmade: true,
        categories: { connect: [{ id: p.categoryId }] },
        colors: { create: [{ name: 'Artesanal', hex: '#FFFFFF' }] },
        sizes: { create: [{ name: 'Único' }] },
        images: { create: [{ url: p.image }] },
      },
    })
  }

  console.log('🎉 Seed final pronta!')
}

main().finally(() => prisma.$disconnect())
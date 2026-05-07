import 'dotenv/config'
import { PrismaClient } from '../src/generated/client'
import { PrismaPg } from '@prisma/adapter-pg'
import { Pool } from 'pg'

const pool = new Pool({ connectionString: process.env.DATABASE_URL! })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

async function main() {
  console.log('🧹 Resetando blog...')

  await prisma.postSEO.deleteMany()
  await prisma.post.deleteMany()
  await prisma.blogCategory.deleteMany()

  console.log('✅ Blog limpo!')

  // ─────────────────────────────────────────
  // 📂 CATEGORIAS COM IMAGEM (HOME)
  // ─────────────────────────────────────────
  const [croche, ecobags, cuidados] = await Promise.all([
    prisma.blogCategory.create({
      data: {
        name: 'Crochê Contemporâneo',
        slug: 'croche-contemporaneo',
        description:
          'Peças de crochê feitas à mão com delicadeza, autenticidade e estilo para o dia a dia.',
        image: '/colecao-top.jpg',
        showOnHome: true,
        featured: true,
        order: 1,
      },
    }),

    prisma.blogCategory.create({
      data: {
        name: 'Ecobags & Acessórios',
        slug: 'ecobags-e-acessorios',
        description:
          'Bolsas, ecobags e acessórios artesanais com charme, funcionalidade e produção exclusiva.',
        image: '/colecao-acessorio.jpg',
        showOnHome: true,
        featured: true,
        order: 2,
      },
    }),

    prisma.blogCategory.create({
      data: {
        name: 'Cuidados & Inspirações',
        slug: 'cuidados-e-inspiracoes',
        description:
          'Dicas para conservar suas peças, valorizar o artesanal e usar crochê com leveza e personalidade.',
        image: '/blog-2.jpg',
        showOnHome: true,
        featured: false,
        order: 3,
      },
    }),
  ])

  // ─────────────────────────────────────────
  // 📝 POSTS
  // ─────────────────────────────────────────
  const posts = [
    {
      title:
        'Crochê contemporâneo: como usar peças artesanais com estilo no dia a dia',
      slug: 'croche-contemporaneo-como-usar-no-dia-a-dia',
      excerpt:
        'Descubra como incluir peças de crochê no visual com leveza, autenticidade e elegância.',
      categoryId: croche.id,
      content: `
## Crochê com identidade e presença

O crochê deixou de ser apenas uma peça ocasional e passou a ocupar um lugar de destaque em produções modernas, leves e cheias de personalidade.

Na Maribela, cada criação nasce do processo manual, com atenção aos detalhes, escolha cuidadosa dos fios e acabamento pensado para valorizar o visual com autenticidade.

## Peças que funcionam bem em diferentes ocasiões

Algumas peças artesanais são versáteis e fáceis de combinar no dia a dia:

- Tops de crochê com calças de cintura alta
- Blusas artesanais com jeans ou alfaiataria leve
- Vestidos em crochê para propostas mais frescas e femininas
- Acessórios feitos à mão para dar personalidade ao look

## Como equilibrar o visual

Para montar uma produção harmônica, vale apostar em combinações simples:

- Use o crochê como ponto de destaque do look
- Misture com tecidos leves e modelagens mais neutras
- Prefira tons naturais, rosados ou claros para um resultado delicado
- Complete com acessórios que mantenham a proposta artesanal

## O valor do feito à mão

Mais do que tendência, o crochê carrega tempo, cuidado e identidade. Quando você escolhe uma peça artesanal, escolhe também exclusividade e um processo de criação com mais intenção.

## Conclusão

Peças de crochê podem ser modernas, elegantes e fáceis de usar. O segredo está em escolher modelos bem feitos, com caimento bonito e acabamento cuidadoso.
      `,
      seo: {
        metaTitle:
          'Crochê contemporâneo: como usar peças artesanais com estilo',
        metaDesc:
          'Veja como usar crochê contemporâneo em looks leves, modernos e autênticos com peças feitas à mão.',
        keywords:
          'crochê contemporâneo, moda artesanal, looks com crochê, peças feitas à mão, crochê feminino',
      },
    },

    {
      title:
        'Ecobags artesanais: beleza, praticidade e sustentabilidade em uma só peça',
      slug: 'ecobags-artesanais-beleza-praticidade-sustentabilidade',
      excerpt:
        'Entenda por que as ecobags artesanais se tornaram peças queridas para a rotina e para presentear.',
      categoryId: ecobags.id,
      content: `
## Muito além de uma bolsa

As ecobags artesanais unem funcionalidade e estética. Elas acompanham a rotina, ajudam na organização e ainda refletem um consumo mais consciente.

Na proposta da Maribela, as ecobags e bolsas feitas à mão carregam o cuidado do processo artesanal e a beleza de uma peça exclusiva.

## Por que escolher uma ecobag artesanal

Diferente de uma peça produzida em escala, uma ecobag artesanal transmite presença e originalidade.

### Principais vantagens

- Produção com identidade própria
- Visual delicado e exclusivo
- Versatilidade para diferentes ocasiões
- Valorização do trabalho manual
- Escolha mais alinhada a um consumo consciente

## Como usar no dia a dia

As ecobags combinam com uma rotina prática e também com produções mais estilosas:

- Para saídas rápidas e compromissos do cotidiano
- Como bolsa de apoio em viagens e passeios
- Em composições com vestidos, jeans e peças leves
- Como opção charmosa para presentear

## Artesanal com propósito

Escolher uma peça artesanal também é escolher um produto com história. Cada ponto, textura e detalhe mostra que houve tempo e intenção em cada etapa da criação.

## Conclusão

As ecobags artesanais são uma escolha bonita, útil e cheia de significado. Elas unem estilo, praticidade e o valor único do feito à mão.
      `,
      seo: {
        metaTitle:
          'Ecobags artesanais: beleza, praticidade e sustentabilidade',
        metaDesc:
          'Conheça as vantagens das ecobags artesanais e veja por que elas unem estilo, funcionalidade e exclusividade.',
        keywords:
          'ecobag artesanal, bolsa artesanal, acessórios artesanais, bolsa de crochê, consumo consciente',
      },
    },

    {
      title:
        'Como cuidar das suas peças de crochê e manter a beleza do artesanal por mais tempo',
      slug: 'como-cuidar-das-pecas-de-croche',
      excerpt:
        'Aprenda cuidados simples para conservar suas peças de crochê com beleza, estrutura e delicadeza.',
      categoryId: cuidados.id,
      content: `
## O artesanal merece cuidado especial

Peças feitas à mão têm valor afetivo, visual e material. Por isso, alguns cuidados no uso e na conservação fazem toda a diferença.

Quando uma peça de crochê é bem cuidada, ela mantém por mais tempo sua textura, sua estrutura e sua beleza original.

## Cuidados básicos no dia a dia

Para preservar suas peças artesanais, vale seguir algumas recomendações simples:

- Lave à mão, de forma delicada
- Use sabão neutro
- Evite torcer com força
- Seque à sombra
- Guarde a peça em local limpo e arejado

## Atenção ao armazenamento

Guardar corretamente também ajuda a manter o caimento e o acabamento:

- Evite pendurar peças mais delicadas por longos períodos
- Prefira dobrar com cuidado
- Não deixe em locais úmidos
- Separe acessórios para evitar atrito com fios e tramas

## Por que isso importa

Uma peça artesanal não é apenas um item de uso. Ela representa tempo, técnica, dedicação e um processo criativo manual. Cuidar bem dela é valorizar tudo isso.

## Conclusão

Com poucos cuidados, suas peças de crochê continuam bonitas e prontas para acompanhar muitos momentos com charme e autenticidade.
      `,
      seo: {
        metaTitle: 'Como cuidar das suas peças de crochê',
        metaDesc:
          'Veja dicas simples para lavar, secar e guardar suas peças de crochê sem perder a beleza do artesanal.',
        keywords:
          'como cuidar de crochê, lavar peça de crochê, conservar crochê, cuidados com peças artesanais',
      },
    },

    {
      title:
        'Peças exclusivas feitas à mão: por que o artesanal tem um valor diferente',
      slug: 'pecas-exclusivas-feitas-a-mao',
      excerpt:
        'Entenda o que torna uma peça artesanal exclusiva e por que o feito à mão vai muito além da estética.',
      categoryId: croche.id,
      content: `
## Exclusividade de verdade

Uma peça artesanal carrega detalhes que não podem ser reproduzidos de forma industrial. Isso faz com que cada criação tenha identidade própria.

Na Maribela, o processo manual faz parte do valor da peça: do fio à finalização, tudo passa por cuidado, técnica e intenção.

## O que diferencia o artesanal

Ao escolher uma peça feita à mão, você leva mais do que um produto bonito:

- Acabamento cuidadoso
- Produção em menor escala
- Mais autenticidade
- Mais conexão com quem produz
- Mais valor simbólico e emocional

## Artesanal e consumo consciente

Peças exclusivas também ajudam a desacelerar o consumo automático. Em vez de comprar algo genérico, você investe em um item com história e presença.

## Para usar e presentear

O artesanal funciona muito bem para quem deseja:

- Montar um estilo mais autêntico
- Valorizar o feito à mão
- Dar presentes com significado
- Escolher produtos fora do comum

## Conclusão

O valor do artesanal está na soma entre beleza, processo e exclusividade. É isso que torna cada peça especial.
      `,
      seo: {
        metaTitle:
          'Peças exclusivas feitas à mão: o valor do artesanal',
        metaDesc:
          'Descubra por que peças exclusivas feitas à mão têm mais autenticidade, cuidado e significado.',
        keywords:
          'peças exclusivas, feito à mão, artesanal, crochê exclusivo, valor do artesanal',
      },
    },

    {
      title:
        'Como pedir sua peça artesanal pelo WhatsApp de forma simples e personalizada',
      slug: 'como-pedir-sua-peca-artesanal-pelo-whatsapp',
      excerpt:
        'Veja como funciona o pedido de peças artesanais pelo WhatsApp e o que considerar ao fazer sua encomenda.',
      categoryId: ecobags.id,
      content: `
## Um atendimento mais próximo

Uma das vantagens de comprar uma peça artesanal é poder conversar diretamente com quem produz. Isso torna o atendimento mais humano, claro e personalizado.

A Maribela orienta o pedido pelo WhatsApp, o que facilita o contato, o envio de referências e o alinhamento dos detalhes da encomenda.

## O que informar no pedido

Para agilizar o atendimento, vale mandar algumas informações logo no início:

- Tipo de peça desejada
- Cores de preferência
- Referência de modelo
- Prazo pretendido
- Cidade para envio

## Benefícios da encomenda personalizada

Pedir pelo WhatsApp ajuda a tornar a compra mais prática e mais próxima:

- Atendimento direto
- Mais clareza sobre a peça
- Possibilidade de personalização
- Mais confiança durante o processo

## Antes de finalizar

Sempre confirme detalhes como tamanho, cor, prazo e forma de envio. Isso evita dúvidas e ajuda a garantir uma experiência melhor.

## Conclusão

Encomendar pelo WhatsApp é uma forma simples, direta e acolhedora de comprar uma peça artesanal feita especialmente para você.
      `,
      seo: {
        metaTitle: 'Como pedir sua peça artesanal pelo WhatsApp',
        metaDesc:
          'Aprenda como fazer sua encomenda artesanal pelo WhatsApp com mais praticidade e personalização.',
        keywords:
          'encomenda pelo whatsapp, peça artesanal personalizada, comprar crochê pelo whatsapp, maribela',
      },
    },

    {
      title: 'A beleza do processo artesanal: do fio à peça pronta',
      slug: 'a-beleza-do-processo-artesanal',
      excerpt:
        'Conheça o valor do processo artesanal e entenda por que cada etapa faz diferença no resultado final.',
      categoryId: cuidados.id,
      content: `
## Cada detalhe importa

No artesanal, o resultado final é construído ponto por ponto. O processo exige tempo, presença, técnica e sensibilidade.

Esse cuidado aparece no acabamento, no caimento e na personalidade de cada peça pronta.

## O processo vai além da execução

Criar uma peça artesanal envolve várias escolhas importantes:

- Seleção de materiais
- Definição de cores
- Construção da trama
- Ajustes de formato e acabamento
- Revisão final antes da entrega

## Por que isso encanta tanto

Muita gente se conecta com o artesanal justamente porque percebe esse cuidado em cada etapa. Não é apenas sobre comprar uma peça, mas sobre receber algo feito com intenção.

## O valor do feito à mão

Quando o processo é valorizado, o produto final ganha ainda mais significado. Isso fortalece a relação com a peça e torna a experiência mais especial.

## Conclusão

Do fio à peça pronta, o artesanal revela beleza no tempo, no cuidado e na dedicação de quem cria.
      `,
      seo: {
        metaTitle:
          'A beleza do processo artesanal: do fio à peça pronta',
        metaDesc:
          'Entenda por que o processo artesanal faz toda a diferença em peças feitas à mão com cuidado e autenticidade.',
        keywords:
          'processo artesanal, feito à mão, crochê artesanal, peça artesanal, maribela ateliê',
      },
    },
  ]

  for (const p of posts) {
    await prisma.post.create({
      data: {
        title: p.title,
        slug: p.slug,
        excerpt: p.excerpt,
        content: p.content,
        categoryId: p.categoryId,
        published: true,
        seo: {
          create: p.seo,
        },
      },
    })
  }

  console.log('🎉 Blog da Maribela criado com conteúdo alinhado à marca!')
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect()
  })
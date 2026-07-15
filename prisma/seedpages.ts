// prisma/seed.ts
import 'dotenv/config'
import { PrismaClient } from '../src/generated/client'
import { PrismaPg } from '@prisma/adapter-pg'
import { Pool } from 'pg'
import bcrypt from 'bcryptjs'

const pool = new Pool({ connectionString: process.env.DATABASE_URL! })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

async function main() {
  console.log('🧹 Limpando Paginas...')


  await prisma.customPage.deleteMany()

  console.log('✅ Paginas limpas!')

  // ─────────────────────────────────────────
  // 📄 PÁGINAS CUSTOMIZADAS
  // ─────────────────────────────────────────
 await prisma.customPage.createMany({
  data: [
    {
      slug: 'sobre',
      title: 'Sobre a Maribela',
      introText:
        'A Maribela é uma marca de crochê feminino artesanal do Rio de Janeiro, especializada em peças contemporâneas feitas à mão — tops, blusas, vestidos, bolsas e ecobags com design autoral e produção limitada.',
      section1Title: 'Amor e dedicação em cada laçada',
      section1Text:
        'A Maribela nasceu da crença de que o crochê pode ser moderno, elegante e cheio de personalidade. Cada peça é criada artesanalmente com os melhores fios, atenção ao caimento e cuidado no acabamento — para mulheres que valorizam autenticidade e estilo atemporal. Com entrega para todo o Brasil e atendimento personalizado, a Maribela leva o melhor do artesanal contemporâneo até você.',
    },
    {
      slug: 'personalizado',
      title: 'Encomendas exclusivas Maribela',
      introText:
        'Além das peças disponíveis na loja, a Maribela aceita encomendas personalizadas. Você escolhe o modelo, a cor e os detalhes — a gente cria a peça dos seus sonhos com todo o cuidado artesanal.',
      section1Title: 'Como funciona uma encomenda?',
      section1Text:
        'O processo é simples e próximo: você entra em contato pelo WhatsApp, descrevemos juntos o que você busca — modelo, cor, tamanho — e a Maribela produz sua peça com exclusividade. Produção limitada e com data de entrega combinada.',
      faq: [
        {
          pergunta: 'Vocês fazem encomendas de peças específicas?',
          resposta:
            'Sim! Aceitamos encomendas de tops, blusas, vestidos, bolsas e ecobags personalizadas. Entre em contato pelo WhatsApp para combinar os detalhes.',
        },
        {
          pergunta: 'Posso escolher a cor da minha peça?',
          resposta:
            'Sim, você pode escolher entre as opções disponíveis de fios. Basta informar na hora do pedido e a gente confirma a disponibilidade.',
        },
        {
          pergunta: 'As peças são enviadas para todo o Brasil?',
          resposta:
            'Sim! Enviamos para todo o território nacional com embalagem especial e muito carinho.',
        },
        {
          pergunta: 'Qual o prazo para uma peça encomendada?',
          resposta:
            'O prazo médio para encomendas é de 10 a 20 dias úteis após a confirmação e pagamento, podendo variar conforme a complexidade da peça.',
        },
      ],
    },
  ],
})
console.log('✅ Páginas sobre e personalizado criadas — maribela.com.br')

}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
import { withAdmin } from '@/core/lib/admin-access'
import { NextResponse } from 'next/server'
import prisma from '@/core/lib/prisma'
import { createAsaasAccount } from '@/core/lib/asaas'

type CreateClientBody = {
  name: string
  email: string
  cpfCnpj?: string
  phone?: string
}

export const POST = withAdmin(async function POST(req: Request) {
  try {
    const body = (await req.json()) as CreateClientBody
    const name = body.name?.trim()
    const email = body.email?.trim()
    const cpfCnpj = body.cpfCnpj?.trim() || undefined
    const phone = body.phone?.trim() || undefined

    if (!name || !email) {
      return NextResponse.json({ error: 'Nome e email são obrigatórios.' }, { status: 400 })
    }

    const asaasAccount = await createAsaasAccount({
      name,
      email,
      cpfCnpj,
      phone,
    })

    const client = await prisma.client.create({
      data: {
        name,
        email,
        cpfCnpj,
        phone,
        asaasAccountId: asaasAccount.id,
        asaasWalletId: asaasAccount.walletId,
      },
    })

    return NextResponse.json({ client }, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Não foi possível criar o cliente.' }, { status: 500 })
  }
})

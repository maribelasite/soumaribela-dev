import { withAdmin } from '@/core/lib/admin-access'
/**
 * Validates Asaas API key by making a simple test request
 * GET /api/asaas/validate-key
 */

import { NextRequest, NextResponse } from 'next/server';
import { asaasFetch, maskApiKey, getAsaasConfig } from '@/core/lib/asaas';

export const runtime = 'nodejs';

export const GET = withAdmin(async function GET(req: NextRequest) {
  try {
    const config = getAsaasConfig();
    const env = config.isSandbox ? 'SANDBOX' : 'PRODUCTION';
    
    console.log(`[Asaas Validate] Testing API key on ${env} environment`);
    
    // Make a simple GET request to validate the key
    await asaasFetch('/customers?limit=1');
    
    return NextResponse.json({
      valid: true,
      environment: config.isSandbox ? 'sandbox' : 'production',
      apiKey: maskApiKey(config.apiKey),
      message: `API key válida para ${env}`,
    });
  } catch (error: any) {
    console.error('[Asaas Validate Error]:', error);
    
    return NextResponse.json(
      {
        valid: false,
        error: 'Não foi possível validar a configuração Asaas.',
      },
      { status: 400 }
    );
  }
})

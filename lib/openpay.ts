/**
 * Configuración compartida de Openpay Colombia (solo servidor).
 * OPENPAY_SANDBOX='true' → sandbox; cualquier otro valor → producción.
 */
const SANDBOX_BASE_URL = 'https://sandbox-api.openpay.co'
const PRODUCTION_BASE_URL = 'https://api.openpay.co'

export interface OpenpayConfig {
  baseUrl: string
  merchantId: string
  authHeader: string
}

export function getOpenpayConfig(): OpenpayConfig | null {
  const merchantId = process.env.OPENPAY_MERCHANT_ID
  const privateKey = process.env.OPENPAY_PRIVATE_KEY

  if (!merchantId || !privateKey) return null

  return {
    baseUrl: process.env.OPENPAY_SANDBOX === 'true' ? SANDBOX_BASE_URL : PRODUCTION_BASE_URL,
    merchantId,
    authHeader: `Basic ${Buffer.from(`${privateKey}:`).toString('base64')}`,
  }
}

export interface OpenpayCharge {
  id: string
  status: string
  order_id?: string
  amount: number
}

/** Consulta un cargo directamente en Openpay para confirmar su estado real. */
export async function fetchOpenpayCharge(chargeId: string): Promise<OpenpayCharge | null> {
  const config = getOpenpayConfig()
  if (!config) return null

  const res = await fetch(`${config.baseUrl}/v1/${config.merchantId}/charges/${encodeURIComponent(chargeId)}`, {
    headers: { Authorization: config.authHeader },
    cache: 'no-store',
  })

  if (!res.ok) {
    console.error('Openpay: no se pudo consultar el cargo', chargeId, res.status)
    return null
  }

  return (await res.json()) as OpenpayCharge
}


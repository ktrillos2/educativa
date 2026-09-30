import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'
import { join } from 'path'

// Load environment variables from .env.local
dotenv.config({ path: join(process.cwd(), '.env.local') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !serviceRoleKey) {
  console.error('Missing SUPABASE_SERVICE_ROLE_KEY or NEXT_PUBLIC_SUPABASE_URL')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: { autoRefreshToken: false, persistSession: false }
})

async function updateAddresses() {
  console.log('Fetching users...')
  
  // Get all users
  const { data: users, error: fetchError } = await supabase
    .from('users')
    .select('id, address, name')

  if (fetchError) {
    console.error('Error fetching users:', fetchError)
    process.exit(1)
  }

  console.log(`Found ${users.length} users.`)

  let updatedCount = 0

  for (const user of users) {
    if (!user.address || user.address.trim() === '') {
      console.log(`Updating address for user: ${user.name} (${user.id})`)
      
      const { error: updateError } = await supabase
        .from('users')
        .update({ address: 'No registrada' })
        .eq('id', user.id)
        
      if (updateError) {
        console.error(`Error updating user ${user.id}:`, updateError)
      } else {
        updatedCount++
      }
    }
  }

  console.log(`\nSuccessfully updated ${updatedCount} users without an address.`)
}

updateAddresses()

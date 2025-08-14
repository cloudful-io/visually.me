'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'

export default function Database() {
  const [users, setUsers] = useState<any[]>([])

  useEffect(() => {
    supabase.from('users').select('*').then(({ data, error }) => {
      if (!error && data) setUsers(data)
    })
  }, [])

  return (
    <ul>
      {users.map((u) => <li key={u.id}>{u.id} - {u.full_name}</li>)}
    </ul>
  )
}

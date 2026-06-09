import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

// Protected routes that require authentication
const PROTECTED_ROUTES = ['/estudiante', '/admin']
// Auth routes that should redirect logged-in users
const AUTH_ROUTES = ['/login', '/register']
// Admin-only routes
const ADMIN_ROUTES = ['/admin']

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // IMPORTANT: Avoid writing any logic between createServerClient and
  // supabase.auth.getUser(). A simple mistake could make it very hard to debug
  // issues with users being randomly logged out.

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const pathname = request.nextUrl.pathname

  // If the user is NOT logged in and tries to access a protected route → redirect to /login
  const isProtected = PROTECTED_ROUTES.some((route) => pathname.startsWith(route))
  if (!user && isProtected) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }

  // If the user IS logged in and tries to access /login or /register → redirect to their dashboard
  const isAuthRoute = AUTH_ROUTES.some((route) => pathname.startsWith(route))
  if (user && isAuthRoute) {
    // Fetch the user's role to determine which dashboard to redirect to
    const { data: profile } = await supabase
      .from('users')
      .select('role')
      .eq('id', user.id)
      .single()

    const url = request.nextUrl.clone()
    url.pathname = profile?.role === 'admin' ? '/admin' : '/estudiante'
    return NextResponse.redirect(url)
  }

  // If the user is logged in but does NOT have admin role and tries to access /admin → redirect to /estudiante
  const isAdminRoute = ADMIN_ROUTES.some((route) => pathname.startsWith(route))
  if (user && isAdminRoute) {
    const { data: profile } = await supabase
      .from('users')
      .select('role')
      .eq('id', user.id)
      .single()

    if (profile?.role !== 'admin') {
      const url = request.nextUrl.clone()
      url.pathname = '/estudiante'
      return NextResponse.redirect(url)
    }
  }

  return supabaseResponse
}

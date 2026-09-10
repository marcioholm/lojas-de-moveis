import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

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

  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Protect internal routes, allow public vitrine
  const isPublicRoute = request.nextUrl.pathname.startsWith('/loja') || request.nextUrl.pathname.startsWith('/login')
  
  if (!user && !isPublicRoute) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }

  // If user is logged in and tries to access login, redirect to app
  if (user && request.nextUrl.pathname === '/login') {
    const url = request.nextUrl.clone()
    url.pathname = '/app/dashboard'
    return NextResponse.redirect(url)
  }

  // Force onboarding if setup is incomplete (wrapped in try/catch to avoid breaking if migration is missing)
  if (user && request.nextUrl.pathname.startsWith('/app') && request.nextUrl.pathname !== '/app/onboarding') {
    try {
      const { data: profile } = await supabase.from('profiles').select('tenant_id').eq('id', user.id).single()
      if (profile?.tenant_id) {
        const { data: tenant } = await supabase.from('tenants').select('setup_concluido').eq('id', profile.tenant_id).single()
        if (tenant && tenant.setup_concluido === false) {
          const url = request.nextUrl.clone()
          url.pathname = '/app/onboarding'
          return NextResponse.redirect(url)
        }
      }
    } catch(e) {
      // Ignore if columns don't exist yet
    }
  }

  // If user goes to root, redirect to dashboard or login
  if (request.nextUrl.pathname === '/') {
    const url = request.nextUrl.clone()
    url.pathname = user ? '/app/dashboard' : '/login'
    return NextResponse.redirect(url)
  }

  return supabaseResponse
}

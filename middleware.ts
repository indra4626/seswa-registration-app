import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    const response = NextResponse.next();

    // Security Headers
    // Prevent the site from being embedded in an iframe (clickjacking protection)
    response.headers.set('X-Frame-Options', 'DENY');

    // protect against XSS attacks
    response.headers.set('X-XSS-Protection', '1; mode=block');

    // prevent MIME type sniffing
    response.headers.set('X-Content-Type-Options', 'nosniff');

    // Referrer Policy
    response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');

    // Content Security Policy (Basic) - allows resources from self and common CDNs used in the app
    // We allow 'unsafe-inline' for styles because many CSS-in-JS libs need it, and for scripts because of Next.js hydration
    // In a stricter environment, we would use nonces.
    const csp = `
    default-src 'self';
    script-src 'self' 'unsafe-eval' 'unsafe-inline' https://cdnjs.cloudflare.com https://cdn.jsdelivr.net;
    style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
    img-src 'self' blob: data: https://*;
    font-src 'self' https://fonts.gstatic.com;
    connect-src 'self' https://*.mongodb.net;
    frame-ancestors 'none';
  `;

    // Remove newlines and extra spaces from CSP string
    response.headers.set('Content-Security-Policy', csp.replace(/\s{2,}/g, ' ').trim());

    return response;
}

export const config = {
    matcher: '/:path*',
};

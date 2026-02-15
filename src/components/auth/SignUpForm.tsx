'use client';

import { SignUp } from '@clerk/nextjs';
import Link from 'next/link';
import { useState } from 'react';

export function SignUpForm() {
  const [userRole, setUserRole] = useState<'tenant' | 'landlord' | null>(null);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        <div className="rounded-lg bg-white p-8 shadow-lg">
          <div className="mb-8 space-y-2">
            <h1 className="text-3xl font-bold text-slate-900">Sign Up</h1>
            <p className="text-slate-600">Join PropEstate today</p>
          </div>

          {!userRole ? (
            <div className="space-y-4">
              <p className="mb-4 text-sm font-medium text-slate-700">I am a...</p>
              <button
                onClick={() => setUserRole('tenant')}
                className="w-full rounded-lg border-2 border-slate-300 bg-white p-4 text-left font-medium text-slate-900 transition-all duration-200 hover:border-blue-500 hover:bg-blue-50"
              >
                <div className="font-semibold">🏠 Tenant</div>
                <div className="text-sm text-slate-600">Looking to rent a property</div>
              </button>
              <button
                onClick={() => setUserRole('landlord')}
                className="w-full rounded-lg border-2 border-slate-300 bg-white p-4 text-left font-medium text-slate-900 transition-all duration-200 hover:border-blue-500 hover:bg-blue-50"
              >
                <div className="font-semibold">🏢 Landlord</div>
                <div className="text-sm text-slate-600">Listing properties for rent</div>
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="rounded-lg bg-blue-50 p-3 text-sm text-blue-900">
                Signing up as: <span className="font-semibold">{userRole === 'tenant' ? 'Tenant' : 'Landlord'}</span>
                <button
                  onClick={() => setUserRole(null)}
                  className="float-right text-blue-600 hover:text-blue-800"
                >
                  Change
                </button>
              </div>

              <div>
                <SignUp
                  appearance={{
                    elements: {
                      rootBox: 'w-full',
                      card: 'shadow-none',
                      formButtonPrimary:
                        'w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200',
                      formFieldInput: 'w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent',
                      identifierInput: 'w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent',
                      formFieldLabel: 'text-slate-700 font-medium mb-1',
                      footerAction: 'justify-center',
                      footerActionLink: 'text-blue-600 hover:text-blue-700 font-medium',
                      dividerLine: 'bg-slate-200',
                      dividerText: 'text-slate-500',
                      socialButtonsBlockButton:
                        'w-full border border-slate-300 text-slate-700 font-medium py-2 px-4 rounded-lg hover:bg-slate-50 transition-colors duration-200',
                      socialButtonsBlockButtonText: 'font-medium',
                      headerTitle: 'text-slate-900 font-bold',
                      headerSubtitle: 'text-slate-600',
                    },
                  }}
                  unsafeMetadata={{
                    role: userRole,
                  }}
                  redirectUrl="/"
                  fallbackRedirectUrl="/"
                />
              </div>
            </div>
          )}

          <div className="mt-6 text-center">
            <p className="text-slate-600">
              Already have an account?{' '}
              <Link href="/sign-in" className="font-semibold text-blue-600 hover:text-blue-700">
                Sign in
              </Link>
            </p>
          </div>
        </div>

        <div className="mt-8 text-center">
          <Link href="/" className="text-sm text-slate-600 hover:text-slate-900">
            ← Back to home
          </Link>
        </div>
      </div>
    </div>
  );
}

'use client';

import { SignIn } from '@clerk/nextjs';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export function SignInForm() {
  const router = useRouter();

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        <div className="rounded-lg bg-white p-8 shadow-lg">
          <div className="mb-8 space-y-2">
            <h1 className="text-3xl font-bold text-slate-900">Sign In</h1>
            <p className="text-slate-600">Welcome back to PropEstate</p>
          </div>

          <div className="mb-6">
            <SignIn
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
              redirectUrl="/"
            />
          </div>

          <div className="mt-6 text-center">
            <p className="text-slate-600">
              Don't have an account?{' '}
              <Link href="/sign-up" className="font-semibold text-blue-600 hover:text-blue-700">
                Sign up
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

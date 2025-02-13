'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const router = useRouter();

  const handleLogin = async () => {
    setIsLoading(true);

    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    setIsLoading(false);

    if (res.ok) {
      const { token, user } = await res.json();

      localStorage.setItem('token', token);
      console.log('Token:', token);
      console.log('User Role:', user.role);

      if (user.role === 'ADMIN') {
        router.push('/dashboard');
        return;
      } else if (user.role === 'CLIENT') {
        router.push('/');
        return;
      }
    } else {
      const errorData = await res.json();
      setErrorMessage(errorData.error);
    }
  };

  return (
    <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <Image
          className="mx-auto h-10 w-auto dark:hidden"
          width={144}
          height={32}
          src="/images/logo.svg"
          alt="YumiMind"
          priority
          style={{ width: "auto", height: "auto" }}
        />
        <Image
          width={144}
          height={32}
          src="/images/logo.svg"
          alt="YumiMind"
          priority
          className="hidden dark:block mx-auto h-10 w-auto"
          style={{ width: "auto", height: "auto" }}
        />
        <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
          Se connecter à votre compte
        </h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); handleLogin(); }}>
          <div>
            <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">Adresse email</label>
            <div className="mt-2">
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
              />
            </div>
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">Mot de passe</label>
            <div className="mt-2">
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Mot de passe"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className={`flex w-full justify-center rounded-md px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm ${isLoading ? 'bg-gray-400' : 'bg-indigo-600 hover:bg-indigo-500'} focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600`}
            >
              {isLoading ? 'Chargement...' : 'Se connecter'}
            </button>
          </div>
        </form>

        {errorMessage && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded shadow-lg text-center">
              <p className="text-red-500">{errorMessage}</p>
              <button
                onClick={() => setErrorMessage('')}
                className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded"
              >
                Fermer
              </button>
            </div>
          </div>
        )}

        <p className="mt-10 text-center text-sm text-gray-500">
          Pas encore membre ? 
          <a href="/auth/signup" className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500"> Créez un compte</a>
        </p>
      </div>
    </div>
  );
}
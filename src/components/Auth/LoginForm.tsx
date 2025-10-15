'use client';

import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Mail, Lock, ArrowRight } from 'lucide-react';

export default function LoginForm() {
  const { signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showSignup, setShowSignup] = useState(false);
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error } = await signIn(email, password);

    if (error) {
      setError(error.message);
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white p-4">
      <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-8 items-center">
        
        {/* Lado Izquierdo - Ilustración/Branding */}
        <div className="hidden lg:flex flex-col justify-center p-12 space-y-8">
          <div className="space-y-6">
            <h1 className="text-5xl font-light text-gray-900 leading-tight">
              Bienvenido a<br />
              <span className="font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Diagramator
              </span>
            </h1>
            
            <p className="text-lg text-gray-500 font-light leading-relaxed max-w-md">
              Crea diagramas de procesos de negocio de forma inteligente y colaborativa.
            </p>
          </div>

        </div>

        {/* Lado Derecho - Formulario Minimalista */}
        <div className="w-full max-w-md mx-auto lg:mx-0">
          {/* Logo móvil */}
          <div className="lg:hidden text-center mb-12">
            <h1 className="text-3xl font-light text-gray-900">
              <span className="font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Diagramator
              </span>
            </h1>
          </div>

          <div className="space-y-8">
            {/* Título */}
            <div className="space-y-2">
              <h2 className="text-3xl font-light text-gray-900">
                {showSignup ? 'Crear cuenta' : 'Iniciar sesión'}
              </h2>
              <p className="text-sm text-gray-500">
                {showSignup 
                  ? 'Únete y comienza a crear' 
                  : 'Continúa donde lo dejaste'}
              </p>
            </div>

            {/* Error message */}
            {error && (
              <div className="p-4 bg-red-50 border-l-4 border-red-400 text-red-700 text-sm animate-in slide-in-from-top">
                {error}
              </div>
            )}

            {/* Formulario */}
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Email Input */}
              <div className="space-y-2">
                <label className="block text-xs uppercase tracking-wider text-gray-500 font-medium">
                  Correo electrónico
                </label>
                <div className="relative group">
                  <Mail className={`absolute left-0 top-3.5 w-5 h-5 transition-colors ${
                    emailFocused ? 'text-blue-600' : 'text-gray-400'
                  }`} />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onFocus={() => setEmailFocused(true)}
                    onBlur={() => setEmailFocused(false)}
                    className="w-full pl-8 pr-4 py-3 bg-transparent border-b-2 border-gray-200 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-600 transition-colors"
                    placeholder="tu@email.com"
                    required
                  />
                </div>
              </div>

              {/* Password Input */}
              <div className="space-y-2">
                <label className="block text-xs uppercase tracking-wider text-gray-500 font-medium">
                  Contraseña
                </label>
                <div className="relative group">
                  <Lock className={`absolute left-0 top-3.5 w-5 h-5 transition-colors ${
                    passwordFocused ? 'text-blue-600' : 'text-gray-400'
                  }`} />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onFocus={() => setPasswordFocused(true)}
                    onBlur={() => setPasswordFocused(false)}
                    className="w-full pl-8 pr-4 py-3 bg-transparent border-b-2 border-gray-200 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-600 transition-colors"
                    placeholder="••••••••"
                    required
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="group w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-full font-medium hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Cargando...</span>
                  </>
                ) : (
                  <>
                    <span>{showSignup ? 'Crear cuenta' : 'Continuar'}</span>
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </form>


          </div>
        </div>
      </div>
    </div>
  );
}


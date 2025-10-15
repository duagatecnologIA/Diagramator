'use client';

import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Mail, Lock, ArrowRight, Workflow, GitBranch, Zap, Network, Circle, ArrowRightLeft } from 'lucide-react';

export default function LoginForm() {
  const { signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
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
        <div className="hidden lg:flex flex-col justify-center p-12 space-y-8 relative overflow-hidden">
          {/* Elementos decorativos de fondo */}
          <div className="absolute inset-0 opacity-5">
            {/* Nodos de flujo dispersos */}
            <div className="absolute top-20 left-16 w-3 h-3 bg-blue-400 rounded-full animate-pulse"></div>
            <div className="absolute top-32 right-20 w-2 h-2 bg-indigo-400 rounded-full animate-pulse delay-1000"></div>
            <div className="absolute bottom-40 left-24 w-4 h-4 bg-purple-400 rounded-full animate-pulse delay-2000"></div>
            <div className="absolute top-48 right-32 w-2.5 h-2.5 bg-blue-500 rounded-full animate-pulse delay-500"></div>
            
            {/* Líneas de conexión sutiles */}
            <svg className="absolute inset-0 w-full h-full" viewBox="0 0 400 300">
              <path 
                d="M80 80 Q200 120 320 80" 
                stroke="currentColor" 
                strokeWidth="1" 
                fill="none" 
                className="text-blue-200"
                strokeDasharray="2,4"
              />
              <path 
                d="M60 200 Q200 160 340 200" 
                stroke="currentColor" 
                strokeWidth="1" 
                fill="none" 
                className="text-indigo-200"
                strokeDasharray="3,6"
              />
              <path 
                d="M100 250 Q200 180 300 120" 
                stroke="currentColor" 
                strokeWidth="1" 
                fill="none" 
                className="text-purple-200"
                strokeDasharray="1,3"
              />
            </svg>
          </div>

          <div className="space-y-6 relative z-10">
            <h1 className="text-5xl font-light text-gray-900 leading-tight">
              Bienvenido a<br />
              <span className="font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Diagramator
              </span>
            </h1>
            
            <p className="text-lg text-gray-500 font-light leading-relaxed max-w-md">
              Crea diagramas de procesos de negocio de forma inteligente y colaborativa.
            </p>

            {/* Iconos de flujo de trabajo */}
            <div className="flex items-center gap-6 pt-8">
              <div className="flex items-center gap-3 px-4 py-2 bg-blue-50 rounded-full">
                <Workflow className="w-5 h-5 text-blue-600" />
                <span className="text-sm font-medium text-blue-700">Flujos Inteligentes</span>
              </div>
              
              <div className="flex items-center gap-3 px-4 py-2 bg-indigo-50 rounded-full">
                <Network className="w-5 h-5 text-indigo-600" />
                <span className="text-sm font-medium text-indigo-700">Conecta Todo</span>
              </div>
            </div>

            {/* Mini diagrama decorativo */}
            <div className="pt-8">
              <div className="flex items-center gap-4 text-gray-400">
                <div className="flex items-center gap-2">
                  <Circle className="w-3 h-3 text-blue-500" />
                  <span className="text-xs">Inicio</span>
                </div>
                <ArrowRightLeft className="w-4 h-4" />
                <div className="flex items-center gap-2">
                  <GitBranch className="w-3 h-3 text-indigo-500" />
                  <span className="text-xs">Proceso</span>
                </div>
                <ArrowRightLeft className="w-4 h-4" />
                <div className="flex items-center gap-2">
                  <Zap className="w-3 h-3 text-purple-500" />
                  <span className="text-xs">Resultado</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Lado Derecho - Formulario Minimalista */}
        <div className="w-full max-w-md mx-auto lg:mx-0 relative">
          {/* Elementos decorativos sutiles */}
          <div className="absolute -top-4 -right-4 w-8 h-8 bg-blue-100 rounded-full opacity-30"></div>
          <div className="absolute -bottom-8 -left-4 w-6 h-6 bg-indigo-100 rounded-full opacity-40"></div>
          
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


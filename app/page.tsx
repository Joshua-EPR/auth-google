"use client"

import { useEffect, useState } from "react"
import { jwtDecode } from "jwt-decode"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface UserData {
  name: string
  email: string
  profilepicture: string
}

export default function LoginPage() {
  const [userData, setUserData] = useState<UserData | null>(null)

  useEffect(() => {
    // Verificar si hay un token en la URL
    const urlParams = new URLSearchParams(window.location.search)
    const token = urlParams.get("token")

    if (token) {
      try {
        // Decodificar el token
        const decoded = jwtDecode(token) as UserData
        console.log("Decoded token:", decoded)
        setUserData(decoded)
        // Guardar el token en localStorage
        localStorage.setItem("auth_token", token)
        // Limpiar la URL
        window.history.replaceState({}, document.title, window.location.pathname)
      } catch (error) {
        console.error("Error al decodificar el token:", error)
      }
    } else {
      // Verificar si hay un token en localStorage
      const storedToken = localStorage.getItem("auth_token")
      if (storedToken) {
        try {
          const decoded = jwtDecode(storedToken) as UserData
          setUserData(decoded)
        } catch (error) {
          console.error("Error al decodificar el token almacenado:", error)
          localStorage.removeItem("auth_token")
        }
      }
    }
  }, [])

  const handleGoogleLogin = () => {
    window.location.href = "http://localhost:3000/auth/google"
  }

  const handleLogout = () => {
    localStorage.removeItem("auth_token")
    setUserData(null)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md p-6 space-y-6">
        {userData ? (
          <div className="space-y-6 text-center">
            <Avatar className="w-24 h-24 mx-auto">
              <AvatarImage src={userData.profilepicture} alt={userData.name} />
              <AvatarFallback>{userData.name[0]}</AvatarFallback>
            </Avatar>
            <div className="space-y-2">
              <h2 className="text-2xl font-bold">{userData.name}</h2>
              <p className="text-muted-foreground">{userData.email}</p>
            </div>
            <Button onClick={handleLogout} variant="destructive" className="w-full">
              Cerrar Sesión
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <h1 className="text-3xl font-bold">Bienvenido</h1>
              <p className="text-muted-foreground">Inicia sesión con tu cuenta de Google</p>
            </div>
            <Button onClick={handleGoogleLogin} className="w-full flex items-center justify-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24" className="w-5 h-5">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
              Iniciar sesión con Google
            </Button>
          </div>
        )}
      </Card>
    </div>
  )
}


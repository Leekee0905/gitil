"use client"

import { createClient } from "@/app/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Github } from "lucide-react"

export function LoginButton() {
  const handleLogin = async () => {
    const supabase = createClient()
    await supabase.auth.signInWithOAuth({
      provider: "github",
      options: {
        redirectTo: `${location.origin}/auth/callback`,
      },
    })
  }

  return (
    <Button onClick={handleLogin} variant="outline" className="gap-2 cursor-pointer">
      <Github className="size-4" />
      Login with GitHub
    </Button>
  )
}

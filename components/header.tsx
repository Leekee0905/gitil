import { createClient } from "@/app/lib/supabase/server"
import Link from "next/link"
import { LoginButton } from "@/components/login-button"
import { LogoutButton } from "@/components/logout-button"
import { Button } from "@/components/ui/button"
import { PenSquare } from "lucide-react"

export async function Header() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-sm dark:bg-zinc-950/80 dark:border-zinc-800">
      <div className="container mx-auto flex h-14 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2 font-semibold">
           <span className="text-xl tracking-tight">GITIL</span>
        </Link>
        
        <div className="flex items-center gap-4">
          {user ? (
            <>
              <Button asChild variant="ghost" size="sm" className="gap-2">
                <Link href="/write">
                  <PenSquare className="size-4" />
                  Write TIL
                </Link>
              </Button>
              <Button asChild variant="ghost" size="sm" className="gap-2">
                 {/* TODO: proper user check */}
                <Link href="/leekee0905"> 
                   Profile
                </Link>
              </Button>
              <LogoutButton />
            </>
          ) : (
            <LoginButton />
          )}
        </div>
      </div>
    </header>
  )
}

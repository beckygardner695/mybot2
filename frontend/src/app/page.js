"use client"

import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="text-center space-y-6">
        <h1 className="text-4xl font-bold">Reddit Bot Control Center</h1>
        <p className="text-xl text-muted-foreground">
          Monitor and manage your Reddit bot from one central location
        </p>
        <Link href="/dashboard">
          <Button size="lg">
            Open Dashboard
          </Button>
        </Link>
      </div>
    </main>
  )
}
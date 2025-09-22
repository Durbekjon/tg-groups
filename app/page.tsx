"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, ArrowLeft, ExternalLink } from "lucide-react"
import { AddGroupModal } from "@/components/add-group-modal"
import { useCategories } from "@/hooks/use-categories"
import { useGroups } from "@/hooks/use-groups"

interface Category { id: string; name: string }
interface TelegramGroup { id: string; name: string; telegramLink: string; categoryId: string }

export default function HomePage() {
  const { categories } = useCategories()
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const { groups, createGroup } = useGroups(selectedCategory?.id)

  // Visitors: increment once per browser per day using a cookie flag
  useEffect(() => {
    try {
      const cookie = document.cookie
        .split(";")
        .map((c) => c.trim())
        .find((c) => c.startsWith("visited_today="))
      if (!cookie) {
        fetch("/api/visitors", { method: "POST" }).catch(() => {})
        const expires = new Date()
        expires.setHours(23, 59, 59, 999)
        document.cookie = `visited_today=1; path=/; expires=${expires.toUTCString()}`
      }
    } catch {}
  }, [])

  const handleAddGroup = async (name: string, telegramLink: string) => {
    if (!selectedCategory) return
    await createGroup({ name, telegramLink, categoryId: selectedCategory.id })
    setIsAddModalOpen(false)
  }

  const handleGroupClick = (telegramLink: string) => {
    window.open(telegramLink, "_blank")
  }

  const filteredGroups = selectedCategory ? groups : []

  if (selectedCategory) {
    return (
      <div className="min-h-screen bg-background p-4 flex flex-col">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" onClick={() => setSelectedCategory(null)} className="p-2">
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <h1 className="text-2xl font-semibold text-foreground">{selectedCategory.name}</h1>
            </div>
            <Button onClick={() => setIsAddModalOpen(true)} size="sm" className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Guruh qo'shish
            </Button>
          </div>

          {/* Groups List */}
          <div className="space-y-3">
            {filteredGroups.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <p className="text-muted-foreground">Bu kategoriyada hali guruhlar yo'q</p>
                  <Button onClick={() => setIsAddModalOpen(true)} className="mt-4" variant="outline">
                    <Plus className="h-4 w-4 mr-2" />
                    Birinchi guruhni qo'shing
                  </Button>
                </CardContent>
              </Card>
            ) : (
              filteredGroups.map((group) => (
                <Card
                  key={group.id}
                  className="cursor-pointer hover:bg-accent/50 transition-colors"
                  onClick={() => handleGroupClick(group.telegramLink)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium text-foreground">{group.name}</h3>
                      <ExternalLink className="h-4 w-4 text-muted-foreground" />
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>

        <AddGroupModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} onAdd={handleAddGroup} />

        <footer className="mt-auto w-full py-6">
          <div className="max-w-2xl mx-auto text-center text-sm text-muted-foreground">
            © {new Date().getFullYear()} Durbek · {" "}
            <a
              href="https://t.me/kydanza"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-foreground"
            >
              t.me/kydanza
            </a>
          </div>
        </footer>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background p-4 flex flex-col">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2"><a style={{ textDecoration:"underline" }} href="https://tuit.uz">TATU</a> - Masofaviy yo'nalishi telegram guruhlari</h1>
          <p className="text-muted-foreground">Yo'nalishni tanlang va guruhlarni ko'ring</p>
        </div>

        {/* Categories Grid */}
        <div className="grid gap-4 sm:grid-cols-2">
          {categories.map((category) => {
            const categoryGroupsCount = category._count?.groups ?? 0

            return (
              <Card
                key={category.id}
                className="cursor-pointer hover:bg-accent/50 transition-colors"
                onClick={() => setSelectedCategory(category)}
              >
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg font-medium text-foreground">{category.name}</CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-sm text-muted-foreground">{categoryGroupsCount} ta guruh</p>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>

      <footer className="mt-auto w-full py-6">
        <div className="max-w-2xl mx-auto text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} Durbek · {" "}
          <a
            href="https://t.me/kydanza"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-foreground"
          >
            t.me/kydanza
          </a>
        </div>
      </footer>
    </div>
  )
}

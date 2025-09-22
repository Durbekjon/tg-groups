"use client"

import { useMemo, useState } from "react"
import { useCategories } from "@/hooks/use-categories"
import { useGroups } from "@/hooks/use-groups"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useVisitors } from "@/hooks/use-visitors"

export default function DashboardPage() {
  const { categories, createCategory } = useCategories()
  const [newCategoryName, setNewCategoryName] = useState("")

  const [selectedCategoryId, setSelectedCategoryId] = useState<string | undefined>(undefined)
  const { groups, createGroup } = useGroups(selectedCategoryId)

  const selectedCategory = useMemo(
    () => categories.find((c) => c.id === selectedCategoryId),
    [categories, selectedCategoryId]
  )

  const [groupName, setGroupName] = useState("")
  const [groupLink, setGroupLink] = useState("")
  const canCreateGroup = Boolean(selectedCategoryId && groupName.trim() && groupLink.trim())
  const { count: visitorsCount } = useVisitors()

  const handleCreateCategory = async () => {
    if (!newCategoryName.trim()) return
    const created = await createCategory(newCategoryName.trim())
    setNewCategoryName("")
    setSelectedCategoryId(created.id)
  }

  const handleCreateGroup = async () => {
    if (!canCreateGroup || !selectedCategoryId) return
    await createGroup({ name: groupName.trim(), telegramLink: groupLink.trim(), categoryId: selectedCategoryId })
    setGroupName("")
    setGroupLink("")
  }

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-3xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>

        <Card>
          <CardHeader>
            <CardTitle className="text-foreground">Kategoriya yaratish</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-2">
              <Label htmlFor="categoryName" className="text-foreground">
                Kategoriya nomi
              </Label>
              <Input
                id="categoryName"
                placeholder="Masalan: Sun'iy intellekt"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
              />
            </div>
            <Button onClick={handleCreateCategory} disabled={!newCategoryName.trim()}>
              Yaratish
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-foreground">Tashrif buyuruvchilar</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-foreground text-xl font-semibold">{visitorsCount}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-foreground">Guruh yaratish</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label className="text-foreground">Kategoriya</Label>
              <Select value={selectedCategoryId} onValueChange={(v) => setSelectedCategoryId(v)}>
                <SelectTrigger>
                  <SelectValue placeholder="Kategoriya tanlang" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="groupName" className="text-foreground">
                  Guruh nomi
                </Label>
                <Input
                  id="groupName"
                  placeholder="Masalan: AI Uzbekistan"
                  value={groupName}
                  onChange={(e) => setGroupName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="groupLink" className="text-foreground">
                  Telegram havolasi
                </Label>
                <Input
                  id="groupLink"
                  placeholder="https://t.me/guruh_nomi"
                  value={groupLink}
                  onChange={(e) => setGroupLink(e.target.value)}
                />
              </div>
            </div>

            <Button onClick={handleCreateGroup} disabled={!canCreateGroup}>
              Yaratish
            </Button>

            <div className="pt-2 text-sm text-muted-foreground">
              {selectedCategory ? `${selectedCategory.name} ichida ${groups.length} ta guruh` : "Kategoriya tanlang"}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-foreground">Mavjud guruhlar</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {!selectedCategoryId ? (
              <div className="text-muted-foreground">Avval kategoriya tanlang</div>
            ) : groups.length === 0 ? (
              <div className="text-muted-foreground">Guruhlar topilmadi</div>
            ) : (
              groups.map((g) => (
                <div key={g.id} className="flex items-center justify-between border rounded-md px-3 py-2">
                  <div>
                    <div className="font-medium text-foreground">{g.name}</div>
                    <div className="text-sm text-muted-foreground break-all">{g.telegramLink}</div>
                  </div>
                  <div className="text-xs text-muted-foreground">#{g.id.slice(0, 6)}</div>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}



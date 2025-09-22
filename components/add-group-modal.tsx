"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

interface AddGroupModalProps {
  isOpen: boolean
  onClose: () => void
  onAdd: (name: string, telegramLink: string) => void
}

export function AddGroupModal({ isOpen, onClose, onAdd }: AddGroupModalProps) {
  const [name, setName] = useState("")
  const [telegramLink, setTelegramLink] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!name.trim() || !telegramLink.trim()) {
      return
    }

    // Validate Telegram link format
    if (!telegramLink.includes("t.me/")) {
      alert("Telegram havolasi noto'g'ri formatda. Masalan: https://t.me/guruh_nomi")
      return
    }

    setIsSubmitting(true)

    try {
      onAdd(name.trim(), telegramLink.trim())
      setName("")
      setTelegramLink("")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleClose = () => {
    setName("")
    setTelegramLink("")
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-foreground">Yangi guruh qo'shish</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-foreground">
              Guruh nomi
            </Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Masalan: AI Uzbekistan"
              required
              className="w-full"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="telegramLink" className="text-foreground">
              Telegram havolasi
            </Label>
            <Input
              id="telegramLink"
              value={telegramLink}
              onChange={(e) => setTelegramLink(e.target.value)}
              placeholder="https://t.me/guruh_nomi"
              required
              className="w-full"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              className="flex-1 bg-transparent"
              disabled={isSubmitting}
            >
              Bekor qilish
            </Button>
            <Button type="submit" className="flex-1" disabled={isSubmitting || !name.trim() || !telegramLink.trim()}>
              {isSubmitting ? "Qo'shilmoqda..." : "Qo'shish"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

"use client"

import * as React from "react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { useUser } from "@/hooks/use-user"

const AccountPage = () => {
  const { name, email, image, initials } = useUser()

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <Avatar className="size-12">
            <AvatarImage src={image} alt={name} />
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
          <div>
            <p className="text-sm font-medium">{name}</p>
            <p className="text-xs text-muted-foreground">Member</p>
          </div>
        </div>
        <Button variant="outline" size="sm">
          Upload Avatar
        </Button>
      </div>

      <Separator />

      <div className="grid gap-4">
        <h3 className="text-xs font-medium text-muted-foreground">General</h3>

        <div className="grid gap-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            defaultValue={email}
            disabled
          />
          <p className="text-xs text-muted-foreground">
            Please{" "}
            <a href="#" className="text-primary underline underline-offset-2">
              contact the administrator
            </a>{" "}
            to change your email.
          </p>
        </div>

        <div className="grid gap-2">
          <Label htmlFor="full-name">Full Name</Label>
          <Input id="full-name" defaultValue={name} />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="phone">Phone Number</Label>
          <Input
            id="phone"
            type="tel"
            placeholder="+1 234 567 8900"
          />
        </div>
      </div>

      <Separator />

      <div className="grid gap-4">
        <h3 className="text-xs font-medium text-muted-foreground">
          Agent Details
        </h3>

        <div className="grid gap-2">
          <Label htmlFor="role">Role</Label>
          <Input id="role" defaultValue="Member" disabled />
        </div>
      </div>

      <div className="flex flex-col-reverse gap-2 pt-2 sm:flex-row sm:justify-end">
        <Button variant="outline" size="sm">
          Cancel
        </Button>
        <Button size="sm">Save changes</Button>
      </div>
    </div>
  )
}

export { AccountPage }

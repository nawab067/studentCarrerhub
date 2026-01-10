'use client'

import * as React from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldDescription,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Loader2 } from "lucide-react"

interface LoginFormProps {
  email?: string
  password?: string
  onLogin?: (credentials: { email: string; password: string }) => void
  onSignUp?: () => void
  isLoading?: boolean
  isButtonDisabled?: boolean
  onChangeEmail: (e: React.ChangeEvent<HTMLInputElement>) => void
  onChangePassword: (e: React.ChangeEvent<HTMLInputElement>) => void
  className?: string
}

export function LoginForm({
  className,
  email = "",
  password = "",
  onLogin,
  onSignUp,
  isLoading = false,
  isButtonDisabled = false,
  onChangeEmail,
  onChangePassword,
}: LoginFormProps) {
  return (
    <div
      className={cn(
        "flex min-h-screen items-center justify-center bg-sky-50 px-4 dark:bg-slate-950",
        className
      )}
    >
      <Card className="w-full max-w-md border-sky-100 shadow-xl dark:border-sky-900">
        <CardHeader className="space-y-2 text-center">
          <CardTitle className="text-2xl font-semibold text-sky-700 dark:text-sky-400">
            Welcome back
          </CardTitle>
          <CardDescription>
            Sign in to continue to your account
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form
            onSubmit={(e) => {
              e.preventDefault()
              onLogin?.({ email, password })
            }}
            className="space-y-6"
          >
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  required
                  value={email}
                  onChange={onChangeEmail}
                  className="focus-visible:ring-sky-500"
                />
              </Field>

              <Field>
                <div className="flex items-center justify-between">
                  <FieldLabel htmlFor="password">Password</FieldLabel>
                  <button
                    type="button"
                    className="text-sm text-sky-600 hover:underline"
                  >
                    Forgot password?
                  </button>
                </div>
                <Input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={onChangePassword}
                  className="focus-visible:ring-sky-500"
                />
              </Field>
            </FieldGroup>

            <Button
              type="submit"
              disabled={isButtonDisabled || isLoading}
              className="w-full bg-sky-600 hover:bg-sky-700 text-white shadow-md"
            >
              {isLoading && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Sign in
            </Button>

            <FieldDescription className="text-center">
              Don’t have an account?{" "}
              <button
                type="button"
                onClick={onSignUp}
                className="font-medium text-sky-600 hover:underline"
              >
                Sign up
              </button>
            </FieldDescription>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

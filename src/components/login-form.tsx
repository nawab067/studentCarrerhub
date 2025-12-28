'use client'
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
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
interface LoginFormProps {
  email?: string
  password?: string
  onLogin?: (credentials: { email: string; password: string }) => void
  onSignUp?: () => void,
  isLaoding?: boolean
  isButtonDisabled?: boolean,
  onChangeEmail: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onChangePassword: (e: React.ChangeEvent<HTMLInputElement>) => void;
}
export function LoginForm({
  className,
  email = "",
  password = "",
  onLogin,
  onSignUp,
  isLaoding = false,
  isButtonDisabled = false,
  onChangeEmail,
  onChangePassword,
  ...props
}: LoginFormProps & React.ComponentProps<"div">) {
  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle>Login to your account</CardTitle>
          <CardDescription>
            Enter your email below to login to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={(e) => {
            e.preventDefault();
            onLogin?.({ email, password });
          }}>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                  value={email ?? ""}
                  onChange={onChangeEmail}
                />
              </Field>
              <Field>
                <div className="flex items-center">
                  <FieldLabel htmlFor="password">Password</FieldLabel>
                  <a
                    href="#"
                    className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                  >
                    Forgot your password?
                  </a>
                </div>
                <Input 
                id="password" 
                type="password"
                required
                value={password ?? ""}
                onChange={onChangePassword}
                />
              </Field>
              <Field>
                <Button type="submit">Login</Button>
                
                <FieldDescription className="text-center">
                  Don&apos;t have an account?{" "}
                  <a href="#" onClick={(e) => { e.preventDefault(); onSignUp?.(); }}>
                    Sign up
                  </a>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

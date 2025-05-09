import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { signupSchema } from "@/schemas/auth.schema";
import { z } from "zod";
import { PasswordInput } from "@/components/ui/PasswordInput";

export function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    try {
      signupSchema.parse({ email, password, confirmPassword });
      await signup(email, password);
      navigate("/");
    } catch (err) {
      if (err instanceof z.ZodError) {
        const newErrors: Record<string, string> = {};
        err.errors.forEach((error) => {
          if (error.path[0]) {
            newErrors[error.path[0].toString()] = error.message;
          }
        });
        setErrors(newErrors);
      } else {
        setErrors({ form: "Falha ao criar conta" });
      }
    }
  };

  return (
    <div className="h-screen relative flex items-center justify-center w-screen flex-col p-4">
      <Button
        onClick={() => navigate("/")}
        variant="outline"
        className="absolute top-4 left-4 mb-6 text-white"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Voltar para os eventos
      </Button>
      <img
        src="/images/logo_header.png"
        alt="logo"
        className="w-1/3 md:w-1/6 mx-auto mb-8 "
      />
      <Card className="w-full max-w-md mx-auto ">
        <CardHeader>
          <CardTitle className="text-2xl text-center text-slate-100">Criar conta</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSignup} className="space-y-4">
            {errors.form && (
              <p className="text-red-500 text-sm text-center">{errors.form}</p>
            )}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-slate-100">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="exemplo@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={errors.email ? "border-red-500 text-slate-100" : "text-slate-100"}
                required
              />
              {errors.email && (
                <p className="text-red-500 text-sm">{errors.email}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-slate-100">Senha</Label>
              <PasswordInput
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={errors.password ? "border-red-500 text-slate-100" : "text-slate-100"}
                required
              />
              {errors.password && (
                <p className="text-red-500 text-sm">{errors.password}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-slate-100">Confirmar senha</Label>
              <PasswordInput
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className={errors.confirmPassword ? "border-red-500 text-slate-100" : "text-slate-100"}
                required
              />
              {errors.confirmPassword && (
                <p className="text-red-500 text-sm">{errors.confirmPassword}</p>
              )}
            </div>
            <div className="space-y-4">
              <Button type="submit" variant="outline" className="w-full bg-slate-100 text-slate-900">
                Criar conta
              </Button>
              <Button
                type="button"
                variant="outline"
                className="w-full bg-slate-200 text-slate-900"
                onClick={() => navigate("/login")}
              >
                Já tenho uma conta
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { motion } from "motion/react";
import { useState } from "react";
import { Flame, Loader2, ArrowLeft } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";
import { toast } from "sonner";

export const Route = createFileRoute("/auth")({
  component: AuthPage,
  head: () => ({
    meta: [
      { title: "Sign in · DFC Dadu Food Corner" },
      { name: "description", content: "Sign in or create your DFC account to track orders and reorder favourites." },
      { name: "robots", content: "noindex" },
    ],
  }),
});

function AuthPage() {
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/`,
            data: { full_name: name, phone },
          },
        });
        if (error) throw error;
        toast.success("Account created! Check your email to confirm.");
        setMode("login");
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        toast.success("Welcome back!");
        navigate({ to: "/" });
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Something went wrong";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const googleSignIn = async () => {
    setLoading(true);
    const result = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: window.location.origin,
    });
    if (result.error) {
      toast.error("Google sign-in failed");
      setLoading(false);
      return;
    }
    if (result.redirected) return;
    navigate({ to: "/" });
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-background text-foreground">
      <div className="bg-radial-amber absolute inset-0 opacity-60" />
      <Link
        to="/"
        className="absolute left-5 top-5 z-10 inline-flex items-center gap-1.5 rounded-full border border-border bg-background/60 px-3 py-1.5 text-xs font-semibold text-muted-foreground backdrop-blur hover:text-foreground"
      >
        <ArrowLeft className="h-3.5 w-3.5" /> Back
      </Link>

      <div className="relative mx-auto flex min-h-screen max-w-md flex-col items-center justify-center px-5 py-12">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="grid h-14 w-14 place-items-center rounded-2xl bg-amber-brand text-primary-foreground glow-amber"
        >
          <Flame className="h-7 w-7" strokeWidth={2.5} />
        </motion.div>
        <h1 className="mt-5 text-3xl font-black tracking-tight">DFC Taste Hub</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {mode === "login" ? "Welcome back, hungry friend" : "Create your account in 10 seconds"}
        </p>

        <motion.form
          key={mode}
          initial={{ y: 12, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          onSubmit={submit}
          className="mt-8 w-full space-y-3 rounded-3xl border border-border bg-card/60 p-6 backdrop-blur"
        >
          {mode === "signup" && (
            <>
              <Field label="Full name" value={name} onChange={setName} required />
              <Field label="Mobile number" value={phone} onChange={setPhone} type="tel" />
            </>
          )}
          <Field label="Email" value={email} onChange={setEmail} type="email" required />
          <Field label="Password" value={password} onChange={setPassword} type="password" required />

          <motion.button
            whileTap={{ scale: 0.97 }}
            disabled={loading}
            type="submit"
            className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-full bg-amber-brand px-5 py-3 text-sm font-bold text-primary-foreground glow-amber disabled:opacity-60"
          >
            {loading && <Loader2 className="h-4 w-4 animate-spin" />}
            {mode === "login" ? "Sign in" : "Create account"}
          </motion.button>

          <div className="relative my-3 flex items-center">
            <div className="flex-1 border-t border-border" />
            <span className="px-3 text-[10px] uppercase tracking-widest text-muted-foreground">or</span>
            <div className="flex-1 border-t border-border" />
          </div>

          <button
            type="button"
            onClick={googleSignIn}
            disabled={loading}
            className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-border bg-surface px-5 py-3 text-sm font-semibold hover:border-amber-brand/60 disabled:opacity-60"
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.83z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84C6.71 7.31 9.14 5.38 12 5.38z"/>
            </svg>
            Continue with Google
          </button>

          <p className="pt-2 text-center text-xs text-muted-foreground">
            {mode === "login" ? "New to DFC?" : "Already have an account?"}{" "}
            <button
              type="button"
              onClick={() => setMode(mode === "login" ? "signup" : "login")}
              className="font-semibold text-amber-brand hover:underline"
            >
              {mode === "login" ? "Create account" : "Sign in"}
            </button>
          </p>
        </motion.form>
      </div>
    </div>
  );
}

function Field({
  label, value, onChange, type = "text", required,
}: {
  label: string; value: string; onChange: (v: string) => void; type?: string; required?: boolean;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
        {label}
      </span>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        type={type}
        className="w-full rounded-xl border border-border bg-surface/60 px-3.5 py-2.5 text-sm outline-none transition focus:border-amber-brand focus:ring-2 focus:ring-amber-brand/30"
      />
    </label>
  );
}

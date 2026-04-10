import { useState, type FormEvent } from "react";
import { Apple, LogIn, Mail } from "lucide-react";

interface SignUpModalProps {
  open: boolean;
  onGoogle: () => Promise<void>;
  onApple: () => Promise<void>;
  onEmailSignUp: (email: string, password: string) => Promise<void>;
  onEmailSignIn: (email: string, password: string) => Promise<void>;
  error?: string | null;
  loading?: boolean;
}

type AuthMode = "start" | "signup" | "signin";

export default function SignUpModal({
  open,
  onGoogle,
  onApple,
  onEmailSignUp,
  onEmailSignIn,
  error,
  loading = false,
}: SignUpModalProps) {
  const [mode, setMode] = useState<AuthMode>("start");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  if (!open) return null;

  const handleEmailSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (mode === "signup") {
      await onEmailSignUp(email.trim(), password);
    } else {
      await onEmailSignIn(email.trim(), password);
    }
  };

  const renderHeader = () => {
    if (mode === "signup") return "Create your account";
    if (mode === "signin") return "Sign in to your account";
    return "Get started";
  };

  const renderDescription = () => {
    if (mode === "signup") return "Use your email address to create a secure account.";
    if (mode === "signin") return "Sign in with your email and password.";
    return "Choose one of the authentication methods below to continue.";
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-md rounded-[2rem] border border-border bg-card p-6 shadow-2xl">
        <div className="flex flex-col gap-2 text-center">
          <h2 className="text-2xl font-semibold text-foreground">{renderHeader()}</h2>
          <p className="text-sm text-muted-foreground">{renderDescription()}</p>
        </div>

        {mode === "start" ? (
          <div className="mt-6 space-y-3">
            <button
              type="button"
              onClick={onGoogle}
              disabled={loading}
              className="inline-flex items-center justify-center w-full gap-2 rounded-2xl border border-border bg-background px-4 py-3 text-sm font-medium text-foreground transition hover:bg-secondary"
            >
              <LogIn className="w-5 h-5" />
              Continue with Google
            </button>
            <button
              type="button"
              onClick={onApple}
              disabled={loading}
              className="inline-flex items-center justify-center w-full gap-2 rounded-2xl border border-border bg-background px-4 py-3 text-sm font-medium text-foreground transition hover:bg-secondary"
            >
              <Apple className="w-5 h-5" />
              Continue with Apple
            </button>
            <button
              type="button"
              onClick={() => setMode("signup")}
              className="inline-flex items-center justify-center w-full gap-2 rounded-2xl bg-wa-teal px-4 py-3 text-sm font-semibold text-white transition hover:bg-wa-teal-dark"
            >
              <Mail className="w-5 h-5" />
              Continue with Email
            </button>

            <div className="border-t border-border/70 pt-4 text-center text-sm text-muted-foreground">
              Already have an account?{' '}
              <button type="button" onClick={() => setMode("signin")} className="font-semibold text-foreground hover:text-primary">
                Sign in
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleEmailSubmit} className="mt-6 space-y-4">
            <div className="space-y-1 text-left">
              <label className="text-sm font-medium text-foreground" htmlFor="auth-email">
                Email address
              </label>
              <input
                id="auth-email"
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                className="w-full rounded-2xl border border-border bg-background px-4 py-3 text-sm text-foreground outline-none transition focus:border-primary"
              />
            </div>
            <div className="space-y-1 text-left">
              <label className="text-sm font-medium text-foreground" htmlFor="auth-password">
                Password
              </label>
              <input
                id="auth-password"
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                minLength={6}
                className="w-full rounded-2xl border border-border bg-background px-4 py-3 text-sm text-foreground outline-none transition focus:border-primary"
              />
            </div>
            {error ? <p className="text-sm text-destructive">{error}</p> : null}
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center justify-center w-full rounded-2xl bg-wa-teal px-4 py-3 text-sm font-semibold text-white transition hover:bg-wa-teal-dark disabled:cursor-not-allowed disabled:opacity-70"
            >
              {mode === "signup" ? "Create account" : "Sign in"}
            </button>
            <div className="flex items-center justify-between gap-2 text-sm text-muted-foreground">
              <button
                type="button"
                onClick={() => setMode(mode === "signup" ? "signin" : "signup")}
                className="text-foreground font-medium hover:text-primary"
              >
                {mode === "signup" ? "Already have an account? Sign in" : "Need an account? Sign up"}
              </button>
              <button
                type="button"
                onClick={() => setMode("start")}
                className="text-sm font-medium text-muted-foreground hover:text-foreground"
              >
                Back
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

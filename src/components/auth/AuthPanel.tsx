"use client";

import { useState } from "react";
import type { FormEvent } from "react";
import { GameButton } from "@/components/landing/GameButton";
import { useAuth } from "@/components/auth/AuthProvider";
import { isApiError } from "@/lib/apiClient";

type Mode = "login" | "register";

export const AuthPanel = () => {
  const { user, loading, login, register, logout } = useAuth();
  const [mode, setMode] = useState<Mode>("login");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [formState, setFormState] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: ""
  });

  const handleChange = (field: keyof typeof formState, value: string) => {
    setFormState((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      if (mode === "register") {
        await register({
          firstName: formState.firstName,
          lastName: formState.lastName,
          email: formState.email,
          password: formState.password
        });
      } else {
        await login({ email: formState.email, password: formState.password });
      }
      setFormState({ firstName: "", lastName: "", email: "", password: "" });
    } catch (err) {
      if (isApiError(err)) {
        setError(err.message);
      } else {
        setError("Bir hata oluştu.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  const inputStyle =
    "mt-1 w-full rounded-[16px] border border-white/30 bg-white/15 px-3 py-2 text-sm text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-amber-300";
  const toggleStyle =
    "rounded-full px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.3em] transition";

  if (loading) {
    return (
      <div className="space-y-2 text-sm text-white/80">
        <p className="text-xs uppercase tracking-[0.4em] text-white/50">Player Status</p>
        <p>Kullanıcı durumu yükleniyor...</p>
      </div>
    );
  }

  if (user) {
    return (
      <div className="space-y-3 text-left text-white">
        <div className="flex items-center justify-between">
          <span className="text-[11px] uppercase tracking-[0.4em] text-white/60">Live</span>
          <span className="rounded-full border border-amber-200/70 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.35em] text-amber-200">
            Ready
          </span>
        </div>
        <div className="space-y-1">
          <p className="text-lg font-semibold">Merhaba {user.firstName}!</p>
          <p className="text-xs uppercase tracking-[0.35em] text-white/60">{user.email}</p>
        </div>
        <GameButton variant="secondary" size="sm" className="w-full" onClick={() => void logout()}>
          Çıkış Yap
        </GameButton>
      </div>
    );
  }

  return (
    <form className="space-y-3 text-left text-white" onSubmit={handleSubmit}>
      <div className="flex items-center justify-between text-xs uppercase tracking-[0.25em] text-white/60">
        <span>Account</span>
        <div className="flex gap-2">
          <button
            type="button"
            className={`${toggleStyle} ${
              mode === "login" ? "bg-rose-500 text-white" : "bg-white/20 text-rose-300"
            }`}
            onClick={() => setMode("login")}
          >
            Giriş Yap
          </button>
          <button
            type="button"
            className={`${toggleStyle} ${
              mode === "register" ? "bg-rose-500 text-white" : "bg-white/20 text-rose-300"
            }`}
            onClick={() => setMode("register")}
          >
            Üye Ol
          </button>
        </div>
      </div>
      {mode === "register" ? (
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="text-xs text-white/60">
            Ad
            <input
              className={inputStyle}
              placeholder="Ali"
              value={formState.firstName}
              onChange={(event) => handleChange("firstName", event.target.value)}
              required
            />
          </label>
          <label className="text-xs text-white/60">
            Soyad
            <input
              className={inputStyle}
              placeholder="Kaya"
              value={formState.lastName}
              onChange={(event) => handleChange("lastName", event.target.value)}
              required
            />
          </label>
        </div>
      ) : null}
      <label className="text-xs text-white/60">
        Email
        <input
          type="email"
          className={inputStyle}
          placeholder="you@email.com"
          value={formState.email}
          onChange={(event) => handleChange("email", event.target.value)}
          required
        />
      </label>
      <label className="text-xs text-white/60">
        Şifre
        <input
          type="password"
          minLength={8}
          className={inputStyle}
          placeholder="••••••••"
          value={formState.password}
          onChange={(event) => handleChange("password", event.target.value)}
          required
        />
      </label>
      {error ? <p className="text-xs text-rose-400">{error}</p> : null}
      <GameButton className="w-full" type="submit" disabled={submitting}>
        {submitting ? "Bekleyin..." : mode === "login" ? "Giriş Yap" : "Üye Ol"}
      </GameButton>
      <p className="text-[11px] text-white/60">Şifre minimum 8 karakter olmalı.</p>
    </form>
  );
};

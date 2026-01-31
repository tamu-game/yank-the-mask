"use client";

import { useState } from "react";
import type { FormEvent } from "react";
import { Button } from "@/components/Button";
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

  if (loading) {
    return (
      <div className="rounded-3xl border-2 border-white/80 bg-white/80 p-6 text-sm text-slate-600 shadow-xl">
        Kullanıcı durumu yükleniyor...
      </div>
    );
  }

  if (user) {
    return (
      <div className="rounded-3xl border-2 border-white/80 bg-white/80 p-6 text-left shadow-xl">
        <div className="text-xs uppercase tracking-[0.3em] text-rose-400">Hesap</div>
        <div className="mt-2 text-lg font-semibold text-slate-700">
          Merhaba {user.firstName}!
        </div>
        <p className="mt-1 text-sm text-slate-600">{user.email}</p>
        <Button className="mt-4 w-full" variant="secondary" onClick={() => void logout()}>
          Çıkış Yap
        </Button>
      </div>
    );
  }

  return (
    <div className="rounded-3xl border-2 border-white/80 bg-white/80 p-6 text-left shadow-xl">
      <div className="flex items-center justify-between text-xs uppercase tracking-[0.3em] text-rose-400">
        <span>Hesap</span>
        <div className="flex gap-2">
          <button
            type="button"
            className={`rounded-full px-3 py-1 text-[10px] font-semibold tracking-[0.2em] transition ${
              mode === "login"
                ? "bg-rose-500 text-white"
                : "bg-white/70 text-rose-500"
            }`}
            onClick={() => setMode("login")}
          >
            Giriş Yap
          </button>
          <button
            type="button"
            className={`rounded-full px-3 py-1 text-[10px] font-semibold tracking-[0.2em] transition ${
              mode === "register"
                ? "bg-rose-500 text-white"
                : "bg-white/70 text-rose-500"
            }`}
            onClick={() => setMode("register")}
          >
            Üye Ol
          </button>
        </div>
      </div>
      <form className="mt-4 space-y-3" onSubmit={handleSubmit}>
        {mode === "register" ? (
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="text-xs text-slate-500">
              Ad
              <input
                className="mt-1 w-full rounded-xl border border-rose-100 bg-white/70 px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-rose-200"
                value={formState.firstName}
                onChange={(event) => handleChange("firstName", event.target.value)}
                required
              />
            </label>
            <label className="text-xs text-slate-500">
              Soyad
              <input
                className="mt-1 w-full rounded-xl border border-rose-100 bg-white/70 px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-rose-200"
                value={formState.lastName}
                onChange={(event) => handleChange("lastName", event.target.value)}
                required
              />
            </label>
          </div>
        ) : null}
        <label className="text-xs text-slate-500">
          Email
          <input
            type="email"
            className="mt-1 w-full rounded-xl border border-rose-100 bg-white/70 px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-rose-200"
            value={formState.email}
            onChange={(event) => handleChange("email", event.target.value)}
            required
          />
        </label>
        <label className="text-xs text-slate-500">
          Şifre
          <input
            type="password"
            minLength={8}
            className="mt-1 w-full rounded-xl border border-rose-100 bg-white/70 px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-rose-200"
            value={formState.password}
            onChange={(event) => handleChange("password", event.target.value)}
            required
          />
        </label>
        {error ? <p className="text-xs text-rose-500">{error}</p> : null}
        <Button className="w-full" disabled={submitting}>
          {submitting ? "Bekleyin..." : mode === "login" ? "Giriş Yap" : "Üye Ol"}
        </Button>
        <p className="text-[11px] text-slate-500">
          Şifre minimum 8 karakter olmalı.
        </p>
      </form>
    </div>
  );
};

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const router = useRouter(); // hook do nawigacji

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // sprawdzenie wypełnienia pól
    if (!email || !password || !confirmPassword) {
      alert("Wypełnij wszystkie pola!");
      return;
    }

    // sprawdzenie zgodności haseł
    if (password !== confirmPassword) {
      alert("Hasła muszą być takie same!");
      return;
    }

    console.log("Rejestracja:", { email, password });

    // na razie symulacja → przekierowanie do logowania
    router.push("/login");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F1EFF8] p-6">
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg border border-gray-200 p-8 flex flex-col gap-6">
        <h1 className="text-2xl font-bold text-[#6D5BD0] text-center">
          Rejestracja
        </h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <label className="flex flex-col text-sm text-gray-600">
            Email
            <input
              type="email"
              placeholder="Twój email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#6D5BD0]"
              required
            />
          </label>

          <label className="flex flex-col text-sm text-gray-600">
            Hasło
            <input
              type="password"
              placeholder="Twoje hasło"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#6D5BD0]"
              required
            />
          </label>

          <label className="flex flex-col text-sm text-gray-600">
            Powtórz hasło
            <input
              type="password"
              placeholder="Powtórz hasło"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="mt-1 p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#6D5BD0]"
              required
            />
          </label>

          <button
            type="submit"
            className="mt-4 bg-[#6D5BD0] text-white font-semibold py-2 rounded hover:bg-[#5a4bbf] transition-colors"
          >
            Zarejestruj się
          </button>
        </form>

        <div className="text-center text-sm text-gray-500">
          Masz już konto?{" "}
          <a href="/login" className="text-[#6D5BD0] font-medium hover:underline">
            Zaloguj się
          </a>
        </div>
      </div>
    </div>
  );
}

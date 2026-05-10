"use client"

import { useState } from "react"
import { signIn } from "next-auth/react"

export default function SignInModal({ onClose }: { onClose: () => void }) {
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleEmailSignIn = async () => {
    if (!email) return
    setLoading(true)
    setError(null)

    const res = await signIn("email", {
      email,
      callbackUrl: "/",
      redirect: false,
    })

    if (res?.error) {
      setError("Something went wrong. Please try again.")
      setLoading(false)
    }
  }

  const handleGoogleSignIn = async () => {
    setLoading(true)
    setError(null)

    await signIn("google", { callbackUrl: "/" })
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center">
      <div className="bg-white rounded-2xl p-8 w-[90%] max-w-sm text-center shadow-xl">
        <h2 className="text-2xl font-semibold text-black mb-6">
          Sign in to theCarryClub
        </h2>

        {/* GOOGLE LOGIN */}
        <button
          onClick={handleGoogleSignIn}
          disabled={loading}
          className="w-full flex items-center justify-center gap-3
                     border border-gray-300 bg-white
                     text-black font-medium
                     py-3 rounded-lg
                     hover:bg-gray-50 transition
                     disabled:opacity-50"
        >
          <img src="/google-icon.png" alt="Google" className="w-5 h-5" />
          Continue with Google
        </button>

        <div className="my-5 flex items-center gap-3">
          <span className="flex-1 h-px bg-gray-200" />
          <span className="text-sm text-gray-400">or</span>
          <span className="flex-1 h-px bg-gray-200" />
        </div>

        {/* EMAIL LOGIN */}
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-4 py-3
                     border border-gray-300
                     rounded-lg
                     text-black placeholder-gray-500
                     focus:outline-none focus:ring-2 focus:ring-black/10"
        />

        {/* EMAIL LOGIN */}
        <button
          onClick={handleEmailSignIn}
          disabled={loading}
          className="mt-4 w-full
                     bg-black text-white font-medium
                     py-3 rounded-lg
                     hover:opacity-90 transition
                     disabled:opacity-50"
        >
          {loading ? "Sending link..." : "Continue with Email"}
        </button>

        {error && (
          <p className="mt-3 text-sm text-red-500">
            {error}
          </p>
        )}

        <p className="mt-3 text-sm text-gray-600">
          We’ll send you a secure login link.
        </p>

        <button
          onClick={onClose}
          className="mt-5 text-sm text-gray-500 hover:text-black transition"
        >
          Cancel
        </button>
      </div>
    </div>
  )
}

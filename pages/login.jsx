import { signIn } from "next-auth/react"

export default function Login() {
    return <div className="w-full h-screen flex items-center justify-center">
        <button className="bg-green-500 rounded-full px-8 py-4" onClick={() => signIn("spotify", { callbackUrl: "/" })}>Login with Spotify</button>
    </div>
}


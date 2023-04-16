import NextAuth from "next-auth"
import SpotifyProvider from "next-auth/providers/spotify"
import fetch from "node-fetch"

const scopes = [
    'user-read-email',
    'playlist-read-private',
    'playlist-read-collaborative',
    'user-modify-playback-state',
    'user-read-currently-playing'
].join(",")

const params = {
    scope: scopes
}

const query = new URLSearchParams(params)
const LOGIN_URL = 'https://accounts.spotify.com/authorize?' + query.toString()

async function refreshAccessToken(token) {
    try {
        const params = new URLSearchParams()
        params.append("grant_type", "refresh_token")
        params.append("refresh_token", token.refreshToken)
        const response = await fetch("https://accounts.spotify.com/api/token", {
            method: "POST",
            headers: {
                Authorization: 'Basic ' + (new Buffer.from(process.env.SPOTIFY_CLIENT_ID + ':' + process.env.SPOTIFY_SECRET).toString('base64'))
            },
            body: params
        })
        console.log({ response })
        const refreshedToken = await response.json()
        return {
            ...token,
            accessToken: refreshedToken.access_token,
            refreshToken: refreshedToken.refresh_token ?? token.refreshToken,
            accessTokenExpires: Date.now() + refreshedToken.expires_in * 1000,
        }
    } catch (error) {
        console.error(error)
        return {
            ...token,
            error: "refresh token error"
        }
    }
}

export const authOptions = {
    // Configure one or more authentication providers
    providers: [
        SpotifyProvider({
            clientId: process.env.SPOTIFY_CLIENT_ID,
            clientSecret: process.env.SPOTIFY_SECRET,
            authorization: LOGIN_URL
        }),
        // ...add more providers here
    ],
    secret: process.env.JWT_SECRET,
    pages: {
        signIn: "/login"
    },
    callbacks: {
        /* saves the return value ater encrypting into browser */
        async jwt({ token, account, user }) {
            if (user && account) { // this means initial sign in
                console.log("sign in", account)
                return {
                    ...token,
                    accessToken: account.access_token,
                    refreshToken: account.refresh_token,
                    username: account.providerAccountId,
                    accessTokenExpires: account.expires_at * 1000
                }
            }
            // if the user if already logged in
            if (token.accessToken != undefined && Date.now() < token.accessTokenExpires) {
                return token
            }
            console.log("refreshing token")
            return refreshAccessToken(token)
        },
        async session({ session, token }) {
            console.log('sesion cb', token)
            session.user.accessToken = token.accessToken
            session.user.refreshToken = token.refreshToken
            session.user.username = token.username
            return session
        }
    }
}

export default NextAuth(authOptions)
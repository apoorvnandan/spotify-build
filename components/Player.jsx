import { PauseCircleIcon, PlayCircleIcon, } from "@heroicons/react/24/solid";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

export default function Player({ globalIsPlaying, setGlobalIsPlaying, globalCurrentTrackId }) {
    const { data: session } = useSession()
    const [songData, setSongData] = useState(null)

    async function getCurrentlyPlaying() {
        try {
            const response = await fetch("https://api.spotify.com/v1/me/player/currently-playing", {
                headers: {
                    Authorization: `Bearer ${session.user.accessToken}`
                }
            })
            const data = await response.json()
            return data;
        } catch (error) {
            return {
                error: "error gettig currently playing from spotify api"
            }
        }


    }

    async function handlePlayPause() {
        const currentlyPlaying = await getCurrentlyPlaying()
        if ('error' in currentlyPlaying) {
            return
        }
        if (currentlyPlaying.is_playing) {
            const response = await fetch("https://api.spotify.com/v1/me/player/pause", {
                method: "PUT",
                headers: {
                    Authorization: `Bearer ${session.user.accessToken}`
                }
            })
            if (response.status == 204) {
                setGlobalIsPlaying(false)
            }
        } else {
            const response = await fetch("https://api.spotify.com/v1/me/player/play", {
                method: "PUT",
                headers: {
                    Authorization: `Bearer ${session.user.accessToken}`
                }
            })
            if (response.status == 204) {
                setGlobalIsPlaying(true)
            }
        }
    }

    useEffect(() => {
        async function f() {
            if (globalCurrentTrackId != "") {
                const response = await fetch(`https://api.spotify.com/v1/tracks/${globalCurrentTrackId}`, {
                    headers: {
                        Authorization: `Bearer ${session.user.accessToken}`
                    }
                })
                const data = await response.json()
                console.log(data)
                setSongData(data)
            }
        }
        f()
    }, [session, globalCurrentTrackId])

    return <div className="w-full h-24 bg-neutral-800 border-t border-neutral-700 text-white grid grid-cols-3 text-xs md:text-base px-2 md:px-8">
        <div className="flex items-center space-x-4">
            {songData?.album?.images[0]?.url && <img className="h-10 w-10" src={songData?.album?.images[0]?.url} />}
            <div>
                <p>{songData?.name}</p>
                <p className="text-sm text-neutral-400">{songData?.artists[0]?.name}</p>
            </div>
        </div>
        <div className="flex items-center justify-evenly">
            {globalIsPlaying ? <PauseCircleIcon onClick={handlePlayPause} className="cursor-pointer hover:scale-125 transition transform-duration-100 ease-out h-10 w-10" /> : <PlayCircleIcon onClick={handlePlayPause} className="cursor-pointer hover:scale-125 transition transform-duration-100 ease-out h-10 w-10" />}
        </div>
        <div></div>
    </div>
}
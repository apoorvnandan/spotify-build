import { ChevronDownIcon } from "@heroicons/react/24/outline"
import { signOut, useSession } from "next-auth/react"
import { useEffect, useState } from "react"
import Song from "./Song"

const colors = [
    'from-indigo-500',
    'from-blue-500',
    'from-green-500',
    'from-red-500',
    'from-yellow-500',
    'from-pink-500',
    'from-purple-500'
]

export default function Center({ globalSelectedPlaylist, setGlobalCurrentTrackId, setGlobalIsPlaying }) {
    const { data: session } = useSession()
    const [color, setColor] = useState(colors[0])
    const [opacity, setOpacity] = useState(0)
    const [textOpacity, setTextOpacity] = useState(0)
    const [playlistState, setPlaylistState] = useState(null)
    // fetch playlist details and put into state

    function changeOpacity(scrollPos) {
        // scrollPos = 0 -> opacity = 0 textOpacity = 0
        // scrollPos = 300 -> opacity = 1 textOpacity = 0
        // scrollPos = 310 -> opacity = 1 textOpacity = 1
        const offset = 300
        const textBuffer = 10
        const newOpacity = 1 - (offset - scrollPos) / offset
        setOpacity(newOpacity)
        let delta = 0
        if (scrollPos < offset) delta = 0
        else delta = scrollPos - offset
        const newTextOpacity = 1 - (textBuffer - delta) / textBuffer
        setTextOpacity(newTextOpacity)
    }

    useEffect(() => {
        async function f() {
            if (session && session.user && session.user.accessToken && globalSelectedPlaylist != '') {
                const response = await fetch(`https://api.spotify.com/v1/playlists/${globalSelectedPlaylist}`, {
                    headers: {
                        Authorization: `Bearer ${session.user.accessToken}`
                    }
                })
                const data = await response.json()
                setPlaylistState(data)
            }
        }
        f()
    }, [globalSelectedPlaylist, session])

    return <div className="flex-grow">
        <header
            className="text-white sticky top-0 h-20 z-10 text-4xl bg-neutral-800 p-8 flex items-center font-bold"
            style={{ opacity: opacity }}
        >
            <div style={{ opacity: textOpacity }} className="flex gap-4 items-center">
                <img className="h-8 w-8" src={playlistState?.images[0].url} />
                <div>{playlistState?.name}</div>
            </div>
        </header>
        <div onClick={() => signOut()} className="absolute z-20 top-5 right-8 flex items-center bg-black bg-opacity-70 text-white space-x-3 opacity-90 hover:opacity-80 cursor-pointer rounded-full p-1 pr-2">
            <img className="rounded-full w-7 h-7" src={session?.user?.image} alt="profile picture" />
            <h2 className="text-sm">Logout</h2>
            <ChevronDownIcon className="h-5 w-5" />
        </div>
        <div onScroll={(e) => changeOpacity(e.target.scrollTop)} className="relative -top-20 h-screen overflow-y-scroll scrollbar-hide bg-neutral-900">
            <section className={`flex items-end space-x-7 bg-gradient-to-b to-neutral-900 ${color} h-80 text-white p-8`}>
                {playlistState && <img className="h-44 w-44 shadow-2xl" src={playlistState?.images[0]?.url} alt="playlist image" />}
                <div>
                    <p className="text-white text-sm font-bold">Playlist</p>
                    <h1 className="text-2xl font-extrabold md:text-3xl lg:text-5xl">{playlistState?.name}</h1>
                </div>
            </section>
            <div className="flex flex-col text-white space-y-1 px-8 pb-28">
                {playlistState?.tracks.items.map((track, i) => {
                    return <Song
                        key={track.track.id}
                        track={track}
                        sno={i}
                        setGlobalIsPlaying={setGlobalIsPlaying}
                        setGlobalCurrentTrackId={setGlobalCurrentTrackId}
                    />
                })}
            </div>
        </div>
    </div>
}
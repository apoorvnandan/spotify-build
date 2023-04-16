import { ChevronDownIcon, } from "@heroicons/react/24/outline";
import { PlayIcon } from "@heroicons/react/24/solid";
import { signOut, useSession } from "next-auth/react";
import { useEffect, useState } from "react";

const Library = ({ setGlobalSelectedPlaylist, setView }) => {
    const { data: session } = useSession()
    const [playlists, setPlaylists] = useState([])

    function selectPlaylist(playlist) {
        setGlobalSelectedPlaylist(playlist.id)
        window.localStorage.setItem("current_playlist", playlist.id)
        setView("playlist")
    }

    useEffect(() => {
        async function f() {
            if (session && session.user && session.user.accessToken) {
                const response = await fetch("https://api.spotify.com/v1/me/playlists", {
                    headers: {
                        Authorization: `Bearer ${session.user.accessToken}`
                    }
                })
                const data = await response.json()
                setPlaylists(data.items)
            }
        }
        f()
    }, [session])


    return (
        <div className="flex-grow bg-neutral-900">
            <header
                className="text-white sticky top-0 h-20 z-10 text-4xl bg-neutral-900 p-8 flex items-center font-bold"
            >
            </header>
            <div onClick={() => signOut()} className="absolute z-20 top-5 right-8 flex items-center bg-black bg-opacity-70 text-white space-x-3 opacity-90 hover:opacity-80 cursor-pointer rounded-full p-1 pr-2">
                <img className="rounded-full w-7 h-7" src={session?.user?.image} alt="profile picture" />
                <h2 className="text-sm">Logout</h2>
                <ChevronDownIcon className="h-5 w-5" />
            </div>
            <div className="flex flex-col gap-4 px-8 md:px-8 h-screen overflow-y-scroll srollbar-hide">
                <h2 className="text-xl font-bold">Playlists</h2>
                <div className="flex flex-wrap gap-6 mb-48">
                    {playlists.map((playlist) => {
                        return <div onClick={() => selectPlaylist(playlist)} key={playlist.id} className="cursor-pointer relative group w-56 mb-2 bg-neutral-800 hover:bg-neutral-600 rounded-md p-4">
                            <div className="opacity-0 group-hover:opacity-100 transition-all ease-in-out duration-200 absolute z-10 h-12 w-12 flex items-center justify-center rounded-full bg-green-500 top-[156px] group-hover:top-[148px] right-6">
                                <PlayIcon className="h-6 w-6 text-black" />
                            </div>
                            <img className="w-48 h-48 mb-4" src={playlist.images[0].url} />
                            <p className="text-base text-white mb-1 w-32 truncate">{playlist.name}</p>
                            <p className="text-sm text-neutral-400 mb-8 w-32 truncate">By {playlist.owner.display_name}</p>
                        </div>
                    })}
                </div>
            </div>
        </div >
    );
}

export default Library;

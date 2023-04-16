import { ChevronDownIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { signOut, useSession } from 'next-auth/react';
import React, { useEffect, useState } from 'react';
import BrowseAlbums from './BrowseAlbums';
import SearchResults from './SearchResults';

const Search = ({ setView, setGlobalSelectedPlaylist }) => {
    const { data: session } = useSession()
    const [inputValue, setInputValue] = useState("")
    const [searchData, setSearchData] = useState(null)
    const [featuredPlaylists, setFeaturedPlaylists] = useState([])

    async function updateSearchResults(query) {
        if (query == "") return
        const response = await fetch("https://api.spotify.com/v1/search?" + new URLSearchParams({
            q: query,
            type: ["playlist"]
        }), {
            headers: {
                Authorization: `Bearer ${session.user.accessToken}`
            }
        })
        const data = await response.json()
        console.log(data)
        setSearchData(data)
    }

    useEffect(() => {
        async function f() {
            if (session && session.user && session.user.accessToken) {
                const response = await fetch("https://api.spotify.com/v1/browse/featured-playlists", {
                    headers: {
                        Authorization: `Bearer ${session.user.accessToken}`
                    }
                })
                const data = await response.json()
                setFeaturedPlaylists(data.playlists.items)
            }
        }
        f()
    }, [session]);



    return (
        <div className="flex-grow bg-neutral-900">
            <header
                className="relative text-white sticky top-0 h-20 z-10 text-4xl bg-neutral-900 p-8 flex items-center font-bold"
            >
                <MagnifyingGlassIcon className="absolute top-7 left-10 h-6 w-6 text-neutral-800" />
                <input value={inputValue} onChange={async (e) => {
                    setInputValue(e.target.value)
                    await updateSearchResults(e.target.value)
                }} className="rounded-full bg-white w-96 pl-10 text-neutral-900 text-base py-2 font-normal outline-0" />
            </header>
            <div onClick={() => signOut()} className="absolute z-20 top-5 right-8 flex items-center bg-black bg-opacity-70 text-white space-x-3 opacity-90 hover:opacity-80 cursor-pointer rounded-full p-1 pr-2">
                <img className="rounded-full w-7 h-7" src={session?.user?.image} alt="profile picture" />
                <h2 className="text-sm">Logout</h2>
                <ChevronDownIcon className="h-5 w-5" />
            </div>
            <div className=''>
                {searchData === null ? <BrowseAlbums
                    albums={featuredPlaylists}
                    setView={setView}
                    setGlobalSelectedPlaylist={setGlobalSelectedPlaylist}
                /> : <SearchResults
                    playlists={searchData?.playlists?.items}
                    setView={setView}
                    setGlobalSelectedPlaylist={setGlobalSelectedPlaylist}
                />}
            </div>
        </div>
    );
}

export default Search;

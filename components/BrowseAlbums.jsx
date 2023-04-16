import { PlayIcon } from '@heroicons/react/24/solid';
import React from 'react';

const BrowseAlbums = ({ albums, setView, setGlobalSelectedPlaylist }) => {
    function openPlaylist(id) {
        setGlobalSelectedPlaylist(id)
        window.localStorage.setItem("current_playlist", id)
        setView("playlist")
    }
    return (
        <div className="flex flex-col gap-4 px-8 md:px-8 h-screen overflow-y-scroll srollbar-hide">
            <h2 className="text-xl font-bold">Editor&#39;s Picks</h2>
            <div className="flex flex-wrap gap-6 mb-48">
                {albums?.map((album) => {
                    return <div onClick={() => openPlaylist(album.id)} key={album.id} className="cursor-pointer relative group w-56 mb-2 bg-neutral-800 hover:bg-neutral-600 rounded-md p-4">
                        <div className="opacity-0 group-hover:opacity-100 transition ease-in-out duration-200 absolute z-10 h-12 w-12 flex items-center justify-center rounded-full bg-green-500 top-[148px] group-hover:top-[156px] right-6">
                            <PlayIcon className="h-6 w-6 text-black" />
                        </div>
                        <img className="w-48 h-48 mb-4" src={album.images[0].url} />
                        <p className="text-base text-white mb-1 w-32 truncate">{album.name}</p>
                        <p className="text-sm text-neutral-400 mb-8 w-32 truncate">By {album.owner.display_name}</p>
                    </div>
                })}
            </div>
        </div>
    );
}

export default BrowseAlbums;

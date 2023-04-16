import Center from "@/components/Center"
import Library from "@/components/Library"
import Player from "@/components/Player"
import Search from "@/components/Search"
import Sidebar from "@/components/Sidebar"
import { useSession, signOut } from "next-auth/react"
import { useEffect, useState } from "react"

export default function Home() {
  // in order to make API calls to Spotify API
  // we need an access token
  // we will get that access token like this
  // const {data:session} = useSession()
  // token = session.user.access_token
  // in order for this to work, we need to setup NextAuth
  const [globalSelectedPlaylist, setGlobalSelectedPlaylist] = useState('')
  const [globalIsPlaying, setGlobalIsPlaying] = useState(false)
  const [globalCurrentTrackId, setGlobalCurrentTrackId] = useState('')
  const [view, setView] = useState("playlist") // ["playlist", "library", "search"]

  return (
    <main className="bg-black h-screen overflow-hidden">
      <div className="flex w-full">
        <Sidebar
          view={view}
          setView={setView}
          globalSelectedPlaylist={globalSelectedPlaylist}
          setGlobalSelectedPlaylist={setGlobalSelectedPlaylist}
        />
        {view == "playlist" && <Center
          globalSelectedPlaylist={globalSelectedPlaylist}
          setGlobalIsPlaying={setGlobalIsPlaying}
          setGlobalCurrentTrackId={setGlobalCurrentTrackId}
        />}
        {view == "library" && <Library
          setView={setView}
          setGlobalSelectedPlaylist={setGlobalSelectedPlaylist}
        />}
        {view == "search" && <Search
          setView={setView}
          setGlobalSelectedPlaylist={setGlobalSelectedPlaylist}
        />}
      </div>
      <div className="sticky bottom-0 z-50">
        <Player
          globalCurrentTrackId={globalCurrentTrackId}
          globalIsPlaying={globalIsPlaying}
          setGlobalIsPlaying={setGlobalIsPlaying}
        />
      </div>
    </main>
  )
}

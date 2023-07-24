import Navbar from '@/components/Navbar'
import { useState } from 'react'

import { collection, addDoc } from 'firebase/firestore'
import { db } from '@/lib/firebaseClient'
import { useRouter } from 'next/router'

const GeneratorPage = () => {
  const router = useRouter()
  const getBaseUrl = () => typeof window !== 'undefined' ? window.location.origin : ''
  const baseURL = getBaseUrl()

  const [urlToShorten, setUrlToShorten] = useState('')
  const [shortLink, setShortLink] = useState('')
  // const baseURL = 'http://localhost:3000'

  const updateLinkOnDB = async () => {
    addDoc(collection(db, "Links"), {
      url: urlToShorten,
      // timestamp: '',
    }).then((docRef) => {setShortLink(docRef.id)})
  }

  return (
    <>
      <Navbar />
      <input placeholder='url' value={urlToShorten} onChange={(e) => setUrlToShorten(e.target.value)} />
      <button onClick={() => updateLinkOnDB()}>Generate</button>

      {shortLink && <div>
        link generated = <a href={`${baseURL}/file/${shortLink}`}>follow Link</a>
      </div>}
    </>
  )
}

export default GeneratorPage
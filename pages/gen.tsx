import Navbar from '@/components/Navbar'
import { useState } from 'react'
import toast, { Toaster } from 'react-hot-toast'

import { collection, addDoc } from 'firebase/firestore'
import { db } from '@/lib/firebaseClient'
import { useRouter } from 'next/router'

const GeneratorPage = () => {
  const router = useRouter()

  const [urlToShorten, setUrlToShorten] = useState('')
  const [shortLink, setShortLink] = useState('')

  const baseURL = () => typeof window !== 'undefined' ? window.location.origin : ''

  const isValidUrl = (urlString: string): boolean => {
    try { 
      return Boolean(new URL(urlString))
    }
    catch (error) {
      return false
    }
  }

  const updateLinkOnDB = async () => {
    if (isValidUrl(urlToShorten)) {
      addDoc(collection(db, "Links"), {
        url: urlToShorten,
        // timestamp: '',
      }).then((docRef) => {
        setShortLink(docRef.id)
        toast.success('Success! Thank you for using our service!')
        console.log('Success! Thank you for using our service!')
      })
    } else {
      toast.error('Oops! It seems like you entered an invalid URL.')
      console.log('Oops! It seems like you entered an invalid URL.')
    }
  }

  return (
    <>
      <Navbar />
      <input placeholder='url' value={urlToShorten} onChange={(e) => setUrlToShorten(e.target.value)} />
      <button onClick={() => updateLinkOnDB()}>Generate</button>

      {shortLink && <div>
        link generated = <a href={`${baseURL}/file/${shortLink}`}>follow Link</a>
      </div>}
      <Toaster />
    </>
  )
}

export default GeneratorPage
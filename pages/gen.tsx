import Navbar from '@/components/Navbar'
import { useState } from 'react'
import toast, { Toaster } from 'react-hot-toast'

import { collection, addDoc } from 'firebase/firestore'
import { db } from '@/lib/firebaseClient'
import { useRouter } from 'next/router'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

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
      <div className='my-40'>
        <div className="bg-blue-50 flex items-center justify-center">
          <div className="bg-white w-full max-w-lg p-8 rounded-lg shadow-md">
            <h1 className="text-3xl font-bold mb-6 text-center">Link Shortener</h1>
            <div className="flex w-full items-center space-x-2">
              <Input value={urlToShorten} onChange={(e) => setUrlToShorten(e.target.value)} type="url" placeholder="Enter your long URL" required />
              <Button onClick={() => updateLinkOnDB()}>Shorten</Button>
            </div>
            {shortLink &&<div className="ml-1 mt-3">
              link generated = <a href={`${baseURL}/file/${shortLink}`}>follow Link</a>
            </div>}
          </div>
        </div>
      </div>
      <Toaster />
    </>
  )
}

export default GeneratorPage
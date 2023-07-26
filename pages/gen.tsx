import Navbar from '@/components/Navbar'
import { useState } from 'react'
import toast, { Toaster } from 'react-hot-toast'

import { collection, addDoc } from 'firebase/firestore'
import { db } from '@/lib/firebaseClient'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Loader2 } from 'lucide-react'
import Link from 'next/link'

const GeneratorPage = () => {
  const [isGenerating, setIsGenerating] = useState(false)
  const [urlToShorten, setUrlToShorten] = useState('')
  const [shortLink, setShortLink] = useState('')

  const getBaseUrl = () => typeof window !== 'undefined' ? window.location.origin : ''
  const baseURL = getBaseUrl()

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
        setIsGenerating(false)
        toast.success('Success! Thank you for using our service!')
        navigator.clipboard.writeText(`${baseURL}/file/${docRef.id}`)
        console.log('Success! Thank you for using our service!')
      })
    } else {
      setIsGenerating(false)
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
              <Input value={shortLink.length !== 0 ? `${baseURL}/file/${shortLink}` : urlToShorten} onChange={(e) => {setShortLink(''); setUrlToShorten(e.target.value);}} type="url" placeholder="Enter your long URL" required />
              <Button onClick={() => {setIsGenerating(true); updateLinkOnDB();}}>
                {isGenerating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {shortLink ? 'Copied!' : 'Shorten'}
              </Button>
            </div>
            {shortLink && <Button variant="link" asChild>
              <Link href={`/file/${shortLink}`}>Open Link</Link>
            </Button>}
          </div>
        </div>
      </div>
      <Toaster />
    </>
  )
}

export default GeneratorPage
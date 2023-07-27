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
  const [isGenerating, setIsGenerating] = useState<boolean>(false)
  const [pathToGenerate, setPathToGenerate] = useState<string>('')
  const [shortLink, setShortLink] = useState<string>('')

  const getBaseUrl = () => typeof window !== 'undefined' ? window.location.origin : ''
  const baseURL = getBaseUrl()

  const isValidPath = (path: string): boolean => {
    return path.startsWith('/')
  }

  const updateDataOnDB = () => {
    if (pathToGenerate.length !== 0 && isValidPath(pathToGenerate)) {
      addDoc(collection(db, "Short-links"), {
        path: pathToGenerate,
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
      toast.error('Oops! It seems like you entered an invalid file path.')
      console.log('Oops! It seems like you entered an invalid file path.')
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
              <Input value={shortLink.length !== 0 ? `${baseURL}/file/${shortLink}` : pathToGenerate} onChange={(e) => {setShortLink(''); setPathToGenerate(e.target.value);}} type="url" placeholder="Enter Google Drive file path (e.g., /folder/subfolder/filename.ext)" required />
              <Button onClick={() => {setIsGenerating(true); updateDataOnDB();}}>
                {isGenerating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {shortLink ? 'Copied!' : 'Shorten'}
              </Button>
            </div>
            {shortLink && <Button variant="link" asChild>
              <Link href={`/file/${shortLink}`}>Open this Link</Link>
            </Button>}
          </div>
        </div>
      </div>
      <Toaster />
    </>
  )
}

export default GeneratorPage
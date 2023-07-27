import Navbar from '@/components/Navbar'
import { useRouter } from 'next/router'
import { useEffect, useMemo, useState } from 'react'

import { doc, getDoc } from "firebase/firestore"
import { db } from '@/lib/firebaseClient'
import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-react'
import { workers } from '@/lib/workersList.js'

const LinkPage = () => {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [link, setLink] = useState<string | null>()

  const [fileName, setFileName] = useState('{{File Name}}')
  const [fileSize, setFileSize] = useState('5GB')
  const [fileDownloads, setFileDownloads] = useState(5000)

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const randomNumber = useMemo(() => Math.floor(Math.random() * (workers.length)), [])
  const randomWorker = workers[randomNumber]

  function JSONToBase64(jsonObj: {[key: string]: any}): string {
    const jsonString = JSON.stringify(jsonObj)
    const base64String = btoa(jsonString)
    return base64String
  }

  function getFileName(path: string): string {
    const a = path.split('/')
    return a[a.length - 1]
  }

  function generateDownloadLink(path: string): string {
    const time = Date.now()
    const token = { time: time, path: path }
    const filename = getFileName(path)
    setFileName(filename)
    const tokenBase64 = JSONToBase64(token)
    return `https://${randomWorker}/${tokenBase64}/${filename}`
  }

  async function getPathById(id: string): Promise<string | null> {
    const docRef = doc(db, 'Short-links', id)
    const docSnap = await getDoc(docRef)
    if (docSnap.exists()) {
      const data = docSnap.data().path
      return data as string
    }
    return null
  }

  const externalLinkRedirect = (externalLink: string): void => {
    if (typeof window !== 'undefined') {
      window.location.href = externalLink
    }
  }

  useEffect(() => {
    const fetchLink = async () => {
      if (router.query.linkId) {
        const path = await getPathById(router.query.linkId as string)
        const downloadLink = path === null ? null : generateDownloadLink(path)
        setIsLoading(false)
        setLink(downloadLink || null)
        console.log(downloadLink || null)
      }
    }
    fetchLink()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router])

  function CountdownButton(props: any) {
    const [countdown, setCountdown] = useState<number>(10)
    const [isCounting, setIsCounting] = useState<boolean>(true)
  
    useEffect(() => {
      let timer: NodeJS.Timeout
      if (isCounting && countdown > 0) {
        timer = setInterval(() => {
          setCountdown((prevCountdown) => prevCountdown - 1)
        }, 1000)
      } else {
        setIsCounting(false)
      }
      
      return () => clearInterval(timer)
    }, [countdown, isCounting])

    return (
      <Button
        disabled={isCounting}
        onClick={props.onClick}
      >
        {isCounting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {isCounting ? `Wait ${countdown}s` : 'Download'}
      </Button>
    )
  }

  return (
    <>
      <Navbar />
      {isLoading && <div className='m-4'><p>loading...</p></div>}
      {!isLoading && !link && <div className='m-4'>
        <p>File Not Found - We regret to inform you that the file you&#39;re looking for is not available on our server.</p>
      </div>}
      
      {!isLoading && link && <div className='min-h-screen h-full w-full p-8'>
        <div className='bg-black/5 min-h-[500px] h-full w-full rounded-2xl p-6'>
          <h3 className="mb-3 break-all text-2xl font-semibold leading-none tracking-tight text-gray-900 dark:text-white">{fileName}</h3>
          <p className='flex flex-row'>
            <b className='mr-1'>size:</b>{fileSize}
          </p>
          <p className='flex flex-row'>
            <b className='mr-1'>downloads:</b>{fileDownloads}
          </p>
          <div className='flex items-center justify-center h-[70px] bg-yellow-300 mt-6 rounded-xl'>
            <p className='text-xl uppercase'>#ads</p>
          </div>
          <div className='w-full my-6 text-center'>
            <CountdownButton onClick={() => externalLinkRedirect(link)}>Downlaod</CountdownButton>
          </div>
          <div className='flex items-center justify-center h-[70px] bg-yellow-300 rounded-xl'>
            <p className='text-xl uppercase'>#ads</p>
          </div>
        </div>
      </div>}
    </>
  )
}

export default LinkPage
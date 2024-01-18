import Navbar from '@/components/Navbar'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

import { doc, getDoc } from "firebase/firestore"
import { db } from '@/lib/firebaseClient'
import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-react'

const LinkPage = () => {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [foundLink, setFoundLink] = useState<any>()

  interface ShortLink {
    id?: string;
    url: string;
    timestamp?: string;
  }

  interface PreviewData_interface {
    title?: string;
    size?: string;
    downloads?: number;
  }

  const previewData: PreviewData_interface = {
    title: 'Generating link...',
    size: '5GB',
    downloads: 1250,
  }

  async function getUrlById(id: string): Promise<string | null> {
    const docRef = doc(db, 'Links', id)
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const data = docSnap.data().url
      return data as string
    }
    return null
  }

  const externalLinkRedirect = (externalLink: string): void => {
    if (typeof window !== 'undefined') {
      window.location.href = externalLink;
    }
  }

  useEffect(() => {
    const fetchLink = async () => {
      if (router.query.linkId) {
        const link = await getUrlById(router.query.linkId as string)
        setIsLoading(false)
        setFoundLink(link || null)
        // link && externalLinkRedirect(link)
        console.log(link)
      }
    };
    fetchLink()
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
        {isCounting ? `Wait ${countdown}s` : 'Continue'}
      </Button>
    );
  }

  return (
    <>
      <Navbar />
      {isLoading && <div className='m-4'><p>loading...</p></div>}
      {!isLoading && !foundLink && <div className='m-4'><p>We&#39;re sorry, but the short link you&#39;ve entered does not exist on our server. Please ensure you&#39;ve entered the correct link or contact the link&#39;s creator for assistance.</p></div>}
      {!isLoading && foundLink && <div className='min-h-screen h-full w-full p-8'>
        <div className='bg-black/5 min-h-[500px] h-full w-full rounded-2xl p-6'>
          <h3 className="mb-3 break-all text-2xl font-semibold leading-none tracking-tight text-gray-900 dark:text-white">{previewData.title}</h3>
          <p className='flex flex-row'>
            <b className='mr-1'>page views:</b>{previewData.downloads}
          </p>
          <div className='flex items-center justify-center h-[70px] bg-yellow-300 mt-6 rounded-xl'>
            <p className='text-xl uppercase'>#ads</p>
          </div>
          <div className='w-full my-6 text-center'>
            {/* <Button onClick={() => externalLinkRedirect(foundLink)} disabled={!foundLink}>Download</Button> */}
            <CountdownButton onClick={() => externalLinkRedirect(foundLink)}>Downlaod</CountdownButton>
          </div>
          <div className='flex items-center justify-center h-[70px] bg-yellow-300 rounded-xl'>
            <p className='text-xl uppercase'>#ads</p>
          </div>
        </div>
      </div>}
      {/* <div className='m-4'>
        {isLoading && <p>loading...</p>}
        {!isLoading && !foundLink && <p>We&#39;re sorry, but the short link you&#39;ve entered does not exist on our server. Please ensure you&#39;ve entered the correct link or contact the link&#39;s creator for assistance.</p>}
        {!isLoading && foundLink && <p>You are being redirected to the link.<br/>If the page does not load within a few seconds, click here: <a href={foundLink}>{foundLink}</a></p>}
      </div> */}
    </>
  )
}

export default LinkPage
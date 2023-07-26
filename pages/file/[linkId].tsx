import Navbar from '@/components/Navbar'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

import { doc, getDoc } from "firebase/firestore"
import { db } from '@/lib/firebaseClient'
import { Button } from '@/components/ui/button'

const LinkPage = () => {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [foundLink, setFoundLink] = useState<any>()

  interface ShortLink {
    id: string;
    url: string;
    timestamp?: string;
  }

  const gg: ShortLink[] = [
    {id: 'shadjk1', url: 'google1.com'},
    {id: 'shadjk2', url: 'google2.com'},
    {id: 'shadjk3', url: 'google3.com'},
    {id: 'shadjk4', url: 'google4.com'},
    {id: 'shadjk5', url: 'google5.com'},
    {id: 'shadjk6', url: 'google6.com'},
    {id: 'shadjk7', url: 'google7.com'},
    {id: 'shadjk8', url: 'google8.com'},
  ]

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
  
  return (
    <>
      <Navbar />
      <div className='min-h-screen h-full w-full p-8'>
        <div className='bg-black/5 min-h-[500px] h-full w-full rounded-2xl p-6'>
          <h3 className="mb-3 break-all text-2xl font-semibold leading-none tracking-tight text-gray-900 dark:text-white">{"MimpsbeDd.108p_word4ufree.hair.mkv"}</h3>
          <div>
            <p className='inline-block font-bold'>size:</p>
            <p className='inline-block uppercase'>{"5GB"}</p>
          </div>
          <div>
            <p className='inline-block font-bold'>downloads:</p>
            <p className='inline-block'>{"1250"}</p>
          </div>
          <div className='mt-6 flex items-center justify-center h-[80px] bg-yellow-300'>
            <p className='text-xl uppercase'>#ads</p>
          </div>
          <div className='w-full my-4 text-center'>
            <Button>Downlaod</Button>
          </div>
          <div className='mt-6 flex items-center justify-center h-[80px] bg-yellow-300'>
            <p className='text-xl uppercase'>#ads</p>
          </div>
        </div>
      </div>
      {/* <div className='m-4'>
        {isLoading && <p>loading...</p>}
        {!isLoading && !foundLink && <p>We&#39;re sorry, but the short link you&#39;ve entered does not exist on our server. Please ensure you&#39;ve entered the correct link or contact the link&#39;s creator for assistance.</p>}
        {!isLoading && foundLink && <p>You are being redirected to the link.<br/>If the page does not load within a few seconds, click here: <a href={foundLink}>{foundLink}</a></p>}
      </div> */}
    </>
  )
}

export default LinkPage
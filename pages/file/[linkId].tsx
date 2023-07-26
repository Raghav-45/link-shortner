import Navbar from '@/components/Navbar'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

import { doc, getDoc } from "firebase/firestore"
import { db } from '@/lib/firebaseClient'

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
        link && externalLinkRedirect(link)
        console.log(link)
      }
    };
    fetchLink()
  }, [router])
  
  return (
    <>
      <Navbar />
      {isLoading && <div>loading...</div>}
      {!isLoading && !foundLink && <div>url not found</div>}
      {!isLoading && foundLink && <div>url mil gya = {foundLink}</div>}
    </>
  )
}

export default LinkPage
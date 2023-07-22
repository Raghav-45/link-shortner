import Navbar from '@/components/navbar'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

const LinkPage = () => {
  const router = useRouter()
  // const [isLoading, setIsLoading] = useState<string>('null')
  const [foundLink, setFoundLink] = useState<string | null>()

  interface ShortLink {
    id: string;
    url: string;
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

  function getUrlById(id: string): string | null {
    const matchingItem = gg.find(item => item.id === id)
    return matchingItem ? matchingItem.url : null
  }

  useEffect(() => {
    if (router.query.linkId) {
      // setIsLoading('true')
      const link = getUrlById(router.query.linkId as string)
      if (!link) {
        // setIsLoading('false')
        setFoundLink(null)
        return
      }
      // setIsLoading('false')
      setFoundLink(link)
    }
  }, [router])
  
  return (
    <>
      <Navbar />
      {/* {isLoading == 'null' && <div>init...</div>} */}
      {/* {isLoading == 'true' && <div>loading...</div>} */}
      {/* {isLoading == 'false' && <div>ab ni kr rha...</div>} */}
      {!foundLink && <div>url not found</div>}
      {foundLink && <div>url mil gya</div>}
    </>
  )
}

export default LinkPage
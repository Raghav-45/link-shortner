import Navbar from '@/components/Navbar'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

import { collection, query, where, getDocs, doc, getDoc, setDoc, addDoc } from "firebase/firestore"
import { db } from '@/lib/firebaseClient'

const GeneratorPage = () => {

  const [urlToShorten, setUrlToShorten] = useState('')

  const updateLinkOnDB = () => {
    // const docRef = doc(db, 'Links')
    const docData = {
      // id: lat,
      url: urlToShorten,
      // uuid: firebase.firestore.Timestamp.now(),
    }
    // setDoc(docRef, docData, { merge: false })

    // Add a new document with a generated id.
    addDoc(collection(db, "Links"), docData)

    // console.log('Updated DB with new location:', lat, lng);
  }

  return (
    <>
      <Navbar />
      <input placeholder='gg' value={urlToShorten} onChange={(e) => setUrlToShorten(e.target.value)} />
      <button onClick={() => updateLinkOnDB()}>Generate</button>
      geenrator
    </>
  )
}

export default GeneratorPage
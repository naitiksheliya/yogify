import { useLocation, useNavigate } from 'react-router-dom'
import { getAuth, signInWithPopup, GoogleAuthProvider } from 'firebase/auth'
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore'
import { db } from '../firebase'
import { toast } from 'react-toastify'
import googleIcon from '../assets/svg/googleIcon.svg'

function OAuth() {
  const navigate = useNavigate()
  const location = useLocation()

  const onGoogleClick = async () => {
    try {
      const auth = getAuth()
      const provider = new GoogleAuthProvider()
      const result = await signInWithPopup(auth, provider)
      const user = result.user

      // Check for user
      const docRef = doc(db, 'users', user.uid)
      const docSnap = await getDoc(docRef)

      // If user, doesn't exist, create user
      if (!docSnap.exists()) {
        await setDoc(doc(db, 'users', user.uid), {
          name: user.displayName,
          email: user.email,
          // bio: user.bio,
          // role: user.role,
          // profileImageUrl: user.profileImageUrl,
          timestamp: serverTimestamp(),
        })
      }
      navigate('/')
    } catch (error) {
      console.log(error);
      if (error.code === 'auth/email-already-in-use') {
        toast.error('Email is already in use. Please use a different email or try logging in.')
      } else {
        toast.error('Something went wrong with registration')
      }
    }
  }

  return (
    <div className='socialLogin'>
      <p className="flex justify-center mb-4 block mb-2 text-sm font-medium text-gray-900 dark:text-white">Sign {location.pathname === '/sign-up' ? 'up' : 'in'} with </p>
      <button className='socialIconDiv' onClick={onGoogleClick}>
        <img className='socialIconImg' src={googleIcon} alt='google' />
      </button>
    </div>
  )
}

export default OAuth
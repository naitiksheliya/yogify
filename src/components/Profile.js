import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { getAuth, updateProfile } from 'firebase/auth'
import { updateDoc, getDoc, doc, collection, query, where, getDocs, serverTimestamp } from 'firebase/firestore'
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage'
import { db } from '../firebase'
import { FaUser } from 'react-icons/fa';
import { toast } from 'react-toastify'
import { v4 as uuidv4 } from 'uuid'

function Profile() {
  const [instructor, setInstructor] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    bio: '',
    images: null,
    role: '',
    email: '',
    profileImageUrl: '',
    bookingIds:[],
  })
  const [imageFile, setImageFile] = useState(null);

  const {
    name, bio, role, profileImageUrl, email, images,bookingIds  
  } = formData

  const auth = getAuth()
  const navigate = useNavigate()
  const [changeDetails, setChangeDetails] = useState(false)

  useEffect(() => {
    const fetchUser = async () => {
      const q = query(collection(db, "users"), where("email", "==", auth.currentUser.email))
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        setFormData(doc.data())
        // console.log(bookingIds);
        if (doc.data().role === "instructor") {
          setInstructor(true)
        }
      });
    }
    fetchUser();
  }, [auth.currentUser.email])

  const onLogout = () => {
    auth.signOut()
    navigate('/')
  }
  const handleViewBookings = () => {
    console.log(formData.bookingIds)
    console.log("Navigating with bookingIds:", formData.bookingIds);
    navigate('/user-dashboard', {
      state: { bookingIds: formData.bookingIds }
    });
  };

  const onSubmit = async () => {
    try {
      let profileImageUrl = formData.profileImageUrl;
      if (imageFile!=null) {
        console.log(imageFile);
        profileImageUrl = await storeImage(imageFile);
      }

      // Update the user document in Firestore
      const userRef = doc(db, 'users', auth.currentUser.uid)
      const formDataCopy = {
        ...formData,
        profileImageUrl,
        timestamp: serverTimestamp(),
      }
      // Remove the 'images' field from formDataCopy
      delete formDataCopy.images;

      await updateDoc(userRef, formDataCopy)

      // Update the auth profile
      await updateProfile(auth.currentUser, {
        displayName: name,
        photoURL: profileImageUrl
      })

      toast.success('Profile updated successfully')
      setChangeDetails(false)
    } catch (error) {
      console.log(error)
      toast.error('Could not update profile details')
    }
  }

  const onChange = (e) => {
    let boolean = null

    if (e.target.value === 'true') {
      boolean = true
    }
    if (e.target.value === 'false') {
      boolean = false
    }

    // Files
    if (e.target.files) {
      setImageFile(e.target.files[0]);  // Store the file object
      setFormData((prevState) => ({
        ...prevState,
        images: e.target.files[0].name,  // Store only the file name in formData
      }))
    }

    // Text/Booleans/Numbers
    if (!e.target.files) {
      setFormData((prevState) => ({
        ...prevState,
        [e.target.id]: boolean ?? e.target.value,
      }))
    }
  }

  const storeImage = async (image) => {
    return new Promise((resolve, reject) => {
      const storage = getStorage()
      const fileName = `${auth.currentUser.uid}-${image.name}-${uuidv4()}`

      const storageRef = ref(storage, 'images/' + fileName)

      const uploadTask = uploadBytesResumable(storageRef, image)

      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          console.log('Upload is ' + progress + '% done')
          switch (snapshot.state) {
            case 'paused':
              console.log('Upload is paused')
              break
            case 'running':
              console.log('Upload is running')
              break
            default:
              break
          }
        },
        (error) => {
          reject(error)
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            console.log(downloadURL);
            resolve(downloadURL)
          })
        }
      )
    })
  }

  return (
    <>
      <div className="container mx-auto px-4 py-8">
        <div className="bg-gray-800 p-8 rounded-lg shadow-lg">
          <h2 className="text-3xl font-semibold mb-6 text-center text-white">Profile Settings</h2>
          <div className="flex flex-col md:flex-row gap-8">
            <div className="w-full md:w-1/3 flex justify-center items-start">
              <div className="w-48 h-48 relative">
                <div className="w-full h-full bg-gray-700 rounded-full flex items-center justify-center overflow-hidden">
                  {profileImageUrl ? (
                    <img src={profileImageUrl} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <FaUser className="text-gray-400 text-6xl" />
                  )}
                </div>
                <label htmlFor="profileImage" className="absolute bottom-0 right-0 bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-full cursor-pointer transition duration-200">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </label>
                <input
                  type="file"
                  id="profileImage"
                  className="hidden"
                  onChange={onChange}
                  accept=".jpg,.png,.jpeg"
                  disabled={!changeDetails}
                />
              </div>
            </div>
            <div className="w-full md:w-2/3">
              <form onSubmit={(e) => { e.preventDefault(); changeDetails && onSubmit(); }}>
                <div className="grid grid-cols-1 gap-6">
                  <div>
                    <label htmlFor="name" className="block mb-2 text-sm text-white">Name</label>
                    <input
                      type="text"
                      id="name"
                      className="w-full px-4 py-2 rounded-lg bg-gray-700 border border-gray-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                      value={name}
                      onChange={onChange}
                      disabled={!changeDetails}
                    />
                  </div>
                  <div>
                    <label htmlFor="bio" className="block mb-2 text-sm text-white">Bio</label>
                    <textarea
                      id="bio"
                      rows="3"
                      className="w-full px-4 py-2 rounded-lg bg-gray-700 border border-gray-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                      value={bio}
                      onChange={onChange}
                      disabled={!changeDetails}
                    ></textarea>
                  </div>
                  <div>
                    <label htmlFor="email" className="block mb-2 text-sm text-white">Email</label>
                    <input
                      type="email"
                      id="email"
                      className="w-full px-4 py-2 rounded-lg bg-gray-700 border border-gray-600"
                      value={email}
                      disabled
                    />
                  </div>
                  <div>
                    <label htmlFor="role" className="block mb-2 text-sm text-white">Role</label>
                    <input
                      type="text"
                      id="role"
                      className="w-full px-4 py-2 rounded-lg bg-gray-700 border border-gray-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                      value={role}
                      onChange={onChange}
                      disabled={!changeDetails}
                    />
                  </div>
                </div>
                <div className="mt-6 flex gap-4">
                  <button
                    type="button"
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition duration-200"
                    onClick={() => {
                      if (changeDetails) onSubmit()
                      setChangeDetails((prevState) => !prevState)
                    }}
                  >
                    {changeDetails ? 'Save' : 'Edit'}
                  </button>
                  <button
                    type="button"
                    className="flex-1 bg-black hover:bg-gray-900 text-white font-semibold py-3 rounded-lg transition duration-200"
                    onClick={onLogout}
                  >
                    Logout
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      {/* <div className='block center-align w-60 bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-lg text-center transition duration-200'>
      <button onClick={handleViewBookings}>View Bookings
        {console.log(formData.bookingIds)}
      </button>
    </div> */}
      {instructor && (
        <div className="mt-6 flex justify-center">
          <Link
            to="/instructor-dashboard"
            className="block center-align w-60 bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-lg text-center transition duration-200"
          >
            Instructor Dashboard
          </Link>
        </div>
      )}
    </>
  )
}

export default Profile
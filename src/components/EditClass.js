import { useState, useEffect } from 'react'
import { getAuth } from 'firebase/auth'
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage'
import { doc, getDoc, updateDoc, serverTimestamp } from 'firebase/firestore'
import { db } from '../firebase'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import { v4 as uuidv4 } from 'uuid'
import Spinner from './spinner'

function EditClass() {
  const [loading, setLoading] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    capacity: null,
    city: '',
    createdAt: serverTimestamp(),
    date: '',
    description: '',
    geoLocation: {
      lat: null,
      lng: null
    },
    image: "https://firebasestorage.googleapis.com/v0/b/yogify-256a2.appspot.com/o/images%2FgbWiF8Q8FkNpF0dqhxzsd2AUss42-pexels-prasanthinturi-1051838.jpg-6b23aa0f-0dca-4b5d-994b-7c93daf7355e?alt=media&token=32340546-9d39-4799-99a3-f12a0f3e2ae6",
    level: '',
    location: '',
    modeOfClasses: '',
    title: '',
    address: '',  // Add this new field
  })

  const {
    capacity,
    city,
    createdAt,
    date,
    description,
    geoLocation,
    image,
    instructorId,
    level,
    location,
    modeOfClasses,
    title,
    address,  // Add this new field
  } = formData

  const auth = getAuth()
  const navigate = useNavigate()
  const params = useParams()

  useEffect(() => {
    if (!auth.currentUser) {
      navigate('/sign-in')
    } else {
      fetchClassData()
    }
  }, [auth.currentUser, navigate])

  const fetchClassData = async () => {
    setLoading(true)
    try {
      const docRef = doc(db, 'classes', params.classId)
      const docSnap = await getDoc(docRef)
      if (docSnap.exists()) {
        const data = docSnap.data()
        setFormData({
          ...data,
          geoLocation: data.geoLocation || { lat: null, lng: null } // Ensure geoLocation is always an object
        })
      } else {
        toast.error('Class not found')
        navigate('/profile')
      }
    } catch (error) {
      toast.error('Could not fetch class data')
    }
    setLoading(false)
  }

  const onSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    if (title.length > 100) {
      setLoading(false)
      toast.error('Title should be less than 100 characters')
      return
    }

    if (description.length > 1000) {
      setLoading(false)
      toast.error('Description should be less than 1000 characters')
      return
    }

    const classDate = new Date(date)
    if (classDate <= new Date()) {
      setLoading(false)
      toast.error('Class date should be in the future')
      return
    }

    try {
      let imageUrl = formData.imageUrl

      if (image && image !== formData.imageUrl) {
        imageUrl = await storeImage(image)
      }

      const formDataCopy = {
        ...formData,
        imageUrl,
        updatedAt: serverTimestamp(),
      }

      delete formDataCopy.image

      const docRef = doc(db, 'classes', params.classId)
      await updateDoc(docRef, formDataCopy)

      setLoading(false)
      toast.success('Class updated successfully')
      navigate('/profile')
    } catch (error) {
      console.error(error)
      setLoading(false)
      toast.error('Could not update class')
    }
  }

  const onMutate = (e) => {
    let boolean = null

    if (e.target.value === 'true') {
      boolean = true
    }
    if (e.target.value === 'false') {
      boolean = false
    }

    // Files
    if (e.target.files) {
      setFormData((prevState) => ({
        ...prevState,
        image: e.target.files[0],
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
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          console.log('Upload is ' + progress + '% done')
        },
        (error) => {
          reject(error)
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            resolve(downloadURL)
          })
        }
      )
    })
  }

  if (loading) {
    return <Spinner />
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-semibold mb-6 text-center text-white">Edit Class</h1>
      <form onSubmit={onSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="title">
            Title
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={onMutate}
            disabled={!isEditing}
            required
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>

        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="description">
            Description
          </label>
          <textarea
            id="description"
            value={description}
            onChange={onMutate}
            disabled={!isEditing}
            required
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline h-32"
          ></textarea>
        </div>

        <div className="flex flex-wrap -mx-3 mb-6">
          <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="capacity">
              Capacity
            </label>
            <input
              type="number"
              id="capacity"
              value={capacity}
              onChange={onMutate}
            disabled={!isEditing}
              required
              min="1"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          <div className="w-full md:w-1/2 px-3">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="city">
              City
            </label>
            <input
              type="text"
              id="city"
              value={city}
              onChange={onMutate}
            disabled={!isEditing}
              required
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
        </div>

        <div className="flex flex-wrap -mx-3 mb-6">
          <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="date">
              Date
            </label>
            <input
              type="datetime-local"
              id="date"
              value={date}
              onChange={onMutate}
            disabled={!isEditing}
              required
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          <div className="w-full md:w-1/2 px-3">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="location">
              Location
            </label>
            <input
              type="text"
              id="location"
              value={location}
              onChange={onMutate}
            disabled={!isEditing}
              required
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
        </div>

        <div className="flex flex-wrap -mx-3 mb-6">
          <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="level">
              Level
            </label>
            <select
              id="level"
              value={level}
              onChange={onMutate}
            disabled={!isEditing}
              required
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            >
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
            </select>
          </div>
          <div className="w-full md:w-1/2 px-3">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="modeOfClasses">
              Mode of Classes
            </label>
            <select
              id="modeOfClasses"
              value={modeOfClasses}
              onChange={onMutate}
            disabled={!isEditing}
              required
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            >
              <option value="online">Online</option>
              <option value="in-person">In-person</option>
            </select>
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="image">
            Image
          </label>
          <input
            type="file"
            id="image"
            onChange={onMutate}
            disabled={!isEditing}
            accept=".jpg,.png,.jpeg"
            // required
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>

        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="address">
            Address
          </label>
          <input
            type="text"
            id="address"
            value={address}
            onChange={onMutate}
            disabled={!isEditing}
            required
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>

        <div className="flex items-center justify-center mt-6">
          <button
            type={isEditing ? "submit" : "button"}
            onClick={isEditing ? undefined : () => setIsEditing(true)}
            className={`${
              isEditing ? "bg-green-500 hover:bg-green-700" : "bg-blue-500 hover:bg-blue-700"
            } text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full md:w-auto`}
          >
            {isEditing ? "Update Class" : "Edit"}
          </button>
        </div>
      </form>
    </div>
  )
}

export default EditClass
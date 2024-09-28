import { useState, useEffect } from 'react'
import { getAuth } from 'firebase/auth'
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage'
import { addDoc, collection, serverTimestamp } from 'firebase/firestore'
import { db } from '../firebase'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { v4 as uuidv4 } from 'uuid'
import Spinner from './spinner'

function CreateListing() {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    capacity: '',
    city: '',
    date: '',
    description: '',
    image: null,
    level: '',
    location: '',
    modeOfClasses: '',
    title: '',
    address: '',
  })

  const {
    capacity,
    city,
    date,
    description,
    image,
    level,
    location,
    modeOfClasses,
    title,
    address,
  } = formData

  const auth = getAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (!auth.currentUser) {
      navigate('/sign-in')
    }
  }, [auth.currentUser, navigate])

  const onSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    if (!validateForm()) {
      setLoading(false)
      return
    }

    try {
      const imageUrl = await storeImage(image)

      const formDataCopy = {
        ...formData,
        imageUrl,
        capacity: parseInt(capacity),
        createdAt: serverTimestamp(),
        instructorId: auth.currentUser.uid,
      }

      delete formDataCopy.image

      const docRef = await addDoc(collection(db, 'classes'), formDataCopy)
      setLoading(false)
      toast.success('Listing created successfully')
      navigate('/profile')
    } catch (error) {
      console.error('Error creating listing:', error)
      setLoading(false)
      toast.error('Could not create listing')
    }
  }

  const validateForm = () => {
    if (!title.trim()) {
      toast.error('Title is required')
      return false
    }
    if (!description.trim()) {
      toast.error('Description is required')
      return false
    }
    if (!capacity || capacity <= 0) {
      toast.error('Capacity must be a positive number')
      return false
    }
    if (!city.trim()) {
      toast.error('City is required')
      return false
    }
    if (!date) {
      toast.error('Date is required')
      return false
    }
    if (!location.trim()) {
      toast.error('Location is required')
      return false
    }
    if (!level) {
      toast.error('Level is required')
      return false
    }
    if (!modeOfClasses) {
      toast.error('Mode of Classes is required')
      return false
    }
    if (!address.trim()) {
      toast.error('Address is required')
      return false
    }
    if (!image) {
      toast.error('Image is required')
      return false
    }
    return true
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

  const onMutate = (e) => {
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
        [e.target.id]: e.target.value,
      }))
    }
  }

  if (loading) {
    return <Spinner />
  }

  return (
    <div className="container mx-auto hy-15 px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-semibold mb-6 text-center text-white">Create a New Listing</h1>
      <form onSubmit={onSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="title">
            Title
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={onMutate}
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
            accept=".jpg,.png,.jpeg"
            required
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
            required
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>

        <div className="flex items-center justify-center">
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full md:w-auto"
          >
            Create Listing
          </button>
        </div>
      </form>
    </div>
  )
}

export default CreateListing
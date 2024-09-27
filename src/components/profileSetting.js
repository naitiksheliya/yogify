function profileSetting({ name,bio,role,profileImageUrl }) {
    return (
        <>
        <div className="container mx-auto px-4 py-8">
        <div className="bg-gray-800 p-8 rounded-lg shadow-lg">
          <h2 className="text-3xl font-semibold mb-6 text-center text-white">Profile Settings</h2>
          <div className="flex flex-col md:flex-row gap-8">
            <div className="w-full md:w-1/3 flex justify-center items-start">
              <div className="w-48 h-48 bg-gray-700 rounded-full flex items-center justify-center">
                <FaUser className="text-6xl text-gray-400" />
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
  </>
    )
  }
  
  export default profileSetting
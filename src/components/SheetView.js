import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const url = 'https://rkbackrailway-production.up.railway.app/';

const CORRECT_PASSWORD = "123";

export default function AdminDashboard() {
  const [password, setPassword] = useState("");
  const [authenticated, setAuthenticated] = useState(false);
  const [data, setData] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [mediaData, setMediaData] = useState([]);
  const [isContentModalOpen, setIsContentModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [uploadFile, setUploadFile] = useState(null);
  const [newCategory, setNewCategory] = useState("");
  const [categories, setCategories] = useState([]);
  const [isOfferModalOpen, setIsOfferModalOpen] = useState(false);
  const [offerText, setOfferText] = useState("");



  const fetchOffer = async () => {
    try {
      const res = await fetch(`${url}/get-offer`);
      const json = await res.json();
      setOfferText(json.latest_offer || "");
    } catch (err) {
      console.error("Failed to fetch offer:", err);
    }
  };


  // Fetch media data
  const fetchMedia = async () => {
    try {
      const res = await fetch(`${url}/media-list`);
      const data = await res.json();
      setMediaData(data);

      const categoryList = Array.from(new Set(data.map(item => item.category)));
      setCategories(categoryList);

      if (!selectedCategory) {
        const firstCategory = categoryList[0];
        if (firstCategory) setSelectedCategory(firstCategory);
      }
    } catch (err) {
      console.error("Failed to load media:", err);
    }
  };



  // Group by unique categories
  const groupedCategories = mediaData.reduce((acc, item) => {
    if (!item.url) return acc;
    if (!acc[item.category]) acc[item.category] = [];
    acc[item.category].push(item.url);
    return acc;
  }, {});



  useEffect(() => {
    if (authenticated) {
      setLoading(true);
      fetch("https://script.google.com/macros/s/AKfycbxq_G9QHiB2l40tS5zspn00aEyzO6fP0Wg-0zaGm8gdfnCTVUzg-c2I3RA5zSwg6Va_/exec")
        .then((res) => res.json())
        .then((result) => {
          setData(result.data || []);
          setLoading(false);
        })
        .catch((err) => {
          console.error("Failed to fetch data:", err);
          setLoading(false);
        });
    }
  }, [authenticated]);

  const handleLogin = (e) => {
    e.preventDefault();
    if (password === CORRECT_PASSWORD) {
      setAuthenticated(true);
    } else {
      setError("Invalid password. Please try again.");
      setTimeout(() => setError(""), 3000);
    }
  };

  const updateStatus = async (id, newStatus) => {
    const item = data.find(item => item.id === id);
    if (!item?.email) return;

    setData(prev =>
      prev.map(i => (i.id === id ? { ...i, status: newStatus } : i))
    );

    try {
      await fetch(`${url}update-status`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: item.email, status: newStatus, id: item.id }),
      });
      toast.success("updated successfully");
    } catch (err) {
      console.error("Error updating status:", err);
    }
  };

  const filteredData = data.filter(item =>
    (item.name?.toString().toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
    (item.email?.toString().toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
    (item.phone?.toString() || "").includes(searchTerm) ||
    (item.message?.toString().toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
    (item.status?.toString().toLowerCase() || "").includes(searchTerm.toLowerCase())
  );


  if (!authenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600 p-4">
        <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold mb-2 text-center">RK Balloons</h2>
          <p className="text-center mb-6">Admin Dashboard Login</p>

          {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin}>
            <input
              type="password"
              placeholder="Enter Admin Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-gray-300 p-2 rounded mb-4"
            />
            <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
              Sign In
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow p-4 flex justify-between items-center">
        <h1 className="text-xl font-bold">RK Balloons - Admin Dashboard</h1>
        <button
          onClick={() => setAuthenticated(false)}
          className="text-gray-600 hover:text-gray-900"
        >
          Sign Out
        </button>
      </div>


      {/* Main Content */}
      <div className="container mx-auto py-8 px-4">
        {/* Search and Controls */}
        <div className="mb-8 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full border border-gray-300 p-2 rounded"
            />
          </div>
          <div className="flex justify-end">
            <button
              onClick={() => {
                fetchMedia();
                setIsContentModalOpen(true);
              }}
              className="flex items-center px-4 py-2 text-white font-medium bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 rounded-lg shadow-md transition duration-200"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
              </svg>
              Modify Content
            </button>
            <button
              onClick={() => {
                fetchOffer();
                setIsOfferModalOpen(true);
              }}
              className="flex items-center ml-4 px-4 py-2 text-white font-medium bg-gradient-to-r from-purple-500 to-purple-700 hover:from-purple-600 hover:to-purple-800 rounded-lg shadow-md transition duration-200"
            >
              📝 Edit Offer Text
            </button>

          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="container mx-auto px-4 grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-4 shadow rounded">
          <p className="text-gray-500">Total Inquiries</p>
          <h2 className="text-xl font-bold">{data.length}</h2>
        </div>
        <div className="bg-white p-4 shadow rounded">
          <p className="text-gray-500">Completed</p>
          <h2 className="text-xl font-bold">{data.filter(i => i.status === "completed").length}</h2>
        </div>
        <div className="bg-white p-4 shadow rounded">
          <p className="text-gray-500">Pending</p>
          <h2 className="text-xl font-bold">{data.filter(i => i.status === "incomplete").length}</h2>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4">
        {loading ? (
          <div className="text-center py-10">Loading...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredData.map((item) => (
              <div key={item.id} className="bg-white p-4 shadow rounded space-y-2">
                <div className="flex justify-between items-start">
                  <h3 className="text-lg font-semibold">{item.name}</h3>
                  <span className={`text-sm px-2 py-1 rounded-full ${item.status === "completed" ? "bg-green-100 text-green-700" : "bg-orange-100 text-orange-700"}`}>
                    {item.status}
                  </span>
                </div>
                <p><strong>Date:</strong> {item.timestamp}</p>
                <p><strong>Phone:</strong> {item.phone}</p>
                <p><strong>Email:</strong> {item.email}</p>
                <div className="bg-gray-100 p-2 rounded">
                  <p><strong>Message:</strong> {item.message}</p>
                </div>
                <div className="flex justify-end gap-2">
                  {item.status === "incomplete" ? (
                    <button
                      onClick={() => updateStatus(item.id, "completed")}
                      className="text-white bg-green-600 px-3 py-1 rounded hover:bg-green-700 text-sm"
                    >
                      Mark Complete
                    </button>
                  ) : (
                    <button
                      onClick={() => updateStatus(item.id, "incomplete")}
                      className="text-white bg-orange-600 px-3 py-1 rounded hover:bg-orange-700 text-sm"
                    >
                      Mark Pending
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Modal
        isOpen={isContentModalOpen}
        onRequestClose={() => {
          setIsContentModalOpen(false);
          setSelectedCategory("");
          setNewCategory("");
          setUploadFile(null);
        }}

        contentLabel="Manage Content"
        style={{
          content: {
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "80vw",
            height: "80vh",
            overflow: "auto",
            padding: 0,
          },
          overlay: {
            zIndex: 50,
            backgroundColor: "rgba(0, 0, 0, 0.6)",
          },
        }}
      >
        <div className="bg-white p-6 rounded">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Manage Uploaded Content</h2>
            <button onClick={() => setIsContentModalOpen(false)} className="text-red-500 font-bold text-xl">✖</button>
          </div>

          {/* Category Tabs */}
          {/* Category Tabs (scrollable) */}
          <div className="mb-4">
            <div className="flex items-center mb-2 gap-2">
              <input
                type="text"
                placeholder="New Category"
                className="border p-2 rounded text-sm"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
              />
              <button
                onClick={() => {
                  const trimmed = newCategory.trim();
                  if (!trimmed) return;
                  if (!categories.includes(trimmed)) {
                    setCategories(prev => [...prev, trimmed]);
                  }
                  setSelectedCategory(trimmed);
                  setNewCategory("");
                }}

                className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 text-sm"
              >
                Add Category
              </button>
            </div>

            <div className="overflow-x-auto">
              <div className="flex space-x-2 w-max px-1">
                {categories.map((cat, index) => (
                  <button
                    key={index}
                    className={`px-4 py-2 whitespace-nowrap rounded-full text-sm font-semibold border ${selectedCategory === cat
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 text-gray-700"
                      }`}
                    onClick={() => setSelectedCategory(cat)}
                  >
                    {cat}
                  </button>
                ))}

              </div>
            </div>
          </div>



          {/* Images */}
          {selectedCategory && (
            <div className="mb-6">
              <h3 className="text-lg font-bold mb-2">{selectedCategory} files</h3>
              {/* Upload New File */}
              <form
                className="mb-6"
                onSubmit={async (e) => {
                  e.preventDefault();
                  if (!uploadFile) return;
                  const formData = new FormData();
                  formData.append("category", selectedCategory);
                  formData.append("file", uploadFile);
                  try {
                    await fetch(`${url}/upload-content`, {
                      method: "POST",
                      body: formData,
                    });
                    setUploadFile(null);
                    toast.success("File added successfully")
                    fetchMedia(); // refresh list
                  } catch (err) {
                    toast.error("Failed to add file. Try again")
                    console.error("Upload failed", err);
                  }
                }}
              >
                <input
                  type="file"
                  accept="image/*,video/*"
                  onChange={(e) => setUploadFile(e.target.files[0])}
                  className="mb-2"
                  required
                />
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                  Upload New File
                </button>
              </form>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {groupedCategories[selectedCategory]?.length > 0 ? (
                  groupedCategories[selectedCategory].map((img, i) => {
                    const filename = img.split("/").pop();
                    const handleDelete = async () => {
                      const confirmDelete = window.confirm("Are you sure you want to delete this file?");
                      if (!confirmDelete) return;

                      try {
                        await fetch(`${url}/delete-content`, {
                          method: "POST",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({ filename }),
                        });
                        toast.success("File deleted successfully");
                        fetchMedia(); // Refresh media list
                      } catch (err) {
                        console.error("Delete failed:", err);
                        toast.error("Failed to delete. Try again");
                      }
                    };

                    return (
                      <div key={i} className="relative">
                        {/\.(mp4|webm|ogg)$/i.test(img) ? (
                          <video
                            controls
                            src={`${url}${img}`}
                            className="w-full h-40 object-cover rounded shadow"
                          />
                        ) : (
                          <img
                            src={`${url}${img}`}
                            alt=""
                            className="w-full h-40 object-cover rounded shadow"
                          />
                        )}

                        <button
                          onClick={handleDelete}
                          className="absolute top-1 right-1 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-700"
                          title="Delete"
                        >
                          ✕
                        </button>
                      </div>
                    );
                  })
                ) : (
                  <div className="text-gray-500 col-span-full text-center">No content available in this category.</div>
                )}



              </div>
            </div>
          )}
        </div>
      </Modal>

      <Modal
        isOpen={isOfferModalOpen}
        onRequestClose={() => setIsOfferModalOpen(false)}
        contentLabel="Edit Offer Text"
        style={{
          content: {
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "90%",
            maxWidth: "500px",
            padding: "2rem",
          },
          overlay: {
            zIndex: 50,
            backgroundColor: "rgba(0, 0, 0, 0.6)",
          },
        }}
      >
        <h2 className="text-xl font-bold mb-4">Edit Offer Text</h2>
        <textarea
          value={offerText}
          onChange={(e) => setOfferText(e.target.value)}
          rows={4}
          className="w-full border p-2 rounded mb-4"
        />
        <div className="flex justify-end gap-2">
          <button
            onClick={() => setIsOfferModalOpen(false)}
            className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400"
          >
            Cancel
          </button>
          <button
            onClick={async () => {
              try {
                await fetch(`${url}/add-offer`, {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({ offer: offerText }),
                });
                toast.success("Offer updated");
                setIsOfferModalOpen(false);
              } catch (err) {
                console.error("Failed to update offer:", err);
                toast.error("Failed to update offer. Try again");
              }
            }}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            Save Offer
          </button>
        </div>
      </Modal>



      {/* Footer */}
      <footer className="mt-12 text-center text-gray-500 text-sm py-6 border-t">
        © 2023 RK Balloons Admin Dashboard. All rights reserved.
      </footer>
    </div>
  );
}

import { useFormik } from "formik";
import { useEffect, useState } from "react";
import Header from "./Header";
import PromptCard from "./PromptCard";
import Searchbox from "./Searchbox";
import axios from "axios";
import { Cloudinary } from "@cloudinary/url-gen/index";
import ImageUpload from "./ImageUpload";
import config from "./config";
import { Link, Outlet, useLocation, useNavigate } from "react-router";

function MainPage() {
  const location = useLocation();
  const [showModal, setModel] = useState(false);
  const [promptImage, setPromptImage] = useState(null);
  const [currentLocation, setCurrentLocation] = useState("");
  const [randSeed, setRandSeed] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      title: "",
      prompt: "",
      platform: "",
    },
    validate: (values) => {
      let error = {};
      if (!values.title) {
        error.title = "Required";
      }
      if (!values.prompt) {
        error.prompt = "Required";
      }

      if (!values.platform) {
        error.platform = "Required";
      }
      return error;
    },
    onSubmit: async (values) => {
      try {
        setIsUploading(true);
        const formData = new FormData();
        formData.append("file", promptImage);
        formData.append("upload_preset", "eaf26hf6");
        const cloudinaryRes = await axios.post(
          "https://api.cloudinary.com/v1_1/dutetepcq/image/upload",
          formData
        );

        const response = await axios.post(
          `${config.api}/prompt/create-prompt`,
          {
            ...values,
            imageUrls: [cloudinaryRes.data.secure_url],
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        console.log(response);
        setModel(false);
        setRandSeed(Math.random());
        formik.resetForm();
        formData.delete("file");
        formData.delete("upload_preset");
        setPromptImage(null);
        setIsUploading(false);
        navigate("/my-prompts");
        // fetchPrompts();
      } catch (error) {
        setIsUploading(false);
        console.log(error);
      }
    },
  });

  let handlePromptCreate = () => {
    setModel(true);
  };

  const handlePromptSearch = (searchText) => {
    navigate(`/?search=${searchText}`);
  };

  const handleFileChange = async (e) => {
    console.log(e);
    setPromptImage(e.target.files[0]);
  };

  useEffect(() => {
    console.log(location.pathname);
    setCurrentLocation(location.pathname);
  }, [location]);

  return (
    <>
      <Header handlePromptCreate={handlePromptCreate} />
      <Searchbox handlePromptSearch={handlePromptSearch} />

      <main class="max-w-full mx-auto mt-8 px-6 overflow-y-auto">
        <div class="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          <div class="text-sm font-medium text-center text-gray-500 border-b border-gray-200">
            <ul class="flex flex-wrap -mb-px">
              <li class="me-2">
                <Link
                  to="/"
                  class={`inline-block p-4 rounded-t-lg ${
                    currentLocation == "/"
                      ? "text-blue-600 border-b-2 border-blue-600"
                      : null
                  }`}
                >
                  All
                </Link>
              </li>
              <li class="me-2">
                <Link
                  to="/my-prompts"
                  class={`inline-block p-4 rounded-t-lg ${
                    currentLocation == "/my-prompts"
                      ? "text-blue-600 border-b-2 border-blue-600"
                      : null
                  }`}
                >
                  My Prompts
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </main>

      <main class="max-w-full mx-auto mt-8 px-6 overflow-y-auto h-[calc(100vh-200px)]">
        <Outlet context={randSeed} />
      </main>

      <div
        id="static-modal"
        data-modal-backdrop="static"
        tabindex="-1"
        aria-hidden="true"
        class={`${
          showModal ? "" : "hidden"
        } bg-white/30 backdrop-blur-3xl overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full`}
      >
        <div class="mx-auto relative p-4 w-full max-w-2xl max-h-full">
          <div class="relative bg-white rounded-lg shadow-sm">
            <div class="flex items-center justify-between p-4 md:p-5 border-b rounded-t  border-gray-200">
              <h3 class="text-xl font-semibold">Add your prompts...</h3>
              <button
                type="button"
                onClick={() => setModel(false)}
                class="text-gray-400 bg-transparent hover:bg-gray-200 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center"
                data-modal-hide="static-modal"
              >
                <svg
                  class="w-3 h-3"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 14 14"
                >
                  <path
                    stroke="currentColor"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                  />
                </svg>
                <span class="sr-only">Close modal</span>
              </button>
            </div>

            <form onSubmit={formik.handleSubmit}>
              <div class="p-4 md:p-5 space-y-4">
                <div class="grid gap-6 mb-6 md:grid-cols-1">
                  <div>
                    <label
                      for="first_name"
                      class="block mb-2 text-sm font-medium text-gray-900 "
                    >
                      Title
                    </label>
                    <input
                      type="text"
                      name="title"
                      value={formik.values.title}
                      onChange={formik.handleChange}
                      id="first_name"
                      class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "
                      placeholder="John"
                      required
                    />
                    <span>{formik.errors.title}</span>
                  </div>
                  <div>
                    <div class="flex items-center justify-center w-full">
                      <label
                        for="dropzone-file"
                        class="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50"
                      >
                        <div class="flex flex-col items-center justify-center pt-5 pb-6">
                          <svg
                            class="w-8 h-8 mb-4 text-gray-500"
                            aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 20 16"
                          >
                            <path
                              stroke="currentColor"
                              stroke-linecap="round"
                              stroke-linejoin="round"
                              stroke-width="2"
                              d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                            />
                          </svg>
                          {promptImage ? (
                            <p class="mb-2 text-sm text-gray-500 ">
                              <span class="font-semibold">
                                1 Image uploaded
                              </span>{" "}
                              or drag and drop
                            </p>
                          ) : (
                            <p class="mb-2 text-sm text-gray-500 ">
                              <span class="font-semibold">Click to upload</span>{" "}
                              or drag and drop
                            </p>
                          )}
                          <p class="text-xs text-gray-500">
                            SVG, PNG, JPG or GIF (MAX. 800x400px)
                          </p>
                        </div>
                        <input
                          id="dropzone-file"
                          type="file"
                          class="hidden"
                          onChange={handleFileChange}
                        />
                      </label>
                    </div>
                  </div>

                  {/* <div>
                    <ImageUpload/>
                  </div> */}

                  <div>
                    <label
                      for="countries"
                      class="block mb-2 text-sm font-medium text-gray-900"
                    >
                      Select an option
                    </label>
                    <select
                      id="countries"
                      name="platform"
                      value={formik.values.platform}
                      onChange={formik.handleChange}
                      class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                    >
                      <option selected>Choose a platform</option>
                      <option value="nano_banana">Nano Banana</option>
                      <option value="chat_gpt">ChatGPT</option>
                    </select>
                    <span>{formik.errors.prompt}</span>
                  </div>

                  <div>
                    <label
                      for="message"
                      class="block mb-2 text-sm font-medium text-gray-900 "
                    >
                      Your message
                    </label>
                    <textarea
                      id="message"
                      rows="4"
                      name="prompt"
                      value={formik.values.prompt}
                      onChange={formik.handleChange}
                      class="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 "
                      placeholder="Write your thoughts here..."
                    ></textarea>
                    <span>{formik.errors.prompt}</span>
                  </div>
                </div>
              </div>

              <div class="flex items-center p-4 md:p-5 border-t border-gray-200 rounded-b ">
                <input
                  data-modal-hide="static-modal"
                  type="submit"
                  class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center cursor-pointer"
                  value={`${isUploading ? "Creating..." : "Submit"}`}
                  disabled={isUploading}
                />
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

export default MainPage;

// Backend API
// Login and Logout
// User based Data

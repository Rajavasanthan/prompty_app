import { useFormik } from "formik";
import { useEffect, useState } from "react";
import Header from "./Header";
import PromptCard from "./PromptCard";
import Searchbox from "./Searchbox";
import axios from "axios";
import { Cloudinary } from "@cloudinary/url-gen/index";
import ImageUpload from "./ImageUpload";

function App() {
  const [showModal, setModel] = useState(false);

  const [prompts, setPrompts] = useState([]);

  const [promptImage, setPromptImage] = useState(null);

  const [loading, setLoading] = useState(false);

  const formik = useFormik({
    initialValues: {
      title: "",
      prompt: "",
    },
    validate: (values) => {
      let error = {};
      if (!values.title) {
        error.title = "Required";
      }
      if (!values.prompt) {
        error.prompt = "Required";
      }
      return error;
    },
    onSubmit: async (values) => {
      try {
        const formData = new FormData();
        formData.append("file", promptImage);
        formData.append("upload_preset", "XXXXXX");
        const cloudinaryRes = await axios.post(
          "https://api.cloudinary.com/v1_1/XXXXXXX/image/upload",
          formData
        );

        const response = await axios.post(
          "https://6461c1c2491f9402f4aa0565.mockapi.io/prompts",
          {
            ...values,
            imageUrl: cloudinaryRes.data.secure_url,
          }
        );
        console.log(response);
        setModel(false);
        fetchPrompts();
      } catch (error) {
        console.log(error);
      }
    },
  });

  let handlePromptCreate = () => {
    setModel(true);
  };

  let handlePromptSearch = async (searchText) => {
    try {
      const search = await axios.get(
        `https://6461c1c2491f9402f4aa0565.mockapi.io/prompts`,
        {
          params: {
            title: searchText,
          },
        }
      );
      console.log(search);
      setPrompts(search.data);
    } catch (error) {
      if (error.status == 404) {
        setPrompts([]);
      }

      if (error.status == 500) {
        alert("Something went wrong...");
      }
    }
  };

  const handleFileChange = async (e) => {
    console.log(e);
    setPromptImage(e.target.files[0]);
  };

  let fetchPrompts = async () => {
    try {
      setLoading(true);
      const prompts = await axios.get(
        "https://6461c1c2491f9402f4aa0565.mockapi.io/prompts"
      );
      console.log(prompts);
      setPrompts(prompts.data);
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchPrompts();
  }, []);

  return (
    <>
      <Header handlePromptCreate={handlePromptCreate} />
      <Searchbox handlePromptSearch={handlePromptSearch} />
      <main class="max-w-full mx-auto mt-8 px-6 overflow-y-auto h-[calc(100vh-200px)]">
        <div class="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 pb-12">
          {loading ? (
            <div class="text-center col-span-4">
              <h1 class="text-2xl font-bold text-gray-500">
                Loading Please wait...
              </h1>
            </div>
          ) : prompts.length > 0 ? (
            prompts.map((item, index) => {
              return <PromptCard item={item} key={index} />;
            })
          ) : (
            <div class="text-center col-span-4">
              <h1 class="text-2xl font-bold text-gray-500">No prompts found</h1>
            </div>
          )}
        </div>
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
                  class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                  value={"Submit"}
                />
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;

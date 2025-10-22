import { useFormik } from "formik";
import { useEffect } from "react";
import { useSearchParams } from "react-router";

function Searchbox({ handlePromptSearch }) {
  const [searchParams] = useSearchParams();
  const formik = useFormik({
    initialValues: {
      search: "",
    },
    validate: (values) => {
      let error = {};
      if (!values.search) {
        error.search = "Required";
      }
      return error;
    },
    onSubmit: (values) => {
      console.log(values);
      handlePromptSearch(values.search);
    },
  });

  useEffect(() => {
    console.log("searchParams update",searchParams.get("search"))
    if(searchParams.get("search")){
      formik.setFieldValue("search",searchParams.get("search"));
    }else{
      formik.resetForm()
    }
  }, [searchParams]);

  // useEffect(() => {
  //   console.log(searchParams.get("search"))
  //   formik.setFieldValue("search",searchParams.get("search"));
  // }, []);

  return (
    <div class="max-w-2xl mx-auto mt-6 px-4">
      <form onSubmit={formik.handleSubmit}>
        <div class="flex items-center bg-white rounded-full shadow px-4 py-2">
          <input
            type="text"
            name="search"
            value={formik.values.search}
            onChange={formik.handleChange}
            placeholder="retro style in gemini..."
            class="flex-1 focus:outline-none text-gray-700"
          />
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class="w-5 h-5 text-gray-500"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 105.25 5.25a7.5 7.5 0 0011.4 11.4z"
            />
          </svg>
        </div>
      </form>
    </div>
  );
}

export default Searchbox;

import axios from "axios";
import { useEffect, useState } from "react";
import config from "./config";
import PromptCard from "./PromptCard";
import { useNavigate, useOutletContext, useSearchParams } from "react-router";

function AllPrompts() {
  const context = useOutletContext();
  const [searchParams] = useSearchParams();
  const [prompts, setPrompts] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  let fetchPrompts = async () => {
    try {
      setLoading(true);
      const prompts = await axios.get(`${config.api}/prompt/get-all-prompts`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setPrompts(prompts.data);
      console.log(prompts);
      setLoading(false);
    } catch (error) {
      console.log(error);
      navigate("/login");
    }
  };

  let handlePromptSearch = async (searchText) => {
    try {
      const search = await axios.get(`${config.api}/prompt/search-prompts`, {
        params: {
          search: searchText,
        },
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      console.log(search);
      setPrompts(search.data);
    } catch (error) {
      if (error.status == 404) {
        // setPrompts([]);
      }

      if (error.status == 500) {
        alert("Something went wrong...");
      }
    }
  };

  useEffect(() => {
    // fetchPrompts();
    console.log(searchParams.get("search"));
    if (searchParams.get("search")) {
      // search
      console.log("Search");
      handlePromptSearch(searchParams.get("search"));
    }
  }, [searchParams]);

  useEffect(() => {
    if (!searchParams.get("search")) {
      // search
      console.log("normal");
      fetchPrompts();
    }
  }, [context]);
  return (
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
  );
}

export default AllPrompts;

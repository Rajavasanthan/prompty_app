import axios from "axios";
import { useEffect, useState } from "react";
import config from "./config";
import PromptCard from "./PromptCard";
import { useOutletContext } from "react-router";

function MyPrompts() {
    const context = useOutletContext()
    console.log(context);
  const [prompts, setPrompts] = useState([]);
  const [loading, setLoading] = useState(false);
  let fetchPrompts = async () => {
    try {
      setLoading(true);
      const prompts = await axios.get(`${config.api}/prompt/get-my-prompts`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setPrompts(prompts.data);
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

//   useEffect(() => {
//     fetchPrompts();
//   }, []);

useEffect(() => {
    fetchPrompts();
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

export default MyPrompts
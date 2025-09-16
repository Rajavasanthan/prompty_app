
function PromptCard({item}) {
  return (
      <div class="bg-white rounded-lg shadow overflow-hidden flex flex-col">
            <img
              src={item.imageUrl}
              alt="Card image"
              class="w-full h-48 object-cover"
            />
            <div class="p-4 flex-1 flex flex-col justify-between">
              <div class="flex justify-between items-center mb-2">
                <div class="w-6 h-6 bg-gray-300 rounded-full">
                  <img
                    src="https://img.freepik.com/premium-vector/instagram-round-icon-social-media-logo_277909-587.jpg"
                    alt=""
                  />
                </div>

                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                  class="w-5 h-5 cursor-pointer"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M16.5 8.25V6a2.25 2.25 0 00-2.25-2.25h-9A2.25 2.25 0 003 6v9A2.25 2.25 0 005.25 17.25h2.25"
                  />
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M18.75 7.5h-6A2.25 2.25 0 0010.5 9.75v6A2.25 2.25 0 0012.75 18h6a2.25 2.25 0 002.25-2.25v-6A2.25 2.25 0 0018.75 7.5z"
                  />
                </svg>
              </div>
              <h2 class="text-lg font-semibold">{item.title}</h2>
              <p class="text-sm text-gray-600 mt-1 line-clamp-3">
                {item.prompt}
              </p>
            </div>
          </div>
  )
}

export default PromptCard
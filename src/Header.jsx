function Header({handlePromptCreate}) {
  return (
    <header class="flex items-center justify-between px-6 py-4 bg-white shadow">
      <div class="text-center flex-1">
        <h1 class="text-4xl font-bold text-purple-600 italic condiment-regular">Prompty</h1>
        <p class="text-gray-500 text-sm">your prompt search ends here...</p>
      </div>
      <div class="flex items-center gap-4">
        <button class="text-2xl font-bold cursor-pointer" onClick={handlePromptCreate}>+</button>
        <div class="w-10 h-10 rounded-full bg-gray-300">
          <img
            src="https://registry.npmmirror.com/@lobehub/icons-static-png/1.65.0/files/dark/gemini-color.png"
            alt=""
          />
        </div>
      </div>
    </header>
  );
}

export default Header;

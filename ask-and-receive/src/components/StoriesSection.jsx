import { useState } from "react"

export default function StoriesSection({ stories }) {
  const [currentStoryIndex, setCurrentStoryIndex] = useState(0)
  return (
    <section id="stories" className="mx-auto max-w-4xl px-6 py-12">
      <h2 className="text-3xl font-semibold">Gratitude</h2>

      {stories.length === 0 ? (
        <div className="mt-6 rounded-3xl border border-dashed border-stone-700 bg-stone-900/50 backdrop-blur p-8 text-stone-300">
          No gratitude shared yet. When an ask is fulfilled, this is where people
          can share what it meant.
        </div>
      ) : (
        <div className="mt-6 flex flex-col items-center gap-4">
          <div className="w-full max-w-md h-[280px] flex flex-col rounded-2xl border border-stone-800 bg-stone-900/60 p-6 backdrop-blur">
            <div>
              <div className="text-sm text-stone-400">
                {stories[currentStoryIndex].ask_title || "A fulfilled ask"}
              </div>

              <h3 className="text-xl font-medium text-white mt-1">
                {stories[currentStoryIndex].title}
              </h3>
            </div>

            <div className="mt-3 text-stone-300 leading-7 overflow-y-auto">
              {stories[currentStoryIndex].body}
            </div>

            <div className="mt-auto pt-4 text-sm text-emerald-300 font-medium text-right">
              Kudos to: {stories[currentStoryIndex].helper_name || "Someone"}
            </div>
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={() =>
                setCurrentStoryIndex((current) =>
                  current === 0 ? stories.length - 1 : current - 1
                )
              }
              className="rounded-2xl border border-stone-700 px-4 py-2 hover:bg-stone-900/80 transition"
            >
              Previous
            </button>

            <button
              type="button"
              onClick={() =>
                setCurrentStoryIndex((current) =>
                  current === stories.length - 1 ? 0 : current + 1
                )
              }
              className="rounded-2xl border border-stone-700 px-4 py-2 hover:bg-stone-900/80 transition"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </section>
  )
}
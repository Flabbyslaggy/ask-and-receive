import { useEffect, useState } from "react"
import { useTheme } from "../ThemeContext"

export default function StoriesSection({ stories, handleProfileClick }) {
  const activeTheme = useTheme()

  const [currentStoryIndex, setCurrentStoryIndex] = useState(0)

  useEffect(() => {
    if (stories.length === 0) {
      setCurrentStoryIndex(0)
      return
    }

    if (currentStoryIndex >= stories.length) {
      setCurrentStoryIndex(stories.length - 1)
    }
  }, [stories.length, currentStoryIndex])

  return (
    <section id="stories" className="mx-auto max-w-4xl px-6 py-12">
      <h2 className="text-3xl font-semibold">Gratitude</h2>

      {stories.length === 0 ? (
        <div className={`mt-6 rounded-3xl border border-dashed ${activeTheme.inputBorder} ${activeTheme.sectionBg} backdrop-blur p-8 text-stone-300`}>
          No gratitude shared yet. When an ask is fulfilled, this is where people
          can share what it meant.
        </div>
      ) : (
        <div className="mt-6 flex flex-col items-center gap-4">
          <div className={`w-full max-w-md h-[280px] flex flex-col rounded-2xl border ${activeTheme.cardBorder} ${activeTheme.cardBg} p-6 backdrop-blur`}>
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

            <div
              onClick={() => {
                const story = stories[currentStoryIndex]

                if (!story.helper_user_id) return

                handleProfileClick(
                  story.helper_user_id,
                  story.helper_name
                )
              }}
              className={`mt-auto cursor-pointer pt-4 text-right text-sm font-medium hover:underline ${activeTheme.accentText}`}
            >
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
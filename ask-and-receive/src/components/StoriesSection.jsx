export default function StoriesSection({ stories }) {
  return (
    <section id="stories" className="mx-auto max-w-6xl px-6 py-12">
      <h2 className="text-3xl font-semibold">Stories</h2>

      <div className="mt-6 grid gap-5 md:grid-cols-2">
        {stories.map((story) => (
          <div
            key={story.id}
            className="p-6 rounded-2xl bg-stone-900/60 backdrop-blur border border-stone-800"
          >
            <h3 className="text-xl font-medium">{story.title}</h3>
            <p className="mt-3 text-stone-300 leading-7">{story.body}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
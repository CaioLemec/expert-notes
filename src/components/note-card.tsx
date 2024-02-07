export function NoteCard() {
  return (
    <button className="rounded-md bg-slate-800 text-left p-5 space-y-3 overflow-hidden hover:ring-2 hover:ring-slate-600 outline-none relative focus-visible:ring-2 focus-visible:ring-lime-400">
      <span className="text-sm font-medium text-slate-200">4 days ago</span>
      <p className="text-sm leading-6 text-slate-300">
        Lorem, ipsum dolor sit amet consectetur adipisicing elit. Nisi
        blanditiis voluptatem, alias est nobis accusantium aperiam repudiandae
        maxime ex assumenda! Reiciendis eum quisquam tenetur debitis maiores
        similique, voluptatibus cumque inventore.
      </p>
      <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-black/60  to-black/0 pointer-events-none" />
    </button>
  );
}

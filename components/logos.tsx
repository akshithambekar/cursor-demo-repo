const clients = [
  "Globex Corp",
  "Initech",
  "Umbrella Co",
  "Stark Industries",
  "Wayne Enterprises",
  "Oscorp",
]

export function Logos() {
  return (
    <section className="py-16 border-y border-border">
      <div className="max-w-7xl mx-auto px-6">
        <p className="text-sm text-muted-foreground text-center mb-10">
          Trusted by leading companies worldwide
        </p>
        <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-8">
          {clients.map((client) => (
            <span 
              key={client} 
              className="text-lg md:text-xl font-semibold text-muted-foreground/50 hover:text-muted-foreground transition-colors"
            >
              {client}
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}

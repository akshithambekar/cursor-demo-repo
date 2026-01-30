import { Button } from "@/components/ui/button"

const stats = [
  { value: "500+", label: "Clients Served" },
  { value: "98%", label: "Client Satisfaction" },
  { value: "15+", label: "Years Experience" },
  { value: "50+", label: "Team Members" },
]

export function About() {
  return (
    <section id="about" className="py-20 md:py-32 bg-card">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <p className="text-sm text-muted-foreground uppercase tracking-wider mb-4">About Us</p>
            <h2 className="text-3xl md:text-4xl font-semibold tracking-tight mb-6 text-balance">
              A global approach for sustainable growth
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-6">
              Since 2010, Acme Incorporated has been at the forefront of technological innovation. 
              We partner with businesses of all sizes to deliver transformative solutions that 
              drive real results.
            </p>
            <p className="text-muted-foreground leading-relaxed mb-8">
              Our team of experts combines deep industry knowledge with technical excellence 
              to help you navigate the complexities of digital transformation and achieve 
              your strategic goals.
            </p>
            <Button>
              Learn More About Us
            </Button>
          </div>
          
          <div className="grid grid-cols-2 gap-6">
            {stats.map((stat) => (
              <div key={stat.label} className="p-6 border border-border rounded-lg bg-background">
                <p className="text-3xl md:text-4xl font-semibold mb-2">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

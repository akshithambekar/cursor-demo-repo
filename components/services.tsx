import { Zap, Shield, BarChart3, Users } from "lucide-react"

const services = [
  {
    icon: Zap,
    number: "01",
    title: "Digital Transformation",
    description: "Modernize your business processes with cutting-edge technology solutions that drive efficiency and growth."
  },
  {
    icon: Shield,
    number: "02", 
    title: "Enterprise Security",
    description: "Protect your digital assets with comprehensive security strategies and robust infrastructure."
  },
  {
    icon: BarChart3,
    number: "03",
    title: "Data Analytics",
    description: "Unlock actionable insights from your data with advanced analytics and visualization tools."
  },
  {
    icon: Users,
    number: "04",
    title: "Consulting Services",
    description: "Expert guidance to navigate complex challenges and achieve your strategic objectives."
  }
]

export function Services() {
  return (
    <section id="services" className="py-20 md:py-32">
      <div className="max-w-7xl mx-auto px-6">
        <div className="mb-16">
          <p className="text-sm text-muted-foreground uppercase tracking-wider mb-4">Our Services</p>
          <h2 className="text-3xl md:text-4xl font-semibold tracking-tight max-w-xl text-balance">
            Comprehensive solutions for modern enterprises
          </h2>
        </div>
        
        <div className="grid md:grid-cols-2 gap-6">
          {services.map((service) => (
            <div 
              key={service.number}
              className="group p-8 border border-border rounded-lg hover:bg-card transition-colors"
            >
              <div className="flex items-start justify-between mb-6">
                <service.icon className="h-6 w-6 text-foreground" />
                <span className="text-4xl font-semibold text-muted-foreground/30">{service.number}</span>
              </div>
              <h3 className="text-xl font-medium mb-3">{service.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{service.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

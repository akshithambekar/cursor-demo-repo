import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

export function Hero() {
  return (
    <section className="pt-32 pb-20 md:pt-40 md:pb-32">
      <div className="max-w-7xl mx-auto px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary text-sm text-muted-foreground mb-8">
            <span className="w-2 h-2 rounded-full bg-green-500" />
            Now accepting new clients for 2026
          </div>
          
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-semibold tracking-tight text-balance leading-[1.1] mb-6">
            Building tomorrow,{" "}
            <span className="text-muted-foreground">tomorrow</span>
          </h1>
          
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed text-balance">
            Acme Incorporated delivers innovative solutions for businesses worldwide. 
            We help enterprises transform and scale with cutting-edge technology.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button size="lg" className="w-full sm:w-auto px-8">
              Get Started
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button variant="outline" size="lg" className="w-full sm:w-auto px-8 bg-transparent">
              View Our Work
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}

import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

export function CTA() {
  return (
    <section id="contact" className="py-20 md:py-32">
      <div className="max-w-7xl mx-auto px-6">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-semibold tracking-tight mb-6 text-balance">
            Ready to transform your business?
          </h2>
          <p className="text-muted-foreground leading-relaxed mb-10">
            Let&apos;s discuss how Acme Incorporated can help you achieve your goals. 
            Our team is ready to partner with you on your next project.
          </p>
          <Button size="lg" className="px-8">
            Contact Us
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </section>
  )
}

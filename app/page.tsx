import { Header } from "@/components/header"
import { Hero } from "@/components/hero"
import { Logos } from "@/components/logos"
import { Services } from "@/components/services"
import { About } from "@/components/about"
import { CTA } from "@/components/cta"
import { Footer } from "@/components/footer"

export default function Home() {
  return (
    <main className="min-h-screen">
      <Header />
      <Hero />
      <Logos />
      <Services />
      <About />
      <CTA />
      <Footer />
    </main>
  )
}

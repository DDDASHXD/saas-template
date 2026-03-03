import { Nav } from "@/components/landing/nav"
import { Hero } from "@/components/landing/hero"
import { FeaturesGrid, FeaturesCarousel } from "@/components/landing/features"
import { Footer } from "@/components/landing/footer"

const Page = () => {
  return (
    <>
      <Nav />
      <Hero />
      <FeaturesGrid />
      <FeaturesCarousel />
      <Footer />
    </>
  )
}

export default Page

import {
  AppNavbar,
} from "@/components/navigation/app-navbar"

import {
  LandingHero,
} from "@/components/landing/landing-hero"

import {
  LandingAbout,
} from "@/components/landing/landing-about"

import {
  LandingFeatures,
} from "@/components/landing/landing-features"

import {
  LandingGallery,
} from "@/components/landing/landing-gallery"

import {
  LandingPlatform,
} from "@/components/landing/landing-platform"

import {
  LandingFooter,
} from "@/components/landing/landing-footer"

export default function LandingPage() {

  return (

    <main className="
      min-h-screen

      bg-background

      text-foreground
    ">

      <AppNavbar />

      <LandingHero />

      <LandingAbout />

      <LandingFeatures />

      <LandingGallery />

      <LandingPlatform />

      <LandingFooter />

    </main>
  )
}
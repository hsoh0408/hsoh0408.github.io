import { createBrowserRouter } from "react-router"
import { ExperienceRedirect } from "../pages/ExperienceRedirect"
import { HomePage } from "../pages/HomePage"
import { LandingPage } from "../pages/LandingPage"
import { NotFoundPage } from "../pages/NotFoundPage"
import { ProjectPage } from "../pages/ProjectPage"
import { RootLayout } from "../components/RootLayout"
import { WorkPage } from "../pages/WorkPage"

export const router = createBrowserRouter([
  // The landing chooser stands alone, without the site header and footer.
  { path: "/", Component: LandingPage },
  {
    Component: RootLayout,
    children: [
      { path: "home", Component: HomePage },
      { path: "work", Component: WorkPage },
      { path: "projects/:slug", Component: ProjectPage },
      // Old experience detail pages now open as a modal on the home page.
      { path: "experience/:slug", Component: ExperienceRedirect },
      { path: "*", Component: NotFoundPage },
    ],
  },
], {
  // Serve under the Vite base path ("/") on GitHub Pages.
  basename: import.meta.env.BASE_URL,
})

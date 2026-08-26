import { createRouter } from "@tanstack/react-router";
import { AppErrorComponent } from "@/lib/error-component";
import { routeTree } from "./routeTree.gen";

export function getRouter() {
  return createRouter({
    routeTree,
    defaultErrorComponent: AppErrorComponent,
    // "/" normally; "/NSBT_HelpDesk/" for the static GitHub Pages demo build.
    basepath: import.meta.env.BASE_URL,
  });
}

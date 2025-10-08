/* eslint-disable no-unused-vars */
import {
  createRootRoute,
  createRouter,
  createRoute,
  redirect,
} from "@tanstack/react-router";
import { z } from "zod";
import { ProtectedRoute } from "../components/auth/ProtectedRoutes";
import { MainLayout } from "../layouts/MainLayout";
import { HomePage } from "../pages/main/HomePage";
import { LoginPage } from "../pages/auth/LoginPage";
import { UserPage } from "../pages/main/UserPage";
import { LicensePage } from "../pages/auth/LicensePage";

const rootRoute = createRootRoute();

const mainLayout = createRoute({
  getParentRoute: () => rootRoute,
  id: "main-layout",
  component: MainLayout,
  beforeLoad: ({ context }) => {
    let { auth, license } = context;

    if (!auth.user) {
      throw redirect({
        to: "/login",
      });
    }
    if (!license.isLicensed) {
      throw redirect({
        to: "/license",
      });
    }
  },
});

const homePage = createRoute({
  getParentRoute: () => mainLayout,
  path: "/",
  component: HomePage,
});
const userPage = createRoute({
  getParentRoute: () => mainLayout,
  path: "/users",
  component: UserPage,
});

const loginPage = createRoute({
  getParentRoute: () => rootRoute,
  path: "/login",
  component: LoginPage,
});

const licensePage = createRoute({
  getParentRoute: () => rootRoute,
  path: "/license",
  component: LicensePage,
});

const routeTree = rootRoute.addChildren([
  mainLayout.addChildren([homePage, userPage]),
  loginPage,
  licensePage,
]);

export const router = createRouter({
  routeTree,
  basepath: "/rsud-tangerang",
});

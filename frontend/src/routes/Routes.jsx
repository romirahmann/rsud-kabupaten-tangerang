/* eslint-disable no-unused-vars */
import {
  createRootRoute,
  createRouter,
  createRoute,
} from "@tanstack/react-router";
import { z } from "zod";
import { ProtectedRoute } from "../components/auth/ProtectedRoutes";
import { MainLayout } from "../layouts/MainLayout";
import { HomePage } from "../pages/main/HomePage";
import { LoginPage } from "../pages/Auth/LoginPage";
import { UserPage } from "../pages/main/UserPage";

const rootRoute = createRootRoute();

const protectedLayout = createRoute({
  getParentRoute: () => rootRoute,
  id: "protected-layout",
  component: ProtectedRoute,
});

const mainLayout = createRoute({
  getParentRoute: () => protectedLayout,
  id: "main-layout",
  component: MainLayout,
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

const routeTree = rootRoute.addChildren([
  protectedLayout.addChildren([mainLayout.addChildren([homePage, userPage])]),
  loginPage,
]);

export const router = createRouter({
  routeTree,
  basepath: "/rsud-tangerang",
});

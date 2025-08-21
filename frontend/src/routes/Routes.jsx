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

const loginPage = createRoute({
  getParentRoute: () => rootRoute,
  path: "/login",
  component: LoginPage,
});

const routeTree = rootRoute.addChildren([
  protectedLayout.addChildren([mainLayout.addChildren([homePage])]),
  loginPage,
]);

export const router = createRouter({
  routeTree,
});

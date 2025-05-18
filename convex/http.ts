import { httpRouter } from "convex/server";
import { auth } from "./auth";

// Create the root router for HTTP actions.
const http = httpRouter();

// Set up the auth routes
auth.addHttpRoutes(http);

// If you have other HTTP routes, define them here before the export.

// Convex expects the router to be the default export.
export default http; 
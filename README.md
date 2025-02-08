The Flow of Middleware in Express
Express has a request-response cycle that involves several stages:
Pre-routing Middleware: Handlers like bodyParser, morgan, etc., that process requests before they reach your routes.
Routing Middleware: Your route handlers like app.get("/api/endpoint", handler).
Post-routing Middleware: Middleware that runs after route handling but before the final response is sent (like logging, response formatting, etc.).
Error-Handling Middleware: If an error occurs, it’s passed to the next middleware with next(error), and this middleware catches and formats the error response.
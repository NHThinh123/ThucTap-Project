import { createRoot } from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./styles/global.css";
import App from "./App.jsx";
import HomePage from "./pages/HomePage.jsx";
import VideoDetailPage from "./pages/VideoDetailPage.jsx";
import LoginPage from "./pages/LoginPage.jsx";

import SignupPage from "./pages/SignupPage.jsx";
import ChannelPage from "./pages/ChannelPage.jsx";

const queryClient = new QueryClient();

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: "video",
        element: <VideoDetailPage />,
        // children: [
        //   {
        //     index: true,
        //     element: <PostPage />,
        //   },
        //   {
        //     path: ":id",
        //     element: <PostDetailPage />,
        //   },
        // ],
      },
      {
        path: "channel",
        element: <ChannelPage />,
      },
    ],
  },
  {
    path: "login",
    element: <LoginPage />,
  },
  {
    path: "signup",
    element: <SignupPage />,
  },
]);

createRoot(document.getElementById("root")).render(
  <QueryClientProvider client={queryClient}>
    <RouterProvider router={router} />
    <ReactQueryDevtools initialIsOpen={false} />
  </QueryClientProvider>
);

import { createRoot } from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { ConfigProvider, App as AntdApp } from "antd";
import "./styles/global.css";
import App from "./App.jsx";
import { AuthWrapper } from "./contexts/auth.context";
import HomePage from "./pages/HomePage.jsx";
import VideoDetailPage from "./pages/VideoDetailPage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import SignupPage from "./pages/SignupPage.jsx";
import ChannelPage from "./pages/ChannelPage.jsx";
import VideoWatchPage from "./pages/VideoWatchPage.jsx";
import ProfilePage from "./pages/ProfilePage.jsx";

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
      },
      {
        path: "channel",
        element: <ChannelPage />,
      },
      {
        path: "watch",
        element: <VideoWatchPage />,
      },
      {
        path: "profile",
        element: <ProfilePage />,
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
    <ConfigProvider
      theme={{
        token: {
          //colorPrimary: "#52c41a", // Màu chính xanh lá cây
          fontFamily: "Roboto, arial, sans-serif", // Font chữ
          fontSize: 18,
          borderRadius: "24px",
        },
      }}
    >
      <AntdApp>
        <AuthWrapper>
          <RouterProvider router={router} />
          <ReactQueryDevtools initialIsOpen={false} />
        </AuthWrapper>
      </AntdApp>
    </ConfigProvider>
  </QueryClientProvider>
);

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
import StudioPage from "./pages/StudioPage.jsx";
import StudioEditPage from "./pages/StudioEditPage.jsx";
import StudioAnalyticsPage from "./pages/StudioAnalyticsPage.jsx";
import StudioContentPage from "./pages/StudioContentPage.jsx";
import StudioSubcribersPage from "./pages/StudioSubcribersPage.jsx";
import StudioOverviewPage from "./pages/StudioOverviewPage.jsx";
import SearchResultPage from "./pages/SearchResultPage.jsx";

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
        path: "search",
        element: <SearchResultPage />,
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
  {
    path: "studio",
    element: <StudioPage />,
    children: [
      {
        index: true,
        element: <StudioContentPage />,
      },
      {
        path: "analytics",
        element: <StudioAnalyticsPage />,
      },
      {
        path: "edit",
        element: <StudioEditPage />,
      },
      {
        path: "subcribers",
        element: <StudioSubcribersPage />,
      },
      {
        path: "overview",
        element: <StudioOverviewPage />,
      },
    ],
  },
]);

createRoot(document.getElementById("root")).render(
  <QueryClientProvider client={queryClient}>
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: "#c90626",
          fontFamily: "Roboto, arial, sans-serif", // Font chữ
          fontSize: 16,
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

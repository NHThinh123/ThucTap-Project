import { createRoot } from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { ConfigProvider, App as AntdApp } from "antd";
import "./styles/global.css";
import App from "./App.jsx";
import { AuthWrapper } from "./contexts/auth.context";
import HomePage from "./pages/HomePage.jsx";
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
import UploadPage from "./pages/UploadPage.jsx";
import { ModalProvider } from "./contexts/modal.context.jsx";
import SearchResultPage from "./pages/SearchResultPage.jsx";
import PlayListPage from "./pages/PlayListPage.jsx";

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
        path: "playlist",
        element: <PlayListPage />,
      },
      {
        path: "channel",
        children: [
          {
            path: ":id",
            element: <ChannelPage />,
          },
        ],
      },
      {
        path: "watch",
        children: [
          {
            path: ":id",
            element: <VideoWatchPage />,
          },
        ],
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
        element: <StudioOverviewPage />,
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
        path: "subscribers",
        element: <StudioSubcribersPage />,
      },
      {
        path: "content",
        element: <StudioContentPage />,
      },
      {
        path: "uploadvideo",
        element: <UploadPage />,
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
          <ModalProvider>
            <RouterProvider router={router} />
            <ReactQueryDevtools initialIsOpen={false} />
          </ModalProvider>
        </AuthWrapper>
      </AntdApp>
    </ConfigProvider>
  </QueryClientProvider>
);

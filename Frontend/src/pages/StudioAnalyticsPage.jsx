import React from "react";
import StatsChart from "../features/studio/components/organisms/StatsChart";
import { useContext } from "react";
import { AuthContext } from "../contexts/auth.context";

const StudioAnalyticsPage = () => {
  // eslint-disable-next-line no-unused-vars
  const { auth, setAuth } = useContext(AuthContext);
  return (
    <>
      <StatsChart userId={auth?.user?.id} />
    </>
  );
};
export default StudioAnalyticsPage;

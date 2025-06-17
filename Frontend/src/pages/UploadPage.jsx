import React from "react";

import VideoUploadForm from "../features/uploadvideo/components/templates/UploadVideoForm";
import { useModal } from "../contexts/modal.context";

const UploadPage = ({ navigate }) => {
  const { closeModal } = useModal();

  return <VideoUploadForm onSuccess={closeModal} navigate={navigate} />;
};

export default UploadPage;

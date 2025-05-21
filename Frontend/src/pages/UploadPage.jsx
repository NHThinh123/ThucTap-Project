import React from "react";

import VideoUploadForm from "../features/uploadvideo/components/templates/UploadVideoForm";
import { useModal } from "../contexts/modal.context";

const UploadPage = () => {
  const { closeModal } = useModal();

  return <VideoUploadForm onSuccess={closeModal} />;
};

export default UploadPage;

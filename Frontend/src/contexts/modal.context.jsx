/* eslint-disable react-refresh/only-export-components */
// src/context/ModalContext.jsx
import React, { createContext, useState, useContext } from "react";
import { Modal } from "antd";

const ModalContext = createContext();

export const ModalProvider = ({ children }) => {
  const [modalState, setModalState] = useState({
    isOpen: false,
    content: null,
  });

  const openModal = (content) => {
    setModalState({ isOpen: true, content });
  };

  const closeModal = () => {
    setModalState({ isOpen: false, content: null });
  };

  return (
    <ModalContext.Provider value={{ openModal, closeModal, modalState }}>
      {children}
      <Modal
        title="Đăng tải video"
        open={modalState.isOpen}
        onCancel={closeModal}
        footer={null}
        width={600}
        centered
        destroyOnClose
      >
        {modalState.content}
      </Modal>
    </ModalContext.Provider>
  );
};

export const useModal = () => useContext(ModalContext);

import { createPortal } from "react-dom";
import { FormAddQuizProvider } from "../../../../contexts/quizesContext/FormAddQuizContext";
import { ListQuizesProvider } from "../../../../contexts/quizesContext/ListQuizesContext";
import { Modal } from "../../modal/Modal";
import { FormAdd } from "../formAdd/FormAdd";
import { ListUserQuizes } from "../listUserQuizes/ListUserQuizes";

export const ModalsQuizes = ({ newQuiz, showListQuizes }) => {
  return (
    <>
      {newQuiz &&
        createPortal(
          <Modal>
            <FormAddQuizProvider>
              <FormAdd />
            </FormAddQuizProvider>
          </Modal>,
          document.body
        )}
      {showListQuizes &&
        createPortal(
          <Modal>
            <ListQuizesProvider>
              <ListUserQuizes />
            </ListQuizesProvider>
          </Modal>,
          document.body
        )}
    </>
  );
};

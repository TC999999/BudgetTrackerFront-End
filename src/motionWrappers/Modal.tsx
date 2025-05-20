import { AnimatePresence, motion } from "motion/react";
import { ReactNode } from "react";

type Props = {
  children: ReactNode;
  large: boolean;
  show: boolean;
};

const Modal: React.FC<Props> = ({ children, large, show }) => {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          key="modal"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
          tabIndex={-1}
          className="modal-layer-1"
        >
          <div className={large ? "modal-layer-2-lg" : "modal-layer-2"}>
            <div className="modal-layer-3">{children}</div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Modal;

import { AnimatePresence, motion } from "motion/react";
import { ReactNode } from "react";

type Props = {
  children: ReactNode;
  large: boolean;
};

const Modal: React.FC<Props> = ({ children, large }) => {
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <div tabIndex={-1} className="modal-layer-1">
          <div className={large ? "modal-layer-2-lg" : "modal-layer-2"}>
            <div className="modal-layer-3">{children}</div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default Modal;

import { motion } from "motion/react";
import { ReactNode } from "react";

type Props = {
  children: ReactNode;
};

const Buttons: React.FC<Props> = ({ children }) => {
  return (
    <motion.div
      initial={{ y: -60 }}
      animate={{ y: 0 }}
      exit={{ y: -60 }}
      transition={{ duration: 0.2 }}
    >
      {children}
    </motion.div>
  );
};

export default Buttons;

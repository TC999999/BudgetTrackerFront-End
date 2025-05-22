import { motion } from "motion/react";
import { ReactNode } from "react";

type Props = {
  children: ReactNode;
};

// wrapper for motion animation for additional nav bar for certain pages (incomes or budgets)
const Buttons: React.FC<Props> = ({ children }) => {
  return (
    <motion.div
      key="buttons"
      initial={{ y: -60 }}
      animate={{ y: 0 }}
      exit={{ y: -60 }}
      transition={{ duration: 0.2 }}
      id="additional-nav-header"
      className="sticky top-20 sm:top-28"
    >
      {children}
    </motion.div>
  );
};

export default Buttons;

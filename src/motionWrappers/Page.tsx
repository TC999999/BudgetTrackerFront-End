import { motion } from "motion/react";
import { ReactNode } from "react";

type Props = {
  children: ReactNode;
};

const Page: React.FC<Props> = ({ children }) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.2 }}
    >
      {children}
    </motion.div>
  );
};

export default Page;

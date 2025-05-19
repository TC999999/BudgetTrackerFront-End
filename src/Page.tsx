import { motion } from "motion/react";
import { ReactNode } from "react";

type Props = {
  children: ReactNode;
};

const Page: React.FC<Props> = ({ children }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
    >
      {children}
    </motion.div>
  );
};

export default Page;

import { motion } from "motion/react";
import { ReactNode } from "react";

type Props = {
  children: ReactNode;
  show: boolean;
};

// wrapper for motion animation for multipart forms (resetting password or
// registering a new account)
const AuthTabs: React.FC<Props> = ({ children, show }) => {
  return show ? (
    <motion.div
      key="authTab"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.2 }}
    >
      {children}
    </motion.div>
  ) : null;
};

export default AuthTabs;

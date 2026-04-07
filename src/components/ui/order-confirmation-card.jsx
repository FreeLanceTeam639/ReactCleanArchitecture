import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle2 } from 'lucide-react';
import { cn } from '../../lib/utils.js';
import { Button } from './button.jsx';

export function OrderConfirmationCard({
  orderId,
  paymentMethod,
  dateTime,
  totalAmount,
  onGoToAccount,
  title = 'Your order has been successfully submitted',
  buttonText = 'Go to my account',
  icon,
  className = ''
}) {
  const details = [
    { label: 'Order ID', value: orderId || '-' },
    { label: 'Payment Method', value: paymentMethod || '-' },
    { label: 'Date & Time', value: dateTime || '-' },
    { label: 'Total', value: totalAmount || '-', isBold: true }
  ];

  const containerVariants = {
    hidden: { opacity: 0, scale: 0.95, y: 18 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        duration: 0.35,
        ease: 'easeInOut',
        staggerChildren: 0.08
      }
    },
    exit: { opacity: 0, scale: 0.96, y: 16, transition: { duration: 0.22 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 16 },
    visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 130, damping: 16 } }
  };

  return (
    <AnimatePresence>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        aria-live="polite"
        className={cn('orderConfirmationCard', className)}
      >
        <div className="orderConfirmationStack">
          <motion.div variants={itemVariants} className="orderConfirmationIconWrap">
            {icon || <CheckCircle2 className="orderConfirmationIcon" />}
          </motion.div>

          <motion.h2 variants={itemVariants} className="orderConfirmationTitle">
            {title}
          </motion.h2>

          <motion.div variants={itemVariants} className="orderConfirmationDetails">
            {details.map((item, index) => (
              <div
                key={item.label}
                className={cn('orderConfirmationRow', {
                  orderConfirmationRowLast: index === details.length - 1,
                  orderConfirmationRowBold: item.isBold
                })}
              >
                <span>{item.label}</span>
                <span className={cn({ orderConfirmationValueBold: item.isBold })}>{item.value}</span>
              </div>
            ))}
          </motion.div>

          <motion.div variants={itemVariants} className="orderConfirmationAction">
            <Button onClick={onGoToAccount} className="orderConfirmationButton" size="lg">
              {buttonText}
            </Button>
          </motion.div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

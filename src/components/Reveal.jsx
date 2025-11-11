import { motion, useReducedMotion } from 'framer-motion';

export default function Reveal({
  as = 'div',
  children,
  delay = 0,
  amount = 0.3,
  className = '',
  ...rest
}) {
  const shouldReduceMotion = useReducedMotion();
  const MotionComponent = motion(as);

  if (shouldReduceMotion) {
    const StaticComponent = as;
    return (
      <StaticComponent className={className} {...rest}>
        {children}
      </StaticComponent>
    );
  }

  return (
    <MotionComponent
      className={className}
      initial={{ opacity: 0, y: 32, scale: 0.98 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, amount }}
      transition={{ duration: 0.65, delay, ease: [0.33, 1, 0.68, 1] }}
      {...rest}
    >
      {children}
    </MotionComponent>
  );
}

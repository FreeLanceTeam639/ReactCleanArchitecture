import { forwardRef } from 'react';
import { cn } from '../../lib/utils.js';

const variantClassMap = {
  default: 'uiButtonDefault',
  destructive: 'uiButtonDestructive',
  outline: 'uiButtonOutline',
  secondary: 'uiButtonSecondary',
  ghost: 'uiButtonGhost',
  link: 'uiButtonLink'
};

const sizeClassMap = {
  default: 'uiButtonSizeDefault',
  sm: 'uiButtonSizeSm',
  lg: 'uiButtonSizeLg',
  icon: 'uiButtonSizeIcon'
};

const Button = forwardRef(function Button(
  {
    className = '',
    variant = 'default',
    size = 'default',
    asChild = false,
    children,
    ...props
  },
  ref
) {
  const Comp = asChild ? 'span' : 'button';

  return (
    <Comp
      ref={ref}
      className={cn(
        'uiButtonBase',
        variantClassMap[variant] || variantClassMap.default,
        sizeClassMap[size] || sizeClassMap.default,
        className
      )}
      {...props}
    >
      {children}
    </Comp>
  );
});

export { Button };

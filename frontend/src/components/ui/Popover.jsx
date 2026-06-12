import React, { useState, useLayoutEffect } from 'react';
import {
  useFloating,
  autoUpdate,
  offset,
  flip,
  shift,
  useClick,
  useDismiss,
  useRole,
  useInteractions,
  FloatingFocusManager,
  FloatingPortal,
} from '@floating-ui/react-dom-interactions';
import { motion, AnimatePresence } from 'framer-motion';

export const Popover = ({ trigger, content, placement = 'bottom-start' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useLayoutEffect(() => {
    const media = window.matchMedia('(max-width: 768px)');
    setIsMobile(media.matches);
    const listener = () => setIsMobile(media.matches);
    media.addEventListener('change', listener);
    return () => media.removeEventListener('change', listener);
  }, []);

  const { x, y, strategy, refs, context, update } = useFloating({
    open: isOpen,
    onOpenChange: setIsOpen,
    strategy: 'absolute',
    placement,
    middleware: [
      offset(10),
      flip(),
      shift({ padding: { bottom: 80, top: 16, left: 16, right: 16 } }),
    ],
    whileElementsMounted: autoUpdate,
  });

  const floatingStyles = {
    position: strategy,
    top: y ?? 0,
    left: x ?? 0,
  };

  useLayoutEffect(() => {
    if (isOpen && !isMobile && refs.reference.current && refs.floating.current) {
      update();
    }
  }, [isOpen, isMobile, refs.reference, refs.floating, update, x, y]);

  const { getReferenceProps, getFloatingProps } = useInteractions([
    useClick(context),
    useDismiss(context),
    useRole(context),
  ]);

  return (
    <>
      {React.cloneElement(
        trigger,
        getReferenceProps({ ref: refs.setReference, ...trigger.props })
      )}
      <FloatingPortal>
        <AnimatePresence>
          {isOpen && (
            <FloatingFocusManager context={context} modal={isMobile}>
              {isMobile ? (
                <div className="fixed inset-0 z-[105] flex items-end justify-center pointer-events-none pb-0">
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={() => setIsOpen(false)}
                    className="fixed inset-0 bg-bg-color/80 backdrop-blur-2xl pointer-events-auto"
                  />
                  <motion.div
                    initial={{ y: '100%' }}
                    animate={{ y: 0 }}
                    exit={{ y: '100%' }}
                    transition={{ type: 'spring', damping: 25, stiffness: 250 }}
                    className="w-full bg-surface/80 backdrop-blur-2xl border-t border-white/10 rounded-t-2xl shadow-2xl pointer-events-auto relative z-10 overflow-hidden pb-[80px] flex flex-col items-center"
                    {...getFloatingProps()}
                  >
                    <div className="w-12 h-1.5 bg-white/20 rounded-full mx-auto mt-4 mb-2 flex-shrink-0" />
                    <div className="w-full flex justify-center">
                      {React.cloneElement(content, { close: () => setIsOpen(false) })}
                    </div>
                  </motion.div>
                </div>
              ) : (
                <motion.div
                  ref={refs.setFloating}
                  style={floatingStyles}
                  {...getFloatingProps()}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.15, ease: 'easeInOut' }}
                  className="bg-surface/80 backdrop-blur-2xl border border-white/10 rounded-xl shadow-2xl z-[105] overflow-hidden"
                >
                  {React.cloneElement(content, { close: () => setIsOpen(false) })}
                </motion.div>
              )}
            </FloatingFocusManager>
          )}
        </AnimatePresence>
      </FloatingPortal>
    </>
  );
};


import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { afterEach } from 'vitest';

afterEach(cleanup);

// jsdom has no matchMedia. Default to full motion; tests spy on this to prefer reduced motion.
window.matchMedia = () => ({ matches: false }) as MediaQueryList;

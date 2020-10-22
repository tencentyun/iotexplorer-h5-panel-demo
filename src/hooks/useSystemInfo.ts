import { useMemo } from 'react';

export interface SystemInfo {
  ipx: boolean;
}

export const useSystemInfo = (): SystemInfo => {
  const { width, height } = window.screen || {};
  return useMemo<SystemInfo>(() => ({
    ipx: (Math.max(width, height) / Math.min(width, height)) > 1.86
  }), []);
};

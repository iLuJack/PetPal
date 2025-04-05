// d stands for declare
// this kind of like types/index.ts
import { ElectronAPI } from '@electron-toolkit/preload'

declare global {
  interface Window {
    electron: ElectronAPI
    api: {
      toggleInteraction: (ignore: boolean) => void
    }
  }
}

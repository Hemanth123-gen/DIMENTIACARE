import fs from 'fs';
import path from 'path';

export interface VoskStatus {
  available: boolean;
  languages: string[];
}

// Model Registry configuration
const VOSK_MODEL_REGISTRY: Record<string, { path: string; supported: boolean }> = {
  en: { path: 'models/vosk/en', supported: true },
  hi: { path: 'models/vosk/hi', supported: true },
  bn: { path: 'models/vosk/bn', supported: true },
  as: { path: 'models/vosk/as', supported: true },
  mr: { path: 'models/vosk/mr', supported: true },
  gu: { path: 'models/vosk/gu', supported: true },
  pa: { path: 'models/vosk/pa', supported: true },
  ne: { path: 'models/vosk/ne', supported: true },
  ur: { path: 'models/vosk/ur', supported: true },
  mai: { path: 'models/vosk/mai', supported: true },
  sa: { path: 'models/vosk/sa', supported: true },
  kok: { path: 'models/vosk/kok', supported: true },
  mni: { path: 'models/vosk/mni', supported: true },
  kha: { path: 'models/vosk/kha', supported: true },
  lus: { path: 'models/vosk/lus', supported: true },
  nag: { path: 'models/vosk/nag', supported: true },
  trp: { path: 'models/vosk/trp', supported: true }
};

export const voskService = {
  getStatus(): VoskStatus {
    const activeLanguages: string[] = [];
    const baseDir = path.resolve(process.cwd(), 'models', 'vosk');
    const backendBaseDir = path.resolve(process.cwd(), 'backend', 'models', 'vosk');

    Object.entries(VOSK_MODEL_REGISTRY).forEach(([lang, config]) => {
      const fullPath = path.resolve(process.cwd(), config.path);
      const backendFullPath = path.resolve(process.cwd(), 'backend', config.path);
      
      // If folder exists and contains something, consider it installed
      if ((fs.existsSync(fullPath) && fs.readdirSync(fullPath).length > 0) ||
          (fs.existsSync(backendFullPath) && fs.readdirSync(backendFullPath).length > 0)) {
        activeLanguages.push(lang);
      }
    });

    return {
      available: activeLanguages.length > 0,
      languages: activeLanguages
    };
  },

  isLanguageSupported(lang: string): boolean {
    const status = this.getStatus();
    return status.languages.includes(lang);
  }
};

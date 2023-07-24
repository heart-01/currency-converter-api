import * as fsExtra from 'fs-extra';

export const removeFile = async (filename: string) => {
  try {
    await fsExtra.remove(`src/upload/${filename}`);
  } catch (error) {
    console.error('Error removing file:', error);
  }
};

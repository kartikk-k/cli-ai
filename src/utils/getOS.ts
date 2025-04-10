/**
 * Returns the name of the current operating system
 * @returns {string} The name of the operating system (Windows, macOS, Linux, or Unknown)
 */
export const getOS = (): string => {
  const platform = process.platform;
  
  switch (platform) {
    case 'win32':
      return 'Windows';
    case 'darwin':
      return 'macOS';
    case 'linux':
      return 'Linux';
    default:
      return 'Unknown';
  }
};

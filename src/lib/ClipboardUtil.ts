export default class ClipboardUtil {
    private static clipboard = navigator.clipboard;
  
    static readText(): Promise<any> {
      if (!this.clipboard) {
        return Promise.reject(new Error('Clipboard API not supported'));
      }
      return this.clipboard.readText();
    }
  
    static writeText(str: string): Promise<any> {
      if (this.clipboard) {
        return this.clipboard.writeText(str);
      } else {
        // Fallback to execCommand
        return new Promise((resolve, reject) => {
          const textarea = document.createElement('textarea');
          textarea.value = str;
          textarea.style.position = 'fixed'; // 避免滚动
          document.body.appendChild(textarea);
          textarea.select();
  
          try {
            const success = document.execCommand('copy');
            document.body.removeChild(textarea);
            if (success) {
              resolve(void 0);
            } else {
              reject(new Error('Failed to copy text'));
            }
          } catch (err) {
            document.body.removeChild(textarea);
            reject(err);
          }
        });
      }
    }
  }
  const extractErrorMessage = (html) => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    const preTag = doc.querySelector('pre');
    if (preTag) {
      const text = preTag.innerHTML.replace(/<br>/g, '\n').replace(/&nbsp;/g, ' ');
      const lines = text.trim().split('\n').map(line => line.trim());
      const errorMessage = lines[0];
      return `${errorMessage}`;
    }
  };
  export default extractErrorMessage
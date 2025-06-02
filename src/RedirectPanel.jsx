
import { useState } from 'react';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';

export default function RedirectPanel() {
  const [slug, setSlug] = useState('');
  const [target, setTarget] = useState('');
  const [redirects, setRedirects] = useState([]);

  const addRedirect = () => {
    if (!slug || !target) return;
    setRedirects([...redirects, { slug, target }]);
    setSlug('');
    setTarget('');
  };

  const generateZip = async () => {
    const zip = new JSZip();
    redirects.forEach(({ slug, target }) => {
      const html = `<!DOCTYPE html>
<html lang='en'>
<head>
  <meta charset='UTF-8'>
  <meta http-equiv='refresh' content='0; url=${target}'>
  <title>Redirecting...</title>
</head>
<body>
  <p>Redirecting to <a href='${target}'>${target}</a></p>
</body>
</html>`;
      zip.file(`${slug}.html`, html);
    });
    const content = await zip.generateAsync({ type: 'blob' });
    saveAs(content, 'redirects.zip');
  };

  return (
    <div>
      <h1>🎯 Генератор редиректов</h1>
      <input placeholder='slug' value={slug} onChange={(e) => setSlug(e.target.value)} />
      <input placeholder='target URL' value={target} onChange={(e) => setTarget(e.target.value)} />
      <button onClick={addRedirect}>Добавить</button>
      <ul>
        {redirects.map((r, i) => (
          <li key={i}>{`/${r.slug} → ${r.target}`}</li>
        ))}
      </ul>
      <button onClick={generateZip}>📦 Скачать ZIP</button>
    </div>
  );
}

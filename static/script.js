
const updateLines = (ta, lc) => lc.innerHTML = Array.from({length: ta.value.split('\n').length}, (_,i)=>i+1).join('<br/>');

document.addEventListener('DOMContentLoaded', () => {
  const source = document.getElementById('sourceCode');
  const result = document.getElementById('resultOutput');
  const linesList = document.querySelectorAll('.lines');
  const linesL = linesList[0];
  const linesR = linesList[1];

  if (source) {
    source.addEventListener('input', () => updateLines(source, linesL));
  if (result) source.onscroll = () => result.scrollTop = source.scrollTop;
  }
  if (result && linesR) updateLines(result, linesR);

  document.addEventListener('click', (e) => {
    const clearBtn = e.target.closest('.btn-c');
    const copyBtn = e.target.closest('.btn-cp');
    const downloadBtn = e.target.closest('.btn-dl');

    if (clearBtn) {
      const source = document.getElementById('sourceCode');
      const result = document.getElementById('resultOutput');
      const langSelect = document.getElementById('languageSelect');
      const linesL = document.querySelector('.p-l .lines');

      source.value = '';
      result.value = '';
      if (langSelect) langSelect.selectedIndex = 0;
      source.scrollTop = 0;
      result.scrollTop = 0;
      source.focus();
      if (linesL) updateLines(source, linesL);
      console.log('Input cleared');
      return;
    }

    if (copyBtn) {
      const result = document.getElementById('resultOutput');
      if (result && result.value) {
        navigator.clipboard.writeText(result.value).then(() => {
          console.log('Copied to clipboard');
        }).catch(() => {
          result.select();
          document.execCommand('copy');
          result.setSelectionRange(0, 0);
          console.log('Copied via fallback');
        });
      }
      return;
    }

    if (downloadBtn) {
      const result = document.getElementById('resultOutput');
      const langSelect = document.getElementById('languageSelect') || {value: ''};
      if (result && result.value) {
        const pageType = window.location.pathname.includes('fixer') ? 'fixed' : 'converted';
        const lang = langSelect.value || '';
        const ext = lang === '' ? 'txt' : lang;
        const blob = new Blob([result.value], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${pageType}.${ext}`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        console.log('Download started');
      }
      return;
    }
  });

});

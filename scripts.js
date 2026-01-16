document.addEventListener('DOMContentLoaded', () => {
  const input = document.getElementById('imageInput');
  const canvas = document.getElementById('previewCanvas');
  const ctx = canvas.getContext('2d');
  const downloadBtn = document.getElementById('downloadBtn');
  const yearSpan = document.getElementById('year');

  yearSpan.textContent = new Date().getFullYear();

  function drawPlaceholder(){
    const w = canvas.width = 1200;
    const h = canvas.height = 800;
    ctx.fillStyle = '#fff';
    ctx.fillRect(0,0,w,h);
    ctx.fillStyle = '#000';
    ctx.font = 'bold 64px system-ui, Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Silas Tyokaha', w/2, h/2 - 16);
    ctx.font = '24px system-ui, Arial';
    ctx.fillText('Upload an image to convert to black & white', w/2, h/2 + 32);
  }
  drawPlaceholder();

  function convertToGrayscale(imageData){
    const data = imageData.data;
    for (let i = 0; i < data.length; i += 4) {
      const r = data[i], g = data[i+1], b = data[i+2];
      const v = Math.round(0.21 * r + 0.72 * g + 0.07 * b);
      data[i] = data[i+1] = data[i+2] = v;
    }
    return imageData;
  }

  function fitSize(img, maxW = 1200, maxH = 800){
    const ratio = Math.min(maxW / img.width, maxH / img.height, 1);
    return { width: Math.round(img.width * ratio), height: Math.round(img.height * ratio) };
  }

  function handleFile(file){
    if (!file || !file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const img = new Image();
      img.onload = () => {
        const size = fitSize(img, 1200, 800);
        canvas.width = size.width;
        canvas.height = size.height;
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        try {
          const imgData = ctx.getImageData(0,0,canvas.width,canvas.height);
          convertToGrayscale(imgData);
          ctx.putImageData(imgData, 0, 0);
          downloadBtn.disabled = false;
        } catch (err) {
          ctx.drawImage(img,0,0,canvas.width,canvas.height);
          canvas.style.filter = 'grayscale(100%)';
          downloadBtn.disabled = false;
        }
      };
      img.onerror = () => alert('Unable to load image. Try another file.');
      img.src = ev.target.result;
    };
    reader.readAsDataURL(file);
  }

  input.addEventListener('change', (e) => {
    const file = e.target.files && e.target.files[0];
    handleFile(file);
  });

  downloadBtn.addEventListener('click', () => {
    // default to PNG
    const url = canvas.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = url;
    a.download = 'silas-image-bw.png';
    document.body.appendChild(a);
    a.click();
    a.remove();
  });

  // Accessibility: allow paste of image
  window.addEventListener('paste', (e) => {
    const items = e.clipboardData && e.clipboardData.items;
    if (!items) return;
    for (const it of items){
      if (it.type && it.type.startsWith('image/')){
        const file = it.getAsFile();
        handleFile(file);
        break;
      }
    }
  });
});

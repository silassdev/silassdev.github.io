
document.addEventListener('DOMContentLoaded', () => {
  const PROFILE_PATH = 'silas.png';
  const input = document.getElementById('imageInput');
  const canvas = document.getElementById('previewCanvas');
  const ctx = canvas.getContext('2d');
  const downloadBtn = document.getElementById('downloadBtn');
  const yearSpan = document.getElementById('year');
  const imageFrame = document.getElementById('imageFrame');
  const fallbackText = imageFrame.querySelector('.image-fallback');

  yearSpan.textContent = new Date().getFullYear();

  // draw a simple placeholder on load (initial aesthetic)
  function drawPlaceholder(){
    const w = canvas.width = 1200;
    const h = canvas.height = 800;
    canvas.style.display = ''; // ensure visible
    ctx.fillStyle = '#fff';
    ctx.fillRect(0,0,w,h);
    ctx.fillStyle = '#000';
    ctx.font = 'bold 64px system-ui, Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Silas Tyokaha', w/2, h/2 - 16);
    ctx.font = '24px system-ui, Arial';
    ctx.fillText('Upload an image to convert to black & white', w/2, h/2 + 32);
    fallbackText.style.display = '';
    downloadBtn.disabled = true;
  }
  drawPlaceholder();

  // convert image data to grayscale in-place (luminosity method)
  function convertToGrayscale(imageData){
    const data = imageData.data;
    for (let i = 0; i < data.length; i += 4) {
      const r = data[i], g = data[i+1], b = data[i+2];
      // luminosity formula
      const v = Math.round(0.21 * r + 0.72 * g + 0.07 * b);
      data[i] = data[i+1] = data[i+2] = v;
      // keep alpha
    }
    return imageData;
  }

  function fitSize(img, maxW = 1200, maxH = 800){
    const ratio = Math.min(maxW / img.width, maxH / img.height, 1);
    return { width: Math.round(img.width * ratio), height: Math.round(img.height * ratio) };
  }

  function handleLoadedImage(img){
    // remove any fallback <img> if previously added
    const prevImg = imageFrame.querySelector('img[data-generated="true"]');
    if (prevImg) prevImg.remove();

    const size = fitSize(img, 1200, 800);
    canvas.width = size.width;
    canvas.height = size.height;
    canvas.style.display = '';
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

    try {
      const imgData = ctx.getImageData(0,0,canvas.width,canvas.height);
      convertToGrayscale(imgData);
      ctx.putImageData(imgData, 0, 0);
      fallbackText.style.display = 'none';
      downloadBtn.disabled = false;
    } catch (err) {
      // Cross-origin or other security restrictions prevent reading pixels.
      // Show a visual grayscale fallback image (not downloadable).
      console.warn('Canvas pixel access failed (CORS/security). Showing CSS-grayscale fallback.', err);
      canvas.style.display = 'none';
      fallbackText.style.display = 'none';

      const fallbackImg = document.createElement('img');
      fallbackImg.dataset.generated = 'true';
      fallbackImg.src = img.src;
      fallbackImg.alt = 'Silas Tyokaha — profile';
      fallbackImg.style.width = '100%';
      fallbackImg.style.height = 'auto';
      fallbackImg.style.filter = 'grayscale(100%)';
      imageFrame.appendChild(fallbackImg);

      // Download disabled because we couldn't generate a non-tainted canvas image.
      downloadBtn.disabled = true;
    }
  }

  function handleFile(file){
    if (!file || !file.type || !file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const img = new Image();
      img.onload = () => handleLoadedImage(img);
      img.onerror = () => alert('Unable to load image. Try another file.');
      // local file data URL is same-origin in context of the page, conversion will work
      img.src = ev.target.result;
    };
    reader.readAsDataURL(file);
  }

  // Try to auto-load profile from repo root (silas.png)
  function loadAndConvertProfile(){
    const img = new Image();
    // allow attempts to use canvas for same-origin images
    img.crossOrigin = 'anonymous';
    img.onload = () => handleLoadedImage(img);
    img.onerror = () => {
      // image not found — leave placeholder
      console.info('Profile image not found at', PROFILE_PATH);
      // keep placeholder
    };
    img.src = PROFILE_PATH;
  }

  input.addEventListener('change', (e) => {
    const file = e.target.files && e.target.files[0];
    handleFile(file);
  });

  downloadBtn.addEventListener('click', () => {
    if (downloadBtn.disabled) return;
    // default to PNG from the canvas (only enabled when conversion succeeded)
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

  // Attempt to load silas.png from repo root
  loadAndConvertProfile();
});

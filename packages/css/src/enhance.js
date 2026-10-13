// 素の HTML 用の小さな補助。写すボタンと、<dialog> の開閉だけ。React では使わない。
//   <button data-ki-copy="#id">  … その要素の文字を写す
//   <button data-ki-dialog-open="id"> / <button data-ki-dialog-close>  … <dialog> の開閉(ダイアログと temporary の Drawer)
document.addEventListener("click", (e) => {
  const t = e.target instanceof Element ? e.target : null;
  if (!t) return;
  const copy = t.closest("[data-ki-copy]");
  if (copy) {
    const src = document.querySelector(copy.getAttribute("data-ki-copy"));
    const label = copy.querySelector("[data-ki-copy-label]") || copy;
    const text = src ? src.textContent : "";
    (navigator.clipboard ? navigator.clipboard.writeText(text) : Promise.reject()).then(
      () => { const old = label.textContent; label.textContent = "写した"; setTimeout(() => (label.textContent = old), 1600); },
      () => { const old = label.textContent; label.textContent = "写せない"; setTimeout(() => (label.textContent = old), 1600); }
    );
  }
  const open = t.closest("[data-ki-dialog-open]");
  if (open) { const d = document.getElementById(open.getAttribute("data-ki-dialog-open")); if (d && d.showModal) d.showModal(); }
  const close = t.closest("[data-ki-dialog-close]");
  if (close) { const d = close.closest("dialog"); if (d) d.close(); }
});
// <dialog> の外(背景)を押すと閉じる。確かめるダイアログには data-ki-modal を付けて除く
document.addEventListener("click", (e) => {
  const d = e.target;
  if (d instanceof HTMLDialogElement && d.open && !d.hasAttribute("data-ki-modal")) {
    const r = d.getBoundingClientRect();
    if (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom) d.close();
  }
});

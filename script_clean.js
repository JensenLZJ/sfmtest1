// ... existing code up to line 2628 ...

  const sectionHead = document.querySelector('.instagram-section .section-head');
  if (sectionHead) {
    sectionHead.appendChild(updateIndicator);
  }
});

// Auto-refresh Instagram posts every 5 minutes - DISABLED (using Elfsight widget)
// setInterval(() => {
//   if (window.autoInstagramPosts) {
//     window.autoInstagramPosts.refresh();
//   }
// }, 5 * 60 * 1000); // 5 minutes


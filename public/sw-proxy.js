self.addEventListener('fetch', async (event) => {
  const {request} = event;
  const response = await fetch(request);
  // 3.拷贝克隆请求
  // 4.篡改响应头
  response.headers.delete('Content-Security-Policy');
  response.headers.delete('X-Frame-Options');

  event.respondWith(Promise.resolve(originalResponse));
});
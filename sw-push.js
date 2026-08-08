// sw-push.js — Service Worker khusus admin MoraStore untuk menerima Web Push
self.addEventListener('install', function(e) {
  self.skipWaiting();
});
self.addEventListener('activate', function(e) {
  self.clients.claim();
});

self.addEventListener('push', function(event) {
  var data = {};
  try { data = event.data ? event.data.json() : {}; } catch (e) { data = { title: 'MoraStore', body: event.data ? event.data.text() : 'Ada notifikasi baru' }; }

  var title = data.title || 'MoraStore Admin';
  var options = {
    body: data.body || '',
    icon: 'https://rblktttasrxemtkhknvt.supabase.co/storage/v1/object/public/product-images/logo.jpg',
    badge: 'https://rblktttasrxemtkhknvt.supabase.co/storage/v1/object/public/product-images/logo.jpg',
    tag: data.tag || 'morastore-order',
    renotify: true,
    vibrate: [200, 100, 200],
    data: { url: data.url || './admin.html' }
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener('notificationclick', function(event) {
  event.notification.close();
  var targetUrl = (event.notification.data && event.notification.data.url) || './admin.html';
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function(clientList) {
      for (var i = 0; i < clientList.length; i++) {
        var c = clientList[i];
        if (c.url.includes('admin.html') && 'focus' in c) return c.focus();
      }
      if (clients.openWindow) return clients.openWindow(targetUrl);
    })
  );
});

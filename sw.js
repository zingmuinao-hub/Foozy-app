self.addEventListener("push", event => {
  let data = {
    title: "New Foozy Order! 🍔",
    body: "You've received a new order. Tap to view it!",
    url: "/Foozy-app/restaurant-dashboard.html"
  };

  if (event.data) {
    try {
      data = { ...data, ...event.data.json() };
    } catch (error) {
      data.body = event.data.text();
    }
  }

  event.waitUntil(
    self.registration.showNotification(data.title, {
      body: data.body,
      icon: "/Foozy-app/icon.png",
      badge: "/Foozy-app/icon.png",
      data: { url: data.url },
      tag: "foozy-new-order",
      renotify: true
    })
  );
});

self.addEventListener("notificationclick", event => {
  event.notification.close();

  const targetUrl = new URL(
    event.notification.data?.url || "/Foozy-app/restaurant-dashboard.html",
    self.location.origin
  ).href;

  event.waitUntil(
    clients.matchAll({
      type: "window",
      includeUncontrolled: true
    }).then(windowClients => {
      for (const client of windowClients) {
        if (client.url.startsWith(self.location.origin)) {
          return client.navigate(targetUrl).then(() => client.focus());
        }
      }

      return clients.openWindow(targetUrl);
    })
  );
});

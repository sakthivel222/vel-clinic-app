const https = require('https');
https.get('https://vel-clinic-live.vercel.app/', (res) => {
  let html = '';
  res.on('data', (d) => html += d);
  res.on('end', () => {
    const match = html.match(/src="([^"]+\.js)"/);
    if (match) {
      https.get('https://vel-clinic-live.vercel.app' + match[1], (res2) => {
        let js = '';
        res2.on('data', (d) => js += d);
        res2.on('end', () => {
          console.log('Contains new URL:', js.includes('vel-clinic-backend'));
          console.log('Contains backend-sakthivel:', js.includes('backend-sakthivel222s-projects.vercel.app'));
          // Find the exact API URL it compiled to
          const idx = js.indexOf('/api"');
          if (idx !== -1) {
            console.log('API URL context:', js.substring(idx - 60, idx + 10));
          } else {
             const idx2 = js.indexOf('vel-clinic-backend');
             console.log('API URL context:', js.substring(idx2 - 30, idx2 + 50));
          }
        });
      });
    }
  });
});

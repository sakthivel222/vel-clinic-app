const https = require('https');
https.get('https://vel-clinic-frontend.vercel.app/', (res) => {
  let html = '';
  res.on('data', (d) => html += d);
  res.on('end', () => {
    const match = html.match(/src="([^"]+\.js)"/);
    if (match) {
      https.get('https://vel-clinic-frontend.vercel.app' + match[1], (res2) => {
        let js = '';
        res2.on('data', (d) => js += d);
        res2.on('end', () => {
          console.log('Contains new URL:', js.includes('vel-clinic-backend'));
          console.log('Contains old URL:', js.includes('backend-rho-lemon'));
          console.log('Contains backend-sakthivel:', js.includes('backend-sakthivel222s-projects.vercel.app'));
        });
      });
    }
  });
});

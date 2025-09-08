const axios = require('axios');

const options = {
  method: 'GET',
  url: 'https://tiktok-video-no-watermark2.p.rapidapi.com/get_tiktok_video_info',
  params: {
    url: 'https://www.tiktok.com/@tiktok/video/7231338487075638570',
    hd: '1'
  },
  headers: {
    'x-rapidapi-key': 'YOUR_API_KEY_HERE',
    'x-rapidapi-host': 'tiktok-video-no-watermark2.p.rapidapi.com'
  }
};

async function fetchData() {
  try {
    const response = await axios.request(options);
    console.log(response.data);
  } catch (error) {
    console.error(error.response ? error.response.data : error.message);
  }
}

fetchData();

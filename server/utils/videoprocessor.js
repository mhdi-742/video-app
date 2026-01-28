const analyzeVideo = (videoData) => {
  return new Promise((resolve) => {
    console.log(` Processing started for: ${videoData.filename}...`);

    setTimeout(() => {
      const isSuspicious = videoData.filename.toLowerCase().includes('bad');
      
      const result = {
        status: isSuspicious ? 'flagged' : 'processed', 
        sensitivity: isSuspicious ? 'unsafe' : 'safe'
      };

      console.log(` Finished. Result: ${result.status}`);
      resolve(result);
    }, 5000); 
  });
};

module.exports = { analyzeVideo };
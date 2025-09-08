const video = document.getElementById('video');
const ratingDisplay = document.getElementById('rating');
const emojiDisplay = document.getElementById('emoji');
const progressBar = document.getElementById('progress');

let moodRating = 5;

// ✅ Emotion weights
const emotionWeight = {
  angry: 1,
  disgusted: 2,
  fearful: 2,
  sad: 0,
  neutral: 5,
  surprised: 7,
  happy: 10
};

// ✅ Emoji list for scores 0–10
const moodEmojis = ["😭","😢","☹️","😟","😐","🙂","😊","😃","😄","😁","🤩"];

console.log("📌 Mood Tracker Starting...");

// ✅ Load models
Promise.all([
  faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
  faceapi.nets.faceExpressionNet.loadFromUri('/models')
])
.then(startVideo)
.catch(err => console.error("❌ Model Load Error:", err));

function startVideo() {
  navigator.mediaDevices.getUserMedia({ video: true })
    .then(stream => video.srcObject = stream)
    .catch(err => console.error("❌ Webcam Error:", err));
}

video.addEventListener('play', () => {
  const canvas = faceapi.createCanvasFromMedia(video);
  document.body.append(canvas);
  const displaySize = { width: video.width, height: video.height };
  faceapi.matchDimensions(canvas, displaySize);

  setInterval(async () => {
    const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions())
      .withFaceExpressions();

    if (detections.length > 0) {
      const expressions = detections[0].expressions;
      let score = 0;

      // ✅ Weighted score
      for (const [emotion, prob] of Object.entries(expressions)) {
        score += prob * (emotionWeight[emotion] || 5);
      }

      // ✅ Final mood (0–10)
      moodRating = Math.min(10, Math.max(0, Math.round(score)));

      // ✅ Update UI
      ratingDisplay.textContent = moodRating;
      emojiDisplay.textContent = moodEmojis[moodRating];
      progressBar.style.width = `${(moodRating / 10) * 100}%`;
    }
  }, 2000);
});

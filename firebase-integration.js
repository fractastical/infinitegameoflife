// Firebase Integration for Conway's Game of Life
// This script handles user authentication, score saving, and leaderboard functionality

// Initialize Firebase
const firebaseConfig = {
  apiKey: "AIzaSyCvgdn8c6D8RusKRr4vHAzFj1x4FNxrXVE",
  authDomain: "infinite-games-9c69e.firebaseapp.com",
  projectId: "infinite-games-9c69e",
  storageBucket: "infinite-games-9c69e.appspot.com",
  messagingSenderId: "602022483888",
  appId: "1:602022483888:web:f967a6c1cb236ae66ba875",
  measurementId: "G-9LE6E1BKZ7"
};

// Game-specific constants
const GAME_ID = "conways-game-of-life";

// Firebase state variables
let userId = null;
let userNickname = "Guest";
let isLoggedIn = false;

// DOM Elements
let loginContainer, userInfoDisplay, leaderboardContainer;

// Initialize Firebase when the page loads
document.addEventListener('DOMContentLoaded', () => {
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  
  // Set up DOM references
  setupDOMReferences();
  
  // Check authentication state
  checkAuthState();
  
  // Set up event listeners for auth-related buttons
  setupAuthListeners();
  
  // Load the leaderboard
  loadLeaderboard();
});

function setupDOMReferences() {
  // Create login container if it doesn't exist
  if (!document.getElementById('loginContainer')) {
    createAuthUI();
  }
  
  loginContainer = document.getElementById('loginContainer');
  userInfoDisplay = document.getElementById('userInfo');
  leaderboardContainer = document.getElementById('leaderboard-container');
}

function createAuthUI() {
  // Create login container
  const loginContainer = document.createElement('div');
  loginContainer.id = 'loginContainer';
  loginContainer.classList.add('top-right');
  loginContainer.innerHTML = `
    <button id="loginButton">Login / Sign Up</button>
  `;
  
  // Create user info display
  const userInfo = document.createElement('div');
  userInfo.id = 'userInfo';
  userInfo.classList.add('top-right', 'hidden');
  userInfo.innerHTML = `
    <span id="userNickname"></span>
    <button id="logoutButton">Logout</button>
  `;
  
  // Create login modal
  const loginModal = document.createElement('div');
  loginModal.id = 'loginModal';
  loginModal.classList.add('modal');
  loginModal.innerHTML = `
    <div class="modal-content">
      <h2>Login</h2>
      <form id="loginForm">
        <input type="email" id="email" placeholder="Email" required>
        <input type="password" id="password" placeholder="Password" required>
        <button type="submit">Login</button>
      </form>
      <div id="loginError" class="error-message"></div>

      <h2>Sign Up</h2>
      <form id="signupForm">
        <input type="text" id="signupNickname" placeholder="Nickname" required>
        <input type="email" id="signupEmail" placeholder="Email" required>
        <input type="password" id="signupPassword" placeholder="Password" required>
        <button type="submit">Sign Up</button>
      </form>
      <div id="signupError" class="error-message"></div>
      <button id="closeLoginModal">Close</button>
    </div>
  `;
  
  // Create leaderboard container
  const leaderboardContainer = document.createElement('div');
  leaderboardContainer.id = 'leaderboard-container';
  leaderboardContainer.innerHTML = `
    <div id="leaderboard">
      <h2>Leaderboard</h2>
      <ol id="leaderboard-list"></ol>
    </div>
  `;
  
  // Add the elements to the body
  document.body.appendChild(loginContainer);
  document.body.appendChild(userInfo);
  document.body.appendChild(loginModal);
  document.body.appendChild(leaderboardContainer);
  
  // Add CSS
  addStyles();
}

function addStyles() {
  const style = document.createElement('style');
  style.textContent = `
    .top-right {
      position: absolute;
      top: 10px;
      right: 10px;
      z-index: 100;
    }
    
    .hidden {
      display: none;
    }
    
    .modal {
      display: none;
      position: fixed;
      z-index: 1000;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, 0.7);
    }
    
    .modal-content {
      background-color: #f4f4f4;
      margin: 15% auto;
      padding: 20px;
      border-radius: 5px;
      width: 300px;
      max-width: 80%;
    }
    
    .error-message {
      color: red;
      margin: 10px 0;
    }
    
    #leaderboard-container {
      position: fixed;
      right: 10px;
      top: 50px;
      background-color: rgba(0, 0, 0, 0.7);
      color: white;
      padding: 10px;
      border-radius: 5px;
      max-width: 250px;
      max-height: 400px;
      overflow-y: auto;
    }
    
    input {
      display: block;
      margin: 10px 0;
      padding: 8px;
      width: 100%;
      box-sizing: border-box;
    }
    
    button {
      padding: 8px 12px;
      margin: 5px 0;
      cursor: pointer;
    }
  `;
  document.head.appendChild(style);
}

function setupAuthListeners() {
  // Login button click
  document.getElementById('loginButton')?.addEventListener('click', () => {
    document.getElementById('loginModal').style.display = 'block';
  });
  
  // Close modal
  document.getElementById('closeLoginModal')?.addEventListener('click', () => {
    document.getElementById('loginModal').style.display = 'none';
  });
  
  // Login form submit
  document.getElementById('loginForm')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    loginUser(email, password);
  });
  
  // Signup form submit
  document.getElementById('signupForm')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const nickname = document.getElementById('signupNickname').value;
    const email = document.getElementById('signupEmail').value;
    const password = document.getElementById('signupPassword').value;
    signupUser(nickname, email, password);
  });
  
  // Logout button click
  document.getElementById('logoutButton')?.addEventListener('click', () => {
    logoutUser();
  });
}

function checkAuthState() {
  firebase.auth().onAuthStateChanged(user => {
    if (user) {
      userId = user.uid;
      loadUserData(userId);
      isLoggedIn = true;
      
      // Hide login container and show user info
      if (loginContainer) loginContainer.classList.add('hidden');
      if (userInfoDisplay) userInfoDisplay.classList.remove('hidden');
    } else {
      userId = null;
      userNickname = "Guest";
      isLoggedIn = false;
      
      // Show login container and hide user info
      if (loginContainer) loginContainer.classList.remove('hidden');
      if (userInfoDisplay) userInfoDisplay.classList.add('hidden');
    }
  });
}

async function loginUser(email, password) {
  try {
    const userCredential = await firebase.auth().signInWithEmailAndPassword(email, password);
    const user = userCredential.user;
    document.getElementById('loginModal').style.display = 'none';
    document.getElementById('loginForm').reset();
  } catch (error) {
    document.getElementById('loginError').textContent = error.message;
  }
}

async function signupUser(nickname, email, password) {
  try {
    const userCredential = await firebase.auth().createUserWithEmailAndPassword(email, password);
    const user = userCredential.user;
    
    // Save initial user data
    await saveInitialUserData(user.uid, email, nickname);
    
    document.getElementById('loginModal').style.display = 'none';
    document.getElementById('signupForm').reset();
  } catch (error) {
    document.getElementById('signupError').textContent = error.message;
  }
}

async function logoutUser() {
  try {
    await firebase.auth().signOut();
  } catch (error) {
    console.error('Error signing out:', error);
  }
}

async function saveInitialUserData(userId, email, nickname) {
  const initialData = {
    email: email,
    nickname: nickname,
    createdAt: new Date(),
    games: {
      [GAME_ID]: {
        highScore: 0,
        scores: [],
        lastPlayed: new Date()
      }
    }
  };
  
  await firebase.firestore().collection('users').doc(userId).set(initialData);
}

async function loadUserData(userId) {
  try {
    const userDoc = await firebase.firestore().collection('users').doc(userId).get();
    
    if (userDoc.exists) {
      const userData = userDoc.data();
      userNickname = userData.nickname || "Player";
      
      // Update the nickname display
      const nicknameElement = document.getElementById('userNickname');
      if (nicknameElement) nicknameElement.textContent = userNickname;
      
      // You can load other game-specific data here if needed
      
      return userData;
    } else {
      // No user data found, create initial data
      const user = firebase.auth().currentUser;
      if (user) {
        await saveInitialUserData(userId, user.email, "Player");
        return {
          nickname: "Player",
          games: {
            [GAME_ID]: {
              highScore: 0,
              scores: [],
              lastPlayed: new Date()
            }
          }
        };
      }
    }
  } catch (error) {
    console.error('Error loading user data:', error);
    return null;
  }
}

async function saveSegmentScore(score, segment, nickname = "Player") {
  try {
    const db = firebase.firestore();
    await db.collection("leaderboards").add({
      score: score,
      nickname: nickname,
      segment: segment,
      timestamp: new Date()
    });
    console.log(`Saved score ${score} to segment ${segment}`);
  } catch (err) {
    console.error("Error saving score:", err);
  }
}


// Save score to Firebase
async function saveScore(score, gameData = {}) {
  if (!isLoggedIn || !userId) {
    console.log('User not logged in. Score not saved.');
    return false;
  }
  
  try {
    const timestamp = new Date();
    
    // Get user data
    const userDoc = await firebase.firestore().collection('users').doc(userId).get();
    const userData = userDoc.data();
    
    // Prepare score data
    const scoreData = {
      score: score,
      timestamp: timestamp,
      gameMode: gameData.gameMode || 'default',
      dimensions: gameData.dimensions || 1,
      activeDimension: gameData.activeDimension || 1,
      ...gameData
    };
    
    // Update user document with new score
    await firebase.firestore().collection('users').doc(userId).update({
      [`games.${GAME_ID}.scores`]: firebase.firestore.FieldValue.arrayUnion(scoreData),
      [`games.${GAME_ID}.lastPlayed`]: timestamp,
      [`games.${GAME_ID}.highScore`]: Math.max(score, userData?.games?.[GAME_ID]?.highScore || 0)
    });
    
    // Add to global leaderboard
    await firebase.firestore().collection('leaderboards').doc(GAME_ID).collection('scores').add({
      userId: userId,
      nickname: userNickname,
      score: score,
      timestamp: timestamp,
      gameMode: gameData.gameMode || 'default'
    });
    
    console.log('Score saved successfully');
    return true;
  } catch (error) {
    console.error('Error saving score:', error);
    return false;
  }
}

// Load leaderboard data
async function loadLeaderboard(limit = 10) {
  try {
    const leaderboardSnapshot = await firebase.firestore()
      .collection('leaderboards')
      .doc(GAME_ID)
      .collection('scores')
      .orderBy('score', 'desc')
      .limit(limit)
      .get();
    
    const leaderboardData = [];
    leaderboardSnapshot.forEach(doc => {
      const data = doc.data();
      leaderboardData.push({
        nickname: data.nickname || 'Anonymous',
        score: data.score,
        isCurrentUser: data.userId === userId
      });
    });
    
    displayLeaderboard(leaderboardData);
    return leaderboardData;
  } catch (error) {
    console.error('Error loading leaderboard:', error);
    return [];
  }
}

// Display leaderboard in the UI
function displayLeaderboard(scores) {
  const leaderboardList = document.getElementById('leaderboard-list');
  
  if (!leaderboardList) return;
  
  leaderboardList.innerHTML = '';
  
  if (scores.length === 0) {
    leaderboardList.innerHTML = '<li>No scores yet!</li>';
    return;
  }
  
  scores.forEach((entry, index) => {
    const scoreItem = document.createElement('li');
    scoreItem.textContent = `${entry.nickname}: ${entry.score}`;
    
    if (entry.isCurrentUser) {
      scoreItem.style.fontWeight = 'bold';
      scoreItem.style.color = '#FFD700'; // Gold color for user's score
    }
    
    leaderboardList.appendChild(scoreItem);
  });
}

// Game Over Functions
function showGameOverModal(score, timePlayed) {
  // Create the game over modal if it doesn't exist
  if (!document.getElementById('gameOverModal')) {
    createGameOverModal();
  }
  
  // Update the game over modal with score information
  document.getElementById('finalScore').textContent = score;
  document.getElementById('timePlayed').textContent = Math.floor(timePlayed / 1000);
  
const segment = determineSegment(timePlayed);
firebase.firestore()
  .collection("leaderboards")
  .where("segment", "==", segment)
  .orderBy("score", "desc")
  .limit(10)
  .get()
  .then(snapshot => {
    const topScoresList = document.getElementById('topScoresList');
    topScoresList.innerHTML = '';
    if (snapshot.empty) {
      topScoresList.innerHTML = '<li>No scores yet!</li>';
      return;
    }
    snapshot.forEach(doc => {
      const data = doc.data();
      const li = document.createElement('li');
      li.textContent = `${data.nickname || "Anonymous"}: ${data.score}`;
      if (data.nickname === userNickname) {
        li.style.fontWeight = 'bold';
        li.style.color = '#FFD700';
      }
      topScoresList.appendChild(li);
    });
    
    document.getElementById('gameOverModal').style.display = 'block';
  })
  .catch(err => {
    console.error("Error loading segment leaderboard:", err);
  });
  
  // Save the score if logged in
  if (isLoggedIn) {
    saveScore(score, {
      dimensions: window.totalDimensions || 1,
      activeDimension: window.activeDimension || 1,
      timePlayed: timePlayed
    });
  }
}

function closeGameOverModal() {
  const gameOverModal = document.getElementById('gameOverModal');
  if (gameOverModal) {
    gameOverModal.style.display = 'none';
  }
}

 function determineSegment(timePlayedMs) {
  const seconds = timePlayedMs / 1000;
  if (seconds < 120) return 'flash1min';
  if (seconds < 300) return 'sprint2min';
  if (seconds < 600) return 'casual5min';
  if (seconds < 1200) return 'endurance10min';
  return 'marathon20min';
}

function createGameOverModal() {
  const modal = document.createElement('div');
  modal.id = 'gameOverModal';
  modal.style.display = 'none';
  modal.style.position = 'fixed';
  modal.style.top = '0';
  modal.style.left = '0';
  modal.style.width = '100%';
  modal.style.height = '100%';
  modal.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
  modal.style.zIndex = '1000';
  
  modal.innerHTML = `
    <div style="position: relative; background-color: #fff; margin: 10% auto; padding: 20px; width: 80%; max-width: 500px; border-radius: 5px; text-align: center;">
      <span style="position: absolute; top: 10px; right: 10px; font-size: 20px; cursor: pointer;" onclick="window.GameFirebase.closeGameOverModal()">&times;</span>
      <h2>Game Over</h2>
      <p>Your score: <span id="finalScore">0</span></p>
      <p>Time played: <span id="timePlayed">0</span> seconds</p>
      <div id="gameOverLeaderboard">
        <h3>Top Scores</h3>
        <ol id="topScoresList"></ol>
      </div>
      <button onclick="resetGame()">Play Again</button>
    </div>
  `;
  
  document.body.appendChild(modal);
}

// Export functions to make them available to the main game
window.GameFirebase = {
  saveScore,
  loadLeaderboard,
  showGameOverModal,  // Add this line
  closeGameOverModal, // Add this line
  isLoggedIn: () => isLoggedIn,
  getUserId: () => userId,
  getUserNickname: () => userNickname
};
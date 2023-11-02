import { Animation } from "./animation.js";
import { PollUser } from "./polluser.js";
import { PollManager } from "./pollmanager.js";
import { PollData } from "./polldata.js";
let url = "https://thejusunny.github.io/DodoPoll/";
let deviceID = localStorage.getItem('deviceID');
let currentUser = new PollUser()
const minSplashTime = 3;
let loadingCompleted = false;
const startTime = performance.now();

const buttonclickAudioPlayer = document.getElementById('button-audio');
const loadingAudioPlayer = document.getElementById('loading-audio');
const audioPlayers = new Array();
audioPlayers.push(buttonclickAudioPlayer);
audioPlayers.push(loadingAudioPlayer);
audioPlayers.forEach(player => {
  player.volume = 0.4;
  player.muted = false;
});

document.addEventListener('visibilitychange', ()=>{
  if(document.hidden)
  {
    audioPlayers.forEach(player => {
      player.muted = true;
    });
  }
  else
  {
    audioPlayers.forEach(player => {
      player.muted = false;
    });
  }
});

const splashInterval = setInterval(()=>{
  const time = performance.now();
  if((time-startTime)/1000>minSplashTime && loadingCompleted)
  {
    clearInterval(splashInterval);
    pollEntry();
  }
},100);
const StartInstruction =
{
  NewUser:'NewUser',
  OldUser:'OldUser'
}
let startInstruction = null;
if(!deviceID)
{ 
    deviceID = uuid.v4();
    localStorage.setItem('deviceID', deviceID);
}

function getLocalUserData()
{
  return {
    email: deviceID+'@guest.com',
    userName: "guest"+deviceID.substring(0,5)
  };
}
let cachedUserData;
let pollData;
function cacheUserDataFromApp(data)
{
  const parsedData = data;
  //const parsedData = JSON.parse(data);
  cachedUserData = parsedData;
  getPollInformation();
}
const splashDiv = document.getElementById('div-splash-poll');
loadSplashScreen();
function loadSplashScreen()
 {
    const lottieContainer = document.getElementById('div-lottiebig-poll');
    const lottierLoaderContainer = document.getElementById('div-lottieloader-poll');
    const animationConfig1 = {
    container: lottieContainer,
    renderer: 'svg', // You can choose 'svg', 'canvas', or 'html'
    loop: true, // Set to true if you want the animation to loop
    autoplay: true, // Set to true if you want the animation to play automatically
    path: './animations/wolf.json', // Replace with the path to your Lottie animation JSON file
    };
    const animationConfig2 = {
      container: lottierLoaderContainer,
      renderer: 'svg', // You can choose 'svg', 'canvas', or 'html'
      loop: true, // Set to true if you want the animation to loop
      autoplay: true, // Set to true if you want the animation to play automatically
      path: './animations/loading.json', // Replace with the path to your Lottie animation JSON file
      };
    const animation1 = lottie.loadAnimation(animationConfig1);
    const animation2 = lottie.loadAnimation(animationConfig2);
    /* Start the application after user data is cached locally or from flutter app */
    //cacheUserDataFromApp({email:'Athul@example.com', userName:'Athul'});
    cacheUserDataFromApp(getLocalUserData());
 }
 const daysLabel = document.getElementById('l-days-poll');
const hoursLabel = document.getElementById('l-hours-poll');
const minutesLabel = document.getElementById('l-minutes-poll');
const pollEndDiv = document.getElementById('div-quizend-poll');
const millisecondsInSecond = 1000;
const millisecondsInMinute = 60 * millisecondsInSecond;
const millisecondsInHour = 60 * millisecondsInMinute;
const millisecondsInDay = 24 * millisecondsInHour;
let remainingTime = null;
function showRemainingTime()
{
  const localDate = new Date();
  const utcDate = new Date(localDate.toISOString());
  const endDate = new Date(pollData.endDate);
  const timeDifference = endDate - utcDate; 
  
  const days = Math.max( Math.floor(timeDifference / millisecondsInDay),0);
  const hours = Math.max( Math.floor((timeDifference % millisecondsInDay) / millisecondsInHour),0);
  const minutes = Math.max( Math.floor((timeDifference % millisecondsInHour) / millisecondsInMinute),0);
  const seconds = Math.max( Math.floor((timeDifference % millisecondsInMinute) / millisecondsInSecond),0);
  remainingTime = 
  {
    days: days,
    hours: hours,
    minutes: minutes,
    seconds: seconds
  }
  daysLabel.textContent = remainingTime.days.toString();
  hoursLabel.textContent = remainingTime.hours.toString();
  minutesLabel.textContent = remainingTime.minutes.toString();
  console.log(hasPollExpired());
}
function hasPollExpired()
{
  return (remainingTime.days<=0&& remainingTime.hours<=0&& remainingTime.minutes<=0);
}

  //*******Call this function from flutter webview widget********

async function getPollInformation()
{
  if(!window.location.href.includes('index.html'))
  {
    url = window.location.href;
    console.log("Using currentPage URL");
  }
  else
    console.log("Using default URL"+ url);
  currentUser.quizId = url;
  const getPollEndPoint = `https://zgmb05jg6e.execute-api.ap-southeast-1.amazonaws.com/getPoll?url=${url}`;
  fetch(getPollEndPoint,
    {
      method:'GET',
      mode: 'cors',
      headers: {
        'content-Type': 'application/json',
      },
    }).then(resposne=>{
      if(!resposne.ok)
      {
        throw new Error('Network response was not ok');
      }
      return resposne.json();
    }).then(data=>{
      
      pollData = new PollData(data.poll);
      showRemainingTime();
      console.log(data );
      checkForUser();
      currentUser.email = cachedUserData?.email;
      currentUser.userName = cachedUserData?.userName;
      currentUser.pollName = pollData.pollName;

    });
}
const getUserEndPoint = "https://zgmb05jg6e.execute-api.ap-southeast-1.amazonaws.com/getUser";
const getPollUserEndPoint = "https://zgmb05jg6e.execute-api.ap-southeast-1.amazonaws.com/getPollUser";
const getAllPollUsersEndPoint = "https://zgmb05jg6e.execute-api.ap-southeast-1.amazonaws.com/getPollUsers";
const deleteUserEndPoint = "https://zgmb05jg6e.execute-api.ap-southeast-1.amazonaws.com/deleteUser";
const createUserEndPoint = "https://zgmb05jg6e.execute-api.ap-southeast-1.amazonaws.com/createUser";
const upsertStatsEndPoint = "https://zgmb05jg6e.execute-api.ap-southeast-1.amazonaws.com/upsertPollStats";
let  pollManager;
async function checkForUser()
  {
    const localUser = getLocalUserData();
    //Local user signed in again, or without loggin in
    if(cachedUserData.email == localUser.email)
    {
      await createUser(cachedUserData);
      console.log("Created a local user: "+ cachedUserData.email);
      fetchAllPollUsers();
      return;
    }
    //Check if the new email user exist
    const endPoint = `${getUserEndPoint}?email=${cachedUserData.email}`;
    fetch(endPoint,{
      method: 'GET',
      mode:'cors',
    }).then(response=>{
      if(!response.ok)
      throw new Error("Response"+ response.statusText);
      return response.json();
    }).then(data=>{
      const user = data.user;
      //If the user doesn't exist check if does a guest user account exist 
      if(!user)
      {
        const localUserEndPoint = `${getUserEndPoint}?email=${localUser.email}`;
        fetch(localUserEndPoint,{
          method: 'GET',
          mode:'cors',
          headers :{
            'Content-Type':'Application/json'
          } 
    
        }).then(response=>{
          if(!response.ok)
          throw new error("Response"+ response.statusText);
          return response.json();
        }).then(async data=>{
          const localUser = data.user;
          //if local user exist then update local user.email and userName to the new username and push that to server and delete local user
          if(localUser)
          {
            const oldEmail = localUser.email;
            localUser.email = cachedUserData.email;
            localUser.userName = cachedUserData.userName;
            deleteUser(oldEmail);
            await createUser(localUser);
            fetchAllPollUsers();
          }
          else
          {
            await createUser(cachedUserData); // First time logged in user
            fetchAllPollUsers();
          }

        })
        //createUser(data);
      }
      else //User exists, don't do anything for now
      {
        console.log("Found");
        fetchAllPollUsers();
      }
    });
  }
  let currentPollUsers = new Array();
  async function fetchAllPollUsers()
  {
    const endPoint = `${getAllPollUsersEndPoint}?pollName=${pollData.pollName}`;
    fetch(endPoint,
      {
        method:'GET',
        mode:'cors',
        headers:{
          'Content-Type':'application/json',
        }
      }).then(response=>{
        if(!response.ok)
        {
          throw new Error('Network response was not ok');
        }
        return response.json();
      }).then(data=>{
        const rawUsers = data.users;   
        rawUsers.forEach(user => {
          currentPollUsers.push({
            email: user.email, userName: user.userName, choiceNo: Number( user.pollStats[0].choiceNo), choiceName: user.pollStats[0].choiceName
          })
        }); 
          //pollManager = new PollManager(currentPollUsers);
          console.log(currentPollUsers);
          checkForUserPresence();
          loadingCompleted  = true;
          //startPoll();
        });
  }
  const loadingDiv = document.getElementById("div-loading-poll");
  function checkForUserPresence()
  {
    const index = currentPollUsers.findIndex((user)=> user.email == currentUser.email);
    if(hasPollExpired())
    {
      loadingDiv.style.display = 'none';
      pollEndDiv.style.display= 'flex';
      return;
    }
    if(index<0)
    {
      console.log("New user");
      updatePollUI();
      startInstruction = StartInstruction.NewUser;
      //startPoll();
    }
    else
    {
      
      const user = currentPollUsers[index];
      currentUser.choiceNo = user.choiceNo;
      currentUser.choiceName = user.choiceName;
      updatePollUI();
      startInstruction = StartInstruction.OldUser;
      
      
    }
  }
  function pollEntry()
  {
    if(startInstruction == StartInstruction.NewUser)
    {
      startPoll();
    }
    else if(startInstruction == StartInstruction.OldUser)
    {
      if(isAGuestUser())
      {
        console.log("Existing Guest User");
        showDisabledPollPage(false);
      }
      else
      {
        console.log("Existing Signed In User");
        showDisabledPollPage(true);
      }
    }
  }
  function savePollStrengthLocally(pollStrength)
  {
    localStorage.setItem('strength1', pollStrength.poll1);
    localStorage.setItem('strength2', pollStrength.poll2);
  }
  function getLocalPollStrength()
  {
    return {
      poll1: localStorage.getItem('strength1'),
      poll2: localStorage.getItem('strength2'),
    };
  }
  function showDisabledPollPage(realTime)
  {
  
    splashDiv.style.display = 'none';
    pollManager = new PollManager(currentPollUsers);
    if(!realTime)
    {
      pollManager.strength1 = getLocalPollStrength().poll1;
      pollManager.strength2 = getLocalPollStrength().poll2;
      const signInPrompt = document.getElementById("div-siginprompt-poll");
      signInPrompt.style.display ='flex'
    }
    loadingAudioPlayer.play();
    animatePollStats(currentUser.choiceNo);
  }
  function isAGuestUser()
  {
    return currentUser.email == getLocalUserData().email;
  }
  function startPoll()
  {
    splashDiv.style.display = 'none';
  }
  function deleteUser(email)
  {
    fetch(deleteUserEndPoint,{
      method:'DELETE',
      mode:'cors',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        "email": email,
      })

    }).then(response=>{
      if(!response.ok)
      throw new Error('Network response was not ok');
      return response.json();
    }).then(data=>{
      console.log(data);
    })
  }
  async function createUser(data) {
    if(data!= null && data.email!=null)
    {
      try{
        const response = await fetch(createUserEndPoint,{
          method:'POST',
          mode:'cors',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            "email": data.email,
            "userName": data.userName,
            "quizStats": data.quizStats || null,
            "pollStats": data.pollStats || null,
          })
    
        });
        
        if(!response.ok)
          throw new Error('Network response was not ok');
        const responseData = await response.json();
        console.log(responseData);
      } 
      catch(err)
      {
        console.log(err.message);
      } 
     
    }
  }
const pollUIElements = new Map([
    ["coin-txt", "l-coin-poll"],
    ["xp-txt", "l-xp-poll"],
    ["mainimage-img", "img-main-poll"],
    ["fill1-img", "img-meterfill1-poll"],
    ["fill2-img", "img-meterfill2-poll"],
    ["question-txt", "l-question-poll"],
    ["progress1-txt", "l-progress1-poll"],
    ["progress2-txt", "l-progress2-poll"],
    ["knob1-div", "div-knob1-poll"],
    ["knob2-div", "div-knob2-poll"],
    ["image-img", "img-main-poll"],
    ["knob1-img", "img-knob1-poll"],
    ["knob2-img", "img-knob2-poll"],
    ["option1-btn", "btn-choice1-poll"],
    ["option2-btn", "btn-choice2-poll"],
    ["option1-txt", "l-choice1-poll"],
    ["option2-txt", "l-choice2-poll"],
    ["options-div", "div-options-poll"],
    ["correctstats-txt", "l-correct-summary"],
    ["wrongstats-txt", "l-wrong-summary"],
    ["coinstats-txt", "l-coins-summary"],
    ["xpstats-txt", "l-xp-summary"],
    ["playerscore-txt", "l-yourscore-summary"],
    ["clock-img", "img-clock-quiz"],    
  ]);
const fillImage1 = getElement('fill1-img');
const knobdiv1 = getElement('knob1-div');
const fillImage2 = getElement('fill2-img');
const knobdiv2 = getElement('knob2-div');
const progresstxt1 = getElement('progress1-txt');
const progresstxt2 =getElement('progress2-txt');
const questionText = getElement('question-txt');
const optionText1 = getElement('option1-txt');
const optionText2 = getElement('option2-txt');
const coinText = getElement('coin-txt');
const rewardText = getElement('xp-txt');
const image = getElement('mainimage-img');
const knobImage1 = getElement('knob1-img');
const knobImage2 = getElement('knob2-img');

const fillMeterAnimation1 = new Animation( fillImage1);
const knobAnimation1 = new Animation( knobdiv1, progresstxt1);
const fillMeterAnimation2 = new Animation( fillImage2);
const knobAnimation2 = new Animation( knobdiv2,progresstxt2);
const meterDuration = 3.2;
const btn1 = getElement("option1-btn");
btn1.addEventListener("click", () => {
  OptionSelected(1);
});

const btn2 = getElement("option2-btn");
btn2.addEventListener("click", () => {
  OptionSelected(2);
});
let audioEnabled = true;
const audioButton = document.getElementById('btn-audiotoggle-quiz');
const audioImage = document.getElementById('img-audio-quiz');
audioButton.addEventListener('click',()=>{
  audioEnabled = !audioEnabled;
  const volume = audioEnabled?0.4:0;
  audioPlayers.forEach(audioPlayer => {
    audioPlayer.volume = volume;
  });
  audioImage.src = audioEnabled? "./assets/soundon.png": "./assets/soundoff.png";
});

function updatePollUI()
{
 
    questionText.textContent = pollData.question;
    optionText1.textContent = pollData.options[0];
    optionText2.textContent = pollData.options[1];
    coinText.textContent =  pollData.rewards[0];
    rewardText.textContent = pollData.rewards[1];
    image.src = pollData.image;
    knobImage1.src = pollData.knobs[0];
    knobImage2.src = pollData.knobs[1];
}
function OptionSelected(optionNo)
{
    const newUser ={
      name: currentUser.userName,
      choiceNo: Number(optionNo),
      choiceName: pollData.getPollChoice(optionNo)
    }
    currentUser.choiceName = newUser.choiceName;
    currentUser.choiceNo = newUser.choiceNo;
    currentPollUsers.push(newUser);
    pollManager = new PollManager(currentPollUsers);
    
    buttonclickAudioPlayer.play();
    setTimeout(()=>{
      loadingAudioPlayer.play();
      animatePollStats(optionNo);
      sendPollstatsToServer(currentUser);
    },500);
   
}
function animatePollStats(optionNo)
{
  const button = optionNo==1? btn1: btn2;
  const bgDiv = button.querySelector("div");
  bgDiv.style.backgroundColor ='green';
  const pollStrength = pollManager.getPollStrength();
  savePollStrengthLocally(pollStrength);
  if(optionNo>1)
    {
        knobImage2.style.border = '3px solid blue';
    }
    else
        knobImage1.style.border = '3px solid blue';

    if(pollStrength.poll1>pollStrength.poll2)
    {
        const knob1 = new Animation( knobdiv1);
        knob1.animateWidth(meterDuration,{start:100, end:125});
    }
    else
    {
        const knob2 = new Animation( knobdiv2);
        knob2.animateWidth(meterDuration,{start:100, end:125});
    }

    const optionsDiv = getElement('options-div');
    optionsDiv.style.pointerEvents ='none'; 
        //if p1>p2 start scale animation for p1
    animateMeters();
}
function sendPollstatsToServer(currentUser)
{
  const finalPayload ={
    pollName: currentUser.pollName,
    url: url,
    choiceNo: currentUser.choiceNo,
    choiceName: currentUser.choiceName,
    email: currentUser.email
  }
  console.log(finalPayload);
  try
  {
  fetch(upsertStatsEndPoint, {
    method: 'PUT',
    headers:{
      'Content-Type': "Application/json",
    },
    body: JSON.stringify(finalPayload)

  }).then(response=>{
    if(!response.ok)
    throw new Error(" Unable to update, Response not Okay");
    console.log("Update succesful"+ response);
  });
}
catch(err)
{
  console.error(err);
}
}

//animateMeters();

function animateMeters()
{
    const pollStrength = pollManager.getPollStrength();
    fillMeterAnimation1.animateHeight(meterDuration, {start:0,end:Number(pollStrength.poll1)});
    knobAnimation1.animateBottomPivot(meterDuration,  {start:0,end:Number(pollStrength.poll1)});

    fillMeterAnimation2.animateHeight(meterDuration, {start:0,end:Number(pollStrength.poll2)});
    knobAnimation2.animateBottomPivot(meterDuration,  {start:0,end:Number( pollStrength.poll2)});
}
function getElement(name)
{
    return   document.getElementById( pollUIElements.get(name));
}


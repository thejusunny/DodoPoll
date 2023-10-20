
class animation {
    constructor(obj, textObj = null) {
      this.duration = null;
      this.startTime = null;
      this.obj = obj;
      this.units = null;
      this.changeHeight = this.changeHeight.bind(this);
      this.changeBottomPivot = this.changeBottomPivot.bind(this);
      this.changeWidth = this.changeWidth.bind(this);
      this.calculateValue = this.calculateValue.bind(this);
      this.calculateColor = this.calculateColor.bind(this);
      this.changeColor = this.changeColor.bind(this);
      this.changeFontSize = this.changeFontSize.bind(this);
      this.changeOpacity = this.changeOpacity.bind(this);
      this.changeRotation = this.changeRotation.bind(this);
      this.pause = this.pause.bind(this);
      this.play = this.play.bind(this);
      this.offset = { start: 0, end: 0 };
      this.textObj = textObj;
      this.callback = null;
      this.isPlaying = true;
      this.currentLoop = 0;
      this.loopingData = null;
      this.progress = 0;
      this.pong = false;
    }
    changeHeight(time) {
      if (!this.isPlaying) return;
      const value = this.calculateValue(time);
      this.obj.style.height = value.prefixedValue;
      if (this.textObj) {
        this.textObj.textContent = value.orginalValue.toFixed(1) + this.units;
      }
      if (this.offset.end > this.offset.start) {
        if (value.orginalValue < this.offset.end) {
          requestAnimationFrame(this.changeHeight);
        } else if (this.callback != null) this.callback();
      } else {
        if (value.orginalValue > this.offset.end) {
          requestAnimationFrame(this.changeHeight);
        } else if (this.callback != null) this.callback();
      }
    }
    changeBottomPivot(time) {
      if (!this.isPlaying) return;
      const value = this.calculateValue(time);
      this.obj.style.bottom = value.prefixedValue;
      if (this.textObj) {
        this.textObj.textContent = value.orginalValue.toFixed(0) + this.units;
      }
      if (value.orginalValue < this.offset.end) {
        requestAnimationFrame(this.changeBottomPivot);
      }
    }
    changeWidth(time) {
      if (!this.isPlaying) return;
      const value = this.calculateValue(time);
      this.obj.style.width = value.prefixedValue;
      if (this.textObj) {
        this.textObj.textContent = value.orginalValue.toFixed(1) + this.units;
      }
      if (this.offset.end > this.offset.start) {
        if (value.orginalValue < this.offset.end) {
          requestAnimationFrame(this.changeWidth);
        }
      } else {
        if (value.orginalValue > this.offset.end) {
          console.log(value.orginalValue);
          requestAnimationFrame(this.changeWidth);
        }
      }
    }
    changeColor(time) {
      if (!this.isPlaying) return;
      const value = this.calculateColor(time);
      this.obj.style.backgroundColor = `#${value.color.toString(16)}`;
  
      if (this.loopingData != null) {
        //console.log("Not Null");
        if (this.loopingData.infinite) {
          if (value.progress >= 1) {
            this.startTime = time;
          }
          requestAnimationFrame(this.changeColor);
        } else {
          //console.log("Loops"+value.progress);
          if (value.progress >= 1) {
            if (this.currentLoop < this.loopingData.loops) {
              this.startTime = time;
              requestAnimationFrame(this.changeColor);
              this.currentLoop++;
            } else {
              this.isPlaying = false;
              console.log("Last frame" + this.obj.style.backgroundColor);
              this.obj.style.backgroundColor = hex0xToRgb(this.offset.end);
              console.log(hex0xToRgb(this.offset.end));
              if (this.callback != null) this.callback();
            }
          } else {
            requestAnimationFrame(this.changeColor);
          }
        }
      } else {
        if (value.progress < 1) {
          requestAnimationFrame(this.changeColor);
        } else {
          this.isPlaying = false;
          if (this.callback != null) this.callback();
        }
      }
    }
    changeFontSize(time) {
      if (!this.isPlaying) return;
      const value = this.calculateValue(time);
      this.obj.style.fontSize = value.prefixedValue;
      if (this.textObj) {
        this.textObj.textContent = value.orginalValue.toFixed(1) + this.units;
      }
      if (this.offset.end > this.offset.start) {
        if (value.orginalValue < this.offset.end) {
          requestAnimationFrame(this.changeFontSize);
        }
      } else {
        if (value.orginalValue > this.offset.end) {
          
          requestAnimationFrame(this.changeFontSize);
        }
      }
    }
    changeOpacity(time) {
      if (!this.isPlaying) return;
      const value = this.calculateValue(time);
      this.obj.style.opacity = value.prefixedValue;
      if (this.textObj) {
        this.textObj.textContent = value.orginalValue.toFixed(1) + this.units;
      }
      if (this.offset.end > this.offset.start) {
        if (value.orginalValue < this.offset.end) {
          requestAnimationFrame(this.changeOpacity);
        }
      } else {
        if (value.orginalValue > this.offset.end) {
          console.log(value.orginalValue);
          requestAnimationFrame(this.changeOpacity);
        }
      }
    }
    changeRotation(time) {
      if (!this.isPlaying) return;
      const value = this.calculateValue(time);
      const rotatedValue = value.orginalValue%360;
      console.log(this.obj.id+","+ rotatedValue);
      this.obj.style.transform = `rotate(${rotatedValue}deg)`;
  
      if (this.textObj) {
        this.textObj.textContent = value.orginalValue.toFixed(1) + this.units;
      }
     
      if (this.loopingData != null) {
        //console.log("Not Null");
        if (this.loopingData.infinite) {
          if (value.progress >= 1) {
            this.startTime = time;
            this.pong = !this.pong;
            console.log("ReversePong"+value.orginalValue);
          }
          requestAnimationFrame(this.changeRotation);
        } else {
          //console.log("Loops"+value.progress);
          if (value.progress >= 1) {
            if (this.currentLoop < this.loopingData.loops) {
              this.startTime = time;
              this.pong = !this.pong;
              requestAnimationFrame(this.changeRotation);
              this.currentLoop++;
            } else {
              this.isPlaying = false;
              if (this.callback != null) this.callback();
            }
          } else {
            requestAnimationFrame(this.changeRotation);
          }
        }
      } else {
        if (value.progress < 1) {
          requestAnimationFrame(this.changeRotation);
        } else {
          this.isPlaying = false;
          if (this.callback != null) this.callback();
        }
      }
    }
    calculateValue(time) {
      const mills = this.duration * 1000;
      if (!this.startTime) {
        this.startTime = time;
        console.log("cache"+ this.obj.id);
     
        const x = time - this.startTime;
        console.log("Progress"+ x/mills);
      }
      const elapsedTime = time - this.startTime;
      var t = elapsedTime/mills;
      var newT = t;
      if(this.pong)
      {
        newT = 1-newT;
      }
      const dir = Math.sign(this.offset.end - this.offset.start);
      const value =
        this.offset.start +
        dir *
        newT *
          Math.abs(this.offset.end - this.offset.start);
      return { orginalValue:  value,progress:t,  prefixedValue: value + this.units };
    }
    calculateColor(time) {
      const mills = this.duration * 1000;
      if (!this.startTime) {
        this.startTime = time;
      }
      const elapsedTime = time - this.startTime;
      const t = elapsedTime / mills;
      this.progress = t;
      const value = this.lerpColor(this.offset.start, this.offset.end, t);
      return { color: value, progress: t };
    }
    animateHeight(duration, offset, callback = null, units = "%") {
      this.duration = duration;
      this.offset = offset;
      this.units = units;
      this.callback = callback;
      requestAnimationFrame(this.changeHeight);
    }
    animateWidth(duration, offset, units = "%") {
      this.duration = duration;
      this.offset = offset;
      this.units = units;
      requestAnimationFrame(this.changeWidth);
    }
    animateBottomPivot(duration, offset, units = "%") {
      this.duration = duration;
      this.units = units;
      this.offset = offset;
      requestAnimationFrame(this.changeBottomPivot);
    }
    animatecolor(duration, colorOffset, loopData = null, callback = null) {
      this.duration = duration;
      this.offset = colorOffset;
      this.loopingData = loopData;
      this.loopCount = 0;
      this.callback = callback;
      requestAnimationFrame(this.changeColor);
    }
    animateFontSize(duration, offset, callback =null,units= "%")
    {
      this.duration = duration;
      this.offset = offset;
      this.callback = callback;
      this.units = units;
      requestAnimationFrame(this.changeFontSize);
    } 
    animateOpacity(duration, offset, callback =null)
    {
      this.duration = duration;
      this.offset = offset;
      this.callback = callback;
      requestAnimationFrame(this.changeOpacity);
    } 
    animateRotation(duration, offset, loopingData,callback =null)
    {
      this.duration = duration;
      this.offset = offset;
      this.callback = callback;
      this.loopingData = loopingData;
      requestAnimationFrame(this.changeRotation);
    } 
    pause() {
      this.isPlaying = false;
    }
    play() {
      this.isPlaying = true;
    }
    lerpColor(colorA, colorB, t) {
      // Ensure t is in the range [0, 1]
      t = Math.max(0, Math.min(1, t));
  
      // Extract the red, green, and blue components of colorA and colorB
      const rA = colorA >> 16;
      const gA = (colorA >> 8) & 0xff;
      const bA = colorA & 0xff;
  
      const rB = colorB >> 16;
      const gB = (colorB >> 8) & 0xff;
      const bB = colorB & 0xff;
  
      // Interpolate each component
      const r = Math.round(rA + (rB - rA) * t);
      const g = Math.round(gA + (gB - gA) * t);
      const b = Math.round(bA + (bB - bA) * t);
  
      // Combine the interpolated components into a single color value
      return (r << 16) | (g << 8) | b;
    }
  }
class poll
{
    constructor(data)
    {
        this.data = data;
        this.pollQuestion = document.getElementById("l-question-poll");
        this.option1 = document.getElementById("l-option1-poll");
        this.option2 = document.getElementById("l-option2-poll");

       
        this.mainImage = document.getElementById("img-main-poll");
        this.fillImage1 = document.getElementById("img-meterfill1-poll");
        this.knob1 = document.getElementById("div-knob1-poll");
        this.fillImage2 = document.getElementById("img-meterfill2-poll");
        this.knob2 = document.getElementById("div-knob2-poll");
        this.knob1Image = document.getElementById("img-knob1-poll");
        this.knob2Image = document.getElementById("img-knob2-poll");
       
        this.updateUI();
    }
    updateUI()
    {
        this.pollQuestion.textContent = this.data.question;
        this.option1.textContent = this.data.option1;
        this.option2.textContent = this.data.option2;
        this.mainImage.src = this.data.mainImage;
        this.knob1Image.src = this.data.icon1;
        this.knob2Image.src = this.data.icon2;
    }
    
    
}
const pollStats ={
    id:'#1',
    progress: ["45","55"]
}
class PollData
{
    constructor(mainData)
    {
        
        this.pollItem = {
            question: mainData.question[0],
            options: mainData.option[0],
            image: mainData.image[0],
            rewards: mainData.rewards[0],
            knob:mainData.knob[0],
            id:mainData.id[0],
        };
    }
    getItem()
    {
        return this.pollItem;
    }
    isValid(id)
    {
        return id==pollStats.id;
    }
}
const mockPollData = {

    id:
    [
        "#1"
    ],
    question:[
        "Who is going to be 15th prime minister of India"
    ],
    image:[
        "https://akm-img-a-in.tosshub.com/indiatoday/images/story/202303/rahul-gandhi-three_four.jpeg?VersionId=M6VpJY1Uy4UhPLxppk_JqKqWIovQV1t9"
    ],
    knob:[
        [
            "https://m.media-amazon.com/images/I/61NhcYZYawL.jpg",
            "data:image/png;base64,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",
        ]
    ],
    option:[
        [
            "Narendra Modi",
            "Rahul Ghandi",
        ]
    ],
    rewards:
    [
        ["10", "100"]
    ]
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
const pollData = new PollData(mockPollData);
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

const fillMeterAnimation1 = new animation( fillImage1);
const knobAnimation1 = new animation( knobdiv1, progresstxt1);
const fillMeterAnimation2 = new animation( fillImage2);
const knobAnimation2 = new animation( knobdiv2,progresstxt2);

const meterDuration = 3;
updateUI();
function updateUI()
{
 
    const pollItem = pollData.getItem();
    questionText.textContent = pollItem.question;
    optionText1.textContent = pollItem.options[0];
    optionText2.textContent = pollItem.options[1];
    coinText.textContent = pollItem.rewards[0];
    rewardText.textContent = pollItem.rewards[1];
    image.src = pollItem.image;
    knobImage1.src = pollItem.knob[0];
    knobImage2.src = pollItem.knob[1];
    const btn1 = getElement("option1-btn");
  btn1.addEventListener("click", () => {
    OptionSelected(1, btn1);
  });

  const btn2 = getElement("option2-btn");
  btn2.addEventListener("click", () => {
    OptionSelected(2, btn2);
  });

}
function OptionSelected(index,option)
{
    const bgDiv = option.querySelector("div");
    bgDiv.style.backgroundColor ='green';
    if(index>1)
    {
        knobImage2.style.border = '3px solid blue';
    }
    else
        knobImage1.style.border = '3px solid blue';

    if(pollStats.progress[0]>pollStats.progress[1])
    {
        const knob1 = new animation( knobdiv1);
        knob1.animateWidth(meterDuration,{start:100, end:125});
    }
    else
    {
        const knob2 = new animation( knobdiv2);
        knob2.animateWidth(meterDuration,{start:100, end:125});
    }

    const optionsDiv = getElement('options-div');
    optionsDiv.style.pointerEvents ='none'; 
        //if p1>p2 start scale animation for p1
    animateMeters();
}

//animateMeters();

function animateMeters()
{
    const n2 = Number( pollStats.progress[0][1]);
    fillMeterAnimation1.animateHeight(meterDuration, {start:0,end:Number( pollStats.progress[0])});
    knobAnimation1.animateBottomPivot(meterDuration,  {start:0,end:Number( pollStats.progress[0])});

    fillMeterAnimation2.animateHeight(meterDuration, {start:0,end:Number( pollStats.progress[1])});
    knobAnimation2.animateBottomPivot(meterDuration,  {start:0,end:Number( pollStats.progress[1])});
    // knobScaleAnimation.animateWidth(2000, {start:75, end:120 });
}
function getElement(name)
{
    return   document.getElementById( pollUIElements.get(name));
}


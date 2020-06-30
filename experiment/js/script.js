/* initialise timeline*/

var timeline=[];
var introloop=[];
var turkcode = (Math.floor(Math.random() * 899999) + 100000).toString();
var images = [
  './img/test1.jpg',
  './img/test2.jpg'
];

/* function to start the jsPsych experiment */
function startExperiment(){

  // record the turkcode in the jsPsych data
  jsPsych.data.addProperties({
    turkcode: turkcode
  });

  jsPsych.init({
    timeline: timeline,
    preload_images: images,
    on_finish: function() {
      endExperiment( jsPsych.data.get().csv(), function() { document.write('<div id="endscreen" class="endscreen" style="width:1000px"><div class="endscreen" style="text-align:center; border:0px solid; padding:10px; font-size:120%; width:800px; float:right"><p><br><br><br>All done!<br><br>Your completion code is <span id="turkcode" style="font-weight:bold;font-size:130%">' + turkcode + '</span>. To receive payment for the HIT, return to the Amazon Mechanical Turk page and enter this code. Please contact us if something goes wrong and we\'ll fix it as quickly as possible.</p></div></div>') })
    }
  });
}

/* save and finish */
function endExperiment(dataset,callback) {
  // $.post('submit',{"content": dataset}); // uncomment to post data
  console.log(dataset) // comment out to avoid console log
  setTimeout(callback,1000)
}

/* change the display property of a set of objects */
function setDisplay(theClass, theValue) {
  var i, classElements = document.getElementsByClassName(theClass);
  for (i = 0; i < classElements.length; i = i + 1) {
    classElements[i].style.display = theValue;
  }
}

/* A grossly typical way to run the instructions is to go through a series
    of small slides (implemeted as trials in jsPsych) with a minimum reading time
    enforced for each slide, such that the "continue" button doesn't appear until
    the time elapses. At the end of the instructions, there is a short quiz, and if
    the participant gets them wrong they are sent back to the beginning */

/* define the instruction block */
var instruction_block = {
  type: 'html-button-response',
  timing_post_trial: 0,
  choices: ['Click here to continue'],
  on_trial_start: function() { setTimeout(function() {setDisplay("jspsych-btn","")}, 1000)},
  is_html: true,
  timeline: [
    {stimulus: 'This is the first instruction page'},
    {stimulus: 'This is the second instuction page'}
  ]
};
introloop.push(instruction_block); // <- the setup block gets pushed to a "loop node"

/* define instruction check block */
var instructioncorrect = false;
var instruction_check = {
  type: "survey-multi-choice",
  preamble: ["<p align='center'><b>Check your knowledge before you begin!</b></p>"],
  questions: [
    {prompt: "<b>Question 1</b>: Something?", options: [" wrong"," correct_1"], required: true},
    {prompt: "<b>Question 2</b>: Something?", options: [" correct_2", " wrong", " wrong"], required: true},
    {prompt: "<b>Question 3</b>: Something?", options: [" correct_3", " wrong", " wrong"], required: true}
  ],
  on_finish: function(data) {
    if( data.responses == '{"Q0":" correct_1","Q1":" correct_2","Q2":" correct_3"}') {
      action = false;
      instructioncorrect = true;
    }
  }
}
introloop.push(instruction_check)

/* define a page for the incorrect response */
var showsplash = true;
var splash_screen = {
  type: 'html-button-response',
  timing_post_trial: 0,
  //    button_html: '<button class="jspsych-btn" style="display:none">%choice%</button>',
  choices: ['Click here to read the instructions again'],
  on_trial_start: function() {setTimeout(function() {setDisplay("jspsych-btn","")}, 500)},
  is_html: true,
  stimulus: 'Unfortunately, at least one of your answers was incorrect.'
}

/* ...but push it to a conditional node that only shows it if the response was wrong */
var conditional_splash = {
  timeline: [splash_screen],
  conditional_function: function(data) {
    return !instructioncorrect // skip if correct
  }
}
introloop.push(conditional_splash)

/* finally, add the entirety of this introductory section to a loop node ... */
var loop_node = {
  timeline: introloop,
  loop_function: function(data) {
    //var action = true;
    return !instructioncorrect // stop looping if correct
  }
}
timeline.push(loop_node) // ... and add that to the timeline

/* success trial */
var successtrial = {
  type: 'html-button-response',
  timing_post_trial: 0,
  //    button_html: '<button class="jspsych-btn" style="display:none">%choice%</button>',
  choices: ['Click here to begin the experiment'],
  on_trial_start: function() { setTimeout(function() {setDisplay("jspsych-btn","")}, 500)},
  is_html: true,
  stimulus: 'Well done!'
};
timeline.push(successtrial);

/* define the instruction block */
var experiment_block = {
  type: 'html-button-response',
  timing_post_trial: 0,
  //	    button_html: '<button class="jspsych-btn" style="display:none">%choice%</button>',
  choices: ['Click here to continue'],
  on_trial_start: function() { setTimeout(function() {setDisplay("jspsych-btn","")}, 500)},
  is_html: true,
  timeline: [
    {stimulus: function() {
      let showAndHide = function (clicked, elem, rect) {
        const outcomesA = [...Array(50)].fill(0).concat([...Array(50).fill(4)])
        const outcomesB = [...Array(100)].fill(3)

        let randomA = outcomesA[Math.floor(Math.random() * outcomesA.length)];
        let randomB = outcomesB[Math.floor(Math.random() * outcomesB.length)];

        elem == document.getElementById('outcome_r') ?
          elem.innerHTML = randomA :
          elem.innerHTML = randomB
        clicked.style.pointerEvents = 'none'
        elem.style.display = 'block';
        rect.style.fill = 'grey'
        function hide() {
          clicked.style.pointerEvents = ''
          elem.style.display = 'none'
          rect.removeAttribute("style");
          //rect.style.fill = 'black'
        }
        setTimeout(function() {hide()}, 1000)
      };
   return "<svg  width='100%' height='100%' class='problem_set' preserveAspectRatio='xMidYMid meet' >" +
      "<g class='option_l' onclick='showAndHide(this, document.getElementById('outcome_l'), document.getElementById('rect_l'))'>" +
      "<rect x=20% y=35% width='10%' height='20%' rx='20' ry='20' class='rectangle' id='rect_l' />" +
      "<text x=25% y=46% dominant-baseline='middle' text-anchor='middle' fill='red' id='outcome_l'>0</text>" +
      "</g>" +
      "<g class='option_r' onclick='showAndHide(this, document.getElementById('outcome_r'), document.getElementById('rect_r'))'>" +
      "<rect  x=70% y=35% width='10%' height='20%' rx='20' ry='20' class='rectangle' id='rect_r' />" +
      "<text x='75%' y='46%' fill='red' dominant-baseline='middle' text-anchor='middle' id='outcome_r'>4</text>" +
      "</g>" +
      "<g class='choice' id='choice_button' onclick='hideAll()'>" +
      "<rect x=45% y=50% width='10%' height='15%'  rx='20' ry='20' class='rectangle center'/>" +
      "<text x='50%' y='59%' fill='red' dominant-baseline='middle' text-anchor='middle'>choice</text>"     +
      "</g>" +
    "</svg>"
    }},
    {stimulus: 'This is the second experimental trial'}
  ]
};
timeline.push(experiment_block);

/* start by running the "welcome" */
welcome.run();

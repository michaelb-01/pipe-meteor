import {Component, Renderer, ViewChild, OnInit, AfterViewInit} from '@angular/core';
import { ActivatedRoute, ROUTER_DIRECTIVES } from '@angular/router';

import { Versions } from '../../../collections/versions';

import { MeteorComponent } from 'angular2-meteor';

import { Tracker } from 'meteor/tracker';

import { VersionService } from '../version/version.service';

import { FirstLetterPipe } from '../shared/first-letter.pipe';

import '../shared/js/numeric-1.2.6.min.js';


@Component({
  templateUrl: "/client/imports/review/review.html",
  directives: [
    ROUTER_DIRECTIVES
  ],
  providers: [
    VersionService
  ],
  host: {
    '(keydown)': 'keydown($event)'
  },
  pipes: [ FirstLetterPipe ]
})

export class ReviewComponent extends MeteorComponent {

  versionId: string;
  version: Version;
  subscription: any;
  data: string;

  comment:string = '';
  comments:string = [];

  review = [];

  @ViewChild('video') video; 

  constructor(private route: ActivatedRoute,
              private _versionService: VersionService,
              private renderer: Renderer ) {
    super();
  }

  ngOnInit() {

    this.route.params.subscribe((params) => {
      this.versionId = params['versionId'];

      this._versionService.getVersionById(this.versionId);

      this.subscription = this._versionService.version$.subscribe(version => {
        if (!version) return;   // don't forget this, because you may subscribe the data before you got data from the server

        this.version = version;

        // do other things
      });
    });

    this.renderer.listenGlobal('document', 'keydown', (event) => {
      this.keydown(event);
    });
  }

  keydown(e) {
    switch(e.which) {
      case 32:   // space
        if (document.getElementById("commentInput") !== document.activeElement ||
          document.getElementById("commentInput").value == '') {
            e.preventDefault();
            this.playPause();
        }

      default: return; // exit this handler for other keys
    }
    e.preventDefault(); // prevent the default action (scroll / move caret)
  } 

  ngAfterViewInit() {
    this.initVideo();

    //this.video.nativeElement.onloadstart = this.initCanvas();
    // couldn't get the correct dimensions due to resizing
    // so added a timeout callback
    setTimeout(() => { // 3            
      this.initCanvas();
    }, 1000); 
  }

  ///////////////// VIDEO ////////////////////
  time: number;
  frame: number = 1;
  fps = 25.0;

  displayReview = 1;
  emptyCanvas = 1;

  initVideo() {
    console.log('add seeking function to video');

    this.videoOnSeeking = this.renderer.listen(this.video.nativeElement, 'seeking', (event) => {
      this.videoSeeking();
    });
  }

  videoSeeking() {
    //console.log('video seeking');
    this.clearCanvas();
    this.redrawNewStrokes();
  }

  updateFrame() {
    this.time = this.video.nativeElement.currentTime;
    this.frame = Math.round(this.time * this.fps);  // frame rate of 25 fps

    globalID = requestAnimationFrame(()=> {
      this.updateFrame();
    });

    var idx = this.oldFrames.indexOf(this.frame);

    if (idx > -1) {
      if (this.displayReview == 1) {

        console.log('draw strokes');

        for (var i = 0; i < this.version.review[idx].strokes.length; i++) {

          var ts = [];

          var length = this.version.review[idx].strokes[i].pts.length-1;

          for (var j = 0; j <= length; j++) {
            ts.push((1.0/length)*j);
          }

          console.log(ts);

          var ss = numeric.spline(ts,this.version.review[idx].strokes[i].pts);
          //this.draw_spline(ss, "F00");

          //var ss2 = this.simplify_spline(ss);
          this.draw_spline(ss, "#F00");
        }

        this.displayReview = 0;
        this.emptyCanvas = 0;
      }
    }
    else {
      //console.log('reset displayReview back to 1');
      this.displayReview = 1;

      if (this.emptyCanvas == 0) {
        this.clearCanvas();
        this.emptyCanvas = 1;
      }
    }
  }

  goToNextNote() {
    var lowest = 99999;
    var seekFrame = -1;

    for (var i = 0; i < this.oldFrames.length; i++) {
      var diff = this.oldFrames[i] - this.frame;
      if (diff < lowest && diff > 0) {
        lowest = diff;
        seekFrame = this.oldFrames[i];
      } 
    }

    if (seekFrame > -1) {
      this.video.nativeElement.currentTime = seekFrame / 25.0;
      this.clearCanvas();
      this.displayReview = 1;
    }
  }

  goToPreviousNote() {
    var highest = -99999;
    var seekFrame = -1;

    for (var i = 0; i < this.oldFrames.length; i++) {
      var diff = this.oldFrames[i] - this.frame;
      if (diff > highest && diff < 0) {
        highest = diff;
        seekFrame = this.oldFrames[i];
      } 
    }

    if (seekFrame > -1) {
      this.video.nativeElement.currentTime = seekFrame / 25.0;
      this.clearCanvas();
      this.displayReview = 1;
    }
  }

  submitComment() { 
    console.log('comment:');

    var obj = {
        "frame": this.frame,
        "comments": [
          {
            "user":"Mike Battcock", 
            "text":this.comment,
            "strokes":this.storedStrokes
          }
        ]
    };

    var idx = -1;
    
    for (var i = 0; i < this.review.length; i++) {
      console.log(this.review[i]);

      if (this.review[i].frame == this.frame) {
        idx = i;
        console.log('review found for this frame');
      }
    }

    var obj2 = {
      "user":"Mike Battcock", 
      "text":this.comment,
      "strokes":this.xys
    };

    if (idx > -1) {
      this.review[idx].comments.push(obj2);
    }
    else {
      this.review.push(obj);
    }

    //console.log(obj);
    //this.comments.push(obj);
    
    this.comment = '';

    console.log(this.review);
  }

  playPause() {
    if (this.video.nativeElement.paused) {
      this.video.nativeElement.play(); 
      
      //globalID = requestAnimationFrame(updateFrame);
    }
    else {
      this.video.nativeElement.pause();
    }
  }


  //////////////// CANVAS ////////////////////
  @ViewChild('canvasEl') canvas; 
  ctx: CanvasRenderingContext2D;
  mouse: {};

  points = [];  // to hold canvas mouse points
  xys = [];

  mouseMoveFunc: Function;  // event listener for mouse move
  oldPos: {};
  reviews = [];

  ox;
  oy;
  nx;
  ny;

  strokeColour = "F00";
  strokeWidth = 5;

  td = 0;
  dds = [ 0 ];

  storedStrokes = [];
  newStrokes = [];

  newNotes = [];

  oldFrames = [];
  newFrames = [];

  initCanvas() {
    //console.log(this.canvasEl);
    //let canvas = this.canvasEl.nativeElement;
    this.ctx = this.canvas.nativeElement.getContext("2d");

    // initialise canvas variables
    this.ctx.lineWidth = this.strokeWidth;
    this.ctx.lineJoin = 'round';
    this.ctx.lineCap = 'round';
    //this.ctx.strokeStyle = 'hsl(100, 100%, 50%)';

    this.canvas.nativeElement.width = this.video.nativeElement.clientWidth;
    // allow for timeline on video
    this.canvas.nativeElement.height = this.video.nativeElement.clientHeight - 32;

    //this.testRectangle();
    this.video.nativeElement.play();

    if(this.version.hasOwnProperty('review')){
      //this.storedStrokes.push(this.version.notes);
      //this.drawOldStrokes();
      console.log('found notes for this version');

      for (var i = 0; i < this.version.review.length; i++) {
        this.oldFrames.push(this.version.review[i].frame);
      }

      console.log('found reviews for the following frames: ' + this.oldFrames);
    }

    this.updateFrame(); // update video frame
  }

  canvasMouseDown(e) {
    if (this.video.nativeElement.paused == 0) {
      this.video.nativeElement.pause();
    }

    // store mouse position
    //this.mouse = this.getMousePos(this.canvas,e);
    //this.points2 = [ [this.mouse.x,this.mouse.y] ]; 
    //this.oldPos = {x:this.mouse.x, y:this.mouse.y};

    var mouse = this.getMousePos(this.canvas, e);
    this.td = 0;
    this.ox = mouse[0];
    this.oy = mouse[1];
    this.xys = [ [this.ox, this.oy ]];
    this.dds = [ 0 ];

    // add event listener for mousemove
    this.mouseMoveFunc = this.renderer.listen(this.canvas.nativeElement, 'mousemove', (event) => {
      this.onPaint2(event);
    });
  }

  onPaint(e) {
    this.mouse = this.getMousePos(this.canvas,e);

    this.ctx.lineTo(this.mouse.x, this.mouse.y);
    this.ctx.stroke();
  };

  drawOldStrokes () {
    for (var i = 0; i < this.storedStrokes.length; i++) {
      var ts = [];

      var length = this.storedStrokes[i].length-1;

      for (var j = 0; j <= length; j++) {
        ts.push((1.0/length)*j);
      }

      //console.log(ts);

      var ss = numeric.spline(ts,this.storedStrokes[i]);
      //this.draw_spline(ss, "F00");

      //var ss2 = this.simplify_spline(ss);
      this.draw_spline(ss, "#F00");
    }
  }

  draw_marker(x, y, r) {
    this.ctx.beginPath();
    this.ctx.arc(x, y, r, 0, Math.PI*2);
    this.ctx.closePath();
    this.ctx.fillStyle = "#F0F";
    this.ctx.fill();
  }

  drawSegment(x1, y1, x2, y2) {
      this.ctx.beginPath();
      this.ctx.moveTo(x1, y1);
      this.ctx.lineTo(x2, y2);
      this.ctx.strokeStyle = "#F00";
      this.ctx.stroke();
      this.ctx.closePath();
  }

  addNewStroke() {
    var stroke = {
      'user': 'Mike Battcock',
      'width': this.strokeWidth,
      'col': this.strokeColour,
      'pts': this.xys
    }

    var idx = this.newFrames.indexOf(this.frame);

    if (idx > -1) {
      this.newNotes[idx].strokes.push(stroke);
    }
    else {
      var note = {
        'frame': this.frame,
        'comments': [],
        'strokes': []
      }

      note.strokes.push(stroke);

      this.newNotes.push(note);

      // add current frame to list
      this.newFrames.push(this.frame);
    }
  }

  redrawNewStrokes() {
    var idx = this.newFrames.indexOf(this.frame);

    if (idx > -1) {
      for (var i = 0; i < this.newNotes[idx].strokes.length; i++) {

        var ts = [];
        var length = this.newNotes[idx].strokes[i].pts.length-1;

        for (var j = 0; j <= length; j++) {
          ts.push((1.0/length)*j);
        }

        //console.log(ts);

        var ss = numeric.spline(ts,this.newNotes[idx].strokes[i].pts);

        //this.draw_spline(ss, "F00");

        //var ss2 = this.simplify_spline(ss);
        this.draw_spline(ss, "#F00");
      }
    }
  }

  simplify_spline(spold, tolerance) {
    // Simplifies the source spline by trying to find a smaller set of points
    // which fit within @tolerance.
    
    var tolerance2 = tolerance ? tolerance * tolerance : 10;
    var subdivide = [ 1./4, 3./8, 1./2, 5./8, 3./4 ];
    var ts = [ 0, 1 ];
    var spnew = numeric.spline(ts, spold.at(ts));
    
    for (var j=0; j<6; j++) {
        for (var i=ts.length-1; i>0; i--) {
            var mt;
            var mdd = 0;
            for (var k in subdivide) {    
                var t = ts[i] * subdivide[k] + ts[i-1] * (1 - subdivide[k]);
                
                var po = spold.at(t);
                var pn = spnew.at(t);
                var dd = this.dist2(po, pn);
            
                if (dd > mdd) {
                    mt = t;
                    mdd = dd;
                }
            }
            if (mdd > tolerance2) {
                ts.splice(i, 0, mt);
            }
        }
        spnew = numeric.spline(ts, spold.at(ts));
    }

    this.xys = [];
    
    for (var i=0; i<ts.length; i++) {
        var xy = spnew.at(ts[i]);
        this.draw_marker(xy[0], xy[1], 5);
        this.xys.push([xy[0],xy[1]]);
    }

    //this.storedStrokes.push(stroke);

    this.addNewStroke();

    //this.reviews.push(stroke);

    return spnew;
  }

  draw_spline(spline, style) {
    var xys = spline.at(numeric.linspace(0,1,100));
    this.ctx.beginPath();
    this.ctx.moveTo(xys[0][0],xys[0][1]);
    for (var i = 1; i < xys.length; i++) {
        this.ctx.lineTo(xys[i][0], xys[i][1]);
    }
    this.ctx.strokeStyle = style;
    this.ctx.stroke();
    this.ctx.closePath();
  }

  clearCanvas() {
    this.ctx.clearRect(0, 0, this.canvas.nativeElement.width, this.canvas.nativeElement.height);
    this.displayReview = 1;
    this.emptyCanvas = 1;
    //this.storedStrokes.length = 0;
  }

  onPaint2(e) {
    var mouse = this.getMousePos(this.canvas, e);

    var nx = mouse[0];
    var ny = mouse[1];

    var dx = nx - this.ox;
    var dy = ny - this.oy;
    var dd = Math.sqrt(dx*dx + dy*dy);

    if (dd > 5) {
      this.drawSegment(this.ox,this.oy, nx,ny);
      this.xys.push([nx, ny]);
      this.td += dd;
      this.dds.push(this.td);
      this.ox = nx;
      this.oy = ny;
    }
  }

  endPaint() {
    if (this.mouseMoveFunc != null) {
      this.mouseMoveFunc();
    }

    // need at least two points
    if (this.dds.length > 1) {
      var ts = [];
      for (var i in this.dds) {
        ts.push(this.dds[i]/this.td);
      }

      //console.log(ts);
      //console.log(this.td);

      var ss = numeric.spline(ts,this.xys);
      //this.draw_spline(ss, "#0F0");

      // do this to generate simplified points in this.xys
      var ss2 = this.simplify_spline(ss);

      this.storedStrokes.push(this.xys);

      this.clearCanvas();

      this.redrawNewStrokes();

      //var ss2 = this.simplify_spline(ss);
      //this.draw_spline(ss2, "#F00");
    }

    //this.points2.length = 0;
    document.getElementById("commentInput").focus();
  }

  getMousePos(canvas, e) {
    var rect = this.canvas.nativeElement.getBoundingClientRect();

    // use touches for iphone

    var x = e.clientX - rect.left;
    var y = e.clientY - rect.top;

    return [x,y];
  }

  // distance between two points
  dist2(p1, p2) {
    var dx = p1[0] - p2[0];
    var dy = p1[1] - p2[1];
    return dx * dx + dy * dy;
  }

  saveAnnotation() {
    console.log('save annotation');

    // loop over new notes
    // check if there is data from an old session for that frame


    for (var i = 0; i < this.newNotes.length; i++) {
      var idx = this.oldFrames.indexOf(this.newNotes[i].frame);

      //console.log(this.newNotes[i]);

      //var obj = this.newStrokes[i];
      //delete obj["frame"];

      this._versionService.addFrameNote(this.versionId, this.newNotes[i], idx);
    }

    //this._versionService.addAnnotation(this.versionId, this.annotations);
  }

}




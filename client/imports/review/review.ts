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
  }

  keydown(e) {
    switch(e.which) {
      case 32:   // space
        this.playPause();

      default: return; // exit this handler for other keys
    }
    e.preventDefault(); // prevent the default action (scroll / move caret)
  } 

  ngAfterViewInit() {
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

  updateFrame() {
    this.time = this.video.nativeElement.currentTime;
    this.frame = Math.round(this.time * this.fps);  // frame rate of 25 fps

    globalID = requestAnimationFrame(()=> {
      this.updateFrame();
    });
  }

  submitComment() { 
    console.log('comment:');

    var obj = {
        "frame": this.frame,
        "comments": [
          {
            "user":"Mike Battcock", 
            "text":this.comment
          }
        ]
    };

    //console.log(obj);
    this.comments.push(obj);
    this.comment = '';

    console.log(this.comments);
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
  annotations = [];

  ox;
  oy;
  nx;
  ny;

  td = 0;
  dds = [ 0 ];

  loadAnnotations() {
    for (var i = 0; i < this.version.annotations.length; i++) {
      var ts = [];

      var length = this.version.annotations[i].length-1;

      for (var j = 0; j <= length; j++) {
        ts.push((1.0/length)*j);
      }

      var ss = numeric.spline(ts,this.version.annotations[i]);
      this.draw_spline(ss, "#0F0");
    }
  }

  initCanvas() {
    //console.log(this.canvasEl);
    //let canvas = this.canvasEl.nativeElement;
    this.ctx = this.canvas.nativeElement.getContext("2d");

    // initialise canvas variables
    this.ctx.lineWidth = 5;
    this.ctx.lineJoin = 'round';
    this.ctx.lineCap = 'round';
    //this.ctx.strokeStyle = 'hsl(100, 100%, 50%)';

    this.canvas.nativeElement.width = this.video.nativeElement.clientWidth;
    this.canvas.nativeElement.height = this.video.nativeElement.clientHeight;

    //this.testRectangle();
    this.video.nativeElement.play();

    if(this.version.hasOwnProperty('annotations')){
      this.loadAnnotations();
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
      this.ctx.strokeStyle = "#00F";
      this.ctx.stroke();
      this.ctx.closePath();
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

    var curve = [];
    
    for (var i=0; i<ts.length; i++) {
        var xy = spnew.at(ts[i]);
        this.draw_marker(xy[0], xy[1], 5);
        curve.push([xy[0],xy[1]]);
    }

    this.annotations.push(curve);

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

  onPaint2(e) {
    var mouse = this.getMousePos(this.canvas, e);

    var nx = mouse[0];
    var ny = mouse[1];

    var dx = nx - this.ox;
    var dy = ny - this.oy;
    var dd = Math.sqrt(dx*dx + dy*dy);

    if (dd > 20) {
      this.drawSegment(this.ox,this.oy, nx,ny);
      this.xys.push([nx, ny]);
      this.td += dd;
      this.dds.push(this.td);
      this.ox = nx;
      this.oy = ny;
    }
  }

  endPaint() {
    this.mouseMoveFunc();

    console.log('dds:');
    console.log(this.dds);
    console.log('td:');
    console.log(this.td);
    // need at least two points
    if (this.dds.length > 1) {
      var ts = [];
      for (var i in this.dds) {
        ts.push(this.dds[i]/this.td);
      }

      console.log(ts);

      var ss = numeric.spline(ts,this.xys);
      this.draw_spline(ss, "#0F0");

      var ss2 = this.simplify_spline(ss);
      this.draw_spline(ss2, "#F00");
    }

    //this.points2.length = 0;
    //document.getElementById("commentInput").focus();
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
    this._versionService.addAnnotation(this.versionId, this.annotations);
  }

}




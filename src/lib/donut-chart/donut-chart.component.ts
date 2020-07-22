import {
  Component,
  OnInit,
  DoCheck,
  AfterViewInit,
  ViewChild,
  ElementRef,
  Input,
  Output,
  EventEmitter,
  ComponentFactoryResolver
} from '@angular/core';
import { DonutChartDefaultTheme } from '../constants';
import { DonutCenterContentDirective } from './donut-center-content.directive';

@Component({
  selector: 'ng-donut-chart',
  templateUrl: './donut-chart.component.html',
  styleUrls: ['./donut-chart.component.scss']
})
export class DonutChartComponent implements OnInit, DoCheck, AfterViewInit {

  @ViewChild('donutChart') donutChart: ElementRef;
  @ViewChild(DonutCenterContentDirective) donutCenterContent: DonutCenterContentDirective;
  @Input() options: any;
  @Output() onClickArc = new EventEmitter();

  private devicePixelRatio: number = window.devicePixelRatio;
  private centerX: number;
  private centerY: number;
  private dataSet;

  arcs = [];

  constructor(private componentFactoryResolver: ComponentFactoryResolver) {}

  ngOnInit() {
    this.options.canvasWidth = this.options.canvasWidth || DonutChartDefaultTheme.CANVAS_WIDTH;
    this.options.canvasHeight = this.options.canvasHeight || DonutChartDefaultTheme.CANVAS_HEIGHT;
    this.options.canvasBackgroundColor = this.options.canvasBackgroundColor || DonutChartDefaultTheme.CANVAS_BACKGROUND_COLOR;
    this.options.arcWidth = this.options.arcWidth || DonutChartDefaultTheme.ARC_WIDTH;
    this.options.startAngle = this.options.startAngle || DonutChartDefaultTheme.START_ANGLE;
    this.options.radius = this.options.radius || DonutChartDefaultTheme.RADIUS;
    this.options.labelColor = this.options.labelColor || DonutChartDefaultTheme.LABEL_COLOR;
    this.options.labelFontSize = this.options.labelFontSize || DonutChartDefaultTheme.LABEL_FONT_SIZE;
    this.options.labelLineWidth = this.options.labelLineWidth || DonutChartDefaultTheme.LABEL_LINE_WIDTH;
    this.centerX = this.options.canvasWidth / 2;
    this.centerY = this.options.canvasHeight / 2;
  }

  ngDoCheck() {
    if (this.donutChart &&
      this.options.dataSet &&
      this.options.dataSet !== this.dataSet) {
      this.dataSet = this.options.dataSet;
      this.drawDonut();
      this.loadCenterComponent();
    }
  }

  ngAfterViewInit() {
    const canvas = this.donutChart.nativeElement;
    const ctx = canvas.getContext('2d');
    this.fixCanvasDPI(canvas);

    canvas.addEventListener('mousedown', e => {
      const mouseX = this.getMousePos(e).x;
      const mouseY = this.getMousePos(e).y;
      this.arcs.forEach((arc) => {
        if (ctx.isPointInStroke(arc.path, mouseX, mouseY)) {
          this.onClickArc.emit(arc);
        }
      });
    });
  }

  getCenterContentMaxWidth() {
    return (this.options.radius + this.options.arcWidth/2)/Math.sqrt(2) + 'px';
  }

  private getMousePos(e) {
    const canvas = this.donutChart.nativeElement;
    const scaleX = this.options.canvasWidth / canvas.offsetWidth;
    const scaleY = this.options.canvasHeight / canvas.offsetHeight;
    const rect = canvas.getBoundingClientRect();
    return {
      x: (e.clientX - rect.left) * scaleX * this.devicePixelRatio,
      y: (e.clientY - rect.top) * scaleY * this.devicePixelRatio
    };
  }

  private loadCenterComponent() {
    if (this.options.centerComponent !== null || this.options.centerComponent !== undefined) {
      const componentFactory = this.componentFactoryResolver.resolveComponentFactory(this.options.centerComponent);
      const viewContainerRef = this.donutCenterContent.viewContainerRef;
      viewContainerRef.clear();
      viewContainerRef.createComponent(componentFactory);
    }
  }

  private fixCanvasDPI(canvas) {
    canvas.width = this.options.canvasWidth * this.devicePixelRatio;
    canvas.height = this.options.canvasHeight * this.devicePixelRatio;
    canvas.getContext('2d').setTransform(this.devicePixelRatio, 0, 0, this.devicePixelRatio, 0, 0);
  }

  private drawDonut() {
    const canvas = this.donutChart.nativeElement;
    canvas.style.backgroundColor = this.options.canvasBackgroundColor;
    const ctx = canvas.getContext('2d');
    ctx.beginPath();
    ctx.lineWidth = this.options.arcWidth;
    let start = this.options.startAngle * Math.PI / 180;
    let end = this.options.startAngle * Math.PI / 180;
    this.options.dataSet.forEach((option) => {
      option.start = start;
      option.end = end + Math.PI * (2 * option.data);
      this.drawArc(ctx, option);
      start = option.end;
      end = option.end;
    });
  }

  private drawArc(ctx, option) {
    const randomColor = '#' + Math.random().toString(16).substr(2, 6);
    option.color = option.color || randomColor;
    ctx.strokeStyle = option.color;
    const path = new Path2D();
    path.arc(
      this.centerX,
      this.centerY,
      this.options.radius,
      option.start,
      option.end);
    ctx.stroke(path);
    if (option.labelText) {
      this.drawLabel(ctx, option);
    }
    this.arcs.push({path, option});
  }

  private drawLabel(ctx, option) {
    const textWidth = ctx.measureText(option.labelText).width;
    const angle = (option.start + option.end) / 2;
    const labelPosOffset = this.options.arcWidth / 3;
    ctx.strokeStyle = this.options.labelColor;
    ctx.lineWidth = this.options.labelLineWidth;
    ctx.font = `${this.options.labelFontSize} Robot`;
    ctx.beginPath();

    // draw dot in arc area
    const x1 = this.centerX + Math.cos(angle) * (this.options.radius + labelPosOffset);
    const y1 = this.centerY + Math.sin(angle) * (this.options.radius + labelPosOffset);
    ctx.arc(x1, y1, 2, 0, 2 * Math.PI);
    ctx.fill();

    // draw line for text reference
    const x2 = x1 + Math.cos(angle) * labelPosOffset;
    const y2 = y1 + Math.sin(angle) * labelPosOffset;
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);

    // draw horizon line and fill text
    let x3;
    const lineX = x2 - this.centerX;
    const labelEndSpace = 20;
    if (lineX > 0) {
      x3 = x2 + textWidth + labelEndSpace; // point to right
      ctx.textAlign = 'right';
    } else {
      x3 = x2 - textWidth - labelEndSpace; // point to left
      ctx.textAlign = 'left';
    }
    ctx.fillText(option.labelText, x3, y2 - 5);
    ctx.lineTo(x3, y2);

    ctx.stroke();
    // reset line width for next piece of chart
    ctx.lineWidth = this.options.arcWidth;
  }

}

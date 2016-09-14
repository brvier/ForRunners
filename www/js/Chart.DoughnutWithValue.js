(function(){
	"use strict";

	var root = this,
		Chart = root.Chart,
		//Cache a local reference to Chart.helpers
		helpers = Chart.helpers;

	var defaultConfig = {
		//Boolean - Whether we should show a stroke on each segment
		segmentShowStroke : true,

		//String - The colour of each segment stroke
		segmentStrokeColor : "#fff",

		//Number - The width of each segment stroke
		segmentStrokeWidth : 2,

		//The percentage of the chart that we cut out of the middle.
		percentageInnerCutout : 50,

		//Number - Amount of animation steps
		animationSteps : 100,

		//String - Animation easing effect
		animationEasing : "easeOutBounce",

		//Boolean - Whether we animate the rotation of the Doughnut
		animateRotate : true,

		//Boolean - Whether we animate scaling the Doughnut from the centre
		animateScale : false,

		//String - A legend template
		legendTemplate : "<ul class=\"<%=name.toLowerCase()%>-legend\"><% for (var i=0; i<segments.length; i++){%><li><span style=\"background-color:<%=segments[i].fillColor%>\"></span><%if(segments[i].label){%><%=segments[i].label%><%}%></li><%}%></ul>",

        averageValue : '0'

        
	};

	Chart.types.Doughnut.extend({
		name : "DoughnutWithValue",
        draw : function(easeDecimal){
            Chart.types.Doughnut.prototype.draw.apply(this, arguments);
            var thechart = this.chart.ctx,
                widthCanvas = this.chart.width,
                heightCanvas = this.chart.height,
                constant = 320, //default 114 => 2.8em
                fonth = (widthCanvas/constant).toFixed(2),
                lineheight = (fonth*16)/2;
            thechart.font=fonth +"em Verdana";
            thechart.textBaseline="middle";
            thechart.textAlign = 'start';
            thechart.fillStyle = '#000000';
            
            var value = this.options.averageValue,
                label = 'Bpms',
                labelWidth = thechart.measureText(label).width,
                textWidth = thechart.measureText(value).width,
                txtPos = Math.round(heightCanvas/2),
                txtPosx =  Math.round((widthCanvas/2) - (textWidth/2)),
                txtPos2x = Math.round((widthCanvas/2) - (labelWidth/2));

            thechart.fillText(value, txtPosx, txtPos - lineheight);
            thechart.fillStyle = '#888888';
            thechart.fillText(label, txtPos2x, txtPos + lineheight);
        }
    });

}).call(this);

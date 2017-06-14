cordova.define("cordova-plugin-activity-recognition.ActivityRecognition", function(require, exports, module) { var exec = require('cordova/exec');

exports.GetActivity = function(success,error) { //success({ActivityType,Propability}) , error(ErrorMessage)
    exec(
		success,
		error, 
		"ActivityRecognitionPlugin", "GetActivity", []
		);
};


exports.Connect = function(success,error) { //success() , error(ErrorMessage)
    exec(
		success,
		error, 
		"ActivityRecognitionPlugin", "Connect", []
		);
};

exports.Dissconnect = function(success,error) {//success() , error(ErrorMessage)
    exec(
		success,
		error, 
		"ActivityRecognitionPlugin", "Dissconnect", []
		);
};

exports.StartActivityUpdates = function(interval,success,error) {//success() , error(ErrorMessage)
    exec(
		success,
		error, 
		"ActivityRecognitionPlugin", "StartActivityUpdates", [interval]
		);
};

exports.StopActivityUpdates = function(success,error) {//success() , error(ErrorMessage)
    exec(
		success,
		error, 
		"ActivityRecognitionPlugin", "StopActivityUpdates", []
		);
};

});

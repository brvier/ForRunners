package cordova.plugin.activity.recognition;

import android.app.IntentService;
import android.content.Intent;

import com.google.android.gms.location.ActivityRecognitionResult;
import com.google.android.gms.location.DetectedActivity;


public class ActivityRecognitionIntentService extends IntentService 
{
	public static ActivityRequestResult Activity;
	
	public ActivityRecognitionIntentService()
	{
        super("ActivityRecognitionIntentService");
    }
	
	private String ConvertActivityCodeToString(DetectedActivity Activity)
	{
		switch(Activity.getType())
		{
			case DetectedActivity.IN_VEHICLE : return "In Vechicle";
			case DetectedActivity.ON_BICYCLE : return "On Bicycle";
			case DetectedActivity.ON_FOOT : return "On Foot";
			case DetectedActivity.RUNNING : return "Running";
			case DetectedActivity.STILL : return "Still";
			case DetectedActivity.TILTING : return "Tilting";
			case DetectedActivity.WALKING : return "Walking";
		}
		
		return "Can Not Recognize";
	}
	
	@Override
	protected void onHandleIntent(Intent intent) 
	{
		if(ActivityRecognitionResult.hasResult(intent)) 
		{
			ActivityRecognitionResult result = ActivityRecognitionResult.extractResult(intent);
			DetectedActivity CurrentActivity = result.getMostProbableActivity();
			
			Activity.ActivityType = ConvertActivityCodeToString(CurrentActivity);
			Activity.Propability = CurrentActivity.getConfidence();	
		}
		else 
		{
			Activity.ActivityType = "NoResult";
		}
	}
    
}

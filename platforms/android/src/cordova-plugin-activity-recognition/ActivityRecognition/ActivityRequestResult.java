package cordova.plugin.activity.recognition;

import org.json.JSONObject;
import org.json.JSONException;

public class ActivityRequestResult 
{
	public String ActivityType;
	public int Propability;
	
	public ActivityRequestResult()
	{
		ActivityType = "NoActivityYet";
		Propability = 0;
	}
	
	public JSONObject GetJSONObject() throws JSONException 
	{
		JSONObject result = new JSONObject();
		result.put("ActivityType", ActivityType);
		result.put("Propability", Propability);
		return result;
	}
}
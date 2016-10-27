package net.khertan.plugin;

import org.apache.cordova.CordovaPlugin;
import org.apache.cordova.CallbackContext;
import org.apache.cordova.PluginResult;
import org.apache.cordova.PluginResult.Status;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import android.content.Intent;
import android.content.Context;

import android.media.AudioManager;

public class MusicControl extends CordovaPlugin {
  // @Override
  public boolean execute(String action, JSONArray args, CallbackContext callbackContext) throws JSONException {
    Intent i;
    Context context=this.cordova.getActivity().getApplicationContext();


    if (action.trim().equalsIgnoreCase("isactive")) {
        AudioManager am = (AudioManager)  context.getSystemService(Context.AUDIO_SERVICE);
        callbackContext.sendPluginResult(new PluginResult(PluginResult.Status.OK, am.isMusicActive()));
        //return am.isMusicActive();
        return true;
    } 

    i = new Intent("com.android.music.musicservicecommand");
    i.putExtra("command", action);
    context.sendBroadcast(i);
    callbackContext.success("Executed with Music Control Cmd: "+action);
    return true;
  }

};

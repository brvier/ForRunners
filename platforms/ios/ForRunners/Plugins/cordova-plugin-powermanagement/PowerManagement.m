/**
 * Cordova (iOS) plugin for accessing the power-management functions of the device
 */
#import "PowerManagement.h"

/**
 * Actual implementation of the interface
 */
@implementation PowerManagement

- (void) acquire:(CDVInvokedUrlCommand*)command {
    // Acquire a reference to the local UIApplication singleton
    UIApplication* app = [UIApplication sharedApplication];
    
    if( ![app isIdleTimerDisabled] ) {
        [app setIdleTimerDisabled:true];
        
        CDVPluginResult* pr = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsString:@""];
        //[pr setKeepCallbackAsBool:YES];
        [self.commandDelegate sendPluginResult:pr callbackId:command.callbackId];
        //CDVPluginResult* pr = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR];
        //[pr setKeepCallbackAsBool:YES];
        //[self.commandDelegate sendPluginResult:pr callbackId:command.callbackId];
        
    }
    else {
        //CDVPluginResult* pr = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsString:@""];
        //[pr setKeepCallbackAsBool:YES];
        //[self.commandDelegate sendPluginResult:pr callbackId:command.callbackId];
        CDVPluginResult* pr = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsString:@"IdleTimer already disabled"];
        //[pr setKeepCallbackAsBool:YES];
        [self.commandDelegate sendPluginResult:pr callbackId:command.callbackId];
    }
}


- (void) release:(CDVInvokedUrlCommand*)command {
    // Acquire a reference to the local UIApplication singleton
    UIApplication* app = [UIApplication sharedApplication];
    
    if( [app isIdleTimerDisabled] ) {
        [app setIdleTimerDisabled:false];
        
        CDVPluginResult* pr = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsString:@""];
        //[pr setKeepCallbackAsBool:YES];
        [self.commandDelegate sendPluginResult:pr callbackId:command.callbackId];
        //CDVPluginResult* pr = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR];
        //[pr setKeepCallbackAsBool:YES];
        //[self.commandDelegate sendPluginResult:pr callbackId:command.callbackId];
    }
    else {
        //CDVPluginResult* pr = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsString:@""];
        //[pr setKeepCallbackAsBool:YES];
        //[self.commandDelegate sendPluginResult:pr callbackId:command.callbackId];
        CDVPluginResult* pr = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsString:@"IdleTimer not disabled"];
        //[pr setKeepCallbackAsBool:YES];
        [self.commandDelegate sendPluginResult:pr callbackId:command.callbackId];
    }
}
@end

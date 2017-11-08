/**
 * Cordova (iOS) plugin for accessing the power-management functions of the device
 */

#import <Cordova/CDV.h>

@interface PowerManagement : CDVPlugin

- (void)acquire:(CDVInvokedUrlCommand*)command;
- (void)release:(CDVInvokedUrlCommand*)command;

@end


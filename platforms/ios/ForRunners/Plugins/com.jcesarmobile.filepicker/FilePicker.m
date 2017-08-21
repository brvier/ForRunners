//
//  FilePicker.m
//
//  Created by @jcesarmobile
//
//

#import "FilePicker.h"

@implementation FilePicker

- (void)isAvailable:(CDVInvokedUrlCommand*)command {
    BOOL supported = NSClassFromString(@"UIDocumentPickerViewController");
    [self.commandDelegate sendPluginResult:[CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsBool:supported] callbackId:command.callbackId];
}

- (void)pickFile:(CDVInvokedUrlCommand*)command {

    self.command = command;
    id UTIs = [command.arguments objectAtIndex:0];
    BOOL supported = YES;
    NSArray * UTIsArray = nil;
    if ([UTIs isEqual:[NSNull null]]) {
        UTIsArray =  @[@"public.data"];
    } else if ([UTIs isKindOfClass:[NSString class]]){
        UTIsArray = @[UTIs];
    } else if ([UTIs isKindOfClass:[NSArray class]]){
        UTIsArray = UTIs;
    } else {
        supported = NO;
        [self.commandDelegate sendPluginResult:[CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsString:@"not supported"] callbackId:self.command.callbackId];
    }
    
    if (!NSClassFromString(@"UIDocumentPickerViewController")) {
        supported = NO;
        [self.commandDelegate sendPluginResult:[CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsString:@"your device can't show the file picker"] callbackId:self.command.callbackId];
    }

    if (supported) {
        self.pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_NO_RESULT];
        [self.pluginResult setKeepCallbackAsBool:YES];
        [self displayDocumentPicker:UTIsArray];
    }
    
}

#pragma mark - UIDocumentMenuDelegate
-(void)documentMenu:(UIDocumentMenuViewController *)documentMenu didPickDocumentPicker:(UIDocumentPickerViewController *)documentPicker {
    
    documentPicker.delegate = self;
    documentPicker.modalPresentationStyle = UIModalPresentationFullScreen;
    [self.viewController presentViewController:documentPicker animated:YES completion:nil];
    
}

-(void)documentMenuWasCancelled:(UIDocumentMenuViewController *)documentMenu {
    
    self.pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsString:@"canceled"];
    [self.pluginResult setKeepCallbackAsBool:NO];
    [self.commandDelegate sendPluginResult:self.pluginResult callbackId:self.command.callbackId];
    
}

#pragma mark - UIDocumentPickerDelegate
- (void)documentPicker:(UIDocumentPickerViewController *)controller didPickDocumentAtURL:(NSURL *)url {
    
    self.pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsString:[url path]];
    [self.pluginResult setKeepCallbackAsBool:NO];
    [self.commandDelegate sendPluginResult:self.pluginResult callbackId:self.command.callbackId];
    
}
- (void)documentPickerWasCancelled:(UIDocumentPickerViewController *)controller {
    
    self.pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsString:@"canceled"];
    [self.pluginResult setKeepCallbackAsBool:NO];
    [self.commandDelegate sendPluginResult:self.pluginResult callbackId:self.command.callbackId];
    
}

- (void)displayDocumentPicker:(NSArray *)UTIs {
    
    UIDocumentMenuViewController *importMenu = [[UIDocumentMenuViewController alloc] initWithDocumentTypes:UTIs inMode:UIDocumentPickerModeImport];
    importMenu.delegate = self;
    importMenu.popoverPresentationController.sourceView = self.viewController.view;
    [self.viewController presentViewController:importMenu animated:YES completion:nil];
    
}

@end

Object.defineProperty(exports,"__esModule",{value:true});exports.Report=exports.StandardDelivery=exports.Configuration=exports.Client=undefined;

var _reactNative=require('react-native');
var _NativeSerializer=require('./NativeSerializer');var _NativeSerializer2=_interopRequireDefault(_NativeSerializer);function _interopRequireDefault(obj){return obj&&obj.__esModule?obj:{default:obj};}function _objectWithoutProperties(obj,keys){var target={};for(var i in obj){if(keys.indexOf(i)>=0)continue;if(!Object.prototype.hasOwnProperty.call(obj,i))continue;target[i]=obj[i];}return target;}function _classCallCheck(instance,Constructor){if(!(instance instanceof Constructor)){throw new TypeError("Cannot call a class as a function");}}

var NativeClient=_reactNative.NativeModules.BugsnagReactNative;

var BREADCRUMB_MAX_LENGTH=30;
var CONSOLE_LOG_METHODS=['log','debug','info','warn','error'].filter(function(method){return(
typeof console[method]==='function');});var





Client=exports.Client=



function Client(apiKeyOrConfig){var _this=this;_classCallCheck(this,Client);this.






















handleUncaughtErrors=function(){
if(ErrorUtils){
var previousHandler=ErrorUtils.getGlobalHandler();

ErrorUtils.setGlobalHandler(function(error,isFatal){
if(_this.config.autoNotify&&_this.config.shouldNotify()){
_this.notify(error,null,true,function(){
if(previousHandler){




setTimeout(function(){
previousHandler(error,isFatal);
},150);
}
},new HandledState('error',true,'unhandledException'));
}else if(previousHandler){
previousHandler(error,isFatal);
}
});
}
};this.

handlePromiseRejections=function(){
var tracking=require('promise/setimmediate/rejection-tracking');
var client=_this;
tracking.enable({
allRejections:true,
onUnhandled:function onUnhandled(id,error){
client.notify(error,null,true,null,new HandledState('error',true,'unhandledPromiseRejection'));
},
onHandled:function onHandled(){}});

};this.








notify=function _callee(error,beforeSendCallback,blocking,postSendCallback,_handledState){var report,_iterator,_isArray,_i,_ref,callback,payload;return regeneratorRuntime.async(function _callee$(_context){while(1){switch(_context.prev=_context.next){case 0:if(
error instanceof Error){_context.next=4;break;}
console.warn('Bugsnag could not notify: error must be of type Error');
if(postSendCallback){postSendCallback(false);}return _context.abrupt('return');case 4:if(


_this.config.shouldNotify()){_context.next=7;break;}
if(postSendCallback){postSendCallback(false);}return _context.abrupt('return');case 7:



report=new Report(_this.config.apiKey,error,_handledState);
report.addMetadata('app','codeBundleId',_this.config.codeBundleId);_iterator=

_this.config.beforeSendCallbacks,_isArray=Array.isArray(_iterator),_i=0,_iterator=_isArray?_iterator:_iterator[typeof Symbol==='function'?typeof Symbol==='function'?typeof Symbol==='function'?Symbol.iterator:'@@iterator':'@@iterator':'@@iterator']();case 10:if(!_isArray){_context.next=16;break;}if(!(_i>=_iterator.length)){_context.next=13;break;}return _context.abrupt('break',26);case 13:_ref=_iterator[_i++];_context.next=20;break;case 16:_i=_iterator.next();if(!_i.done){_context.next=19;break;}return _context.abrupt('break',26);case 19:_ref=_i.value;case 20:callback=_ref;if(!(
callback(report,error)===false)){_context.next=24;break;}
if(postSendCallback){postSendCallback(false);}return _context.abrupt('return');case 24:_context.next=10;break;case 26:



if(beforeSendCallback){
beforeSendCallback(report);
}

payload=report.toJSON();
payload.blocking=!!blocking;

NativeClient.notify(payload).then(function(){
if(postSendCallback){
postSendCallback();
}
});case 30:case'end':return _context.stop();}}},null,_this);};this.


setUser=function(id,name,email){
var safeStringify=function safeStringify(value){
try{
return String(value);
}catch(e){


return undefined;
}
};


id=safeStringify(id);
name=safeStringify(name);
email=safeStringify(email);

NativeClient.setUser({id:id,name:name,email:email});
};this.




clearUser=function(){
NativeClient.clearUser();
};this.

















startSession=function(){
NativeClient.startSession();
};this.
















stopSession=function(){
NativeClient.stopSession();
};this.




















resumeSession=function(){
NativeClient.resumeSession();
};this.





leaveBreadcrumb=function(name,metadata){
if(typeof name!=='string'){
console.warn('Breadcrumb name must be a string, got \''+name+'\'. Discarding.');
return;
}

if(name.length>BREADCRUMB_MAX_LENGTH){
console.warn('Breadcrumb name exceeds '+BREADCRUMB_MAX_LENGTH+' characters (it has '+name.length+'): '+name+'. It will be truncated.');
}


if([undefined,null].includes(metadata)){
metadata={};
}else if(typeof metadata==='string'){
metadata={'message':metadata};
}else if(typeof metadata!=='object'){
console.warn('Breadcrumb metadata must be an object or string, got \''+metadata+'\'. Discarding metadata.');
metadata={};
}var _metadata=




metadata,_metadata$type=_metadata.type,type=_metadata$type===undefined?'manual':_metadata$type,breadcrumbMetaData=_objectWithoutProperties(_metadata,['type']);

NativeClient.leaveBreadcrumb({
name:name,
type:type,
metadata:(0,_NativeSerializer2.default)(breadcrumbMetaData)});

};this.









enableConsoleBreadcrumbs=function(){
CONSOLE_LOG_METHODS.forEach(function(method){
var originalFn=console[method];
console[method]=function(){for(var _len=arguments.length,args=Array(_len),_key=0;_key<_len;_key++){args[_key]=arguments[_key];}
try{
_this.leaveBreadcrumb('Console',{
type:'log',
severity:/^group/.test(method)?'log':method,
message:args.
map(function(arg){
var stringified=void 0;

try{stringified=String(arg);}catch(e){}

if(stringified&&stringified!=='[object Object]')return stringified;

try{stringified=JSON.stringify(arg,null,2);}catch(e){}

return stringified;
}).
join('\n')});

}catch(error){
console.warn('Unable to serialize console.'+method+' arguments to Bugsnag breadcrumb.',error);
}
originalFn.apply(console,args);
};
console[method]._restore=function(){console[method]=originalFn;};
});
};this.

disableConsoleBreadCrumbs=function(){
CONSOLE_LOG_METHODS.forEach(function(method){
if(typeof console[method]._restore==='function')console[method]._restore();
});
};if(typeof apiKeyOrConfig==='string'||typeof apiKeyOrConfig==='undefined'){this.config=new Configuration(apiKeyOrConfig);}else if(apiKeyOrConfig instanceof Configuration){this.config=apiKeyOrConfig;}else{throw new Error('Bugsnag: A client must be constructed with an API key or Configuration');}if(NativeClient){NativeClient.startWithOptions(this.config.toJSON());this.handleUncaughtErrors();if(this.config.handlePromiseRejections){this.handlePromiseRejections();}if(this.config.consoleBreadcrumbsEnabled){this.enableConsoleBreadcrumbs();}}else{throw new Error('Bugsnag: No native client found. Is BugsnagReactNative installed in your native code project?');}};var





Configuration=exports.Configuration=
function Configuration(apiKey){var _this2=this;_classCallCheck(this,Configuration);this.




















shouldNotify=function(){
return!_this2.releaseStage||
!_this2.notifyReleaseStages||
_this2.notifyReleaseStages.includes(_this2.releaseStage);
};this.






registerBeforeSendCallback=function(callback){
_this2.beforeSendCallbacks.push(callback);
};this.




unregisterBeforeSendCallback=function(callback){
var index=_this2.beforeSendCallbacks.indexOf(callback);
if(index!==-1){
_this2.beforeSendCallbacks.splice(index,1);
}
};this.




clearBeforeSendCallbacks=function(){
_this2.beforeSendCallbacks=[];
};this.

toJSON=function(){
return{
apiKey:_this2.apiKey,
codeBundleId:_this2.codeBundleId,
releaseStage:_this2.releaseStage,
notifyReleaseStages:_this2.notifyReleaseStages,
endpoint:_this2.delivery.endpoint,
sessionsEndpoint:_this2.delivery.sessionsEndpoint,
appVersion:_this2.appVersion,
autoNotify:_this2.autoNotify,
version:_this2.version,
autoCaptureSessions:_this2.autoCaptureSessions,
automaticallyCollectBreadcrumbs:_this2.automaticallyCollectBreadcrumbs};

};var metadata=require('../package.json');this.version=metadata['version'];this.apiKey=apiKey;this.delivery=new StandardDelivery();this.beforeSendCallbacks=[];this.notifyReleaseStages=undefined;this.releaseStage=undefined;this.appVersion=undefined;this.codeBundleId=undefined;this.autoCaptureSessions=true;this.autoNotify=true;this.handlePromiseRejections=!__DEV__;this.consoleBreadcrumbsEnabled=false;this.automaticallyCollectBreadcrumbs=true;};var


StandardDelivery=exports.StandardDelivery=
function StandardDelivery(endpoint,sessionsEndpoint){_classCallCheck(this,StandardDelivery);
this.endpoint=endpoint;
this.sessionsEndpoint=sessionsEndpoint;
};var


HandledState=
function HandledState(originalSeverity,unhandled,severityReason){_classCallCheck(this,HandledState);
this.originalSeverity=originalSeverity;
this.unhandled=unhandled;
this.severityReason=severityReason;
};var





Report=exports.Report=
function Report(apiKey,error,_handledState){var _this3=this;_classCallCheck(this,Report);this.





















addMetadata=function(section,key,value){
if(!_this3.metadata[section]){
_this3.metadata[section]={};
}
_this3.metadata[section][key]=value;
};this.

toJSON=function(){
if(!_this3._handledState||!(_this3._handledState instanceof HandledState)){
_this3._handledState=new HandledState('warning',false,'handledException');
}



var defaultSeverity=_this3._handledState.originalSeverity===_this3.severity;
var isValidReason=typeof _this3._handledState.severityReason==='string';
var severityType=defaultSeverity&&isValidReason?
_this3._handledState.severityReason:'userCallbackSetSeverity';



var isUnhandled=typeof _this3._handledState.unhandled==='boolean'?_this3._handledState.unhandled:false;

return{
apiKey:_this3.apiKey,
context:_this3.context,
errorClass:_this3.errorClass,
errorMessage:_this3.errorMessage,
groupingHash:_this3.groupingHash,
metadata:(0,_NativeSerializer2.default)(_this3.metadata),
severity:_this3.severity,
stacktrace:_this3.stacktrace,
user:_this3.user,
defaultSeverity:defaultSeverity,
unhandled:isUnhandled,
severityReason:severityType};

};this.apiKey=apiKey;this.errorClass=error.constructor.name;this.errorMessage=error.message;this.context=undefined;this.groupingHash=undefined;this.metadata={};this.stacktrace=error.stack;this.user={};if(!_handledState||!(_handledState instanceof HandledState)){_handledState=new HandledState('warning',false,'handledException');}this.severity=_handledState.originalSeverity;this._handledState=_handledState;};
//# sourceMappingURL=Bugsnag.js.map
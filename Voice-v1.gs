
/**
* Google Apps Script Library for the voice-v1 API
* 
* Documentation can be found: 
* http://developers.google.com
* 
* OAuth2 Scopes
* https://www.googleapis.com/auth/googlevoice
*/

var BASEURL_="https://www.googleapis.com/voice/v1/";
var tokenService_;

/*
* Stores the function passed that is invoked to get a OAuth2 token;
* @param {function} service The function used to get the OAuth2 token;
*
*/
function setTokenService(service){
  tokenService_ = service;
}

/*
* Returns an OAuth2 token from your TokenService as a test
* @return {string} An OAuth2 token
*
*/
function testTokenService(){
 return tokenService_();
}

/**
 * Performs a Fetch
 * @param {string} url The endpoint for the URL with parameters
 * @param {Object.<string, string>} options Options to override default fetch options
 * @returns {Object.<string,string>} the fetch results
 * @private
 */
function CALL_(path,options){
  var fetchOptions = {method:"",muteHttpExceptions:true, contentType:"application/json", headers:{Authorization:"Bearer "+tokenService_()}}
  var url = BASEURL_ + path;
  
  for(option in options){
    fetchOptions[option] = options[option];
  }
  
  var response = UrlFetchApp.fetch(url, fetchOptions)
  if(response.getResponseCode() != 200){
    throw new Error(response.getContentText())
  }else{
    return JSON.parse(response.getContentText());
  }
}

/**
 * Performs a Fetch and accumulation using pageToken parameter of the returned results
 * @param {string} url The endpoint for the URL with parameters
 * @param {Object.<string, string>} options Options to override default fetch options
 * @param {string} returnParamPath The path of the parameter to be accumulated
 * @returns {Array.Object.<string,string>} An array of objects
 * @private
 */
function CALLPAGE_(path,options, returnParamPath){
  var fetchOptions = {method:"",muteHttpExceptions:true, contentType:"application/json", headers:{Authorization:"Bearer "+tokenService_()}}
  for(option in options){
    fetchOptions[option] = options[option];
  }
  var url = BASEURL_ + path;  
  var returnArray = [];
  var nextPageToken;
  do{
    if(nextPageToken){
      url = buildUrl_(url, {pageToken:nextPageToken});
    }
    var results = UrlFetchApp.fetch(url, fetchOptions);
    if(results.getResponseCode() != 200){
      throw new Error(results.getContentText());
    }else{
      var resp = JSON.parse(results.getContentText())
      nextPageToken = resp.nextPageToken;
      returnArray  = returnArray.concat(resp[returnParamPath])
    }
    url = BASEURL_ + path;
  }while(nextPageToken);
  return returnArray;
}

/**
 * Builds a complete URL from a base URL and a map of URL parameters. Written by Eric Koleda in the OAuth2 library
 * @param {string} url The base URL.
 * @param {Object.<string, string>} params The URL parameters and values.
 * @returns {string} The complete URL.
 * @private
 */
function buildUrl_(url, params) {
  var params = params || {}; //allow for NULL options
  var paramString = Object.keys(params).map(function(key) {
    return encodeURIComponent(key) + '=' + encodeURIComponent(params[key]);
  }).join('&');
  return url + (url.indexOf('?') >= 0 ? '&' : '?') + paramString;  
}


/**
* Enables the user's account for calling.
*
* @param {string} userId String identifying the Google Voice user. The special string '@me' identifies the authenticated user.
* @param {object} options Keypair of all optional parameters for this call
* @return {object} The returned AccountResource object
*/
function accountsEnableCalling(userId,options){
  var path = buildUrl_("users/enableCalling/"+userId,options);
  var callOptions = {method:"POST"};
  var AccountResource = CALL_(path,callOptions);
  return AccountResource;
}

/**
* Get information about a user's account.
*
* @param {string} userId String identifying the Google Voice user. The special string '@me' identifies the authenticated user.
* @param {object} options Keypair of all optional parameters for this call
* @return {object} The returned AccountResource object
*/
function accountsGet(userId,options){
  var path = buildUrl_("users/"+userId+"/account",options);
  var callOptions = {method:"GET"};
  var AccountResource = CALL_(path,callOptions);
  return AccountResource;
}

/**
* Get information about a user's account.
*
* @param {string} userId String identifying the Google Voice user. The special string '@me' identifies the authenticated user.
* @param {object} AccountResource An object containing the AccountResource for this method
* @param {object} options Keypair of all optional parameters for this call
* @return {object} The returned AccountResource object
*/
function accountsGet_as_post(userId,AccountResource,options){
  var path = buildUrl_("users/"+userId+"/account",options);
  var callOptions = {method:"POST",payload:JSON.stringify(AccountResource)};
  var AccountResource = CALL_(path,callOptions);
  return AccountResource;
}

/**
* Cancel a click-to-call call.
*
* @param {string} userId String identifying the Google Voice user. The special string '@me' identifies the authenticated user.
* @param {string} clickToCallId ID of the call to cancel. The special value "@me_current" refers to the user's most recently started click-to-call.
* @param {object} options Keypair of all optional parameters for this call
*/
function clickToCallsDelete(userId,clickToCallId,options){
  var path = buildUrl_("users/"+userId+"/clickToCalls/"+clickToCallId,options);
  var callOptions = {method:"DELETE"};
  var removeResource = CALL_(path,callOptions);
  return removeResource;
}

/**
* Initiate a phone call with the click-to-call flow.
*
* @param {string} userId String identifying the Google Voice user. The special string '@me' identifies the authenticated user.
* @param {object} ClickToCallResource An object containing the ClickToCallResource for this method
* @param {object} options Keypair of all optional parameters for this call
* @return {object} The returned ClickToCallResource object
*/
function clickToCallsInsert(userId,ClickToCallResource,options){
  var path = buildUrl_("users/"+userId+"/clickToCalls",options);
  var callOptions = {method:"POST",payload:JSON.stringify(ClickToCallResource)};
  var ClickToCallResource = CALL_(path,callOptions);
  return ClickToCallResource;
}

/**
* List the user's conversations, ordered in reverse chronological order.
*
* @param {string} userId String identifying the Google Voice user. The special string '@me' identifies the authenticated user.
* @param {object} options Keypair of all optional parameters for this call
* @return {object} The returned ConversationListResource object
*/
function conversationsList(userId,options){
  var path = buildUrl_("users/"+userId+"/conversations",options);
  var callOptions = {method:"GET"};
  var ConversationListItems = CALLPAGE_(path,callOptions,"items");
  return ConversationListItems;
}

/**
* Begin to verify the user's possession of a forwarding phone.
*
* @param {string} userId String identifying the Google Voice user. The special string '@me' identifies the authenticated user.
* @param {string} phoneId String identifying the phone.
* @param {object} PhoneVerificationResource An object containing the PhoneVerificationResource for this method
* @param {object} options Keypair of all optional parameters for this call
* @return {object} The returned PhoneVerificationResource object
*/
function phoneVerificationsInsert(userId,phoneId,PhoneVerificationResource,options){
  var path = buildUrl_("users/"+userId+"/phones/"+phoneId+"/verifications",options);
  var callOptions = {method:"POST",payload:JSON.stringify(PhoneVerificationResource)};
  var PhoneVerificationResource = CALL_(path,callOptions);
  return PhoneVerificationResource;
}

/**
* Verify possession of a forwarding phone by reporting the verification code back to Google
*
* @param {string} userId String identifying the Google Voice user. The special string '@me' identifies the authenticated user.
* @param {string} phoneId String identifying the phone.
* @param {string} verificationId ID of the verification being completed.
* @param {object} PhoneVerificationResource An object containing the PhoneVerificationResource for this method
* @param {object} options Keypair of all optional parameters for this call
* @return {object} The returned PhoneVerificationResource object
*/
function phoneVerificationsUpdate(userId,phoneId,verificationId,PhoneVerificationResource,options){
  var path = buildUrl_("users/"+userId+"/phones/"+phoneId+"/verifications/"+verificationId,options);
  var callOptions = {method:"PUT",payload:JSON.stringify(PhoneVerificationResource)};
  var PhoneVerificationResource = CALL_(path,callOptions);
  return PhoneVerificationResource;
}

/**
* Get information about one of a user's forwarding phones.
*
* @param {string} userId String identifying the Google Voice user. The special string '@me' identifies the authenticated user.
* @param {string} phoneId String identifying the phone.
* @param {object} options Keypair of all optional parameters for this call
* @return {object} The returned PhoneResource object
*/
function phonesGet(userId,phoneId,options){
  var path = buildUrl_("users/"+userId+"/phones/"+phoneId,options);
  var callOptions = {method:"GET"};
  var PhoneResource = CALL_(path,callOptions);
  return PhoneResource;
}

/**
* Add a new forwarding phone to a user's account.
*
* @param {string} userId String identifying the Google Voice user. The special string '@me' identifies the authenticated user.
* @param {object} PhoneResource An object containing the PhoneResource for this method
* @param {object} options Keypair of all optional parameters for this call
* @return {object} The returned PhoneResource object
*/
function phonesInsert(userId,PhoneResource,options){
  var path = buildUrl_("users/"+userId+"/phones",options);
  var callOptions = {method:"POST",payload:JSON.stringify(PhoneResource)};
  var PhoneResource = CALL_(path,callOptions);
  return PhoneResource;
}

/**
* List the user's forwarding phones.
*
* @param {string} userId String identifying the Google Voice user. The special string '@me' identifies the authenticated user.
* @param {object} options Keypair of all optional parameters for this call
* @return {object} The returned PhoneListResource object
*/
function phonesList(userId,options){
  var path = buildUrl_("users/"+userId+"/phones",options);
  var callOptions = {method:"GET"};
  var PhoneListResource = CALL_(path,callOptions);
  return PhoneListResource;
}

/**
* Update a forwarding phone. Not all fields can be updated, that's specified by the field documentation. This method supports patch semantics.
*
* @param {string} userId String identifying the Google Voice user. The special string '@me' identifies the authenticated user.
* @param {string} phoneId String identifying the phone.
* @param {object} PhoneResource An object containing the PhoneResource for this method
* @param {object} options Keypair of all optional parameters for this call
* @return {object} The returned PhoneResource object
*/
function phonesPatch(userId,phoneId,PhoneResource,options){
  var path = buildUrl_("users/"+userId+"/phones/"+phoneId,options);
  var callOptions = {method:"PATCH",payload:JSON.stringify(PhoneResource)};
  var PhoneResource = CALL_(path,callOptions);
  return PhoneResource;
}

/**
* Update a forwarding phone. Not all fields can be updated, that's specified by the field documentation.
*
* @param {string} userId String identifying the Google Voice user. The special string '@me' identifies the authenticated user.
* @param {string} phoneId String identifying the phone.
* @param {object} PhoneResource An object containing the PhoneResource for this method
* @param {object} options Keypair of all optional parameters for this call
* @return {object} The returned PhoneResource object
*/
function phonesUpdate(userId,phoneId,PhoneResource,options){
  var path = buildUrl_("users/"+userId+"/phones/"+phoneId,options);
  var callOptions = {method:"PUT",payload:JSON.stringify(PhoneResource)};
  var PhoneResource = CALL_(path,callOptions);
  return PhoneResource;
}

/**
* Get a proxy number to place a call from one of the user's forwarding phones or applicable verified phone number. The retrieved number specifies the proxy number to call for a specific destination in order to be placed using the caller's preferred Google Voice number or verified phone number as caller ID. The retrieved number should not be used past the expiration time returned in the response.
*
* @param {string} userId String identifying the Google Voice user. The special string '@me' identifies the authenticated user.
* @param {string} forwardingPhoneNumber String identifying the number of the user's forwarding phone that will place the call to the proxy number.
* @param {string} phoneNumber String identifying the phone number of the remote party. The first character is a + symbol, and the rest of the string are numeric digits representing a phone number in E.164 format, starting with a country code. For example, the U.S. phone number (650)253-0000 is represented by the string "+16502530000"
* @param {object} options Keypair of all optional parameters for this call
*/
function proxyNumbersGet(userId,forwardingPhoneNumber,phoneNumber,options){
  var path = buildUrl_("users/"+userId+"/phones/"+forwardingPhoneNumber+"/proxyNumbers/"+phoneNumber,options);
  var callOptions = {method:"GET"};
  var removeResource = CALL_(path,callOptions);
  return removeResource;
}

/**
* Lists the proxy numbers intended for a user's forwarding phone. The retrieved numbers should not be used past the expiration time returned in the response.
*
* @param {string} userId String identifying the Google Voice user. The special string '@me' identifies the authenticated user.
* @param {string} forwardingPhoneNumber String identifying the number of the user's forwarding phone that will place the call to the proxy number.
* @param {object} options Keypair of all optional parameters for this call
*/
function proxyNumbersList(userId,forwardingPhoneNumber,options){
  var path = buildUrl_("users/"+userId+"/phones/"+forwardingPhoneNumber+"/proxyNumbers",options);
  var callOptions = {method:"GET"};
  var removeResource = CALL_(path,callOptions);
  return removeResource;
}

/**
* Get information about a rate.
*
* @param {string} userId String identifying the Google Voice user. The special string '@me' identifies the authenticated user.
* @param {string} phoneNumber String representing the destination phone number in E.164 format starting with a '+'.
* @param {object} options Keypair of all optional parameters for this call
* @return {object} The returned RateResource object
*/
function ratesGet(userId,phoneNumber,options){
  var path = buildUrl_("users/"+userId+"/destinations/"+phoneNumber+"/rate",options);
  var callOptions = {method:"GET"};
  var RateResource = CALL_(path,callOptions);
  return RateResource;
}

/**
* Retrieve a recording message.
*
* @param {string} userId String identifying the Google Voice user. The special string '@me' identifies the authenticated user.
* @param {string} recordingId String identifying the recording.
* @param {object} options Keypair of all optional parameters for this call
* @return {object} The returned RecordingResource object
*/
function recordingsGet(userId,recordingId,options){
  var path = buildUrl_("users/"+userId+"/recordings/"+recordingId,options);
  var callOptions = {method:"GET"};
  var RecordingResource = CALL_(path,callOptions);
  return RecordingResource;
}

/**
* Send a text message.
*
* @param {string} userId String identifying the Google Voice user. The special string '@me' identifies the authenticated user.
* @param {object} TextMessageResource An object containing the TextMessageResource for this method
* @param {object} options Keypair of all optional parameters for this call
* @return {object} The returned TextMessageResource object
*/
function textsInsert(userId,TextMessageResource,options){
  var path = buildUrl_("users/"+userId+"/texts",options);
  var callOptions = {method:"POST",payload:JSON.stringify(TextMessageResource)};
  var TextMessageResource = CALL_(path,callOptions);
  return TextMessageResource;
}

/**
* Add account phone to user's account.
*
* @param {object} options Keypair of all optional parameters for this call
*/
function voice_clientAddAccountPhone(options){
  var path = buildUrl_("voiceclient/account/accountphone/add",options);
  var callOptions = {method:"POST"};
  var removeResource = CALL_(path,callOptions);
  return removeResource;
}

/**
* Allocates a new handoff number for a client. If a handoff number already exists for the specified handoff_key, a new number will be allocated.
*
* @param {object} options Keypair of all optional parameters for this call
*/
function voice_clientAddHandoffNumber(options){
  var path = buildUrl_("handoffnumbers/add",options);
  var callOptions = {method:"POST"};
  var removeResource = CALL_(path,callOptions);
  return removeResource;
}

/**
* Gets a thread.
*
* @param {object} options Keypair of all optional parameters for this call
*/
function voice_clientApi2GetThread(options){
  var path = buildUrl_("voiceclient/api2thread/get",options);
  var callOptions = {method:"POST"};
  var removeResource = CALL_(path,callOptions);
  return removeResource;
}

/**
* Lists threads.
*
* @param {object} options Keypair of all optional parameters for this call
*/
function voice_clientApi2ListThreads(options){
  var path = buildUrl_("voiceclient/api2thread/list",options);
  var callOptions = {method:"POST"};
  var removeResource = CALL_(path,callOptions);
  return removeResource;
}

/**
* Device registeration for notifications.
*
* @param {object} options Keypair of all optional parameters for this call
*/
function voice_clientApi2RegisterDestination(options){
  var path = buildUrl_("voiceclient/api2notifications/registerdestination",options);
  var callOptions = {method:"POST"};
  var removeResource = CALL_(path,callOptions);
  return removeResource;
}

/**
* Thread based search.
*
* @param {object} options Keypair of all optional parameters for this call
*/
function voice_clientApi2SearchThreads(options){
  var path = buildUrl_("voiceclient/api2thread/search",options);
  var callOptions = {method:"POST"};
  var removeResource = CALL_(path,callOptions);
  return removeResource;
}

/**
* Thread based search.
*
* @param {object} options Keypair of all optional parameters for this call
*/
function voice_clientApi2SendSms(options){
  var path = buildUrl_("voiceclient/api2thread/sendsms",options);
  var callOptions = {method:"POST"};
  var removeResource = CALL_(path,callOptions);
  return removeResource;
}

/**
* Device unregisteration for notifications.
*
* @param {object} options Keypair of all optional parameters for this call
*/
function voice_clientApi2UnregisterDestination(options){
  var path = buildUrl_("voiceclient/api2notifications/unregisterdestination",options);
  var callOptions = {method:"POST"};
  var removeResource = CALL_(path,callOptions);
  return removeResource;
}

/**
* Permanently deletes specified thread.
*
* @param {object} options Keypair of all optional parameters for this call
*/
function voice_clientBatchDeleteThread(options){
  var path = buildUrl_("voiceclient/thread/batchdelete",options);
  var callOptions = {method:"POST"};
  var removeResource = CALL_(path,callOptions);
  return removeResource;
}

/**
* Permanently deletes specified thread items.
*
* @param {object} options Keypair of all optional parameters for this call
*/
function voice_clientBatchDeleteThreadItem(options){
  var path = buildUrl_("voiceclient/threaditem/batchdelete",options);
  var callOptions = {method:"POST"};
  var removeResource = CALL_(path,callOptions);
  return removeResource;
}

/**
* Updates conversation attributes.
*
* @param {object} options Keypair of all optional parameters for this call
*/
function voice_clientBatchUpdateConversationAttributes(options){
  var path = buildUrl_("voiceclient/conversationattributes/batchupdate",options);
  var callOptions = {method:"POST"};
  var removeResource = CALL_(path,callOptions);
  return removeResource;
}

/**
* Updates conversation attributes.
*
* @param {object} options Keypair of all optional parameters for this call
*/
function voice_clientBatchUpdateThreadAttributes(options){
  var path = buildUrl_("voiceclient/thread/batchupdateattributes",options);
  var callOptions = {method:"POST"};
  var removeResource = CALL_(path,callOptions);
  return removeResource;
}

/**
* Create new user account.
*
* @param {object} options Keypair of all optional parameters for this call
*/
function voice_clientCreateAccount(options){
  var path = buildUrl_("voiceclient/account/create",options);
  var callOptions = {method:"POST"};
  var removeResource = CALL_(path,callOptions);
  return removeResource;
}

/**
* Deletes a blocked number.
*
* @param {object} options Keypair of all optional parameters for this call
*/
function voice_clientDeleteBlockedNumber(options){
  var path = buildUrl_("voiceclient/blockednumbers/delete",options);
  var callOptions = {method:"POST"};
  var removeResource = CALL_(path,callOptions);
  return removeResource;
}

/**
* Permanently deletes conversation(s) specified.
*
* @param {object} options Keypair of all optional parameters for this call
*/
function voice_clientDeleteConversation(options){
  var path = buildUrl_("voiceclient/conversation/delete",options);
  var callOptions = {method:"POST"};
  var removeResource = CALL_(path,callOptions);
  return removeResource;
}

/**
* Deallocates a handoff number
*
* @param {object} options Keypair of all optional parameters for this call
*/
function voice_clientDeleteHandoffNumber(options){
  var path = buildUrl_("handoffnumbers/delete",options);
  var callOptions = {method:"POST"};
  var removeResource = CALL_(path,callOptions);
  return removeResource;
}

/**
* Permanently deletes specified thread.
*
* @param {object} options Keypair of all optional parameters for this call
*/
function voice_clientDeleteThread(options){
  var path = buildUrl_("voiceclient/thread/delete",options);
  var callOptions = {method:"POST"};
  var removeResource = CALL_(path,callOptions);
  return removeResource;
}

/**
* Permanently deletes specified thread item.
*
* @param {object} options Keypair of all optional parameters for this call
*/
function voice_clientDeleteThreadItem(options){
  var path = buildUrl_("voiceclient/threaditem/delete",options);
  var callOptions = {method:"POST"};
  var removeResource = CALL_(path,callOptions);
  return removeResource;
}

/**
* Gets the encrypted parameter string for a product purchase.
*
* @param {object} options Keypair of all optional parameters for this call
*/
function voice_clientEncryptBuyFlowParameters(options){
  var path = buildUrl_("voiceclient/billing/encryptbuyflowparameters",options);
  var callOptions = {method:"POST"};
  var removeResource = CALL_(path,callOptions);
  return removeResource;
}

/**
* Get information about a user's account.
*
* @param {object} options Keypair of all optional parameters for this call
*/
function voice_clientGetAccount(options){
  var path = buildUrl_("voiceclient/account/get",options);
  var callOptions = {method:"POST"};
  var removeResource = CALL_(path,callOptions);
  return removeResource;
}

/**
* Gets the rate to call a given phone number.
*
* @param {object} options Keypair of all optional parameters for this call
*/
function voice_clientGetBillingRate(options){
  var path = buildUrl_("voiceclient/billing/billingrate/get",options);
  var callOptions = {method:"POST"};
  var removeResource = CALL_(path,callOptions);
  return removeResource;
}

/**
* Gets client access permission.
*
* @param {object} options Keypair of all optional parameters for this call
*/
function voice_clientGetClientAccessPermission(options){
  var path = buildUrl_("voiceclient/clientaccesspermission/get",options);
  var callOptions = {method:"POST"};
  var removeResource = CALL_(path,callOptions);
  return removeResource;
}

/**
* Gets high-level information about user's messages.
*
* @param {object} options Keypair of all optional parameters for this call
*/
function voice_clientGetMessagingInfo(options){
  var path = buildUrl_("voiceclient/messaginginfo/get",options);
  var callOptions = {method:"POST"};
  var removeResource = CALL_(path,callOptions);
  return removeResource;
}

/**
* Get MMS attachments.
*
* @param {object} options Keypair of all optional parameters for this call
*/
function voice_clientGetMmsAttachment(options){
  var path = buildUrl_("voiceclient/attachments/get",options);
  var callOptions = {method:"POST"};
  var removeResource = CALL_(path,callOptions);
  return removeResource;
}

/**
* Returns a list of calling rates for different destinations.
*
* @param {object} options Keypair of all optional parameters for this call
*/
function voice_clientGetRateTable(options){
  var path = buildUrl_("voiceclient/billing/ratetable/get",options);
  var callOptions = {method:"POST"};
  var removeResource = CALL_(path,callOptions);
  return removeResource;
}

/**
* Gets a recording from the server.
*
* @param {object} options Keypair of all optional parameters for this call
*/
function voice_clientGetRecording(options){
  var path = buildUrl_("voiceclient/recordings/get",options);
  var callOptions = {method:"POST"};
  var removeResource = CALL_(path,callOptions);
  return removeResource;
}

/**
* Gets system message.
*
* @param {object} options Keypair of all optional parameters for this call
*/
function voice_clientGetSystemMessage(options){
  var path = buildUrl_("voiceclient/systemmessage/get",options);
  var callOptions = {method:"POST"};
  var removeResource = CALL_(path,callOptions);
  return removeResource;
}

/**
* Gets high-level information about user's threads.
*
* @param {object} options Keypair of all optional parameters for this call
*/
function voice_clientGetThreadingInfo(options){
  var path = buildUrl_("voiceclient/threadinginfo/get",options);
  var callOptions = {method:"POST"};
  var removeResource = CALL_(path,callOptions);
  return removeResource;
}

/**
* Inserts a blocked number.
*
* @param {object} options Keypair of all optional parameters for this call
*/
function voice_clientInsertBlockedNumber(options){
  var path = buildUrl_("voiceclient/blockednumbers/insert",options);
  var callOptions = {method:"POST"};
  var removeResource = CALL_(path,callOptions);
  return removeResource;
}

/**
* Lists the transactions.
*
* @param {object} options Keypair of all optional parameters for this call
*/
function voice_clientListBillingTransactions(options){
  var path = buildUrl_("voiceclient/billing/transaction/list",options);
  var callOptions = {method:"POST"};
  var removeResource = CALL_(path,callOptions);
  return removeResource;
}

/**
* Lists blocked numbers.
*
* @param {object} options Keypair of all optional parameters for this call
*/
function voice_clientListBlockedNumbers(options){
  var path = buildUrl_("voiceclient/blockednumbers/list",options);
  var callOptions = {method:"POST"};
  var removeResource = CALL_(path,callOptions);
  return removeResource;
}

/**
* Returns a list of countries with special billing rules.
*
* @param {object} options Keypair of all optional parameters for this call
*/
function voice_clientListSpecialRulesBillingCountries(options){
  var path = buildUrl_("voiceclient/billing/specialrulesbillingcountries/list",options);
  var callOptions = {method:"POST"};
  var removeResource = CALL_(path,callOptions);
  return removeResource;
}

/**
* Marks all user's threads as read.
*
* @param {object} options Keypair of all optional parameters for this call
*/
function voice_clientMarkAllThreadsRead(options){
  var path = buildUrl_("voiceclient/thread/markallread",options);
  var callOptions = {method:"POST"};
  var removeResource = CALL_(path,callOptions);
  return removeResource;
}

/**
* Determine the next step required to configure a user's account.
*
* @param {object} options Keypair of all optional parameters for this call
*/
function voice_clientOnboardUser(options){
  var path = buildUrl_("voiceclient/onboarding/onboarduser",options);
  var callOptions = {method:"POST"};
  var removeResource = CALL_(path,callOptions);
  return removeResource;
}

/**
* Refunds a call.
*
* @param {object} options Keypair of all optional parameters for this call
*/
function voice_clientRefundCall(options){
  var path = buildUrl_("voiceclient/billing/refundcall",options);
  var callOptions = {method:"POST"};
  var removeResource = CALL_(path,callOptions);
  return removeResource;
}

/**
* Re-reserves the proxy numbers intended for a user's forwarding phone. The retrieved numbers should not be used past the expiration time returned in the response.
*
* @param {object} options Keypair of all optional parameters for this call
*/
function voice_clientRereserveAllProxyNumbers(options){
  var path = buildUrl_("voiceclient/proxynumbers/rereserveall",options);
  var callOptions = {method:"POST"};
  var removeResource = CALL_(path,callOptions);
  return removeResource;
}

/**
* Reserve a proxy number to place a call from one of the user's forwarding phones or applicable verified phone number. The retrieved number specifies the proxy number to call for a specific destination in order to be placed using the caller's preferred Google Voice number or verified phone number as caller ID. The retrieved number should not be used past the expiration time returned in the response.
*
* @param {object} options Keypair of all optional parameters for this call
*/
function voice_clientReserveProxyNumber(options){
  var path = buildUrl_("proxynumbers/reserve",options);
  var callOptions = {method:"POST"};
  var removeResource = CALL_(path,callOptions);
  return removeResource;
}

/**
* Search for available account phone.
*
* @param {object} options Keypair of all optional parameters for this call
*/
function voice_clientSearchAccountPhoneCandidates(options){
  var path = buildUrl_("voiceclient/accountphonecandidate/search",options);
  var callOptions = {method:"POST"};
  var removeResource = CALL_(path,callOptions);
  return removeResource;
}

/**
* Searches available Google Voice phone numbers (by providing search criteria) to assign to an account.
*
* @param {object} options Keypair of all optional parameters for this call
*/
function voice_clientSearchAvailableGvNumbers(options){
  var path = buildUrl_("setup/availablegvnumbers/search",options);
  var callOptions = {method:"POST"};
  var removeResource = CALL_(path,callOptions);
  return removeResource;
}

/**
* Starts click-to-call flow.
*
* @param {object} options Keypair of all optional parameters for this call
*/
function voice_clientStartClickToCall(options){
  var path = buildUrl_("voiceclient/communication/startclicktocall",options);
  var callOptions = {method:"POST"};
  var removeResource = CALL_(path,callOptions);
  return removeResource;
}

/**
* Starts a verification challenge. Client will receive a code that should be sent to the server in a subsequent VerifyPhone request.
*
* @param {object} options Keypair of all optional parameters for this call
*/
function voice_clientStartVerificationChallenge(options){
  var path = buildUrl_("voiceclient/phoneverification/startchallenge",options);
  var callOptions = {method:"POST"};
  var removeResource = CALL_(path,callOptions);
  return removeResource;
}

/**
* Update information about a user's account.
*
* @param {object} options Keypair of all optional parameters for this call
*/
function voice_clientUpdateAccount(options){
  var path = buildUrl_("voiceclient/account/update",options);
  var callOptions = {method:"POST"};
  var removeResource = CALL_(path,callOptions);
  return removeResource;
}

/**
* Updates conversation attributes.
*
* @param {object} options Keypair of all optional parameters for this call
*/
function voice_clientUpdateConversationAttributes(options){
  var path = buildUrl_("voiceclient/conversationattributes/update",options);
  var callOptions = {method:"POST"};
  var removeResource = CALL_(path,callOptions);
  return removeResource;
}

/**
* Modifies properties of an existing handoff number mapping, e.g. phone number, contact address and client data
*
* @param {object} options Keypair of all optional parameters for this call
*/
function voice_clientUpdateHandoffNumber(options){
  var path = buildUrl_("handoffnumbers/update",options);
  var callOptions = {method:"POST"};
  var removeResource = CALL_(path,callOptions);
  return removeResource;
}

/**
* Updates conversation attributes.
*
* @param {object} options Keypair of all optional parameters for this call
*/
function voice_clientUpdateThreadAttributes(options){
  var path = buildUrl_("voiceclient/thread/updateattributes",options);
  var callOptions = {method:"POST"};
  var removeResource = CALL_(path,callOptions);
  return removeResource;
}

/**
* Determines if an emergency address is a valid address.
*
* @param {object} options Keypair of all optional parameters for this call
*/
function voice_clientVerifyEmergencyAddress(options){
  var path = buildUrl_("voiceclient/emergencyaddress/verifyemergencyaddress",options);
  var callOptions = {method:"POST"};
  var removeResource = CALL_(path,callOptions);
  return removeResource;
}

/**
* Verifies the phone for the user. If the phone is not already associated with the user's account, adds it to the user's account.
*
* @param {object} options Keypair of all optional parameters for this call
*/
function voice_clientVerifyPhone(options){
  var path = buildUrl_("voiceclient/phoneverification/verify",options);
  var callOptions = {method:"POST"};
  var removeResource = CALL_(path,callOptions);
  return removeResource;
}

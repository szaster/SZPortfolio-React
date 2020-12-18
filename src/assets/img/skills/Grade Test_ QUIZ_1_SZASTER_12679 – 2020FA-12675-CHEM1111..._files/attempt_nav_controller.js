var theAttemptNavController;  // one per grading page
var attempt_nav_controller = {};

/**
 * This module contains an object that supports client-side functions in assisting the java-based
 * AttemptNavController in attempt navigation control while doing sequential grading operations.
 *
 * Since 9.1 - as of 9.1SP3, the nav control functionality has been moved to java
 *
 * brichard
 */

attempt_nav_controller.stealSubmitButtons = function()
{
  //TODO: Delete the following relate to top_submitButtonRow 
  //after floating bottom submit proven works.
  var topButtons = $('top_submitButtonRow');
  var navButtons = $('navStatusPanelButtons');
  if (navButtons && topButtons)
  {
    navButtons.update(topButtons);
  }
  var bottomNavButtons = $('navStatusPanelButtons_bottom');
  var bottomButtons = $('bottom_submitButtonRow');
  if (bottomNavButtons && bottomButtons)
  {
    bottomNavButtons.update(bottomButtons);
  }
};

attempt_nav_controller.increaseContainerSize = function()
{
  var container = $('containerdiv');
  if (container)
  {
    Element.addClassName(container, "attemptNavContainer");
  }
};

var AttemptNavController = Class.create();
AttemptNavController.prototype = {
    initialize: function( gradingUrl, options ) {

  this.options = (options) ? options : {};
  this.formElementsToIgnore = this.options.formElementsToIgnore;
  var params = window.location.search.parseQuery();
  this.courseId = params.course_id;
  this.sequenceId = params.sequenceId;
  // Indicates if the request is in anonymous mode
  this.anonymousMode = params.anonymousMode && params.anonymousMode == 'true';
  // Course Membership Id contained in the request - will only be present for non anonymous grading items
  this.courseMembershipId = params.courseMembershipId;
  this.source = params.source;
  this.navigationEnabled = true;
  this.submittedAlready = false;
  this.receiptMsgArgs = '';
  // LRN-50798 For attempts with NEEDS_GRADING status, the 'isDraftGrade' flag allows to skip
  // submitting the data when going through "Save and Next" ONLY when there were no changes
  // in the form AND there is no grade saved as draft (see saveAndNext() function below.)
  // In other words, if you create a field on your page named 'isDraftGrade' with a value of
  // 'true' and the user clicks on 'Save and Next' without changing anything in the form, then
  // the save action will still be performed as though they had changed something. This
  // will effectively turn the draft grade into a real grade. If your tool  wants to retain
  // the draft status in this case then you must deal with that yourself.
  this.isDraftGrade = $( 'isDraftGrade' ) !== null && $( 'isDraftGrade' ).value == 'true';

  if ( this.source =='cp_gradebook' )
  {
    this.model = Gradebook.getModel();
  }

  this.exitGradingUrl = gradingUrl + '&cmd=exit';
  this.prevGradingUrl = gradingUrl + '&cmd=prev';
  this.nextGradingUrl = gradingUrl + '&cmd=next';
  this.gotoUrl = gradingUrl + '&cmd=goto';
  this.toggleAnonymousModeUrl = gradingUrl + '&cmd=toggleAnonymousMode';

  var gradeAnonButton = $('gradeAnonymousButton');
  if (gradeAnonButton)
  {
    Event.observe(gradeAnonButton,'click', this.gradeAnonymously.bindAsEventListener(this));
  }
  Event.observe('jumpToButton','click', this.gotoSelectedAttempt.bindAsEventListener(this));
  if ( $('userSelect') )
  {
    Event.observe('userSelect','change', this.loadAttemptSelect.bindAsEventListener(this));
  }
  Event.observe('itemSelect','change', this.loadUserSelect.bindAsEventListener(this));

  this.Buttons = [ $('saveAndNextButton'), $('viewPreviousButton'), $('cancelButton'), $('cancelButton_bottom')];

  // find the form relative to the bottom cancel button.
  var cancelButtons = $$('input[onclick*=cancel]');
  if ( cancelButtons.length > 0 )
  {
    // Get the last cancel button as it is the most likely to be inside the form
    // TODO: pass in form id directly rather than guessing at it.
    var formCandidate = $(cancelButtons[ cancelButtons.length-1 ]).up('form');
    if (formCandidate)
    {
      // Do not use the blogGradingForm here - it doesn't behave as per test/assignment forms
      if (formCandidate.id != 'blogGradingForm')
      {
        this.form = formCandidate;
      }
    }
    if (this.form)
    {
      Event.observe(window,'beforeunload',this.onBeforeUnload.bindAsEventListener(this));
    }
  }

  if (this.form) // Interactive tools don't have a standard form to work with this controller this way
  {
    // set cancelGradeUrl to account for form submit via enter key press in form element
    if ( !this.form.cancelGradeUrl )
    {
      this.form.insert({bottom:new Element('input',{'type':'hidden','name':'cancelGradeUrl'})});
    }
    this.form.cancelGradeUrl.value = this.nextGradingUrl;

    if ( typeof(initEditors) == "function" )
    {
      // In case we run before initEditors... call it now
      initEditors();
    }
    if ( typeof(finalizeEditors) == "function" )
    {
      // Finalize editors sometimes does 'funky' stuff with empty text boxes - do it before taking the
      // initial snapshot of the form to record the modified version
      finalizeEditors();
    }
    this.originalFormData = this.form.serialize(true);
  }

  // grading button allows toggling between anonymous & named grading modes
  if (gradeAnonButton)
  {
    var anonButTxt = page.bundle.getString("attempt.nav.grade.anonymous.attempts");
    var normButTxt = page.bundle.getString("attempt.nav.grade.named.attempts");
    gradeAnonButton.update(this.anonymousMode?normButTxt:anonButTxt);
  }

  this._loadColumnSelect();

},

onBeforeUnload: function( e )
{
  if ( this.originalFormData === null )
  {
    return;
  }
  if ( typeof(finalizeEditors) == "function" )
  {
    finalizeEditors();
  }
  // form data has changed, warn the user before they leave.
  if ( this.hasFormDataChanged() )
  {
    var msg = page.bundle.getString("attempt.nav.attempts.uncommitedchange.error");

    e = e || window.event;
    if (typeof(e) != 'undefined')
    {
      e.returnValue = msg;
    }
    // We have to allow submitting the form again in case the user decides to stay on the page not submitting the form at this time
    // Note: we are basically allowing double submit here because where the user decides whether to stay on the page or not is beyond
    // this point and the user's decision not to submit the form just stops the submitting event and we don't get that result back.
    // This will only impact negatively when there isn't a responsive from the server in a reasonable amount of time and the user tries
    // to somehow submit the same form again.
    window.doubleSubmit.allowSubmitAgainForForm( this.form );
    return msg;
  }
},

cancel: function()
{
  if ( !this.canILeaveThisPage(false))
  {
    return false;
  }
  this.clearOriginalFormData();
  document.location = this.exitGradingUrl;
  return false;
},

viewPrevious: function()
{
  if ( !this.canILeaveThisPage(false))
  {
    return false;
  }
  document.location = this.prevGradingUrl + this.appendCurrentAttemptIndex();
},

viewNext: function()
{
  if ( !this.canILeaveThisPage(false))
  {
    return false;
  }

  document.location = this.nextGradingUrl + this.appendCurrentAttemptIndex() + this.receiptMsgArgs;
},

appendCurrentAttemptIndex: function()
{
  var currentAttemptIndex = $( 'currentAttemptIndex' );
  return currentAttemptIndex ? '&currentAttemptIndex='+currentAttemptIndex.value : '';
},

canILeaveThisPage: function (saving)
{
  if ( !this.navigationEnabled )
  {
    var msg = page.bundle.getString("attempt.nav.collab.grading.changed");
    if (this.saveGradeCallback && this.saveGradeCallback !== null)
    {
      if (!this.saveGradeCallback(saving))
      {
        alert(msg);
        return false;
      }
    }
    else
    {
      alert(msg);
      return false;
    }
  }
  return true;
},

saveAndExit: function( onSubmit )
{
  if ( !this.canILeaveThisPage(true))
  {
    return false;
  }
  if ( onSubmit && !onSubmit() )
  {
    return false;
  }
  this.clearOriginalFormData();
  this.form.cancelGradeUrl.value = this.exitGradingUrl;
  this.form.submit();
  return false;
},

saveAndNext: function( onSubmit )
{
  if ( !this.canILeaveThisPage(true))
  {
    return false;
  }
  if ( this.disabledSaveAndNext )
  {
    return false; // prevent double click issues
  }
  if ( typeof(finalizeEditors) == "function" )
  {
    // make sure VTBE content is pushed into regular form inputs
    finalizeEditors();
  }
  // if this is a survey and the attempt was submitted after the due date, we need to submit so the attempt status is updated to COMPLETED
  var isSurveyWithLateSubmission = this.form && // LRN-85523 'this.form' will be undefined if we come from Needs Grading page
                                     this.form.isSurveyWithLateSubmission &&
                                     this.form.isSurveyWithLateSubmission.value == "true";
  if ( !isSurveyWithLateSubmission && !this.hasFormDataChanged() && !this.isDraftGrade )
  {
    // LRN-50798 For attempts with NEEDS_GRADING status, skip the submit only
    // when there were no changes in the form and there was no grade saved as draft
    this.viewNext();
    this.disabledSaveAndNext = true;
    return false;
  }
  if ( onSubmit && !onSubmit() )
  {
    return false;
  }
  this.clearOriginalFormData();
  this.disabledSaveAndNext = true;
  this.form.cancelGradeUrl.value = this.nextGradingUrl;
  this.form.submit();
  return false;
},

enableNavigation: function() {
  this.navigationEnabled = true;
  this.saveGradeCallback = null;
  //TODO: we will need to enable the 'Jump to..' button as well
  if ( this.Buttons.length >0 )
  {
   this.Buttons.each( function( button ) {
   Element.removeClassName( button, 'disabled');
   Element.addClassName( button, 'enabled');
   });
  }
},
disableNavigation: function(saveGradeCallback){
  this.navigationEnabled = false;
  this.saveGradeCallback = saveGradeCallback;
  //TODO: we will need to disable the 'Jump to..' button as well
   if ( this.Buttons.length >0 )
   {
    this.Buttons.each( function( button ) {
      Element.removeClassName( button, 'enabled');
      Element.addClassName( button, 'disabled');
    });
   }
},
hasFormDataChanged: function( ){
  if ( this.originalFormData === null || !this.form )
  {
    return false;
  }
  var origFormData = new Hash( this.originalFormData );
  var currFormData = new Hash( this.form.serialize(true) );
  var dataChanged = false;
  if ( this.formElementsToIgnore )
  {
    this.formElementsToIgnore.split(',').each( function(e){
      origFormData.unset(e);
      currFormData.unset(e);
    });
  }
  return origFormData.toQueryString() != currFormData.toQueryString();
},

clearOriginalFormData: function( ){
    this.originalFormData = null;
},

gradeAnonymously: function( ){
  // prompt the user that changing modes will reload the page and changes will be lost
  var anonMsg = page.bundle.getString("attempt.nav.to.anonymous.mode.msg");
  var normMsg = page.bundle.getString("attempt.nav.from.anonymous.mode.msg");
  if(!confirm(this.anonymousMode ? normMsg : anonMsg))
  {
    return;
  }

  var url = this.toggleAnonymousModeUrl;
  if ( this.courseMembershipId )
  {
    url += "&courseMembershipId=" + this.courseMembershipId;
  }

  document.location = url;
},

// Jump To button
gotoSelectedAttempt: function( ){
  var itemId = $( 'itemSelect' ).value;
  var isAnonymous = $( 'isAnonymous' ).value;
  var userId = $( 'userSelect' ).value;

  var attemptId;
  if ( $( 'attemptSelect' ) && $( 'attemptSelect' ).visible() )
  {
    attemptId = $( 'attemptSelect' ).value;
  }

  if ( itemId === "-1" || userId === "-1" || ( attemptId === "-1" && isAnonymous === "false" ) )
  {
    return;
  }

  // If the selected item is true anonymous grading, attemptId is the userId
  if ( isAnonymous === "true" )
  {
    attemptId = userId;
  }

  var url = this.gotoUrl + '&itemId=' + itemId;
  if ( attemptId )
  {
    url += "&attemptId=" + attemptId;
  }
  if ( this.anonymousMode )
  {
    url += "&anonymousMode=true";
  }
  if ( this.courseMembershipId )
  {
    url += "&courseMembershipId=" + this.courseMembershipId;
  }

  document.location = url;
},

addMaskNumber: function ( index )
{
  var resultMask = "";
  index +="";
  // numbers follow this pattern: 1->0001, 10->0010, 100->0100
  var addIndex = 4 - index.length;
  for ( var i=1; i<= addIndex;i++)
  {
    resultMask += "0";
  }
  resultMask = resultMask+index;
  return resultMask;
},

_loadColumnSelect: function( ){

  this._loadSelect( 'itemSelect');

  // disable the user & attempt selects until a column is selected
  if ( $('userSelect') )
    $('userSelect').disabled = true;
  if ( $('attemptSelect') )
    $('attemptSelect').disabled = true;

},

// used by _loadColumnSelect, _loadUserSelect, & _loadAttemptSelect
_loadSelect: function( selectId, itemId, userId, callback ){

  var url = '/webapps/gradebook/do/instructor/getAttemptNavData?course_id='+this.courseId+"&selectId="+selectId+"&sequenceId="+this.sequenceId;

  if ( itemId )
  {
    url += "&itemId=" + itemId;
  }
  if ( userId )
  {
    url += "&userId=" + userId;
  }
  new Ajax.Request( url,
  {
    method : 'get',
    onSuccess : ( callback ) ? callback : this._loadSelectCallBack,
    asynchronous : false,
    requestHeaders : [ 'cookie', document.cookie ]
  } );
},

_loadSelectCallBack: function( resp ){ // callback from getAttemptNavData
  var data = resp.responseText.evalJSON( true );
  var options = data.options;
  var select = $( data.selectId );
  var selectMsg = page.bundle.getString( "attempt.nav.jump.to.selected" );
  select.options[0] = new Option(selectMsg, -1);
  var option;
  // idx starts with 1 since we keep the initial -Select- option
  for (var i = 0, idx = 1; i < options.length; i++)
  {
    option = new Option( options[i].label, options[i].value );
    select.options[ idx++ ] = option;
  }

  // Check if the item is true anonymous grading. Update the hidden attribute for true anonymous grading accordingly
  if ( data.isAnonymous )
  {
    $( 'isAnonymous' ).value = "true";
  }
  else
  {
    $( 'isAnonymous' ).value = "false";
  }

  // For true anonymous grading item or item with anonymous mode ON, the attempt dropdown and its label are hidden
  // For item with anonymous mode (hide user names) ON, display the first item for user dropdown which is: Random User (Hide User Names is enabled) and disable it
  if ( data.isAnonymous || data.isHideUsernames )
  {
    $( 'attemptSelect' ).hide();
    $( 'attemptSelectLabel' ).hide();

    // If the request is to load user dropdown and the anonymous mode (hide user names) is ON, select the first option from the user dropdown
    if ( data.selectId == "userSelect" && !data.isAnonymous )
    {
      $( 'userSelect' ).options[ 1 ].selected = true;
      $( 'userSelect' ).disabled = true;
    }
  }
  else
  {
    $( 'attemptSelect' ).show();
    $( 'attemptSelectLabel' ).show();
  }

},

loadUserSelect: function( ){

  var userSelect = $('userSelect');
  var attemptSelect = $('attemptSelect');
  var itemId = $('itemSelect').value;

  // Reset user dropdown before populating
  if ( userSelect )
  {
    userSelect.options.length = 1;
    userSelect.value = -1;
    userSelect.disabled = (itemId == -1);
  }

  if ( itemId == -1 )
  {
    // Reset user dropdown before populating
    if ( attemptSelect )
    {
      attemptSelect.options.length = 1;
      attemptSelect.value = -1;
      attemptSelect.disabled = true;
    }
    return;
  }

  this._loadSelect( 'userSelect', itemId );

  // Prepare attempt dropdown - not required for true anonymous grading item or item with anonymous mode ON since its hidden
  if ( attemptSelect && ( $('isAnonymous').value === "false" && !this.anonymousMode ) )
  {
    attemptSelect.options.length = 1;
    attemptSelect.value = -1;
    attemptSelect.disabled = true;
    $('noAttempt').hide();
    attemptSelect.show();
  }
},

loadAttemptSelect: function( ){
  if ( $( 'isAnonymous' ).value === "false" )
  {
    var userSelect = $('userSelect');
    var itemSelect = $('itemSelect');
    var attemptSelect = $('attemptSelect');

    attemptSelect.options.length = 1; // clear out the old options, except for the first "-Select-" option
    var userId = userSelect.value;
    var itemId = itemSelect.value;
    if ( userId == -1 || itemId == -1 )
    {
      attemptSelect.value = -1;
      attemptSelect.disabled = true;
      return;
    }

    this._loadSelect( 'attemptSelect', itemId, userId, function( resp ){
      this._loadSelectCallBack( resp );

      if ( attemptSelect.options.length == 1 ) { // -Select- only?
          attemptSelect.hide();
          $('noAttempt').show();
        } else {
          attemptSelect.disabled = false;
          attemptSelect.show();
          $('noAttempt').hide();
        }

    }.bind(this));
  }
}
};

